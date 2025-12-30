const express = require("express");
const prisma = require("../prisma");
const { parseJD } = require("../ai/parseJD");

const router = express.Router();

/**
 * Parse and store JD for a job
 */
router.post("/:jobId/parse-jd", async (req: any, res: any) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: "Job not found" });

    const parsed = await parseJD(job.description);

    await prisma.job.update({
      where: { id: jobId },
      data: { parsed_jd: parsed }
    });

    res.json({
      message: "JD parsed successfully",
      parsedJD: parsed
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "JD parsing failed" });
  }
});

module.exports = router;
