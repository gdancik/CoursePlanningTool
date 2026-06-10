// src/hooks/useLoadCourseData.ts
import { useEffect } from "react";
import { loadCourseData } from "../utils/loadCourseData";
import {FormState} from "../utils/types";

export function useLoadCourseData(
    setFormData: React.Dispatch<React.SetStateAction<FormState>>,
    setCourseId?: React.Dispatch<React.SetStateAction<string | null>>
) {
    useEffect(() => {
        const fetchData = async () => {
            const { courseId, formData } = await loadCourseData();
            if (setCourseId) setCourseId(courseId);
            setFormData(formData);
        };

        fetchData();
    }, [setFormData, setCourseId]);
}