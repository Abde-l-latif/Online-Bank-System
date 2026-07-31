import Header from "../../Components/Header/Header"
import Top from "../../Components/Top/Top"
import Authentication from "../../Components/Authentication/Authentication"
import Style from "./Home.module.css"
import BankCard from "../../Components/BankCard/BankCard"
import { useEffect, useState, useRef} from "react"
import DisplayCurr from "../../Components/DisplayCurr/DisplayCurr"
import usa from "../../assets/usa.png"
import Euro from "../../assets/Euro.png"
import morocco from "../../assets/morocco.svg"
import { useTranslation } from 'react-i18next';



export default function Home()
{
    const { t, i18n } = useTranslation();
    const [data , setData ] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [usaNum, setUsaNum] = useState(1);
    const [euroNum, setEuroNum] = useState(1);

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
                    <h1>{t("HomeTitle")}</h1>
                    <p>{t("HomePara")}</p>
                    <button> {t("HomeButton")} </button>
                </aside>
                <div className={Style.Currency}>
                    <h2>{t("HomeConvertTitle")}</h2>
                    <div className={Style.CurrencyData}>
                        <DisplayCurr name="USD" flag={usa} Num={null} CurrNum={setUsaNum} currentNum={usaNum} />
                        <DisplayCurr name="MAD" flag={morocco} Num={loading == true ? "..." : ((1 / data?.mad?.usd) * usaNum).toFixed(2)}/>
                        <p className={Style.Sep}></p>
                        <DisplayCurr name="EUR" flag={Euro} Num={null} CurrNum={setEuroNum} currentNum={euroNum}/>
                        <DisplayCurr name="MAD" flag={morocco} Num={loading == true ? "..." : ((1 / data?.mad?.eur) * euroNum).toFixed(2)}/>
                    </div>
                </div>
            </section>
        </>
    )
}