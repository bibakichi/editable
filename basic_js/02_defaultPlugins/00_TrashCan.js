//#########################################################################################
plugins["TrashCan"] = {
    "isDefault": true,
    "toolbox": {
        "render": async function (saveData) {
            const toolboxElement = document.createElement('h3');
            toolboxElement.innerText = "ゴミ箱";
            return toolboxElement;
        },
    },
}
