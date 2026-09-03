import Style from './MyCard.module.css'
import { Plus , Undo2  } from 'lucide-react';
import Brand from '../Brand/Brand';
import visa from "../../assets/visa.png";
import masterCard from "../../assets/mastercard.png"


const MyCard = () => {
    return (
        <section className={Style.myCard}>
            <div className={Style.myCardsHeader}>
                <div>
                    <h2>My Cards</h2>
                    <p> Add or Manage your cards </p>
                </div>
                <div className={Style.AddBtn}>
                    <Plus size={20} color="white" />
                    <p>Order New Card</p>
                </div>
            </div>
            <div className={Style.CardContainer}>
                <div className={Style.card}>
                    <Brand/>
                    <p>1235 4862 5123 2156</p>
                    <div>
                        <p>ABDELLATIF</p>
                        <div className={Style.cardFooter}>
                            <p>09/30</p>
                            <img src={masterCard} alt="CardType" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default MyCard;