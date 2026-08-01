import Style from "./DisplayCurr.module.css"
import { useTranslation } from 'react-i18next';


export default function DisplayCurr(props)
{
    const { t, i18n } = useTranslation();

    return (
        <section className={Style.Curr}>
            <p style={{paddingTop : "10px"}}>{props.name} {t("paraCurrency")} </p>
            <div className={Style.CurrInfo}>
                <div className={Style.FlagContainer}> 
                    <img src={props.flag} alt="flagImage" />
                    <p>{props.name}</p>
                </div>
                { props.Num != null ? 
                    <p style={{fontVariantNumeric: "lining-nums"}}>{props.Num}</p> :
                    <input type="number"
                        min="0"
                        max="10000000"
                    onChange={(e) => {
                        let val = e.target.value;
                        if (val > 10000000) val = 10000000;
                        if (val < 0) val = 0;
                        props.CurrNum(val)
                    }}
                    value={props.currentNum}/>  
                }
            </div>
        </section>
    )
}