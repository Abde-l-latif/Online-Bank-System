import Style from './MyCard.module.css'
import {CreditCard , Plus , Undo2 } from 'lucide-react';
import Brand from '../Brand/Brand';
import visa from "../../assets/visa.png";
import masterCard from "../../assets/mastercard.png"
import { useState, useEffect } from 'react';
import AddCard from '../AddCards/AddCard';

const MyCard = ({customerId}) => {

    const [cards, setCards] = useState(null);
    const token = localStorage.getItem('token');
    const [selectedCard, setSelectedCard] = useState(null);
    const [addCardStatus, setAddCardStatus] = useState(false);

    useEffect(() => {
       
        const fetchCards = async () => {
            try {
                const response = await fetch(`https://localhost:7194/api/Cards/${customerId}`, {
                 method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` } });

                if(response.ok) 
                {
                    const data = await response.json();
                    setCards(data);
                    console.log(data);
                }

            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        };

        fetchCards();

        return () => {

        }

    }, []);

    const DisplayCards = cards?.map((card) => {

        const formatted = new Date(card?.expirationDate).toLocaleDateString("en-US", {
            month: "2-digit",
            year: "2-digit"
        });

        return (   
        <div key={card.cardID} className={`${Style.card} ${selectedCard != null && selectedCard.cardID === card.cardID ? Style.selectedCard : ""}`}
         onClick={() => setSelectedCard(card)}>
            <Brand/>
            <p>{card.cardNumber.match(/.{1,4}/g)?.join(" ")}</p>
            <div>
                <p>{card.cardHolderName}</p>
                <div className={Style.cardFooter}>
                    <p>{formatted}</p>
                    <img src={card?.cardBrand === 'Visa' ? visa : masterCard} alt="CardType" />
                </div>
            </div>
        </div>
    )});


    return (
        addCardStatus ? (
            <section className={Style.myCard}>
                <div className={Style.myCardsHeader}>
                    <div>
                        <h2>Add new Card</h2>
                        <p> This is the card creation area. </p>
                    </div>
                    <div className={Style.AddBtn} onClick={() => setAddCardStatus(!addCardStatus)}>
                        <Undo2 size={20} color="white" />
                        <p>Back to Cards</p>
                    </div>
                </div>
                <AddCard cards={cards} />
            </section>
        ) : (
            <section className={Style.myCard}>
                <div className={Style.myCardsHeader}>
                    <div>
                        <h2>My Cards</h2>
                        <p> Add or Manage your cards </p>
                    </div>
                    <div className={Style.AddBtn} onClick={() => setAddCardStatus(!addCardStatus)}>
                        <Plus size={20} color="white" />
                        <p>Order New Card</p>
                    </div>
                </div>
                <div className={Style.CardContainer}>
                    {DisplayCards}
                </div>
                <div className={Style.SelectedCardContainer}>
                    <h3>Selected Card</h3>
                    <p>Selected Card Details :</p>
                    <div>
                        {selectedCard && (
                            <div className={Style.SelectedCardDetails}>
                                <p> <span>Card Number:</span> {selectedCard.cardNumber.match(/.{1,4}/g)?.join(" ")}</p>
                                <p> <span>Card Holder:</span> {selectedCard.cardHolderName}</p>
                                <p> <span>Expiration Date:</span> {new Date(selectedCard.expirationDate).toLocaleDateString("en-US", {
                                        dateStyle: 'short',
                                })}</p>
                                <p> <span>Card Brand:</span> {selectedCard.cardBrand}</p>
                                <p> <span>Card Status:</span> {selectedCard.status}</p>
                                <p> <span>Card Type:</span> {selectedCard.cardType}</p>
                                <p> <span>Account Type:</span> {selectedCard.account.accountType}</p>
                                <div className={Style.FreezeCardBtn}>
                                    <CreditCard size={20} color="white" />
                                    <p>Freeze Card </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        )

    )
}

export default MyCard;