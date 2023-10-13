import axios from "axios";
import cheerio from "cheerio";
import {JSDOM} from "jsdom";
import * as fs from "fs";

var url = "https://ufolep62tt.org/points-joueurs-2023-2024";

const response = await axios.get(url);

const dom = new JSDOM(response.data);
const document = dom.window.document;

const players = [];

async function getPlayersData() {
  // get the table and convert it to an array
  const table = document.querySelector("table");
  const rows = Array.from(table.querySelectorAll("tr"));

  // rows.shift();

  rows.map((row, i) => {
    if (i === 0 || i === 1) return;

    const cells = Array.from(row.querySelectorAll("td"));
    const cellsTrimed = cells.map((cell) => cell.textContent.trim());

    const player = {
      club: cellsTrimed[0],
      name: cellsTrimed[1],
      ptsFirst: cellsTrimed[2],
      ptsSecond: cellsTrimed[3],
      ptsFFTTFirst: cellsTrimed[4],
      ptsFFTTSecond: cellsTrimed[5],
      clubFFTT: cellsTrimed[6],
      wasMoved: cellsTrimed[7],
    };

    players.push(player);
    return player;
  });
}

await getPlayersData();

try {
  const file = fs.createWriteStream("players.csv");
  file.on("error", (err) => {
    console.log(err);
  });
  file.write("Nom/Prénom, Classement Debut, Classement Fin, Classement FFTT Debut, Classement FFTT Fin, Club, Club FFTT, Muté\n");
  players.forEach((player) => {
    file.write(
      `${player.name}, ${player.ptsFirst}, ${player.ptsSecond}, ${player.ptsFFTTFirst}, ${player.ptsFFTTSecond}, ${player.club}, ${player.clubFFTT}, ${player.wasMoved}\n`
    );
  });
  file.end();

  console.log("File created");
} catch (err) {
  console.log(err);
}
