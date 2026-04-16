import type { ContactFields } from "../types/types";

export function parseContact(items: string[]): ContactFields {
  const result: ContactFields = {
    contact: "",
    email: "",
    github: "",
    linkedin: "",
    address: "",
    other: [],
  };

  for (const item of items) {
    const value = item.trim();
    if (!value) {
      continue;
    }

    if (/^(contact|phone)\s*:/i.test(value)) {
      result.contact = value.replace(/^(contact|phone)\s*:/i, "").trim();
      continue;
    }
    if (/^email\s*:/i.test(value)) {
      result.email = value.replace(/^email\s*:/i, "").trim();
      continue;
    }
    if (/^github\s*:/i.test(value)) {
      result.github = value.replace(/^github\s*:/i, "").trim();
      continue;
    }
    if (/^linkedin\s*:/i.test(value)) {
      result.linkedin = value.replace(/^linkedin\s*:/i, "").trim();
      continue;
    }
    if (/^(address|location)\s*:/i.test(value)) {
      result.address = value.replace(/^(address|location)\s*:/i, "").trim();
      continue;
    }

    result.other.push(value);
  }

  return result;
}

export function buildContact(fields: ContactFields): string[] {
  const next: string[] = [];
  if (fields.contact.trim()) next.push(`Contact: ${fields.contact.trim()}`);
  if (fields.email.trim()) next.push(`Email: ${fields.email.trim()}`);
  if (fields.github.trim()) next.push(`Github: ${fields.github.trim()}`);
  if (fields.linkedin.trim()) next.push(`LinkedIn: ${fields.linkedin.trim()}`);
  if (fields.address.trim()) next.push(`Address: ${fields.address.trim()}`);
  next.push(...fields.other.map((item) => item.trim()).filter(Boolean));
  return next;
}
