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
    updateSelectedDataSetId,
    updateSelectedOrgUnits,
    updateSelectedPeriodId,
}) => {
    const [selected, setSelected] = useState([])
    const [selectedDataSet, setSelectedDataSet] = useState(null)

    const handleDataSetChange = async dataSet => {
        const dataSetId = dataSet.id
        if (selectedDataSet !== null && dataSetId === selectedDataSet.id) {
            return
        }

        updateSelectedDataSetId(dataSetId)
        setSelected([])
        setSelectedDataSet(dataSet)
    }
    const handlePeriodChange = periodId => {
        updateSelectedPeriodId(periodId)
    }
    const handleSelectionUpdate = newSelection => {
        setSelected(newSelection)
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
                    selected={selected}
                    onSelectionUpdate={handleSelectionUpdate}
                />
            )}
        </>
    )
}

AddLockExceptionForm.propTypes = {
    dataSets: PropTypes.array.isRequired,
    groups: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    levels: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    updateSelectedDataSetId: PropTypes.func.isRequired,
    updateSelectedOrgUnits: PropTypes.func.isRequired,
    updateSelectedPeriodId: PropTypes.func.isRequired,
}

export default AddLockExceptionForm
