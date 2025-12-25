app.get("/ott/:ch", async (req, res) => {
  let ch = parseInt(req.params.ch);
  if (ch < 1000) ch += 1000;

  const url = `http://103.114.203.129:8080/ott168/ott168/${ch}`;

  const r = await fetch(url, {
    headers: {
      "User-Agent": "IPTV/1.0",
      "Referer": "http://103.114.203.129:8080"
    }
  });

  if (!r.ok) return res.sendStatus(502);

  res.writeHead(200, {
    "Content-Type": "video/mp2t",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  r.body.pipe(res);
});
