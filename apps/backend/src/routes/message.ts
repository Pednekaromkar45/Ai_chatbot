const express = require("express");
const prisma = require("../prisma");
const { getNextBotMessage } = require("../flow/conversationFlow");
const { retrieveKnowledge } = require("../ai/retrieveKnowledge");
const { generateReply } = require("../ai/generateReply");

const router = express.Router();

/**
 * Store a chat message and trigger flow engine / AI reply
 */
router.post("/", async (req: any, res: any) => {
  try {
    const body = req.body || {};
    const { conversationId, sender, type, content } = body;

    if (!conversationId || !sender || !type || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1️⃣ Store incoming message (candidate or AI)
    const message = await prisma.message.create({
      data: {
        conversationId,
        sender,
        type,
        content
      }
    });

    // 2️⃣ Auto-reply ONLY if candidate sent the message
    if (sender === "candidate") {

      // 🔍 RAG: retrieve relevant JD / FAQ context
      let relevantContext: string[] = [];

    try {
        relevantContext = await Promise.race([
        retrieveKnowledge(content),
        new Promise<string[]>((resolve) =>
        setTimeout(() => resolve([]), 2000) // ⏱️ 2 sec max
        )
      ]);
    } catch (err) {
    console.error("RAG retrieval failed:", err);
    }


      // 🧠 Rule-based flow engine first (experience, salary, etc.)
      const flowReply = await getNextBotMessage(conversationId);

      let finalReply = flowReply;

      // 🤖 If flow engine has no scripted reply → use AI + RAG
      if (!flowReply) {
        finalReply = await generateReply({
          conversationId,
          context: relevantContext
        });
      }

      // 3️⃣ Store AI reply (if any)
      if (finalReply) {
        await prisma.message.create({
          data: {
            conversationId,
            sender: "ai",
            type: "text",
            content: finalReply
          }
        });
      }
    }

    res.json({
      messageId: message.id,
      status: "Message stored successfully"
    });

  } catch (error: any) {
    console.error("Message API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Fetch all messages for a conversation (chat replay)
 */
router.get("/:conversationId", async (req: any, res: any) => {
  try {
    const { conversationId } = req.params;

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" }
    });

    res.json(messages);

  } catch (error: any) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
