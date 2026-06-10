import React, { useState, useEffect } from 'react';
import {ContentCardSet, CardData } from '../../components/SyllabusComponents/ContentCardSet';

/**
 * @function Assignments
 * @description Assignments component that uses ContentCardSet to manage multiple assignment entries.
 * Each assignment consists of a title, description, and percentage field for grading weight.
 * Used on the Assessment page to define course assignments with point values.
 * @param {Function} onChange - Callback function when assignments data changes
 * @param {Array} initialData - Initial assignments data array
 * @returns {JSX.Element} A assignments management component with percentage fields
 * @example
 * <Assignments 
 *   onChange={(assignments) => handleAssignmentsChange(assignments)}
 *   initialData={savedAssignments}
 * />
 */

interface AssignmentsProps {
    id: string;
    onChange?: (assignments: CardData[]) => void;
    data?: CardData[];
}

const Assignments: React.FC<AssignmentsProps> = ({ 
    id,    
    data = []
}) => {
   
    const [mydata, setData] = useState<CardData[]>(data);
          
    useEffect(() => {        
        if (data) {                        
            setData(data);
        }
    }, [data]);


    return (
    <>     
        <ContentCardSet
            id = {id}
            setTitle="Assignments"
            titleLabel="Assignment {index}"
            descriptionLabel=" "
            descriptionPlaceholder="Describe your Assignment in detail here."
            titlePlaceholder = "Enter assignment title (e.g., Midterm Exam)"
            rightLabel=" "
            onChange = {() => {}}   
            initialCards={mydata}
            minCards={2}
            maxCards={10}
            showRightValue={true}
            separateLabel = {true}
        />
        </>
    );
};
export default Assignments;