//#########################################################################################
plugins["P"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement('p');
            element.id = blockId;
            element.innerHTML = saveData?.text ?? "本文";
            return element;
        },
        "changeEditMode": async function (blockId) {
            const quill = new Quill('#' + blockId, {
                theme: 'bubble'
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
            const toolboxElement = document.createElement('p');
            toolboxElement.innerText = saveData?.text ?? '本文';
            return toolboxElement;
        },
    },
}
