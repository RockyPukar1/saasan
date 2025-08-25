import app from "./app";
import db from "./config/database";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await db.raw("SELECT 1+1 as result");
    console.log("✅ Database connected successfully");

    // start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.log("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
