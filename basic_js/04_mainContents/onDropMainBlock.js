//#########################################################################################
async function onDropMainBlock({ jsonData, isBefore = true, sortableItem }) {
    const brotherItem = await _renderHeavy(jsonData, true);
    if (isBefore) {
        sortableItem.outerElement.before(brotherItem);
    }
    else {
        sortableItem.outerElement.after(brotherItem);
    }
}