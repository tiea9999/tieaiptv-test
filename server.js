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
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

// ===== CHANNEL =====
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

// ===== STREAM =====
app.get("/:name", async (req,res)=>{

const id = channels[req.params.name];

if(!id) return res.status(404).send("Channel not found");

const url = `${HOST}/live/${USER}/${PASS}/${id}.m3u8`;

try{

const r = await fetch(url,{
headers:{
"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
"Accept":"*/*",
"Connection":"keep-alive",
"Referer":HOST
},
agent: parsedURL => parsedURL.protocol === 'http:' ? httpAgent : httpsAgent
});

res.setHeader("Content-Type","application/vnd.apple.mpegurl");

r.body.pipe(res);

}catch(e){

res.status(500).send(e.message);

}

});

// ===== START =====
const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
console.log("TIEA IPTV PROXY RUNNING");
});
