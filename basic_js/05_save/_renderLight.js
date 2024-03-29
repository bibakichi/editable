//#########################################################################################
async function _renderLight(outerElementId, saveData) {
    if (!saveData?.blockType) {
        console.error('blockTypeが未定義です。');
        return null;
    }
    const plugin = plugins[saveData?.blockType];
    if (!plugin) return {};
    //
    let lightElement;
    if (typeof plugin?.viewer?.renderLight !== 'function') {
        console.log(`プラグイン「${saveData?.blockType}」の関数「viewer.renderLight()」が未定義です。`);
        lightElement = document.getElementById("block_" + outerElementId);
    }
    else {
        try {
            lightElement = await plugin?.viewer?.renderLight("block_" + outerElementId, saveData);
        }
        catch (err) {
            console.error(`プラグイン「${saveData?.blockType}」の関数「viewer.renderLight()」でエラーが発生しました。`);
            console.error(err);
            return {};
        }
    }
    //
    if (saveData?.blockType == "StaticHTML") {
        return lightElement;
    }
    //
    const newOuterElement = document.createElement('div');
    //
    const preElement = document.createElement('pre');
    preElement.classList.add("json");
    preElement.innerText = JSON.stringify(saveData);
    preElement.style.display = "none";
    newOuterElement.appendChild(preElement);
    //
    try {
        newOuterElement.appendChild(lightElement);
    }
    catch (err) {
        console.error(`プラグイン「${saveData?.blockType}」の軽量ブロックを描画できません。関数「viewer.renderLight()」を確認してください。`);
        console.error(err);
        return {};
    }
    //
    return newOuterElement;
}