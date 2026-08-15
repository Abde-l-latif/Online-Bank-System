import Style from "./Header.module.css"
import bankLogo from "../../assets/bankLogo.svg"
import { useTranslation } from 'react-i18next';
import { Link } from "react-router";
import Brand from "../Brand/Brand";

export default function Header()
{
    const { t, i18n } = useTranslation();

    return (
        <section className={Style.header}>
            <Brand/> 
            <nav>
                <ul>
                    <li className={Style.active}>{t("headerNavOne")}</li>
                    <li>{t("headerNavTwo")}</li>
                    <li>{t("headerNavThree")}</li>
                    <li>{t("headerNavFour")}</li>
                </ul>
            </nav>
            <div className={Style.headerAuth}>
                <Link to="/login">
                   <p>{t("HeaderLogin")}</p>
                </Link>
                <Link to="/register">
                    <button>
                        {t("HeaderSignup")}
                    </button>
                </Link>
            </div>
        </section>
    )
}