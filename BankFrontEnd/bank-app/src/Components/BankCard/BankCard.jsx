import Style from "./BankCard.module.css"
import cardFront from "../../assets/cardFront.png"
import cardBack from "../../assets/cardBack.png"


export default function BankCard()
{
    return(
        <div className={Style.cardContainer}>
            <div className={Style.bankCard}>
                <div className={Style.front}>
                    <img src={cardFront} alt="card-front" />
                </div>
                <div className={Style.back}>
                    <img src={cardBack} alt="card-back" />
                </div>
            </div>
        </div>
    )
}