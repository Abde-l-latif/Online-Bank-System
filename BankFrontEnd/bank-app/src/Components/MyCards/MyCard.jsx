import Style from './MyCard.module.css'
import {CreditCard , Plus , Undo2 } from 'lucide-react';
import Brand from '../Brand/Brand';
import visa from "../../assets/visa.png";
import masterCard from "../../assets/mastercard.png"
import { useState, useEffect } from 'react';
import AddCard from '../AddCards/AddCard';
import { apiFetch } from '../../utils/functions/ApiFunction';
import { useTranslation } from 'react-i18next';

const MyCard = ({customerId, email}) => {

    const [cards, setCards] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [addCardStatus, setAddCardStatus] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
       
        const fetchCards = async () => {
            try {
                const response = await apiFetch(`https://localhost:7194/api/Cards/${customerId}`, {
                 method: 'GET',
                headers: { 
                    'Content-Type': 'application/json' } }, email);

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

    useEffect(() => {

        async function GetAccounts() {

            let isMounted = true;

            try {
                const response = await apiFetch(`https://localhost:7194/api/Accounts/${customerId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, email);
    
                
                if(response.ok)
                {
                    const data = await response.json();
    
                    if (isMounted) {
                        setAccounts(data);
                        console.log(data);
                    }
                }

            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        
            return () => {
                isMounted = false;
            };
        }

        GetAccounts();

    }, []);

    const accountsWithoutCards = accounts?.filter(
        account => !cards?.some(
            card => card.accountID === account.accountID
        )
    );


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
                    <img src={card?.cardBrand == 'Visa'  ? visa : masterCard} alt="CardType" />
                </div>
            </div>
        </div>
    )});

    const FreezeCard = async () => {

        try {
            const response = await apiFetch(`https://localhost:7194/api/Cards/Freeze/${selectedCard?.cardID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, email);

            if(response.ok)
                setSelectedCard(null);
    

        } catch (error) {
            console.error('Error fetching accounts:', error);
        }

    }


    return (
        addCardStatus ? (
            <section className={Style.myCard}>
                <div className={Style.myCardsHeader}>
                    <div>
                        <h2>{t('Cards.addTitle')}</h2>
                        <p>{t('Cards.addDescription')}</p>
                    </div>
                    <div className={Style.AddBtn} onClick={() => setAddCardStatus(!addCardStatus)}>
                        <Undo2 size={20} color="white" />
                        <p>{t('Cards.back')}</p>
                    </div>
                </div>
                <AddCard accounts={accountsWithoutCards} email={email}/>
            </section>
        ) : (
            <section className={Style.myCard}>
                <div className={Style.myCardsHeader}>
                    <div>
                        <h2>{t('Cards.title')}</h2>
                        <p>{t('Cards.description')}</p>
                    </div>
                    <div className={Style.AddBtn} onClick={() => setAddCardStatus(!addCardStatus)}>
                        <Plus size={20} color="white" />
                        <p>{t('Cards.order')}</p>
                    </div>
                </div>
                <div className={Style.CardContainer}>
                    {DisplayCards}
                </div>
                <div className={Style.SelectedCardContainer}>
                    <h3>{t('Cards.selected')}</h3>
                    <p>{t('Cards.details')}</p>
                    <div>
                        {selectedCard && (
                            <div className={Style.SelectedCardDetails}>
                                    <p> <span>{t('Cards.number')}</span> {selectedCard?.cardNumber?.match(/.{1,4}/g)?.join(" ")}</p>
                                    <p> <span>{t('Cards.holder')}</span> {selectedCard?.cardHolderName}</p>
                                    <p> <span>{t('Cards.expiration')}</span> {new Date(selectedCard?.expirationDate).toLocaleDateString("en-US", {
                                        dateStyle: 'short',
                                })}</p>
                                    <p> <span>{t('Cards.brand')}</span> {selectedCard?.cardBrand}</p>
                                    <p> <span>{t('Cards.status')}</span> {selectedCard?.status}</p>
                                    <p> <span>{t('Cards.type')}</span> {selectedCard?.cardType}</p>
                                    <p> <span>{t('Cards.accountType')}</span> {selectedCard?.account?.accountType}</p>
                                <div className={Style.FreezeCardBtn} onClick={FreezeCard}>
                                    <CreditCard size={20} color="white" />
                                    <p>{t('Cards.freeze')}</p>
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