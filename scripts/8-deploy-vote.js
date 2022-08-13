import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      
      name: "Cúpula dos tenistas",

     
      voting_token_address: "0x25f611aEdb913b39e4eCFE8B5a706e91921B6f99",

     
      voting_delay_in_blocks: 0,

      
      voting_period_in_blocks: 6570,

     
      voting_quorum_fraction: 0,

      
      proposal_token_threshold: 0,
    });

    console.log(
      "✅ Módulo de votos implantado com sucesso no endereço:",
      voteContractAddress,
    );
  } catch (err) {
    console.error("Falha ao implantar o módulo de votos", err);
  }
})();
