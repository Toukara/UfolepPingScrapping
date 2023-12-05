const fs = require("fs");
const axios = require("axios");
const {JSDOM} = require("jsdom");

var url = "https://ufolep62tt.org/points-joueurs-1-1-1";

async function fetchPlayers() {
  const data = await axios.get(url, {
    cookies: {
      PHPSESSID: "8skvedrj6agf16nfdpngcmf57b",
      "rgpdKAL-4065-ufolep62tt": "!multiplegtag=true!matomo=true",
    },
    headers: {
      Connection: "keep-alive",
      Cookie: "PHPSESSID=8skvedrj6agf16nfdpngcmf57b; rgpdKAL-4065-ufolep62tt=!multiplegtag=true!matomo=true",
      "Sec-Fetch-Site": "cross-site",
    },
  });

  const dom = new JSDOM(data.data);
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

  return players;
}

async function writeFile(type, data) {
  switch (type) {
    case "CSV": {
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
    case "JSON": {
      const file = fs.createWriteStream("players.json");
      file.on("error", (err) => {
        console.log(err);
      });
      file.write(JSON.stringify(data));
      file.end();

      console.log("File created");
    }
    case "TEXT": {
      const file = fs.createWriteStream("players.txt");
      file.on("error", (err) => {
        console.log(err);
      });
      file.write(data);
      file.end();

      console.log("File created");
    }
    case "WORD": {
      const file = fs.createWriteStream("players.docx");
      file.on("error", (err) => {
        console.log(err);
      });
      file.write(data);
      file.end();
    }

    default:
      break;
  }
}

async function render() {
  if (!localStorage.getItem("players")) {
    var players = await fetchPlayers();
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("players-timestamp", Date.now());
  } else {
    if (localStorage.getItem("players-timestamp") < Date.now() - 1000 * 60 * 60 * 24 * 25) {
      var players = await fetchPlayers();
      localStorage.setItem("players", JSON.stringify(players));
      localStorage.setItem("players-timestamp", Date.now());
    } else {
      var players = JSON.parse(localStorage.getItem("players"));
    }
  }

  const playerlist = document.getElementById("playerlist");

  players.forEach((player) => {
    playerlist.innerHTML += `
      <tr>
        <td>${player.CLUB}</td>
        <td>${player.FULL_NAME}</td>
        <td>${player.POINTS_FORWARD}</td>
        <td>${player.POINTS_BACKWARD}</td>
        <td>${player.FFTT.FORWARD_POINTS}</td>
        <td>${player.FFTT.BACKWARD_POINTS}</td>
        <td>${player.FFTT.CLUB}</td>
        <td>${player.MUTATION}</td>
      </tr>
    `;
  });
}

render();
