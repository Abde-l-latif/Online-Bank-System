import Style from './MyCustomSelect.module.css';
import { ChevronsDown  } from 'lucide-react';

const MyCustomSelect = ({label, options}) => {

    console.log(options);
    
    const selectElements = Object.entries(options).map(([key, value]) => {
        return(
            <div key={key} className={Style.option}>
                <p>{value}</p>
            </div>
        )
    })

    return (
        <section className={Style.Select}>
            <div className={Style.SelectContainer}>
                <button className={Style.btn}>{label}</button>
                <ChevronsDown  size={20} color='white'/>
            </div>
            <div className={Style.optionsContainer}>
                {selectElements}
            </div>
        </section>
    )
}

export default MyCustomSelect;