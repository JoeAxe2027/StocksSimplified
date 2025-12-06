import {useParams} from 'react-router-dom';

function StockPage() {
    const { ticker } = useParams();

    return (
        <div style={{ padding: '2rem'}}>
            <h1>Stock Page for {ticker}</h1>
            <p> Stock details will go here. </p>
        </div>
    );
}
export default StockPage;