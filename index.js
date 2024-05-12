import dotenv from "dotenv";
dotenv.config();

import { mkdir, writeFileSync } from "fs";
// Destructure required properties
const { URL_UFOLEP62TT_EXCELLENCE1 } = process.env;

// From Scripts folder import
import ScrappingScripts from "./scripts/main.js";

const { fetchClassement, fetchPlayers } = ScrappingScripts;

async function main(scrapFunction) {
  const startTimer = new Date().getTime();
  const name = scrapFunction.name.split("scrap").join("").toLowerCase();
  const type =
    name === "classement"
      ? await scrapFunction(URL_UFOLEP62TT_EXCELLENCE1)
      : await scrapFunction();

  try {
    // write in data/json folder
    mkdir("data/json", { recursive: true }, (err) => {
      if (err) throw err;
    });
    writeFileSync(`data/json/${name}.json`, JSON.stringify(type, null, 2));
    const endTimer = new Date().getTime();
    console.log(`${name} done in ${endTimer - startTimer}ms`);
    console.log("done");
  } catch (err) {
    console.error(err.message);
  }
}

main(fetchClassement);
