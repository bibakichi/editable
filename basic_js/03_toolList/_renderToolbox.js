//#########################################################################################

async function _renderToolbox({ saveData, isDragOnly = false }) {
    if (!saveData) return;
    if (!saveData?.blockType) {
        console.error('blockTypeが未定義です。');
        return;
    }
    if (!Array.isArray(saveData?.children)) {
        saveData.children = [];
    }
    const plugin = await _loadPlugin(saveData?.blockType);
    //
    const cardOuterElement = document.createElement('div');
    cardOuterElement.style.padding = '10px';
    cardOuterElement.style.width = '200px';
    cardOuterElement.style.height = '100px';
    cardOuterElement.style.maxWidth = '100%';
    cardOuterElement.style.boxSizing = 'border-box';
    //
    const card = document.createElement('div');
    card.style.width = '100%';
    card.style.height = '100%';
    card.style.background = '#fff';
    card.style.borderRadius = '10px';
    card.style.boxShadow = '2px 4px 12px rgb(0 0 0 / 8%)';
    card.style.boxSizing = 'border-box';
    card.style.textAlign = 'center';
    card.style.overflow = 'hidden';
    cardOuterElement.appendChild(card);
    //
    if (typeof plugin?.toolbox?.render !== 'function') {
        alert(`プラグイン「${saveData?.blockType}」の関数「toolbox.render()」が未定義です。`);
        console.error(`プラグイン「${saveData?.blockType}」の関数「toolbox.render()」が未定義です。`);
    }
    let toolListInner;
    try {
        toolListInner = await plugin?.toolbox?.render(saveData);
    }
    catch (err) {
        alert(`プラグイン「${saveData?.blockType}」の関数「toolbox.render()」でエラーが発生しました。`);
        console.error(`プラグイン「${saveData?.blockType}」の関数「toolbox.render()」でエラーが発生しました。`);
        console.error(err);
        return;
    }
    try {
        card.appendChild(toolListInner);
    }
    catch (err) {
        alert(`プラグイン「${saveData?.blockType}」のツールボックスを描画できません。関数「toolbox.render()」を確認してください。`);
        console.error(`プラグイン「${saveData?.blockType}」のツールボックスを描画できません。関数「toolbox.render()」を確認してください。`);
        console.error(err);
        return;
    }
    const isDroppable = (plugin?.toolbox?.onDrop)
        || (plugin?.toolbox?.onDropJson)
        || (plugin?.toolbox?.onDropText)
        || (plugin?.toolbox?.onDropFile)
        || (saveData?.blockType === "TrashCan");
    const sortableItem = new SortableItem({
        isDragOnly,
        isDroppable: isDroppable,
        enableCopy: true,
    });
    sortableItem.jsonData = saveData;
    sortableItem.innerElement = cardOuterElement;
    sortableItem.onDropBrotherJson = ({ jsonData, isBefore }) => _onDropToolList({ jsonData, isBefore, sortableItem });
    //
    if (typeof plugin?.toolbox?.onDragEnter === 'function') {
        sortableItem.onDragEnter = () => plugin?.toolbox?.onDragEnter(sortableItem.outerElement.id);
    }
    if (typeof plugin?.toolbox?.onDragLeave === 'function') {
        sortableItem.onDragLeave = () => plugin?.toolbox?.onDragLeave(sortableItem.outerElement.id);
    }
    if (typeof plugin?.toolbox?.onDragOver === 'function') {
        sortableItem.onDragOver = () => plugin?.toolbox?.onDragOver(sortableItem.outerElement.id);
    }
    if (typeof plugin?.toolbox?.onDrop === 'function') {
        sortableItem.onDrop = () => plugin?.toolbox?.onDrop(sortableItem.outerElement.id);
    }
    sortableItem.onDropChildJson = ({ ballOuterId, jsonData, enableCopy }) => {
        if (saveData?.blockType === "TrashCan") {
            const ballItem = document.getElementById(ballOuterId);
            if (ballItem) {
                if (ballItem.parentElement.id !== "toolShop") {
                    ballItem.remove();
                }
            }
        }
        else if (typeof plugin?.toolbox?.onDropJson === 'function') {
            plugin?.toolbox?.onDropJson(sortableItem.outerElement.id, jsonData);
        }
    }
    if (typeof plugin?.toolbox?.onDropText === 'function') {
        sortableItem.onDropChildText = (text) => plugin?.toolbox?.onDropText(sortableItem.outerElement.id, text);
    }
    if (typeof plugin?.toolbox?.onDropFile === 'function') {
        sortableItem.onDropChildFile = (file) => plugin?.toolbox?.onDropFile(sortableItem.outerElement.id, file);
    }
    //
    const preElement = document.createElement('pre');
    preElement.classList.add("json");
    preElement.innerText = JSON.stringify(saveData);
    preElement.style.display = "none";
    sortableItem.outerElement.appendChild(preElement);
    //
    return sortableItem.outerElement;
}