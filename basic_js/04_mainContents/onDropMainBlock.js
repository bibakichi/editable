//#########################################################################################
// メインコンテンツが追加されたときの関数
async function onDropMainBlock({ jsonData, isBefore = true, sortableItem }) {
    const newItem = await _renderHeavy(jsonData, true);
    if (isBefore) {
        sortableItem.outerElement.before(newItem);
    }
    else {
        sortableItem.outerElement.after(newItem);
    }
}