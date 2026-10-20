const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");
const env = require("../config/env");
// const { text } = require("express");
const ai = env.geminiApiKey ? new GoogleGenAI({ apiKey: env.geminiApiKey }) : null;
console.log("=================================");
console.log("GEMINI API KEY LOADED:", !!env.geminiApiKey);
console.log("GEMINI MODEL:", env.geminiModel);
console.log("AI INITIALIZED:", !!ai);
console.log("=================================");
const linkSchema = {
    type: Type.OBJECT,
    properties: {
        label: { type: Type.STRING },
        url: { type: Type.STRING },
    },
};
const responseSchema = {
    type: Type.OBJECT,
    required: ["basics", "experience", "summary", "skills", "education", "projects", "certifications", "languages", "interests"],
    properties: {
        basics: {
            type: Type.OBJECT,
            required: ["name", "title", "location", "email", "phone", "links"],
            properties: {
                name: { type: Type.STRING },
                title: { type: Type.STRING },
                location: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                links: {
                    type: Type.ARRAY,
                    items: linkSchema
                }
            }
        },
        summary: { type: Type.STRING },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                required: ["company", "role", "period", "bullets"],
                properties: {
                    company: { type: Type.STRING },
                    role: { type: Type.STRING },
                    location: { type: Type.STRING },
                    period: { type: Type.STRING },
                    bullets: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        },

        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                required: [
                    "degree",
                    "school",
                    "location",
                    "period",
                    "details"
                ],
                properties: {
                    degree: { type: Type.STRING },
                    school: { type: Type.STRING },
                    location: { type: Type.STRING },
                    period: { type: Type.STRING },
                    details: { type: Type.STRING }
                }
            }
        },

        skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        projects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                required: ["name", "description"],
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    tech: { type: Type.ARRAY, items: { type: Type.STRING } },
                    links: {
                        type: Type.ARRAY,
                        items: linkSchema
                    },
                },
            },
        },
        certifications: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                required: ["name"],
                properties: {
                    name: { type: Type.STRING },
                    issuer: { type: Type.STRING },
                    year: { type: Type.STRING },
                },
            },
        },
        languages: { type: Type.ARRAY, items: { type: Type.STRING } },
        interests: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
};

const validator = z.object({
    basics: z.object({
        name: z.string().default(""),
        title: z.string().default(""),
        location: z.string().default(""),
        email: z.string().default(""),
        phone: z.string().default(""),
        links: z.array(
            z.object({
                label: z.string(),
                url: z.string(),
            })
        ).default([]),
    }).default({
        name: "",
        title: "",
        location: "",
        email: "",
        phone: "",
        links: [],
    }),

    summary: z.string().default(""),

    experience: z.array(
        z.object({
            company: z.string().default(""),
            role: z.string().default(""),
            location: z.string().default(""),
            period: z.string().default(""),
            bullets: z.array(z.string()).default([]),
        })
    ).default([]),

    education: z.array(
        z.object({
            degree: z.string().default(""),
            school: z.string().default(""),
            location: z.string().default(""),
            period: z.string().default(""),
            details: z.string().default(""),
        })
    ).default([]),

    skills: z.array(z.string()).default([]),

    projects: z.array(
        z.object({
            name: z.string().default(""),
            description: z.string().default(""),
            tech: z.array(z.string()).default([]),
            links: z.array(
                z.object({
                    label: z.string(),
                    url: z.string(),
                })
            ).default([]),
        })
    ).default([]),

    certifications: z.array(
        z.object({
            name: z.string().default(""),
            issuer: z.string().default(""),
            year: z.string().default(""),
        })
    ).default([]),

    languages: z.array(z.string()).default([]),

    interests: z.array(z.string()).default([]),
});

function buildPrompt(rawText) {
    return [
        "You are a resume parser. The input is text extracted from a PDF — lines may be jumbled or out of natural reading order.",
        "",
        "Extract structured data:",
        "- basics: name, professional title, location, email, phone, social links (LinkedIn / GitHub / portfolio etc.; label like \"LinkedIn\", full URL).",
        "- summary: the professional summary paragraph (rejoin if split across lines).",
        "- experience: jobs post recent first, with company, role, period (preserve original date format), location if available, and bullet points.",
        "- education: degree, school, period, location, optional details.",
        "- skills: flat array of technical skills.",
        "- projects: name, one-sentence description, optional tech tags, optional links.",
        "- certifications: name, issuer, year.",
        "- languages: flat array.",
        "- interests: flat array.",
        "",
        "Rules:",
        "- Be conservative: omit fields that are not clearly present. Use empty strings/arrays where missing.",
        "- Do not invent or paraphrase facts. Extract verbatim where possible.",
        "- Each experience bullet should read as a complete sentence.",
        "- Preserve original date formats (e.g. \"Jan 2022 - Dec 2023\").",
        "",
        "RESUME TEXT:",
        "================",
        rawText,
        "================",
    ].join("\n");
}

const EMPTY = {
    basics: {
        name: "",
        title: "",
        location: "",
        email: "",
        phone: "",
        links: [],
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    interests: [],
};
async function parseResume(rawText) {
    if (!ai || !rawText?.trim()) {
        console.log("Gemini AI not initialized or resume text is empty");
        return EMPTY;
    }

    const prompt = buildPrompt(rawText);

    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            console.log(`Resume parsing attempt ${attempt}...`);

            const result = await ai.models.generateContent({
                model: env.geminiModel,
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],
                config: {
                    responseMimeType: "application/json",
                    responseSchema,
                    temperature: 0.1,
                },
            });

            console.log("Gemini response received");

            const text =
                typeof result.text === "function"
                    ? result.text()
                    : result.text;

            console.log("Gemini raw response:");
            console.log(text);

            if (!text) {
                throw new Error("Gemini returned an empty response");
            }

            const parsed = JSON.parse(text);

            console.log("JSON parsed successfully");

            const validated = validator.parse(parsed);

            console.log("Zod validation successful");

            return validated;

        } catch (err) {
            console.error(`Resume parsing attempt ${attempt} failed`);
            console.error("Error message:", err.message);
            console.error("Full error:", err);

            if (attempt === 2) {
                console.error(
                    "Failed to parse resume after 2 attempts."
                );
                throw err;
            }
        }
    }

    return EMPTY;
}
module.exports = { parseResume }