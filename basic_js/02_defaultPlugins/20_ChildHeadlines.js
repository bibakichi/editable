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
    },
    "css": async () => `
        .blog_block {
            text-decoration: none;
            margin: 0 0 6px 0;
            padding: 12px 20px 8px 20px;
            background: #fafafa;
            box-sizing: border-box;
            border: none;
            border-radius: 3px;
            border-bottom: solid 3px #bbb;
            box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .1);
        }

        .blog_block.neumorphism {
            background: none;
            border: none;
            margin: 0 0 6px 0;
            box-shadow: 5px 5px 20px #c8c9cc, -5px -5px 20px #ffffff;
        }

        .blog_block svg {
            width: 50px;
        }

        .blog_block:hover {
            cursor: pointer;
            background: #fff;
            text-decoration: none;
        }

        .blog_block.neumorphism:hover {
            background: #fff;
        }
    `,
}
