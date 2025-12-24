app.get("/ott/:ch", async (req, res) => {
  let ch = parseInt(req.params.ch);

  if (isNaN(ch)) {
    return res.status(400).send("Invalid channel");
  }

  // 🔑 offset ช่อง 1–999
  if (ch < 1000) {
    ch = ch + 1000;
  }

  const streamUrl = `http://103.114.203.129:8080/ott168/ott168/${ch}`;

  try {
    const r = await fetch(streamUrl, {
      headers: {
        "User-Agent": "IPTV/1.0",
        "Referer": "http://103.114.203.129:8080/",
        "Connection": "keep-alive"
      }
    });

    if (!r.ok) {
      return res.status(502).send("Source error");
    }

    res.set({
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache"
    });

    r.body.pipe(res);

  } catch (e) {
    res.status(500).send(e.message);
  }
});



