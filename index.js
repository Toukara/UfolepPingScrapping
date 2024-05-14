import dotenv from "dotenv";
dotenv.config();

import express from "express";
// Destructure required properties
const { URL_UFOLEP62TT_EXCELLENCE1, PORT } = process.env;

const app = express();

// From Scripts folder import
import ScrappingScripts from "./scripts/main.js";

const { fetchClassement, fetchPlayers } = ScrappingScripts;

app.use(express.json());

// url : localhost:3000/
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/classement", async (req, res) => {
  const json = await fetchClassement(URL_UFOLEP62TT_EXCELLENCE1);
  res.send({
    message: "Classement fetched",
    json: json,
  });
});

app.get("/players", async (req, res) => {
  const json = await fetchPlayers();
  res.send({
    message: "Players fetched",
    json: json,
  });
});
