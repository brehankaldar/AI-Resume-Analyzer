const { PDFParse } = require("pdf-parse");
const ApiError = require("../utils/ApiError");

async function extractText(buffer) {
    let parser;
    try {
        parser = new PDFParse({ data: buffer });
        const result = await parser.getText();

        const text = (result.text || "").trim();
        if (!text || text.length < 50) {
            throw ApiError.badRequest("Could not extract readable text from the PDF. Please ensure the PDF contains readable text.");
        }
        return {
            text,
            meta: {
                numPages: result.numpages?.length ?? result.numpages ?? null,
            },
        }
    } catch (error) {
        if (error.isOperational)
            throw error;
        throw ApiError.badRequest("Failed to parse PDF" + error.message);
    }
    finally {
        try {
            await parser?.destroy?.();
        }
        catch {

        }
    }
}

module.exports = { extractText }