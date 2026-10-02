const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '../sample-documents');
const guidelinesDir = path.join(baseDir, 'guidelines');
const applicationsDir = path.join(baseDir, 'applications');
const supportingDir = path.join(baseDir, 'supporting');

[guidelinesDir, applicationsDir, supportingDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function createPdf(filePath, title, pagesContent) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    pagesContent.forEach((page, index) => {
      if (index > 0) {
        doc.addPage();
      }

      // Header
      doc.fontSize(20).fillColor('#1E293B').text(title, { align: 'left' });
      doc.fontSize(10).fillColor('#64748B').text(`Official Document - Page ${index + 1}`, { align: 'left' });
      doc.moveDown(1);
      doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);

      page.sections.forEach(section => {
        doc.fontSize(14).fillColor('#0F172A').text(section.heading);
        doc.moveDown(0.3);
        doc.fontSize(11).fillColor('#334155').text(section.body, {
          lineGap: 4,
          align: 'justify'
        });
        doc.moveDown(1);
      });

      // Footer
      doc.fontSize(9).fillColor('#94A3B8').text(
        `Grant Application Completeness Evaluation System - ${path.basename(filePath)}`,
        50,
        720,
        { align: 'center', width: 500 }
      );
    });

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

async function generateAllPdfs() {
  console.log('Generating realistic sample PDF documents for testing...');

  // 1. community-grant-guideline.pdf (3 Pages)
  await createPdf(
    path.join(guidelinesDir, 'community-grant-guideline.pdf'),
    'Community Action Grant 2026 - Funding Guidelines',
    [
      {
        sections: [
          {
            heading: 'SECTION 1: OVERVIEW AND ELIGIBILITY',
            body: 'The Municipal Community Trust invites funding proposals for grassroots social initiatives. To be eligible for funding consideration under the 2026 cycle:\n\n' +
              '1. Mandatory Requirement 1: Applicants must be legally registered non-profit organizations in good standing with state and federal authorities.\n\n' +
              '2. Mandatory Requirement 2: The applicant organization must possess at least two (2) years of continuous documented operational history in community services.'
          },
          {
            heading: 'SECTION 2: PROJECT SCOPE AND OBJECTIVES',
            body: '3. Mandatory Requirement 3: The proposed project must deliver direct, measurable benefits to local municipal community residents.\n\n' +
              '4. Mandatory Requirement 4: The proposal must describe concrete project objectives and a milestone implementation timeline covering the entire grant term.'
          }
        ]
      },
      {
        sections: [
          {
            heading: 'SECTION 3: FINANCIAL AND EVALUATION REQUIREMENTS',
            body: '5. Mandatory Requirement 5: A comprehensive, itemized line-item project budget must accompany the draft application detailing personnel, operational, and supply costs.\n\n' +
              '6. Mandatory Requirement 6: Proposals must present a structured evaluation plan detailing metrics, key performance indicators (KPIs), and data collection methods.\n\n' +
              '7. Mandatory Requirement 7: A copy of the official government-issued non-profit registration certificate must be supplied with the application.'
          }
        ]
      },
      {
        sections: [
          {
            heading: 'SECTION 4: RECOMMENDED MATERIALS',
            body: '8. Recommendation: Applicants are encouraged to provide prior project outcome reports and past achievement summaries to demonstrate organizational track record.\n\n' +
              '9. Recommendation: Letters of community support from local neighborhood associations or partner agencies are strongly recommended.\n\n' +
              '10. Recommendation: It is suggested that applicants include a plan for ongoing funding and operational sustainability after the grant period concludes.'
          }
        ]
      }
    ]
  );

  // 2. community-grant-application.pdf (3 Pages)
  await createPdf(
    path.join(applicationsDir, 'community-grant-application.pdf'),
    'Grant Application: Urban Food & Nutrition Initiative',
    [
      {
        sections: [
          {
            heading: 'ORGANIZATION BACKGROUND',
            body: 'Applicant Name: Green Horizons Initiative.\n\n' +
              'Green Horizons Initiative is an officially registered 501(c)(3) community nonprofit organization dedicated to improving urban food security.\n\n' +
              'Our grassroots team has been active in neighborhood development for several seasons, working across municipal districts.'
          },
          {
            heading: 'PROJECT GOALS AND LOCAL BENEFIT',
            body: 'The Urban Food Garden project directly serves low-income families in Ward 4 by providing fresh produce, nutrition literacy workshops, and communal garden plots.'
          }
        ]
      },
      {
        sections: [
          {
            heading: 'IMPLEMENTATION PLAN AND TIMELINE',
            body: 'Phase 1 begins April 2026 with soil preparation and volunteer orientation. Phase 2 delivers community planting workshops in June 2026, with harvest distribution in Autumn 2026.'
          },
          {
            heading: 'PROJECT EVALUATION',
            body: 'We plan to observe participant satisfaction and survey attendees informally after workshops to understand community interest.'
          },
          {
            heading: 'PAST TRACK RECORD AND CLAIMS',
            body: 'Our previous program reached 10,000 students across 15 schools in the district, yielding transformational improvements in youth food literacy.'
          }
        ]
      },
      {
        sections: [
          {
            heading: 'LONG TERM SUSTAINABILITY',
            body: 'Ongoing maintenance will be supported by municipal partnership and volunteer membership dues, ensuring continued operation beyond the initial grant window.'
          }
        ]
      }
    ]
  );

  // 3. education-grant-guideline.pdf (2 Pages)
  await createPdf(
    path.join(guidelinesDir, 'education-grant-guideline.pdf'),
    'State Educational Excellence Fund - Grant Guidelines',
    [
      {
        sections: [
          {
            heading: 'ELIGIBILITY CRITERIA',
            body: '1. Eligible applicants must be accredited educational institutions or recognized nonprofits.\n\n' +
              '2. Organizations must demonstrate at least three (3) years of continuous operation in educational delivery.\n\n' +
              '3. All proposals must submit a detailed curriculum framework aligned to state standards.'
          }
        ]
      },
      {
        sections: [
          {
            heading: 'SUBMISSION REQUIREMENTS AND RECOMMENDATIONS',
            body: '4. Applicants must supply an itemized project budget matching the requested funds.\n\n' +
              '5. Applicants are encouraged to include partnership letters from participating school districts.'
          }
        ]
      }
    ]
  );

  // 4. education-grant-application.pdf (2 Pages)
  await createPdf(
    path.join(applicationsDir, 'education-grant-application.pdf'),
    'Education Grant Proposal - Future Leaders Academy',
    [
      {
        sections: [
          {
            heading: 'ORGANIZATION OVERVIEW',
            body: 'Future Leaders Academy is an accredited 501(c)(3) educational organization.\n\n' +
              'We have worked in education for many years across various schools in the tri-county area.'
          }
        ]
      },
      {
        sections: [
          {
            heading: 'CURRICULUM AND PROGRAM DESIGN',
            body: 'Our workshops incorporate modern teaching techniques loosely modeled on regional pedagogical goals and interactive classroom methods.'
          }
        ]
      }
    ]
  );

  // 5. registration-certificate.pdf (1 Page)
  await createPdf(
    path.join(supportingDir, 'registration-certificate.pdf'),
    'Certificate of Nonprofit Incorporation',
    [
      {
        sections: [
          {
            heading: 'STATE DEPARTMENT OF CHARITABLE ENTITIES',
            body: 'This is to certify that Green Horizons Initiative is duly registered as a domestic 501(c)(3) charitable corporation under Registration Number NP-884920, issued March 12, 2021.'
          }
        ]
      }
    ]
  );

  // 6. project-budget.pdf (1 Page)
  await createPdf(
    path.join(supportingDir, 'project-budget.pdf'),
    'Itemized Project Budget 2026',
    [
      {
        sections: [
          {
            heading: 'BUDGET SUMMARY AND EXPENDITURE SCHEDULE',
            body: 'Total Project Cost: $25,000.\n\n' +
              '1. Gardening Supplies and Raised Beds: $12,000\n' +
              '2. Community Coordinator (Part-time): $8,000\n' +
              '3. Program Evaluation & Workshop Materials: $5,000'
          }
        ]
      }
    ]
  );

  // 7. financial-statement.pdf (1 Page)
  await createPdf(
    path.join(supportingDir, 'financial-statement.pdf'),
    'Annual Financial Statement 2025',
    [
      {
        sections: [
          {
            heading: 'STATEMENT OF REVENUE AND EXPENSES',
            body: 'Total Operating Revenue: $145,000\nTotal Operating Expenses: $132,000\nNet Operating Surplus: $13,000\nAudited by Certified Public Accountants LLP.'
          }
        ]
      }
    ]
  );

  // 8. project-report.pdf (1 Page)
  await createPdf(
    path.join(supportingDir, 'project-report.pdf'),
    'Community Program Evaluation Report 2025',
    [
      {
        sections: [
          {
            heading: 'PAST HIGHLIGHTS AND OUTCOMES',
            body: 'In 2025, our pilot community initiative served 450 families with agricultural kits and organized 12 hands-on workshops across local community centers.'
          }
        ]
      }
    ]
  );

  console.log('All 8 sample PDF test documents successfully generated!');
}

if (require.main === module) {
  generateAllPdfs().catch(err => {
    console.error('Error generating PDFs:', err);
    process.exit(1);
  });
}

module.exports = { generateAllPdfs };
