//#########################################################################################
async function _renderHeavy(saveData, isEditable = false) {
    if (!saveData) return;
    if (!saveData?.blockType) {
        console.error('blockTypeが未定義です。');
        return null;
    }
    const plugin = await _loadPlugin(saveData?.blockType);
    if (!Array.isArray(saveData?.children)) {
        saveData.children = [];
    }
    //
    const sortableItem = new SortableItem({
        isEnable: isEditable,
        enableCopy: false,
    });
    let viewerElement;
    if (typeof plugin?.viewer?.renderHeavy === 'function') {
        try {
            viewerElement = await plugin?.viewer?.renderHeavy("block_" + sortableItem.outerElement.id, saveData);
        }
        catch (err) {
            alert(`プラグイン「${saveData?.blockType}」の関数「viewer.renderHeavy()」でエラーが発生しました。`);
            console.error(`プラグイン「${saveData?.blockType}」の関数「viewer.renderHeavy()」でエラーが発生しました。`);
            console.error(err);
            return null;
        }
    }
    else if (typeof plugin?.viewer?.renderLight === 'function') {
        try {
            viewerElement = await plugin?.viewer?.renderLight("block_" + sortableItem.outerElement.id, saveData);
        }
        catch (err) {
            alert(`プラグイン「${saveData?.blockType}」の関数「viewer.renderLight()」でエラーが発生しました。`);
            console.error(`プラグイン「${saveData?.blockType}」の関数「viewer.renderLight()」でエラーが発生しました。`);
            console.error(err);
            return null;
        }
    }
    else {
        alert("このブロックは配置できません");
        console.log("このブロックは配置できません");
        console.log(`プラグイン「${saveData?.blockType}」の関数「viewer.renderHeavy()」と「viewer.renderLight()」の両方が未定義です。`);
        return null;
    }
    try {
        sortableItem.innerElement = viewerElement;
    }
    catch (err) {
        alert(`プラグイン「${saveData?.blockType}」のブロックを描画できません。関数「viewer.renderHeavy()」と「viewer.renderLight()」を確認してください。`);
        console.error(`プラグイン「${saveData?.blockType}」のブロックを描画できません。関数「viewer.renderHeavy()」と「viewer.renderLight()」を確認してください。`);
        console.error(err);
        return null;
    }
    sortableItem.jsonData = saveData;
    sortableItem.onDropBrotherJson = ({ jsonData, isBefore }) => onDropMainBlock({ jsonData, isBefore, sortableItem });
    sortableItem.onDropBrotherFile = ({ file, isBefore }) => onDropBrotherFile({ file, isBefore, sortableItem });
    //
    const preElement = document.createElement('pre');
    preElement.classList.add("json");
    preElement.innerText = JSON.stringify(saveData);
    preElement.style.display = "none";
    sortableItem.outerElement.appendChild(preElement);
    sortableItem.outerElement.addEventListener('focusout', async (event) => {
        const outerElement = document.getElementById(sortableItem.outerElement.id);
        const j = await _saveBlock(outerElement);
        sortableItem.jsonData = j;
    });
    //
    if (isEditable) {
        setTimeout(async () => {
            //
            // 編集可にする
            if (typeof plugin?.viewer?.changeEditMode === 'function') {
                try {
                    await plugin?.viewer?.changeEditMode("block_" + sortableItem.outerElement.id);
                }
                catch (err) {
                    alert(`プラグイン「${saveData?.blockType}」の関数「viewer.changeEditMode()」でエラーが発生しました。`);
                    console.error(`プラグイン「${saveData?.blockType}」の関数「viewer.changeEditMode()」でエラーが発生しました。`);
                    console.error(err);
                    return;
                }
            }
        }, 500);
    }
    //
    return sortableItem.outerElement;
}