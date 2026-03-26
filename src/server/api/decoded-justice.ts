import { randomUUID } from "node:crypto";
import { getCaseData, type DecodedJusticeRepository } from "@/server/decoded-justice/repository";
import { generateCasePacket } from "@/server/decoded-justice/case-packet.service";
import { generateCasePacketPdf } from "@/server/decoded-justice/pdf/generateCasePacketPdf";

export async function getCasePacketPayload(caseId: string, repository: DecodedJusticeRepository) {
  const data = await getCaseData(caseId, repository);
  return generateCasePacket(data);
}

export async function downloadCasePacketPdf(caseId: string, repository: DecodedJusticeRepository) {
  const packet = await getCasePacketPayload(caseId, repository);
  const pdfBuffer = await generateCasePacketPdf(packet);

  return {
    filename: `${packet.title.replace(/\s+/g, "-").toLowerCase()}-packet.pdf`,
    contentType: "application/pdf",
    buffer: pdfBuffer,
  };
}

export async function downloadCasePacketZip(caseId: string, repository: DecodedJusticeRepository) {
  const packet = await getCasePacketPayload(caseId, repository);

  return {
    filename: `${packet.title.replace(/\s+/g, "-").toLowerCase()}-packet.zip`,
    contentType: "application/zip",
    files: [
      { kind: "pdf", name: "case-packet.pdf" },
      ...packet.evidenceIndex.map((item) => ({ kind: "evidence", name: `${item.label}-${item.type}` })),
    ],
  };
}

export async function createSecureShareLink(caseId: string): Promise<{ shareUrl: string; expiresAt: string }> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

  return {
    shareUrl: `https://decodedjustice.app/share/${caseId}/${token}`,
    expiresAt,
  };
}
