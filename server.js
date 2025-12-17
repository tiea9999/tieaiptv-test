import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";

const app = express();
app.use(cors());

const channelMap = {
  monomax1: "https://lfbtv.com/doonunglive/channel/?code=monomax1"
};

app.get("/proxy", async (req, res) => {
  const channel = req.query.channel;
  const pageUrl = channelMap[channel];
  if (!pageUrl) return res.status(404).send("Channel not found");

  let m3u8Url = null;

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ]
    });

    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0");

    page.on("response", response => {
      const url = response.url();
      if (url.includes(".m3u8")) {
        m3u8Url = url;
      }
    });

    await page.goto(pageUrl, { waitUntil: "networkidle2" });
    await page.waitForTimeout(5000);

    await browser.close();

    if (!m3u8Url) {
      return res.status(500).send("m3u8 not found");
    }

    res.redirect(m3u8Url);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching stream");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("TIEA IPTV Proxy running on port", PORT)
);

