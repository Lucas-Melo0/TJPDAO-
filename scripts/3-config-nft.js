import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0x4Ee8e6D37B8D1a049a0c795A65962b9921D6cf7B");

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Raquete da lei",
        description: "Esse NFT vai te dar acesso ao TJPDAO!",
        image: readFileSync("scripts/assets/goat.png"),
      },
    ]);
    console.log("✅ Novo NFT criado com sucesso no !");
  } catch (error) {
    console.error("falha ao criar o novo NFT", error);
  }
})()