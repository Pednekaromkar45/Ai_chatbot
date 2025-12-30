const { callOpenRouter } = require("./openrouterClient");

async function generateReply(contextMessages: any[]) {
  // Convert DB messages → OpenRouter format
  const messages = contextMessages.map((m: any) => ({
    role: m.sender === "candidate" ? "user" : "assistant",
    content: m.content
  }));

  // Add system instruction at top
  messages.unshift({
    role: "system",
    content:
      "You are an HR recruitment assistant. Ask clear, concise screening questions."
  });

  const aiText = await callOpenRouter(messages);
  return aiText;
}

module.exports = { generateReply };
