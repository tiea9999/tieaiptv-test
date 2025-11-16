import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

async function extractM3U8(pageUrl) {
    try {
        const res = await axios.get(pageUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Referer": pageUrl
            }
        });

        const html = res.data;

        const m3u8Match = html.match(/https[^"]+\.m3u8[^"]*/);
        if (!m3u8Match) return null;

        return m3u8Match[0];
    } catch (err) {
        console.error("Extract error:", err.message);
        return null;
    }
}

const channelMap = {
    warnertv:      "https://dookeela2.live/live-tv/warnertv",
    truemoviehits: "https://dookeela2.live/live-tv/truemoviehits",
    trueasianmore: "https://dookeela2.live/live-tv/trueasianmore",
    truefilmasia:  "https://dookeela2.live/live-tv/truefilmasia",
    monomax1:      "https://dookeela2.live/live-tv/monomax1"
};

app.get("/proxy", async (req, res) => {
    const channel = req.query.channel;

    if (!channel) return res.status(400).send("missing channel");

    const pageUrl = channelMap[channel];
    if (!pageUrl) return res.status(404).send("channel not found");

    console.log("🔎 Fetching:", pageUrl);

    const freshM3u8 = await extractM3U8(pageUrl);

    if (!freshM3u8) {
        return res.status(500).send("m3u8 not found");
    }

    console.log("🎯 Fresh m3u8:", freshM3u8);

    try {
        const stream = await axios({
            url: freshM3u8,
            method: "GET",
            responseType: "stream",
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Referer": pageUrl
            }
        });

        stream.data.pipe(res);
    } catch (err) {
        console.error("Stream error:", err.message);
        res.status(500).send("stream error");
    }
});

app.listen(10000, () => {
    console.log("TIEA IPTV Proxy running on port 10000");
});
