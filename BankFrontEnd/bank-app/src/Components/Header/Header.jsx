import Style from "./Header.module.css"
import bankLogo from "../../assets/bankLogo.svg"

export default function Header()
{
    return (
        <section className={Style.header}>
            <div>
                <div className={Style.logoContainer}>
                    <img src={bankLogo} alt="Logo" />
                </div>
                <p>AbdoBank</p>
            </div>
            
            <nav>
                <ul>
                    <li className={Style.active}>Accueil</li>
                    <li>À propos</li>
                    <li>Services</li>
                    <li>Contactez-nous</li>
                </ul>
            </nav>
            <div className={Style.headerAuth}>
                <p>Se Connecter</p>
                <button>
                    Ouvrir un compte
                </button>
            </div>
        </section>
    )
}