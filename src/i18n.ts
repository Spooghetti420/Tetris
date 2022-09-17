export enum LanguageName {
    English,
    German,
    Japanese,
    Bulgarian
}

export class Language {
    languageName: LanguageName
    file: string

    constructor(langName: LanguageName) {
        this.languageName = langName;
        console.log(`assets/lang/${language_codes[langName]}.json`)
        this.file = `assets/lang/${language_codes[langName]}.json`;
    }
}

let languages = {};

export function loadLanguages() {
    console.log("calling function")
    languages = {
        [LanguageName.English]: loadJSON("./assets/lang/en.json"),
        [LanguageName.German]: loadJSON("./assets/lang/de.json"),
        [LanguageName.Japanese]: loadJSON("./assets/lang/ja.json"),
        [LanguageName.Bulgarian]: loadJSON("./assets/lang/bg.json")
    }
    console.log("languages is now", languages);
}

const language_codes = {
    [LanguageName.English]: "en",
    [LanguageName.German]: "de",
    [LanguageName.Japanese]: "ja",
    [LanguageName.Bulgarian]: "bg"
};

export class LocalisableString {
    stringName: string

    constructor(stringName: string) {
        this.stringName = stringName;
    }

    getLocalisedString(language: Language) {
        // Return either the localised string; the English string if no localisation exists; or the bare internal of the string in emergencies.
        return languages[language.languageName][this.stringName] ?? languages[LanguageName.English][this.stringName] ?? this.stringName;
    }
}