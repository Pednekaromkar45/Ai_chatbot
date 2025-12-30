const prisma = require("../prisma");

/**
 * Decide next system message based on conversation history
 */
async function getNextBotMessage(conversationId: string) {
  // 1️⃣ Fetch all messages for this conversation
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" }
  });

  // Count candidate replies
  const candidateMessages = messages.filter(
    (m: any) => m.sender === "candidate"
  );

  // 2️⃣ Simple rule-based flow
  if (candidateMessages.length === 1) {
    return "Great! Can you tell me about your experience?";
  }

  if (candidateMessages.length === 2) {
    return "What is your current salary and expected salary?";
  }

  if (candidateMessages.length >= 3) {
    return null; // conversation complete
  }

  return null;
}

module.exports = { getNextBotMessage };
