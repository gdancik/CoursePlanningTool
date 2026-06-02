import React from "react";
import {
    FiveCoreCompetencies,
} from "../../../screens/SyllabusView/Learning Outcomes/LearningOutcomesComponents";
import {
    FiveCoreCompetenciesComponent,
    FormState,
    FormValue,
} from "../../../utils/types";

type Props = {
    component: FiveCoreCompetenciesComponent;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
};

export default function FiveCoreCompetenciesWrapper({ component }: Props) {
    return <FiveCoreCompetencies five={component.competencies ?? []} />;
}