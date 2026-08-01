
import Top from "../Top/Top"
import bankLogo from "../../assets/bankLogo.svg"
import Style from "./AuthHeader.module.css"
import { Outlet, Link } from "react-router"
import returnIcon from "../../assets/return.svg"



const AuthHeader = () => {
    return (
        <>
            <Top/>
            <div className={Style.AuthHeader}>
                <div className={Style.AuthHeaderLogo}>
                    <div className={Style.logoContainer}>
                        <img src={bankLogo} alt="Logo" />
                    </div>
                    <p>AbdoBank</p>
                </div>
                <Link to="/">
                    <img src={returnIcon} alt="return icon" />
                </Link>

            </div>
            <Outlet />
        </>
    )
}

export default AuthHeader;