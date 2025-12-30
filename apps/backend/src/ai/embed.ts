const { callOpenRouter } = require("./openrouterClient");

/**
 * Generate embedding vector safely (OpenRouter-compatible)
 */
async function generateEmbedding(text: string) {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid text for embedding");
  }

  const response = await callOpenRouter(
    [
      {
        role: "system",
        content: "Return ONLY a numeric embedding array like [0.1, 0.2, 0.3]"
      },
      {
        role: "user",
        content: text
      }
    ],
    {
      task: "embedding"
    }
  );

  if (!response || typeof response !== "string") {
    console.error("Empty embedding response:", response);
    throw new Error("Embedding generation failed");
  }

  // 🔍 Extract numeric array from text
  const match = response.match(/\[([0-9eE.,\s\-]+)\]/);

  if (!match) {
    console.error("No numeric array found in embedding response:", response);
    throw new Error("Embedding parsing failed");
  }

  let embedding;

  try {
    embedding = JSON.parse(match[0]);
  } catch (err) {
    console.error("Failed to parse embedding array:", match[0]);
    throw new Error("Embedding JSON parsing failed");
  }

  // 🛡️ Final validation
  if (!Array.isArray(embedding) || embedding.length === 0) {
    console.error("Invalid embedding array:", embedding);
    throw new Error("Embedding validation failed");
  }

  return embedding;
}

module.exports = { generateEmbedding };
