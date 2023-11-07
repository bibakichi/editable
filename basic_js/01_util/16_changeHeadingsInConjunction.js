
//#########################################################################################

// H1やH2などのHTML要素が編集されたときに、この関数を呼び出す。
// 必要に応じて、連動しているニュースの見出しを変更する
function changeHeadingsInConjunction({ text, blockId }) {
    //
    // もしもこの要素が連動していたら
    if (blockId == settings[0]?.headlineBlockId) {
        settings[0] = {
            ...settings[0],
            headline: text,
            headlineBlockId: blockId,
        };
        return;
    }
    //
    // 見出しと連動しているHTML要素を見つけ出す
    let headlineBlock;
    try {
        if (settings[0]?.headlineBlockId) {
            headlineBlock = document.getElementById(settings[0]?.headlineBlockId);
        }
    }
    catch (err) { }
    //
    // もしもHTML要素が存在したら
    if (headlineBlock) {
        // 既に他の要素が連動しているので、何もしない
    }
    else {
        // 新しく、対象の要素を連動させる
        settings[0] = {
            ...settings[0],
            headline: text,
            headlineBlockId: blockId,
        };
    }
}
