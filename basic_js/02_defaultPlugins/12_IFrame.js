//#########################################################################################
plugins["IFrame"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const outerElement = document.createElement('div');
            outerElement.id = blockId;
            outerElement.style.position = "relative";
            outerElement.style.width = "100%";
            //
            const iframeElement = document.createElement('iframe');
            iframeElement.id = "iframe_" + blockId;
            iframeElement.style.border = "none";
            iframeElement.style.margin = 0;
            iframeElement.style.padding = 0;
            iframeElement.style.overflowY = "auto";
            iframeElement.style.width = "100%";
            iframeElement.style.height = saveData?.height ?? "1000px";
            iframeElement.style.minHeight = "200px";
            iframeElement.src = saveData?.url ?? "https://docs.google.com/forms/d/e/1FAIpQLSfbK4debgfo9LMG5HzPY8E0H1RoJX7rFdR2NhtFf3zSmFEZvg/viewform?embedded=true";
            outerElement.appendChild(iframeElement);
            //
            return outerElement;
        },
        "changeEditMode": async function (blockId) {
            const outerElement = document.getElementById(blockId);
            const iframeElement = document.getElementById("iframe_" + blockId);
            //
            const overflowElement = document.createElement('div');
            overflowElement.style.position = "absolute";
            overflowElement.style.top = 0;
            overflowElement.style.left = 0;
            overflowElement.style.width = "100%";
            overflowElement.style.height = "100%";
            overflowElement.style.background = "rgba(255,255,255,0.8)";
            outerElement.appendChild(overflowElement);
            //
            const titleElement = document.createElement('h2');
            titleElement.innerText = "埋め込まれたwebページ";
            titleElement.style.textAlign = "center";
            titleElement.style.margin = "50px 0";
            overflowElement.appendChild(titleElement);
            //
            const divElement1 = document.createElement('div');
            overflowElement.appendChild(divElement1);
            //
            const labelElement1 = document.createElement('span');
            labelElement1.innerText = "URL";
            divElement1.appendChild(labelElement1);
            //
            const inputElement1 = document.createElement('input');
            inputElement1.value = iframeElement.src ?? "_";
            divElement1.appendChild(inputElement1);
            inputElement1.addEventListener("focusout", () => {
                iframeElement.src = inputElement1.value;
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
            inputElement2.value = iframeElement.height ?? "1000px";
            divElement2.appendChild(inputElement2);
            inputElement2.addEventListener("input", () => {
                const num = Number(inputElement1.value);
                if (num > 0) {
                    iframeElement.height = String(num) + "px";
                }
                else {
                    iframeElement.height = "1000px";
                }
            });
        },
        "saveBlock": async function (blockId, pastSaveData) {
            const iframeElement = document.getElementById("iframe_" + blockId);
            return {
                url: iframeElement.src,
                height: iframeElement.style.height ?? "1000px",
            };
        },
    },
    "toolbox": {
        "render": async function (saveData) {
            const toolboxElement = document.createElement('p');
            toolboxElement.innerText = 'webページを埋め込む';
            return toolboxElement;
        },
    },
}
