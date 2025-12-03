import React, { useEffect, useState } from 'react';
import ContentCard from './ContentCard';
import './ContentCardSet.css';

/**
 * @function ContentCardSet
 * @description A container component that manages a collection of ContentCards with add and delete functionality.
 * Used as the base for Learning Outcomes, Assignments, and Grading Policies components.
 * Provides standardized management of multiple content cards with consistent styling and behavior.
 * @param {string} setTitle - The main title for the entire card set
 * @param {string} titleLabel - The label template for card titles (e.g., "Learning Outcome {index} Title:")
 * @param {string} descriptionLabel - The label template for card descriptions (e.g., "Learning Outcome {index} Description:")
 * @param {string} [rightLabel] - Optional label for right-side values (e.g., "Points:")
 * @param {Array} initialCards - Array of initial card data objects
 * @param {Function} onChange - Callback function when cards data changes
 * @param {number} [minCards=2] - Minimum number of cards required
 * @param {number} [maxCards=10] - Maximum number of cards allowed
 * @param {boolean} [showRightValue=false] - Whether to show the right-side value field
 * @returns {JSX.Element} A set of content cards with add/delete functionality
 * @example
 * <ContentCardSet
 *   setTitle="Learning Outcomes"
 *   titleLabel="Learning Outcome {index} Title:"
 *   descriptionLabel="Learning Outcome {index} Description:"
 *   initialCards={learningOutcomes}
 *   onChange={(cards) => setLearningOutcomes(cards)}
 *   minCards={2}
 *   maxCards={8}
 * />
 */

interface CardData {

    title: string;
    description: string;
    rightValue?: string;
}

interface ContentCardSetProps {
    setTitle: string;
    titleLabel: string;
    descriptionLabel: string;
    rightLabel?: string;
    initialCards: CardData[];
    onChange: (cards: CardData[]) => void;
    minCards?: number;
    maxCards?: number;
    showRightValue?: boolean;
}

const ContentCardSet: React.FC<ContentCardSetProps> = ({
    setTitle,
    titleLabel,
    descriptionLabel,
    rightLabel,
    initialCards,
    onChange,
    minCards = 2,
    maxCards = 10,
    showRightValue = false
}) => {

    const [cards, setCards] = useState<CardData[]> (
        initialCards.length > 0 ? initialCards : 
        [
            {title: '', description: '', rightValue: ''},
            {title: '', description: '', rightValue: ''}
        ]
    );

    useEffect(() => {
        if (initialCards && initialCards.length > 0) {
            setCards(initialCards);
        }
    },[initialCards]);

    const updateCards = (updated: CardData[]) => {
        setCards(updated);
        onChange(updated);
    };

    const handleCardChange = (index: number, field: keyof CardData, value: string) => {
        const updated = [...cards];
        updated[index] = {...updated[index], [field]: value};
        updateCards(updated);
    }

    const addCard = () => {
        if(cards.length >= maxCards) return;

        const newCard: CardData = {
            title: '',
            description: '',
            rightValue: ''
        };
        updateCards ([...cards, newCard]);
    };

    const deleteCard = (index: number) => {
        if (cards.length <= minCards) return;
        
        const updated = cards.filter((_, i) => i !== index);
        updateCards(updated);
    };

    const formatLabel = (labelTemplate: string, index: number) => {
        return labelTemplate.replace('{index}', (index + 1).toString());
    };

    return (
        <div className="content-card-set">
            <div className="content-card-set-header">
                <h2 className="content-card-set-title">{setTitle}</h2>
            </div>

            <div className="content-cards-container">
                {cards.map((card, index) => (
                    <div key={index} className="content-card-wrapper">
                        <ContentCard
                            titleLabel={formatLabel(titleLabel, index)}
                            titleValue={card.title}
                            descriptionLabel={formatLabel(descriptionLabel, index)}
                            descriptionValue={card.description}
                            rightLabel={showRightValue ? rightLabel : undefined}
                            rightValue={showRightValue ? card.rightValue : undefined}
                            onTitleChange={(value) => handleCardChange(index, 'title', value)}
                            onDescriptionChange={(value) => handleCardChange(index, 'description', value)}
                            onRightValueChange={showRightValue ? 
                                (value) => handleCardChange(index, 'rightValue', value) : 
                                undefined
                            }
                            className={`content-card-${index + 1}`}
                        />
                        
                        {cards.length > minCards && (
                            <button
                                className="delete-card-button"
                                onClick={() => deleteCard(index)}
                                title={`Delete ${setTitle.toLowerCase().slice(0, -1)} ${index + 1}`}
                            >
                                × Delete
                            </button>
                        )}
                    </div>
                ))}
                
                {/* Add button at the bottom */}
                <div className="add-card-container">
                    <button
                        className="add-card-button add-card-button-bottom"
                        onClick={addCard}
                        disabled={cards.length >= maxCards}
                        title={cards.length >= maxCards ? `Maximum ${maxCards} cards allowed` : `Add new ${setTitle.toLowerCase()}`}
                    >
                        + Add An {setTitle.slice(0, -1)}
                    </button>
                </div>
            </div>

            <div className="content-card-set-footer">
                <div className="card-count-info">
                    {cards.length} of {maxCards} {setTitle.toLowerCase()} 
                    {minCards > 1 && ` (minimum ${minCards} required)`}
                </div>
            </div>
        </div>
    );
};

export default ContentCardSet;
export type { CardData };