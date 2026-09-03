import { useState, useEffect } from 'react';
import Brand from "../../Components/Brand/Brand";
import Style from "./Dashboard.module.css";
import { PanelsTopLeft, CreditCard, ArrowLeftRight ,Cog , ArrowBigDownDash , ContactRound, ArrowBigUpDash , ListSortAscending   } from 'lucide-react';
import Overview from '../../Components/Overview/Overview';
import Transaction from '../../Components/Transactions/Transaction';
import Account from '../../Components/Accounts/Account';
import MyCard from '../../Components/MyCards/MyCard';
import Setting from '../../Components/Settings/Setting';
import Top from '../../Components/Top/Top';
import Money from "../../Assets/money-100.png";
import Robot from "../../Assets/greenRobotCom.png";

const Dashboard = () => {

    const [activeMenu, setActiveMenu] = useState('overview');
    const [user, setUser] = useState(null);
    const [activeIcon, setActiveIcon] = useState("All");
    const [recentTrans, setRecentTrans] = useState(null);

    const menuItems = [
        { name: 'overview', icon: PanelsTopLeft, label: 'Overview' },
        { name: 'accounts', icon: ContactRound, label: 'Accounts' },
        { name: 'cards', icon: CreditCard, label: 'My cards' },
        { name: 'transactions', icon: ArrowLeftRight, label: 'Transactions' },
        { name: 'settings', icon: Cog, label: 'Settings' },
    ];
    const token = localStorage.getItem('token');

    useEffect(() => {
        async function GetUser() {

            const response = await fetch('https://localhost:7194/api/user/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const userData = await response.json();

            if (response.ok) {
                console.log(userData?.userResponseDTO);
                setUser(userData?.userResponseDTO);
            }
        }

        GetUser();

        return () => {}

    }, []);

    
    useEffect(() => {

        async function getTransaction() {
            try {
                const response = await fetch(`https://localhost:7194/api/Transfers/Customer/filtred`,
                    {      
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            pageSize: 3
                        })
                    }
                );

                const data = await response.json() ; 

                if(response.ok) 
                {
                    console.log(data);
                    setRecentTrans(data);
                }

            } catch(err) {
                console.log(err.message);
            }
        }


        getTransaction();

        return () => { }
        
    }, []);
    

    const transactionTypes = {
        "Transfer to" : 2,
        "Transfer from" : 3 ,
    }

    async function GetFiltredTransaction(transType = null) 
    {
        const GettransactionType = [];

        if(transType != null)
        {
            GettransactionType.push(transType);
        }
  
        try {
            const response = await fetch(`https://localhost:7194/api/Transfers/Customer/filtred`,
                {      
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        transType : GettransactionType,
                        pageSize: 3
                    })
                }
            );

            const data = await response.json() ; 

            if(response.ok) 
            {
                console.log(data);
                setRecentTrans(data);
            }

        } catch(err) {
            console.log(err.message);
        }
    }

    const displayRecentTransaction = recentTrans?.transactions?.map((x) => {
        const shortDate = new Date(x?.createdAt).toLocaleString('en-US', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
        return(
            <div key={x?.transactionID} className={Style.TransactionContainer}>
                <div style={{display : 'flex', gap : "10px", alignItems : "center"}}>
                    <img src={Money} alt="UserAvatar" />
                    <div className={Style.TransactionInfo}>
                        <p>{x?.relatedAccount?.customer?.firstName + " " + x?.relatedAccount?.customer?.lastName}</p>
                        <p>{shortDate}</p>
                    </div>
                </div>
                <p className={x?.transactionType == "transferTo" ? Style.Outcome : Style.Income}>{x?.transactionType == "transferTo" ? "-" + x?.amount : "+" + x?.amount} MAD</p>
            </div>
        )
    })
    

    return (
        <>
            <Top/>
            <section className={Style.Dashboard}>
                <div className={Style.SideMenu}>
                    <Brand/>
                    <ul>
                        {menuItems.map((item) => (
                            <div 
                                key={item.name}
                                className={`${Style.SideMenuItem} ${activeMenu === item.name ? Style.Active : ''}`}
                                name={item.name}
                                onClick={() => setActiveMenu(item.name)}
                            >
                                <item.icon size={20} color={activeMenu === item.name ? " rgb(158, 192, 74)" : "grey"} />
                                <li>{item.label}</li>
                            </div>
                        ))}
                    </ul>
                    <div className={Style.SideMenuButtomItem}>  
                    </div>
                    <img src={Robot} alt="RobotImage" />
                </div>

                <div className={Style.Content}>
                    {activeMenu === 'overview' && <Overview />}
                    {activeMenu === 'accounts' && <Account UserInfo={user} />}
                    {activeMenu === 'cards' && <MyCard />}
                    {activeMenu === 'transactions' && <Transaction/>}
                    {activeMenu === 'settings' && <Setting />}
                </div>

                <div>
                    <div className={Style.RepresentUser}>
                        <div className={Style.UserAvatar}>
                            <img src={Money} alt="UserAvatar" />
                        </div>
                        <p>Welcome</p>
                        <p style={{ fontWeight: 'bold', color: 'black' }}>{user?.customer?.firstName} {user?.customer?.lastName}</p>
                        <div className={Style.sideBarFooter}>
                            <div className={Style.iconFilter}>
                                <div className={`${Style.iconContainer} ${activeIcon == "Send" ? Style.iconActive : ""}`}>
                                    <ArrowBigUpDash className={Style.icon} onClick={() => { setActiveIcon("Send"); GetFiltredTransaction(transactionTypes["Transfer to"])}}/>
                                    <p>Send</p>
                                </div>
                                <div className={`${Style.iconContainer} ${activeIcon == "Recieve" ? Style.iconActive : ""}`}>
                                    <ArrowBigDownDash className={Style.icon} onClick={() => { setActiveIcon("Recieve"); GetFiltredTransaction(transactionTypes["Transfer from"])}}/>
                                    <p>Recieve</p>
                                </div>
                                <div className={`${Style.iconContainer} ${activeIcon == "All" ? Style.iconActive : ""}`}>
                                    <ListSortAscending  className={Style.icon} onClick={() => { setActiveIcon("All") ; GetFiltredTransaction()}}/>
                                    <p>All</p>
                                </div>
                            </div>

                            <div className={Style.displayTransactions}>
                                <h3>Recent Activity</h3>     
                                {displayRecentTransaction}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}


export default Dashboard;