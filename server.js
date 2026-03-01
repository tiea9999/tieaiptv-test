import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import http from "http";
import https from "https";

const app = express();
app.use(cors());

// ===== CONFIG =====
const HOST = "http://safetv.vip:8080";
const USER = "8gULQeqH3I";
const PASS = "kbuahRdUJV";

// ===== KEEP ALIVE =====
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 50 });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50 });

// ===== CHANNEL LIST =====
const channels = {
  mono2: "130724",
  mono2_en: "130725",
  mono1: "130734",
  workpoint: "5441",
  mono29: "8664"
};

// ===== HOME =====
app.get("/", (req,res)=>{
res.send("TIEA IPTV PROXY RUNNING");
});

// ===== PLAYLIST =====
app.get("/playlist.m3u",(req,res)=>{

let m3u="#EXTM3U\n";

for(const key in channels){

m3u+=`#EXTINF:-1 tvg-name="${key}" group-title="TV",${key}\n`;
m3u+=`https://${req.get("host")}/${key}\n`;

}

res.setHeader("Content-Type","audio/x-mpegurl");
res.send(m3u);

});

// ===== STREAM =====
app.get("/:name", async (req,res)=>{

const id = channels[req.params.name];

if(!id) return res.status(404).send("Channel not found");

const url = `${HOST}/live/${USER}/${PASS}/${id}.m3u8`;

try{

const r = await fetch(url,{
headers:{
"User-Agent":"Mozilla/5.0",
"Connection":"keep-alive",
"Referer":HOST
},
agent: parsedURL => parsedURL.protocol === "http:" ? httpAgent : httpsAgent
});

let text = await r.text();

// rewrite segment
text = text.replace(
/^(?!#)(.*)$/gm,
`https://${req.get("host")}/segment/${id}/$1`
);

res.setHeader("Content-Type","application/vnd.apple.mpegurl");
res.send(text);

}catch(e){

res.status(500).send(e.message);

}

});

// ===== SEGMENT =====
app.get("/segment/:id/:file", async (req,res)=>{

const id = req.params.id;
const file = req.params.file;

const url = `${HOST}/live/${USER}/${PASS}/${id}/${file}`;

try{

const r = await fetch(url,{
headers:{
"User-Agent":"Mozilla/5.0",
"Connection":"keep-alive",
"Referer":HOST
},
agent: parsedURL => parsedURL.protocol === "http:" ? httpAgent : httpsAgent
});

res.setHeader("Content-Type","video/mp2t");

r.body.pipe(res);

}catch(e){

res.status(500).send(e.message);

}

});

// ===== START SERVER =====
const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
console.log("TIEA IPTV PROXY RUNNING");
});
