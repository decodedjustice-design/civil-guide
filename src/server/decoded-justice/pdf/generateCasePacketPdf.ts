import puppeteer from "puppeteer";
import type { CasePacketData } from "@/features/decoded-justice/types";
import { renderCasePacketHtml } from "./template";

export async function generateCasePacketPdf(packet: CasePacketData): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.setContent(renderCasePacketHtml(packet), { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "12mm", bottom: "20mm", left: "12mm" },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
