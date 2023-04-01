const isDebugTree = false;
const isDebugPlugin = false;

var isEnableLeaveCheck = false; // この変数がtrueのときは、モーダルのアニメーションを表示しない

// 「このサイトを離れますか？」を有効にする
function enableLeaveCheck() {
    isEnableLeaveCheck = true;
    window.onbeforeunload = function (event) {
        event.preventDefault();
        event.returnValue = 'Check';
    }
}

// 「このサイトを離れますか？」を無効にする
function disableLeaveCheck() {
    window.onbeforeunload = null;
    isEnableLeaveCheck = false;
}


async function _editEnable() {
    document.getElementById('body_right').style.display = 'flex';
    document.getElementById('edit-switch-wrapper').style.opacity = 1;
    document.getElementById('edit-switch').checked = true;
    //
    const mainContents = document.getElementById('main_contents');
    for (const sortableItem of mainContents.children) {
        const jsonElement = sortableItem.querySelector('.json');
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
        await func("block_" + sortableItem.id);
    }
    // アイテムがなくなったとき用のドロップ専用エリア
    const sortableItem = new SortableItem({ isDropOnly: true });
    sortableItem.onDropBrotherJson = ({ jsonData, isBefore }) => onDropMainBlock({ jsonData, isBefore, sortableItem });
    sortableItem.outerElement.classList.add("dropOnly");
    mainContents.appendChild(sortableItem.outerElement);
}


document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('edit-switch').addEventListener("change", async function () {
        if (this.checked) {
            // 編集スイッチがONになったとき
            await _editEnable();
        }
        else {
            // 編集スイッチがOFFになったとき
            window.location.reload();
        }
    });
});
