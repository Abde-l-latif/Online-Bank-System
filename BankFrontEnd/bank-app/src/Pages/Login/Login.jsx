import Authentication from "../../Components/Authentication/Authentication"
import Top from "../../Components/Top/Top"
import Style from "./Login.module.css"

const Login = () => {
    return (
        <section className={Style.Login}>
            <div className={Style.AuthContainer}>
                <Authentication/>
            </div>
        </section>
    )
}
    
export default Login;