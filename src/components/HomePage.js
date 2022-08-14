import {
  useAddress,
  useMetamask,
  useEditionDrop,
  useToken,
  useVote,
} from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from "react";
import { AddressZero } from "@ethersproject/constants";

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);

  const editionDrop = useEditionDrop(
    "0x4Ee8e6D37B8D1a049a0c795A65962b9921D6cf7B"
  );
  const token = useToken("0x25f611aEdb913b39e4eCFE8B5a706e91921B6f99");
  const vote = useVote("0x272aE4f3695e09726E0CE468efD4412610165150");

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);

  const [memberAddresses, setMemberAddresses] = useState([]);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("🌈 Propostas:", proposals);
      } catch (error) {
        console.log("falha ao buscar propostas", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("🥵 Usuário já votou");
        } else {
          console.log("🙂 Usuário ainda não votou");
        }
      } catch (error) {
        console.error("Falha ao verificar se carteira já votou", error);
      }
    };
    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllAddresses = async () => {
      try {
        const memberAddresses =
          await editionDrop.history.getAllClaimerAddresses(0);
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
      const member = memberTokenAmounts?.find(
        ({ holder }) => holder === address
      );

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      };
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
      console.log(
        `🌊 Cunhado com sucesso! Olhe na OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`
      );
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
      <div className="landing">
        <h1>Bem-vind@s à TJPDAO a DAO dos tenistas de João Pessoa</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Conecte sua carteira
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1> Página dos membros da DAO</h1>
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
          <div>
            <h2>Propostas Ativas</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                setIsVoting(true);

                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,

                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                try {
                  const delegation = await token.getDelegationOf(address);

                  if (delegation === AddressZero) {
                    await token.delegateTo(address);
                  }

                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        const proposal = await vote.get(proposalId);

                        if (proposal.state === 1) {
                          return vote.vote(proposalId, _vote);
                        }

                        return;
                      })
                    );
                    try {
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          const proposal = await vote.get(proposalId);

                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );

                      setHasVoted(true);
                      console.log("votado com sucesso");
                    } catch (err) {
                      console.error("falha ao executar votos", err);
                    }
                  } catch (err) {
                    console.error("falha ao votar", err);
                  }
                } catch (err) {
                  console.error("falha ao delegar tokens");
                } finally {
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => {
                      const translations = {
                        Against: "Contra",
                        For: "A favor",
                        Abstain: "Abstenção",
                      };
                      return (
                        <div key={type}>
                          <input
                            type="radio"
                            id={proposal.proposalId + "-" + type}
                            name={proposal.proposalId}
                            value={type}
                            //valor padrão "abster" vem habilitado
                            defaultChecked={type === 2}
                          />
                          <label htmlFor={proposal.proposalId + "-" + type}>
                            {translations[label]}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Votando..."
                  : hasVoted
                  ? "Você já votou"
                  : "Submeter votos"}
              </button>
              {!hasVoted && (
                <small>
                  Isso irá submeter várias transações que você precisará
                  assinar.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mint-nft">
      <h1>Cunhe gratuitamente seu NFT de membro da TJPDAO</h1>
      <button disabled={isClaiming} onClick={mintNft}>
        {isClaiming ? "Cunhando..." : "Cunhe seu NFT (GRATIS)"}
      </button>
    </div>
  );
};

export default App;
