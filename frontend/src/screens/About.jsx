import React from "react";
import { FaLinkedin, FaEnvelope, FaGlobe } from "react-icons/fa";
import bgImage from '../assets/images/bookstack-bg.png'
import StandardHeader from '../components/Header/standardHeader';
import StandardFooter from '../components/Footer/Footer';

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
            className="hover:text-blue-900 inline_link"
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
    <div className="min-h-screen w-screen" style={{ backgroundImage: `url(${bgImage})` }}>
        <style>{` .inline_link { margin: 0px; color: #012460; } `}</style>

    <StandardHeader/>
    <h1 className="text-white text-5xl font-bold text-center pt-10">ABOUT</h1>
    <div className="p-20 pt-10 shadow-2xl">
      {/* TOP SECTION */}
        <TopSect/>
      <div className=" bg-[#e7eff9] min-h-screen py-10 px-10">
      
        {/* Main Title */}
        <h1 className="text-3xl font-bold text-[#012460] mb-8 tracking-wide">
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
            photo="/images/Broscious.jpg"
          />
          <PersonCard
            name="Dr. Garrett Dancik"
            role="Project Lead"
            website= "https://gdancik.github.io "
            linkedin= "https://www.linkedin.com/in/garrett-dancik/"
            photo="/images/Dancik.jpg"
          />
          <PersonCard
            name="Julia DeLapp"
            role="Project Coordinator"
            email= "delappj@easternct.edu"
            photo="/images/DeLapp.jpg"
            linkedin= "https://www.linkedin.com/in/julia-delapp-367a2b3b/"
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
          <PersonCard name="Cameron Senna" role="Front End Developer" />
          <PersonCard 
            name="Jessica Day" 
            role="Graphic Design" 
            linkedin= "https://www.linkedin.com/in/jessicallday"
            photo="/images/Jessica_Day.jpg"
          />
          <PersonCard 
            name="Sencere Rabel" 
            role="Backend Developer"
            linkedin= "https://www.linkedin.com/in/sencere-rabel-324220352"
            photo="/images/Sencere_Rabel.jpg"
          />
          <PersonCard name="Audrey Windrow" role="Front End Developer" />
        </CardGrid>

        {/* ===========================
            ADDITIONAL CONTRIBUTORS
        ============================ */}
        <SectionTitle title="ADDITIONAL CONTRIBUTORS" />
        <p className="text-gray-700 leading-relaxed mb-4">
          We would like to thank <b>Dr. Megan Heenehan</b> (ECSU) <b>Dr. Caitlin Carenen</b> (ECSU), and 
          <b> Dr. Kate McConnell</b> (AAC&U) for their contributions to the early 
          development of this tool. We also thank <b> John Carrera</b> for additional programming.</p>
        
      </div>
      {/* Bottom SECTION */}
      <BottomSect />
      <StandardFooter/> 
      </div>   
           
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

/* -------------------------------------------
  TopSect Component
------------------------------------------- */
function TopSect() {
  return (
    <div className="bg-white p-10">
      <h1 className="text-3xl font-bold text-[#012460] mb-8 tracking-wide">COURSE PLANNING TOOL</h1>
      <p className="text-base text-gray-700 leading-relaxed mb-4">
        This interactive course planning tool is built to support faculty in designing evidence-based courses and 
        syllabi through a series of easy-to-complete guided steps. <b>You can download a complete syllabus, edit and 
        duplicate your courses, 
        and streamline your planning process</b>—whether you're creating an ELAC course or any other type of course.
      </p>
      <p className="text-base text-gray-700 leading-relaxed">
       This project was made possible with the generous support of the <a class = "inline_link" href = "https://www.davisfoundations.org/">
       Davis Educational Foundation</a>, 
       established as a public charitable foundation in 1985. The Foundation supports undergraduate 
       programs at public and private, regionally accredited, baccalaureate degree-granting colleges and
        universities throughout the six New England states. It was co-founded by Elisabeth K. Davis and Stanton W. Davis 
        following Mr. Davis’s retirement as chairman of Shaw’s Supermarkets, Inc. The Foundation reflects their shared 
        commitment to higher education and has awarded more than $130 million in grants to over 175 institutions. 
       This course planning tool is part of a broader initiative to launch a new Teaching Scholars Program, 
       which includes the development of a sustainable faculty development program, cost-effective responses to 
       evolving student needs, and opportunities for scholarship dissemination. 
      </p>
    </div>
  );
}

/* -------------------------------------------
   BottomSect Component
------------------------------------------- */
function BottomSect() {
  return (
     <div className="bg-white p-10">
      <h1 className="text-3xl font-bold text-[#012460] mb-8 tracking-wide">THE CENTER FOR TEACHING, LEARNING, AND ASSESSMENT (CTLA) </h1>
      

      <p className="text-base text-gray-700 leading-relaxed mb-4">
       The <a className = 'inline_link' href = "https://www.easternct.edu/center-for-teaching-learning-and-assessment/index.html">
        Center for Teaching, Learning, and Assessment (CTLA)</a> supports 
        faculty in developing high quality, innovative, and inclusive 
        teaching and learning experiences to meet the diverse learning needs of 
        Eastern’s students. The Center promotes faculty dialogue, reflective 
        teaching, collaborative learning, and information-sharing across the 
        disciplines and provides resources that support the continuing improvement
        of teaching.
      </p>


      <div className="mt-4 text-sm text-gray-700">
        <p className="text-base text-gray-700 leading-relaxed mb-4">For questions about the CTLA or the Course Planning Tool, please contact:</p>
        <p className="text-base text-gray-700 leading-relaxed mb-4" >
          <b>Julia DeLapp</b>
          <br />
          Director
          <br />
            <a className = 'inline_link' href = "mailto:delappj@easternct.edu">delappj@easternct.edu</a>
          <br />
        </p>
      </div>   
    </div>
  );
}