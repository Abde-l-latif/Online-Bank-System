import { useState, useEffect } from 'react';
import Brand from "../../Components/Brand/Brand";
import Style from "./Dashboard.module.css";
import { PanelsTopLeft, CreditCard, ArrowLeftRight ,Cog , Mails, ContactRound } from 'lucide-react';
import Overview from '../../Components/Overview/Overview';
import Transaction from '../../Components/Transactions/Transaction';
import Account from '../../Components/Accounts/Account';
import MyCard from '../../Components/MyCards/MyCard';
import Message from '../../Components/Messages/Message';
import Setting from '../../Components/Settings/Setting';
import Top from '../../Components/Top/Top';
import Money from "../../Assets/money-100.png";

const Dashboard = () => {

    const [activeMenu, setActiveMenu] = useState('overview');
    const [user, setUser] = useState(null);

    const menuItems = [
        { name: 'overview', icon: PanelsTopLeft, label: 'Overview' },
        { name: 'accounts', icon: ContactRound, label: 'Accounts' },
        { name: 'cards', icon: CreditCard, label: 'My cards' },
        { name: 'transactions', icon: ArrowLeftRight, label: 'Transactions' },
        { name: 'messages', icon: Mails, label: 'Messages' },
        { name: 'settings', icon: Cog, label: 'Settings' },
    ];

    useEffect(() => {
        async function GetUser() {
            const token = localStorage.getItem('token');

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
                </div>

                <div className={Style.Content}>
                    {activeMenu === 'overview' && <Overview />}
                    {activeMenu === 'accounts' && <Account UserInfo={user} />}
                    {activeMenu === 'cards' && <MyCard />}
                    {activeMenu === 'transactions' && <Transaction />}
                    {activeMenu === 'messages' && <Message />}
                    {activeMenu === 'settings' && <Setting />}
                </div>

                <div>
                    <div className={Style.RepresentUser}>
                        <div className={Style.UserAvatar}>
                            <img src={Money} alt="UserAvatar" />
                        </div>
                        <p>Welcome</p>
                        <p style={{ fontWeight: 'bold', color: 'black' }}>{user?.customer?.firstName} {user?.customer?.lastName}</p>
                    </div>
                </div>
            </section>
        </>
    )
}


export default Dashboard;