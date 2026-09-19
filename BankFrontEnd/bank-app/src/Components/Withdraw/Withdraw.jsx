import Style from "./Withdraw.module.css";
import SelectAccounts from "../SelectAccounts/SelectAccounts";
import {useState} from "react";
import { CreditCard, CalendarFold, User, BanknoteArrowDown } from "lucide-react";
import visa from '../../assets/visa.png';
import mastercard from '../../assets/mastercard.png';

const Withdraw = ({accounts}) => 
{
    const [selectAccountNumber, setSelectAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [cardInfo, setCardInfo] = useState({cardNum: "", Expiration: "", cvc: "", name: ""});

    return (
        <div className={Style.WithdrawContainer}>
            <h3>Withdraw</h3>
            <p>Take money from your account</p>
            <div className={Style.SelectAccount}>
                <h4>Select an account</h4>
                <SelectAccounts
                    accounts={accounts}
                    selectAccountNumber={selectAccountNumber}
                    setSelectAccountNumber={setSelectAccountNumber}
                />
            </div>
            <div className={Style.AccountBoxAmount}>
                <h4>Amount (MAD)</h4>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))}
                />
            </div>
            <div className={Style.paimentMethodContainer}>
                <h4>Payment method</h4>
                <p style={{marginTop: "5px"}}>Credit/Debit card:</p>
                <div className={Style.cardDetails}>
                    <div className={Style.RowOne}>
                        <div className={Style.RowOneContent}>
                            <CreditCard />
                            <div className={Style.RowOneInfo}>
                                <h5>Card number</h5>
                                <input
                                    type="text"
                                    placeholder="Enter account number"
                                    value={cardInfo.cardNum}
                                    pattern="[0-9]*"
                                    maxLength={16}
                                    onChange={(event) => setCardInfo({...cardInfo, cardNum: event.target.value.replace(/\D/g, "")})}
                                />
                            </div>
                        </div>
                        <div className={Style.RowOneImages}>
                            <img src={visa} alt="visa" />
                            <img src={mastercard} alt="mastercard" />
                        </div>
                    </div>

                    <div className={Style.RowTwo}>
                        <div className={Style.RowTwoDate}>
                            <CalendarFold />
                            <div>
                                <h5>Expiration Date</h5>
                                <input
                                    type="text"
                                    placeholder="MM / YY"
                                    value={cardInfo.Expiration}
                                    maxLength={7}
                                    onChange={(event) => {
                                        let value = event.target.value.replace(/\D/g, "");
                                        if (value.length > 2) value = `${value.slice(0, 2)} / ${value.slice(2, 4)}`;
                                        setCardInfo({...cardInfo, Expiration: value});
                                    }}
                                />
                            </div>
                        </div>
                        <div className={Style.RowTwoCVC}>
                            <h5>CVC</h5>
                            <input
                                type="text"
                                placeholder="123"
                                minLength={3}
                                maxLength={3}
                                value={cardInfo.cvc}
                                onChange={(event) => setCardInfo({...cardInfo, cvc: event.target.value.replace(/\D/g, "")})}
                            />
                        </div>
                    </div>

                    <div className={Style.RowThree}>
                        <User />
                        <div>
                            <h5>Cardholder name</h5>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={cardInfo.name}
                                onChange={(event) => setCardInfo({...cardInfo, name: event.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <button className={Style.BTNWithdraw}>
                    <BanknoteArrowDown />
                    <p>Withdraw</p>
                </button>
            </div>
        </div>
    )
}

export default Withdraw;