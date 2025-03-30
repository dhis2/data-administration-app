const MAINTENANCE_RELATIVE_PATH = '/dhis-web-maintenance'
const DASHBOARDS_RELATIVE_PATH = '/dhis-web-dashboard'
const USERS_RELATIVE_PATH = '/dhis-web-user'
const VISUALIZATIONS_RELATIVE_PATH = '/dhis-web-data-visualizer'
const MAPS_RELATIVE_PATH = '/dhis-web-maps'

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
    trackedEntityAttributes: maintenanceSections['program'],
    trackedEntityTypes: maintenanceSections['program'],
    relationshipTypes: maintenanceSections['program'],
    programIndicators: maintenanceSections['indicator'],
    programIndicatorGroups: maintenanceSections['indicator'],
    categoryCombos: maintenanceSections['category'],
    categories: maintenanceSections['category'],
}

const getMaintenanceSectionPath = (issuesIdType) => {
    const manuallyMaped = issuesTypeToSectionMap[issuesIdType]

    if (manuallyMaped) {
        return manuallyMaped
    }
    // most sections starts with the same as the singular issuesIdType
    const matchesSection = Object.keys(maintenanceSections).find((section) =>
        issuesIdType.startsWith(section)
    )
    if (matchesSection) {
        return maintenanceSections[matchesSection]
    }
    return 'otherSection'
}

const getMaintenanceAppLink = (baseUrl, { issuesIdType, id }) => {
    let singularObjectType = issuesIdType.replace(/(.*)s$/, '$1')
    if (issuesIdType === 'categories') {
        singularObjectType = 'category'
    }
    const sectionPath = getMaintenanceSectionPath(issuesIdType)
    return `${baseUrl}${MAINTENANCE_RELATIVE_PATH}/#/edit/${sectionPath}/${singularObjectType}/${id}`
}

const userAppTypes = new Set(['userGroups', 'userRoles', 'users'])
const dashboardsAppTypes = new Set(['dashboards'])
const visualizationsAppTypes = new Set(['visualizations'])
const mapsIssuesTypes = new Set(['maps'])
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

    if (mapsIssuesTypes.has(issuesIdType)) {
        return `${baseUrl}${MAPS_RELATIVE_PATH}/#/${id}`
    }

    if (notSupportedIssueType.has(issuesIdType)) {
        return null
    }
    // if not handled above, assume it's a section in maintenance
    return getMaintenanceAppLink(baseUrl, { issuesIdType, id })
}
