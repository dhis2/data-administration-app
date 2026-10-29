# Data Administration { #data_admin }

This page explains the functions in the **Data Administration** app. The
functions check the integrity of the data in the DHIS2 database and improve
the database performance. A data administrator should run these
functions on a regular basis to keep the quality of the stored data
high.

## Data integrity { #data_admin_data_integrity }

DHIS2 can perform many data integrity checks on the data in the
database. Identifying and correcting data integrity issues is extremely
important, because the data that you use for analysis must be valid.
This section describes some of the data integrity checks that the system
performs, and gives general procedures that resolve these issues.

In the **Data Administration** app, the checks are organized into two
tabs: **Standard checks** and **Slow checks**. Slow checks can take
significant time and resources to complete on large databases, for
example checks that query the `datavalue` table directly. You
must run slow checks individually, not all at once. On the **Standard
checks** tab, click **Run all standard checks** to run every standard
check at once.

![](resources/images/data_administration/data_integrity_check_detail.png)

Use **Search** to find a check by name. Use **Sort** to order the list by
name (**A-Z**) or by **Number of errors**. Choose a check in the list to see its severity (Info, Warning, Severe or
Critical), its section, a description under **About this check**, a
**Recommendation**, and the result of its latest run. Click **Run** to
run a check that has not run yet. Click **Re-run** to run that one check again.
To run a check, you must have the authority `F_PERFORM_MAINTENANCE`.

Each name in the list of errors is a link that opens the object in a new browser tab. Metadata objects open in the **Metadata Management** app. Dashboards, visualizations, users, user groups, and user roles open in their own apps.

> **Note**
>
> The steps in this section use the **Metadata Management** app. If your instance does not have the **Metadata Management** app, use the **Maintenance** app instead. See [Configure metadata (Metadata Management app)](#metadata_management_app).

For the severity, description and recommendation of every check, see [Data integrity checks](#data_admin_data_integrity_checks).

### v40 and earlier { #data_admin_data_integrity_v40_and_earlier }

In v40 and earlier, the **Data Administration** app does not have the **Standard checks** tab or the **Slow checks** tab.

In v40 and earlier, the **Data Administration** app does not have the **Run all standard checks** button.

### v42 and earlier { #data_admin_data_integrity_v42_and_earlier }

In v42 and earlier, the links in the list of errors open metadata objects in the **Maintenance** app, even when the **Metadata Management** app is installed.

## Maintenance { #data_admin_maintenance }

To run maintenance functions, open the **Data Administration** app and click **Maintenance**. Choose the functions that you want and click **Perform maintenance**. To run these functions, you must have the authority `F_PERFORM_MAINTENANCE`.

Table: Data maintenance functions in the Data Administration app

| Function                                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clear analytics tables                                                                        | Deletes the analytics tables from the database. These tables are used to generate aggregate data for the pivot tables, GIS, and reports.                                                                                                                                                                                                                                                                                                                                                        |
| Analyze analytics tables                                                                      | Performs a PostgreSQL `analyze` operation on all analytics tables.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Remove zero data values                                                                       | Removes zero data values from the database. DHIS2 removes a zero value only if its data element has the aggregation operator sum and does not have **Zero is significant** chosen. DHIS2 keeps zero values for data elements with other aggregation operators, such as average, because such values are significant when you aggregate the data.<br> <br>Reducing the number of data values improves system performance.                                                                        |
| Permanently remove soft deleted data values / events / enrollments / tracked entity instances | When you delete a data value in DHIS2, the system marks the corresponding database row as deleted and does not actually delete the row.<br> <br>Running this maintenance function physically removes these data value rows from the database.                                                                                                                                                                                                                                                   |
| Prune periods                                                                                 | Removes all periods that are not in use. A period is in use when a data value, a data set completion, an approval, a data input period, a lock exception, a validation result, or a saved visualization, map, event report, or interpretation refers to it. Reducing the number of periods improves system performance.                                                                                                                                                                         |
| Remove expired invitations                                                                    | Deletes users that represent user account invitations that are past their expiry date.                                                                                                                                                                                                                                                                                                                                                                                                          |
| Drop SQL views                                                                                | DHIS2 lets you create and manage SQL views as system objects with corresponding database SQL views.<br> <br>Running this maintenance function drops the underlying SQL views for all system views. Use the **Create SQL views** function to recreate these SQL views.                                                                                                                                                                                                                           |
| Create SQL views                                                                              | Recreates all SQL views in the database.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Update category option combinations                                                           | Rebuilds the category option combinations. This might be required after you change the category options that belong to a given category.                                                                                                                                                                                                                                                                                                                                                        |
| Update organisation unit paths                                                                | The `organisationunit` table in the DHIS2 database has a column `path` that contains a concatenated string of all ancestors in the hierarchy for each organisation unit.<br> <br>Running this maintenance function updates these values and makes sure that they are in sync with the current organisation unit hierarchy. DHIS2 manages this column, but a manual update might be useful when you load data directly in the database.<br> <br>In 2.43.2 and later, this function does nothing. |
| Clear application cache                                                                       | Clears the server caches: the Hibernate cache and the analytics partition caches. It does not clear the cache in your web browser. If you modify the database directly, clear the application cache for the change to take effect.                                                                                                                                                                                                                                                              |
| Reload apps                                                                                   | Manually reloads and detects installed DHIS2 apps.<br> <br>DHIS2 also detects the installed apps when the system starts and when you install or uninstall apps.                                                                                                                                                                                                                                                                                                                                 |

#### 2.43.2 and later { #data_admin_maintenance_2_43_2_and_later }

In 2.43.2 and later, the **Update organisation unit paths** function in the **Data Administration** app does nothing.

In 2.43.2 and later, DHIS2 stores the organisation unit path as an array of UIDs.

## Resource tables { #data_admin_resource_tables }

Resource tables are supporting tables that you use when you analyze
data. You typically join the contents of these tables with the
data value table when you query from third-party applications like
Microsoft Excel. The analysis modules of DHIS2 also use them extensively.
You should regenerate the resource tables only after
all data integrity issues are resolved. The system also
generates the resource tables automatically every time it runs the
analytics process.

To generate the resource tables, open the **Data Administration** app, click **Resource Tables**, and click **Generate tables**. To run this function, you must have the authority `F_PERFORM_MAINTENANCE`.

-   **Organisation unit structure** (`analytics_rs_orgunitstructure`)

    You should regenerate this table any time the organisation unit
    hierarchy changes. This table
    provides information about the organisation unit hierarchy. It has
    one row for each organisation unit, one column for each organisation
    unit level and the organisation unit identifiers for all parents in
    the lineage as values.

-   **Data element group set structure** (`analytics_rs_dataelementgroupsetstructure`)

    This table provides information about which data elements are
    members of which data element group sets. The table has one row for
    each data element, one column for each data element group set and
    the names of the data element group as values.

-   **Indicator group set structure** (`analytics_rs_indicatorgroupsetstructure`)

    This table provides information about which indicators are members
    of which indicator group sets. The table has one row for each
    indicator, one column for each indicator group set and the names of
    the indicator group as values.

-   **Organisation unit group set structure**
    (`analytics_rs_organisationunitgroupsetstructure`)

    This table provides information about which organisation units are
    members of which organisation unit group sets. The table has one row
    for each organisation unit, one column for each organisation unit
    group set and the names of the organisation unit groups as values.

-   **Category structure** (`analytics_rs_categorystructure`)

    This table provides information about which data elements are
    members of which categories. The table has one row for each data
    element, one column for each category and the names of the category
    options as values.

-   **Data element category option combo name** (`analytics_rs_categoryoptioncomboname`)

    You should regenerate this table any time the category combination
    names change. It contains readable names
    for the various combinations of categories.

-   **Data element structure** (`analytics_rs_dataelementstructure`)

    This table provides information about all data elements and which
    period type (frequency) they capture data at. The period type is
    determined through the data set membership, so it relies on data
    elements being members of data sets with similar period types to have
    a defined behavior.

-   **Date period structure** (`analytics_rs_dateperiodstructure`)

    This table provides information about all periods and which period
    type they are associated with. For each period type with lower
    frequency than itself, it contains information about which period it
    falls within.

-   **Period structure** (`analytics_rs_periodstructure`)

    Similar to `analytics_rs_dateperiodstructure`, containing a scoped set of
    periods more adapted for aggregated analytics.
    It is based on `period` and `periodtype` tables.

-   **Data element category option combinations**
    (`analytics_rs_dataelementcategoryoptioncombo`)

    This table provides a mapping between data elements and all possible
    category option combinations.

-   **Data set organisation unit category** (`analytics_rs_datasetorganisationunitcategory`)

    This table provides information related to data sets, organisation units
    and their associated category option combinations. If no association is found,
    it uses the default category option combo.

#### v40 and earlier { #data_admin_resource_tables_v40_and_earlier }

In v40 and earlier, resource table names do not start with `analytics_rs_`.

In v40 and earlier, the name of each resource table begins with an underscore, for example `_orgunitstructure` instead of `analytics_rs_orgunitstructure`.

In v40 and earlier, the other resource tables follow the same pattern: `_dataelementgroupsetstructure`, `_indicatorgroupsetstructure`, `_organisationunitgroupsetstructure`, `_categorystructure`, `_categoryoptioncomboname`, `_dataelementstructure`, `_dateperiodstructure`, `_periodstructure`, `_dataelementcategoryoptioncombo` and `_datasetorganisationunitcategory`.

## Analytics tables management { #data_admin_analytics_tables }

DHIS2 generates database tables that the system then uses as a basis for
various analytics functions. These tables are also valuable if you write
advanced SQL reports. In the **Data Administration** app, you can start the table
generation immediately. To schedule the generation at regular intervals,
use the **Scheduler** app. This lets you refresh recent analytics on
demand and see updated pivot tables without waiting for all of the data from past years to
re-process.

> **Note**
>
> You can also generate the tables through the web API. A system
> administrator typically performs this task.

To generate the analytics tables, you must have the authority `F_PERFORM_MAINTENANCE`.

1.  Open the **Data Administration** app and click **Analytics Tables**.

2.  Choose the parts of the analytics process that you want to skip:

    -   **Skip generation of aggregate data and completeness data**

    -   **Skip generation of resource tables**

    -   **Skip generation of event data**

    -   **Skip generation of enrollment data**

    -   **Skip generation of organisation unit ownership data**

    -   **Skip generation of tracked entity data** (checked by default)

    -   **Skip generation of outlier data** (checked by default)

3.  Choose **Number of last years of data to include**. The default is **All**. If you choose 0,
    then you run latest or continuous analytics, as defined in
    [Continuous analytics table](scheduler-app.html#scheduling_continuous_analytics_table).
    A value of 3 includes the current year and the two years before it.

4.  Click **Start export**.

> **Important**
>
> When you include only the last years, the app rebuilds those years and leaves the older years as they were. After a change that adds or removes an analytics dimension, for example turning **Data dimension** on or off for a category or a group set, the older years no longer match the rebuilt years. Queries that cover both can then show no data, or fail with error code E7145 (**Query failed because of a syntax error**). After such a change, run the analytics tables update once for all years, with **Number of last years of data to include** set to **All**. Later runs can include only the last years again.

If an analytics request fails with the message **Query failed because a referenced table does not exist. Please ensure analytics job was run** (error code E7144), a table that the request needs is missing. For example, the analytics tables have not been generated, or that part was skipped when they were generated. Generate the tables as described in this section.

#### v40 and earlier { #data_admin_analytics_tables_v40_and_earlier }

In v40 and earlier, the **Data Administration** app does not have the option **Skip generation of tracked entity data**.

In v40 and earlier, the **Data Administration** app does not have the option **Skip generation of outlier data**.

## Data statistics { #data_admin_data_statistics }

The data statistics module provides an overview of the number of objects
stored in the DHIS2 database.

![](resources/images/data_administration/data_stats.png)

The app shows the total number of each type of object in the **Object type**
table. Other tables show the number of pending and expired user account
invitations. They also show the number of data values and events registered in recent time
periods, and the number of active users and users who logged in.

The **Active users** table shows the number of users who have performed an action that results in a data statistic event, for example opening a dashboard or viewing a report. The **Users logged in** table shows the number of users who have logged in at least once. A user who logs in more than once in a time period counts once. Both tables show the last hour, today, the last 2 days, the last 7 days and the last 30 days.

To open this page, you must have the authority `F_PERFORM_MAINTENANCE`.

#### v42 and earlier { #data_admin_data_statistics_v42_and_earlier }

In v42 and earlier, the **Data Administration** app (version 100.1.8 and later) shows one table of users, **Users logged in**.

In v42 and earlier, the **Data Administration** app (version 100.1.8 and later) does not show the **Active users** table.

#### v43 and later { #data_admin_data_statistics_v43_and_later }

In v43 and later, the **Data Administration** app shows the **Active users** table and the **Users logged in** table.

## Lock exceptions { #data_admin_lock_exception }

Lock exceptions provide fine-grained control over exemption from a
locked data set.

This section covers lock exceptions on aggregate data sets only. Tracker programs have
their own expiry settings, and data approval locks data separately. Neither is set here. After the expiry of the data set, DHIS2 denies data entry
by default, unless an exception has been granted through the **Lock
Exception** interface.

### Adding a lock exception

A lock exception enables data entry even after the
expiry period of the data set has passed.

1. Open the **Data Administration** app and click **Lock Exception**.
2. Click **Add lock exception** at the top of the page.
3. Choose the data set, the period, and the organisation units that
   you want (see the following screenshot). The period menus depend on the
   period type of the data set. For a monthly data set, you choose a year and a month. The organisation unit tree is limited to the organisation units that are assigned to the data set and the organisation units above them in the hierarchy. You can use the organisation unit
   level and organisation unit group lists, with the **Select** and **Deselect** buttons, or the **Select All Org Units**
   button, to choose several organisation units at once.
4. Click **Add lock exception**.

![](resources/images/data_administration/create_lock_exception.png)

In the previous example, DHIS2 creates a data lock exception for "Bo" for the
"Child Health" data set for "February 2014".

At least one of the organisation units that you choose must be assigned to the
data set. Otherwise, the app shows an error that none of the target
organisation units is linked to the data set.

To add a lock exception, you must have the authority `F_DATASET_PUBLIC_ADD` and access to edit the data set. Each organisation unit that you choose must be one of your data capture organisation units, unless you have the authority `ALL`. If you do not have the required access, the request fails with the message **You don't have the proper permissions to update this object**.

### Deleting a lock exception

1. Open the **Data Administration** app and click **Lock Exception**.
2. In the list, find the lock exception for the organisation unit, data set
   and period you want to remove, and click **Remove lock exception** (trash can icon).
3. Click **Yes, remove lock exception** to confirm, or **No, cancel** to
   keep it.

This removes the lock exception for that single organisation unit only.

To remove a lock exception, you must have the authority `F_DATASET_DELETE` and access to edit the data set. The authorities `F_PERFORM_MAINTENANCE` and `F_DATASET_PUBLIC_ADD` do not give you this access. If you do not have it, the request fails with the message **You don't have the proper permissions to delete this object.** You do not need the authority `ALL`. A user who needs to add and remove lock exceptions needs both `F_DATASET_PUBLIC_ADD` and `F_DATASET_DELETE`.

### Batch deletion

A data set and period combination can have lock exceptions across many
organisation units, for example 100 organisation units. In this case, you can
remove all of them in one action instead of one at a time.

1. Open the **Data Administration** app and click **Lock Exception**.
2. Click **Batch deletion** at the top of the page.
3. Find the data set and period combination that you want in the list, and click
   **Batch delete lock exceptions** (trash can icon).
4. Click **Yes, remove lock exception** to confirm.

This removes the lock exception for that data set and period across _all_
organisation units it applies to, not just one.

## Min-Max Value Generation { #data_admin_min_max_value_generation }

Use this administrative function to generate min-max values,
which DHIS2 uses as part of the data quality and validation process for
specific organisation units and data sets. Choose one or more data sets in
the **Data set** menu, and then choose an
organisation unit in the **Organisation unit** tree. Click
**Generate min-max values** to generate or regenerate the min-max values
for the data sets and organisation unit that you chose. Click **Remove
min-max values** to remove the min-max values that are stored for them.
To run this function, you must have the authority
`F_GENERATE_MIN_MAX_VALUES`.

To set min-max values for a single data value, use the **Data Entry** app. See [Minimum and maximum limits](#aggregate_data_entry_app.limits).

![](resources/images/data_administration/min_max_value_generation.png)
