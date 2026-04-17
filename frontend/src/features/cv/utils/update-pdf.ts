import jsPDF from "jspdf";
import type { CVEditorData } from "@/features/cv/types/update";

function ensurePageSpace(doc: jsPDF, currentY: number, neededHeight: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomMargin = 16;
  if (currentY + neededHeight <= pageHeight - bottomMargin) {
    return currentY;
  }

  doc.addPage();
  return 18;
}

function normalizePdfText(value: string): string {
  const compact = String(value || "").replace(/\s+/g, " ").trim();
  if (!compact) {
    return "";
  }

  const collapseRuns = compact.replace(/(?:\b[A-Za-z0-9]\b\s*){5,}/g, (match) => {
    const chars = match.trim().split(/\s+/).filter(Boolean);
    if (chars.length < 5) {
      return match;
    }

    const groups: string[] = [];
    let current = chars[0] || "";

    for (let i = 1; i < chars.length; i += 1) {
      const prev = chars[i - 1] || "";
      const next = chars[i] || "";
      const prevDigit = /\d/.test(prev);
      const nextDigit = /\d/.test(next);
      const startsUpperWord = /[a-z]/.test(prev) && /[A-Z]/.test(next);

      if (prevDigit !== nextDigit || startsUpperWord) {
        groups.push(current);
        current = next;
      } else {
        current += next;
      }
    }
    groups.push(current);
    return groups.join(" ");
  });

  // If OCR collapsed multiple lowercase words into one token, split around common connectors.
  return collapseRuns
    .split(" ")
    .map((token) => {
      if (token.length < 14 || !/[a-z]{10,}/.test(token) || /\d/.test(token)) {
        return token;
      }

      return token
        .replace(/(?<=[a-z])(and|the|with|for|from|into|using|site|company|project|internship)/g, " $1")
        .replace(/\s+/g, " ")
        .trim();
    })
    .join(" ");
}

function parseContact(items: string[]): string[] {
  const parsed = {
    phone: "",
    email: "",
    github: "",
    linkedin: "",
    address: "",
    other: [] as string[],
  };

  for (const raw of items) {
    const line = normalizePdfText(raw);
    if (!line) continue;

    if (/^(contact|phone)\s*:/i.test(line)) {
      parsed.phone = line.replace(/^(contact|phone)\s*:/i, "").trim();
      continue;
    }
    if (/^email\s*:/i.test(line)) {
      parsed.email = line.replace(/^email\s*:/i, "").trim();
      continue;
    }
    if (/^github\s*:/i.test(line)) {
      parsed.github = line.replace(/^github\s*:/i, "").trim();
      continue;
    }
    if (/^linkedin\s*:/i.test(line)) {
      parsed.linkedin = line.replace(/^linkedin\s*:/i, "").trim();
      continue;
    }
    if (/^(address|location)\s*:/i.test(line)) {
      parsed.address = line.replace(/^(address|location)\s*:/i, "").trim();
      continue;
    }

    parsed.other.push(line);
  }

  return [parsed.email, parsed.phone, parsed.linkedin, parsed.github, parsed.address, ...parsed.other].filter(Boolean);
}

export function downloadUpdatedCvPdf(data: CVEditorData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const left = 14;
  const right = pageWidth - 14;
  const contentWidth = right - left;
  let y = 18;

  const name = normalizePdfText(data.name) || "Your Name";
  const contactSection = data.sections.find((section) => section.key === "contact");
  const contactLines = parseContact(contactSection?.items || []);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  const nameLines = doc.splitTextToSize(name, 110);
  doc.text(nameLines, left, y);
  const nameBottom = y + nameLines.length * 7;

  let contactBottom = y;
  if (contactLines.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let cy = y;
    for (const line of contactLines) {
      const wrapped = doc.splitTextToSize(line, 80);
      y = ensurePageSpace(doc, cy, wrapped.length * 4.5 + 1);
      doc.text(wrapped, right, y, { align: "right" });
      cy = y + wrapped.length * 4.5 + 1;
    }
    contactBottom = cy;
  }

  y = Math.max(nameBottom, contactBottom) + 4;
  y = ensurePageSpace(doc, y, 6);
  doc.setDrawColor(160);
  doc.setLineWidth(0.6);
  doc.line(left, y, right, y);
  y += 8;

  const listStyleKeys = new Set(["skills", "languages", "certifications", "experience", "education", "projects"]);

  for (const section of data.sections) {
    if (section.key === "contact") {
      continue;
    }

    const items = section.items.map((item) => normalizePdfText(item)).filter(Boolean);
    if (!items.length) {
      continue;
    }

    const title = normalizePdfText(section.title) || "Section";

    y = ensurePageSpace(doc, y, 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(title.toUpperCase(), left, y);
    y += 6;

    if (section.key === "about") {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      for (const item of items) {
        const wrapped = doc.splitTextToSize(item, contentWidth);
        y = ensurePageSpace(doc, y, wrapped.length * 4.8 + 1);
        doc.text(wrapped, left, y);
        y += wrapped.length * 4.8 + 1.5;
      }
      y += 2;
      continue;
    }

    if (listStyleKeys.has(section.key)) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      for (const item of items) {
        const wrapped = doc.splitTextToSize(item, contentWidth - 8);
        y = ensurePageSpace(doc, y, wrapped.length * 4.8 + 1);
        doc.text("•", left, y);
        doc.text(wrapped, left + 5, y);
        y += wrapped.length * 4.8 + 1.2;
      }
      y += 2;
      continue;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    for (const item of items) {
      const wrapped = doc.splitTextToSize(item, contentWidth);
      y = ensurePageSpace(doc, y, wrapped.length * 4.8 + 1);
      doc.text(wrapped, left, y);
      y += wrapped.length * 4.8 + 1.2;
    }
    y += 2;
  }

  const fileName = `${(data.name || "updated-cv").replace(/\s+/g, "-").toLowerCase()}.pdf`;
  doc.save(fileName);
}
