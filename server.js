import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// ===== CONFIG =====
const HOST = "http://mypanel-4k.com:80";
const USER = "rmt8r91bac";
const PASS = "tsleey7v5g";

// ===== CHANNEL =====
const channels = {
  hbo: { id: 1776086, name: "HBO" },
  nick: { id: 1776230, name: "Nick" }
};

// ===== HOME =====
app.get("/", (req, res) => {
  res.send("TIEA IPTV PROXY RUNNING");
});

// ===== PLAYLIST =====
app.get("/playlist.m3u", (req, res) => {

  let m3u = "#EXTM3U\n";

  for (const key in channels) {

    const ch = channels[key];

    m3u += `#EXTINF:-1,${ch.name}\n`;
    m3u += `${req.protocol}://${req.get("host")}/ch/${ch.id}\n`;

  }

  res.setHeader("Content-Type", "audio/x-mpegurl");
  res.send(m3u);

});

// ===== CHANNEL STREAM =====
app.get("/ch/:id", async (req, res) => {

  const id = req.params.id;

  const url = `${HOST}/${USER}/${PASS}/${id}`;

  try {

    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Connection": "keep-alive"
      }
    });

    if (!r.ok) {
      return res.status(502).send("Source Error");
    }

    res.setHeader("Content-Type", "video/mp2t");

    r.body.pipe(res);

  } catch (e) {

    res.status(500).send(e.message);

  }

});

// ===== START =====
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("TIEA IPTV Proxy running on " + PORT);
});

