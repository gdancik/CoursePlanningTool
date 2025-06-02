import HeaderBanner from './components/HeaderBanner'
import SyllabusNav from "../navigation/SyllabusNav";

const Applayout = () => {
    return (
        <div>
            <HeaderBanner/>
            <SyllabusNav/>
            <main style={{padding: '0.1rem'}}>
            </main>
        </div>
    );
};
export default Applayout