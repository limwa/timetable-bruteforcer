type TeachersConfig = {
    // Uma correspondência entre cadeiras e siglas de professores
    [key: string]: string[]
}

export const start = "20221008";
export const end = "20221015";

export const teachers: TeachersConfig = {
    "LBAW": [
        "tbs",
    ],
    "IPC": [
        "RPR"
    ],
    "RC": [
        "FBT",
    ],
    "FSI": [
        "BLFP",
        "MBB",
    ],
    "PFL": [
        "JPSFF",
        "GMLTL",
    ],
};