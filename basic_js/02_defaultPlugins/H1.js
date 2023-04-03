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
                if (element.childNodes.length > 0) {
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
            const toolboxElement = document.createElement('h1');
            toolboxElement.innerText = saveData.text ?? '見出し１';
            return toolboxElement;
        },
    },
}
