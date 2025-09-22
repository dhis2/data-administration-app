import { getIssueLink } from './getIssueLink.js'

const baseUrl = 'www.mydhis2instance.org'
const id = 'abc'

describe('getIssueLink', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    it.each([
        [
            'categories',
            'www.mydhis2instance.org/dhis-web-maintenance/#/edit/categorySection/category/abc',
        ],
        [
            'organisationUnits',
            'www.mydhis2instance.org/dhis-web-maintenance/#/edit/organisationUnitSection/organisationUnit/abc',
        ],
        [
            'relationshipTypes',
            'www.mydhis2instance.org/dhis-web-maintenance/#/edit/programSection/relationshipType/abc',
        ],
        [
            'programIndicatorGroups',
            'www.mydhis2instance.org/dhis-web-maintenance/#/edit/indicatorSection/programIndicatorGroup/abc',
        ],
        [
            'fakeObjects',
            'www.mydhis2instance.org/dhis-web-maintenance/#/edit/otherSection/fakeObject/abc',
        ],
        ['dashboards', 'www.mydhis2instance.org/dhis-web-dashboard/#/abc'],
        [
            'userRoles',
            'www.mydhis2instance.org/dhis-web-user/#/user-roles/edit/abc',
        ],
        [
            'userGroups',
            'www.mydhis2instance.org/dhis-web-user/#/user-groups/edit/abc',
        ],
        ['users', 'www.mydhis2instance.org/dhis-web-user/#/users/edit/abc'],
        [
            'visualizations',
            'www.mydhis2instance.org/dhis-web-data-visualizer/#/abc',
        ],
    ])(
        'with issuesIdType of %s it returns correct link of',
        (issuesIdType, expected) => {
            const result = getIssueLink(baseUrl, { issuesIdType, id })
            expect(result).toBe(expected)
        }
    )
})
