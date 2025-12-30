const express = require("express");
const prisma = require("../prisma");
const { evaluateCandidate } = require("../ai/evaluateCandidate");

const router = express.Router();

/**
 * Final AI screening evaluation
 */
router.post("/:conversationId", async (req: any, res: any) => {
  try {
    const { conversationId } = req.params;

    // 1️⃣ Fetch conversation with job + messages
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        job: true,
        messages: {
          orderBy: { createdAt: "asc" }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // 2️⃣ Prevent duplicate evaluation
    const existing = await prisma.screeningResult.findUnique({
      where: { conversationId }
    });

    if (existing) {
      return res.json({
        message: "Evaluation already exists",
        result: existing
      });
    }

    // 3️⃣ Run AI evaluation (TEXT ONLY for now)
    const evaluation = await evaluateCandidate({
      messages: conversation.messages,
      job: conversation.job
    });

    // 4️⃣ Save result
    const saved = await prisma.screeningResult.create({
      data: {
        conversationId,
        skillScore: evaluation.skillScore,
        communicationScore: evaluation.communicationScore,
        confidenceScore: evaluation.confidenceScore,
        willingnessScore: evaluation.willingnessScore,
        overallScore: evaluation.overallScore,
        decision: evaluation.decision,
        aiSummary: evaluation.summary
      }
    });

    res.json({
      message: "Evaluation completed",
      result: saved
    });

  } catch (err) {
    console.error("Evaluation error:", err);
    res.status(500).json({ error: "Evaluation failed" });
  }
});

module.exports = router;
