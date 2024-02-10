import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { CheckDetails } from './CheckDetails.js'
import css from './CheckDetails.module.css'

export const CheckDetailsView = ({ selectedCheck }) => {
    return selectedCheck ? (
        <CheckDetails check={selectedCheck} />
    ) : (
        <ChooseCheck />
    )
}

CheckDetailsView.propTypes = {
    selectedCheck: CheckDetails.propTypes.check,
}

const ChooseCheck = () => (
    <div className={css.chooseCheckMessage}>
        {i18n.t(
            'Choose a check to run from the list, or run all checks from the toolbar above'
        )}
    </div>
)
