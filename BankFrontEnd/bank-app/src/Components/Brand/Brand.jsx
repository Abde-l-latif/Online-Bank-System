import Style from "./Brand.module.css";
import bankLogo from "../../assets/bankLogo.svg";

const Brand = () => 
{
    return (
        <div className={Style.LogoParent}>
            <div className={Style.logoContainer}>
                <img src={bankLogo} alt="Logo" />
            </div>
            <p>AbdoBank</p>
        </div>
    )
}

export default Brand; 