import Style from "./Transaction.module.css";
import { useState, useEffect } from "react";
import MyCustomSelect from "../CustomSelect/MyCustomSelect.jsx";

const Transaction = () => {

    const [transactions , setTtransaction ] = useState(null);
    const [pagesNumber , setPagesNumber] = useState(0)

    useEffect(() => {
        const token = localStorage.getItem('token');

        async function getTransaction() {
            try {
                const response = await fetch(`https://localhost:7194/api/Transfers/Customer/1`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json() ; 

                if(response.ok) 
                {
                    console.log(data);
                    setTtransaction(data);
                    setPagesNumber(data?.pagesNumber)
                }

            } catch(err) {
                console.log(err.message);
            }
        }


        getTransaction();

        return () => { }
        
    }, []);


    const DisplayTransaction = transactions?.transactions.map((trans) => {

        const shortDate = new Date(trans?.createdAt).toLocaleDateString('en-US', {
            dateStyle: 'short' 
        });

        return (
            <tr key={trans?.transactionID}>
                <td>{shortDate}</td>
                <td>{trans?.transactionType}</td>
                <td>next time</td>
                <td>{trans?.amount}</td>
                <td>{trans?.status}</td>
            </tr>
        )
    })

   

    return (

        <section className={Style.transaction}>
            <div>
                <h2>Transaction</h2>
            </div>

            <div style={{marginTop : "10px"}}>
                <div className={Style.transHeader}>
                    <div className={Style.Column}>
                        <p>Total Transactions</p>
                        <p className={Style.Transaction}>{transactions?.totalCount}</p>
                    </div>
                    <div className={Style.line}></div>
                    <div className={Style.Column}>
                        <p>Total Income</p>
                        <p className={Style.Income}>{transactions?.totalIncome} MAD</p>
                    </div>
                    <div className={Style.line}></div>
                    <div className={Style.Column}>
                        <p>Total Expense</p>
                        <p className={Style.Outcome}>{transactions?.totalExpense} MAD</p>
                    </div>
                </div>
            </div>


            <div className={Style.FilterContainer}>
                <div className={Style.Selectsfilter}>
                    <MyCustomSelect label={"Account Type"}/>
                    <MyCustomSelect label={"Transaction Type"}/>
                    <MyCustomSelect label={"States"}/>
                    <MyCustomSelect label={"Date"}/>
                </div>
                <button className={Style.filterBTN}>View</button>
            </div>


            <div className={Style.TransactionList}>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Transaction Type</th>
                            <th>Account Type</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DisplayTransaction}
                    </tbody>
                </table>
            </div>

            <div className={Style.TransFooter}>

                <button className={Style.BtnPre}>Previous</button>

                <div></div>

                <button className={Style.BtnNext}>Next</button>

            </div>

        </section>
    )
}

export default Transaction;