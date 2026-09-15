import { HandCoins, BanknoteArrowDown, Circle, CircleCheck, Plus } from 'lucide-react';
import Style from "./AddAccount.module.css";
import { useState } from 'react';
import { apiFetch } from '../../utils/functions/ApiFunction';


const AddAccount = ({Email}) => {
    const [AccountType, setAccountType] = useState(null);
    const [customError, setcustomError] = useState({status : false, msg: ""});
    const [response, setResponse] = useState({status : false, msg: ""});

    const submitAddAccount = async () => {

        if(AccountType == null)
        {
            setcustomError({status : true, msg : "You didn't select any type"});
            return
        } else
            setcustomError({status : false, msg : ""});

         try {
            const response = await apiFetch(`https://localhost:7194/api/Accounts/Add`,
                {      
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: AccountType == "Checking" ? 0 : 1
                },
                Email 
            );

            const data = await response.text() ; 

            if(response.ok) 
            {
                setResponse({status : true, msg : data});
            }

        } catch(err) {
            console.log(err.message);
        }
    }

    return (
        <>
            <div className={Style.parent}>
                <header className={Style.header}>
                    <div className={`${Style.AccountBox} ${AccountType == "Checking" ? Style.border : ""}`} onClick={()=> setAccountType("Checking")}>
                        <div className={Style.AccountTitle}>
                            <BanknoteArrowDown size={40} />
                            <p>Checking account</p>
                        </div>
                        {AccountType == "Checking" ? <CircleCheck className={Style.CheckIcon}/> : <Circle className={Style.CheckIcon}/>} 
                    </div>
                    <div className={`${Style.AccountBox} ${AccountType == "Saving" ? Style.border : ""}`} onClick={()=> setAccountType("Saving")}>
                        <div className={Style.AccountTitle}>
                            <HandCoins size={40}  />
                            <p>Saving account</p>
                        </div>
                        {AccountType == "Saving" ? <CircleCheck className={Style.CheckIcon}/> : <Circle className={Style.CheckIcon}/>} 
                    </div>
                </header>

                <div className={Style.Information}>
                    <h3>Initial Deposit</h3>
                    <p>0.00 MAD</p>
                    <p>You can fund your account later</p>
                </div>

                <div className={Style.Footer} onClick={submitAddAccount}>
                    <Plus/>
                    <p>Create Account</p>
                </div>
                
               <p style={{marginTop: "10px", color: "red"}}>{customError.status == true ? customError.msg : "" }</p>
               <p style={{marginTop: "10px", color: "green"}}>{response.status == true ? response.msg : "" }</p>
            </div>
        </>
    )
}



export default AddAccount;