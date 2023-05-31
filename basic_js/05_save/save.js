
//#########################################################################################
async function allSave(isDownload) {
    _showLoader();
    const toolListInner = document.getElementById("toolList");
    const toolBoxJsonDataList = [];
    //
    // 一番最後の要素は「もっと見る」なので、最後から１個手前まで繰り返す
    for (let i = 0; i < toolListInner.children.length - 1; i++) {
        const jsonElement = toolListInner.children[i].querySelector('.json');
        if (!jsonElement) {
            continue;
        }
        const jsonData = JSON.parse(jsonElement.textContent);
        toolBoxJsonDataList.push(jsonData);
    }
    settings[0].toolList = toolBoxJsonDataList;
    //
    const pastMainContents = document.getElementById('main_contents');
    const newMainContents = document.createElement('main');
    console.log(pastMainContents);
    for (const sortableItem of pastMainContents.getElementsByTagName("*")) {
        console.log(sortableItem);
        if (sortableItem.classList.contains("dropOnly")) continue;
        const newSaveData = await _saveBlock(sortableItem);
        if (!newSaveData) {
            newMainContents.appendChild(sortableItem);
            continue;
        }
        const newOuterElement = await _renderLight(sortableItem.id, newSaveData);
        if (newOuterElement) {
            try {
                newMainContents.appendChild(newOuterElement);
            }
            catch (e) { }
        }
        else {
            newMainContents.appendChild(sortableItem);
        }
    }
    //
    const htmlCode = _generateHTML({
        title: settings[0]?.title ?? "",
        mainContents: myInnerHTML(newMainContents),
        basicJsPath: document.getElementById("basic_js").getAttribute('src'),
        jsZipPath: document.getElementById("jszip").getAttribute('src'),
        isFullSize: settings[0]?.isFullSize,
        faviconsFolderPath: 'https://mono-file.s3.ap-northeast-1.amazonaws.com/favicons/',
    });

    const uri = new URL(window.location.href);
    let pathName = window.location.pathname;
    if (!pathName || pathName.endsWith("/")) {
        pathName += "index.html";
    }
    const pathList = pathName.split("/");
    pathList.pop();
    if ((isDownload !== true) && (uri.hostname === "8mo.nl")) {
        //  以下のURLにアクセスがあった場合
        //    https://8mo.nl/【ストレージID】/【パス】
        const storageId = pathList.shift();
        await saveCloud({
            storageId,
            folderPath: pathList.join("/"),
            htmlCode,
            setting: settings[0],
        });
        //
        // 「このサイトを離れますか？」を無効にする
        window.onbeforeunload = null;
        isEnableLeaveCheck = false;
        //
        // ページを再読み込み
        window.location.reload();
    }
    else if ((isDownload !== true) && (uri.hostname.endsWith(".8mo.nl"))) {
        //  以下のURLにアクセスがあった場合
        //    https://【パス】.8mo.nl/【ストレージID】/
        await saveCloud({
            storageId: uri.hostname.split('.')[0],
            folderPath: pathList.join("/"),
            htmlCode,
            setting: settings[0],
        });
        //
        // 「このサイトを離れますか？」を無効にする
        window.onbeforeunload = null;
        isEnableLeaveCheck = false;
        //
        // ページを再読み込み
        window.location.reload();
    }
    else {
        await downloadZip(htmlCode);
        _deleteLoader();
    }
}

function myInnerHTML(mainContents) {
    let innerHTML = "";
    for (const sortableItem of mainContents.children) {
        innerHTML += "                        " + sortableItem.outerHTML + "\n";
    }
    return innerHTML;
}