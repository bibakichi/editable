
document.addEventListener('DOMContentLoaded', async function () {
    // URLからcloudFrontの認証情報を消す
    const params = new URLSearchParams(window.location.search);
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
    let pathList = window.location.pathname.split("/");
    pathList.pop();
    pathList = pathList.filter(path => (path !== ""));
    let isFirst = true;
    do {
        if (isDebugTree) console.log('\n');
        const s1 = await _loadSetting(pathList.join("/") + '/setting.js');
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
        const s2 = await _loadSetting(pathList.join("/") + '/setting_top.js');
        if (s2.isLoadSettingSuccess) {
            settings.push(s2);
            // 「window_top.json」を発見した場合（一番上のファイル階層まで到達した場合）は
            //  for文の実行を終了する。
            break;
        }
        pathList.pop();
    } while (pathList.length > 0);
    if (isDebugTree) console.log('\n');
    if (isDebugTree) console.log(settings);
    initWindows();  //「戻る」ボタンや子ページに繋がるボタン、パンくずリストなどを生成
});
