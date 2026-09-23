import Header from "../../Components/Header/Header"
import Top from "../../Components/Top/Top"
import Brand from "../../Components/Brand/Brand"
import Style from "./Home.module.css"
import { useEffect, useState} from "react"
import DisplayCurr from "../../Components/DisplayCurr/DisplayCurr"
import usa from "../../assets/usa.png"
import Euro from "../../assets/Euro.png"
import morocco from "../../assets/morocco.svg"
import { useTranslation } from 'react-i18next';
import AboutImg from "../../assets/AboutImgOne.png";
import bankLogo from "../../assets/bankLogo.svg";
import { LaptopMinimal, Users, ShieldCheck, CreditCard, Smartphone , CloudSync, IdCard,
     ChartNoAxesCombined, Send, User, Mail, Inbox , MailPlus, Phone , MapPlus, ChevronRight
    ,Headset , Zap  } from 'lucide-react';
import ContactImage from "../../assets/ContactImage.png";
import { useForm } from "react-hook-form"
import footerImg from "../../assets/footerImg.png" 



export default function Home()
{
    const { t, i18n } = useTranslation();
    const [data , setData ] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [usaNum, setUsaNum] = useState(1);
    const [euroNum, setEuroNum] = useState(1);
    const [EmailData, setEmailData] = useState(null)
    const {
            register,
            handleSubmit,
            watch,
            getValues,
            formState: { errors },
        } = useForm();
    const [email, setEmail] = useState(null);


    const [selectedSection, setSelectedSection] = useState("home");

useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setSelectedSection(entry.target.id);
                }
            });
        },
        {
            threshold: 0.5
        }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
        sections.forEach((section) => observer.unobserve(section));
    };
}, []);
        

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

     const onSubmit = (data) => {
        try {
            setEmailData({name : data.name, email : data.EmailRequired, subject: data.sujet, msg : data.message});
            

        } 
        catch(ex)
        {
            console.log("Error message : " + ex);
        }
    }

    

    return (
        <>
            <Top/>

            <Header selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}/>

            <section id="home" className={Style.Home}>
                <aside> 
                    <h1>{t("HomeTitle")}</h1>
                    <p>{t("HomePara")}</p>
                    <a href="#about"><button> {t("HomeButton")} </button></a>
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

            <section id="about" className={Style.About}>

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

            <section id="services" className={Style.Services}>

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

            <section id="contact" className={Style.Contact}>

                <div className={Style.ContactInfo}>
                     <div className={Style.AboutInfoHeader}>
                        <img src={bankLogo} alt="Logo" />
                        <p>Nous contacter</p>
                    </div>
                    <h2>Nous sommes là pour vous aider</h2>
                    <p>Une question, un besoin d'assistance ou simplement envie d'en savoir plus ?<br/> Notre équipe est à votre écoute.</p>
                    <div className={Style.contactCardContainer}>
                        <div className={Style.contactCard}>
                            <div className={Style.contactCardIcon}>
                                <Phone />
                            </div>
                            <div className={Style.contactCardInfo}>
                                <a href="tel:+212664231544"><h4>+212 6 64 23 15 44</h4></a>
                                <p>Du lundi au vendredi <br/> 8h00 - 18h00</p>
                            </div>
                        </div>
                        <div className={Style.contactCard}>
                            <div className={Style.contactCardIcon}>
                                <MapPlus />
                            </div>
                            <div className={Style.contactCardInfo}>
                                <h4>Casablanca, Maroc</h4>
                                <p>Arrahma avenue je ne sais pas...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Style.ContactForm}>
                    <h3>Envoyez-nous un message</h3>
                    <form action="" onSubmit={handleSubmit(onSubmit)}>
                        <div className={Style.FormFirstRaw}>
                            <div>
                                <div className={Style.InputField}>
                                    <User />
                                    <input type="text" placeholder={t("RegNamePlaceholder")} {...register("name", { required:  t("AuthErrorRequired")})} />
                                </div>
                                <p className={Style.Error}>{errors.name && errors.name.message}</p>
                            </div>
                            <div>
                                <div className={Style.InputField}>
                                    <Mail />
                                    <input type="text" placeholder={t("AuthEmailPlaceholder")}  {...register("EmailRequired", { required: true, pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                    message: t("AuthErrorEmailFormat")
                                    } })}/>
                                </div>
                                {errors.EmailRequired?.type === "required" && <p className={Style.Error}>{t("AuthErrorRequired")}</p>}
                                {errors.EmailRequired?.type === "pattern" && <p className={Style.Error}>{errors.EmailRequired.message}</p>}         
                            </div>
                        </div>

                        <div className={Style.InputField}>
                            <Inbox />
                            <input type="text" placeholder="Sujet" {...register("sujet", { required:  t("AuthErrorRequired")})}  />
                        </div>
                        {errors.sujet?.type === "required" && <p className={Style.Error}>{t("AuthErrorRequired")}</p>}
                        <div className={Style.InputField}>
                            <MailPlus />
                            <textarea type="text" placeholder="Votre message..." {...register("message", { required:  t("AuthErrorRequired")})} />
                        </div>
                        {errors.message?.type === "required" && <p className={Style.Error}>{t("AuthErrorRequired")}</p>}

                        <button type="submit">
                            <Send />
                            <p>Envoyer le message</p>
                        </button>
                    </form>
                    {EmailData != null ? <p style={{color: "#156a1b", padding : "10px", textAlign : "center"}}>Votre message a été envoyer</p> : "" }
                </div>

                <img src={ContactImage} alt="ContactImage" />

            </section>
                                    
            <section className={Style.Footer}>
                <div>
                    <Brand/>
                    <p>Une banque en ligne moderne, simple et sècurisée, pensée pour vous accompagnerau quotidien.</p>
                    <div className={Style.FooterRowOne}>
                        <div className={Style.FooterIconRowOne}>
                            <div>
                               <ShieldCheck/>             
                            </div>
                            <p>Sécurisé</p>
                        </div>

                        <div className={Style.FooterIconRowOne}>
                            <div>
                               <Zap/>             
                            </div>
                            <p>Rapide</p>
                        </div> 

                        <div className={Style.FooterIconRowOne}>
                            <div>
                               <Smartphone/>             
                            </div>
                            <p>100% en ligne</p>
                        </div> 

                        <div className={Style.FooterIconRowOne}>
                            <div>
                               <Headset/>             
                            </div>
                            <p>Support 24/7</p>
                        </div>     
                        
                    </div>
                </div>

                <div className={Style.FooterNav}>
                    <h4>Liens rapides </h4>   
                    <ul>
                        <a href="#home"><li>
                            <ChevronRight/>
                            <p>Accueil</p>
                        </li></a>
                        <a href="#about"><li>
                            <ChevronRight/>
                            <p>À propos</p>
                        </li></a>
                        <a href="#services"><li>
                            <ChevronRight/>
                            <p>Services</p>
                        </li></a>
                        <a href="#contact"><li>
                            <ChevronRight/>
                            <p>Contactez-nous</p>
                        </li></a>
                    </ul>                

                </div>

                <div>
                    <h4>Nos services </h4>
                    <ul>
                        <li>
                            <ChevronRight/>
                            <p>Comptes bancaires</p>
                        </li>
                        <li>
                            <ChevronRight/>
                            <p>transfers</p>
                        </li>
                        <li>
                            <ChevronRight/>
                            <p>Cartes bancaires</p>
                        </li>
                        <li>
                            <ChevronRight/>
                            <p>Paiements</p>
                        </li>
                        <li>
                            <ChevronRight/>
                            <p>épargne & Investissement</p>
                        </li>
                        <li>
                            <ChevronRight/>
                            <p>Sécurité</p>
                        </li>
                    </ul> 
                </div>

                <div className={Style.footerSignup}>
                    <div className={Style.footerIcon}>
                        <Mail />             
                    </div>

                    <h3>Restez informé</h3>

                    <p>Recevez nos dernières actualités, offres et conseils directement dans votre boîte mail.</p>

                    <form action="" className={Style.footerInput} onSubmit={(e) => {
                        e.preventDefault();
                        setEmail(e.target.email.value);

                    }}> 
                        <Mail />
                        <input type="email" placeholder="Enter your email address" required pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                        onInvalid={(e) =>
                            e.target.setCustomValidity("Please enter a valid email address.")
                        }
                        onInput={(e) =>
                            e.target.setCustomValidity("")
                        }
                        name="email"/>
                        <button>
                            <p>S'inscrire</p>
                        </button>
                    </form>

                    {email != null ? <p style={{color: "#07910d"}}> Vous êtes maintenant inscrit. </p> : ""}
 
                </div>                        
            </section>
            <img className={Style.footerImage} src={footerImg} alt="footerImage" />

        </>
    )
}