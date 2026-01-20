import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { getProperty } from "../../actions";

export async function GET(req: Request, { params }: any) {
  const { id } = params;
  const property = await getProperty(id);

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Si no hay imagen principal
  const mainImage = property.images?.[0] || "";

  const featuresHTML = (property.main_features || [])
    .map((f: string) => `<span class="tag">${f}</span>`)
    .join("");

  const html = `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 30px;
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
      }

      h1 {
        font-size: 28px;
        margin-bottom: 4px;
      }

      .price {
        font-size: 22px;
        margin-bottom: 20px;
        color: #444;
      }

      .hero {
        width: 100%;
        height: 260px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 20px;
        margin-top: 28px;
        border-bottom: 2px solid #ccc;
        padding-bottom: 4px;
      }

      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .label {
        font-weight: bold;
      }

      .tag {
        display: inline-block;
        padding: 6px 12px;
        background: #f1f1f1;
        margin: 4px 4px 0 0;
        border-radius: 6px;
      }

      footer {
        margin-top: 40px;
        text-align: center;
        font-size: 12px;
        color: #777;
      }
    </style>
  </head>

  <body>

    <h1>${property.title}</h1>
    <div class="price">${property.price.toLocaleString()} €</div>

    <img src="${mainImage}" class="hero" />

    <h2>General Information</h2>
    <div class="info-grid">
      <div><span class="label">Reference:</span> ${property.reference}</div>
      <div><span class="label">City:</span> ${property.city}</div>
      <div><span class="label">Country:</span> Spain</div>
      <div><span class="label">Category:</span> ${property.category || ""}</div>
      <div><span class="label">Type:</span> ${property.property_type || ""}</div>
    </div>

    <h2>Main Features</h2>
    <div>${featuresHTML}</div>

    <h2>Description</h2>
    <p>${property.description || ""}</p>

    <h2>Agent</h2>
    <p><strong>${property.agent_name || "N/A"}</strong></p>
    <p>${property.agent_phone || ""}</p>
    <p>${property.agent_email || ""}</p>

    <footer>
      Regrow Code Real Estate © 2025 — Property Brochure
    </footer>

  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", bottom: "20mm" },
  });

  // Convertimos el Buffer a Uint8Array (aceptado por NextResponse)
  const pdfUint8 = new Uint8Array(pdfBuffer);

  return new NextResponse(pdfUint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="property-${id}.pdf"`,
    },
  });
}
