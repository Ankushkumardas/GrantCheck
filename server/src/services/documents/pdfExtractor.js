const fs = require('fs');
const logger = require('../../config/logger');

// Load pdfjs-dist legacy build for Node.js CommonJS
let pdfjsLib;
try {
  pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
} catch (e) {
  try {
    pdfjsLib = require('pdfjs-dist');
  } catch (err) {
    logger.warn('pdfjs-dist not available, falling back to pdf-parse', { error: err.message });
  }
}
const pdfParse = require('pdf-parse');

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

  // Attempt extraction via modern pdfjs-dist first
  if (pdfjsLib && pdfjsLib.getDocument) {
    try {
      const uint8Array = new Uint8Array(dataBuffer);
      const loadingTask = pdfjsLib.getDocument({
        data: uint8Array,
        useSystemFonts: true,
        disableFontFace: true,
        stopAtErrors: false
      });

      const doc = await loadingTask.promise;
      const numPages = doc.numPages;
      const pages = [];
      let fullTextParts = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        let pageText = '';
        let currentSection = 'General';

        for (const item of textContent.items) {
          const text = item.str || '';
          pageText += text + ' ';

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
        if (cleanText) {
          fullTextParts.push(cleanText);
        }

        pages.push({
          pageNumber: i,
          section: currentSection,
          text: cleanText
        });
      }

      const fullText = fullTextParts.join('\n\n').trim();

      if (!fullText || fullText.length === 0) {
        throw new Error('PDF file has no extractable text content (scanned or image-only PDFs require OCR which is not supported).');
      }

      const chunks = pages.map((p, idx) => ({
        chunkId: `chunk-${String(idx + 1).padStart(3, '0')}`,
        pageNumber: p.pageNumber,
        section: p.section || 'General',
        text: p.text
      }));

      logger.info('Extracted PDF content successfully via pdfjs-dist', {
        event: 'document_text_extracted',
        fileName: originalFileName,
        pageCount: numPages,
        chunkCount: chunks.length,
        textLength: fullText.length
      });

      return {
        pageCount: numPages,
        extractedText: fullText,
        chunks: chunks
      };
    } catch (pdfjsErr) {
      logger.warn('pdfjs-dist extraction failed, falling back to pdf-parse', {
        error: pdfjsErr.message
      });
      // Fall through to pdf-parse below
    }
  }

  // Fallback to pdf-parse
  const pages = [];
  let pageCounter = 0;

  const renderPage = (pageData) => {
    return pageData.getTextContent().then((textContent) => {
      pageCounter++;
      let pageText = '';
      let currentSection = 'General';

      for (const item of textContent.items) {
        const text = item.str;
        pageText += text + ' ';

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

    const chunks = pages.map((p, idx) => ({
      chunkId: `chunk-${String(idx + 1).padStart(3, '0')}`,
      pageNumber: p.pageNumber,
      section: p.section || 'General',
      text: p.text
    }));

    logger.info('Extracted PDF content successfully via pdf-parse', {
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
