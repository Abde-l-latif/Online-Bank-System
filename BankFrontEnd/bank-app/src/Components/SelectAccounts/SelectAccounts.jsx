import Style from "./SelectAccounts.module.css";
import { CreditCard, HandCoins } from 'lucide-react';
import { useTranslation } from "react-i18next";


const SelectAccounts = ({accounts, selectAccountNumber, setSelectAccountNumber}) => {
    const { t } = useTranslation();
    return (
        <div className={Style.SelectAccountsContainer}>
            <div className={`${Style.AccountBoxContent} ${selectAccountNumber == accounts[0]?.accountNumber ? Style.selected : ""}`} onClick={()=> {
                setSelectAccountNumber(accounts[0]?.accountNumber)
            }}>
                <div className={Style.AccountBoxIcon}>
                    {accounts[0]?.accountType == "Checking" ? <CreditCard /> : <HandCoins />}
                </div>
                <div className={Style.AccountBoxInfo}>
                    <h4>{accounts[0]?.accountType == "Checking" ? t("Dashboard.checkingAccount") : t("Dashboard.savingAccount")}</h4>
                    <p>{accounts[0]?.accountNumber.match(/.{1,4}/g)?.join(" ")} °
                        {accounts[0]?.accountBalance?.toLocaleString('fr-FR',
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                </div> 
            </div>   
            <div className={`${Style.AccountBoxContent} ${selectAccountNumber == accounts[1]?.accountNumber ? Style.selected : ""}`}  onClick={()=> {
                setSelectAccountNumber(accounts[1]?.accountNumber)
            }}>
                <div className={Style.AccountBoxIcon}>
                    {accounts[1]?.accountType == "Checking" ? <CreditCard /> : <HandCoins />}
                </div>
                <div className={Style.AccountBoxInfo}>
                    <h4>{accounts[1]?.accountType == "Checking" ? t("Dashboard.checkingAccount") : t("Dashboard.savingAccount")}</h4>
                    <p>{accounts[1]?.accountNumber.match(/.{1,4}/g)?.join(" ")} °
                        {accounts[1]?.accountBalance?.toLocaleString('fr-FR',
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                </div> 
            </div>                    
        </div>
    )
}

export default SelectAccounts;