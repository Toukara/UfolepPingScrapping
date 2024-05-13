import { mkdir, writeFile } from "fs";

export default function writeJson(data, type) {
  mkdir("./data/json", { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
    data[0].division ? (type = `classement - ${data[0].division}`) : type;
    writeFile(`./data/json/${type}.json`, JSON.stringify(data), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("File written successfully");
      }
    });
  });
}
