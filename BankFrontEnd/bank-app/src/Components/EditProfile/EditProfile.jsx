import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Style from "./EditProfile.module.css";

const EditProfile = ({ profile, onClose }) => {

    const [formData, setFormData] = useState(profile);

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

    const handleSubmit = (event) => {

    };

    return (
        <div className={Style.overlay} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section className={Style.modal} role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
                <header className={Style.header}>
                    <div>
                        <h2 id="edit-profile-title">Edit Profile</h2>
                        <p>Update your personal information.</p>
                    </div>
                    <button className={Style.closeButton} type="button" onClick={onClose} aria-label="Close edit profile">
                        <X size={22} />
                    </button>
                </header>

                <form className={Style.form} onSubmit={handleSubmit}>
                    <label>
                        First name
                        <input name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </label>
                    <label>
                        Last name
                        <input name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </label>
                    <label>
                        Email
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </label>
                    <label>
                        Phone number
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                    </label>
                    <footer className={Style.footer}>
                        <button className={Style.cancelButton} type="button" onClick={onClose}>Cancel</button>
                        <button className={Style.saveButton} type="submit">Save changes</button>
                    </footer>
                </form>
            </section>
        </div>
    )
}

export default EditProfile;