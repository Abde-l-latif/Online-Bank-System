import Style from "./DisplayCurr.module.css"


export default function DisplayCurr(props)
{

    return (
        <section className={Style.Curr}>
            <p style={{paddingTop : "10px"}}>{props.name} devise </p>
            <div className={Style.CurrInfo}>
                <div className={Style.FlagContainer}> 
                    <img src={props.flag} alt="flagImage" />
                    <p>{props.name}</p>
                </div>
                { props.Num != null ? 
                    <p style={{fontVariantNumeric: "lining-nums"}}>{props.Num}</p> :
                    <input type="number"
                        min="1"
                        max="10000000"
                    onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 10000000) val = 10000000;
                        if (val < 1) val = 1;
                        props.CurrNum(val)
                    }}
                    value={props.currentNum}/>  
                }
            </div>
        </section>
    )
}