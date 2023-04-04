//#########################################################################################
// メインコンテンツが追加されたときの関数
async function onDropMainBlock({ jsonData, isBefore = true, sortableItem }) {
    const newItem = await _renderHeavy(jsonData, true);
    if (!newItem) {
        return;
    }
    else if (isBefore) {
        sortableItem.outerElement.before(newItem);
    }
    else {
        sortableItem.outerElement.after(newItem);
    }
    if (jsonData?.blockType) {
        const plugin = await _loadPlugin(jsonData.blockType);
        if (typeof plugin?.viewer?.onAppend === 'function') {
            try {
                await plugin?.viewer?.onAppend("block_" + newItem.id, saveData);
            }
            catch (err) {
                alert(`プラグイン「${saveData.blockType}」の関数「viewer.onAppend()」でエラーが発生しました。`);
                console.error(`プラグイン「${saveData.blockType}」の関数「viewer.onAppend()」でエラーが発生しました。`);
                console.error(err);
            }
        }
    }
    return newItem;
}