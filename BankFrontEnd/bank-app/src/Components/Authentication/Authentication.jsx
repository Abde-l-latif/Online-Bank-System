import userAuth from "../../assets/userAuth.svg"
import passwordAuth from "../../assets/passwordAuth.svg"
import Style from "./Authentication.module.css"
import { useForm } from "react-hook-form"
import { EyeClosed, Eye  } from 'lucide-react';
import { useState } from "react";
import { useTranslation } from 'react-i18next';

export default function Authentication()
{
    const { t, i18n } = useTranslation();
    const [ShowPassword, SetShowPassword] = useState(false) ;
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => console.log(data)

    return (
        <>
            <section className={Style.Auth}>
                <h2 style={{textAlign : "center"}}>{t("AuthTitle")}</h2>
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <h3>{t("AuthTitle2")}</h3>
                    <fieldset>
                        <legend>{t("AuthTitle3")}</legend>
                        <div>
                            <img src={userAuth} alt="userIcon" />
                            <input type="text" placeholder={t("AuthEmailPlaceholder")}  {...register("EmailRequired", { required: true, pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: t("AuthErrorEmailFormat")
                            } })}/>
                        </div>
                        {errors.EmailRequired?.type === "required" && <p className={Style.error}>{t("AuthErrorRequired")}</p>}
                        {errors.EmailRequired?.type === "pattern" && <p className={Style.error}>{errors.EmailRequired.message}</p>}

                        <div>
                            <img src={passwordAuth} alt="passwordIcon" />
                            <input type={!ShowPassword ? "password" : "text"} placeholder={t("AuthPasswordPlaceholder")}  {...register("passwordRequired", { required: true , minLength: {
                                value: 8,
                                message: t("AuthErrorPasswordMin")
                            },
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=[\]{};:'",.<>/\\|~`])[A-Za-z\d@$!%*?&#^()_\-+=[\]{};:'",.<>/\\|~`]{8,}$/,
                                message: t("AuthErrorPasswordFormat")
                            } })}/>
                            <span className={Style.Eye} onClick={() => SetShowPassword(!ShowPassword) }>
                                {!ShowPassword ? <EyeClosed color="rgb(14, 51, 38)"/> : <Eye color="rgb(14, 51, 38)"/> }
                            </span>
                        </div>
                        {errors.passwordRequired?.type === "required" && <p className={Style.error}>{t("AuthErrorRequired")}</p>}
                        {errors.passwordRequired?.type === "minLength" && <p className={Style.error}>{errors.passwordRequired.message}</p>}
                        {errors.passwordRequired?.type === "pattern" && <p className={Style.error}>{errors.passwordRequired.message}</p>}
                    </fieldset>
                    <button >{t("AuthButtonLogin")} </button>
                </form>
                <p>{t("AuthLittlePara")} AbdoBank ? <span>{t("HeaderSignup")}</span></p>
            </section>
            
        </>
    )
}