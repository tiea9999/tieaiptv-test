import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const HOST = "http://192.142.28.55:8080";
const USER = "8gULQeqH3I";
const PASS = "kbuahRdUJV";

const channels = {
  mono2_en: "130725"
};

app.get("/", (req,res)=>{
res.send("TIEA IPTV PROXY RUNNING");
});

app.get("/:name", async (req,res)=>{

const id = channels[req.params.name];

if(!id) return res.send("Channel not found");

const url = `${HOST}/live/${USER}/${PASS}/$id`;

try{

const r = await fetch(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
});

const text = await r.text();

res.setHeader("Content-Type","application/vnd.apple.mpegurl");
res.send(text);

}catch(e){

res.send(e.message);

}

});

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
console.log("TIEA IPTV PROXY RUNNING");
});
