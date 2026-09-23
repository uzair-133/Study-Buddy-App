const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Service to generate Quiz content (MCQs or Questions Only) using Google Gemini AI.
 * Uses current Google recommended models (gemini-3.5-flash-lite, gemini-3.6-flash, gemini-3.7-flash)
 * with robust retry & fallback handling for 100% high availability.
 */

const generateQuizContent = async ({
  textContent,
  fileBuffer,
  mimeType,
  difficulty = "medium",
  mode = "mcq",
  questionCount = 10,
  subjectName = "",
  chapterName = ""
}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Active Google recommended models (v1beta updated models)
  const candidateModels = [
    process.env.GEMINI_MODEL,
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.5-flash"
  ].filter(Boolean);

  // 1. Difficulty instruction mapping
  let difficultyInstruction = "";
  const normalizedDifficulty = String(difficulty).toLowerCase();

  switch (normalizedDifficulty) {
    case "easy":
      difficultyInstruction =
        "Difficulty Level: EASY. Simple, seedhe sawaalat banao jo basic concepts test karein, seedhi language mein.";
      break;
    case "difficult":
    case "hard":
      difficultyInstruction =
        "Difficulty Level: DIFFICULT. Complex, multi-step reasoning wale sawaalat banao, jo deep understanding test karein.";
      break;
    case "medium":
    default:
      difficultyInstruction =
        "Difficulty Level: MEDIUM. Thode analytical sawaalat banao jo concepts ko connect karein.";
      break;
  }

  // 2. Mode instruction & JSON structure mapping
  let modeInstruction = "";
  const normalizedMode = String(mode).toLowerCase();

  if (normalizedMode === "mcq") {
    modeInstruction = `
Mode: MCQs (Multiple Choice Questions).
Task: ${questionCount} MCQs banao, har ek ke 4 options (A, B, C, D) ke saath, aur sahi answer (correctAnswer) bhi batao.
Required JSON format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A"
  }
]
    `;
  } else {
    modeInstruction = `
Mode: Questions Only (Direct study questions).
Task: ${questionCount} sirf questions banao (bina options, bina answers ke).
Required JSON format:
[
  {
    "question": "Question text here?"
  }
]
    `;
  }

  // Context details
  const contextDetails = [];
  if (subjectName) contextDetails.push(`Subject: ${subjectName}`);
  if (chapterName) contextDetails.push(`Chapter: ${chapterName}`);
  const contextHeader = contextDetails.length > 0 ? contextDetails.join(" | ") + "\n" : "";

  // Prompt Text
  const promptText = `
You are an expert academic tutor and quiz generator for students.
${contextHeader}
${difficultyInstruction}
${modeInstruction}

${
  fileBuffer
    ? "Analyze the attached document/PDF file carefully and generate the quiz directly from its contents."
    : `Content / Material to generate quiz from:
"""
${textContent || "General concept questions based on subject title."}
"""`
}

CRITICAL INSTRUCTION:
- Respond STRICTLY with valid JSON array containing exactly ${questionCount} question objects.
- Do NOT add markdown code fences, explanation text, or extra wrapper objects outside the array.
  `;

  // Prepare Gemini payload contents (supports Multimodal PDF/Image buffers)
  const contents = [promptText];

  if (fileBuffer) {
    contents.push({
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: mimeType || "application/pdf"
      }
    });
  }

  let lastError = null;

  // Try candidate models with 2 retry attempts per model for network resilience
  for (const modelName of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json"
          }
        });

        const result = await model.generateContent(contents);
        const responseText = result.response.text();

        // Clean JSON response (strip ```json wrapper if present)
        const cleanedText = responseText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const parsedData = JSON.parse(cleanedText);

        if (!Array.isArray(parsedData)) {
          throw new Error("Gemini response is not a valid JSON array.");
        }

        return parsedData;
      } catch (error) {
        lastError = error;
        if (attempt < 2 && (error.message.includes("503") || error.message.includes("high demand"))) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  }

  console.error("All Gemini candidate models failed in generateQuizContent:", lastError?.message);
  throw new Error(`Failed to generate quiz: ${lastError?.message || "Gemini service temporarily unavailable"}`);
};

/**
 * Service function for student AI assistant follow-up chat.
 * Provides clear conversational answers for study questions.
 */
const askQuizAssistant = async ({ questionsText = "", userQuery }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const candidateModels = ["gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-3.7-flash"];

  const prompt = `
You are a helpful, encouraging AI study assistant for students.
${questionsText ? `Study Questions Context:\n"""\n${questionsText}\n"""` : ""}

Student Query: "${userQuery}"

Provide a clear, step-by-step, easy-to-understand answer in clear natural language.
Use formatting, numbers, or bullet points to make it super easy for the student to learn.
  `;

  let lastError = null;
  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(lastError?.message || "Failed to get AI assistant answer");
};

module.exports = {
  generateQuizContent,
  askQuizAssistant
};
