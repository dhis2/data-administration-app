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
    onSelectedOrgUnitsChange,
    onSelectedPeriodIdChange,
}) => {
    const [selectedOrgUnits, setSelectedOrgUnits] = useState([])

    const handleDataSetChange = async dataSet => {
        if (selectedDataSetId !== null && dataSet.id === selectedDataSetId) {
            return
        }

        onSelectedDataSetIdChange(dataSet.id)
        setSelectedOrgUnits([])
    }
    const handleOrgUnitsSelectionUpdate = newSelection => {
        setSelectedOrgUnits(newSelection)
        onSelectedOrgUnitsChange(newSelection)
    }

    const selectedDataSet = dataSets.find(ds => ds.id === selectedDataSetId)
    const dataSetItems = dataSets.map(dataSet => ({
        id: dataSet.id,
        name: dataSet.displayName,
    }))

    return (
        <>
            <div className={styles.selectsContainer}>
                <div data-test="add-lock-exception-select-data-set">
                    <SelectField
                        style={d2UiSelectStyleOverride}
                        label={
                            selectedDataSetId
                                ? i18n.t('Data set')
                                : i18n.t('Select a data set')
                        }
                        items={dataSetItems}
                        onChange={handleDataSetChange}
                        value={selectedDataSetId}
                    />
                </div>
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
