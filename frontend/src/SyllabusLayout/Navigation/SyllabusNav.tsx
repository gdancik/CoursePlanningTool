import React from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./SyllabusNav.css";

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
                     }: {
    onSave?: () => void | Promise<void>;
    changesDetected?: boolean;
}) => {
    const navigate = useNavigate();
    const { courseId } = useParams<{ courseId: string }>();

    const buildCoursePath = (path: string) => {
        if (!courseId) return path;
        return `/courses/${courseId}${path}`;
    };

    return (
        <nav className="syllabus-nav">
            {tabs.map((tab) => {
                const destination = buildCoursePath(tab.path);

                return (
                    <NavLink
                        key={tab.path}
                        to={destination}
                        onClick={async (e) => {
                            e.preventDefault();

                            if (changesDetected && onSave) {
                                await onSave();

                                await new Promise((resolve) =>
                                    setTimeout(resolve, 2500)
                                );
                            }

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