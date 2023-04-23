//#########################################################################################
plugins["DownloadButton"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement('button');
            element.innerText = 'ダウンロード';
            element.classList.add("buttonFlat");
            element.addEventListener("click", () => {
                allSave(true);
            });
            return element;
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
