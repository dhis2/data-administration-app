import React from 'react';
import { shallow } from 'enzyme';
import PageHelper from './PageHelper';
import { IconButton } from 'material-ui';
import {
    DATA_STATISTICS_SECTION_KEY,
    getDocsKeyForSection
} from '../../pages/sections.conf';

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component', () => ('OrgUnitSelectByLevel'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component', () => ('OrgUnitSelectByGroup'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectAll.component', () => ('OrgUnitSelectAll'));
jest.mock('d2-ui/lib/select-field/SelectField', () => ('SelectField'));
jest.mock('d2-ui/lib/period-picker/PeriodPicker.component', () => ('PeriodPicker'));
jest.mock('d2-ui/lib/data-table/DataTable.component', () => ('DataTable'));
jest.mock('d2-ui/lib/pagination/Pagination.component', () => ('Pagination'));
jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));

const ownShallow = () => {
    return shallow(
        <PageHelper
            sectionDocsKey={getDocsKeyForSection(DATA_STATISTICS_SECTION_KEY)}
        />,
        {
            context: {
                d2: {
                    system: {
                        version: {
                            snapshot: true,
                        }
                    }
                }
            },
        },
    );
};

it('Page Helper renders without crashing.', () => {
    ownShallow();
});

it('Page Helper should have an icon button.', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(IconButton)).toHaveLength(1);
});
