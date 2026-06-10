import React from "react";
import {
    LearningOutcomesCards,
} from "../../../screens/SyllabusView/Learning Outcomes/LearningOutcomesComponents";
import {
    FormState,
    FormValue,
    LearningOutcomesComponent,
} from "../../../utils/types";
import { parseCardDataArray } from "../../../utils/typeGuards";

type Props = {
    component: LearningOutcomesComponent;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
};

export default function LearningOutcomesCardsWrapper({
                                                         component,
                                                         formData,
                                                     }: Props) {
    const currentCards = parseCardDataArray(formData[component.id]);

    return (
        <LearningOutcomesCards
            id={component.id}
            data={currentCards}
        />
    );
}