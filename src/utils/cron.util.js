const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    const result = await prisma.event.updateMany({
      where: {
        expires_at: {
          lt: new Date(),
        },
        is_expired: false,
      },
      data: {
        is_expired: true,
      },
    });

    console.log(`[CRON] Updated ${result.count} expired events`);
  } catch (error) {
    console.error("[CRON ERROR]", error);
  }
});
