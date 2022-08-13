import sdk from "./1-initialize-sdk.js";


const vote = sdk.getVote("0x272aE4f3695e09726E0CE468efD4412610165150");


const token = sdk.getToken("0x25f611aEdb913b39e4eCFE8B5a706e91921B6f99");

(async () => {
  try {
    
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "✅  Módulo de votos recebeu permissão de manipular os tokens com sucesso"
    );
  } catch (error) {
    console.error(
      "falha ao dar acesso aos tokens ao módulo de votos",
      error
    );
    process.exit(1);
  }

  try {
    
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = Number(ownedAmount) / 100 * 90;

   
    await token.transfer(
      vote.getAddress(),
      percent90
    ); 

    console.log("✅ Transferiu " + percent90 + " tokens para o módulo de votos com sucesso");
  } catch (err) {
    console.error("falhar ao transferir tokens ao módulo de votos", err);
  }
})();