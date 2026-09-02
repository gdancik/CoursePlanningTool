import {CardData} from "../components/SyllabusComponents/ContentCardSet";


/*
@params
 */
function isCardDataArray(value: unknown): value is CardData[] {
    return (
        Array.isArray(value) &&
        value.every(item =>
            typeof item === "object" &&
            item !== null &&
            typeof (item as CardData).title === "string"
        )
    );
}

function isStringPairArray(value: unknown): value is [string, string][] {
    return (
        Array.isArray(value) &&
        value.every(
            item =>
                Array.isArray(item) &&
                item.length === 2 &&
                typeof item[0] === "string" &&
                typeof item[1] === "string"
        )
    );
}

