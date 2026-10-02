function buildQuestionGenerationPrompt(issues) {
  const issuesStr = JSON.stringify(issues.map(i => ({
    requirementId: i.reqId,
    requirementText: i.requirementText,
    status: i.status,
    problemOrReason: i.reason,
    existingEvidenceSnippet: i.evidenceSnippet || 'None'
  })), null, 2);

  return `You are a Grant Application Completeness Assistant.
Your task is to generate concise, specific, and actionable clarification questions for grant requirements that are WEAK, AMBIGUOUS, or MISSING evidence.

CRITICAL INSTRUCTIONS:
1. Formulate direct, polite, and helpful questions that the applicant or reviewer can address to eliminate the deficiency.
2. For WEAK items, ask for the missing quantitative metrics, dates, or specifications.
3. For AMBIGUOUS items, ask for clarification regarding the uncertain terms or timeline.
4. For MISSING items, ask where or if the required document or section can be provided.
5. If there are no issues provided, return {"questions": []}.
6. Return ONLY valid JSON in the exact structure below.

REQUIREMENTS WITH GAPS:
${issuesStr}

OUTPUT JSON FORMAT:
{
  "questions": [
    {
      "requirementId": "REQ-002",
      "statusTrigger": "WEAK",
      "question": "What specific month and year was the organization officially established or registered?",
      "context": "The application mentions operating for 'several years' without specifying the exact operational start date."
    }
  ]
}`;
}

module.exports = { buildQuestionGenerationPrompt };
