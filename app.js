const express = require("express");
const google = require("googleapis");
const cs = google.customsearch("v1");
const url = require("url");

const app = express();
const port = process.env.PORT || 8080;
const API_KEY = "AIzaSyClQfSCW1gTlBZmxrnBgJvLsWg3QMuKw3o";
const engineID = "013615188925714877035:hxpe4qngcoi";

let latest = [];

app.get("/latest", (req, res) => {
  let show = [];
  let endLength = (latest.length-10 < 0) ? 0 : latest.length-10;
  for(let i = latest.length-1; i > endLength-1; i--){
    show.push(latest[i]);
  }
  res.json(show);
})

app.get("/:q", (req, res) => {
  let q = req.params.q || "";
  let offset = req.query.offset || 0;

  latest.push({
    term: q,
    when: new Date()
  });


  getResults(q, offset, (result) => {
    res.json(result);
  });
});


app.listen(port, ()=> console.log(`Listing on port ${port}`));

function getResults(q, offset, callback){
  cs.cse.list({
    auth: API_KEY,
    cx: engineID,
    q: q,
    searchType: "image",
    start: ++offset
  }, (err, result) => {
    if(err) console.log(err);
    result = result.items;

    let filtered = [];
    for(let i = 0; i < result.length; i++){
      _filter = {
        url: result[i].link,
        snippet: result[i].snippet,
        context: result[i].image.contextLink
      }
      filtered.push(_filter);
    }

    callback(filtered);
  });
}
