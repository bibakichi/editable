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
        newSaveData = {};
        console.error(`プラグイン「${newSaveData.blockType}」の関数「viewer.saveBlock()」が未定義です。`);
    }
    else {
        try {
            newSaveData = await plugin?.viewer?.saveBlock("block_" + outerElement.id, pastSaveData);
        }
        catch (err) {
            alert(`プラグイン「${newSaveData.blockType}」の関数「viewer.saveBlock()」でエラーが発生しました。`);
            console.error(`プラグイン「${newSaveData.blockType}」の関数「viewer.saveBlock()」でエラーが発生しました。`);
            console.error(err);
            return {};
        }
    }
    newSaveData.blockType = pastSaveData.blockType;
    if (!Array.isArray(newSaveData.children)) {
        newSaveData.children = [];
    }
    //
    let lightElement;
    if (typeof plugin?.viewer?.renderLight !== 'function') {
        console.log(`プラグイン「${newSaveData.blockType}」の関数「viewer.renderLight()」が未定義です。`);
        lightElement = document.getElementById("block_" + outerElement.id);
    }
    else {
        try {
            lightElement = await plugin?.viewer?.renderLight("block_" + outerElement.id, newSaveData);
        }
        catch (err) {
            alert(`プラグイン「${newSaveData.blockType}」の関数「viewer.renderLight()」でエラーが発生しました。`);
            console.error(`プラグイン「${newSaveData.blockType}」の関数「viewer.renderLight()」でエラーが発生しました。`);
            console.error(err);
            return {};
        }
    }
    //
    const preElement = document.createElement('pre');
    preElement.classList.add("json");
    preElement.innerText = JSON.stringify(newSaveData);
    preElement.style.display = "none";
    //
    const newOuterElement = document.createElement('div');
    newOuterElement.appendChild(preElement);
    try {
        newOuterElement.appendChild(lightElement);
    }
    catch (err) {
        alert(`プラグイン「${newSaveData.blockType}」の軽量ブロックを描画できません。関数「viewer.renderLight()」を確認してください。`);
        console.error(`プラグイン「${newSaveData.blockType}」の軽量ブロックを描画できません。関数「viewer.renderLight()」を確認してください。`);
        console.error(err);
        return {};
    }
    //
    return { newOuterElement, newSaveData };
}