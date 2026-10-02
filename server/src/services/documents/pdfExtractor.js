const pdfParse = require('pdf-parse');
const fs = require('fs');
const logger = require('../../config/logger');

/**
 * Extracts text and structured page chunks from a PDF buffer or file path
 * Preserves page numbers and chunk IDs for precise citations.
 */
async function extractPdfContent(filePathOrBuffer, originalFileName = 'document.pdf') {
  let dataBuffer;
  
  if (Buffer.isBuffer(filePathOrBuffer)) {
    dataBuffer = filePathOrBuffer;
  } else if (typeof filePathOrBuffer === 'string') {
    dataBuffer = fs.readFileSync(filePathOrBuffer);
  } else {
    throw new Error('Invalid input for PDF extraction. Expected Buffer or file path.');
  }

  const pages = [];
  let pageCounter = 0;

  // Custom page renderer hook to extract text page-by-page
  const renderPage = (pageData) => {
    return pageData.getTextContent().then((textContent) => {
      pageCounter++;
      let pageText = '';
      let currentSection = 'General';

      for (const item of textContent.items) {
        const text = item.str;
        pageText += text + ' ';

        // Basic heuristic for section detection: all caps or typical section keywords
        if (text && text.trim().length > 3 && text.trim().length < 60) {
          const trimmed = text.trim();
          if (
            /^(SECTION|PART|ELIGIBILITY|REQUIREMENTS|PROJECT DESCRIPTION|BUDGET|GOVERNANCE|EVALUATION|APPLICATION GUIDELINES|ORGANIZATION)/i.test(trimmed) ||
            (trimmed === trimmed.toUpperCase() && !trimmed.match(/^\d+$/) && trimmed.length > 4)
          ) {
            currentSection = trimmed;
          }
        }
      }

      const cleanText = pageText.replace(/\s+/g, ' ').trim();
      pages.push({
        pageNumber: pageCounter,
        section: currentSection,
        text: cleanText
      });

      return pageText;
    });
  };

  try {
    const parsedData = await pdfParse(dataBuffer, {
      pagerender: renderPage
    });

    const fullText = parsedData.text ? parsedData.text.replace(/\s+/g, ' ').trim() : '';

    if (!fullText || fullText.length === 0) {
      throw new Error('PDF file has no extractable text content (scanned or image-only PDFs require OCR which is not supported).');
    }

    // Build structured chunks
    const chunks = pages.map((p, idx) => ({
      chunkId: `chunk-${String(idx + 1).padStart(3, '0')}`,
      pageNumber: p.pageNumber,
      section: p.section || 'General',
      text: p.text
    }));

    logger.info('Extracted PDF content successfully', {
      event: 'document_text_extracted',
      fileName: originalFileName,
      pageCount: parsedData.numpages || pages.length,
      chunkCount: chunks.length,
      textLength: fullText.length
    });

    return {
      pageCount: parsedData.numpages || pages.length,
      extractedText: fullText,
      chunks: chunks
    };
  } catch (error) {
    logger.error('Failed to parse PDF', {
      event: 'document_extraction_failed',
      fileName: originalFileName,
      error: error.message
    });
    throw error;
  }
}

module.exports = {
  extractPdfContent
};
