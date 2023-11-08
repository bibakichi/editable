//#########################################################################################

plugins["ChildHeadlines"] = {
    "isDefault": true,
    "toolbox": {
        "render": async function (saveData) {
            const element = document.createElement('div');
            element.id = blockId;
            element.style.padding = "5px";
            element.innerHTML = "子ページの一覧";
            return element;
        },
    },
    "viewer": {
        "renderHeavy": async function (blockId, saveData) {
            const listElement = document.createElement("div");
            listElement.style.minHeight = "200px";
            listElement.id = blockId;
            const childPages = {
                ...(settings?.childPages ?? {}),
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
            return listElement;
        },
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement("div");
            element.id = blockId;
            element.innerHTML = "読み込み中…";
            return element;
        },
    }
}
