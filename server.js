import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("TIEA IPTV Dynamic Proxy running");
});

// ===== OTT PROXY =====
app.get("/ott/:ch", async (req, res) => {
  let ch = parseInt(req.params.ch);
  if (isNaN(ch)) return res.status(400).send("Invalid channel");

  // offset ช่อง 1–999
  if (ch < 1000) ch += 1000;

  const url = `http://103.114.203.129:8080/ott168/ott168/${ch}`;

  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "IPTV/1.0",
        "Referer": "http://103.114.203.129:8080",
        "Connection": "keep-alive"
      }
    });

    if (!r.ok) return res.sendStatus(502);

    // ⭐ สำคัญมาก
    res.writeHead(200, {
      "Content-Type": "video/mp2t",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
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
