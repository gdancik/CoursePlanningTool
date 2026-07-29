import React from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";import "./SyllabusNav.css";
import {useModalFactory} from "../../utils/useModalFactory";

type Direction = "next" | "previous";

interface SyllabusNavProps {
    onSave?: () => void | Promise<void>;
    changesDetected?: boolean;
    modal: ReturnType<typeof useModalFactory>;
}
const tabs = [
    { label: "Overview", path: "/overview" },
    { label: "Basic Information", path: "/basic-info" },
    { label: "Description", path: "/course-description" },
    { label: "Learning Outcomes", path: "/learning-outcomes" },
    { label: "HIPs", path: "/hips" },
    { label: "Learning Resources", path: "/learning-resources" },
    { label: "Assessment", path: "/assessment" },
    { label: "Course Schedule", path: "/course-schedule" },
    { label: "Checklist", path: "/checklist" },
];


const SyllabusNav = ({
                         onSave,
                         changesDetected = false,
                         modal,
                     }: SyllabusNavProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { courseId } = useParams<{ courseId: string }>();

    const buildCoursePath = (path: string) => {
        if (!courseId) return path;
        return `/courses/${courseId}${path}`;
    };

    const currentIndex = tabs.findIndex((tab) =>
        location.pathname.endsWith(tab.path)
    );
    return (
        <nav className="syllabus-nav">
            {tabs.map((tab, index) => {

                const destination = buildCoursePath(tab.path);

                return (
                    <NavLink
                        key={tab.path}
                        to={destination}
                        onClick={async (e) => {
                            e.preventDefault();

                            if (index === currentIndex) {
                                return;
                            }

                            const direction: Direction =
                                index > currentIndex ? "next" : "previous";

                            if (changesDetected && onSave) {
                                await onSave();
                            }

                            modal.showRedirect(
                                direction === "next"
                                    ? "Loading Next Section"
                                    : "Loading Previous Section",
                                "Preaparing Section"
                            );

                            await new Promise((resolve) =>
                                setTimeout(resolve, direction === "next" ? 700 : 800)
                            );

                            navigate(destination);
                        }}
                        className={({ isActive }) =>
                            isActive ? "nav-tab active" : "nav-tab"
                        }
                    >
                        {tab.label}
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default SyllabusNav;