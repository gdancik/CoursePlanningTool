import React from "react";

import ParagraphFromFile from "../ParagraphFromFile";
import { ParagraphFromFileComponent } from "../../../utils/types";

interface ParagraphFromFileWrapperProps {
    component: ParagraphFromFileComponent;
}

export const ParagraphFromFileWrapper: React.FC<ParagraphFromFileWrapperProps> = ({
                                                                                      component,
                                                                                  }) => {
    return (
        <ParagraphFromFile
            file={component.file || ""}
            className={component.className || undefined}
            html={component.type === "htmlFromFile"}
        />
    );
};