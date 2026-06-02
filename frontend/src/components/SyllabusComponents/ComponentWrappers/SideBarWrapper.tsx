import React from "react";

import SidebarLayout from "../../SidebarLayout";
import { JsonRenderComponent } from "../../../utils/jsonRenderer";
import {
    FormState,
    FormValue,
    SidebarLayoutComponent,
} from "../../../utils/types";

interface SidebarLayoutWrapperProps {
    component: SidebarLayoutComponent;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
}

export const SidebarLayoutWrapper: React.FC<SidebarLayoutWrapperProps> = ({
                                                                              component,
                                                                              formData,
                                                                              onChange,
                                                                          }) => {
    const children = component.content?.map((child, i) => (
        <div key={`content-${child.type}-${i}`}>
            <JsonRenderComponent
                component={child}
                formData={formData}
                onChange={onChange}
            />
        </div>
    ));

    const sidebarContent =
        component.sidebarContent !== undefined
            ? component.sidebarContent.map((child, i) => (
                <div key={`sidebar-${child.type}-${i}`}>
                    <JsonRenderComponent
                        component={child}
                        formData={formData}
                        onChange={onChange}
                    />
                </div>
            ))
            : component.text || component.informationText || undefined;

    return (
        <SidebarLayout
            sidebarTitle={component.title || ""}
            sidebarContent={sidebarContent}
            className={component.className || ""}
            sidebarClassName={component.sidebarClassName || ""}
            contentClassName={component.contentClassName || ""}
            sidebarWidth={component.sidebarWidth || "300px"}
        >
            {children}
        </SidebarLayout>
    );
};