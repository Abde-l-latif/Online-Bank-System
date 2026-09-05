import Style from './AddCard.module.css';
import mastercard from "../../Assets/mastercardPNG.png";
import visa from "../../Assets/visaPNG.png";
import MyCustomSelect from "../CustomSelect/MyCustomSelect.jsx";
import { useState } from 'react';
import { CreditCard } from 'lucide-react';


const AddCard = ({ cards }) => {

    const [AccountNumber, setAccountNumber] = useState({"Account Number" : null});

    const AccountOptions = cards?.reduce((acc, card) => {
        const key = card.account.accountID;
        if (key) acc[key] = card.account.accountNumber.match(/.{1,4}/g)?.join(" ");
        return acc;
    }, {});


    

    return (
        <section className={Style.addCardContainer}>
            <h3>Choose a Card Brand</h3>
            <div className={Style.CardBrand}>
                <div className={Style.CardBrandBox}>
                    <img src={visa} alt="Visa" />
                    <h3>Visa</h3>
                </div>
                <div className={Style.CardBrandBox}>
                    <img src={mastercard} alt="Mastercard" />
                    <h3>Mastercard</h3>
                </div>
            </div>
            <h3>Linked Account</h3>
            <MyCustomSelect label={"Account Number"} options={AccountOptions} setData={setAccountNumber} mode={"single"} />
            <div className={Style.BtnContainer}>
                <div className={Style.CardBtn}>
                    <CreditCard size={20} color="white" />
                    <p>Order Card </p>
                </div>
            </div>
            
        </section>
    )
}

export default AddCard;