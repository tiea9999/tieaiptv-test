import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();   // 👈 ตัวนี้หายไป ทำให้ error
app.use(cors());

// ===== CONFIG =====
const BASE_URL = "http://103.114.203.129:8080";
const USER = "ott168";
const PASS = "ott168";

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("TIEA IPTV Dynamic Proxy running");
});

// ===== OTT PROXY (รองรับ 1–54000 + OFFSET) =====
app.get("/ott/:ch", async (req, res) => {
  let ch = parseInt(req.params.ch);

  if (isNaN(ch)) {
    return res.status(400).send("Invalid channel");
  }

  // 🔑 offset ช่อง 1–999
  if (ch < 1000) {
    ch = ch + 1000;
  }

  const streamUrl = `${BASE_URL}/${USER}/${PASS}/${ch}`;

  try {
    const r = await fetch(streamUrl, {
      headers: {
        "User-Agent": "IPTV/1.0",
        "Referer": BASE_URL,
        "Connection": "keep-alive"
      }
    });

    if (!r.ok) {
      return res.status(502).send("Source error");
    }

    // ⚡ ส่ง stream ตรง
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache"
    });

    r.body.pipe(res);

  } catch (e) {
    res.status(500).send(e.message);
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Dynamic IPTV Proxy running on port " + PORT);
});



