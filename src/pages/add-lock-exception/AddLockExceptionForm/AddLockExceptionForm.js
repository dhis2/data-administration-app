import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './AddLockExceptionForm.module.css'
import OrganisationUnitSelectionCard from './OrganisationUnitSelectionCard'
import PeriodPicker from './PeriodPicker'

const AddLockExceptionForm = ({
    dataSets,
    groups,
    levels,
    selectedDataSetId,
    onSelectedDataSetIdChange,
    onSelectedOrgUnitsChange,
    onSelectedPeriodIdChange,
}) => {
    const [selectedOrgUnits, setSelectedOrgUnits] = useState([])

    const handleDataSetChange = async ({ selected: dataSetId }) => {
        if (selectedDataSetId !== null && dataSetId === selectedDataSetId) {
            return
        }

        onSelectedDataSetIdChange(dataSetId)
        setSelectedOrgUnits([])
    }
    const handleOrgUnitsSelectionUpdate = newSelection => {
        setSelectedOrgUnits(newSelection)
        onSelectedOrgUnitsChange(newSelection)
    }

    const selectedDataSet = dataSets.find(ds => ds.id === selectedDataSetId)

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
                    {dataSets.map(ds => (
                        <SingleSelectOption
                            key={ds.id}
                            label={ds.displayName}
                            value={ds.id}
                        />
                    ))}
                </SingleSelectField>
                {selectedDataSetId && (
                    <div>
                        <PeriodPicker
                            periodType={selectedDataSet.periodType}
                            onPickPeriod={onSelectedPeriodIdChange}
                        />
                    </div>
                )}
            </div>
            {selectedDataSetId && (
                <OrganisationUnitSelectionCard
                    dataSetId={selectedDataSetId}
                    levels={levels}
                    groups={groups}
                    selected={selectedOrgUnits}
                    onSelectionUpdate={handleOrgUnitsSelectionUpdate}
                />
            )}
        </>
    )
}

AddLockExceptionForm.propTypes = {
    dataSets: PropTypes.array.isRequired,
    groups: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    levels: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    onSelectedDataSetIdChange: PropTypes.func.isRequired,
    onSelectedOrgUnitsChange: PropTypes.func.isRequired,
    onSelectedPeriodIdChange: PropTypes.func.isRequired,
    selectedDataSetId: PropTypes.string,
}

export default AddLockExceptionForm
