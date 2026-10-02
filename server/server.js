require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

connectDB();

app.set("trust proxy", 1); // needed behind Render's proxy

app.use(helmet());
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean),
  })
);
app.use(express.json({ limit: "10kb" }));

app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }));
app.use("/api/requests", rateLimit({ windowMs: 60 * 60 * 1000, max: 30 }));

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/requests", requestRoutes);

app.get("/", (req, res) => res.send("Blood Donor Matching API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));