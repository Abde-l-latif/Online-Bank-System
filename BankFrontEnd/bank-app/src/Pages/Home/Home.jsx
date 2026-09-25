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
                        <p>{t("About.sectionName")}</p>
                    </div>

                    <h2>{t("About.sectionTitle")}</h2>

                    <p>{t("About.sectionPara")}</p>

                    <div className={Style.AboutCardContainer}>
                        <div className={Style.AboutCard}>
                            <div>
                                <LaptopMinimal />
                            </div>   
                            
                            <div>
                                <h3>100%</h3>
                                <p>{t("About.infoOne")}</p>
                            </div>
                        </div> 

                        <div className={Style.AboutCard}>
                            <div>
                                <Users   />
                            </div>   
                            
                            <div>
                                <h3>+10K</h3>
                                <p>{t("About.infoTwo")}</p>
                            </div>
                        </div> 

                        <div className={Style.AboutCard}>
                            <div>
                                <ShieldCheck />
                            </div>   
                            
                            <div>
                                <h3>{t("About.infoThreeTitle")}</h3>
                                <p>{t("About.infoThree")}</p>
                            </div>
                        </div> 

                    </div>    

                </div>
                
                <img src={AboutImg} alt="AboutImage" />
            
            </section>

            <section id="services" className={Style.Services}>

                <div className={Style.AboutInfoHeader}>
                    <img src={bankLogo} alt="Logo" />
                    <p>{t("Services.sectionName")}</p>
                </div>
                <h2>{t("Services.sectionTitle")}</h2>
                <p>{t("Services.sectionPara")}</p>

                <div className={Style.ServiceCard}>
                    <div className={Style.ServiceCardContainer}>
                        <div style={{backgroundColor : "#a9e0db"}} className={Style.ServiceCardIcon}>
                            <IdCard />
                        </div>
                        <div className={Style.ServiceInfo}>
                            <h4>{t("Services.services.0.title")}</h4>
                            <p>{t("Services.services.0.description")}</p>
                        </div>              
                    </div>

                    <div className={Style.ServiceCardContainer}>
                        <div style={{backgroundColor : "#51fc9b"}} className={Style.ServiceCardIcon}>
                            <CloudSync/>
                        </div>
                        <div className={Style.ServiceInfo}>
                            <h4>{t("Services.services.1.title")}</h4>
                            <p>{t("Services.services.1.description")}</p>
                        </div>              
                    </div>

                    <div className={Style.ServiceCardContainer}>
                        <div style={{backgroundColor : "#c2f39e"}} className={Style.ServiceCardIcon}>
                            <CreditCard />
                        </div>
                        <div className={Style.ServiceInfo}>
                            <h4>{t("Services.services.2.title")}</h4>
                            <p>{t("Services.services.2.description")}</p>
                        </div>              
                    </div>

                    <div className={Style.ServiceCardContainer}>
                        <div style={{backgroundColor : "#c6e99f"}} className={Style.ServiceCardIcon}>
                            <Smartphone/>
                        </div>
                        <div className={Style.ServiceInfo}>
                            <h4>{t("Services.services.3.title")}</h4>
                            <p>{t("Services.services.3.description")}</p>
                        </div>              
                    </div>

                    <div className={Style.ServiceCardContainer}>
                        <div style={{backgroundColor : "#78d18c"}} className={Style.ServiceCardIcon}>
                            <ChartNoAxesCombined/>
                        </div>
                        <div className={Style.ServiceInfo}>
                            <h4>{t("Services.services.4.title")}</h4>
                            <p>{t("Services.services.4.description")}</p>
                        </div>              
                    </div>

                    <div className={Style.ServiceCardContainer}>
                        <div style={{backgroundColor : "#30a968"}} className={Style.ServiceCardIcon}>
                            <ShieldCheck/>
                        </div>
                        <div className={Style.ServiceInfo}>
                            <h4>{t("Services.services.5.title")}</h4>
                            <p>{t("Services.services.5.description")}</p>
                        </div>              
                    </div>


                </div>

            </section>

            <section id="contact" className={Style.Contact}>

                <div className={Style.ContactInfo}>
                     <div className={Style.AboutInfoHeader}>
                        <img src={bankLogo} alt="Logo" />
                        <p>{t("Contact.sectionName")}</p>
                    </div>
                    <h2>{t("Contact.sectionTitle")}</h2>
                    <p>{t("Contact.sectionPara")}</p>
                    <div className={Style.contactCardContainer}>
                        <div className={Style.contactCard}>
                            <div className={Style.contactCardIcon}>
                                <Phone />
                            </div>
                            <div className={Style.contactCardInfo}>
                                <a href="tel:+212664231544"><h4>+212 6 64 23 15 44</h4></a>
                                <p>{t("Contact.schedule")} <br/> 8h00 - 18h00</p>
                            </div>
                        </div>
                        <div className={Style.contactCard}>
                            <div className={Style.contactCardIcon}>
                                <MapPlus />
                            </div>
                            <div className={Style.contactCardInfo}>
                                <h4>{t("Contact.location")}</h4>
                                <p>{t("Contact.address")}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Style.ContactForm}>
                    <h3>{t("Contact.formTitle")}</h3>
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
                            <input type="text" placeholder={t("Contact.subjectInput")} {...register("sujet", { required:  t("AuthErrorRequired")})}  />
                        </div>
                        {errors.sujet?.type === "required" && <p className={Style.Error}>{t("AuthErrorRequired")}</p>}
                        <div className={Style.InputField}>
                            <MailPlus />
                            <textarea type="text" placeholder={t("Contact.yourMessage")} {...register("message", { required:  t("AuthErrorRequired")})} />
                        </div>
                        {errors.message?.type === "required" && <p className={Style.Error}>{t("AuthErrorRequired")}</p>}

                        <button className={Style.Btn} type="submit">
                            <Send />
                            <p>{t("Contact.formButton")}</p>
                        </button>
                    </form>
                    {EmailData != null ? <p style={{color: "#156a1b", padding : "10px", textAlign : "center"}}>{t("successs.contactMsg")}</p> : "" }
                </div>

                <img src={ContactImage} alt="ContactImage" />

            </section>

            <div className={Style.Mask}>
                <section className={Style.Footer}>
                    <div>
                        <Brand/>
                        <p>{t("Footer.para")}</p>
                        <div className={Style.FooterRowOne}>
                            <div className={Style.FooterIconRowOne}>
                                <div>
                                <ShieldCheck/>             
                                </div>
                                <p>{t("Footer.firstIcon")}</p>
                            </div>

                            <div className={Style.FooterIconRowOne}>
                                <div>
                                <Zap/>             
                                </div>
                                <p>{t("Footer.secondIcon")}</p>
                            </div> 

                            <div className={Style.FooterIconRowOne}>
                                <div>
                                <Smartphone/>             
                                </div>
                                <p>100% {t("About.infoOne")}</p>
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
                        <h4>{t("Footer.navTitle")}</h4>   
                        <ul>
                            <a href="#home"><li>
                                <ChevronRight/>
                                <p>{t("headerNavOne")}</p>
                            </li></a>
                            <a href="#about"><li>
                                <ChevronRight/>
                                <p>{t("headerNavTwo")}</p>
                            </li></a>
                            <a href="#services"><li>
                                <ChevronRight/>
                                <p>{t("headerNavThree")}</p>
                            </li></a>
                            <a href="#contact"><li>
                                <ChevronRight/>
                                <p>{t("headerNavFour")}</p>
                            </li></a>
                        </ul>                

                    </div>

                    <div className={Style.FooterServices}>
                        <h4>{t("Services.sectionName")}</h4>
                        <ul>
                            <li>
                                <ChevronRight/>
                                <p>{t("Services.services.0.title")}</p>
                            </li>
                            <li>
                                <ChevronRight/>
                                <p>{t("Services.services.1.title")}</p>
                            </li>
                            <li>
                                <ChevronRight/>
                                <p>{t("Services.services.2.title")}</p>
                            </li>
                            <li>
                                <ChevronRight/>
                                <p>{t("Services.services.3.title")}</p>
                            </li>
                            <li>
                                <ChevronRight/>
                                <p>{t("Services.services.4.title")}</p>
                            </li>
                            <li>
                                <ChevronRight/>
                                <p>{t("Services.services.5.title")}</p>
                            </li>
                        </ul> 
                    </div>

                    <div className={Style.footerSignup}>
                        <div className={Style.footerIcon}>
                            <Mail />             
                        </div>

                        <h3>{t("Footer.secondTitle")}</h3>

                        <p>{t("Footer.paraTwo")}</p>

                        <form action="" className={Style.footerInput} onSubmit={(e) => {
                            e.preventDefault();
                            setEmail(e.target.email.value);

                        }}> 
                            <Mail />
                            <input type="email" placeholder={t("AuthEmailPlaceholder")} required pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                            onInvalid={(e) =>
                                e.target.setCustomValidity(t("AuthErrorEmailFormat"))
                            }
                            onInput={(e) =>
                                e.target.setCustomValidity("")
                            }
                            name="email"/>
                            <button className={Style.Btn}>
                                <p>{t("Footer.button")}</p>
                            </button>
                        </form>

                        {email != null ? <p style={{color: "#07910d"}}>{t("successs.footerMsg")} </p> : ""}
    
                    </div>                        
                </section>
                <img className={Style.footerImage} src={footerImg} alt="footerImage" />
            </div>                       

        </>
    )
}