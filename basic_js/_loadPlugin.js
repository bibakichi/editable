//#########################################################################################

var loadingPlugins = {};

// プラグインファイルを読み込む
async function _loadPlugin(blockType) {
    const plugin = plugins[blockType];
    if (plugin) {
        if (isDebugPlugin) console.log("  既にプラグインは読み込み済みです。");
        return plugin;
    }
    const url = './plugins/' + blockType + '.js?t=' + String(new Date().getTime());    //キャッシュ対策
    if (loadingPlugins[blockType] === true) {
        alert(`【エラー】プラグインファイル「${blockType}」を２つ同時に読み込もうとしています。`);
    }
    loadingPlugins[blockType] = true;
    //
    // JavaScriptファイルを読み込む
    const scriptElement = document.createElement('script');
    try {
        if (isDebugPlugin) console.log("  プラグインファイル：" + _getShortUrlToDisplay(url));
        scriptElement.src = url;
        document.body.appendChild(scriptElement);
    }
    catch (err) {
        alert(`プラグインファイル「${blockType}.js」を読み込めません`);
        console.error("  プラグインファイルを読み込めません");
        console.error(err);
        return null;
    }
    //
    try {
        // JavaScriptファイルのロードが終わるまで待つ
        await waitLoad(scriptElement);
    }
    catch (err) { }
    //
    loadingPlugins[blockType] = false;
    //
    if (plugin) {
        if (isDebugPlugin) console.log("  プラグイン読み込み成功");
    }
    else {
        console.error("  プラグインファイルが見つかりません");
        return null;
    }
    if (typeof plugin.css === "function") {
        const styleTag = document.createElement('style');
        try {
            styleTag.innerHTML = await plugin.css();
        }
        catch (err) {
            alert(`プラグイン「${blockType}」の関数「css()」でエラーが発生しました。`);
            console.error(`プラグイン「${blockType}」の関数「css()」でエラーが発生しました。`);
            console.error(err);
            return plugin;
        }
        // 作成したstyleタグを挿入
        document.getElementsByTagName('head')[0].insertAdjacentElement('beforeend', styleTag);
    }
    if (typeof plugin?.externals?.css === "function") {
        let urlList = [];
        try {
            urlList = await plugin.externals.css();
        }
        catch (err) {
            alert(`プラグイン「${blockType}」の関数「externals.css()」でエラーが発生しました。`);
            console.error(`プラグイン「${blockType}」の関数「externals.css()」でエラーが発生しました。`);
            console.error(err);
            return plugin;
        }
        for (const url of urlList) {
            const styleTag = document.createElement('link');
            styleTag.rel = "stylesheet";
            styleTag.href = url;
            // 作成したstyleタグを挿入
            document.getElementsByTagName('head')[0].insertAdjacentElement('beforeend', styleTag);
        }
    }
    if (typeof plugin?.externals?.js === "function") {
        let urlList = [];
        try {
            urlList = await plugin.externals.js();
        }
        catch (err) {
            alert(`プラグイン「${blockType}」の関数「externals.js()」でエラーが発生しました。`);
            console.error(`プラグイン「${blockType}」の関数「externals.js()」でエラーが発生しました。`);
            console.error(err);
            return plugin;
        }
        for (const url of urlList) {
            const scriptElement = document.createElement('script');
            scriptElement.src = url;
            document.body.appendChild(scriptElement);
        }
    }
    return plugin;
}
