import express from "express";
import path from "path";
import bodyParser from "body-parser";
const app = express();
const port = 8080;
const curEnv = process.env.NODE_ENV;

if (!curEnv || (curEnv !== undefined && curEnv !== null && (curEnv !== "development" && curEnv !== "production"))) {
  throw `Environment not properly defined. Environment defined as ${curEnv}`;
}

app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  if(process.env.NODE_ENV === "development"){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }
});

app.post("/api/test", (req, res) => {
  res.json({test:"test"});
});

app.listen(port, () => {
  console.log( `Listening to app on server port ${port} in ${curEnv} mode`);
});
