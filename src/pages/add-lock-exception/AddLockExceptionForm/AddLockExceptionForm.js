import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './AddLockExceptionForm.module.css'
import OrganisationUnitSelection from './OrganisationUnitSelection/OrganisationUnitSelection.js'
import PeriodPicker from './PeriodPicker.js'

const AddLockExceptionForm = ({
    dataSets,
    groups,
    levels,
    selectedDataSetId,
    selectedOrgUnits,
    onSelectedDataSetIdChange,
    onSelectedOrgUnitsChange,
    onSelectedPeriodIdChange,
}) => {
    const handleDataSetChange = ({ selected: dataSetId }) => {
        if (selectedDataSetId !== null && dataSetId === selectedDataSetId) {
            return
        }
        onSelectedDataSetIdChange(dataSetId)
        onSelectedOrgUnitsChange([])
    }
    const selectedDataSet = dataSets.find((ds) => ds.id === selectedDataSetId)

    return (
        <>
            <div className={styles.selectsContainer}>
                <SingleSelectField
                    className={styles.dataSetSelect}
                    label={i18n.t('Data set')}
                    placeholder={i18n.t('Select a data set')}
                    selected={selectedDataSetId}
                    filterable
                    onChange={handleDataSetChange}
                    dataTest="add-lock-exception-select-data-set"
                >
                    {dataSets.map((ds) => (
                        <SingleSelectOption
                            key={ds.id}
                            label={ds.displayName}
                            value={ds.id}
                        />
                    ))}
                </SingleSelectField>
                {selectedDataSetId && (
                    <PeriodPicker
                        periodType={selectedDataSet.periodType}
                        onPickPeriod={onSelectedPeriodIdChange}
                    />
                )}
            </div>
            {selectedDataSetId && (
                <OrganisationUnitSelection
                    dataSetId={selectedDataSetId}
                    levels={levels}
                    groups={groups}
                    selected={selectedOrgUnits}
                    onSelectedChange={onSelectedOrgUnitsChange}
                />
            )}
        </>
    )
}

AddLockExceptionForm.propTypes = {
    dataSets: PropTypes.array.isRequired,
    groups: PropTypes.array.isRequired,
    levels: PropTypes.array.isRequired,
    selectedOrgUnits: PropTypes.array.isRequired,
    onSelectedDataSetIdChange: PropTypes.func.isRequired,
    onSelectedOrgUnitsChange: PropTypes.func.isRequired,
    onSelectedPeriodIdChange: PropTypes.func.isRequired,
    selectedDataSetId: PropTypes.string,
}

export default AddLockExceptionForm
