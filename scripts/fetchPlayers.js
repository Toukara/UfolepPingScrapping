import scrapData from "./fetchData.js";
import writeJson from "./writeFile.js";

import dotenv from "dotenv";
dotenv.config();

const { URL_UFOLEP62TT_JOUEURS } = process.env;

async function scrapPlayers() {
  const document = await scrapData(URL_UFOLEP62TT_JOUEURS);

  const table = document.querySelector("table");
  const rows = table.querySelectorAll("tr:not([class])");

  const players = [
    {
      timestamp: new Date().getTime(),
      date: new Date().toISOString().split("T")[0],
      players: 1,
    },
  ];

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td");
    const cellsTrimmed = Array.from(cells, (cell) => cell.textContent.trim());

    const player = {
      CLUB: cellsTrimmed[0],
      FULL_NAME: cellsTrimmed[1],
      POINTS_START: cellsTrimmed[2],
      POINTS_MIDSEASON: cellsTrimmed[3],
      FFTT: {
        POINTS_START: cellsTrimmed[4],
        POINTS_MIDSEASON: cellsTrimmed[5],
        CLUB: cellsTrimmed[6],
      },
      MUTATION: cellsTrimmed[7],
    };

    players[0].players++;
    players.push(player);
  }

  writeJson(players, "players");
  return players;
}

export default scrapPlayers;
