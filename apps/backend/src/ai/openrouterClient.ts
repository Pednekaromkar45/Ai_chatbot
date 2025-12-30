

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function callOpenRouter(messages: any[]) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost", // required by OpenRouter
      "X-Title": "Zodiac HR Chatbot"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct", // FREE / cheap
      messages,
      temperature: 0.4
    })
  });

  const data = await response.json();

  return data.choices?.[0]?.message?.content || null;
}

module.exports = { callOpenRouter };
