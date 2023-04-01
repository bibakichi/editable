//#########################################################################################
async function allSave() {
    /*
    const uri = new URL(window.location.href);
    console.log(uri.hostname);
    let pathName = window.location.pathname;
    if (!pathName || pathName.endsWith("/")) {
        pathName += "index.html";
    }
    if (uri.hostname === "8mo.nl") {
        //  以下のURLにアクセスがあった場合
        //    https://8mo.nl/【ストレージID】/【パス】
        return pathName;
    }
    else if (uri.hostname.endsWith(".8mo.nl")) {
    }
    */
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
    for (const sortableItem of pastMainContents.children) {
        if (sortableItem.classList.contains("dropOnly")) continue;
        const { newOuterElement, newSaveData } = await _saveBlock(sortableItem);
        if (!newOuterElement || !newSaveData) continue;
        newMainContents.appendChild(newOuterElement);
        console.log(newSaveData);
    }
    //
    const htmlCode = _generateHTML({
        title: settings[0]?.title ?? "",
        mainContents: newMainContents.innerHTML,
        basicCssPath: document.getElementById("basic_css").getAttribute('href'),
        basicJsPath: document.getElementById("basic_js").getAttribute('src'),
        jsZipPath: document.getElementById("jszip").getAttribute('src'),
        isFullSize: settings[0]?.isFullSize,
        faviconsFolderPath: 'https://mono-file.s3.ap-northeast-1.amazonaws.com/favicons/',
    });
    //
    if (typeof JSZip === "undefined") {
        console.log("  JSZipファイルが見つかりません");
    }
    const zip = new JSZip();
    //
    zip.file("index.html", htmlCode);
    zip.file("setting.js", "window.fileToFileTransferVariable = " + JSON.stringify(settings[0]) + ";");
    for (const pluginName in plugins) {
        const plugin = plugins[pluginName];
        const str = _convertPluginToString({ pluginName, plugin });
        zip.file("plugins/" + pluginName + ".js", str);
    }
    //
    const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
            /* compression level ranges from 1 (best speed) to 9 (best compression) */
            level: 9
        },
    });
    await downloadFile({
        fileName: (_getPath() ?? "web") + ".zip",
        mimeType: "octet/stream",
        content: content,
    });
}
