const { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const path = require('path');
const converter = require('i18next-conv');
const poFolder = './i18n';
const finalI18nFolfer = './public/i18n';
const options = {
    skipUntranslated: true,
    keyseparator: '°#°#°#°#°'
};

if (!existsSync(finalI18nFolfer)){
    mkdirSync(finalI18nFolfer);
}


if (existsSync(poFolder)){
    const files = readdirSync(poFolder);
    const numberOfFiles = files.length;
    storeTranslationsForIndex(0);

    function storeTranslationsForIndex(index) {
        if ( index >= 0 && index < numberOfFiles) {
            const file = files[index];
            const fileSplittend = file.split('.');
            if (fileSplittend.length === 2 && fileSplittend[1] === 'po') {
                const fileContent = readFileSync(poFolder + '/' + file, 'utf-8');
                const locale = fileSplittend[0];
                converter.gettextToI18next(locale, fileContent, options).then(function (data) {
                    writeFileSync(finalI18nFolfer + '/' + locale + '.json', data);
                    storeTranslationsForIndex(index + 1);
                });
            } else {
                storeTranslationsForIndex(index + 1);
            }
        }
    };
}
