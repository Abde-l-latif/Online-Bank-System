import { useEffect, useState } from "react";
import { X, EyeClosed, Eye } from "lucide-react";
import Style from "./EditPassword.module.css";
import { useForm } from "react-hook-form"
import { apiFetch } from "../../utils/functions/ApiFunction";

const EditPassword = ({ onClose, email }) => {
     const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    } = useForm()

    const [ShowPassword, SetShowPassword] = useState({curr : false, new : false, confirm : false}) ;
    const [CustomError, setCustomError] = useState({status :false, msg : ""});
    const [success , setSuccess] = useState({status :false, msg : ""});

    const onSubmit = async (data) => 
    {
        setSuccess({status : false, msg : ""})
        setCustomError({status : false, msg : ""})

        if(data.ConfirmingPasswordRequired != data.NewPasswordRequired)
        {
            setCustomError({status : true, msg : "your confirm password is wrong"})
            return;
        }
  
        try {

            const Data = await apiFetch("https://localhost:7194/api/User/changePassword", {
                    method : "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body : JSON.stringify({
                        currPassword: data.OldPasswordRequired,
                        newPassword: data.NewPasswordRequired
                    })
                }, email)

            if(Data.ok)
            {
                const dataResponse = await Data.text();
                setSuccess({status : true, msg : dataResponse})
            }

        }
        catch(ex) {
            console.log("Error message : " + ex);
        }
        
    }


    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    return (
        <div className={Style.overlay} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section className={Style.modal} role="dialog" aria-modal="true" aria-labelledby="edit-password-title">
                <header className={Style.header}>
                    <div>
                        <h2 id="edit-password-title">Change Password</h2>
                        <p>Update your account password.</p>
                    </div>
                    <button className={Style.closeButton} type="button" onClick={onClose} aria-label="Close change password">
                        <X size={22} />
                    </button>
                </header>

                <form className={Style.form} onSubmit={handleSubmit(onSubmit)}>
                    
                    <label>
                        Current password
                        <div className={Style.Raw}>
                            <input type={ShowPassword.curr ? "text" : "password"} name="currentPassword"  
                            {...register("OldPasswordRequired", { required: true , minLength: {value: 8, message: "min length is 8"}})} />
                            <span onClick={() => SetShowPassword((current) => ({ ...current, curr: !current.curr })) }>
                                    {!ShowPassword.curr ? <EyeClosed color="rgb(14, 51, 38)"/> : <Eye color="rgb(14, 51, 38)"/> }
                            </span>
                        </div>
                    </label>
                    { errors?.OldPasswordRequired?.type == "required" && <p style={{ color : "red"}}>this field required</p>}
                    { errors?.OldPasswordRequired?.type == "minLength" && <p style={{ color : "red"}}>{errors?.OldPasswordRequired?.message}</p>}


                    <label>
                        New password
                        <div className={Style.Raw}>
                            <input type={ShowPassword.new ? "text" : "password"} name="newPassword"
                            {...register("NewPasswordRequired", { required: true , minLength: {value: 8, message: "min length is 8"}})} />
                            <span onClick={() => SetShowPassword((current) => ({ ...current, new: !current.new })) }>
                                {!ShowPassword.new ? <EyeClosed color="rgb(14, 51, 38)"/> : <Eye color="rgb(14, 51, 38)"/> }
                            </span>
                        </div>
                    </label>
                    { errors?.NewPasswordRequired?.type == "required" && <p style={{ color : "red"}}>this field required</p>}
                    { errors?.NewPasswordRequired?.type == "minLength" && <p style={{ color : "red"}}>{errors?.OldPasswordRequired.message}</p>}


                    <label>
                        Confirm new password
                        <div className={Style.Raw}>
                            <input type={ShowPassword.confirm ? "text" : "password"} name="confirmPassword"  
                            {...register("ConfirmingPasswordRequired", { required: true , minLength: {value: 8, message: "min length is 8"}})} />
                            <span onClick={() => SetShowPassword((current) => ({ ...current, confirm: !current.confirm })) }>
                                {!ShowPassword.confirm ? <EyeClosed color="rgb(14, 51, 38)"/> : <Eye color="rgb(14, 51, 38)"/> }
                            </span>
                        </div>
                    </label>
                    { errors?.ConfirmingPasswordRequired?.type == "required" && <p style={{ color : "red"}}>this field required</p>}
                    { errors?.ConfirmingPasswordRequired?.type == "minLength" && <p style={{ color : "red"}}>{errors?.OldPasswordRequired.message}</p>}
                    
                
                    {CustomError && <p style={{ color : "red"}}>{CustomError.msg}</p>}
                    {success && <p style={{ color : "green"}}>{success.msg}</p>}

                    <footer className={Style.footer}>
                        <button className={Style.cancelButton} type="button" onClick={onClose}>Cancel</button>
                        <button className={Style.saveButton} type="submit">Change password</button>
                    </footer>
                </form>
            </section>
        </div>
    )
}

export default EditPassword;