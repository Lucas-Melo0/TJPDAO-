import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x25f611aEdb913b39e4eCFE8B5a706e91921B6f99");

(async () => {
  try {
    const allRoles = await token.roles.getAll();

    console.log("👀 Papeis que existem agora:", allRoles);

    await token.roles.setAll({ admin: [], minter: [] });
    console.log(
      "🎉 Papeis depois de remover nós mesmos",
      await token.roles.getAll()
    );
    console.log("✅ Revogados nossos super-poderes sobre os tokens ERC-20");
  } catch (error) {
    console.error(
      "Falha ao remover nossos direitos sobre o tesouro da DAO",
      error
    );
  }
})();
