import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x4Ee8e6D37B8D1a049a0c795A65962b9921D6cf7B");

(async () => {
  try {
    // Especifique as condições.
    const claimConditions = [{
   
      startTime: new Date(),
      
      maxQuantity: 5_000,
     
      price: 0,
   
      quantityLimitPerTransaction: 1,
   
      waitInSeconds: MaxUint256,
    }]
    
    await editionDrop.claimConditions.set("0", claimConditions);

    console.log("✅ Condições de reinvidicação configuradas com sucesso!");
  } catch (error) {
    console.error("Falha ao definir condições de reinvidicação", error);
  }
})()