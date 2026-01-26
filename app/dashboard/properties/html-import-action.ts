"use server";

import * as cheerio from "cheerio";
import { createSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function importFromHtml(htmlContent: string) {
  try {
    if (!htmlContent || htmlContent.length < 100) {
      return { success: false, error: "El contenido pegado es muy corto." };
    }

    const $ = cheerio.load(htmlContent);

    // 1. Título
    const title = $("h1").text().trim() || 
                  $('meta[property="og:title"]').attr("content") || 
                  "Propiedad Importada";

    // 2. Precio (Buscamos en varios lugares típicos de Idealista)
    let priceText = $(".info-data-price").text() || 
                    $(".price-features__container .price").text();
    
    // Si no lo encuentra en el DOM, buscamos en el script de configuración
    if (!priceText) {
        const scriptMatch = htmlContent.match(/price:\s*([\d\.]+)/);
        if (scriptMatch) priceText = scriptMatch[1];
    }

    const price = parseInt((priceText || "0").replace(/[^0-9]/g, "")) || 0;

    // 3. Descripción
    const description = $(".comment").text().trim()
                        .replace("Comentario del anunciante", "")
                        .replace("Español", "")
                        .trim() || 
                        $('meta[name="description"]').attr("content") || "";

    // 4. Ubicación
    const address = $("#headerMap li").first().text().trim() || 
                    $("#headerMap ul").text().trim() || 
                    title;
    const city = $("#headerMap li").last().text().trim().split(",")[0] || "Málaga";

    // --- 5. EXTRACCIÓN DE IMÁGENES HD (Lógica Nueva) ---
    let images: string[] = [];

    // A) Imagen Principal (Meta tag) - Para tener al menos una segura
    const ogImage = $('meta[property="og:image"]').attr("content");
    if (ogImage && !ogImage.includes("idealista-logo")) {
        images.push(ogImage);
    }

    // B) Rayos X: Buscar el objeto JSON oculto 'adMultimediasInfo'
    // Este objeto tiene todas las fotos en alta calidad
    $("script").each((_, el) => {
        const scriptText = $(el).html() || "";
        if (scriptText.includes("adMultimediasInfo") || scriptText.includes("imageDataService")) {
            // Usamos Regex para extraer las URLs de 'imageDataService'
            // Formato habitual: "imageDataService":"https://..."
            const matches = scriptText.match(/"imageDataService":"([^"]+)"/g);
            if (matches) {
                matches.forEach(match => {
                    // Limpiamos la cadena para dejar solo la URL
                    const url = match.replace('"imageDataService":"', '').replace('"', '');
                    if (!images.includes(url) && !url.includes("blur")) {
                        images.push(url);
                    }
                });
            }
        }
    });

    // C) Fallback (Si no encuentra el script, busca en el HTML visual)
    if (images.length <= 1) {
        $("img").each((_, el) => {
            const src = $(el).attr("data-src") || $(el).attr("src");
            if (src && src.includes("image.master") && !images.includes(src)) {
                images.push(src);
            }
        });
    }

    // Limitamos a 15 fotos para no saturar la base de datos
    images = [...new Set(images)].slice(0, 15);

    // 6. Habitaciones y Área
    let bedrooms = 0;
    let area = 0;
    // Buscamos texto como "3 hab." o "100 m²"
    $(".info-features span, .details-property_features li").each((_, el) => {
        const txt = $(el).text().toLowerCase();
        if (txt.includes("hab") || txt.includes("dorm")) bedrooms = parseInt(txt.replace(/\D/g, "")) || bedrooms;
        if (txt.includes("m²") || txt.includes("m2")) area = parseInt(txt.replace(/\D/g, "")) || area;
    });

    // 7. Referencia
    const refMatch = htmlContent.match(/txt-ref">([^<]+)</);
    const reference = refMatch ? refMatch[1].trim() : `IMP-${Date.now().toString().slice(-6)}`;

    // 8. Validación y Guardado
    if (price === 0 && images.length === 0) {
        return { success: false, error: "No se detectaron datos. Asegúrate de copiar el HTML completo (Ctrl+U)." };
    }

    const supabase = await createSupabaseServer();
    
    const { data, error } = await supabase
      .from("properties")
      .insert({
        title,
        headline: title.substring(0, 150),
        description: description.substring(0, 3000),
        price,
        city,
        address, // Guardamos la dirección completa
        images,
        bedrooms,
        usable_area: area,
        status: "available",
        reference,
        type: "apartment" // Por defecto
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/properties");
    return { success: true, id: data.id };

  } catch (error: any) {
    console.error("HTML Import Error:", error);
    return { success: false, error: "Error interno al procesar el HTML." };
  }
}