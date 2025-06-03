import Papa from 'papaparse';

export interface BasicInfoData{
    section: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
    options?: string[];
}

export async function loadBasicInfoFields(path: string): Promise<BasicInfoData[]> {

    const res = await fetch(path);
    const text = await res.text();

    return new Promise ((resolve, reject) => {

        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsed: BasicInfoData[] = results.data.map((row: any) =>({
                    section: row.section,
                    label: row.label,
                    type: row.type,
                    placeholder: row.placeholder,
                    required: row.required === "true",
                    options: row.type === "select" ? row.placeholder.split(",") : undefined
                }));
                resolve(parsed);

                },
            error: reject,
        });
    });
}