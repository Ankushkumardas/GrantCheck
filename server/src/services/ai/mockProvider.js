const logger = require('../../config/logger');

/**
 * Deterministic Mock AI Provider for automated tests and offline testing.
 * Returns structured JSON matching the exact system prompts.
 */
class MockAiProvider {
  constructor() {
    this.name = 'mock';
  }

  async generateJson(prompt, systemInstruction = '') {
    logger.info('MockAiProvider generating deterministic response', { event: 'ai_mock_call' });

    // Determine the type of prompt from content
    if (prompt.includes('extract all distinct requirements') || prompt.includes('REQUIREMENTS TO EXTRACT') || prompt.includes('GUIDELINE CONTENT')) {
      if (prompt.toLowerCase().includes('education')) {
        return {
          requirements: [
            {
              id: 'REQ-001',
              text: 'Applicant must be an accredited educational institution or registered nonprofit.',
              category: 'ELIGIBILITY',
              mandatory: true,
              source: {
                document: 'education-grant-guideline.pdf',
                page: 1,
                section: 'Eligibility Criteria',
                text: 'Eligible applicants must be accredited educational institutions or recognized nonprofits.'
              }
            },
            {
              id: 'REQ-002',
              text: 'Organization must have a minimum of 3 years of demonstrated operational experience.',
              category: 'ELIGIBILITY',
              mandatory: true,
              source: {
                document: 'education-grant-guideline.pdf',
                page: 1,
                section: 'Eligibility Criteria',
                text: 'Organizations must demonstrate at least three (3) years of continuous operation.'
              }
            },
            {
              id: 'REQ-003',
              text: 'Detailed curriculum alignment with state educational standards must be submitted.',
              category: 'PROJECT_DESCRIPTION',
              mandatory: true,
              source: {
                document: 'education-grant-guideline.pdf',
                page: 2,
                section: 'Program Requirements',
                text: 'All proposals must submit a detailed curriculum framework aligned to state standards.'
              }
            },
            {
              id: 'REQ-004',
              text: 'A formal itemized project budget must be provided.',
              category: 'FINANCIAL',
              mandatory: true,
              source: {
                document: 'education-grant-guideline.pdf',
                page: 2,
                section: 'Submission Requirements',
                text: 'Applicants must supply an itemized project budget matching the requested funds.'
              }
            },
            {
              id: 'REQ-005',
              text: 'Letters of partnership from local school districts are strongly encouraged.',
              category: 'SUBMISSION',
              mandatory: false,
              source: {
                document: 'education-grant-guideline.pdf',
                page: 2,
                section: 'Recommendations',
                text: 'Applicants are encouraged to include partnership letters from participating school districts.'
              }
            }
          ],
          missingSupportingDocs: [
            {
              documentName: 'Project Budget',
              requiredByReqId: 'REQ-004',
              description: 'Itemized project expenditure breakdown'
            }
          ]
        };
      }

      // Default: Community Grant Guideline
      return {
        requirements: [
          {
            id: 'REQ-001',
            text: 'Applicant must be a registered nonprofit entity.',
            category: 'ELIGIBILITY',
            mandatory: true,
            source: {
              document: 'community-grant-guideline.pdf',
              page: 1,
              section: 'Eligibility',
              text: 'Applicants must be legally registered non-profit organizations in good standing.'
            }
          },
          {
            id: 'REQ-002',
            text: 'Organization must have operated for at least 2 full years.',
            category: 'ELIGIBILITY',
            mandatory: true,
            source: {
              document: 'community-grant-guideline.pdf',
              page: 1,
              section: 'Eligibility',
              text: 'Must possess at least two (2) years of documented community operational history.'
            }
          },
          {
            id: 'REQ-003',
            text: 'Project must directly benefit the local municipal community.',
            category: 'PROJECT_DESCRIPTION',
            mandatory: true,
            source: {
              document: 'community-grant-guideline.pdf',
              page: 1,
              section: 'Project Scope',
              text: 'All grant activities must deliver measurable direct impact to local community residents.'
            }
          },
          {
            id: 'REQ-004',
            text: 'Specific project objectives and timeline must be described.',
            category: 'PROJECT_DESCRIPTION',
            mandatory: true,
            source: {
              document: 'community-grant-guideline.pdf',
              page: 2,
              section: 'Project Scope',
              text: 'The proposal must describe concrete project objectives and a milestone implementation timeline.'
            }
          },
          {
            id: 'REQ-005',
            text: 'An itemized project budget must be submitted.',
            category: 'FINANCIAL',
            mandatory: true,
            source: {
              document: 'community-grant-guideline.pdf',
              page: 2,
              section: 'Financials',
              text: 'A full line-item project budget must accompany the draft application.'
            }
          },
          {
            id: 'REQ-006',
            text: 'Project evaluation and impact measurement methodology must be detailed.',
            category: 'EVALUATION',
            mandatory: true,
            source: {
              document: 'community-grant-guideline.pdf',
              page: 2,
              section: 'Evaluation',
              text: 'Proposals must present an evaluation plan detailing metrics and data collection methods.'
            }
          },
          {
            id: 'REQ-007',
            text: 'A valid nonprofit Registration Certificate must be attached.',
            category: 'SUBMISSION',
            mandatory: true,
            source: {
              document: 'community-grant-guideline.pdf',
              page: 2,
              section: 'Required Attachments',
              text: 'A copy of the official government-issued non-profit registration certificate must be supplied.'
            }
          },
          {
            id: 'REQ-008',
            text: 'Previous project outcomes and annual reports should be provided.',
            category: 'SUBMISSION',
            mandatory: false,
            source: {
              document: 'community-grant-guideline.pdf',
              page: 3,
              section: 'Recommended Materials',
              text: 'Applicants are encouraged to provide prior project outcome reports and past achievements.'
            }
          },
          {
            id: 'REQ-009',
            text: 'Letters of community support are encouraged.',
            category: 'SUBMISSION',
            mandatory: false,
            source: {
              document: 'community-grant-guideline.pdf',
              page: 3,
              section: 'Recommended Materials',
              text: 'Letters of support from community stakeholders are recommended to substantiate local buy-in.'
            }
          },
          {
            id: 'REQ-010',
            text: 'Applicant should describe a plan for long-term project sustainability.',
            category: 'GOVERNANCE',
            mandatory: false,
            source: {
              document: 'community-grant-guideline.pdf',
              page: 3,
              section: 'Recommended Materials',
              text: 'It is suggested that applicants include a plan for ongoing funding and operational sustainability.'
            }
          }
        ],
        missingSupportingDocs: [
          {
            documentName: 'Registration Certificate',
            requiredByReqId: 'REQ-007',
            description: 'Official government non-profit certificate'
          },
          {
            documentName: 'Project Budget',
            requiredByReqId: 'REQ-005',
            description: 'Itemized expenditure table'
          }
        ]
      };
    }

    if (prompt.includes('map each grant requirement against the supplied Draft Application') || prompt.includes('REQUIREMENTS TO EVALUATE')) {
      if (prompt.toLowerCase().includes('education')) {
        return {
          mappings: [
            {
              requirementId: 'REQ-001',
              status: 'SUPPORTED',
              evidence: [
                {
                  document: 'education-grant-application.pdf',
                  page: 1,
                  section: 'Organization Overview',
                  text: 'Future Leaders Academy is an accredited 501(c)(3) educational organization.'
                }
              ],
              reason: 'Application explicitly identifies applicant as an accredited educational nonprofit.'
            },
            {
              requirementId: 'REQ-002',
              status: 'WEAK',
              evidence: [
                {
                  document: 'education-grant-application.pdf',
                  page: 1,
                  section: 'Experience',
                  text: 'We have worked in education for many years across various schools.'
                }
              ],
              reason: 'Application mentions working in education for "many years" but fails to provide a specific founding date or verify the required 3-year threshold.'
            },
            {
              requirementId: 'REQ-003',
              status: 'AMBIGUOUS',
              evidence: [
                {
                  document: 'education-grant-application.pdf',
                  page: 2,
                  section: 'Curriculum',
                  text: 'Our workshops incorporate modern teaching techniques loosely modeled on regional pedagogical goals.'
                }
              ],
              reason: 'Curriculum alignment mentions general pedagogical goals but does not explicitly cite or detail state educational standards.'
            },
            {
              requirementId: 'REQ-004',
              status: 'MISSING',
              evidence: [],
              reason: 'No itemized project budget or financial schedule was found in the application or supporting documents.'
            },
            {
              requirementId: 'REQ-005',
              status: 'MISSING',
              evidence: [],
              reason: 'No school district partnership letters were included in the submission.'
            }
          ]
        };
      }

      // Default Community Grant mappings (representing 7 supported mandatory out of 7, 1 weak, 1 ambiguous, 1 missing)
      return {
        mappings: [
          {
            requirementId: 'REQ-001',
            status: 'SUPPORTED',
            evidence: [
              {
                document: 'community-grant-application.pdf',
                page: 1,
                section: 'Organization Information',
                text: 'Green Horizons Initiative is an officially registered 501(c)(3) community nonprofit.'
              },
              {
                document: 'registration-certificate.pdf',
                page: 1,
                section: 'Official Registry',
                text: 'Certified Nonprofit Organization Registration Number: NP-884920.'
              }
            ],
            reason: 'Applicant is confirmed as a registered nonprofit through both application statements and attached registration certificate.'
          },
          {
            requirementId: 'REQ-002',
            status: 'AMBIGUOUS',
            evidence: [
              {
                document: 'community-grant-application.pdf',
                page: 1,
                section: 'Background',
                text: 'Our grassroots team has been active in neighborhood development for several seasons.'
              }
            ],
            reason: 'The phrase "several seasons" creates ambiguity regarding whether the 2-year operational requirement is fulfilled.'
          },
          {
            requirementId: 'REQ-003',
            status: 'SUPPORTED',
            evidence: [
              {
                document: 'community-grant-application.pdf',
                page: 1,
                section: 'Project Goals',
                text: 'The Urban Food Garden project directly serves low-income families in Ward 4 by providing fresh produce.'
              }
            ],
            reason: 'The project explicitly targets local municipal residents and details community benefits.'
          },
          {
            requirementId: 'REQ-004',
            status: 'SUPPORTED',
            evidence: [
              {
                document: 'community-grant-application.pdf',
                page: 2,
                section: 'Implementation Plan',
                text: 'Phase 1 begins April 2026 with soil preparation; Phase 2 delivers community planting workshops in June 2026.'
              }
            ],
            reason: 'Clear objectives and phased milestone timeline are articulated in the project plan.'
          },
          {
            requirementId: 'REQ-005',
            status: 'SUPPORTED',
            evidence: [
              {
                document: 'project-budget.pdf',
                page: 1,
                section: 'Budget Summary',
                text: 'Total Project Cost: $25,000. Supplies: $12,000, Community Coordinator: $8,000, Evaluation: $5,000.'
              }
            ],
            reason: 'Itemized project budget supplied in the supporting documentation.'
          },
          {
            requirementId: 'REQ-006',
            status: 'WEAK',
            evidence: [
              {
                document: 'community-grant-application.pdf',
                page: 2,
                section: 'Impact',
                text: 'We plan to observe participant satisfaction and survey attendees informally.'
              }
            ],
            reason: 'Mentions informal surveys and observation, but lacks structured evaluation metrics, KPIs, or formal data collection protocols.'
          },
          {
            requirementId: 'REQ-007',
            status: 'SUPPORTED',
            evidence: [
              {
                document: 'registration-certificate.pdf',
                page: 1,
                section: 'Official Registry',
                text: 'State Department of Charitable Entities Certificate of Incorporation NP-884920.'
              }
            ],
            reason: 'Official Registration Certificate is attached and verified.'
          },
          {
            requirementId: 'REQ-008',
            status: 'SUPPORTED',
            evidence: [
              {
                document: 'project-report.pdf',
                page: 1,
                section: 'Past Highlights',
                text: 'In 2025, our pilot community initiative served 450 families with agricultural kits.'
              }
            ],
            reason: 'Prior project outcome report provided as a supporting attachment.'
          },
          {
            requirementId: 'REQ-009',
            status: 'MISSING',
            evidence: [],
            reason: 'No letters of community support were attached or referenced in the application.'
          },
          {
            requirementId: 'REQ-010',
            status: 'SUPPORTED',
            evidence: [
              {
                document: 'community-grant-application.pdf',
                page: 3,
                section: 'Sustainability',
                text: 'Ongoing maintenance will be supported by municipal partnership and volunteer membership dues.'
              }
            ],
            reason: 'Application outlines clear post-grant sustainability and local partnership funding model.'
          }
        ]
      };
    }

    if (prompt.includes('identify key factual or numerical claims in the Draft Application that are NOT supported')) {
      return {
        claims: [
          {
            claimText: 'Our previous program reached 10,000 students across 15 schools.',
            source: {
              document: 'draft-application.pdf',
              page: 2,
              section: 'Past Track Record'
            },
            reason: 'No supplied evidence was found supporting the stated number of 10,000 students or 15 participating schools.'
          }
        ]
      };
    }

    if (prompt.includes('generate concise, specific, and actionable clarification questions')) {
      return {
        questions: [
          {
            requirementId: 'REQ-002',
            statusTrigger: 'AMBIGUOUS',
            question: 'What exact date (month and year) did the organization begin its formal operations?',
            context: 'The draft application refers to operating for "several seasons" rather than specifying the exact 2-year timeline.'
          },
          {
            requirementId: 'REQ-006',
            statusTrigger: 'WEAK',
            question: 'What specific quantitative metrics, KPIs, and data collection schedules will be used to evaluate project success?',
            context: 'The evaluation plan relies on informal surveys without defining measurable targets or formal reporting methods.'
          },
          {
            requirementId: 'REQ-009',
            statusTrigger: 'MISSING',
            question: 'Can letters of endorsement or support from partner community organizations be provided?',
            context: 'Recommended community support letters were not attached to the submission.'
          }
        ]
      };
    }

    return { result: 'Mock response generated successfully' };
  }
}

module.exports = MockAiProvider;
