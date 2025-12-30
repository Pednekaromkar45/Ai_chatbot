const prisma = require("../prisma");
const { callOpenRouter } = require("./openrouterClient");

/**
 * Generate AI reply for chat using RAG context
 */
async function generateReply({ conversationId, context = [] }: any) {
  // 1️⃣ Fetch recent conversation messages (limit to avoid token explosion)
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 10
  });

  const conversationText = messages
    .map((m: any) => `${m.sender}: ${m.content}`)
    .join("\n");

  // 2️⃣ Build prompt with RAG context
  const prompt = `
You are an HR assistant chatbot.

Relevant job information (use this if relevant):
${context.length ? context.map((c: string) => `- ${c}`).join("\n") : "None"}

Conversation so far:
${conversationText}

Rules:
- Answer ONLY using the relevant job information when available
- If the information is not present, say: "I will confirm this with the recruiter."
- Do NOT invent requirements or policies
- Keep answers short, clear, and professional
`;

  // 3️⃣ Call OpenRouter with strict system control
  const response = await callOpenRouter([
    {
      role: "system",
      content:
        "You are a professional HR chatbot. Never hallucinate. If unsure, say you will confirm with the recruiter."
    },
    {
      role: "user",
      content: prompt
    }
  ]);

  // 4️⃣ Hard guard for empty / invalid response
  if (!response || typeof response !== "string") {
    console.error("AI returned empty reply:", response);
    return "I will confirm this with the recruiter.";
  }

  // 5️⃣ Return clean reply
  return response.trim();
}

module.exports = { generateReply };
