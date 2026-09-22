import Header from "../../Components/Header/Header"
import Top from "../../Components/Top/Top"
import Style from "./Home.module.css"
import { useEffect, useState} from "react"
import DisplayCurr from "../../Components/DisplayCurr/DisplayCurr"
import usa from "../../assets/usa.png"
import Euro from "../../assets/Euro.png"
import morocco from "../../assets/morocco.svg"
import { useTranslation } from 'react-i18next';
import AboutImg from "../../assets/AboutImgOne.png";
import bankLogo from "../../assets/bankLogo.svg";
import { LaptopMinimal, Users  , ShieldCheck, CreditCard, Smartphone , CloudSync, IdCard, ChartNoAxesCombined } from 'lucide-react';
import ContactImage from "../../assets/ContactImage.png";



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

            <section className={Style.About}>

                <div className={Style.AboutInfo}>
                    <div className={Style.AboutInfoHeader}>
                        <img src={bankLogo} alt="Logo" />
                        <p>À propos de nous</p>
                    </div>

                    <h2>Votre partenaire de confiance pour un avenir financier meilleur</h2>

                    <p>AbdoBank est une banque en ligne moderne conçue pour simplifier la gestion de votre argent au quotidien.
                        Notre objectif est de proposer des services bancaires simples, accessibles et sécurisés, 
                        tout en offrant une expérience entièrement digitale et facile à utiliser. 
                        Que vous souhaitiez gérer vos comptes, effectuer des transferts, suivre vos transactions ou utiliser vos
                        cartes bancaires, AbdoBank vous accompagne avec des solutions adaptées à vos besoins. </p>

                    <div className={Style.AboutCardContainer}>
                        <div className={Style.AboutCard}>
                            <div>
                                <LaptopMinimal />
                            </div>   
                            
                            <div>
                                <h3>100%</h3>
                                <p>En ligne</p>
                            </div>
                        </div> 

                        <div className={Style.AboutCard}>
                            <div>
                                <Users   />
                            </div>   
                            
                            <div>
                                <h3>+10K</h3>
                                <p>Clients satisfaits</p>
                            </div>
                        </div> 

                        <div className={Style.AboutCard}>
                            <div>
                                <ShieldCheck />
                            </div>   
                            
                            <div>
                                <h3>Sécurisé</h3>
                                <p>Vos données protégées</p>
                            </div>
                        </div> 

                    </div>    

                </div>
                
                <img src={AboutImg} alt="AboutImage" />
            
            </section>

            <section className={Style.Services}>

                <div className={Style.AboutInfoHeader}>
                    <img src={bankLogo} alt="Logo" />
                    <p>Nos services</p>
                </div>
                <h2>Des services bancaires complets pour tous vos besoins</h2>
                <p>Que vous soyez un particulier ou une entreprise, AbdoBank vous accompagne avec des solutions simple, rapide et sécurisées.</p>

                <div className={Style.ServiceCard}>
                    <div className={Style.ServiceCardContainer}>
                        <div style={{backgroundColor : "#a9e0db"}} className={Style.ServiceCardIcon}>
                            <IdCard />
                        </div>
                        <div className={Style.ServiceInfo}>
                            <h4>Comptes bancaires</h4>
                            <p>Comptes courants et d'épargne adaptés à votre profil</p>
                        </div>              
                    </div>

                    <div className={Style.ServiceCardContainer}>
                        <div style={{backgroundColor : "#51fc9b"}} className={Style.ServiceCardIcon}>
                            <CloudSync/>
                        </div>
                        <div className={Style.ServiceInfo}>
                            <h4>transfers</h4>
                            <p>Envoyez et recevez de l'argent en toute simplicité </p>
                        </div>              
                    </div>

                    <div className={Style.ServiceCardContainer}>
                        <div style={{backgroundColor : "#c2f39e"}} className={Style.ServiceCardIcon}>
                            <CreditCard />
                        </div>
                        <div className={Style.ServiceInfo}>
                            <h4>Cartes bancaires</h4>
                            <p>Des cartes sûres pour toutes vos transactions</p>
                        </div>              
                    </div>

                    <div className={Style.ServiceCardContainer}>
                        <div style={{backgroundColor : "#c6e99f"}} className={Style.ServiceCardIcon}>
                            <Smartphone/>
                        </div>
                        <div className={Style.ServiceInfo}>
                            <h4>Paiements</h4>
                            <p>Payez vos factures et vos achats en ligne ou en magasin</p>
                        </div>              
                    </div>

                    <div className={Style.ServiceCardContainer}>
                        <div style={{backgroundColor : "#78d18c"}} className={Style.ServiceCardIcon}>
                            <ChartNoAxesCombined/>
                        </div>
                        <div className={Style.ServiceInfo}>
                            <h4>épargne & Investissement</h4>
                            <p>Faites fructifier votre argent en toute sérénité</p>
                        </div>              
                    </div>

                    <div className={Style.ServiceCardContainer}>
                        <div style={{backgroundColor : "#30a968"}} className={Style.ServiceCardIcon}>
                            <ShieldCheck/>
                        </div>
                        <div className={Style.ServiceInfo}>
                            <h4>Sécurité</h4>
                            <p>Une technologie de pointe pour protéger vos données</p>
                        </div>              
                    </div>


                </div>

            </section>

            <section className={Style.Contact}>

                <div className={Style.ContactInfo}>
                     <div className={Style.AboutInfoHeader}>
                        <img src={bankLogo} alt="Logo" />
                        <p>Nous contacter</p>
                    </div>
                    <h2>Nous sommes là pour vous aider</h2>
                    <p>Une question, un besoin d'assistance ou simplement envie d'en savoir plus ?<br/> Notre équipe est à votre écoute.</p>
                </div>

                <div>
                    <h3>Envoyez-nous un message</h3>
                </div>

                <img src={ContactImage} alt="ContactImage" />

            </section>
        </>
    )
}