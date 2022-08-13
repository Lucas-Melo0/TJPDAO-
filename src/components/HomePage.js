import { useAddress, useMetamask, useEditionDrop, useToken } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
export default function HomePage() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log(address)

  const editionDrop = useEditionDrop("0x4Ee8e6D37B8D1a049a0c795A65962b9921D6cf7B");
  const token = useToken("0x25f611aEdb913b39e4eCFE8B5a706e91921B6f99");

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  // Guarda a quantidade de tokens que cada membro tem nessa variável de estado.
const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
// O array guardando todos os endereços dos nosso membros.
const [memberAddresses, setMemberAddresses] = useState([]);

// Uma função para diminuir o endereço da carteira de alguém, não é necessário mostrar a coisa toda.
const shortenAddress = (str) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

// Esse useEffect pega todos os endereços dos nosso membros detendo nosso NFT.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }
  
  // Do mesmo jeito que fizemos no arquivo 7-airdrop-token.js! Pegue os usuários que tem nosso NFT
  // com o tokenId 0.
  const getAllAddresses = async () => {
    try {
      const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
      setMemberAddresses(memberAddresses);
      console.log("🚀 Endereços de membros", memberAddresses);
    } catch (error) {
      console.error("falha ao pegar lista de membros", error);
    }

  };
  getAllAddresses();
}, [hasClaimedNFT, editionDrop.history]);


useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  
  const getAllBalances = async () => {
    try {
      const amounts = await token.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log("👜 Quantidades", amounts);
    } catch (error) {
      console.error("falha ao buscar o saldo dos membros", error);
    }
  };
  getAllBalances();
}, [hasClaimedNFT, token.history]);



const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
 

    const member = memberTokenAmounts?.find(({ holder }) => holder === address);

    return {
      address,
      tokenAmount: member?.balance.displayValue || "0",
    }
  });
}, [memberAddresses, memberTokenAmounts]);

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
        <h1>Página dos membros da DAO</h1>
        <p>Parabéns por fazer parte desse clube de tenistas!</p>
        <div>
          <div>
            <h2>Lista de Membros</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Endereço</th>
                  <th>Quantidade de Tokens</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
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