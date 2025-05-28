// Overview page. This plag pulls form a csv file to dynamically loads the cards in components/OverviewCards.
//A linker map is provided in AppNavigation for buttons where buttons are loaded into the page from components/buttons

import {useEffect, useState} from 'react';
import OverviewCard from "./components/OverviewCard";
import {loadSyllabusSections, SectionData} from "../../utils/loadSyllabusSections";
import './Overview.css'

const Overview = () => {
    const [sections, setSections] = useState<SectionData[]>([]);

    useEffect(() => {
        loadSyllabusSections("/data/syllabus_sections.csv").then(setSections);
    }, []);
    return(
        <div className='overview-container'>
            <p className="overview-intro"> This tool will guide you through each section of the syllabus. Text entered in the
                <span className="green-text"> green</span> boxes will appear in the final syllabus exactly as written.
                Below, you'll find a summary of the contents and brainstorming tools for each section. You can save progress at anytime and navigate freely
                between sections.
            </p>
            {sections.map(section =>(
                <OverviewCard key = {section.id} {...section}/>
            ))}
        </div>

    );
};
export default Overview;