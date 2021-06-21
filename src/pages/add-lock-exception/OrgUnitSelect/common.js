function addToSelection(orgUnits) {
    const orgUnitArray = Array.isArray(orgUnits) ? orgUnits : orgUnits.toArray()
    const addedOus = orgUnitArray.filter(
        ou => !this.props.selected.includes(ou.path)
    )

    this.props.onUpdateSelection(
        this.props.selected.concat(addedOus.map(ou => ou.path))
    )
}

function removeFromSelection(orgUnits) {
    const orgUnitArray = Array.isArray(orgUnits) ? orgUnits : orgUnits.toArray()
    const removedOus = orgUnitArray.filter(ou =>
        this.props.selected.includes(ou.path)
    )
    const removed = removedOus.map(ou => ou.path)
    const selectedOus = this.props.selected.filter(ou => !removed.includes(ou))

    this.props.onUpdateSelection(selectedOus)
}

function handleChangeSelection(event) {
    this.setState({ selection: event.target.value })
}

export { addToSelection, removeFromSelection, handleChangeSelection }
