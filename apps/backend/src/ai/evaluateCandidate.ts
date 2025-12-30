const { callOpenRouter } = require("./openrouterClient");

async function evaluateCandidate({ messages, job }: any) {

  const prompt = `
You are an HR evaluation engine.

Job Requirements (Structured):
${JSON.stringify(job.parsed_jd, null, 2)}

Original Job Description (Reference):
${job.description}

Candidate Conversation:
${messages.map((m: any) => `- ${m.sender}: ${m.content}`).join("\n")}

Evaluation Rules:
- Prioritize REQUIRED skills from Job Requirements
- Score based on RELEVANT experience, not total experience
- Penalize missing mandatory details (e.g., salary if asked)
- Do not assume skills not explicitly mentioned
- Be fair with freshers and junior candidates

Return ONLY valid JSON in this structure:
{
  "skillScore": 0-10,
  "communicationScore": 0-10,
  "confidenceScore": 0-10,
  "willingnessScore": 0-10,
  "overallScore": 0-10,
  "decision": "shortlist" | "review" | "reject",
  "summary": "Clear explanation referencing job requirements"
}
`;

  const response = await callOpenRouter([
    {
      role: "system",
      content: "You are a strict JSON API. You must return ONLY valid JSON. No markdown, no explanation."
    },
    {
      role: "user",
      content: prompt
    }
  ]);

  if (!response || typeof response !== "string") {
    console.error("Empty or invalid AI response:", response);
    throw new Error("AI returned empty response");
  }

  const jsonMatch = response.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    console.error("AI response did not contain JSON:", response);

    return {
      skillScore: 0,
      communicationScore: 0,
      confidenceScore: 0,
      willingnessScore: 0,
      overallScore: 0,
      decision: "review",
      summary: "AI evaluation could not be completed reliably. Manual review required."
    };
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Failed to parse extracted JSON:", jsonMatch[0]);
    throw new Error("AI evaluation parsing failed");
  }
}

module.exports = { evaluateCandidate };
