import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

const channelMap = {
  monomax1: "https://lfbtv.com/doonunglive/channel/?code=monomax1"
};

async function extractM3U8(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0"
    }
  });

  const html = await res.text();

  // ดัก m3u8
  const match = html.match(/https?:\/\/[^"' ]+\.m3u8[^"' ]*/i);
  return match ? match[0] : null;
}

app.get("/proxy", async (req, res) => {
  const channel = req.query.channel;
  const pageUrl = channelMap[channel];
  if (!pageUrl) return res.status(404).send("Channel not found");

  try {
    const m3u8 = await extractM3U8(pageUrl);
    if (!m3u8) return res.status(500).send("m3u8 not found");

    res.redirect(m3u8);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching stream");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("TIEA IPTV Proxy running on port", PORT)
);


