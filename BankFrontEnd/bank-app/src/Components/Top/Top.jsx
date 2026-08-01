import Style from "./Top.module.css"
import { useTranslation } from 'react-i18next';

export default function Top()
{
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <>
            <section className={Style.Top}>
                <select name="Language" defaultValue={"French"}>
                    <option value="French" onClick={() => changeLanguage('fr')}>FR</option>
                    <option value="English" onClick={() => changeLanguage('en')}>EN</option>
                </select>
            </section>
        </>
    )
}