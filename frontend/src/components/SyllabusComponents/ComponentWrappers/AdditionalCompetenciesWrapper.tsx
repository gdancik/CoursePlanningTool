import React from "react";
import {AdditionalCompetencies} from "../../../screens/SyllabusView/Learning Outcomes/LearningOutcomesComponents";
import {AdditionalCompetenciesComponent, FormValue, FormState} from "../../../utils/types";


type AdditionalCompProps = {
    component: AdditionalCompetenciesComponent;
    formData: FormState;
    onChange: (id: string, value: FormValue) => void;
}

export default function AdditionalCompetenciesWrapper(_props: AdditionalCompProps) {
    return <AdditionalCompetencies/>;
}