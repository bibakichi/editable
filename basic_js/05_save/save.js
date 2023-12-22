
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
        console.log("c");
        if (sortableItem.children.length > 0) {
            console.log("a");
            if (sortableItem.children[0].classList.contains("full_width")) {
                console.log("b");
                sortableItem.classList.add("full_width");
            }
        }
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
        ...document.querySelectorAll("head>link:not(.Do_not_store_in_HTML)"),
        ...document.querySelectorAll("head>style:not(.Do_not_store_in_HTML)"),
        ...document.querySelectorAll("head>script:not(.Do_not_store_in_HTML)"),
    ];
    let externalFilesText = '';
    for (const externalFile of externalFiles) {
        const externalFileSrc = externalFile.getAttribute("src");
        if (externalFileSrc && (typeof externalFileSrc == "string")) {
            let url;
            try {
                url = new URL(externalFileSrc, window.location.href);
            }
            catch (err) {
                alert(`無効なURLです。${externalFileSrc}`);
                return;
            }
            if (externalFileSrc.indexOf("katex") != -1) continue;
            if (url.hostname == "mono-editable.s3.ap-northeast-1.amazonaws.com") continue;
            if (url.hostname == "cdn.quilljs.com") continue;
        }
        externalFilesText += "\n        " + externalFile.outerHTML;
    }
    //
    let basicJsPath = document.getElementById("basic_js").getAttribute('src');
    const latestVersion = 5;
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
        externalFiles: externalFilesText,
        baseColor: String(SelectStyle.getPropertyValue('--base-color') ?? "#8d0000"),
        baseColorDark: String(SelectStyle.getPropertyValue('--base-color-dark') ?? "#600000"),
        contrastColor: String(SelectStyle.getPropertyValue('--contrast-color') ?? "#555"),
        contrastColor2: String(SelectStyle.getPropertyValue('--contrast-color2') ?? "#fff"),
        officeName: settings[0]?.officeName ?? '福岡大学ものづくりセンター',
        phoneNumber: settings[0]?.phoneNumber ?? '092-871-6631',
        extensionNumber: settings[0]?.extensionNumber ?? '6935',
        website: settings[0]?.website ?? 'http://www.tec.fukuoka-u.ac.jp/mono/',
        mapUrl: settings[0]?.mapUrl ?? 'https://goo.gl/maps/qD7ZYrmeWpW7uNgSA',
        address: settings[0]?.address ?? '〒814-018 福岡市城南区七隈8-19-1 福岡大学 4号館 1F',
    });
    //
    // もし親ページの「setting.js」が存在したら
    if (settings[1]) {
        //
        // ニュース記事の見出しを生成する
        const headline = settings[0]?.headline ?? "";
        //
        // ニュース記事の概要文を生成する
        //
        // 要素をディープコピーする
        const contents = newMainContents.cloneNode(true);
        // 'json'クラスを持つすべての子要素を取得
        var jsonElements = contents.querySelectorAll('.json');
        // 取得した子要素のリストをループで回して、それぞれをDOMから削除
        jsonElements.forEach(function (element) {
            element.parentNode.removeChild(element);
        });
        // 'do_not_overview'クラスを持つすべての子要素を取得
        var dateElements = contents.querySelectorAll('.do_not_overview');
        // 取得した子要素のリストをループで回して、それぞれをDOMから削除
        dateElements.forEach(function (element) {
            element.parentNode.removeChild(element);
        });
        // `innerText`を使用する場合（CSSスタイリングを考慮した「見える」テキストのみを取得する）
        let overview = contents.innerText;
        overview = overview.replace(/\s+/g, ' ');   // 空白文字を置き換え
        if (headline) {
            overview = overview.replaceAll(headline, "");
        }
        if (overview.length > 50) {
            // 最初の50文字だけ切り取る
            overview = overview.substring(0, 50);
        }
        //
        // 親ページに、ニュース記事の概要を教える
        settings[1] = {
            ...settings[1],
            "childPages": {
                ...(settings[1].childPages ?? {}),
                // "子ページのフォルダ名": {
                //     "headline": "ニュース記事の見出し",
                //     "overview": "ニュース記事の概要",
                // },
                [_getFolderName()]: {
                    "thumbnailUrl": settings[0]?.thumbnailUrl,
                    "headline": headline,
                    "overview": overview,
                    "date": settings[0]?.date,
                },
            },
        };
        console.log(settings[1]);
    }
    //
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