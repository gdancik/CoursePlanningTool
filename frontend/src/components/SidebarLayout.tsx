import { type } from "@testing-library/user-event/dist/type";
import React from "react";

/**
 * - Left: Sidebar title + content
 * - Right: Renders any component passed as children
 * 
 */

export interface SidebarLayoutProps {
  sidebarTitle?: string | React.ReactNode;
  sidebarContent?: string | React.ReactNode; 

  className?: string;
  sidebarClassName?: string;
  contentClassName?: string;

  sidebarWidth?: string;

  children?: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  sidebarTitle = "",
  sidebarContent = "",
  className = "",
  sidebarClassName = "",
  contentClassName = "",
  sidebarWidth = "300px",
  children
}) => {


  return(
    <div className={`flex bg-white rounded-md overflow-hidden my-4 ${className}`}>
      {/* Sidebar Left */}
      <div
      className={`relative flex flex-row border-r amber-400 ${sidebarClassName}`}
      style={{ width: sidebarWidth, minWidth: sidebarWidth }} 
      >

      <div className = "flex flex-col flex-1 p-6">
        {sidebarTitle && (
          <h3 className = "text-xl font-semibold mb-4 text-blue-700 leading-snug">
            {sidebarTitle}
            </h3>
        )}

        <div className = "text-[0.96rem] text-gray-700 leading-6">
          {typeof sidebarContent === "string" ? (
            <p className="m-0">{sidebarContent}</p>
          ) : (
            sidebarContent
          )}
        </div>
      </div>
      <div className={`w-0.5 h-full flex-shrink-0 relative bg-amber-400`}>
        <div className={`absolute top-0 -left-1 w-2.5 h-3 rounded-sm bg-amber-400`} />
      </div>
      </div>
      <div className = {`flex-1 p-6 ${contentClassName}`}>
        {children}
        </div>
      </div>
  )}
export default SidebarLayout;