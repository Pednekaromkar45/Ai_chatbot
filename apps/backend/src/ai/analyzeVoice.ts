const { callOpenRouter } = require("./openrouterClient");

async function analyzeVoice(transcript: string) {
  const prompt = `
You are an HR communication evaluator.

Analyze the following spoken response:

"${transcript}"

Return ONLY JSON:
{
  "communicationScore": 0-10,
  "confidenceScore": 0-10,
  "clarityScore": 0-10,
  "summary": "brief evaluation"
}
`;

  const response = await callOpenRouter([
    { role: "system", content: "Return only valid JSON." },
    { role: "user", content: prompt }
  ]);

  const match = response.match(/\{[\s\S]*\}/);
  return match ? JSON.parse(match[0]) : null;
}

module.exports = { analyzeVoice };
