import axios from "axios";
import cheerio from "cheerio";
import {JSDOM} from "jsdom";
import * as fs from "fs";

var url = "https://ufolep62tt.org/points-joueurs-1-1-1";

const response = await axios.get(url, {
  cookies: {
    PHPSESSID: "8skvedrj6agf16nfdpngcmf57b",
    "rgpdKAL-4065-ufolep62tt": "!multiplegtag=true!matomo=true",
  },
  headers: {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "max-age=0",
    Connection: "keep-alive",
    Cookie: "PHPSESSID=8skvedrj6agf16nfdpngcmf57b; rgpdKAL-4065-ufolep62tt=!multiplegtag=true!matomo=true",
    Referer: "https://www.google.com/",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 OPR/104.0.0.0",
    "sec-ch-ua": '"Chromium";v="118", "Opera GX";v="104", "Not=A?Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
  },
});
const dom = new JSDOM(response.data);
const document = dom.window.document;

const table = document.querySelectorAll("table")[1];
const rows = Array.from(table.querySelectorAll("tr:not([class])"));
rows.shift();

const players = [];

rows.map((row, i) => {
  if (i === 0 || i === 1) return;
  const cells = Array.from(row.querySelectorAll("td:not(.table_tdborderv)"));

  const cellsTrimmed = cells.map((cell) => cell.textContent.trim());

  const player = {
    CLUB: cellsTrimmed[0],
    FULL_NAME: cellsTrimmed[1],
    LICENSE_NUMBER: cellsTrimmed[2],
    POINTS_FORWARD: cellsTrimmed[3],
    POINTS_BACKWARD: cellsTrimmed[4],
    FFTT: {
      FORWARD_POINTS: cellsTrimmed[5],
      BACKWARD_POINTS: cellsTrimmed[6],
      CLUB: cellsTrimmed[7],
    },
    MUTATION: cellsTrimmed[8],
  };

  players.push(player);
});

function writeCSV(data) {
  const file = fs.createWriteStream("players.csv");
  file.on("error", (err) => {
    console.log(err);
  });
  file.write("Club , Nom et Prénom, Classement Aller, Classement Retour, Classement FFTT ph1, Classement FFTT ph2, Club FFTT, Mutation\n");
  data.forEach((player) => {
    file.write(
      `${player.CLUB}, ${player.FULL_NAME}, ${player.POINTS_FORWARD}, ${player.POINTS_BACKWARD}, ${player.FFTT.FORWARD_POINTS}, ${player.FFTT.BACKWARD_POINTS}, ${player.FFTT.CLUB}, ${player.MUTATION}\n`
    );
  });
  file.end();

  console.log("File created");
}

writeCSV(players);
