//#########################################################################################
plugins["ChildPage"] = {
    "toolbox": {
        "render": async function (saveData) {
            const toolboxElement = document.createElement('h3');
            toolboxElement.innerText = "子ページ";
            return toolboxElement;
        },
    },
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement('h3');
            element.id = blockId;
            element.innerText = saveData.text ?? "子ページ";
            return element;
        },
        "onAppend": async function (blockId, saveData) {
            const htmlCode = _generateHTML({
                title: "新しいページ",
                mainContents: "",
                basicCssPath: document.getElementById("basic_css").getAttribute('href'),
                basicJsPath: document.getElementById("basic_js").getAttribute('src'),
                jsZipPath: document.getElementById("jszip").getAttribute('src'),
                isFullSize: false,
                faviconsFolderPath: 'https://mono-file.s3.ap-northeast-1.amazonaws.com/favicons/',
            });

            const uri = new URL(window.location.href);
            console.log(uri.hostname);
            let pathName = window.location.pathname;
            if (!pathName || pathName.endsWith("/")) {
                pathName += "index.html";
            }
            const pathList = pathName.split("/");
            pathList.pop();
            pathList.push(blockId);
            pathList.push("index.html");
            if (uri.hostname === "8mo.nl") {
                //  以下のURLにアクセスがあった場合
                //    https://8mo.nl/【ストレージID】/【パス】
                const storageId = pathList.shift();
                await saveCloud({
                    storageId,
                    filePath: pathList.join("/"),
                    htmlCode
                });
            }
            else if (uri.hostname.endsWith(".8mo.nl")) {
                //  以下のURLにアクセスがあった場合
                //    https://【パス】.8mo.nl/【ストレージID】/
                await saveCloud({
                    storageId: uri.hostname.split('.')[0],
                    filePath: pathList.join("/"),
                    htmlCode
                });
            }
            else {
                await downloadZip(htmlCode);
            }
        }
    }
}
