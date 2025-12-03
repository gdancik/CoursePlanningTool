import React from "react";
import { FaLinkedin, FaEnvelope, FaGlobe } from "react-icons/fa";

export function PersonCard({ name, role, photo, linkedin, email, website }) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 w-64">
      {/* Image Area */}
      <div className="w-full h-52 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover rounded-md object-top"
          />
        ) : (
          <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM9pZ3UFdOVhRuxuYz2SDRST2Za_vwVNdM5A&s"
          className="w-full h-full object-cover rounded-md"
          />
        )}
      </div>

      {/* Name */}
      <h2 className="mt-4 text-lg font-semibold text-gray-900">{name}</h2>

      {/* Role */}
      <p className="text-sm text-gray-600">{role}</p>

      {/* Icons */}
      <div className="flex items-center gap-4 mt-4 text-blue-700 text-lg">
        {linkedin && (
          <a
            href={linkedin}
            //Opens in new tab
            target="_blank"
            //Makes it seprate for security purposes
            rel="noopener noreferrer"
            className="hover:text-blue-900"
          >
            <FaLinkedin />
          </a>
        )}

        {email && (
          <a
            href={`mailto:${email}`}
            className="hover:text-blue-900"
          >
            <FaEnvelope />
          </a>
        )}

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-900"
          >
            <FaGlobe />
          </a>
        )}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div className="bg-[#e7eff9] min-h-screen py-10 px-20">
      
      {/* Main Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-wide">
        PROJECT TEAM
      </h1>

      {/* ===========================
          FACULTY MEMBERS
      ============================ */}
      <SectionTitle title="FACULTY MEMBERS" />
      <CardGrid>
        <PersonCard
          name="Dr. Courtney Broscious"
          role="Project Director"
        />
        <PersonCard
          name="Dr. Garrett Dancik"
          role="Project Lead"
          website= "https://gdancik.github.io "
          photo="/images/Dancik.jpg"
        />
        <PersonCard
          name="Julia DeLapp"
          role="Project Coordinator"
          email= "delappj@easternct.edu"
        />
        <PersonCard
          name="Lora Lee"
          role="Project Lead"
          website= "https://loraleestudio.com/ "
          photo="/images/Lora Lee.jpg"
        />
      </CardGrid>

      {/* ===========================
          STUDENTS
      ============================ */}
      <SectionTitle title="STUDENTS" />
      <CardGrid>
        <PersonCard name="John Carrera" role="Additional Programming" />
        <PersonCard 
          name="Jessica Day" 
          role="Graphic Design" 
          linkedin= "https://www.linkedin.com/in/jessicallday"
          photo="/images/Jessica_Day.jpg"
        />
        <PersonCard 
          name="Sencere Rabel" 
          role="Backend Developer"
          email="Rabels@my.easternct.edu"
          linkedin= "https://www.linkedin.com/in/sencere-rabel-324220352"
          photo="/images/Sencere_Rabel.jpg"
        />
        <PersonCard name="Christopher Windrow" role="Front End Developer" />
      </CardGrid>

      {/* ===========================
          ADDITIONAL CONTRIBUTORS
      ============================ */}
      <SectionTitle title="ADDITIONAL CONTRIBUTORS" />
      <CardGrid>
        <PersonCard name="Dr. Megan Heenehan" role="Early Development" />
        <PersonCard name="Dr. Caitlin Carenen" role="Early Development" />
      </CardGrid>
    </div>
  );
}

/* -----------------------
   Section Title Component
------------------------ */
function SectionTitle({ title }) {
  return (
    <h2 className="text-lg font-bold text-gray-800 mt-10 mb-4 tracking-wide">
      {title}
    </h2>
  );
}

/* -----------------------
   Grid Wrapper Component  
------------------------ */
function CardGrid({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 mb-8">
      {children}
    </div>
  );
}
