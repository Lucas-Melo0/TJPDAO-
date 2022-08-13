import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      
      name: "Membro da TJPDAO",
      
      description: "A DAO dos tenistas amadores",
     
      image: readFileSync("scripts/assets/dao.png"),
      primary_sale_recipient: AddressZero,
    });

    const editionDrop = sdk.getEditionDrop(editionDropAddress);

    const metadata = await editionDrop.metadata.get();
    
    console.log(
      "✅ Contrato editionDrop implantado com sucesso, endereço:",
      editionDropAddress,
    );
    console.log(
      "✅ bundleDrop metadados:",
      metadata,
    );
  } catch (error) {
    console.log("falha ao implantar contrato editionDrop", error);
  }
})()

/* 👋 SDK inicializado pelo endereço: 0x31602Bf490dD3d3Bcbb77d194b0079A0EFfAFA10
✅ Contrato editionDrop implantado com sucesso, endereço: 0x4Ee8e6D37B8D1a049a0c795A65962b9921D6cf7B
✅ bundleDrop metadados: {
  name: 'Membro da TJPDAO',
  description: 'A DAO dos tenistas amadores',
  image: 'https://gateway.ipfscdn.io/ipfs/Qmag3AQNakMEtngJC2pT6Yiti2ZUb45MwSfHad3xpsjqmk/0',
  seller_fee_basis_points: 0,
  fee_recipient: '0x0000000000000000000000000000000000000000',
  merkle: {},
  symbol: ''

 Módulo de votos implantado com sucesso no endereço: 0x272aE4f3695e09726E0CE468efD4412610165150
  👋 SDK inicializado pelo endereço: 0x31602Bf490dD3d3Bcbb77d194b0079A0EFfAFA10
} */
