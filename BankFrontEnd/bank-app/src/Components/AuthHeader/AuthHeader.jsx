
import Top from "../Top/Top"
import bankLogo from "../../assets/bankLogo.svg"
import Style from "./AuthHeader.module.css"
import { Outlet, Link } from "react-router"
import returnIcon from "../../assets/return.svg"
import Brand from "../Brand/Brand"



const AuthHeader = () => {
    return (
        <>
            <Top/>
            <div className={Style.AuthHeader}>
                <Brand/>
                <Link to="/">
                    <img src={returnIcon} alt="return icon" />
                </Link>

            </div>
            <Outlet />
        </>
    )
}

export default AuthHeader;