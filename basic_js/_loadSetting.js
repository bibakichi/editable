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
        "date": result?.date ?? "",
        "isLoadSettingSuccess": result ? true : false,
        "title": result?.title ?? "？？",   // 画面上部に掲載するタイトル
        "headline": result?.title ?? (result?.title ?? "？？"),   // 親ページに掲載する見出し
        "headlineBlockId": result?.headlineBlockId ?? null,   // 見出しと連動している要素のID
        "isFullSize": result?.isFullSize ? true : false,
        "isTopbar": result?.isTopbar ? true : false,
        "url": result?.url,
        "fontFamily": {
            "Hannari": false,
            "Kokoro": false,
            "Nico Moji": false,
            "Nikukyu": false,
            "M PLUS 1p": false,
            "M PLUS Rounded 1c": false,
            "Sawarabi Mincho": false,
            "Sawarabi Gothic": false,
            "Noto Sans JP": true,
            ...(result?.fontFamily ?? {}),
        },
        "toolList": [
            ...(result?.toolList ?? []),
        ],
        "plugins": [
            ...(result?.plugins ?? []),
        ],
        "officeName": result?.officeName ?? '福岡大学ものづくりセンター',
        "phoneNumber": result?.phoneNumber ?? '092-871-6631',
        "extensionNumber": result?.extensionNumber ?? '',
        "website": result?.website ?? 'http://www.tec.fukuoka-u.ac.jp/mono/',
        "mapUrl": result?.mapUrl ?? 'https://goo.gl/maps/qD7ZYrmeWpW7uNgSA',
        "address": result?.address ?? '〒814-018 福岡市城南区七隈8-19-1 福岡大学 4号館 1F',
        "childPages": {
            // "子ページのフォルダ名": {
            //     "headline": "ニュース記事の見出し",
            //     "overview": "ニュース記事の概要",
            // },
            ...(result?.childPages ?? {}),
        },
        "iconHTML": result?.iconHTML,
    };
}