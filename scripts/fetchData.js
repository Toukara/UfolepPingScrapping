const {
  HTTP_COOKIE_PHPSESSID,
  HTTP_HEADERS_CONNECTION,
  HTTP_COOKIE_UFOLEP62TT,
} = process.env;

import axios from "axios";
import { JSDOM } from "jsdom";

async function scrapData(link) {
  console.log("LINK : ", link);

  console.log()
  try {
    const { data } = await axios.get(link, {
      cookies: {
        PHPSESSID: HTTP_COOKIE_PHPSESSID,
      },
      headers: {
        Connection: HTTP_HEADERS_CONNECTION,
        Cookie: HTTP_COOKIE_UFOLEP62TT,
        "Sec-Fetch-Site": "cross-site",
      },
    });

    const dom = new JSDOM(data);
    return dom.window.document;
  } catch (err) {
    console.error("Error fetching data:", `${err.code} - ${err.stack}`);
    throw err;
  }
}

export default scrapData;
