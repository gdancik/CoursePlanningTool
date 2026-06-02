import React from "react";
import { BloomsTaxonomy } from "../../../screens/SyllabusView/Learning Outcomes/BloomsTaxonomy";
import {
    BloomsTaxonomyComponent,
    FormState,
    FormValue,
} from "../../../utils/types";

type Props = {
    component: BloomsTaxonomyComponent;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
};

export default function BloomsTaxonomyWrapper(_props: Props) {
    return <BloomsTaxonomy />;
}