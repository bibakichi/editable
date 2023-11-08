//#########################################################################################

plugins["ChildHeadlines"] = {
    "isDefault": true,
    "toolbox": {
        "render": async function (saveData) {
            const element = document.createElement('div');
            element.style.padding = "5px";
            element.innerHTML = "子ページの一覧";
            return element;
        },
    },
    "viewer": {
        "renderHeavy": async function (blockId, saveData) {
            const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
            const listElement = document.createElement("div");
            listElement.style.minHeight = "200px";
            listElement.innerHTML = "読み込み中…";
            listElement.id = blockId;
            async function aaa() {
                while (!settings[0]) {
                    await sleep(500);
                }
                listElement.innerHTML = "";
                const childPages = {
                    ...(settings[0]?.childPages ?? {}),
                };
                for (const folderName in childPages) {
                    const pageData = childPages[folderName];
                    if (!pageData) continue;
                    //
                    const aElement = document.createElement("a");
                    listElement.appendChild(aElement);
                    aElement.href = folderName + "/index.html";
                    //
                    const blockElement = document.createElement("div");
                    blockElement.classList.add("blog_block");
                    blockElement.classList.add("neumorphism");
                    aElement.appendChild(blockElement);
                    //
                    const headlineElement = document.createElement("h3");
                    blockElement.appendChild(headlineElement);
                    headlineElement.innerText = pageData?.headline;
                    //
                    const pElement = document.createElement("p");
                    blockElement.appendChild(pElement);
                    pElement.innerText = pageData?.overview;
                }
            }
            aaa();
            return listElement;
        },
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement("div");
            element.id = blockId;
            element.innerHTML = "読み込み中…";
            return element;
        },
        "saveBlock": async function (blockId, pastSaveData) {
            return {};
        }
    }
}
