const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Takes a plain sentence like:
 * "Need O negative blood urgently for my father in City Hospital, Dehradun"
 * and returns { bloodType, city, urgency }
 */
const parseRequestText = async (text) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  const prompt = `
You are a data-extraction assistant. Read the sentence below and extract:
- bloodType: one of A+, A-, B+, B-, AB+, AB-, O+, O-
- city: the city name mentioned
- urgency: one of "low", "medium", "high" (default to "medium" if unclear)

Respond ONLY with valid JSON in this exact format, nothing else, no markdown, no backticks:
{"bloodType": "", "city": "", "urgency": ""}

Sentence: "${text}"
`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("AI could not parse the request text");
  }
};

module.exports = { parseRequestText };
