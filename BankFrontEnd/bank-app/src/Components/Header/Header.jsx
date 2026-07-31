import Style from "./Header.module.css"
import bankLogo from "../../assets/bankLogo.svg"
import { useTranslation } from 'react-i18next';

export default function Header()
{
    const { t, i18n } = useTranslation();

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
                    <li className={Style.active}>{t("headerNavOne")}</li>
                    <li>{t("headerNavTwo")}</li>
                    <li>{t("headerNavThree")}</li>
                    <li>{t("headerNavFour")}</li>
                </ul>
            </nav>
            <div className={Style.headerAuth}>
                <p>{t("HeaderLogin")}</p>
                <button>
                    {t("HeaderSignup")}
                </button>
            </div>
        </section>
    )
}