import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// ====== STREAM SERVER ======
const BASE = "http://mypanel-4k.com:80/rmt8r91bac/tsleey7v5g";

// ====== CHANNEL ======
app.get("/ch/:id", async (req, res) => {
  const id = req.params.id;

  const streamUrl = `${BASE}/${id}.ts`;

  try {
    const response = await fetch(streamUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "http://mypanel-4k.com/"
      }
    });

    res.setHeader("Content-Type", "video/mp2t");

    response.body.pipe(res);

  } catch (err) {
    res.status(500).send("Stream error");
  }
});

// ===== HOME =====
app.get("/", (req, res) => {
  res.send("TIEA IPTV PROXY RUNNING");
});

// ===== PORT =====
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("TIEA IPTV Proxy running on", PORT);
});
