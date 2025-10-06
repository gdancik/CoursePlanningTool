// src/hooks/useLoadCourseData.ts
import { useEffect } from "react";
import { loadCourseData } from "../utils/loadCourseData";

export function useLoadCourseData(
    setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>,
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