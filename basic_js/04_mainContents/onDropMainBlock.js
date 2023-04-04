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
                const newSaveData = await plugin?.viewer?.onAppend("block_" + newItem.id, jsonData);
                console.log(newSaveData);
                let jsonElement = newItem.querySelector('.json');
                if (!jsonElement) {
                    jsonElement = document.createElement('pre');
                    jsonElement.classList.add("json");
                    jsonElement.style.display = "none";
                    newItem.appendChild(jsonElement);
                }
                jsonElement.innerText = JSON.stringify(newSaveData);
            }
            catch (err) {
                alert(`プラグイン「${jsonData.blockType}」の関数「viewer.onAppend()」でエラーが発生しました。`);
                console.error(`プラグイン「${jsonData.blockType}」の関数「viewer.onAppend()」でエラーが発生しました。`);
                console.error(err);
            }
        }
    }
    return newItem;
}