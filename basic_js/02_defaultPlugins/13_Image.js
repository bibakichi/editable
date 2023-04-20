//#########################################################################################
plugins["Image"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement('img');
            element.id = blockId;
            element.src = saveData?.src;
            return element;
        },
    },
    "toolbox": {
        "render": async function (saveData) {
            const element = document.createElement('img');
            element.src = saveData?.src;
            return element;
        },
    },
}
