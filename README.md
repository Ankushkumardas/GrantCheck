# Grant Application Completeness Assistant ("GrantCheck")

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-38bdf8.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-emerald.svg)](https://www.mongodb.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-brightgreen.svg)](https://vitest.dev/)
[![Responsible AI](https://img.shields.io/badge/AI_Governance-Human_in_the_Loop-indigo.svg)](#23-responsible-ai--human-in-the-loop)

A full-stack web application that performs automated, traceable completeness evaluations of draft funding and grant proposals against user-supplied grant guidelines. It maps evidence, distinguishes mandatory requirements from recommendations, detects unsupported claims, generates actionable clarification questions, calculates deterministic completeness percentages, and provides human-in-the-loop review with stale version tracking.

---

## 1. Project Overview

Grant applicants and reviewers frequently spend dozens of hours cross-referencing lengthy grant guidelines against proposal narratives. Missing a single mandatory eligibility requirement, budget attachment, or certificate leads to automatic disqualification.

**GrantCheck** provides a structured, predictable AI workflow that ingests arbitrary grant guideline PDFs and draft application PDFs, maps evidence paragraph-by-paragraph with document and page citations, and gives reviewers an interactive workspace to confirm, correct, or reject AI findings.

---

## 2. Problem Statement

* **Dynamic Guidelines**: Funding guidelines are not fixed or hardcoded. Users upload different guidelines; the AI dynamically extracts eligibility and submission criteria.
* **Evidence Traceability**: Every requirement mapping cites the exact source document, page number, section heading, and quoted snippet.
* **Deterministic Completeness**: The LLM does not calculate the completeness score. The backend deterministically computes scores based solely on mandatory requirements and verified human decisions.
* **Ethical AI Boundaries**: The system evaluates completeness against supplied text—it never makes authoritative legal, regulatory, or funding-eligibility decisions.

---

## 3. Key Features

1. **Dynamic Requirement Extraction**: Classifies requirements into `MANDATORY` (`must`, `shall`, `required`) vs `RECOMMENDED` (`encouraged`, `optional`, `may`).
2. **Page-Preserving Evidence Mapping**: Categorizes mapping status into strictly:
   * 🟢 `SUPPORTED`: Clear evidence addresses the requirement.
   * 🟡 `WEAK`: Related evidence exists but lacks required metrics or dates.
   * 🟠 `AMBIGUOUS`: Evidence exists but meaning or timeline is unclear.
   * 🔴 `MISSING`: No evidence found in the supplied documents.
3. **Potential Unsupported Claim Detection**: Identifies unsupported statistical, partner, or past performance claims (e.g. *"Our program helped 10,000 students"*) without branding them as false.
4. **Actionable Clarification Questions**: Auto-generates concise prompts for `WEAK`, `AMBIGUOUS`, or `MISSING` criteria.
5. **Missing Supporting Document Tracking**: Cross-checks guideline attachments (e.g., *Registration Certificate*, *Audited Financials*, *Project Budget*) against provided files.
6. **Human-in-the-Loop Review System**: Reviewers can `Confirm`, `Correct` (with status selector and notes), or `Reject` AI findings, storing complete audit history logs.
7. **Document Versioning & Stale Assessment Tracking**: Incrementing document revisions flags previous assessments as `STALE`, preserving historical records while preventing reliance on outdated evaluations.
8. **Reviewed Completeness Summary**: Generates audit-ready completeness certificates with full counters, timestamps, and version metadata.
9. **Multi-Provider AI Architecture**: Seamless switching between `mock` (for automated tests), `ollama` (for local dev), and `gemini` (for production).
10. **Zero-Setup Database Fallback**: Embedded in-memory MongoDB automatically spins up for local dev/testing if no MongoDB daemon is running.

---

## 4. Architecture

```text
                               ┌────────────────────────┐
                               │   React Frontend (Vite) │
                               │  Tailwind CSS + Router  │
                               └───────────┬────────────┘
                                           │ HTTP / JSON
                                           ▼
                               ┌────────────────────────┐
                               │  Express.js REST API   │
                               │  Winston Logger & Auth │
                               └───────────┬────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│  PDF Extractor   │             │   AI Workflow    │             │  MongoDB Models  │
│  (Page & Chunks) │             │ Provider Service │             │ (Assessments,    │
└──────────────────┘             └─────────┬────────┘             │  Mappings, Logs) │
                                           │                      └──────────────────┘
                         ┌─────────────────┼─────────────────┐
                         ▼                 ▼                 ▼
                  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
                  │ Mock (Test) │   │ Ollama(Dev) │   │ Gemini(Prod)│
                  └─────────────┘   └─────────────┘   └─────────────┘
```

---

## 5. Technology Stack

* **Frontend**: React 18, JSX, Vite, React Router v6, Tailwind CSS v3, Axios, Lucide React icons.
* **Backend**: Node.js v20+, Express.js, Mongoose ODM, Multer (temporary file handling), `pdf-parse` (page chunker), Zod (schema validation), Winston (structured JSON logger), JSON Web Tokens (JWT).
* **Database**: MongoDB / MongoDB Atlas (with `mongodb-memory-server` fallback for zero-friction local testing).
* **AI Providers**: Google Gemini 1.5 Flash (Production), Ollama (Local), Deterministic Mock Provider (Automated Tests).
* **Testing**: Vitest, Supertest, Playwright.

---

## 6. Folder Structure

```text
grant-completeness-assistant/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── Tooltip.jsx
│   │   │   ├── ProgressWorkflow.jsx
│   │   │   ├── RequirementCard.jsx
│   │   │   ├── CorrectionModal.jsx
│   │   │   ├── UnsupportedClaimsCard.jsx
│   │   │   ├── ClarificationQuestionsCard.jsx
│   │   │   ├── MissingDocsCard.jsx
│   │   │   ├── StaleWarningBanner.jsx
│   │   │   ├── ReviewedSummaryModal.jsx
│   │   │   └── DisclaimerFooter.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── NewAssessmentPage.jsx
│   │   │   └── ResultsPage.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── constants/
│   │   │   └── tooltips.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   ├── db.js
│   │   │   └── logger.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── assessmentController.js
│   │   │   └── mappingController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── upload.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── Assessment.js
│   │   │   ├── Document.js
│   │   │   ├── Requirement.js
│   │   │   ├── Mapping.js
│   │   │   ├── UnsupportedClaim.js
│   │   │   ├── ClarificationQuestion.js
│   │   │   └── ReviewLog.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── assessmentRoutes.js
│   │   │   ├── mappingRoutes.js
│   │   │   └── index.js
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   ├── aiService.js
│   │   │   │   ├── mockProvider.js
│   │   │   │   ├── ollamaProvider.js
│   │   │   │   ├── geminiProvider.js
│   │   │   │   ├── requirementExtractor.js
│   │   │   │   ├── evidenceMapper.js
│   │   │   │   ├── claimAnalyzer.js
│   │   │   │   ├── questionGenerator.js
│   │   │   │   └── prompts/
│   │   │   │       ├── requirementExtractionPrompt.js
│   │   │   │       ├── evidenceMappingPrompt.js
│   │   │   │       ├── claimAnalysisPrompt.js
│   │   │   │       └── questionGenerationPrompt.js
│   │   │   ├── documents/
│   │   │   │   └── pdfExtractor.js
│   │   │   └── assessment/
│   │   │       ├── completenessCalculator.js
│   │   │       ├── versionManager.js
│   │   │       └── workflowOrchestrator.js
│   │   ├── validators/
│   │   │   └── aiValidators.js
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── completenessCalculator.test.js
│   │   │   └── versionManager.test.js
│   │   ├── integration/
│   │   │   └── assessmentApi.test.js
│   │   └── ai/
│   │       └── mockProvider.test.js
│   └── package.json
│
├── sample-documents/
│   ├── guidelines/
│   │   ├── community-grant-guideline.pdf
│   │   └── education-grant-guideline.pdf
│   ├── applications/
│   │   ├── community-grant-application.pdf
│   │   └── education-grant-application.pdf
│   └── supporting/
│       ├── registration-certificate.pdf
│       ├── project-budget.pdf
│       ├── financial-statement.pdf
│       └── project-report.pdf
│
├── scripts/
│   └── generateSamplePdfs.js
├── .env.example
├── .gitignore
├── README.md
├── AGENT_USAGE.md
└── package.json
```

---

## 7. Setup Instructions

### Prerequisites
* **Node.js**: v18.0.0 or higher (v20+ recommended)
* **npm**: v9+ or v10+
* *(Optional)*: Local MongoDB or MongoDB Atlas URI (if not present, app falls back to in-memory MongoDB automatically).
* *(Optional)*: Ollama or Google Gemini API key.

### Quick Start (Local Development)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd grant-completeness-assistant
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Generate Sample Test PDFs**:
   ```bash
   npm run generate-samples
   ```

5. **Start Both Backend and Frontend Concurrently**:
   ```bash
   npm run dev
   ```
   * Frontend: `http://localhost:5173`
   * Backend API: `http://localhost:5000`

---

## 8. Environment Variables

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/grant_completeness_assistant` |
| `AI_PROVIDER` | Selected AI provider (`mock`, `ollama`, `gemini`) | `mock` (or `ollama` / `gemini`) |
| `OLLAMA_BASE_URL` | Ollama HTTP endpoint | `http://localhost:11434` |
| `OLLAMA_MODEL` | Ollama model identifier | `llama3.2` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `GEMINI_MODEL` | Google Gemini model name | `gemini-1.5-flash` |
| `DEMO_EMAIL` | Pre-configured demo email | `demo@example.com` |
| `DEMO_PASSWORD` | Pre-configured demo password | `demo123` |
| `JWT_SECRET` | Secret key for JWT signing | `supersecret_demo_jwt_key_grant_check_2026` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

---

## 9. AI Provider Setup

### Option A: Mock Provider (Default for Instant Testing)
No installation or API keys required. Returns structured deterministic responses for the sample test documents.
```env
AI_PROVIDER=mock
```

### Option B: Local Ollama (Development)
1. Install Ollama from [ollama.com](https://ollama.com/).
2. Pull your preferred model:
   ```bash
   ollama pull llama3.2
   ```
3. Ensure Ollama is running (`ollama serve`).
4. Update your `.env`:
   ```env
   AI_PROVIDER=ollama
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.2
   ```

### Option C: Google Gemini (Production)
1. Obtain an API key from Google AI Studio ([aistudio.google.com](https://aistudio.google.com/)).
2. Update your `.env`:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   ```

---

## 10. Database Configuration

* **Standard MongoDB**: Set `MONGODB_URI=mongodb://127.0.0.1:27017/grant_completeness_assistant` or your MongoDB Atlas connection string.
* **Frictionless In-Memory Fallback**: If no MongoDB server is running locally, the server automatically starts an embedded in-memory MongoDB instance via `mongodb-memory-server`. This ensures zero configuration hurdles for new evaluators!

---

## 11. Running Tests

### Run Backend Unit & Integration Tests (Vitest)
```bash
npm run test
```
Or run specifically by category:
```bash
npm run test:unit          # Runs completenessCalculator & versionManager tests
npm run test:integration   # Runs Supertest API integration tests
```

### Run Playwright End-to-End Tests
```bash
npx playwright test
```

---

## 12. AI Workflow Details

The system runs a controlled multi-step workflow with deterministic mathematical scoring:

1. **Document Text Extraction**: Multer receives PDFs, `pdf-parse` extracts text page-by-page, builds structured chunks (`pageNumber`, `section`, `text`), stores them in MongoDB, and deletes the temporary upload file.
2. **Requirement Extraction**: AI extracts all eligibility/submission rules from the guideline, distinguishing `mandatory: true` from `mandatory: false` and citing page numbers.
3. **Evidence Mapping**: AI cross-references application and supporting chunks against each requirement, outputting `SUPPORTED`, `WEAK`, `AMBIGUOUS`, or `MISSING` with quotes.
4. **Unsupported Claim Analysis**: AI flags statistical or factual assertions lacking corroborating attachments.
5. **Clarification Question Generation**: AI generates focused questions for requirements with evidence gaps.
6. **Deterministic Completeness Calculation**: Pure backend function calculates:
   $$\text{Completeness} = \frac{\text{Supported Mandatory Requirements}}{\text{Total Mandatory Requirements}} \times 100\%$$
   *Recommended requirements are recorded separately and never inflate the mandatory score.*
7. **Human-in-the-Loop Review**: Users can `Confirm`, `Correct`, or `Reject` any mapping. Correcting or confirming a mapping immediately triggers deterministic recalculation of the assessment's score!

---

## 13. REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate with demo credentials (`demo@example.com` / `demo123`). |
| `GET` | `/api/auth/me` | Fetch authenticated user profile. |
| `POST` | `/api/assessments` | Create a new assessment draft. |
| `GET` | `/api/assessments` | List all recent and historical assessments. |
| `GET` | `/api/assessments/:id` | Get single assessment details and document metadata. |
| `POST` | `/api/assessments/:id/guideline` | Upload and extract Grant Guideline PDF (increments version). |
| `POST` | `/api/assessments/:id/application` | Upload and extract Draft Application PDF (increments version). |
| `POST` | `/api/assessments/:id/supporting-documents` | Upload optional supporting attachments (Certificates, Budgets). |
| `POST` | `/api/assessments/:id/analyze` | Trigger the multi-step AI completeness evaluation workflow. |
| `GET` | `/api/assessments/:id/results` | Get full evaluation results, requirements, citations, and claims. |
| `PATCH` | `/api/mappings/:mappingId` | Submit human review action (`CONFIRM`, `CORRECT`, `REJECT`). |
| `GET` | `/api/assessments/:id/summary` | Get final reviewed completeness summary statistics and timestamps. |
| `POST` | `/api/assessments/:id/rerun` | Re-run analysis on existing assessment documents. |

---

## 14. Sample Test Documents & Test Cases

The application includes 8 pre-generated PDF test documents located under `sample-documents/`:

1. **Test Case 1 — Mostly Complete (`community-grant-guideline.pdf` & `community-grant-application.pdf`)**:
   * Contains 7 mandatory requirements and 3 recommended items.
   * Tests cross-document evidence linking across `registration-certificate.pdf` and `project-budget.pdf`.
   * Application intentionally contains 1 unsupported statistical claim: *"Our previous program reached 10,000 students across 15 schools"*.
2. **Test Case 2 — Weak & Ambiguous Evidence (`education-grant-guideline.pdf` & `education-grant-application.pdf`)**:
   * Contains vague phrasing: *"We have worked in education for many years"* (lacks specific 3-year date).
   * Yields `WEAK` and `AMBIGUOUS` statuses and auto-generates clarification questions.
3. **Test Case 3 — Missing Supporting Documents**:
   * Guideline specifies *Registration Certificate*, *Audited Financial Statement*, and *Project Budget*.
   * Providing only the Registration Certificate highlights the missing financial attachments in the tracker.
4. **Test Case 4 — Recommended Requirements**:
   * Tests that recommended items (e.g., community letters, sustainability plans) do not distort the mandatory completeness score.
5. **Test Case 5 — Document Versioning & Stale Detection**:
   * Re-uploading a new revision of the application or guideline marks the previous assessment as `STALE` with an actionable re-run banner while preserving the historical record.

---

## 15. Deployment Guide

### Backend on Render
1. Create a new Web Service on [render.com](https://render.com/).
2. Connect your Git repository and set Root Directory to `server`.
3. Set Build Command: `npm install`
4. Set Start Command: `node src/server.js`
5. Configure Environment Variables:
   * `NODE_ENV=production`
   * `PORT=5000`
   * `MONGODB_URI=<Your MongoDB Atlas Connection String>`
   * `AI_PROVIDER=gemini`
   * `GEMINI_API_KEY=<Your Gemini API Key>`
   * `GEMINI_MODEL=gemini-1.5-flash`
   * `CLIENT_URL=https://your-app.vercel.app`

### Frontend on Vercel
1. Create a new Project on [vercel.com](https://vercel.com/).
2. Select the `client` directory as the root.
3. Framework Preset: `Vite`.
4. Set Environment Variable:
   * `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy.

---

## 16. Architectural & Scope Decisions

### Why LangChain, LangGraph, and Vector Databases Were Not Used
> *"The application uses a controlled multi-step LLM workflow instead of an autonomous agent because the assignment defines a predictable sequence of document analysis tasks."*
>
> *"Vector retrieval was intentionally excluded because the assignment processes one guideline, one application, and optional supporting documents rather than a large document corpus."*

Direct injection of structured page chunks into focused prompts provides 100% determinism, exact page-level citations, lower latency, and zero hallucinated retrievals.

### Document Storage Approach
The application does not require permanent cloud object storage (S3/R2/GridFS).
* PDFs are received through Multer in temporary storage.
* Text and page metadata are extracted and structured into MongoDB document chunks.
* The temporary file on disk is deleted immediately.

---

## 17. Responsible AI & Ethical Boundaries

GrantCheck is designed as an assistant to human reviewers:
* **No Legal or Eligibility Decisions**: The system uses phrasing such as *"Evidence found"*, *"Potential unsupported claim"*, and *"No supplied evidence found"*. It explicitly avoids *"Applicant is eligible"* or *"This claim is false"*.
* **Human Authority**: Human reviewers have the final authority to confirm, correct, or reject any AI mapping, and all human interventions are logged with reviewer identity and timestamp.
