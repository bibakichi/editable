//#########################################################################################
// 編集スイッチがONになったときに呼び出される関数
async function _editEnable() {
    const text = window.prompt("パスワードを入力してください", "");
    if (text === "futec") {
        await _editEnable2();
    }
    else {
        alert("パスワードが間違っています");
    }
}

// 
async function _editEnable2() {
    document.getElementById('body_right').style.display = 'flex';
    document.getElementById('edit-switch-wrapper').style.opacity = 1;
    document.getElementById('edit-switch').checked = true;
    //
    const mainContents = document.getElementById('main_contents');
    for (const sortableElement of mainContents.querySelectorAll(":scope>*")) {
        const jsonElement = sortableElement.querySelector('.json');
        if (!jsonElement) {
            continue;
        }
        const saveData = JSON.parse(jsonElement.textContent);
        if (!saveData) continue;
        const plugin = plugins[saveData?.blockType];
        if (!plugin) continue;
        const func = plugin?.viewer?.changeEditMode;
        if (typeof func === "function") {
            try {
                await func("block_" + sortableElement.id, saveData);
            }
            catch (err) { }
        }
        const sortableItem = sortableItems[sortableElement.id];
        if (sortableItem) {
            sortableItem.isEnable = true;
        }
    }
    // アイテムがなくなったとき用のドロップ専用エリア
    const sortableItem = new SortableItem({ isDropOnly: true });
    sortableItem.onDropBrotherFile = ({ file, isBefore }) => onDropBrotherFile({ file, isBefore, sortableItem });
    sortableItem.onDropBrotherJson = ({ jsonData, isBefore }) => onDropMainBlock({ jsonData, isBefore, sortableItem });
    sortableItem.outerElement.classList.add("dropOnly");
    mainContents.appendChild(sortableItem.outerElement);
    //
    document.body.addEventListener("dragenter", async function (event) {
        event.preventDefault();
        const dropAreasList = document.getElementsByClassName('sortable_item_drop_areas');
        for (const dropAreas of dropAreasList) {
            dropAreas.style.display = 'block';
        }
    });

    document.body.addEventListener("dragend", async function (event) {
        const dropAreasList = document.getElementsByClassName('sortable_item_drop_areas');
        for (const dropAreas of dropAreasList) {
            dropAreas.style.display = 'none';
        }
    });

    document.body.addEventListener("drop", async function (event) {
        event.preventDefault();
        const dropAreasList = document.getElementsByClassName('sortable_item_drop_areas');
        for (const dropAreas of dropAreasList) {
            dropAreas.style.display = 'none';
        }
    });
    //
    if (!window.isLoginRequired) {
        // 「このサイトを離れますか？」を有効にする
        isEditMode = true;
        window.onbeforeunload = function (event) {
            event.preventDefault();
            event.returnValue = 'Check';
        }
    }
}
