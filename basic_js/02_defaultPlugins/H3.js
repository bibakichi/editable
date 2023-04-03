//#########################################################################################
plugins["H3"] = {
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement('h3');
            element.id = blockId;
            element.innerText = saveData.text ?? "見出し３";
            return element;
        },
        "changeEditMode": async function (blockId) {
            const element = document.getElementById(blockId);
            element.addEventListener('click', (event) => {
                element.contentEditable = true;
                element.focus();
                // １文字以上の場合
                if (element.childNodes.length > 0) {
                    // カーソル位置を最後にもっていく
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.setStart(element.childNodes[0], element.innerText.length);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
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
            const toolboxElement = document.createElement('h3');
            toolboxElement.innerText = saveData.text ?? '見出し３';
            return toolboxElement;
        },
    },
}
