const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

/**
 * Store a chat message
 */
router.post("/", async (req: any, res: any) => {
  try {
    const body = req.body || {};
    const { conversationId, sender, type, content } = body;

    if (!conversationId || !sender || !type || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        sender,
        type,
        content
      }
    });

    res.json({
      messageId: message.id,
      status: "Message stored"
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
