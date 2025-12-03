
import React, { useState, useEffect } from 'react';
import ContentCardSet, { CardData } from '../../components/SyllabusComponents/ContentCardSet';

/**
 * @function GradingPolicies
 * @description Grading Policies component that uses ContentCardSet to manage multiple grading policy entries.
 * Each grading policy consists of a title and description field for defining course grading criteria.
 * Used on the Assessment page to define course grading policies and procedures.
 * @param {Function} onChange - Callback function when grading policies data changes
 * @param {Array} initialData - Initial grading policies data array
 * @returns {JSX.Element} A grading policies management component
 * @example
 * <GradingPolicies 
 *   onChange={(policies) => handleGradingPoliciesChange(policies)}
 *   initialData={savedPolicies}
 * />
 */


interface GradingPoliciesProps {
    onChange?: (policies: CardData[]) => void;
    initialData?: CardData[];
}

const GradingPolicies: React.FC<GradingPoliciesProps> = ({ 
    onChange,
    initialData = []
}) => {
    const [gradingPolicies, setGradingPolicies] = useState<CardData[]>(initialData);

    // Load saved grading policies data from localStorage
    useEffect(() => {
        if (initialData.length === 0) {
            const saved = localStorage.getItem("currentCourseData");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.course_id && parsed.savedData) {
                        const savedFormData = parsed.savedData;
                        
                        // Extract grading policies from saved data
                        const loadedPolicies: CardData[] = [];
                        let index = 1;
                        
                        while (savedFormData[`Grading Policy ${index} Title`] !== undefined ||
                               savedFormData[`Grading Policy ${index} Description`] !== undefined) {
                            loadedPolicies.push({
                                title: savedFormData[`Grading Policy ${index} Title`] || '',
                                description: savedFormData[`Grading Policy ${index} Description`] || ''
                            });
                            index++;
                        }
                        
                        if (loadedPolicies.length > 0) {
                            setGradingPolicies(loadedPolicies);
                        }
                    }
                } catch (err) {
                    console.warn("Failed to parse saved course data:", err);
                }
            }
        }
    }, [initialData]);

    // Handle grading policies changes
    const handleGradingPoliciesChange = (newPolicies: CardData[]) => {
        setGradingPolicies(newPolicies);
        
        // Call parent onChange if provided
        if (onChange) {
            onChange(newPolicies);
        }
        
        // Save to localStorage in the expected format
        const saved = localStorage.getItem("currentCourseData");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.course_id && parsed.savedData) {
                    const updatedSavedData = { ...parsed.savedData };
                    
                    // Clear existing grading policy data
                    Object.keys(updatedSavedData).forEach(key => {
                        if (key.startsWith('Grading Policy ')) {
                            delete updatedSavedData[key];
                        }
                    });
                    
                    // Add current grading policies
                    newPolicies.forEach((policy, index) => {
                        const num = index + 1;
                        updatedSavedData[`Grading Policy ${num} Title`] = policy.title;
                        updatedSavedData[`Grading Policy ${num} Description`] = policy.description;
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
        <div className="grading-policies-component">
            <ContentCardSet
                setTitle="Grading Policies"
                titleLabel="Grading Policy {index} Title:"
                descriptionLabel="Grading Policy {index} Description:"
                initialCards={gradingPolicies}
                onChange={handleGradingPoliciesChange}
                minCards={2}
                maxCards={8}
                showRightValue={false}
            />
        </div>
    );
};

export default GradingPolicies;