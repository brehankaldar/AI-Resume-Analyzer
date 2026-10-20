const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const env = require("./config/env");
const { connectDB } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");
const resumeRouter = require("./routes/resumes");
const historyRouter = require("./routes/history");
const versionsRouter = require("./routes/versions");
const insightsRouter = require("./routes/insights");
const dashboardRouter = require("./routes/dashboard");


const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: true, // reflect request origin - allows everything while keeping credentials working
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());


if (!env.isProd) {
  app.use(morgan("dev"));
}
app.get("/", (req, res) => {
  res.json({
    message: "AI Resume Checker API is running"
  });
})

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/history", historyRouter);
app.use("/api/versions", versionsRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use(notFound);
app.use(errorHandler);
async function start() {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port} in ${env.nodeEnv} mode`);
    });
  } catch (err) {
    console.error("Error starting server:", err.message);
    process.exit(1);
  }
}
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);

});

start();
module.exports = app;