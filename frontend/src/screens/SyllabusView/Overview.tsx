// Overview page.
// This page pulls data from a CSV file to dynamically load OverviewCards,
// which are displayed in a summary format for each section of the syllabus.
// The card components are defined in components/OverviewCard.
// A linker map for navigation buttons is handled in AppNavigation (not shown here).

import {useEffect, useState} from 'react';
import OverviewCard from "./components/OverviewCard";
import {loadSyllabusSections, SectionData} from "../../utils/loadSyllabusSections";
import AppLayout from "../../ApplicationLayout/Applayout"
import './Overview.css'

// Functional component that displays the overview page.
const Overview = () => {
    // State to hold the array of section data loaded from the CSV file.
    const [sections, setSections] = useState<SectionData[]>([]);

    // useEffect runs once on component mount to fetch CSV data
    // using the custom loadSyllabusSections utility function.
    useEffect(() => {
        loadSyllabusSections("/data/syllabus_sections.csv").then(setSections);
    }, []);
    return(
        <div>
            <AppLayout/>
        <div className='overview-container'>

            {/* Introduction message to help users understand the tool */}
            <p className="overview-intro"> This tool will guide you through each section of the syllabus. Text entered in the
                <span className="green-text"> green</span> boxes will appear in the final syllabus exactly as written.
                Below, you'll find a summary of the contents and brainstorming tools for each section. You can save progress at anytime and navigate freely
                between sections.
            </p>

            {/* Render one OverviewCard per section from the CSV */}
            {sections.map(section =>(
                <OverviewCard key = {section.id} {...section}/>
            ))}
        </div>
        </div>

    );
};
export default Overview;