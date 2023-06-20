
//#########################################################################################
async function allSave(isDownload) {
    _showLoader();
    //
    // 子ページへ繋がるリンクを復元
    for (const linkId in relativeLinks) {
        const linkElement = relativeLinks[linkId];
        if (!linkElement) continue;
        const buttonElement = document.getElementById(linkId);
        if (!buttonElement) continue;
        buttonElement.replaceWith(linkElement);
    }
    //
    const toolListInner = document.getElementById("toolList");
    const toolBoxJsonDataList = [];
    //
    // 一番最後の要素は「もっと見る」なので、最後から１個手前まで繰り返す
    const toolListInnerChildren = toolListInner.querySelectorAll(":scope>*");
    for (let i = 0; i < toolListInnerChildren.length - 1; i++) {
        const jsonElement = toolListInnerChildren[i].querySelector('.json');
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
    for (const sortableItem of pastMainContents.querySelectorAll(":scope>*")) {
        if (sortableItem.classList.contains("skip")) {
            newMainContents.appendChild(sortableItem);
            continue;
        }
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
    const externalFiles = [
        ...document.querySelectorAll("head>style:not(.Do_not_store_in_HTML)"),
        ...document.querySelectorAll("head>script:not(.Do_not_store_in_HTML)"),
    ];
    console.log(externalFiles);
    let externalFilesText = '';
    for (const externalFile of externalFiles) {
        externalFilesText += "\n        " + externalFile.outerHTML;
    }
    //
    let basicJsPath = document.getElementById("basic_js").getAttribute('src');
    const latestVersion = 4;
    if (basicJsPath.indexOf(`basic${latestVersion - 1}.js`) != -1) {
        if (confirm(`保存の際、バージョン${latestVersion - 1}から${latestVersion}へアップグレードしますか？`)) {
            basicJsPath = basicJsPath.replaceAll(`basic${latestVersion - 1}.js`, `basic${latestVersion}.js`);
            console.log(basicJsPath);
        }
    }
    //
    const SelectStyle = getComputedStyle(document.querySelector(':root'));
    //
    const htmlCode = _generateHTML({
        title: settings[0]?.title ?? "",
        mainContents: myInnerHTML(newMainContents),
        basicJsPath: basicJsPath,
        jsZipPath: document.getElementById("jszip").getAttribute('src'),
        isFullSize: settings[0]?.isFullSize,
        faviconsFolderPath: 'https://mono-file.s3.ap-northeast-1.amazonaws.com/favicons/',
        externalFiles: externalFilesText,
        baseColor: String(SelectStyle.getPropertyValue('--base-color') ?? "#8d0000"),
        baseColorDark: String(SelectStyle.getPropertyValue('--base-color-dark') ?? "#600000"),
        contrastColor: String(SelectStyle.getPropertyValue('--contrast-color') ?? "#555"),
        contrastColor2: String(SelectStyle.getPropertyValue('--contrast-color2') ?? "#fff"),
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
        innerHTML += "\n                        " + sortableItem.outerHTML;
    }
    return innerHTML;
}