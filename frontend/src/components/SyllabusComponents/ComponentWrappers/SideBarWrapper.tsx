import React from "react";

import SidebarLayout from "../../SidebarLayout";
import {FormState, FormValue, JsonComponent, SidebarLayoutComponent} from "../../../utils/types";

interface SidebarLayoutProps {
    component: SidebarLayoutComponent;
    renderChild:  ( child: JsonComponent, index: number) => React.ReactNode;
}

export const SidebarLayoutWrapper: React.FC<SidebarLayoutProps> = ({
    component,
    renderChild
}) => {
    const children = component.content?.map((child, i) =>(
        <div key = {i}> {renderChild(child, i)}</div>
    ));
    const sidebarContent =
        component.sidebarContent !== undefined
            ? component.sidebarContent.map((child, i) => (
                <div key={i}>{renderChild(child, i)}</div>
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
    )
};