//#########################################################################################
async function downloadZip(htmlCode) {
    if (typeof JSZip === "undefined") {
        console.log("  JSZipファイルが見つかりません");
    }
    const zip = new JSZip();
    //
    //
    const setting = settings[0];
    const manifestData = {
        "lang": "ja",
        "name": setting.title,
        "short_name": setting.title,
        "display": "standalone",
        "theme_color": "var(--base-color)"
    };
    let filePath = _getPath();
    //
    // ファイル名として使える文字列に置き換える
    filePath = filePath.replace(/[\\/:*?"<>|\x00-\x1F\x80-\x9F]|\.$|^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9]|(.*[\s.]+$))$/gi, '');
    //
    zip.file(filePath + ".txt", "このファイルは消して構いません。webページの見た目に、一切影響を及ぼしません。");
    zip.file("index.html", htmlCode);
    zip.file("setting.js", "window.fileToFileTransferVariable = " + JSON.stringify(setting, null, 2) + ";");
    zip.file("manifest.json", JSON.stringify(manifestData, null, 2));
    for (const pluginName in plugins) {
        const plugin = plugins[pluginName];
        if (plugin.isDefault) continue;
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
        fileName: (settings[0]?.title + "_" + (filePath ?? "")) + ".zip",
        mimeType: "octet/stream",
        content: content,
    });
}
