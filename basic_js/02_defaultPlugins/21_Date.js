//#########################################################################################

plugins["Date"] = {
    "isDefault": true,
    "toolbox": {
        "render": async function (saveData) {
            const element = document.createElement('div');
            element.style.padding = "5px";
            element.innerHTML = "ページ内で連動した日時";
            return element;
        },
    },
    "viewer": {
        "changeEditMode": async function (blockId) {
            const element = document.getElementById(blockId);
            const newElement = document.createElement("input");
            newElement.type = "date";
            element.replaceWith(newElement);
        },
        "saveBlock": async function (blockId, pastSaveData) {
            const element = document.getElementById(blockId);
            settings[0] = {
                ...settings[0],
                date: element.value,
            };
            return {};
        },
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement("div");
            element.id = blockId;
            element.innerHTML = settings[0]?.date;
            return element;
        },
    },
}
