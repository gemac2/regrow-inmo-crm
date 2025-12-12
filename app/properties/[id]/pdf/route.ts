import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { getProperty } from "../../actions";
import { supabaseBrowser } from "@/lib/supabase";

export async function GET(req: Request, { params }: any) {
  const { id } = await params; //
    const property = await getProperty(id);

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const html = `
  <html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
    }

    /* PORTADA COMPLETA */
    .cover {
      height: 100vh;
      width: 100%;
      background: linear-gradient(135deg, #0048BC, #00F5A5);
      color: white;
      text-align: center;
      padding-top: 60px;
      box-sizing: border-box;
    }

    .cover-logo {
      width: 200px;
      margin: 0 auto 30px;
    }

    .cover-title {
      font-size: 42px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .cover-price {
      font-size: 32px;
      margin-bottom: 40px;
    }

    .hero {
      width: 80%;
      height: 350px;
      object-fit: cover;
      border-radius: 12px;
      margin: 0 auto;
      display: block;
      border: 4px solid rgba(255,255,255,0.6);
    }

    .page {
      padding: 40px;
      box-sizing: border-box;
    }

    .section-title {
      font-size: 24px;
      font-weight: bold;
      margin: 25px 0 15px;
      color: #0048BC;
      border-left: 6px solid #00F5A5;
      padding-left: 12px;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .label {
      font-weight: bold;
      color: #0048BC;
    }

    .tag {
      display: inline-block;
      background: #e0f7f5;
      padding: 8px 14px;
      border-radius: 20px;
      color: #0048BC;
      font-size: 14px;
      margin: 6px;
      border: 1px solid #00F5A5;
    }

    .footer {
      margin-top: 60px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }

    .agent-box {
      background: #f6faff;
      padding: 18px;
      border-radius: 10px;
      border: 1px solid #d1e5ff;
      width: 60%;
    }
  </style>
</head>

<body>

  <!-- PORTADA -->
  <div class="cover">
    <!-- LOGO -->
    <img src="{{LOGO_BASE64}}" class="cover-logo" />

    <div class="cover-title">{{TITLE}}</div>
    <div class="cover-price">{{PRICE}} €</div>

    <img src="{{IMAGE}}" class="hero" />
  </div>

  <!-- PÁGINA 2 -->
  <div class="page">

    <!-- GENERAL INFO -->
    <div class="section-title">Property Information</div>
    <div class="grid">
      <div><span class="label">Reference:</span> {{REFERENCE}}</div>
      <div><span class="label">City:</span> {{CITY}}</div>
      <div><span class="label">Country:</span> Spain</div>
      <div><span class="label">Category:</span> {{CATEGORY}}</div>
      <div><span class="label">Type:</span> {{TYPE}}</div>
    </div>

    <!-- FEATURES -->
    <div class="section-title">Main Features</div>
    <div>{{FEATURES}}</div>

    <!-- DESCRIPTION -->
    <div class="section-title">Description</div>
    <p>{{DESCRIPTION}}</p>

    <!-- AGENT -->
    <div class="section-title">Agent</div>
    <div class="agent-box">
      <p><strong>{{AGENT_NAME}}</strong></p>
      <p>{{AGENT_PHONE}}</p>
      <p>{{AGENT_EMAIL}}</p>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      Regrow Code Real Estate © 2025 — Professional Property Brochure
    </div>

  </div>

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