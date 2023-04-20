//#########################################################################################
plugins["RedH2"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement('h2');
            element.id = blockId;
            element.style.background = "#8d0000";
            element.style.color = "#fff";
            element.style.padding = "5px";
            element.innerHTML = saveData?.text ?? "見出し２";
            return element;
        },
        "changeEditMode": async function (blockId) {
            const element = document.getElementById(blockId);
            element.addEventListener('click', (event) => {
                //
                // この１文がなかったら、
                // 編集中のテキストの先頭をクリックすると、カーソルが自動的に最後まで移動してしまう
                if (element.isContentEditable) return;
                //
                element.contentEditable = true;
                element.focus();
                // １文字以上の場合
                if (element.childNodes.length > 0) {
                    // カーソル位置を最後にもっていく
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.setStart(element.childNodes[0], element.innerHTML.length);
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
                text: element.innerHTML,
            };
        },
    },
    "toolbox": {
        "render": async function (saveData) {
            const toolboxElement = document.createElement('h2');
            toolboxElement.innerHTML = saveData?.text ?? '見出し２';
            toolboxElement.style.background = "#8d0000";
            toolboxElement.style.color = "#fff";
            toolboxElement.style.padding = "5px";
            return toolboxElement;
        },
    },
}
