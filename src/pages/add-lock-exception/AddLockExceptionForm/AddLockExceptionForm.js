import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
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
    const [orgUnitPaths, setOrgUnitPaths] = useState(null)
    const [rootWithMembers, setRootWithMembers] = useState(null)
    const [currentRoot, setCurrentRoot] = useState(null)
    const [error, setError] = useState(null)
    const { d2 } = useD2()

    const handleDataSetChange = async dataSet => {
        const dataSetId = dataSet.id
        if (selectedDataSet !== null && dataSetId === selectedDataSet.id) {
            return
        }

        updateSelectedDataSetId(dataSetId)
        setRootWithMembers(null)
        setSelected([])
        setSelectedDataSet(dataSet)

        try {
            const [rootWithDataSetMembers, dataSetMembers] = await Promise.all([
                d2.models.organisationUnits.list({
                    paging: false,
                    level: 1,
                    fields:
                        'id,displayName,path,children::isNotEmpty,memberCount',
                    memberCollection: 'dataSets',
                    memberObject: dataSetId,
                }),
                d2.models.dataSets.get(dataSetId, {
                    paging: false,
                    fields: 'organisationUnits[id,path]',
                }),
            ])

            setRootWithMembers(rootWithDataSetMembers.toArray()[0])
            setSelected([])
            setOrgUnitPaths(
                dataSetMembers.organisationUnits.toArray().map(ou => ou.path)
            )
        } catch (error) {
            setError(i18n.t('Error loading data for data set'))
        }
    }
    const handlePeriodChange = periodId => {
        updateSelectedPeriodId(periodId)
    }
    const handleSelectionUpdate = newSelection => {
        setSelected(newSelection)
        updateSelectedOrgUnits(newSelection)
    }
    const handleOrgUnitClick = (event, orgUnit) => {
        let newSelected = null
        if (selected.includes(orgUnit.path)) {
            newSelected = selected.filter(oup => oup !== orgUnit.path)
        } else {
            newSelected = [...selected, orgUnit.path]
        }
        setSelected(newSelected)
        updateSelectedOrgUnits(newSelected)
    }
    const handleChangeRoot = currentRoot => {
        setCurrentRoot(currentRoot)
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
                            d2={d2}
                            periodType={selectedDataSet.periodType}
                            onPickPeriod={handlePeriodChange}
                        />
                    </div>
                )}
            </div>
            {selectedDataSet &&
                (error ? (
                    <NoticeBox error>{error}</NoticeBox>
                ) : (
                    <OrganisationUnitSelectionCard
                        d2={d2}
                        levels={levels}
                        groups={groups}
                        rootWithMembers={rootWithMembers}
                        selected={selected}
                        currentRoot={currentRoot}
                        dataSetId={selectedDataSet.id}
                        onOrgUnitClick={handleOrgUnitClick}
                        onChangeRoot={handleChangeRoot}
                        orgUnitPaths={orgUnitPaths}
                        onSelectionUpdate={handleSelectionUpdate}
                    />
                ))}
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
