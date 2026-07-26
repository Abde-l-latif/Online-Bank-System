import Style from "./Top.module.css"

export default function Top()
{
    return (
        <>
            <section className={Style.Top}>
                <select name="Account-type" defaultValue={"Particuliers"}>
                    <option disabled>Sélectionnez une option</option>
                    <option value="Particuliers"> Particuliers </option>
                </select>

                <select name="Language" defaultValue={"French"}>
                    <option value="French">FR</option>
                    <option value="English">EN</option>
                </select>
            </section>
        </>
    )
}