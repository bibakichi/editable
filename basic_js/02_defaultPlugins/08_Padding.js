//#########################################################################################
plugins["Padding"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement('div');
            element.id = blockId;
            element.style.width = "100%";
            element.style.height = "40px";
            return element;
        },
    },
    "toolbox": {
        "render": async function (saveData) {
            const toolboxElement = document.createElement('h4');
            toolboxElement.innerText = saveData?.text ?? '空白';
            return toolboxElement;
        },
    },
}
