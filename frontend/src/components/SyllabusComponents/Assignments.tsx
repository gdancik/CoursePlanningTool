import React, { useState, useEffect } from 'react';
import ContentCardSet, { CardData } from '../../components/SyllabusComponents/ContentCardSet';

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
    initialData?: CardData[];
}

const Assignments: React.FC<AssignmentsProps> = ({ 
    id,
    onChange,
    initialData = []
}) => {
    const [assignments, setAssignments] = useState<CardData[]>(initialData);
    const hasMounted = React.useRef(false);

    // keep local state synced with parent
    useEffect(() => {
        setAssignments(initialData);
    }, [initialData]);

    // SAFE onChange trigger – prevents sending empty data on first render
    useEffect(() => {
        if (hasMounted.current) {
            onChange?.(assignments);
        } else {
            hasMounted.current = true;
        }
    }, [assignments]);

    const handleAssignmentsChange = (newAssignments: CardData[]) => {
        setAssignments(newAssignments);
    };

    return (
    <>
        <input 
        type="hidden" id={id} 
        value={JSON.stringify(assignments)} 
        readOnly
        />
        
        <ContentCardSet
            setTitle="Assignments"
            titleLabel="Assignment {index} Title: "
            descriptionLabel="Assignment {index} Description: "
            rightLabel="Assignment {index} Percentage of Grade: "
            onChange={handleAssignmentsChange}
            initialCards={assignments}
            minCards={2}
            maxCards={10}
            showRightValue={true}
        />
        </>
    );
};
export default Assignments;