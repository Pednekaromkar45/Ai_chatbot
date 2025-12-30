const prisma = require("../prisma");
const { generateEmbedding } = require("./embed");

async function retrieveKnowledge(query: string, limit = 3) {
  if (!query || typeof query !== "string") {
    return [];
  }

  let embedding;

    try {
    embedding = await Promise.race([
        generateEmbedding(query),
        new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Embedding timeout")), 2000)
        )
    ]);
    } catch (err) {
    console.error("Embedding failed or timed out:", err);
    return [];
    }


  const results = await prisma.$queryRawUnsafe(`
    select * from match_knowledge(
      '${JSON.stringify(embedding)}',
      ${limit}
    )
  `);

  return results.map((r: any) => r.content);
}

module.exports = { retrieveKnowledge };

