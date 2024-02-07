import { CheckDetails } from './CheckDetails.js'
import css from './CheckDetails.module.css'
import i18n from '@dhis2/d2-i18n'

export const CheckDetailsView = ({ selectedCheck }) => {
    return selectedCheck ? (
        <CheckDetails check={selectedCheck} />
    ) : (
        <ChooseCheck />
    )
}

const ChooseCheck = () => (
    <div className={css.chooseCheckMessage}>
        {i18n.t(
            'Choose a check to run from the list, or run all checks from the toolbar above'
        )}
    </div>
)
