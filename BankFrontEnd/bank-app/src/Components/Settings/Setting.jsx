import Style from "./Setting.module.css";
import { Cog, PenLine, UserRound, Mail , PhoneCall , LockKeyhole, KeyRound, LogOut } from 'lucide-react';
import Money from "../../Assets/money-100.png";


const Setting = () => {
    return (
        <section className={Style.Setting}>
            <div className={Style.Head}>
                <div className={Style.SettingIcon}>
                    <Cog className={Style.iconColor}  size={35}/>
                </div>
                <div>
                    <h2> Setting </h2>
                    <p> Manage your account settings. </p>
                </div>
            </div>

            <div className={Style.Profile}>
                <div className={Style.SubHeader}>
                    <div style={{display : "flex", alignItems : "center", gap : "20px"}}>
                        <div className={Style.SubHeaderIcon}>
                            <UserRound  className={Style.iconColor}  size={25}/>
                        </div>
                        <div className={Style.SubHeadInfo}>
                            <h3> Profile </h3>
                            <p> Your personnel information and contact details. </p>
                        </div>
                    </div>
                    <div className={Style.ProfileBTN}>
                        <PenLine />
                        <p>Edit Profile</p>
                    </div>
                </div>

                <div className={Style.ProfileInfo}>
                    <div className={Style.ProfileHeader}>
                        <div className={Style.UserAvatar}>
                            <img src={Money} alt="UserAvatar" />
                        </div>
                        <div className={Style.ProfileHeaderInfo}>
                            <h3>Abdo Inouvs</h3>
                            <p>Customer</p>
                        </div>
                    </div>
                    <div className={Style.ProfileFooter}>
                        <div className={Style.ProfileTable}>
                            <div className={Style.profileRowHead}> 
                                <UserRound size={20} />
                                <p>First name</p>
                            </div>
                            <p>Abdo</p>
                        </div>

                        <div className={Style.ProfileTable}>
                            <div className={Style.profileRowHead}> 
                                <UserRound size={20} />
                                <p>Last name</p>
                            </div>
                            <p>Inouvs</p>
                        </div>

                        <div className={Style.ProfileTable}>
                            <div className={Style.profileRowHead}> 
                                <Mail size={20} />
                                <p>Email</p>
                            </div>
                            <p>Abdo@gmail.com</p>
                        </div>

                        <div className={Style.ProfileTable}>
                            <div className={Style.profileRowHead}> 
                                <PhoneCall size={20} />
                                <p>Phone number</p>
                            </div>
                            <p>+212 6 61 52 34 55</p>
                        </div>

                    </div>
                </div>
            </div>

            <div className={Style.Security}>
                <div className={Style.SubHeader}>
                    <div style={{display : "flex", alignItems : "center", gap : "20px"}}>
                        <div className={Style.SubHeaderIcon}>
                            <LockKeyhole  className={Style.iconColor}  size={25}/>
                        </div>
                        <div className={Style.SubHeadInfo}>
                            <h3> Security </h3>
                            <p> Keep your account safe and secure. </p>
                        </div>
                    </div>
                </div>
                <div className={Style.SecurityContent}>
                    <div style={{display : "flex", alignItems : "center", gap : "20px"}}>
                        <div className={Style.PasswordIcon}>
                            <KeyRound  className={Style.iconColor}  size={20}/>
                        </div>
                        <div className={Style.passwordInfo}>
                            <h3> Password </h3>
                            <p> Change your password regularly to keep your account safe </p>
                        </div>
                    </div>
                    <div className={Style.PasswordBTN}>
                        <KeyRound />
                        <p>Change password</p>
                    </div>
                </div>

            </div>

            <div className={Style.Signout}>
                 <div className={Style.SignoutInfo}>
                    <div style={{display : "flex", alignItems : "center", gap : "20px"}}>
                        <div className={Style.singoutIconContainer}>
                            <LogOut  color="red"  size={25}/>
                        </div>
                        <div className={Style.SignOutInfo}>
                            <h3> Sign Out </h3>
                            <p> You will be logged out from your account. </p>
                        </div>
                    </div>
                    <div className={Style.SignoutBTN}>
                        <LogOut />
                        <p>Sign out</p>
                    </div>
                </div>
            </div>
           
        </section>
    )
}

export default Setting;