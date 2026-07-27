import Header from "../../Components/Header/Header"
import Top from "../../Components/Top/Top"
import Authentication from "../../Components/Authentication/Authentication"
import Style from "./Home.module.css"
import BankCard from "../../Components/BankCard/BankCard"


export default function Home()
{
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
            
            </section>
        </>
    )
}