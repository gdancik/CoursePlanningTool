// Utility function to load and parse the syllabus section data from a CSV file using PapaParse.
// This data is used to populate the overview cards on the Overview page.
//CSV file is stored in src/public/data/syllabus_sections.csv

import Papa from "papaparse";

// TypeScript interface describing the shape of each row in the CSV.
export interface SectionData{
    id: string; // Unique identifier for each section
    title: string; // Title of the section (e.g., "Basic Information")
    description: string; // Brief description or guidance for the section
    completed: boolean; // Whether the section is marked as completed
    link: string;
}

// Asynchronous function to fetch and parse CSV data.
// `path` is the relative or absolute URL to the CSV file.
export async function loadSyllabusSections(path: string): Promise<SectionData[]>{

    // Fetch the raw CSV text from the given path.
    const res = await fetch(path);
    const text = await res.text();


    // Return a Promise that resolves with an array of SectionData objects.
    return new Promise((resolve, reject) => {
        Papa.parse(text, {
            header: true, // Treat the first row as header
            skipEmptyLines: true, //Ignores blank likes in the CSV
            complete: (results) => {

                //Converts parsed data into the expected SectionData Format,
                const parsed = results.data.map((row: any) => ({
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    completed: row.completed === "true",
                    link: row.link || '',
                }));
                resolve(parsed); //Returns processed Data
            },
            error: reject, //Rejects the promise if parsing data fails
        });
    });
}