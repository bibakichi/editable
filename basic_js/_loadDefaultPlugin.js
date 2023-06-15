//#########################################################################################

// プラグインファイルを読み込む
async function _loadDefaultPlugin(blockType) {
    const plugin = plugins[blockType];
    if (!plugin) {
        if (isDebugPlugin) console.log("  デフォルトプラグインが見つかりません。");
    }
    //
    if (typeof plugin.css === "function") {
        const styleTag = document.createElement('style');
        styleTag.classList.add("Do_not_store_in_HTML");
        try {
            styleTag.innerHTML = await plugin.css();
        }
        catch (err) {
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
            console.error(`プラグイン「${blockType}」の関数「externals.js()」でエラーが発生しました。`);
            console.error(err);
            return plugin;
        }
        for (const url of urlList) {
            const scriptElement = document.createElement('script');
            scriptElement.classList.add("Do_not_store_in_HTML");
            scriptElement.src = url;
            document.body.appendChild(scriptElement);
        }
    }
}
