export const parseLockExceptions = lockExceptionResponse =>
    lockExceptionResponse.map(({ dataSet, period, organisationUnit }) => {
        const row = {
            period: period.displayName,
            periodId: period.id,
            dataSet: dataSet.displayName,
            dataSetId: dataSet.id,
        }
        if (organisationUnit) {
            row.organisationUnit = organisationUnit.displayName
            row.organisationUnitId = organisationUnit.id
        }
        return row
    })
