import Header from "../../Components/Header/Header"
import Top from "../../Components/Top/Top"
import Authentication from "../../Components/Authentication/Authentication"
import Style from "./Home.module.css"
import BankCard from "../../Components/BankCard/BankCard"
import { useEffect, useState} from "react"
import DisplayCurr from "../../Components/DisplayCurr/DisplayCurr"
import usa from "../../assets/usa.png"
import Euro from "../../assets/Euro.png"
import morocco from "../../assets/morocco.svg"


export default function Home()
{
    const [data , setData ] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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
                        setLoading(false);
                    }
                }
                
            } catch (err) {

                if(isMounted)
                {
                    setError('Fetch failed: ' + err.message);
                    setLoading(false);
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
                        <div className={Style.CurrencyContainer}>
                            <DisplayCurr name="USD" flag={usa} Num="1,00"/>
                            <DisplayCurr name="MAD" flag={morocco} Num={loading == true ? "..." : (1 / data?.mad?.usd).toFixed(2)}/>
                        </div>
                        <div className={Style.CurrencyContainer}>
                            <DisplayCurr name="EUR" flag={Euro} Num="1,00"/>
                            <DisplayCurr name="MAD" flag={morocco} Num={loading == true ? "..." : (1 / data?.mad?.eur).toFixed(2)}/>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}