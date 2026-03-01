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
  hbo: { id: "1776086", name: "HBO" },
  nick: { id: "1776230", name: "Nick" }
};

// ===== HOME =====
app.get("/", (req,res)=>{
res.send("TIEA IPTV PROXY RUNNING");
});

// ===== PLAYLIST =====
app.get("/playlist.m3u",(req,res)=>{

let m3u="#EXTM3U\n";

for(const key in channels){

const ch=channels[key];

m3u+=`#EXTINF:-1,${ch.name}\n`;
m3u+=`${req.protocol}://${req.get("host")}/${key}\n`;

}

res.setHeader("Content-Type","audio/x-mpegurl");
res.send(m3u);

});

// ===== CHANNEL STREAM =====
app.get("/:name", async (req,res)=>{

const ch=channels[req.params.name];

if(!ch) return res.status(404).send("Channel not found");

const url=`${HOST}/${USER}/${PASS}/${ch.id}`;

try{

const r=await fetch(url,{
headers:{
"User-Agent":"Mozilla/5.0",
"Connection":"keep-alive"
}
});

const buffer=await r.arrayBuffer();

res.setHeader("Content-Type","video/mp2t");

res.send(Buffer.from(buffer));

}catch(e){

res.status(500).send(e.message);

}

});

// ===== START =====
const PORT=process.env.PORT || 8080;

app.listen(PORT,()=>{
console.log("TIEA IPTV PROXY running on "+PORT);
});
