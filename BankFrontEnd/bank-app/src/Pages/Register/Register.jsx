import Style from "./Register.module.css";
import { Mail, UserRoundKey  } from 'lucide-react';
import mk from "../../assets/morocco2.svg";

const Register = () => {
    return (
        <section className={Style.Register}>
            <h2 style={{textAlign : "center", marginBottom: "10px"}}>Bonjour !</h2>
            <p style={{textAlign : "center" , color : "var(--smallpara-color)"}}>ici vous pouvez créer votre compte</p>

            <form action="">

                <div className={Style.Title}>
                    <Mail size={48} />
                    <h2>Coordonnées</h2>
                </div>

                <div className={Style.Row}>
                    <input type="text" placeholder="Nom" />
                    <input type="text" placeholder="Prénom" />
                </div>

                <div className={Style.Row}>
                    <input type="date" placeholder="Date de naissanse" />
                    <div>
                        <h6>Nationalité</h6>
                        <input type="text" value="Maroc" disabled/>
                    </div>
                </div>

                  <div className={Style.Row}>
                    <div style={{
                        display : "flex",
                        gap : "10px",
                        alignItems: "end"
                    }}>
                        <img src={mk} alt="MoroccoFlag" />
                        <p style={{
                                fontWeight : "bold",
                                color : "var(--primary-color)"
                            }}>+212</p>
                        <input type="text" maxLength={9} onChange={(e) => {
                            let entry = Number(e.target.value);
                            if(isNaN(entry))
                                e.target.value = "";
                        
                        }}/>
                    </div>
                    <input type="text" placeholder="CIN" />
                </div>


                <div className={Style.Rowtwo}>
                    <input type="text" placeholder="Ville" />
                    <input type="text" placeholder="Rue" />
                    <input type="number" placeholder="Code postal" /> 
                </div>


                <div className={Style.Title}>
                    <UserRoundKey size={48} />
                    <h2>Suivi votre demande</h2>
                </div>

                <input type="text" placeholder="E-mail" />

                <div className={Style.Row}>

                    <div className="PassField">
                        <input type="password" placeholder="Mot de passe"/>
                    </div>

                    <div className="PassField">
                        <input type="password" placeholder="Répéte mot de passe" />
                    </div>

                </div>

                <button>S'inscrire</button>

            </form>
        </section>
    )
}

export default Register;