//#########################################################################################

function rendarStaticHTML({ blockId, saveData }) {
    let outerElement = document.createElement("div");
    outerElement.id = blockId;
    if (!saveData?.html) return outerElement;
    outerElement.innerHTML = saveData.html;
    while (true) {
        const elements = outerElement.querySelectorAll(":scope>*");
        if (elements.length == 0) return outerElement;
        if (elements.length >= 2) return outerElement;
        if (
            (elements[0].tagName == "DIV") &&
            (elements[0].classList.keys.length == 0) &&
            (!elements[0].id) &&
            (elements[0].style.length == 0)
        ) {
            // もし一番外側（elements[0]）が、ただの「div」だったら
            elements[0].id = blockId;
            outerElement = elements[0];
        }
        else {
            return outerElement;
        }
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
