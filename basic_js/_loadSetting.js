//#########################################################################################

var _loadSettingFlag = false;

//「setting.js」を読み込む関数
async function _loadSetting(url) {
    url += '?t=' + String(new Date().getTime());    //キャッシュ対策
    if (_loadSettingFlag === true) {
        console.error('【エラー】関数「_loadSetting」の処理を２つ同時に実行しようとしています。');
    }
    _loadSettingFlag = true;
    window.fileToFileTransferVariable = null;
    //
    // JavaScriptファイル「setting.js」を読み込む
    const scriptElement1 = document.createElement('script');
    scriptElement1.classList.add("Do_not_store_in_HTML");
    try {
        if (isDebugTree) console.log("  設定ファイル：" + _getShortUrlToDisplay(url));
        scriptElement1.src = url;
        document.body.appendChild(scriptElement1);
    }
    catch (err) { }
    //
    // JavaScriptファイル「setting.js」が、
    // 配列「window.fileToFileTransferVariable」に代入してくれているはず
    //
    try {
        // JavaScriptファイル「setting.js」の実行が終わるまで待つ
        await waitLoad(scriptElement1);
    }
    catch (err) { }
    //
    const result = window.fileToFileTransferVariable;
    _loadSettingFlag = false;
    window.fileToFileTransferVariable = null;
    if (result) {
        if (isDebugTree) console.log("  読み込み成功");
    }
    else {
        if (isDebugTree) console.log("  設定ファイルが見つかりません");
    }
    return {
        "isLoadSettingSuccess": result ? true : false,
        "title": result?.title ?? "？？",
        "isFullSize": result?.isFullSize ? true : false,
        "isTopbar": result?.isTopbar ? true : false,
        "url": result?.url,
        "baseColor": result?.baseColor ?? {
            red: 255,
            blue: 0,
            green: 0,
        },
        "fontFamily": result?.fontFamily ?? {
            "Hannari": false,
            "Kokoro": false,
            "Nico Moji": false,
            "Nikukyu": false,
            "M PLUS 1p": false,
            "M PLUS Rounded 1c": false,
            "Sawarabi Mincho": false,
            "Sawarabi Gothic": false,
            "Noto Sans JP": true
        },
        "toolList": result?.toolList ?? [],
        "plugins": result?.plugins ?? [],
    };
}