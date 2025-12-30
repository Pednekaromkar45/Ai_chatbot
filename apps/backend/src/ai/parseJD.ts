const { callOpenRouter } = require("./openrouterClient");

async function parseJD(jdText: any) {

  const prompt = `
You are an HR Job Description parser.

Extract structured information from the JD below.

JD:
${jdText}

Return ONLY valid JSON in this structure:
{
  "role": "string",
  "min_experience_years": number,
  "max_experience_years": number | null,
  "skills_required": string[],
  "skills_optional": string[],
  "seniority": "Intern" | "Junior" | "Mid" | "Senior"
}
`;

  const response = await callOpenRouter([
    { role: "system", content: prompt }
  ]);

  // 🛡️ Safe JSON extraction (LLM-hardened)
  const jsonMatch = response?.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    console.error("JD parsing failed, raw AI response:", response);
    throw new Error("No JSON found in JD parsing");
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Invalid JD JSON:", jsonMatch[0]);
    throw new Error("JD JSON parsing failed");
  }
}

module.exports = { parseJD };
