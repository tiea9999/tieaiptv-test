import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import http from "http";

const app = express();
app.use(cors());

// ===== CONFIG =====
const BASE = "http://103.114.203.129:8080";
const USER = "ott168";
const PASS = "ott168";

// ===== TEST =====
app.get("/", (req, res) => {
  res.send("FAST IPTV PROXY running");
});

// ===== FAST OTT PROXY =====
app.get("/ott/:ch", (req, res) => {
  let ch = parseInt(req.params.ch);
  if (isNaN(ch)) return res.sendStatus(400);

  // ไม่จำกัดเลขช่อง
  const url = `${BASE}/${USER}/${PASS}/${ch}`;

  const request = http.get(url, {
    headers: {
      "User-Agent": "IPTV/1.0",
      "Referer": BASE,
      "Connection": "keep-alive",
      "Accept": "*/*"
    }
  }, (r) => {

    // ⭐ บอก client ทันทีว่าเป็น live stream
    res.writeHead(200, {
      "Content-Type": "video/mp2t",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Transfer-Encoding": "chunked"
    });

    // pipe ทันที ไม่รอ
    r.pipe(res);
  });

  request.on("error", () => {
    res.sendStatus(502);
  });
});

// ===== START =====
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("FAST IPTV Proxy running on " + PORT);
});

