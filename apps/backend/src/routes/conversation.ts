const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

/**
 * Start a new conversation
 */
router.post("/start", async (req: any, res: any) => {
  try {
    console.log("REQ BODY RECEIVED:", req.body);
    
    const body = req.body || {};
    const { name, phone, email, jobId } = body;
    if (!name || !phone || !jobId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1️⃣ Create candidate
    const candidate = await prisma.candidate.create({
      data: {
        name,
        phone,
        email
      }
    });

    // 2️⃣ Create conversation
    const conversation = await prisma.conversation.create({
      data: {
        candidateId: candidate.id,
        jobId,
        status: "in_progress"
      }
    });

    res.json({
      conversationId: conversation.id,
      candidateId: candidate.id,
      message: "Conversation started successfully"
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
