function buildRequirementExtractionPrompt(guidelineChunks, originalFileName = 'guideline.pdf') {
  const formattedChunks = guidelineChunks.map(c => 
    `--- [Doc: ${originalFileName} | Page: ${c.pageNumber} | Section: ${c.section}] ---\n${c.text}`
  ).join('\n\n');

  return `You are a specialized Grant Completeness AI Assistant.
Your task is to analyze the provided Grant Guideline document and extract all distinct requirements, distinguishing MANDATORY requirements from RECOMMENDED guidelines.

CRITICAL INSTRUCTIONS:
1. Extract ALL explicit eligibility and submission criteria.
2. Distinguish:
   - "mandatory": true if the guideline uses words like "must", "required", "shall", "mandatory", "need to", or sets strict baseline criteria.
   - "mandatory": false if the guideline uses words like "recommended", "encouraged", "may", "optional", "suggestions", or "bonus".
3. For each requirement, cite the exact source page number and brief quote from the guideline.
4. Categorize each requirement into one of: 'ELIGIBILITY', 'SUBMISSION', 'FINANCIAL', 'PROJECT_DESCRIPTION', 'GOVERNANCE', 'EVALUATION', 'OTHER'.
5. Also list any explicitly named supporting documents the guideline requires applicants to attach (e.g., "Registration Certificate", "Audited Financial Statement", "Project Budget").
6. You must NOT make legal, regulatory, or funding decisions. Only extract requirements.
7. Return ONLY valid JSON in the exact structure below.

GUIDELINE CONTENT:
${formattedChunks}

OUTPUT JSON FORMAT:
{
  "requirements": [
    {
      "id": "REQ-001",
      "text": "Applicant must be a registered nonprofit.",
      "category": "ELIGIBILITY",
      "mandatory": true,
      "source": {
        "document": "${originalFileName}",
        "page": 1,
        "section": "Eligibility",
        "text": "Applicants must be registered nonprofits."
      }
    }
  ],
  "missingSupportingDocs": [
    {
      "documentName": "Registration Certificate",
      "requiredByReqId": "REQ-001",
      "description": "Proof of active nonprofit registration"
    }
  ]
}`;
}

module.exports = { buildRequirementExtractionPrompt };
