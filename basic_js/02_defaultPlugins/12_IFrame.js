//#########################################################################################
plugins["IFrame"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const outerElement = document.createElement('div');
            outerElement.id = blockId;
            outerElement.style.width = "100%";
            //
            const iframeElement = document.createElement('iframe');
            iframeElement.style.border = "none";
            iframeElement.style.margin = 0;
            iframeElement.style.padding = 0;
            iframeElement.style.width = "100%";
            iframeElement.style.height = saveData?.height ?? "1000px";
            iframeElement.src = saveData?.url ?? "https://docs.google.com/forms/d/e/1FAIpQLSfbK4debgfo9LMG5HzPY8E0H1RoJX7rFdR2NhtFf3zSmFEZvg/viewform?embedded=true";
            outerElement.appendChild(iframeElement);
            //
            return outerElement;
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
