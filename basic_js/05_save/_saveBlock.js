//#########################################################################################
async function _saveBlock(outerElement) {
    if (!outerElement) return null;
    const jsonElement = outerElement.querySelector('.json');
    if (!jsonElement) return null;
    const pastSaveData = JSON.parse(jsonElement.textContent);
    if (!pastSaveData) return null;
    if (!pastSaveData.blockType) return null;
    const plugin = plugins[pastSaveData.blockType];
    if (!plugin) return null;
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
            console.error(`プラグイン「${pastSaveData.blockType}」の関数「viewer.saveBlock()」でエラーが発生しました。`);
            console.error(err);
            return { blockType: pastSaveData.blockType };
        }
    }
    newSaveData.blockType = pastSaveData.blockType;
    if (!Array.isArray(newSaveData.children)) {
        newSaveData.children = [];
    }
    jsonElement.innerText = JSON.stringify(newSaveData);
    return newSaveData;
}