//Import Papa Parse for CSV parsing
import Papa from 'papaparse';

//Define the type for a field in the Syllabus Contents.
export interface SyllabusContent {
    section: string;
    row: number;
    content: string;
    type: string;
    required: boolean;
}

/**
 * Loads syllabus content from CSV file at the provided path.
 * @param path - The path to the CSV file.
 * @returns A promise resolving to an array of Syllabus Content objects.
 */

export async function loadSyllabusContent(path: string): Promise<SyllabusContent[]> {
    //Fetch the CSV file
    const res = await fetch(path);
    const text = await res.text();

    return new Promise ((resolve, reject) => {
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results: {data: any[] }) => {

                const parsed: SyllabusContent[] = results.data.map((row:any)=> ({
                    section: row.section,
                    row: row.row ? parseInt(row.row, 10) : 0,
                    content: row.content,
                    type: row.type,
                    required: row.required === "true",
                }));
                resolve(parsed);
            },
            error: reject,
        })
    })
}