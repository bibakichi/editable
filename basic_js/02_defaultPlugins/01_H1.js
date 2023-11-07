//#########################################################################################
plugins["H1"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement('h1');
            element.id = blockId;
            element.innerHTML = saveData?.text ?? "見出し１";
            return element;
        },
        "changeEditMode": async function (blockId) {
            const element = document.getElementById(blockId);
            element.addEventListener('paste', (e) => {
                // ペースト時にプレーンテキストのみにする
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain");
                const sentence = element.innerHTML;
                const sel = window.getSelection();
                const pos = sel.anchorOffset;
                const before = sentence.substring(0, pos);
                const after = sentence.substring(pos, pos + sentence.length);
                element.innerHTML = before + text + after;
            });
            element.addEventListener('click', (event) => {
                //
                // この１文がなかったら、
                // 編集中のテキストの先頭をクリックすると、カーソルが自動的に最後まで移動してしまう
                if (element.isContentEditable) return;
                //
                element.contentEditable = true;
                element.focus();
                // １文字以上の場合
                if (element.childNodes.length > 0) {
                    // カーソル位置を最後にもっていく
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.setStart(element.childNodes[0], element.innerHTML.length);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });
            element.addEventListener('focusout', (event) => {
                element.contentEditable = false;
            });
        },
        "saveBlock": async function (blockId, pastSaveData) {
            const element = document.getElementById(blockId);
            const text = element.innerHTML;
            //
            // H1やH2などのHTML要素が編集されたときに、この関数を呼び出す。
            // ニュースの見出しが連動して変更される
            changeHeadingsInConjunction({
                text: text,
                blockId: blockId,
            });
            //
            return {
                text: text,
            };
        },
    },
    "toolbox": {
        "render": async function (saveData) {
            const toolboxElement = document.createElement('h1');
            toolboxElement.innerHTML = saveData?.text ?? '見出し１';
            return toolboxElement;
        },
    },
}
