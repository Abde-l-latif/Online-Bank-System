import Style from './Overview.module.css';



const Overview = () => {
    return (
        <section className={Style.overview}>
            <h2>Overview</h2>
            <p>here's a quick look at your finances.</p>
            

            <div className={Style.chartCardsContainer}>


            </div>

        </section>      
    )
}

export default Overview;