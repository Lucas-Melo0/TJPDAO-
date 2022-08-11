import { useAddress, useMetamask, useEditionDrop } from '@thirdweb-dev/react';
import { useState, useEffect } from 'react';
export default function HomePage() {
    const address = useAddress();
    const connectWithMetamask = useMetamask();
    console.log(address)

    const editionDrop = useEditionDrop("0x4Ee8e6D37B8D1a049a0c795A65962b9921D6cf7B");

    
    const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  
    useEffect(() => {
      // Se ele não tiver uma carteira conectada, saia!
      if (!address) {
        return;
      }
      
      const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        // Se o saldo for maior do que 0, ele tem nosso NFT!
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
  
    if (!address) {
        return (
            < div className = "landing" >
            <h1>Bem-vind@s à TPJDAO - a DAO dos tenistas de João Pessoa</h1>
            <button onClick={connectWithMetamask} className="btn-hero">
              Conecte sua carteira
            </button>
          </div >
        )

    };

    return (
        <div className="landing">
          <h1>👀 carteira conectada, e agora?!</h1>
        </div>);
    

}
