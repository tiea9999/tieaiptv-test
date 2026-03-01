import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// Xtream playlist
const SOURCE = "http://safetv.vip:8080/get.php?username=8gULQeqH3I&password=kbuahRdUJV&type=m3u_plus";

// HOME
app.get("/", (req,res)=>{
res.send("TIEA IPTV PLAYLIST PROXY RUNNING");
});

// PLAYLIST PROXY
app.get("/playlist.m3u", async (req,res)=>{

try{

const r = await fetch(SOURCE);
let text = await r.text();

// เปลี่ยน host มาเป็น server ของเรา
const host = `${req.protocol}://${req.get("host")}/stream?url=`;

text = text.replace(
/http:\/\/[^ \n"]+/g,
m => host + encodeURIComponent(m)
);

res.setHeader("Content-Type","audio/x-mpegurl");
res.send(text);

}catch(e){

res.status(500).send(e.message);

}

});

// STREAM
app.get("/stream", async (req,res)=>{

const url = req.query.url;

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

// START
const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
console.log("TIEA IPTV Proxy running on "+PORT);
});
