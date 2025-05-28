//Desc

import Papa from "papaparse";

export interface SectionData{
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

export async function loadSyllabusSections(path: string): Promise<SectionData[]>{
    const res = await fetch(path);
    const text = await res.text();

    return new Promise((resolve, reject) => {
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsed = results.data.map((row: any) => ({
                    ...row,
                    completed: row.completed === "true",
                }));
                resolve(parsed);
            },
            error: reject,
        });
    });
}