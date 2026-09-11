import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Style from "./EditPassword.module.css";

const EditPassword = ({ onClose }) => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((currentData) => ({ ...currentData, [name]: value }));
    };

    const handleSubmit = () => {
    };

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

                <form className={Style.form} onSubmit={handleSubmit}>
                    <label>
                        Current password
                        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required />
                    </label>
                    <label>
                        New password
                        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
                    </label>
                    <label>
                        Confirm new password
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    </label>
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