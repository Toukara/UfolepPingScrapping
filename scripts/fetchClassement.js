import scrapData from "./fetchData.js";

import dotenv from "dotenv";
dotenv.config();

async function fetchClassement(url) {
  console.log("scraping classement");
  const document = await scrapData(url);
  const tableClassement = document.querySelectorAll("table")[0];
  const rows = tableClassement.querySelectorAll("tr");

  const classement = [
    {
      timestamp: new Date().getTime(),
      date: new Date().toISOString().split("T")[0],
      division: url.split("/").pop(),
    },
  ];

  rows.forEach((row, i) => {
    const cells = row.querySelectorAll("td");
    const cellsTrimed = Array.from(cells, (cell) => cell.textContent.trim());

    const elementsToRemove = [
      "rang",
      "équipe",
      "points",
      "joués",
      "G",
      "N",
      "P",
      "F/P",
      "départage",
    ];
    elementsToRemove.forEach((element) => {
      const index = cellsTrimed.indexOf(element);
      if (index !== -1) {
        cellsTrimed.splice(index, 1);
      }
    });

    if (cellsTrimed.length !== 9 || i === 0 || cellsTrimed[(0, 8)] === "")
      return;

    const resultClub = {
      RANK: cellsTrimed[0],
      CLUB: cellsTrimed[1],
      POINTS: cellsTrimed[2],
      MATCHES_PLAYED: cellsTrimed[3],
      MATCH_WINS: cellsTrimed[4],
      MATCH_DRAWS: cellsTrimed[5],
      MATCH_LOSES: cellsTrimed[6],
      F_B: cellsTrimed[7],
      DECIDE: cellsTrimed[8],
    };

    classement.push(resultClub);
  });

  return classement;
}

export default fetchClassement;
