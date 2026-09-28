const MAINTENANCE_RELATIVE_PATH = '/dhis-web-maintenance'

const nonStandardSingulars = {
    categories: 'category',
    pushAnalysis: 'pushAnalysis',
    accesses: 'access',
    userGroupAccesses: 'userGroupAccess',
    outlierAnalysis: 'outlierAnalysis',
    axes: 'axis',
    legendDefinitions: 'legendDefinitions',
    userAccesses: 'userAccess',
    analyticsPeriodBoundaries: 'analyticsPeriodBoundary',
    apiToken: 'apiToken',
}

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

/* NOTE: This is best-effort, and all cases may not be accounted for */
export const getOldMaintenanceAppLink = (baseUrl, { issuesIdType, id }) => {
    const singularObjectType =
        nonStandardSingulars[issuesIdType] ??
        issuesIdType.replace(/(.*)s$/, '$1')
    const sectionPath = getMaintenanceSectionPath(singularObjectType)

    return `${baseUrl}${MAINTENANCE_RELATIVE_PATH}/#/edit/${sectionPath}/${singularObjectType}/${id}`
}
