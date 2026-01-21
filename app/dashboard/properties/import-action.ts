"use server";

import { createSupabaseServer } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import puppeteer from "puppeteer";
import path from "path";

export async function importFromIdealista(url: string) {
  if (!url.includes("idealista.com/inmueble/")) {
    return { success: false, error: "URL no válida. Debe ser de idealista." };
  }

  let browser;

  try {
    console.log("🚀 Iniciando navegador en modo EVASIÓN...");
    
    // 1. Configuración ANTI-DETECCIÓN
    browser = await puppeteer.launch({
      headless: false, // Visible
      defaultViewport: null,
      // Usamos un perfil temporal para guardar cookies (si resuelves un captcha una vez, te recordará)
      userDataDir: path.join(process.cwd(), 'tmp/chrome_profile'), 
      ignoreDefaultArgs: ['--enable-automation'], // Oculta la barra "Chrome is being controlled..."
      args: [
        '--start-maximized',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled', // <--- EL TRUCO CLAVE
        '--window-size=1920,1080'
      ]
    });

    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();

    // 2. User-Agent Rotativo (Usamos uno muy común)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

    // 3. Ocultar huellas de WebDriver extra
    await page.evaluateOnNewDocument(() => {
        // @ts-ignore
        const newProto = navigator.__proto__;
        delete newProto.webdriver;
        // @ts-ignore
        navigator.__proto__ = newProto;
    });

    console.log("🌐 Navegando...");
    // Aumentamos el tiempo de espera inicial para parecer más lentos/humanos
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // --- BLOQUE DE ESPERA ---
    // Si te sale el bloqueo, este código esperará.
    // Tienes 2 minutos para:
    // A) Si ves un CAPTCHA -> Resolverlo.
    // B) Si ves "Acceso Bloqueado" -> Cierra la ventana manual, espera 5 min e intenta con otra IP (reinicia router).
    try {
      console.log("⏳ Esperando contenido...");
      await page.waitForSelector('.info-data-price, .price-features__container, h1', { timeout: 120000 });
    } catch (e) {
      throw new Error("Timeout: No se pudo cargar el inmueble. Es posible que tu IP siga bloqueada.");
    }

    // Pequeña pausa "humana" antes de extraer
    await new Promise(r => setTimeout(r, 1500));

    // 4. Extraer datos
    const propertyDataRaw = await page.evaluate(() => {
      const getText = (selector: string) => document.querySelector(selector)?.textContent?.trim() || "";
      const getMeta = (prop: string) => document.querySelector(`meta[property="${prop}"]`)?.getAttribute("content") || "";
      
      const title = getText("h1") || getMeta("og:title") || "Inmueble importado";
      
      const priceRaw = document.querySelector(".info-data-price")?.textContent || 
                       document.querySelector(".price-features__container .price")?.textContent || "0";
      const price = parseInt(priceRaw.replace(/[^0-9]/g, "")) || 0;

      const description = document.querySelector(".comment")?.textContent?.trim() || getMeta("description") || "";
      
      // Imágenes (Lógica mejorada)
      let mainImage = getMeta("og:image");
      if (!mainImage || mainImage.includes("idealista-logo")) {
         const imgDom = document.querySelector('.main-image img') as HTMLImageElement;
         if(imgDom) mainImage = imgDom.src;
      }
      // Intentar sacar más fotos del grid
      const otherImages = Array.from(document.querySelectorAll('.grid-images img') || [])
        .map((img: any) => img.src || img.dataset.src) // Idealista usa lazy load
        .filter(src => src)
        .slice(0, 4);

      const images = mainImage ? [mainImage, ...otherImages] : [];

      // Dirección
      const address = document.querySelector("#headerMap li")?.textContent?.trim() || title;
      const city = address.split(",")[0] || "Desconocida";

      // Características
      const features = Array.from(document.querySelectorAll('.info-features span')).map(s => s.textContent);
      let bedrooms = 0;
      let area = 0;

      features.forEach(txt => {
        if(txt?.toLowerCase().includes('hab')) bedrooms = parseInt(txt) || 0;
        if(txt?.toLowerCase().includes('m²')) area = parseInt(txt) || 0;
      });

      return { title, price, description, images, address, city, bedrooms, usable_area: area };
    });

    await browser.close();

    // 5. Guardar
    if (propertyDataRaw.title.includes("Idealista") || propertyDataRaw.title.includes("Captcha")) {
        throw new Error("Se detectó bloqueo en el contenido extraído.");
    }

    const refMatch = url.match(/\/(\d+)\//);
    const reference = refMatch ? `ID-${refMatch[1]}` : `IMP-${Date.now()}`;

    const finalData = {
      ...propertyDataRaw,
      reference,
      status: "available",
      type: "apartment",
      headline: propertyDataRaw.title.substring(0, 150)
    };

    const supabase = await createSupabaseServer();
    const { data, error } = await supabase.from("properties").insert(finalData).select().single();

    if (error) throw error;

    revalidatePath("/dashboard/properties");
    return { success: true, id: data.id };

  } catch (error: any) {
    console.error("Puppeteer error:", error.message);
    if (browser) await browser.close();
    return { success: false, error: "Bloqueo persistente o error de conexión. Intenta más tarde." };
  }
}