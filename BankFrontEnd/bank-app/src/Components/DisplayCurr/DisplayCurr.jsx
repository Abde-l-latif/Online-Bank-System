
import Style from "./DisplayCurr.module.css"


export default function DisplayCurr(props)
{
    return (
        <section className={Style.Curr}>
            <p>{props.name} devise </p>
            <div className={Style.CurrInfo}>
                <div className={Style.FlagContainer}> 
                    <img src={props.flag} alt="flagImage" />
                    <p>{props.name}</p>
                </div>
                <p style={{fontVariantNumeric: "lining-nums"}}>{props.Num}</p>
            </div>
        </section>
    )
}