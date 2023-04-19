
document.addEventListener('DOMContentLoaded', async function () {
    // URLからcloudFrontの認証情報を消す
    const params = new URLSearchParams(window.location.search);
    if (params.get("login_iframe")) {
        await loadMicrosoftProfile();
        document.body.innerHTML = "<h2>ログインしました</h2>";
        return;
    }
    params.delete("Expires");
    params.delete("Signature");
    params.delete("Key-Pair-Id");
    const nextUri = window.location.pathname.replaceAll(".login", "") +
        '?' + params.toString() +
        window.location.hash;
    window.history.replaceState('', '', nextUri);
    //
    initMainContents(); // メインコンテンツを表示
    initEditSwitch();   // 編集スイッチを初期化
    //
    // 各階層のJavaScriptファイル「setting.js」と「setting_top.js」から設定を読み込む
    //
    // フォルダ階層ごとのループ
    //  例：「」=>「../」=>「../../」=>「../../../」
    let pathList = (window.location.pathname ?? "/").split("/");
    let isFirst = true;
    do {
        pathList.pop();
        if (isFirst) {
            pathList = pathList.filter(path => (path !== ""));
        }
        if (isDebugTree) console.log('\n');
        const s1 = await _loadSetting(
            window.location.protocol + "//"
            + window.location.host + "/"
            + pathList.join("/")
            + ((pathList.length > 0) ? "/" : "")
            + 'setting.js'
        );
        if (!s1.isLoadSettingSuccess) {
            break;
        }
        settings.push(s1);
        //
        if (isFirst) {
            fontInit(s1);  // フォントを読み込む
            initToolList(s1);   // ツールボックスを表示
            isFirst = false;
        }
        //
        if (isDebugTree) console.log('\n');
        //
        const s2 = await _loadSetting(
            window.location.protocol + "//"
            + window.location.host + "/"
            + pathList.join("/")
            + ((pathList.length > 0) ? "/" : "")
            + 'setting_top.js'
        );
        if (s2.isLoadSettingSuccess) {
            settings.push(s2);
            // 「window_top.json」を発見した場合（一番上のファイル階層まで到達した場合）は
            //  for文の実行を終了する。
            break;
        }
    } while (pathList.length > 0);
    if (settings.length == 0) {
        const s1 = {
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
        settings.push(s1);
        fontInit(s1);  // フォントを読み込む
        initToolList(s1);   // ツールボックスを表示
    }
    if (isDebugTree) console.log('\n');
    if (isDebugTree) console.log(settings);
    initWindows();  //「戻る」ボタンや子ページに繋がるボタン、パンくずリストなどを生成
});
