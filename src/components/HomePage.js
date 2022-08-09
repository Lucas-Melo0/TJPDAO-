import { useAddress, useMetamask } from '@thirdweb-dev/react';

export default function HomePage() {
    const adress = useAddress();
    const connectWithMetamask = useMetamask();
    console.log(adress)

  
    if (!adress) {
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
