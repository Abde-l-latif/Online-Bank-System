import Style from "./Account.module.css";
import { Plus } from 'lucide-react';

const Account = () => {
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
        
        <div className={Style.AccountCard}>
            <h4>Savings Account</h4>
            <p>1234 5678 9521 6523</p>
            <div className={Style.AccountInfo}>
                <p>Balance: 5,000 MAD</p>
                <p>Active</p>
            </div>
        </div>
    </section>
  )
}

export default Account;