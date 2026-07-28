import Header from "../../Components/Header/Header"
import Top from "../../Components/Top/Top"
import Authentication from "../../Components/Authentication/Authentication"
import Style from "./Home.module.css"
import BankCard from "../../Components/BankCard/BankCard"
import { useEffect, useState} from "react"


export default function Home()
{
    const [data , setData ] = useState(null);
    const [error, setError] = useState(null)

    useEffect(() =>
    {
        let isMounted = true;

        async function fetchRates() {
            try {

                const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/mad.json');

                if (response.ok) {
                    const responseData = await response.json();

                    if(isMounted)
                    {
                        setData(responseData);
                        console.log(responseData);
                    }
                }
                
            } catch (err) {

                if(isMounted)
                {
                    setError('Fetch failed: ' + err.message);
                }
            }
        } 

        fetchRates();

        return () => {
            isMounted = false;
        };
    }
    , []
    )

    return (
        <>
            <Top/>
            <Header/>
            <section className={Style.Home}>
                <aside>
                    <h1>Simplifiez votre vie avec une banque toujours à vos côté</h1>
                    <p>Vos services bancaires accessibles en un seul clic</p>
                    <button> En savoir plus </button>
                </aside>
                <div className={Style.Currency}>
                    <h2>CONVERTIR EUROS ET USDS EN DIRHAMS MAROCAINS</h2>
                    <div className={Style.CurrencyData}>
                        
                    </div>
                </div>
            </section>
        </>
    )
}