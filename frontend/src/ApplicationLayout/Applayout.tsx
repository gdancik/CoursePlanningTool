import HeaderBanner from './components/HeaderBanner'
import SyllabusNav from "../navigation/SyllabusNav";

const Applayout = () => {
    return (
        <div>
            <HeaderBanner/>
            <SyllabusNav/>
            <main style={{padding: '2rem'}}>
            </main>
        </div>
    );
};
export default Applayout