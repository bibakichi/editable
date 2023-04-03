//#########################################################################################
async function _editEnable() {
    // 「このサイトを離れますか？」を有効にする
    isEditMode = true;
    window.onbeforeunload = function (event) {
        event.preventDefault();
        event.returnValue = 'Check';
    }
    //
    document.getElementById('body_right').style.display = 'flex';
    document.getElementById('edit-switch-wrapper').style.opacity = 1;
    document.getElementById('edit-switch').checked = true;
    //
    const mainContents = document.getElementById('main_contents');
    for (const sortableElement of mainContents.children) {
        const jsonElement = sortableElement.querySelector('.json');
        if (!jsonElement) {
            alert("ツールボックスのHTMLに.blockTypeが設定されていません");
            continue;
        }
        const saveData = JSON.parse(jsonElement.textContent);
        if (!saveData) continue;
        const plugin = plugins[saveData.blockType];
        if (!plugin) continue;
        const func = plugin?.viewer?.changeEditMode;
        if (typeof func !== "function") continue;
        await func("block_" + sortableElement.id);
        const sortableItem = sortableItems[sortableElement.id];
        if (sortableItem) {
            sortableItem.isEnable = true;
        }
    }
    // アイテムがなくなったとき用のドロップ専用エリア
    const sortableItem = new SortableItem({ isDropOnly: true });
    sortableItem.onDropBrotherJson = ({ jsonData, isBefore }) => onDropMainBlock({ jsonData, isBefore, sortableItem });
    sortableItem.outerElement.classList.add("dropOnly");
    mainContents.appendChild(sortableItem.outerElement);
}
