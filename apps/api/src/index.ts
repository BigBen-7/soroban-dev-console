import { prisma } from "./lib/prisma.js";
import { createApp } from "./app.js";

const app = createApp();
const port = 4000;

  await app.listen(port);
  console.log(`API server listening on http://localhost:${port}`);
}

bootstrap().catch(async (err) => {
  console.error("Failed to start API server", err);
  await prisma.$disconnect();
  process.exit(1);
});
