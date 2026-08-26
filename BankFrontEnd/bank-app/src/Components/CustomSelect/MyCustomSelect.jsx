import Style from './MyCustomSelect.module.css';
import { ChevronsDown , ChevronsUp } from 'lucide-react';
import { useState } from 'react';

const MyCustomSelect = ({label, options, 
    setData, mode}) => {

    const [dropDown, setDropDown] = useState(false);
    const [selectedOp, setSelectedOp] = useState(null);
    const [selectMulti, setSelectMulti] = useState([]);

    

    const selectOption = (key, value) => {
        
        if(mode == "single" && selectedOp == value)
        {
            setSelectedOp(null);
            setData(prev => ({...prev, [label] : null}));
            return;
        }

        if(mode == "multiple")
        {
            if(value == "All types")
            {
                setSelectMulti([]);
                setData(prev => ({...prev, [label] : []}));
                return;
            }

            const nextSelected = selectMulti.includes(key)
                ? selectMulti.filter(selectedKey => selectedKey != key)
                : [...selectMulti, key];

            setSelectMulti(nextSelected);
            setData(prev => ({...prev, [label] : nextSelected}));
            return;
        }
        else
        {
            setSelectedOp(value);   
        }

        if( value == "All accounts" || 
            value == "All status" ||
            value == "All days"        
        )
        {
            setData(prev => ({...prev, [label] : null}));
            return ;
        }
        
        if(label == "Transaction Type")
            setData(prev => ({...prev, [label] : [...(prev[label] || []), key]}));
        else
            setData(prev => ({...prev, [label] : key}));
    }


    const selectElements = Object.entries(options).map(([key, value]) => {
        return(
            <div key={key} className={`${Style.option} ${mode == "multiple" && selectMulti.find((e) => e == key) ? Style.optionActive : selectedOp == value && mode == "single" ? Style.optionActive : "" }`} onClick={() => {
                selectOption(key , value)
            }}>
                <p>{value}</p>
            </div>
        )
    })

    return (
        <section className={Style.Select}>
            <div className={Style.SelectContainer} onClick={() => setDropDown((curr) => !curr)}>
                <button className={Style.btn}>{label}</button>
                {
                    dropDown ?  <ChevronsUp  size={20} color='white'/> :  <ChevronsDown  size={20} color='white'/>
                }         
            </div>
            <div className={`${Style.optionsContainer} ${dropDown ? Style.Drop : ""}`}>
                {selectElements}
            </div>
        </section>
    )
}

export default MyCustomSelect;