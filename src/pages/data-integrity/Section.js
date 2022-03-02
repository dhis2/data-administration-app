import i18n from '@dhis2/d2-i18n'
import {
    Checkbox,
    DataTable,
    DataTableHead,
    DataTableBody,
    DataTableRow,
    DataTableColumnHeader,
    DataTableCell,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './Section.module.css'
import Severity from './Severity'
import SeverityPropType from './SeverityPropType'

const Section = ({ name, checks, selectedChecks, setSelectedChecks }) => {
    const allSelected = checks.every(check => selectedChecks.has(check.name))
    const handleToggle = ({ value: checkName }) => {
        const newSelectedChecks = new Set(selectedChecks)
        if (selectedChecks.has(checkName)) {
            newSelectedChecks.delete(checkName)
        } else {
            newSelectedChecks.add(checkName)
        }
        setSelectedChecks(newSelectedChecks)
    }
    const handleToggleAll = () => {
        const newSelectedChecks = new Set(selectedChecks)
        if (allSelected) {
            for (const check of checks) {
                newSelectedChecks.delete(check.name)
            }
        } else {
            for (const check of checks) {
                newSelectedChecks.add(check.name)
            }
        }
        setSelectedChecks(newSelectedChecks)
    }

    return (
        <section key={name} className={styles.section}>
            <h2 className={styles.sectionName}>{name}</h2>
            <DataTable>
                <DataTableHead>
                    <DataTableRow>
                        <DataTableColumnHeader width="48px">
                            <Checkbox
                                onChange={handleToggleAll}
                                checked={allSelected}
                            />
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Check')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Description')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Severity')}
                        </DataTableColumnHeader>
                    </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                    {checks.map(({ name, description, severity }) => (
                        <DataTableRow key={name}>
                            <DataTableCell width="48px">
                                <Checkbox
                                    onChange={handleToggle}
                                    value={name}
                                />
                            </DataTableCell>
                            <DataTableCell>
                                {/* TODO: use name as i18n key */}
                                {name}
                            </DataTableCell>
                            <DataTableCell>{description}</DataTableCell>
                            <DataTableCell>
                                <Severity severity={severity} />
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
        </section>
    )
}

Section.propTypes = {
    checks: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            severity: SeverityPropType.isRequired,
            description: PropTypes.string,
        }).isRequired
    ).isRequired,
    name: PropTypes.string.isRequired,
    selectedChecks: PropTypes.instanceOf(Set).isRequired,
    setSelectedChecks: PropTypes.func.isRequired,
}

export default Section
