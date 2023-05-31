//#########################################################################################
plugins["ChildPage"] = {
    "isDefault": true,
    "toolbox": {
        "render": async function (saveData) {
            const buttonElement = document.createElement('label');
            buttonElement.classList.add("button3d");
            buttonElement.innerText = saveData?.text ?? "子ページ";
            return buttonElement;
        },
    },
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const buttonElement = document.createElement('a');
            buttonElement.id = blockId;
            buttonElement.classList.add("button3d");
            buttonElement.href = "./" + saveData?.folderId + "/index.html";
            buttonElement.innerText = saveData?.text ?? "子ページ";
            return buttonElement;
        },
        "changeEditMode": async function (blockId, saveData) {
            const pastElement = document.getElementById(blockId);
            const newElement = document.createElement('label');
            pastElement.replaceWith(newElement);
            newElement.classList.add("button3d");
            newElement.id = blockId;
            newElement.innerText = saveData?.text ?? "子ページ";
            newElement.addEventListener('paste', (e) => {
                // ペースト時にプレーンテキストのみにする
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain");
                const sentence = newElement.innerHTML;
                const sel = window.getSelection();
                const pos = sel.anchorOffset;
                const before = sentence.substring(0, pos);
                const after = sentence.substring(pos, pos + sentence.length);
                newElement.innerHTML = before + text + after;
            });
            newElement.addEventListener('click', (event) => {
                //
                // この１文がなかったら、
                // 編集中のテキストの先頭をクリックすると、カーソルが自動的に最後まで移動してしまう
                if (newElement.isContentEditable) return;
                //
                newElement.contentEditable = true;
                newElement.focus();
                // １文字以上の場合
                if (newElement.childNodes.length > 0) {
                    // カーソル位置を最後にもっていく
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.setStart(newElement.childNodes[0], newElement.innerText.length);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });
            newElement.addEventListener('focusout', (event) => {
                newElement.contentEditable = false;
            });
        },
        "saveBlock": async function (blockId, pastSaveData) {
            const element = document.getElementById(blockId);
            return {
                text: element.textContent,
                folderId: pastSaveData?.folderId,
            };
        },
        "onAppend": async function (blockId, jsonData) {
            _showLoader();
            const folderId = uuid().substring(0, 6);
            const htmlCode = _generateHTML({
                title: "新しいページ",
                mainContents: "",
                basicJsPath: document.getElementById("basic_js").getAttribute('src'),
                jsZipPath: document.getElementById("jszip").getAttribute('src'),
                isFullSize: false,
                faviconsFolderPath: 'https://mono-file.s3.ap-northeast-1.amazonaws.com/favicons/',
                externalFiles: '',
            });

            const uri = new URL(window.location.href);
            let pathName = window.location.pathname;
            if (!pathName || pathName.endsWith("/")) {
                pathName += "index.html";
            }
            const pathList = pathName.split("/");
            pathList.pop();
            pathList.push(folderId);
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
                    folderPath: pathList.join("/"),
                    htmlCode,
                    setting: newSetting,
                });
            }
            else if (uri.hostname.endsWith(".8mo.nl")) {
                //  以下のURLにアクセスがあった場合
                //    https://【パス】.8mo.nl/【ストレージID】/
                await saveCloud({
                    storageId: uri.hostname.split('.')[0],
                    folderPath: pathList.join("/"),
                    htmlCode,
                    setting: newSetting,
                });
            }
            else {
                await downloadZip(htmlCode);
            }
            _deleteLoader();
            return {
                text: "新しいページ",
                folderId: folderId,
            };
        }
    }
}
