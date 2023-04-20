//#########################################################################################
plugins["Image"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const outerElement = document.createElement('div');
            outerElement.id = blockId;
            outerElement.style.position = "relative";
            outerElement.style.minHeight = "100px";
            outerElement.style.width = "100%";
            //
            const urlElement = document.createElement('pre');
            urlElement.id = "url_" + blockId;
            urlElement.innerText = saveData?.src ?? "";
            urlElement.style.display = "none";
            outerElement.appendChild(urlElement);
            //
            if (saveData?.height) {
                const imageElement = document.createElement('div');
                imageElement.id = "image_" + blockId;
                imageElement.style.width = "100%";
                imageElement.style.paddingTop = saveData?.height;
                imageElement.style.backgroundImage = `url(${saveData?.src})`;
                imageElement.style.backgroundPosition = "center center";
                imageElement.style.backgroundSize = "cover";
                imageElement.style.backgroundRepeat = "no-repeat";
                outerElement.appendChild(imageElement);
            }
            else {
                const imageElement = document.createElement('img');
                imageElement.id = "image_" + blockId;
                imageElement.style.width = "100%";
                imageElement.src = saveData?.src ?? "";
                outerElement.appendChild(imageElement);
            }
            //
            return outerElement;
        },
        "changeEditMode": async function (blockId) {
            const outerElement = document.getElementById(blockId);
            const imageElement = document.getElementById("image_" + blockId);
            //
            const overflowElement = document.createElement('div');
            overflowElement.style.position = "absolute";
            overflowElement.style.top = 0;
            overflowElement.style.left = 0;
            overflowElement.style.width = "100%";
            overflowElement.style.height = "100%";
            overflowElement.style.background = "rgba(200,200,200,0.9)";
            outerElement.appendChild(overflowElement);
            //
            const divElement1 = document.createElement('div');
            overflowElement.appendChild(divElement1);
            //
            const labelElement1 = document.createElement('span');
            labelElement1.innerText = "URL";
            divElement1.appendChild(labelElement1);
            //
            const inputElement1 = document.createElement('input');
            inputElement1.value = imageElement.src ?? "_";
            divElement1.appendChild(inputElement1);
            inputElement1.addEventListener("focusout", () => {
                imageElement.src = inputElement1.value;
                const urlElement = document.getElementById("url_" + blockId);
                urlElement.innerText = inputElement1.value;
            });
            //
            const divElement2 = document.createElement('div');
            overflowElement.appendChild(divElement2);
            //
            const labelElement2 = document.createElement('span');
            labelElement2.innerText = "高さ";
            divElement2.appendChild(labelElement2);
            //
            const inputElement2 = document.createElement('input');
            inputElement2.value = imageElement.style.height ?? "";
            divElement2.appendChild(inputElement2);
            inputElement2.addEventListener("input", () => {
                const height = inputElement2.value;
                const pastImageElement = document.getElementById("image_" + blockId);
                const urlElement = document.getElementById("url_" + blockId);
                if (height) {
                    const newImageElement = document.createElement('div');
                    newImageElement.id = "image_" + blockId;
                    newImageElement.style.width = "100%";
                    newImageElement.style.paddingTop = height;
                    newImageElement.style.backgroundImage = `url(${urlElement.innerText})`;
                    newImageElement.style.backgroundPosition = "center center";
                    newImageElement.style.backgroundSize = "cover";
                    newImageElement.style.backgroundRepeat = "no-repeat";
                    pastImageElement.replaceWith(newImageElement);
                }
                else {
                    const newImageElement = document.createElement('img');
                    newImageElement.id = "image_" + blockId;
                    newImageElement.style.width = "100%";
                    newImageElement.src = urlElement.innerText;
                    pastImageElement.replaceWith(newImageElement);
                }
            });
        },
        "saveBlock": async function (blockId, pastSaveData) {
            const imageElement = document.getElementById("image_" + blockId);
            const urlElement = document.getElementById("url_" + blockId);
            return {
                src: urlElement.innerText,
                height: imageElement.style.paddingTop,
            };
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
