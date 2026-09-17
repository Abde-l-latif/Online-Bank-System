import Style from "./Account.module.css";
import { Plus , Undo2 , HandCoins , CreditCard , CloudSync , BanknoteArrowUp , BanknoteArrowDown } from 'lucide-react';
import { useState, useEffect} from 'react';
import AddAccount from "../AddAccount/AddAccount";
import {apiFetch} from "../../utils/functions/ApiFunction";
import Transfer from "../Transfer/Transfer";
import Deposit from "../Deposit/Deposit";
import Withdraw from "../Withdraw/Withdraw";


const Account = ({ UserInfo }) => {

    const [accounts, setAccounts] = useState([]);
    
    const [transAccounts, setTransAccounts] = useState([]);

    const [addStatus, setAddStatus] = useState(false);

    const [ActionBtn, setActionBtn] = useState("Transfer");

    useEffect(() =>{

        let isMounted = true;

        async function GetAccounts() {

            try {
                const response = await apiFetch(`https://localhost:7194/api/Accounts/${UserInfo?.customerID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, UserInfo?.emailAddress);
    
                
                if(response.ok)
                {
                    const data = await response.json();
    
                    if (isMounted) {
                        setAccounts(data);
                    }
                }

            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        }

        GetAccounts();

        return () => {
            isMounted = false;
        };

    }, []);

    useEffect(() =>{

         let isMounted = true;

        async function GetAccountsTransaction() {

            try {
                const response = await apiFetch(`https://localhost:7194/api/Transfers/All`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }, UserInfo?.emailAddress);
    
                
                if(response.ok)
                {
                    const data = await response.json();
    
                    if (isMounted) {
                        setTransAccounts(data);
                        console.log(data)
                    }
                }

            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        }

        GetAccountsTransaction();

        return () => {
            isMounted = false;
        };

    }, []);

    let Transactions = transAccounts.map((trans) => {

       const outcome = trans?.transactions?.reduce((total, transaction) => {
            if (transaction.transactionType === "transferTo") {
                return total + transaction.amount;
            }

            return total;
        }, 0);

        const income = trans?.transactions?.reduce((total, transaction) => {
            if (transaction.transactionType === "transferFrom") {
                return total + transaction.amount;
            }
            return total;
        }, 0)

        return(
            <div key={trans?.accountID} style={{marginTop : "10px"}}>
                    <h4>{trans?.accountType} Accounts</h4>
                    <div className={Style.AccountAction}>
                        <div className={Style.Column}>
                            <p>Total Balance</p>
                            <p className={Style.Balance}>{trans?.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                        </div>
                        <div className={Style.line}></div>
                        <div className={Style.Column}>
                            <p>Total Income</p>
                            <p className={Style.Income}>{income.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                        </div>
                        <div className={Style.line}></div>
                        <div className={Style.Column}>
                            <p>Total Outcome</p>
                            <p className={Style.Outcome}>{outcome.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                        </div>
                        <div className={Style.line}></div>
                        <div className={Style.Column}>
                            <p>Total Transactions</p>
                            <p className={Style.Transaction}>{trans?.transactions?.length}</p>
                        </div>
                    </div>
            </div>
        )
    });

    let accountList = accounts.map((account) => {
        return (
            <div className={ account.accountType === 'Savings' ? Style.AccountCardSaving : Style.AccountCard} key={account.accountID}>
                <div className={Style.iconCard}>
                    {account.accountType === 'Savings' ? <HandCoins /> : <CreditCard />}
                </div>
                <div>
                    <h4>{account.accountType} account</h4>
                    <p>{account.accountNumber.match(/.{1,4}/g)?.join(" ")}</p>
                    <div className={Style.AccountInfo}>
                        <div style={ {display: 'flex', flexDirection: 'column', gap: '5px'} }>
                            <p>Balance:</p>
                            <p>{account.accountBalance?.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                        </div>
                        <p style={ {fontWeight: 'bold', alignSelf: 'flex-end'} }>{account.accountStatus}</p>
                    </div>
                </div>
            </div>
        )
    });
    
    return (
        <>
            {addStatus ? (
                <section className={Style.Account}>
                    <div className={Style.AccountHeader}>
                        <div>
                            <h2>Add New Account</h2>
                            <p>This is the account creation area.</p>
                        </div>
                        <div className={Style.AddAccountBtn} onClick={() => setAddStatus(false)}>
                            <Undo2 size={20} color="white" />
                            <p>Back to accounts</p>
                        </div>
                    </div>

                    <div className={Style.AccountList}>
                        <AddAccount Email={UserInfo?.emailAddress}/>
                    </div>
                </section>
            ) : (
                <section className={Style.Account}>
                    <div className={Style.AccountHeader}>
                        <div>
                            <h2>My Accounts</h2>
                            <p>This is the accounts information page.</p>
                        </div>
                        <div className={Style.AddAccountBtn} onClick={() => setAddStatus(true)}>
                            <Plus size={20} color="white" />
                            <p>Add new account</p>
                        </div>
                    </div>
                    
                    <div className={Style.AccountList}>
                        {accountList}
                    </div>

                    <div className={Style.ActionContainer}>
                        <div className={Style.ActionHeader}>
                            <div className={`${Style.colHeader} ${ActionBtn == "Transfer" ? Style.Active : ""}`}
                             onClick={() => setActionBtn("Transfer")}>
                                <CloudSync />
                                <p>Transfer</p>
                            </div>

                            <div className={`${Style.colHeader} ${ActionBtn == "Deposit" ? Style.Active : ""}`}
                             onClick={() => setActionBtn("Deposit")}> 
                                <BanknoteArrowUp />
                                <p>Deposit</p>
                            </div>

                            <div className={`${Style.colHeader} ${ActionBtn == "Withdraw" ? Style.Active : ""}`}
                             onClick={() => setActionBtn("Withdraw")}>
                                <BanknoteArrowDown />
                                <p>Withdraw</p>
                            </div>
                        </div>

                        <div className={Style.ActionBody}>
                            {ActionBtn == "Transfer" ? <Transfer accounts={accounts} setAccounts={setAccounts}/> : 
                            ActionBtn == "Deposit" ? <Deposit/> : <Withdraw/>}
                        </div>
                    </div>

                    <div className={Style.AccountSummary}>
                        <h3>Account Summary</h3>
                        {Transactions}
                    </div>
                </section>
            )}
        </>
    )
}

export default Account;