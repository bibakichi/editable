//#########################################################################################
plugins["H1"] = {
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement('h1');
            element.id = blockId;
            element.innerText = saveData.text ?? "見出し１";
            return element;
        },
        "changeEditMode": async function (blockId) {
            const element = document.getElementById(blockId);
            element.addEventListener('click', (event) => {
                element.contentEditable = true;
                element.focus();
                const end = element.innerText.length;// 最終位置を取得
                element.setSelectionRange(end, end);// 最後の文字の位置を選択状態に変更
            });
            element.addEventListener('focusout', (event) => {
                element.contentEditable = false;
            });
        },
        "saveBlock": async function (blockId, pastSaveData) {
            const element = document.getElementById(blockId);
            return {
                text: element.textContent,
            };
        },
    },
    "toolbox": {
        "render": async function (saveData) {
            const toolboxElement = document.createElement('h1');
            toolboxElement.innerText = saveData.text ?? '見出し１';
            return toolboxElement;
        },
    },
}
