type TeachersConfig = {
    // Uma correspondência entre cadeiras e siglas de professores
    [key: string]: string[]
}

export const start = "20230911";
export const end = "20231216";

export const teachers: TeachersConfig = {
    "AC": [
        "CMMOPS",
    ],
    "DS": [
        "FFC",
        "AMA",
        "JPD",
    ],
    "PRI": [
        "SSN",
        "JPMD",
        "SFCF"
    ],
    "SDLE": [
        "CMFB-M",
    ],
    "SGI": [
        "TCCM",
        "AVC",
    ],
};