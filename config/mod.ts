type TeachersConfig = {
    // Uma correspondência entre cadeiras e siglas de professores
    [key: string]: string[]
}

export const start = "20230911";
export const end = "20231216";

export const teachers: TeachersConfig = {
    "LBAW": [
        "tbs",
    ],
    "IPC": [
        "RPR",
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