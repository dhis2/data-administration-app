function removeFromSelection(orgUnits) {
    const newSelection = new Set(this.props.selected)
    orgUnits.forEach(ou => {
        newSelection.delete(ou.path)
    })
    this.props.onSelectedChange([...newSelection])
}

function handleChangeSelection({ selected }) {
    this.setState({ selection: selected })
}

export { removeFromSelection, handleChangeSelection }
