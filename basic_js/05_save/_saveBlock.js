//#########################################################################################
async function _saveBlock(outerElement) {
    if (!outerElement) return {};
    const jsonElement = outerElement.querySelector('.json');
    if (!jsonElement) return {};
    const pastSaveData = JSON.parse(jsonElement.textContent);
    if (!pastSaveData) return {};
    if (!pastSaveData.blockType) {
        console.error('blockTypeが未定義です。');
        return {};
    }
    const plugin = plugins[pastSaveData.blockType];
    if (!plugin) return {};
    //
    let newSaveData;
    if (typeof plugin?.viewer?.saveBlock !== 'function') {
        newSaveData = { ...pastSaveData };
        console.error(`プラグイン「${pastSaveData.blockType}」の関数「viewer.saveBlock()」が未定義です。`);
    }
    else {
        try {
            newSaveData = await plugin?.viewer?.saveBlock("block_" + outerElement.id, pastSaveData);
        }
        catch (err) {
            alert(`プラグイン「${pastSaveData.blockType}」の関数「viewer.saveBlock()」でエラーが発生しました。`);
            console.error(`プラグイン「${pastSaveData.blockType}」の関数「viewer.saveBlock()」でエラーが発生しました。`);
            console.error(err);
            return {};
        }
    }
    newSaveData.blockType = pastSaveData.blockType;
    if (!Array.isArray(newSaveData.children)) {
        newSaveData.children = [];
    }
    jsonElement.innerText = JSON.stringify(newSaveData);
    return newSaveData;
}