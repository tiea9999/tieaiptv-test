import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const HOST = "http://mypanel-4k.com:80";
const USER = "rmt8r91bac";
const PASS = "tsleey7v5g";

app.get("/", (req,res)=>{
res.send("TIEA IPTV PROXY RUNNING");
});

app.get("/ch/:id", async (req,res)=>{

const id = req.params.id;
const url = `${HOST}/${USER}/${PASS}/${id}`;

try{

const r = await fetch(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
});

if(!r.ok){
return res.status(500).send("Source error");
}

res.setHeader("Content-Type","video/mp2t");
r.body.pipe(res);

}catch(e){

res.status(500).send(e.message);

}

});

const PORT = process.env.PORT;

app.listen(PORT,"0.0.0.0",()=>{
console.log("TIEA IPTV Proxy running on "+PORT);
});
