import { useEffect, useRef } from "react";
import { handleNext, handleBack } from "../components/Button/ButtonLogic";
import type { NavigateFunction } from "react-router-dom";
import { useParams } from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import saveData from "../services/processData";
import { useModalFactory } from "../utils/useModalFactory";
import { saveCourseAndExit} from "../utils/handlers/Course/saveCourseAndExit";
import { FormState } from "../utils/PageRenderEngine/types";
import { useCourseActions } from "./course/useCourseActions";
import {useCourseQuery} from "./queries/useCourseQuery";
import {queryKeys} from "../query/queryKeys";
import {queryClient} from "../query/queryClient";

interface SyllabusWrapperLogicResult {
    modal: ReturnType<typeof useModalFactory>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    handleBackClick: () => void;
    handleNextClick: () => void;
    handleSave: () => void;
    handleSaveAndNavigate: (navigate_to: string) => void;
    handlePreviewClick: () => void;
}

const getCourseDisplayName = (
    courseData: FormState | undefined,
    fallbackCourseId: string
): string => {
    const subject =
        typeof courseData?.["subj_code_syllabus"] === "string"
            ? courseData["subj_code_syllabus"]
            : "???";

    const number =
        typeof courseData?.["crse_number_syllabus"] === "string"
            ? courseData["crse_number_syllabus"]
            : "???";

    if (subject === "???" && number === "???") {
        return fallbackCourseId;
    }

    return `${subject}_${number}`;
};

export function useSyllabusWrapperLogic(
    formData: FormState,
    setFormData: React.Dispatch<React.SetStateAction<FormState>>,
    navigate: NavigateFunction,
    pathname: string
): SyllabusWrapperLogicResult {
    const { user } = useAuth();
    const userEmail = user?.userEmail;

    const modal = useModalFactory();
    const containerRef = useRef<HTMLDivElement>(null);

    const { courseId: course_id } = useParams<{ courseId: string }>();

    const {
        data: queriedCourseData,
        isLoading,
        error,
    } = useCourseQuery(course_id);

    const { previewCourse } = useCourseActions({
        modal,
    });

    useEffect(() => {
        if (isLoading) {
            modal.showRedirect(
                "Loading Data",
                "Fetching course information...",
                "loading"
            );
        }
    }, [isLoading]);

    useEffect(() => {
        if (!course_id || !queriedCourseData) return;

        setFormData({
            ...queriedCourseData,
            course_id: course_id,
        });

        modal.hide();
    }, [course_id, queriedCourseData, setFormData]);

    useEffect(() => {
        if (!error) return;

        console.error("Error loading course data:", error);
        modal.showError("Unable to load course data.");
    }, [error]);

    const handleSave = async () => {
        if (!course_id) {
            modal.showError("No course ID found. Please reopen the course.");
            return;
        }

        if (!containerRef.current) {
            modal.showError("Unable to find form data.");
            return;
        }

        try {
            modal.showRedirect("Saving", "Saving your changes...", "loading");

            await saveData(
                containerRef as React.RefObject<HTMLDivElement>,
                course_id
            );
            /**
             * NOTE: THIS IS A BANDAID FIX FOR PRODUCTION. THE PROCESS DATA NEEDS TO BE REFACTORED TO COMPLETE THIS - Audrey Windrow
             */
            await queryClient.invalidateQueries({
                queryKey: queryKeys.course(course_id)
            });

            modal.showRedirect("Saved", "Your changes have been saved!", "success");
            setTimeout(() => modal.hide(), 2500);
        } catch (err: any) {
            console.error("Error in saveData:", err);
            modal.showError(err.message || "An unexpected error occurred.");
        }
    };

    const handleBackClick = async (save = true) => {
        if (save) {
            await handleSave();
        }

        modal.showRedirect(
            "Loading Previous Section",
            "Preparing previous section...",
            "loading"
        );

        setTimeout(() => {
            handleBack(navigate, pathname, course_id);
            modal.hide();
        }, 800);
    };

    const handleNextClick = async (save = true) => {
        if (save) {
            await handleSave();
        }

        modal.showRedirect(
            "Loading Next Section",
            "Preparing next section...",
            "loading"
        );

        setTimeout(() => {
            handleNext(navigate, pathname, course_id);
            modal.hide();
        }, 700);
    };

    const handlePreviewClick = () => {
        if (!course_id) {
            modal.showError("No course ID found. Please reopen the course.");
            return;
        }

        const courseName = getCourseDisplayName(
            queriedCourseData ?? formData,
            course_id
        );

        void previewCourse(course_id, courseName);
    };

    return {
        modal,
        containerRef,
        handleBackClick,
        handleNextClick,
        handleSave,
        handleSaveAndNavigate: (navigate_to: string) =>
            saveCourseAndExit({
                formData,
                containerRef: containerRef as React.RefObject<HTMLDivElement>,
                modal,
                navigate,
                navigate_to,
                course_id,
                userEmail,
            }),
        handlePreviewClick,
    };
}