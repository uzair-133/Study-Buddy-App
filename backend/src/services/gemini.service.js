const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const FALLBACK_MODELS = [process.env.GEMINI_MODEL, "gemini-3.8-flash", "gemini-3.7-flash"].filter(Boolean);

// 1. Generate Quiz Content (MCQs ya Questions Only)
const generateQuizContent = async ({
  textContent = "",
  fileBuffer = null,
  mimeType = "application/pdf",
  difficulty = "medium",
  mode = "mcq",
  questionCount = 10,
  subjectName = "",
  chapterName = "",
}) => {
  // A. Format Instruction (MCQs ya direct Questions)
  const formatInstructions =
    mode === "mcq"
      ? `Generate exactly ${questionCount} MCQs with 4 options each and a correctAnswer.
JSON Structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A"
  }
]`
      : `Generate exactly ${questionCount} study questions without options.
JSON Structure:
[
  {
    "question": "Question text here?"
  }
]`;

  // B. Complete Prompt
  const prompt = `
You are an expert academic tutor.
Subject: ${subjectName || "General"} | Chapter: ${chapterName || "General"}
Difficulty: ${difficulty.toUpperCase()}

${formatInstructions}

Content / Material:
${fileBuffer ? "Carefully read and analyze the attached document." : textContent}

Rules:
- Respond STRICTLY with a valid JSON array.
- No markdown formatting or extra text outside the JSON.
`;

  // C. Multimodal payload (text + optional file buffer)
  const contents = [prompt];
  if (fileBuffer) {
    contents.push({
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: mimeType || "application/pdf",
      },
    });
  }

  // D. Call Gemini Model with fallback
  let lastError = null;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: "application/json" },
      });

      const result = await model.generateContent(contents);
      const text = result.response.text();

      // Clean & parse JSON
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to generate quiz content");
};

// 2. AI Assistant Follow-Up Answer
const askQuizAssistant = async ({ questionsText = "", userQuery }) => {
  const prompt = `
You are a helpful AI study assistant.
${questionsText ? `Study Context:\n${questionsText}\n` : ""}
Student Question: "${userQuery}"

Provide a clear, simple, step-by-step answer in plain language so the student can understand easily.
`;

  let lastError = null;
  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to get assistant answer");
};

module.exports = {
  generateQuizContent,
  askQuizAssistant,
};
