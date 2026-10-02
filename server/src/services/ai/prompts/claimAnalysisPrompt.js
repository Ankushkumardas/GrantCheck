function buildClaimAnalysisPrompt(applicationChunks, supportingDocsChunks = []) {
  const appChunksStr = applicationChunks.map(c => 
    `--- [Doc: ${c.documentName || 'draft-application.pdf'} | Page: ${c.pageNumber} | Section: ${c.section}] ---\n${c.text}`
  ).join('\n\n');

  const supChunksStr = supportingDocsChunks.length > 0
    ? supportingDocsChunks.map(c => 
        `--- [Doc: ${c.documentName} | Page: ${c.pageNumber} | Section: ${c.section}] ---\n${c.text}`
      ).join('\n\n')
    : 'No supporting documents provided.';

  return `You are a Grant Completeness Assistant specializing in evidence verification.
Your task is to identify key factual or numerical claims in the Draft Application that are NOT supported by the supplied supporting documents.

CRITICAL INSTRUCTIONS:
1. Focus on specific statistical claims (e.g. "We helped 10,000 students"), past financial figures, formal accreditations, or external partnerships stated in the application that lack corroborating documentation in the attachments.
2. Do NOT say "This claim is false" or "The applicant is lying".
3. Use objective, responsible wording such as "Potential unsupported claim" and "No supplied evidence was found supporting the stated number/metric in the attachments."
4. If no unsupported claims are detected, return an empty array {"claims": []}.
5. Return ONLY valid JSON in the exact structure below.

APPLICATION CONTENT:
${appChunksStr}

ATTACHED SUPPORTING DOCUMENTS:
${supChunksStr}

OUTPUT JSON FORMAT:
{
  "claims": [
    {
      "claimText": "Our previous program reached 10,000 students across 15 schools.",
      "source": {
        "document": "draft-application.pdf",
        "page": 2,
        "section": "Past Performance"
      },
      "reason": "No supplied evaluation report or supporting evidence was found confirming the stated 10,000 student reach."
    }
  ]
}`;
}

module.exports = { buildClaimAnalysisPrompt };
