const MAINTENANCE_RELATIVE_PATH = '/dhis-web-metadata-management'
const DASHBOARDS_RELATIVE_PATH = '/dhis-web-dashboard'
const USERS_RELATIVE_PATH = '/dhis-web-user'
const VISUALIZATIONS_RELATIVE_PATH = '/dhis-web-data-visualizer'

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
    return `${baseUrl}${MAINTENANCE_RELATIVE_PATH}#/${issuesIdType}/${id}`
}
