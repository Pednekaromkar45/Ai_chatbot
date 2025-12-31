const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

/**
 * GET /api/jobs
 */
router.get("/", async (req: any, res: any) => {
  try {
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        location: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

/**
 * GET /api/jobs/:jobId/candidates
 */
router.get("/:jobId/candidates", async (req: any, res: any) => {
  try {
    const { jobId } = req.params;

    const conversations = await prisma.conversation.findMany({
      where: { jobId },
      include: {
        candidate: true,
        screeningResult: true
      }
    });

    const result = conversations.map((conv: any) => ({
      candidateId: conv.candidate.id,
      name: conv.candidate.name,
      phone: conv.candidate.phone,
      overallScore: conv.screeningResult?.overallScore ?? null,
      decision: conv.screeningResult?.decision ?? "review",
      conversationId: conv.id
    }));

    res.json(result);
  } catch (error) {
    console.error("Failed to fetch candidates", error);
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
});

module.exports = router;
