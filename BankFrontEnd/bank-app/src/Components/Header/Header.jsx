import Style from "./Header.module.css"
import bankLogo from "../../assets/bankLogo.svg"
import { useTranslation } from 'react-i18next';
import { Link } from "react-router";
import Brand from "../Brand/Brand";
import { useState } from "react";

export default function Header({ selectedSection, setSelectedSection })
{
    const { t, i18n } = useTranslation();

    const handelNav = (section) => {
        setSelectedSection(section);
    }

    return (
        <section className={Style.header}>
            <Brand/> 
            <nav>
                <ul>
                    <a href="#home" onClick={() => handelNav("home")}>
                        <li className={selectedSection == "home" ? Style.active : ""}>{t("headerNavOne")}</li>
                    </a>
                    <a href="#about" onClick={() => handelNav("about")}>
                        <li className={selectedSection == "about" ? Style.active : ""}>{t("headerNavTwo")}</li>
                    </a>
                    <a href="#services" onClick={() => handelNav("services")}>
                        <li className={selectedSection == "services" ? Style.active : ""}>{t("headerNavThree")}</li>
                    </a>
                    <a href="#contact" onClick={() => handelNav("contact")}>
                        <li className={selectedSection == "contact" ? Style.active : ""}>{t("headerNavFour")}</li>
                    </a>
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