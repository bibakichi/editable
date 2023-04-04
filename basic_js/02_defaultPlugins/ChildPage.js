//#########################################################################################
plugins["ChildPage"] = {
    "toolbox": {
        "render": async function (saveData) {
            const buttonElement = document.createElement('label');
            buttonElement.classList.add("button3d");
            buttonElement.innerText = "子ページ";
            return buttonElement;
        },
    },
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const buttonElement = document.createElement('a');
            buttonElement.classList.add("button3d");
            buttonElement.href = "./" + blockId + "/index.html";
            buttonElement.innerText = "子ページ";
            return buttonElement;
        },
        "onAppend": async function (blockId, saveData) {
            _showLoader();
            console.log("b");
            console.log(blockId);
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
            const newSetting = {
                "isFullSize": false,
                "isTopbar": true,
                "title": "新しいページ",
                "fontFamily": settings[0]?.fontFamily ?? {
                    "Hannari": false,
                    "Kokoro": false,
                    "Nico Moji": false,
                    "Nikukyu": false,
                    "M PLUS 1p": false,
                    "M PLUS Rounded 1c": true,
                    "Sawarabi Mincho": false,
                    "Sawarabi Gothic": false,
                    "Noto Sans JP": true
                },
                "toolList": [],
                "plugins": [],
            };
            if (uri.hostname === "8mo.nl") {
                //  以下のURLにアクセスがあった場合
                //    https://8mo.nl/【ストレージID】/【パス】
                const storageId = pathList.shift();
                await saveCloud({
                    storageId,
                    filePath: pathList.join("/"),
                    htmlCode,
                    setting: newSetting,
                });
            }
            else if (uri.hostname.endsWith(".8mo.nl")) {
                //  以下のURLにアクセスがあった場合
                //    https://【パス】.8mo.nl/【ストレージID】/
                await saveCloud({
                    storageId: uri.hostname.split('.')[0],
                    filePath: pathList.join("/"),
                    htmlCode,
                    setting: newSetting,
                });
            }
            else {
                await downloadZip(htmlCode);
            }
            _deleteLoader();
        }
    }
}
