//#########################################################################################
async function _saveBlock(outerElement) {
    if (!outerElement) return { blockType: pastSaveData.blockType };
    const jsonElement = outerElement.querySelector('.json');
    if (!jsonElement) return { blockType: pastSaveData.blockType };
    const pastSaveData = JSON.parse(jsonElement.textContent);
    if (!pastSaveData) return { blockType: pastSaveData.blockType };
    if (!pastSaveData.blockType) {
        console.error('blockTypeが未定義です。');
        return { blockType: pastSaveData.blockType };
    }
    const plugin = plugins[pastSaveData.blockType];
    if (!plugin) return { blockType: pastSaveData.blockType };
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