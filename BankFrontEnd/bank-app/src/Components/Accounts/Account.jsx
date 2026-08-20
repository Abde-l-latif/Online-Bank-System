import Style from "./Account.module.css";
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';



const Account = ({ UserInfo }) => {

    const [accounts, setAccounts] = useState([]);
    
    const [transAccounts, setTransAccounts] = useState([]);

    useEffect(() =>{

         let isMounted = true;

        const token = localStorage.getItem('token');

        async function GetAccounts() {

            try {
                const response = await fetch(`https://localhost:7194/api/Accounts/${UserInfo?.customerID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                
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

        const token = localStorage.getItem('token');

        async function GetAccountsTransaction() {

            try {
                const response = await fetch(`https://localhost:7194/api/Transfers/All`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                
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
                            <p className={Style.Balance}>{trans?.balance} MAD</p>
                        </div>
                        <div className={Style.line}></div>
                        <div className={Style.Column}>
                            <p>Total Income</p>
                            <p className={Style.Income}>{income} MAD</p>
                        </div>
                        <div className={Style.line}></div>
                        <div className={Style.Column}>
                            <p>Total Outcome</p>
                            <p className={Style.Outcome}>{outcome} MAD</p>
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
                <h4>{account.accountType} account</h4>
                <p>{account.accountNumber}</p>
                <div className={Style.AccountInfo}>
                    <div style={ {display: 'flex', flexDirection: 'column', gap: '5px'} }>
                        <p>Balance:</p>
                        <p>{account.accountBalance?.toFixed(2)} MAD</p>
                    </div>
                    <p style={ {fontWeight: 'bold', alignSelf: 'flex-end'} }>{account.accountStatus}</p>
                </div>
            </div>
        )
    });

    return (
        <section className={Style.Account}>
            <div className={Style.AccountHeader}>
                <div>
                    <h2>My Accounts</h2>
                    <p>This is the accounts information page.</p>
                </div>
                <div className={Style.AddAccountBtn}>
                    <Plus size={20} color="white" />
                    <p>Add new account</p>
                </div>
            </div>
            
            <div className={Style.AccountList}>
                {accountList}
            </div>

            <div className={Style.AccountSummary}>
                <h3>Account Summary</h3>
                {Transactions}
            </div>
            
        </section>
    )
}

export default Account;