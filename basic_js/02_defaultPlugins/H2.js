//#########################################################################################
plugins["H2"] = {
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement('h2');
            element.id = blockId;
            element.innerText = saveData.text ?? "見出し２";
            return element;
        },
        "changeEditMode": async function (blockId) {
            const element = document.getElementById(blockId);
            element.contentEditable = true;
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
            const toolboxElement = document.createElement('h2');
            toolboxElement.innerText = saveData.text ?? '見出し２';
            return toolboxElement;
        },
    },
}
