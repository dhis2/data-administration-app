import i18n from '@dhis2/d2-i18n'
import SelectField from 'd2-ui/lib/select-field/SelectField'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './AddLockExceptionForm.module.css'
import OrganisationUnitSelectionCard from './OrganisationUnitSelectionCard'
import PeriodPicker from './PeriodPicker'

const d2UiSelectStyleOverride = {
    minWidth: 360,
    marginRight: 20,
}

const AddLockExceptionForm = ({
    dataSets,
    groups,
    levels,
    selectedDataSetId,
    onSelectedDataSetIdChange,
    updateSelectedOrgUnits,
    updateSelectedPeriodId,
}) => {
    const [selectedOrgUnits, setSelectedOrgUnits] = useState([])

    const selectedDataSet = dataSets.find(ds => ds.id === selectedDataSetId)

    const handleDataSetChange = async dataSet => {
        if (selectedDataSetId !== null && dataSet.id === selectedDataSetId) {
            return
        }

        onSelectedDataSetIdChange(dataSet.id)
        setSelectedOrgUnits([])
    }
    const handlePeriodChange = periodId => {
        updateSelectedPeriodId(periodId)
    }
    const handleOrgUnitsSelectionUpdate = newSelection => {
        setSelectedOrgUnits(newSelection)
        updateSelectedOrgUnits(newSelection)
    }

    const dataSetItems = dataSets.map(dataSet => ({
        id: dataSet.id,
        name: dataSet.displayName,
        periodType: dataSet.periodType,
    }))

    let dataSetSelectLabel = i18n.t('Select a data set')
    let dataSetSelectValue = null
    if (selectedDataSet) {
        dataSetSelectLabel = i18n.t('Data set')
        dataSetSelectValue = selectedDataSet.id
    }

    return (
        <>
            <div className={styles.selectsContainer}>
                <div data-test="add-lock-exception-select-data-set">
                    <SelectField
                        style={d2UiSelectStyleOverride}
                        label={dataSetSelectLabel}
                        items={dataSetItems}
                        onChange={handleDataSetChange}
                        value={dataSetSelectValue}
                    />
                </div>
                {selectedDataSet && (
                    <div>
                        <PeriodPicker
                            periodType={selectedDataSet.periodType}
                            onPickPeriod={handlePeriodChange}
                        />
                    </div>
                )}
            </div>
            {selectedDataSet && (
                <OrganisationUnitSelectionCard
                    dataSetId={selectedDataSet.id}
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
    updateSelectedOrgUnits: PropTypes.func.isRequired,
    updateSelectedPeriodId: PropTypes.func.isRequired,
    onSelectedDataSetIdChange: PropTypes.func.isRequired,
    selectedDataSetId: PropTypes.string,
}

export default AddLockExceptionForm
