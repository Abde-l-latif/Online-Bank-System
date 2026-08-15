import Brand from "../../Components/Brand/Brand";
import Style from "./Dashboard.module.css";
import { PanelsTopLeft, CreditCard, ArrowLeftRight ,Cog , Mails } from 'lucide-react';

const Dashboard = () => {
    return (
        <section className={Style.Dashboard}>
            <div className="">
                <Brand/>
                <ul>
                    <div className={Style.SideMenu}>
                        <PanelsTopLeft size={20} color="grey" />
                        <li>Overview</li>
                    </div>
                    <div className={Style.SideMenu}>
                        <CreditCard  size={20} color="grey" />
                        <li>My Cards</li>
                    </div>
                    <div className={Style.SideMenu}>
                        <ArrowLeftRight  size={20} color="grey" />
                        <li>Transactions</li>
                    </div>
                    <div className={Style.SideMenu}>
                        <Mails  size={20} color="grey" />
                        <li>Messages</li>
                    </div>
                    <div className={Style.SideMenu}>
                        <Cog size={20} color="grey" />
                        <li>Settings</li>
                    </div>
                </ul>
            </div>
        </section>
    )
}


export default Dashboard;