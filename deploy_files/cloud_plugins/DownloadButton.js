//#########################################################################################
plugins["DownloadButton"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const divElement = document.createElement("div");
            divElement.style.background = "#555";
            divElement.style.height = "300px";
            divElement.style.color = "#f00";
            divElement.innerHTML = "このブロックは配置できません";
            divElement.id = blockId;
            return divElement;
        },
    },
    "toolbox": {
        "render": async function (saveData) {
            const element = document.createElement('button');
            element.innerText = 'ダウンロード';
            element.classList.add("buttonFlat");
            element.addEventListener("click", () => {
                allSave(true);
            });
            return element;
        },
    },
}
