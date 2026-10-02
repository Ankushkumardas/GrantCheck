# Agent Usage & AI Collaboration Log

This document details the AI-assisted pair-programming workflow, tools used, decision rationale, mistakes identified, and verification procedures applied while developing the **Grant Application Completeness Assistant ("GrantCheck")**.

---

## 1. AI Tools & Environment

* **Primary AI Assistant**: Antigravity IDE (Powered by Gemini 3.7 Flash)
* **Execution Environment**: Windows OS, Node.js v25.1.0, npm 11.6.2
* **Target Stack**: MERN Architecture (React + Vite + Tailwind CSS / Node.js + Express + Mongoose / Winston / Zod / Vitest)

---

## 2. Representative Prompts Used

### Architecture & System Design
> "Build a complete, working, production-quality full-stack web application called Grant Application Completeness Assistant. The system must extract requirements dynamically from any user-supplied grant guideline PDF, map evidence against draft applications and supporting attachments with page-level citations, detect unsupported claims, generate clarification questions, compute deterministic completeness scores, and provide human-in-the-loop verification with stale version tracking."

### Deterministic Calculation Business Logic
> "Create a pure JavaScript calculation service `calculateCompleteness(requirements, mappings)` where the completeness percentage is calculated solely based on mandatory requirements (`mandatorySupported / mandatoryTotal * 100`). Ensure recommended requirements are tracked separately and do not alter the mandatory score. If human review has occurred, prioritize human reviewed statuses over AI statuses."

### Provider-Agnostic AI Interface
> "Design an AI service interface supporting three interchangeable providers: `mock` for automated testing, `ollama` for local development, and `gemini` for production deployment. Enforce strict JSON output with Zod validation and a 1-retry fallback mechanism."

### Traceable PDF Page Chunking
> "Implement a PDF extraction service that does not collapse all pages into raw text, but instead preserves page numbers and section headers into structured chunks (`chunkId`, `pageNumber`, `section`, `text`) for precise evidence citations."

---

## 3. Delegated Work vs. Human Architectural Control

### Work Delegated to the AI
1. **Schema & Model Definitions**: Mongoose models for `Assessment`, `Document`, `Requirement`, `Mapping`, `UnsupportedClaim`, `ClarificationQuestion`, and `ReviewLog`.
2. **AI Prompts & Parsers**: Strict structured prompts for requirement extraction, evidence mapping, unsupported claim detection, and clarification question generation.
3. **Deterministic Completeness Logic**: Math logic and unit test suite verifying `7/10 = 70%`, `10/10 = 100%`, `0/10 = 0%`, and recommendation isolation.
4. **Interactive UI Components**: Responsive Tailwind CSS components including `RequirementCard`, `StatusBadge`, `ProgressWorkflow`, `CorrectionModal`, `UnsupportedClaimsCard`, and `ReviewedSummaryModal`.
5. **Sample PDF Generation Script**: Multi-page PDF generator using `pdfkit` to produce 8 test PDFs across 5 test cases.

### Suggestions Rejected or Adjusted
1. **LangChain / Vector DB Rejected**:
   * *AI Proposal*: Initially considered vector embeddings and LangChain chains.
   * *Decision*: Rejected per problem specifications. Vector search and agent loops add unnecessary opacity and latency. A controlled multi-step LLM workflow with direct chunk injection provides 100% transparent citations and reliability.
2. **Permanent PDF Object Storage Rejected**:
   * *Decision*: Extracted text and page metadata are stored directly in MongoDB; temporary uploaded files are deleted immediately after parsing.
3. **LLM Direct Score Computation Rejected**:
   * *Decision*: Prohibited the LLM from outputting percentage scores. Completeness is calculated deterministically on the backend.

---

## 4. Mistakes Identified and Corrections Made

| Step / Component | Issue / Mistake Identified | Root Cause | Resolution Applied |
| :--- | :--- | :--- | :--- |
| **Integration Testing** | Vitest `beforeAll` hook timed out during integration test run. | `mongodb-memory-server` downloaded the MongoDB 7.0 binary on the first invocation, exceeding the default 10s Vitest timeout. | Added `server/vitest.config.js` and set `testTimeout: 60000` and `hookTimeout: 60000`. |
| **AI Evidence Safety** | Risk of AI hallucinating citations when status is `MISSING`. | LLM prompt could occasionally include placeholder page numbers for missing requirements. | Added a post-processing safety filter in `evidenceMapper.js` that explicitly sets `evidence: []` whenever status is `MISSING`. |
| **Stale State Handling** | Uploading new document versions should not overwrite historical records. | Need to preserve older assessments while flagging version mismatches. | Implemented `guidelineVersion` and `applicationVersion` tracking with automatic `STALE` status transitions and `staleReason` banners. |

---

## 5. Verification Procedures

1. **Automated Unit Tests**:
   * `completenessCalculator.test.js` (6/6 passed)
   * `versionManager.test.js` (4/4 passed)
2. **AI Provider & Schema Tests**:
   * `mockProvider.test.js` (5/5 passed) verifying Zod schema conformance.
3. **Full Integration API Tests**:
   * `assessmentApi.test.js` (9/9 passed) testing login, PDF uploads, workflow analysis, mapping reviews, and summary generation.
4. **Client Production Bundle Build**:
   * `npm run build` with Vite (0 errors, 1657 modules transformed).
5. **PDF Generator Verification**:
   * Generated 8 multi-page PDFs with real content matching Test Cases 1–5.
