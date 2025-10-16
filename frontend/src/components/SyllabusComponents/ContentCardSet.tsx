import React, { useState } from 'react';
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
    id: string;
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
    const [cards, setCards] = useState<CardData[]>(
        initialCards.length > 0 ? initialCards : [
            { id: '1', title: '', description: '', rightValue: '' },
            { id: '2', title: '', description: '', rightValue: '' }
        ]
    );

    const updateCards = (newCards: CardData[]) => {
        setCards(newCards);
        onChange(newCards);
    };

    const handleCardChange = (id: string, field: keyof CardData, value: string) => {
        const updatedCards = cards.map(card =>
            card.id === id ? { ...card, [field]: value } : card
        );
        updateCards(updatedCards);
    };

    const addCard = () => {
        if (cards.length >= maxCards) return;
        
        const newId = Math.max(...cards.map(c => parseInt(c.id) || 0), 0) + 1;
        const newCard: CardData = {
            id: newId.toString(),
            title: '',
            description: '',
            rightValue: ''
        };
        updateCards([...cards, newCard]);
    };

    const deleteCard = (id: string) => {
        if (cards.length <= minCards) return;
        
        const updatedCards = cards.filter(card => card.id !== id);
        updateCards(updatedCards);
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
                    <div key={card.id} className="content-card-wrapper">
                        <ContentCard
                            titleLabel={formatLabel(titleLabel, index)}
                            titleValue={card.title}
                            descriptionLabel={formatLabel(descriptionLabel, index)}
                            descriptionValue={card.description}
                            rightLabel={showRightValue ? rightLabel : undefined}
                            rightValue={showRightValue ? card.rightValue : undefined}
                            onTitleChange={(value) => handleCardChange(card.id, 'title', value)}
                            onDescriptionChange={(value) => handleCardChange(card.id, 'description', value)}
                            onRightValueChange={showRightValue ? 
                                (value) => handleCardChange(card.id, 'rightValue', value) : 
                                undefined
                            }
                            className={`content-card-${index + 1}`}
                        />
                        
                        {cards.length > minCards && (
                            <button
                                className="delete-card-button"
                                onClick={() => deleteCard(card.id)}
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