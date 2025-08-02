const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const routes = require("./src/routes/index.route");

// Initialize express.js ap
const app = express();

//update the numbers if the number of proxy increase
app.set("trust proxy", 1);

// Define Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["https://kongres.lovable.app", "https://kongres.vercel.app"],
    credentials: true, // Allow cookies and authentication headers
  })
);

app.use(cookieParser()); // Parse cookies in request headers
app.use(morgan("common"));
app.use(helmet());

// Define the base of all routes
app.use("/v1", routes);

// Simple test route to verify the app is working
app.get("/", (req, res) => {
  res.status(200).send("Hello, world! Meetvo backend app is running!");
});

// Get the port from environment variables (default to 3000 if not set)
const port = process.env.PORT || 5000;

// Start the server
async function startServer() {
  try {
    await prisma.$connect(); // 🔌 Try connecting to the DB
    console.log("Connected to the database");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to the database", err);
    process.exit(1); // Exit process if DB connection fails
  }
}

startServer();

// Run events expiry cron job
require("./src/utils/cron.util");
