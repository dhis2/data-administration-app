const mergeUnique = (arr1, arr2) => {
    return [...new Set(arr1.concat(arr2))]
}

function addToSelection(orgUnits) {
    const newSelection = mergeUnique(
        this.props.selected,
        orgUnits.map(ou => ou.path)
    )
    this.props.onUpdateSelection(newSelection)
}

function removeFromSelection(orgUnits) {
    const newSelection = new Set(this.props.selected)
    orgUnits.forEach(ou => {
        newSelection.delete(ou.path)
    })
    this.props.onUpdateSelection([...newSelection])
}

function handleChangeSelection({ selected }) {
    this.setState({ selection: selected })
}

export { addToSelection, removeFromSelection, handleChangeSelection }
