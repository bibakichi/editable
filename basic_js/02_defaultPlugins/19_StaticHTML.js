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
            iframeElement.style.border = "none";
            iframeElement.style.transformOrigin = "0 0";
            iframeElement.style.transform = "scale(0.5)";
            iframeElement.src = `data:text/html,<!DOCTYPE html>
                <html lang="ja">
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                    </head>
                    <body>${(saveData?.html) ?? ""}</body>
                </html>`;
            return iframeElement;
        },
    },
    "viewer": {
        "renderHeavy": async function (blockId, saveData) {
            const element = document.createElement("div");
            element.innerHTML = (saveData?.html) ?? "";
            const element2 = _getStaticHTML(element);
            element2.id = blockId;
            element2.classList.add("full_width");
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
            const element = document.createElement("div");
            element.innerHTML = (saveData?.html) ?? "";
            const element2 = _getStaticHTML(element);
            element2.classList.add("full_width");
            return element2;
        },
    }
}
