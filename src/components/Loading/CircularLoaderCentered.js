import { CircularLoader } from '@dhis2/ui'
import React from 'react'
import css from './CircularLoaderCentered.module.css'

export const CircularLoaderCentered = () => {
    return <CircularLoader className={css.centered} />
}
