//#########################################################################################

function _getStaticHTML(element) {
    const children = element.querySelectorAll(":scope>*");
    if (children.length == 0) return element;
    if (children.length >= 2) return element;
    if (
        (children[0].tagName == "DIV") &&
        (children[0].classList.keys.length == 0) &&
        (!children[0].id) &&
        (children[0].style.length == 0)
    ) {
        // もし一番外側（elements[0]）が、ただの「div」だったら;
        return _getStaticHTML(children[0]);
    }
    return element;
}

plugins["StaticHTML"] = {
    "isDefault": true,
    "toolbox": {
        "render": async function (saveData) {
            const iframeElement = document.createElement('iframe');
            iframeElement.style.pointerEvents = "none";
            iframeElement.src = "data:text/html," + ((saveData?.html) ?? "");
            return iframeElement;
        },
    },
    "viewer": {
        "renderHeavy": async function (blockId, saveData) {
            const element = document.createElement("div");
            if (!saveData?.html) {
                element.id = blockId;
                return element;
            }
            element.innerHTML = saveData.html;
            const element2 = _getStaticHTML(element);
            element2.id = blockId;
            return element2;
        },
        "changeEditMode": async function (blockId, saveData) {

        },
        "saveBlock": async function (blockId, pastSaveData) {
            const element = document.getElementById(blockId);
            return {
                html: element.innerHTML,
            };
        },
        "renderLight": async function (blockId, saveData) {
            if (!saveData?.html) {
                return document.createElement("p");
            }
            const element = document.createElement("div");
            element.innerHTML = saveData.html;
            return _getStaticHTML(element);
        },
    }
}
