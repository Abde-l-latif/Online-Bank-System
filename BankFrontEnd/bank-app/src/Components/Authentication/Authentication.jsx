import userAuth from "../../assets/userAuth.svg"
import passwordAuth from "../../assets/passwordAuth.svg"
import Style from "./Authentication.module.css"

export default function Authentication()
{
    return (
        <>
            <section className={Style.Auth}>
                <form action="" >
                <   h3>Authentification</h3>
                    <fieldset>
                        <legend>S'inscrire</legend>
                        <div>
                            <img src={userAuth} alt="userIcon" />
                            <input type="text" placeholder="E-mail" required/>
                        </div>
                        <div>
                            <img src={passwordAuth} alt="passwordIcon" />
                            <input type="password" placeholder="Mot de passe" required/>
                        </div>
                    </fieldset>
                    <button>SE CONNECTER</button>
                </form>
            </section>
            
        </>
    )
}