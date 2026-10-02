function buildEvidenceMappingPrompt(requirements, applicationChunks, supportingDocsChunks = []) {
  const reqListStr = JSON.stringify(requirements.map(r => ({
    id: r.reqId || r.id,
    text: r.text,
    category: r.category,
    mandatory: r.mandatory
  })), null, 2);

  const appChunksStr = applicationChunks.map(c => 
    `--- [Doc: ${c.documentName || 'draft-application.pdf'} | Page: ${c.pageNumber} | Section: ${c.section}] ---\n${c.text}`
  ).join('\n\n');

  const supChunksStr = supportingDocsChunks.length > 0 
    ? supportingDocsChunks.map(c => 
        `--- [Doc: ${c.documentName} | Page: ${c.pageNumber} | Section: ${c.section}] ---\n${c.text}`
      ).join('\n\n')
    : 'No additional supporting documents provided.';

  return `You are a specialized Grant Completeness AI Assistant.
Your task is to map each grant requirement against the supplied Draft Application and Supporting Documents.

CRITICAL RULES:
1. Allowed statuses for each requirement mapping:
   - "SUPPORTED": The supplied documents clearly and specifically satisfy the requirement.
   - "WEAK": Relevant evidence exists, but lacks required detail, specificity, or metrics.
   - "AMBIGUOUS": Evidence exists, but its wording, meaning, or applicability is unclear or conflicting.
   - "MISSING": No relevant evidence was found anywhere in the supplied documents.
2. NEVER invent or assume facts not present in the text.
3. If status is "MISSING", "evidence" array MUST be empty [].
4. If status is "SUPPORTED", "WEAK", or "AMBIGUOUS", you MUST include exact citation snippets with document name, page number, section, and the quoted text. Multiple evidence pieces across application and supporting documents are supported.
5. Provide a neutral "reason" explaining the mapping (e.g. "The application explicitly confirms nonprofit status on page 2.").
6. Do NOT make authoritative legal or funding eligibility determinations. Use completeness terminology.
7. Return ONLY valid JSON in the exact structure below.

REQUIREMENTS TO EVALUATE:
${reqListStr}

DRAFT APPLICATION CONTENT:
${appChunksStr}

SUPPORTING DOCUMENTS CONTENT:
${supChunksStr}

OUTPUT JSON FORMAT:
{
  "mappings": [
    {
      "requirementId": "REQ-001",
      "status": "SUPPORTED",
      "evidence": [
        {
          "document": "draft-application.pdf",
          "page": 2,
          "section": "Organization Background",
          "text": "ABC Foundation is a registered 501(c)(3) nonprofit organization."
        }
      ],
      "reason": "The application explicitly states the organization is a registered nonprofit."
    }
  ]
}`;
}

module.exports = { buildEvidenceMappingPrompt };
