import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// ===== CONFIG =====
const HOST = "http://safetv.vip:8080";
const USER = "8gULQeqH3I";
const PASS = "kbuahRdUJV";

// ===== CHANNEL =====
const channels = {
  mono2: { id: "130725", name: "MONOMAX2" },
  mono1: { id: "130734", name: "MONOMAX1" }
};

// ===== HOME =====
app.get("/", (req,res)=>{
res.send("TIEA IPTV HLS PROXY RUNNING");
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

// ===== M3U8 =====
app.get("/:name", async (req,res)=>{

const ch = channels[req.params.name];

if(!ch) return res.status(404).send("Channel not found");

const url = `${HOST}/live/${USER}/${PASS}/${ch.id}.m3u8`;

try{

const r = await fetch(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
});

let text = await r.text();

// rewrite segment
text = text.replace(
/(.*\.ts)/g,
`/segment/${ch.id}/$1`
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
"Connection":"keep-alive"
}
});

res.setHeader("Content-Type","video/mp2t");

r.body.pipe(res);

}catch(e){

res.status(500).send(e.message);

}

});

// ===== START =====
const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
console.log("TIEA IPTV Proxy running on "+PORT);
});
