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
    onChange?: (assignments: CardData[]) => void;
    initialData?: CardData[];
}

const Assignments: React.FC<AssignmentsProps> = ({ 
    onChange,
    initialData = []
}) => {
    const [assignments, setAssignments] = useState<CardData[]>(initialData);

    // Load saved assignments data from localStorage
    useEffect(() => {
        if (initialData.length === 0) {
            const saved = localStorage.getItem("currentCourseData");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.course_id && parsed.savedData) {
                        const savedFormData = parsed.savedData;
                        
                        // Extract assignments from saved data
                        const loadedAssignments: CardData[] = [];
                        let index = 1;
                        
                        while (savedFormData[`Assignment ${index} Title`] !== undefined ||
                               savedFormData[`Assignment ${index} Description`] !== undefined ||
                               savedFormData[`Assignment ${index} Points`] !== undefined) {
                            loadedAssignments.push({
                                id: index.toString(),
                                title: savedFormData[`Assignment ${index} Title`] || '',
                                description: savedFormData[`Assignment ${index} Description`] || '',
                                rightValue: savedFormData[`Assignment ${index} Points`] || ''
                            });
                            index++;
                        }
                        
                        if (loadedAssignments.length > 0) {
                            setAssignments(loadedAssignments);
                        }
                    }
                } catch (err) {
                    console.warn("Failed to parse saved course data:", err);
                }
            }
        }
    }, [initialData]);

    // Handle assignments changes
    const handleAssignmentsChange = (newAssignments: CardData[]) => {
        setAssignments(newAssignments);
        
        // Call parent onChange if provided
        if (onChange) {
            onChange(newAssignments);
        }
        
        // Save to localStorage in the expected format
        const saved = localStorage.getItem("currentCourseData");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.course_id && parsed.savedData) {
                    const updatedSavedData = { ...parsed.savedData };
                    
                    // Clear existing assignment data
                    Object.keys(updatedSavedData).forEach(key => {
                        if (key.startsWith('Assignment ')) {
                            delete updatedSavedData[key];
                        }
                    });
                    
                    // Add current assignments
                    newAssignments.forEach((assignment, index) => {
                        const num = index + 1;
                        updatedSavedData[`Assignment ${num} Title`] = assignment.title;
                        updatedSavedData[`Assignment ${num} Description`] = assignment.description;
                        updatedSavedData[`Assignment ${num} Points`] = assignment.rightValue || '';
                    });
                    
                    // Update localStorage
                    parsed.savedData = updatedSavedData;
                    localStorage.setItem("currentCourseData", JSON.stringify(parsed));
                }
            } catch (err) {
                console.warn("Failed to update saved course data:", err);
            }
        }
    };

    return (
        <div className="assignments-component">
            <ContentCardSet
                setTitle="Assignments"
                titleLabel="Assignment {index} Title:"
                descriptionLabel="Assignment {index} Description:"
                rightLabel="Points:"
                initialCards={assignments}
                onChange={handleAssignmentsChange}
                minCards={2}
                maxCards={10}
                showRightValue={true}
            />
        </div>
    );
};

export default Assignments;