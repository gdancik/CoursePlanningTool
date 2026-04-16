2//This program generates row identifiers based on label data from the Basic Info Parser

export function generateRowIdentifiers (label: string): string {
    return label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}