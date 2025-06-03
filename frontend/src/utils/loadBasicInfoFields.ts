import Papa from 'papaparse';

export interface BasicInfoData{
    section: string;
    row: number;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
    options?: string[];
}

export async function loadBasicInfoFields(path: string): Promise<BasicInfoData[]> {

    const res = await fetch(path);
    const text = await res.text();

    return new Promise((resolve, reject) => {
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsed: BasicInfoData[] = results.data.map((row: any) => ({
                    section: row.section,
                    row: row.row ? parseInt(row.row, 10) : 0,
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