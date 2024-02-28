const MAINTENANCE_RELATIVE_PATH = '/dhis-web-maintenance'
const DASHBOARDS_RELATIVE_PATH = '/dhis-web-dashboard'
const USERS_RELATIVE_PATH = '/dhis-web-user'
const VISUALIZATIONS_RELATIVE_PATH = '/dhis-web-data-visualizer'

const maintenanceSections = {
    category: 'categorySection',
    dataElement: 'dataElementSection',
    dataSet: 'dataSetSection',
    indicator: 'indicatorSection',
    organisationUnit: 'organisationUnitSection',
    program: 'programSection',
    validation: 'validationSection',
    other: 'otherSection',
}

const issuesTypeToSectionMap = {
    trackedEntityAttribute: maintenanceSections['program'],
    trackedEntityType: maintenanceSections['program'],
    relationshipType: maintenanceSections['program'],
    programIndicator: maintenanceSections['indicator'],
    programIndicatorGroup: maintenanceSections['indicator'],
}

const matchIssueTypeToSection = (issuesIdType) => {
    const sections = Object.keys(maintenanceSections)

    return sections.find((section) => section.startsWith(issuesIdType))
}

const getMaintenanceSectionPath = (singularissuesIdType) => {
    const manuallyMaped = issuesTypeToSectionMap[singularissuesIdType]

    if (manuallyMaped) {
        return manuallyMaped
    }
    // most sections starts with the same as the singular issuesIdType
    const matchesSection = matchIssueTypeToSection(singularissuesIdType)
    if (matchesSection) {
        return maintenanceSections[matchesSection]
    }

    return 'otherSection'
}

const userAppTypes = new Set(['userGroups', 'userRoles', 'users'])
const dashboardsAppTypes = new Set(['dashboards'])
const visualizationsAppTypes = new Set(['visualizations'])
const notSupportedIssueType = new Set(['periods'])

const getUserAppLink = (baseUrl, { issuesIdType, id }) => {
    const basePath = `${baseUrl}${USERS_RELATIVE_PATH}/#/`
    const editPath = `edit/${id}`
    const sectionPathMap = {
        userGroups: 'user-groups',
        userRoles: 'user-roles',
        users: 'users',
    }

    const sectionpath = sectionPathMap[issuesIdType]
    if (!sectionPathMap) {
        return basePath
    }
    return `${basePath}${sectionpath}/${editPath}`
}

/* NOTE: This is best-effort, and all cases may not be accounted for */
export const getIssueLink = (baseUrl, { issuesIdType, id }) => {
    if (dashboardsAppTypes.has(issuesIdType)) {
        return `${baseUrl}${DASHBOARDS_RELATIVE_PATH}/#/${id}`
    }

    if (userAppTypes.has(issuesIdType)) {
        return getUserAppLink(baseUrl, { issuesIdType, id })
    }

    if (visualizationsAppTypes.has(issuesIdType)) {
        return `${baseUrl}${VISUALIZATIONS_RELATIVE_PATH}/#/${id}`
    }

    if (notSupportedIssueType.has(issuesIdType)) {
        return null
    }
    // if not handled above, assume it's a section in maintenance
    const singularObjectType = issuesIdType.replace(/(.*)s$/, '$1')
    const sectionPath = getMaintenanceSectionPath(singularObjectType)

    return `${baseUrl}${MAINTENANCE_RELATIVE_PATH}/#/edit/${sectionPath}/${singularObjectType}/${id}`
}
