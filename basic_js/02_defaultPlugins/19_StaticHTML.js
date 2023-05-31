//#########################################################################################

function rendarStaticHTML({ blockId, saveData }) {
    let outerElement = document.createElement("div");
    if (!saveData?.html) return outerElement;
    outerElement.innerHTML = saveData.html;
    while (true) {
        const elements = outerElement.querySelectorAll(":scope>*");
        if (elements.length == 0) return outerElement;
        if (elements.length >= 2) return outerElement;
        return elements[0];
    }
}

plugins["StaticHTML"] = {
    "isDefault": true,
    "toolbox": {
        "render": async function (saveData) {
            const iframeElement = document.createElement('iframe');
            iframeElement.src = "data:text/html," + ((saveData?.html) ?? "");
            return iframeElement;
        },
    },
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            return rendarStaticHTML({ blockId, saveData });
        },
        "changeEditMode": async function (blockId, saveData) {

        },
        "saveBlock": async function (blockId, pastSaveData) {
            const element = document.getElementById(blockId);
            return {
                html: element.innerHTML,
            };
        }
    }
}
