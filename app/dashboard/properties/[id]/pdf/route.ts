import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { getProperty } from "@/app/dashboard/properties/actions";

export async function GET(req: Request, props: any) {
  try {
    const params = await props.params;
    const { id } = params;

    // 1. Obtener datos de la propiedad
    const property = await getProperty(id);

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // 2. Configurar Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Helpers para datos
    const mainImage = property.images?.[0] || "";
    const otherImages = property.images?.slice(1) || [];
    const price = property.price ? Number(property.price).toLocaleString("es-ES") + " €" : "Consultar";
    const date = new Date().toLocaleDateString("es-ES");

    // --- PLANTILLA HTML ESTILO "ALTERNATIVA MÁLAGA" ---
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: A4; margin: 0; }
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
          background: #fff;
          font-size: 12px;
        }
        
        /* Estructura de Páginas */
        .page {
          width: 210mm;
          height: 296.5mm; /* Ajuste fino para evitar hoja extra */
          position: relative;
          page-break-after: always;
          overflow: hidden;
        }
        .page-content {
          padding: 40px 50px;
          height: 100%;
          box-sizing: border-box;
        }

        /* Header y Footer en cada página */
        .header-logo {
          position: absolute;
          top: 40px;
          right: 50px;
          text-align: right;
          color: #0048BC; /* Color corporativo */
          font-weight: bold;
          font-size: 18px;
          line-height: 1.2;
        }
        .footer {
          position: absolute;
          bottom: 30px;
          left: 50px;
          right: 50px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
          display: flex;
          justify-content: space-between;
          color: #888;
          font-size: 10px;
        }

        /* PÁGINA 1: PORTADA */
        .cover-title {
          margin-top: 100px;
          font-size: 32px;
          color: #0048BC;
          font-weight: 300;
          line-height: 1.2;
          margin-bottom: 20px;
        }
        .cover-subtitle {
          font-size: 18px;
          color: #666;
          margin-bottom: 40px;
        }
        .cover-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 2px;
        }
        .cover-address {
          margin-top: 40px;
          font-size: 14px;
          color: #444;
          line-height: 1.6;
        }

        /* ESTILOS DE TABLAS (Páginas 2, 3...) */
        h2 {
          color: #0048BC;
          font-size: 16px;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
          margin-top: 40px;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .data-table td {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
          vertical-align: top;
        }
        .data-table td.label {
          font-weight: bold;
          color: #555;
          width: 40%;
        }
        .data-table td.value {
          color: #000;
          text-align: right;
        }

        /* TAGS / CARACTERÍSTICAS */
        .features-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .feature-tag {
          background: #f4f6f9;
          color: #333;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 11px;
          border: 1px solid #e1e4e8;
        }

        /* TEXTO DESCRIPCIÓN */
        .description-text {
          column-count: 2;
          column-gap: 40px;
          line-height: 1.6;
          text-align: justify;
        }

        /* GALERÍA DE FOTOS */
        .photo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 20px;
        }
        .photo-item img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
        }

        /* CAJA DEL AGENTE */
        .agent-box {
          background: #f9f9f9;
          padding: 30px;
          border-left: 4px solid #0048BC;
          margin-top: 40px;
        }
        .agent-name { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
        .agent-contact { font-size: 12px; color: #555; line-height: 1.6; }

      </style>
    </head>
    <body>

      <div class="page">
        <div class="page-content">
          <div class="header-logo">Regrow<br>Real Estate</div>
          
          <div class="cover-title">${property.title}</div>
          <div class="cover-subtitle">${property.city}, España</div>
          
          ${mainImage ? `<img src="${mainImage}" class="cover-image" />` : ''}

          <div class="cover-address">
            <strong>Precio:</strong> <span style="font-size: 24px; color: #0048BC;">${price}</span><br><br>
            <strong>Dirección:</strong><br>
            ${property.address || "Dirección bajo petición"}<br>
            ${property.zip_code || ""} ${property.city}
          </div>
        </div>
        
        <div class="footer">
          <span>Regrow Real Estate CRM</span>
          <span>Página 1</span>
        </div>
      </div>

      <div class="page">
        <div class="page-content">
          <div class="header-logo">Regrow<br>Real Estate</div>

          <h2>Datos del Inmueble</h2>
          <table class="data-table">
            <tr><td class="label">Referencia</td><td class="value">${property.reference || "-"}</td></tr>
            <tr><td class="label">Categoría</td><td class="value">${property.category || "-"}</td></tr>
            <tr><td class="label">Tipo de Inmueble</td><td class="value">${property.property_type || "-"}</td></tr>
            <tr><td class="label">Año de construcción</td><td class="value">${property.year_built || "-"}</td></tr>
            <tr><td class="label">Estado</td><td class="value">${property.condition || "-"}</td></tr>
            <tr><td class="label">Calidad Equipamiento</td><td class="value">${property.equipment_quality || "-"}</td></tr>
            <tr><td class="label">Comunidad (Mes)</td><td class="value">${property.community_fee ? property.community_fee + " €" : "-"}</td></tr>
            <tr><td class="label">IBI (Año)</td><td class="value">${property.property_tax ? property.property_tax + " €" : "-"}</td></tr>
            <tr><td class="label">Basura (Año)</td><td class="value">${property.garbage_fee ? property.garbage_fee + " €" : "-"}</td></tr>
            <tr><td class="label">Disponibilidad</td><td class="value">${property.availability || "Consultar"}</td></tr>
          </table>

          <h2>Superficies y Distribución</h2>
          <table class="data-table">
            <tr><td class="label">Dormitorios</td><td class="value">${property.bedrooms || "0"}</td></tr>
            <tr><td class="label">Baños</td><td class="value">${property.bathrooms || "0"}</td></tr>
            <tr><td class="label">Superficie Útil</td><td class="value">${property.usable_area ? property.usable_area + " m²" : "-"}</td></tr>
            <tr><td class="label">Superficie Construida</td><td class="value">${property.built_area ? property.built_area + " m²" : "-"}</td></tr>
            <tr><td class="label">Terraza</td><td class="value">${property.terrace_m2 ? property.terrace_m2 + " m²" : "-"}</td></tr>
            <tr><td class="label">Jardín</td><td class="value">${property.garden_m2 ? property.garden_m2 + " m²" : "-"}</td></tr>
            <tr><td class="label">Plantas</td><td class="value">${property.floors || "-"}</td></tr>
            <tr><td class="label">Plazas de Garaje</td><td class="value">${property.parking_spaces || "-"}</td></tr>
          </table>

        </div>
        <div class="footer">
          <span>${property.reference}</span>
          <span>Página 2</span>
        </div>
      </div>

      <div class="page">
        <div class="page-content">
          <div class="header-logo">Regrow<br>Real Estate</div>

          <h2>Descripción</h2>
          <div class="description-text">
            ${property.description || "Sin descripción disponible."}
          </div>

          <h2>Certificado Energético</h2>
          <table class="data-table">
            <tr><td class="label">Disponible</td><td class="value">${property.energy_certificate_available || "-"}</td></tr>
            <tr><td class="label">Clase Energética</td><td class="value"><strong>${property.energy_class || "-"}</strong></td></tr>
            <tr><td class="label">Consumo</td><td class="value">${property.energy_consumption_index || "-"}</td></tr>
            <tr><td class="label">Emisiones</td><td class="value">${property.heating_type || "-"}</td></tr>
          </table>

          <h2>Características Extra</h2>
          <div class="features-grid">
            ${(property.main_features || []).map((f: string) => `<span class="feature-tag">${f}</span>`).join("")}
          </div>

        </div>
        <div class="footer">
          <span>${property.reference}</span>
          <span>Página 3</span>
        </div>
      </div>

      ${otherImages.length > 0 ? `
      <div class="page">
        <div class="page-content">
          <div class="header-logo">Regrow<br>Real Estate</div>
          <h2>Galería de Fotos</h2>
          <div class="photo-grid">
            ${otherImages.slice(0, 6).map((img: string) => `
              <div class="photo-item"><img src="${img}" /></div>
            `).join('')}
          </div>
        </div>
        <div class="footer">
          <span>${property.reference}</span>
          <span>Página 4</span>
        </div>
      </div>
      ` : ''}

      <div class="page">
        <div class="page-content">
          <div class="header-logo">Regrow<br>Real Estate</div>

          <h2>Agente Encargado</h2>
          <div class="agent-box">
            <div class="agent-name">${property.agent_name || "Equipo Regrow"}</div>
            <div class="agent-contact">
              ${property.agent_address || "Oficina Central"}<br>
              Tel: ${property.agent_phone || "-"}<br>
              Email: ${property.agent_email || "-"}<br>
            </div>
          </div>

          <h2 style="margin-top: 50px;">Aviso Legal</h2>
          <p style="font-size: 10px; color: #777; text-align: justify;">
            Toda la información, incluidos los datos de los inmuebles proporcionados, proviene de terceros y no ha sido verificada independientemente. 
            Regrow Real Estate no asume responsabilidad por la exactitud de los datos. La oferta está sujeta a errores, cambios de precio, omisión y/o retirada del mercado sin previo aviso.
          </p>

        </div>
        <div class="footer">
          <span>Generado el ${date}</span>
          <span>Fin del documento</span>
        </div>
      </div>

    </body>
    </html>
    `;

    await page.setContent(html, { 
      waitUntil: "networkidle0",
      timeout: 60000 
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      // Los márgenes ya los manejamos con CSS en .page-content
      margin: { top: "0", bottom: "0", left: "0", right: "0" }, 
    });

    await browser.close();

    return new NextResponse(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        // 'inline' hace que se abra en el navegador, 'attachment' lo descarga directo
        "Content-Disposition": `inline; filename="property-${property.reference || id}.pdf"`,
      },
    });

  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF." }, 
      { status: 500 }
    );
  }
}

