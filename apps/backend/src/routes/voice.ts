const express = require("express");
const multer = require("multer");
const prisma = require("../prisma");
const { transcribeAudio } = require("../ai/transcribeAudio");
const { analyzeVoice } = require("../ai/analyzeVoice");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * Upload voice answer, transcribe, and analyze
 */
router.post("/upload", upload.single("audio"), async (req: any, res: any) => {
  try {
    const { conversationId, question } = req.body;
    const file = req.file;

    if (!conversationId || !file) {
      return res.status(400).json({ error: "Missing data" });
    }

    // 1️⃣ Save voice metadata
    const voice = await prisma.voiceResponse.create({
      data: {
        conversationId,
        question,
        audioUrl: file.path
      }
    });

    // 2️⃣ Transcribe audio (STT)
    let transcript = "";
    try {
      transcript = await transcribeAudio(file.path);
    } catch (err) {
      console.error("Transcription failed:", err);
    }

    // 3️⃣ Analyze voice transcript
    let analysis = null;
    if (transcript) {
      try {
        analysis = await analyzeVoice(transcript);
      } catch (err) {
        console.error("Voice analysis failed:", err);
      }
    }

    // 4️⃣ Update DB with transcript (and later analysis if needed)
    await prisma.voiceResponse.update({
      where: { id: voice.id },
      data: {
        transcript
        // You can later add analysis fields here
      }
    });

    res.json({
      voiceResponseId: voice.id,
      transcript,
      analysis,
      message: "Voice processed successfully"
    });

  } catch (err) {
    console.error("Voice upload error:", err);
    res.status(500).json({ error: "Voice upload failed" });
  }
});

module.exports = router;
