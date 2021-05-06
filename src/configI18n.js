import i18n from '@dhis2/d2-i18n'
import { i18nKeys } from './i18n-keys'

export const injectTranslationsToD2 = d2 => {
    const translations = {}
    Object.keys(i18nKeys.d2UiComponents).forEach(key => {
        translations[key] = i18n.t(i18nKeys.d2UiComponents[key])
    })
    Object.assign(d2.i18n.translations, translations)
}
