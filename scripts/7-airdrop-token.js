import sdk from "./1-initialize-sdk.js";


const editionDrop = sdk.getEditionDrop("0x4Ee8e6D37B8D1a049a0c795A65962b9921D6cf7B");


const token = sdk.getToken("0x25f611aEdb913b39e4eCFE8B5a706e91921B6f99");

(async () => {
  try {
    
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);
  
    if (walletAddresses.length === 0) {
      console.log(
        "Ninguém mintou o NFT ainda, peça para alguns amigos fazerem isso e ganhar um NFT de graça!",
      );
      process.exit(0);
    }
    
    
    const airdropTargets = walletAddresses.map((address) => {
      
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
      console.log("✅ Vai enviar", randomAmount, "tokens para ", address);
      
      
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };
  
      return airdropTarget;
    });
    
    
    console.log("🌈 Começando o airdrop...")
    await token.transferBatch(airdropTargets);
    console.log("✅ Feito o airdrop de tokens para todos os donos de NFT!");
  } catch (err) {
    console.error("O airdrop de tokens falhou", err);
  }
})();