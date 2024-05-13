// import every script
import fetchClassement from "./fetchClassement.js";
import fetchData from "./fetchData.js";
import fetchPlayers from "./fetchPlayers.js";

import dotenv from "dotenv";
dotenv.config();

const config = {
  URL_UFOLEP62TT_EXCELLENCE1: process.env.URL_UFOLEP62TT_EXCELLENCE1,
  URL_UFOLEP62TT_JOUEURS: process.env.URL_UFOLEP62TT_JOUEURS,
  HTTP_COOKIE_PHPSESSID: process.env.HTTP_COOKIE_PHPSESSID,
  HTTP_HEADERS_CONNECTION: process.env.HTTP_HEADERS_CONNECTION,
  HTTP_COOKIE_UFOLEP62TT: process.env.HTTP_COOKIE_UFOLEP62TT,
};

const ScrappingScripts = {
  fetchClassement,
  fetchData,
  fetchPlayers,
};

export default ScrappingScripts;
