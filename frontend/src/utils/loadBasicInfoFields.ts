// Import Papa Parse for CSV parsing
import Papa from 'papaparse';

// Define the type for a field in the basic info form
export interface BasicInfoData {
    section: string;            // Section name the field belongs to
    row: number;                // Row number for layout grouping
    layoutRow: number;          // Sub-row within the row
    label: string;              // Field label
    type: string;               // Input type (e.g., text, select, textarea)
    placeholder: string;        // Placeholder or helper text
    required: boolean;          // Whether the field is required
    options?: string[];         // Options for select or checkbox-group fields (if any)
}

/**
 * Loads basic info fields from a CSV file at the provided path.
 * @param path - The path to the CSV file.
 * @returns A Promise resolving to an array of BasicInfoData objects.
 */
export async function loadBasicInfoFields(path: string): Promise<BasicInfoData[]> {
    // Fetch the CSV file
    const res = await fetch(path);
    const text = await res.text(); // Read as plain text

    // Parse the CSV file using PapaParse
    return new Promise((resolve, reject) => {
        Papa.parse(text, {
            header: true,           // Parse as objects with headers
            skipEmptyLines: true,   // Ignore empty lines
            complete: (results: { data: any[] }) => {
                // Map parsed rows to BasicInfoData type
                const parsed: BasicInfoData[] = results.data.map((row: any) => ({
                    section: row.section,
                    row: row.row ? parseInt(row.row, 10) : 0,              // Parse row number as integer
                    layoutRow: row.layoutRow ? parseInt(row.layoutRow, 10) : 0, // Parse layoutRow as integer
                    label: row.label,
                    type: row.type,
                    placeholder: row.placeholder,
                    required: row.required === "true",                     // Convert required to boolean
                    options: row.options
                        ? row.options.split(/[,|]/).map((opt: string) => opt.trim()).filter((opt: string) => opt !== '') // Parse options from CSV if provided
                        : (row.type === "select"
                            ? row.placeholder.split(',').map((opt: string) => opt.trim()) // Use placeholder as fallback for select options
                            : undefined) // Otherwise, undefined
                }));
                resolve(parsed); // Resolve the parsed data
            },
            error: reject, // Reject on parse error
        });
    });
}
