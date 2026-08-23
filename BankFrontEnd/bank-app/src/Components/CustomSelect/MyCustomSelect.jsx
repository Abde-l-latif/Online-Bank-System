import Style from './MyCustomSelect.module.css';
import { ChevronsDown  } from 'lucide-react';

const MyCustomSelect = ({label}) => {
    return (
        <div className={Style.SelectContainer}>
            <button className={Style.btn}>{label}</button>
            <ChevronsDown  size={20} color='white'/>
        </div>
    )
}

export default MyCustomSelect;