import { useAddress, useMetamask, useEditionDrop } from '@thirdweb-dev/react';
import { useState, useEffect } from 'react';
export default function HomePage() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log(address)

  const editionDrop = useEditionDrop("0x4Ee8e6D37B8D1a049a0c795A65962b9921D6cf7B");


  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {

    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);

        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 esse usuário tem o NFT de membro!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 esse usuário NÃO tem o NFT de membro.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Falha ao ler saldo", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`🌊 Cunhado com sucesso! Olhe na OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Falha ao cunhar NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  if (!address) {
    return (
      < div className="landing" >
        <h1>Bem-vind@s à TPJDAO - a DAO dos tenistas de João Pessoa</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Conecte sua carteira
        </button>
      </div >
    )

  };
  
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🚴 Página dos membros da DAO</h1>
        <p>Parabéns por fazer parte desse clube de bikers!</p>
      </div>
    )
   };

  return (
    <div className="mint-nft">
      <h1>Cunhe gratuitamente seu NFT de membro da TPJDAO </h1>
      <button
        disabled={isClaiming}
        onClick={mintNft}
      >
        {isClaiming ? "Cunhando..." : "Cunhe seu NFT (GRATIS)"}
      </button>
    </div>
  );
};