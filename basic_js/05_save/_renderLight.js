//#########################################################################################
async function _renderLight(outerElementId, saveData) {
    if (!saveData?.blockType) {
        console.error('blockTypeが未定義です。');
        return {};
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
            alert(`プラグイン「${saveData?.blockType}」の関数「viewer.renderLight()」でエラーが発生しました。`);
            console.error(`プラグイン「${saveData?.blockType}」の関数「viewer.renderLight()」でエラーが発生しました。`);
            console.error(err);
            return {};
        }
    }
    //
    const preElement = document.createElement('pre');
    preElement.classList.add("json");
    preElement.innerText = JSON.stringify(saveData);
    preElement.style.display = "none";
    //
    const newOuterElement = document.createElement('div');
    newOuterElement.appendChild(preElement);
    try {
        newOuterElement.appendChild(lightElement);
    }
    catch (err) {
        alert(`プラグイン「${saveData?.blockType}」の軽量ブロックを描画できません。関数「viewer.renderLight()」を確認してください。`);
        console.error(`プラグイン「${saveData?.blockType}」の軽量ブロックを描画できません。関数「viewer.renderLight()」を確認してください。`);
        console.error(err);
        return {};
    }
    //
    return newOuterElement;
}