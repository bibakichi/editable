//#########################################################################################
// プラグインを文字列にする
const _convertPluginToString = ({ pluginName, plugin }) => `plugins["${pluginName}"] = {
    //##############################################################

    toolbox: {

        //【必須】ツールボックスに表示するHTML要素を生成する関数
        ${(plugin?.toolbox?.render) ?
        ("render: " + String(plugin?.toolbox?.render)) :
        `//
        // 例
        // render: async function (saveData) {
        //     const toolListInner = document.createElement('h1');
        //     toolListInner.innerText = saveData?.text ?? '見出し１';
        //     return toolListInner;
        // }`
    },


        //【任意】ツールボックス（画面右側）のブロックの上にドラッグ中の何かが侵入したとき
        ${(plugin?.toolbox?.onDragEnter) ?
        ("onDragEnter: " + String(plugin?.toolbox?.onDragEnter)) :
        `//
        // 例
        // onDragEnter: async (blockId) => { }`
    },


        //【任意】ツールボックス（画面右側）のブロックの上からドラッグ中の何かが離れたとき
        ${(plugin?.toolbox?.onDragLeave) ?
        ("onDragLeave: " + String(plugin?.toolbox?.onDragLeave)) :
        `//
        // 例
        // onDragLeave: async (blockId) => { }`
    },


        //【任意】ツールボックス（画面右側）のブロックの上をドラッグ中の何かが通ったとき
        ${(plugin?.toolbox?.onDragOver) ?
        ("onDragOver: " + String(plugin?.toolbox?.onDragOver)) :
        `//
        // 例
        // onDragOver: async (blockId) => { }`},


        //【任意】ツールボックス（画面右側）のブロックの上に何かがドロップされたとき
        ${(plugin?.viewer?.onDrop) ?
        ("onDrop: " + String(plugin?.viewer?.onDrop)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropJson) ?
        ("onDropJson: " + String(plugin?.viewer?.onDropJson)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropText) ?
        ("onDropText: " + String(plugin?.viewer?.onDropText)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropFile) ?
        ("onDropFile: " + String(plugin?.viewer?.onDropFile)) + ",\n        "
        :
        ""
    }//
        // 例
        // onDrop: async (blockId) => { },
        // onDropJson: async function (blockId, jsonData) { },
        // onDropText: async function (blockId, text) { },
        // onDropFile: async function (blockId, file) { },

    },

    //##############################################################

    viewer: {

        //【任意】
        //   true:  子ブロックを編集するときに、カード表示のエディターを使う
        //   false: 子ブロックを編集するときに、完成ページと同じレイアウトのまま編集する
        cardEditor: ${(plugin?.viewer?.cardEditor) ? "true" : "false"},


        //【任意】ビューワー（画面左側）に表示するHTML要素を生成する関数
        //    ※ページを開いた直後に、１度だけ実行されます。
        //    ※サーバーと連携して、表示するたびに内容が変化するような使い方もできます。
        //    ※未定義の場合は、ツールボックス（画面右側）の中だけで動作するブロックになり、ビューワー（画面左側）にドラッグ＆ドロップできなくなります。
        ${(plugin?.viewer?.renderHeavy) ?
        ("renderHeavy: " + String(plugin?.viewer?.renderHeavy)) :
        `//
        // 例
        // renderHeavy: async function (blockId, saveData) {
        //     const element = document.createElement('h1');
        //     element.id = blockId;
        //     element.innerText = saveData?.text;
        //     //
        //     // 子ブロックを生成する
        //     for (const childSaveData of saveData?.children) {
        //         const c = await _renderHeavy(childSaveData);
        //         element.appendChild(c);
        //     }
        //     return element;
        // }`
    },


        //【任意】読み込み中に表示する軽量なHTML要素を生成する関数
        //   ※画面右上の保存ボタンを押したときに実行されます。
        //   ※表示するときは、この関数は実行されません。
        //   ※表示するたびに内容が変化するような使い方はできません。
        ${(plugin?.viewer?.renderLight) ?
        ("renderLight: " + String(plugin?.viewer?.renderLight)) :
        `//
        // 例
        // renderLight: async function (blockId, saveData) {
        //     const element = document.createElement('h1');
        //     element.innerText = saveData?.text;
        //     return element;
        // }`},


        //【任意】編集モードに切り替わったとき
        ${(plugin?.viewer?.changeEditMode) ?
        ("changeEditMode: " + String(plugin?.viewer?.changeEditMode)) :
        `//
        // 例
        // changeEditMode: async function (blockId,saveData) {
        //     const element = document.getElementById(blockId);
        //     element.contentEditable = true;
        // }`},


        //【任意】保存するJSONデータを生成する関数
        //    ※未定義の場合は、空のセーブデータとして保存されます。
        ${(plugin?.viewer?.saveBlock) ?
        ("saveBlock: " + String(plugin?.viewer?.saveBlock)) :
        `//
        // 例
        // saveBlock: async function (blockId, pastSaveData) {
        //     const element = document.getElementById(blockId);
        //     const saveData = {
        //         text: element.textContent,
        //         children: [],
        //     };
        //     //
        //     // 子ブロックを保存する
        //     for (const childrenElement of element.querySelectorAll(":scope>*")) {
        //         const newSaveData = await _saveBlock(childrenElement);
        //         saveData?.children.push(newSaveData);
        //     }
        //     return saveData;
        // }`},


        //【任意】ブロック内での改行を有効化するかどうか
        isEnableLineBreaks: ${(plugin?.viewer?.isEnableLineBreaks) ? "true" : "false"},


        //【任意】ビューワー（画面左側）のブロックの上にドラッグ中の何かが侵入したとき
        ${(plugin?.viewer?.onDragEnter) ?
        ("onDragEnter: " + String(plugin?.viewer?.onDragEnter)) :
        `//
        // 例
        // onDragEnter: async (blockId) => { }`},


        //【任意】ビューワー（画面左側）のブロックの上からドラッグ中の何かが離れたとき
        ${(plugin?.viewer?.onDragLeave) ?
        ("onDragLeave: " + String(plugin?.viewer?.onDragLeave)) :
        `//
        // 例
        // onDragLeave: async (blockId) => { }`},


        //【任意】ビューワー（画面左側）のブロックの上をドラッグ中の何かが通ったとき
        ${(plugin?.viewer?.onDragOver) ?
        ("onDragOver: " + String(plugin?.viewer?.onDragOver)) :
        `//
        // 例
        // onDragOver: async (blockId) => { }`},


        //【任意】ビューワー（画面左側）のブロックの上に何かがドロップされたとき
        ${(plugin?.viewer?.onDrop) ?
        ("onDrop: " + String(plugin?.viewer?.onDrop)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropJson) ?
        ("onDropJson: " + String(plugin?.viewer?.onDropJson)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropText) ?
        ("onDropText: " + String(plugin?.viewer?.onDropText)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropFile) ?
        ("onDropFile: " + String(plugin?.viewer?.onDropFile)) + ",\n        "
        :
        ""
    }//
        // 例
        // onDrop: async (blockId) => { },
        // onDropJson: async function (blockId, jsonData) { },
        // onDropText: async function (blockId, text) { },
        // onDropFile: async function (blockId, file) { },

    },

    //##############################################################

    //【任意】CSS
    ${(plugin?.css) ?
        ("css: " + String(plugin?.css)) :
        `//
    // 例
    // css: async () => \`
    //     input:checked+.slider {
    //         background-color: #8d0000;
    //         border: 1px solid transparent;
    //     }
    //     input:checked+.slider:before {
    //         transform: translateX(1.5em);
    //     }
    // \``
    },

    externals: {

        //【任意】外部JavaScriptのURL
        ${(plugin?.externals?.js) ?
        ("js: " + String(plugin?.externals?.js)) :
        `//
        // 例
        // js: async (saveData) => [
        //     "https://example.com/aaa.js",
        //     "https://example.com/bbb.js"
        // ]`
    },


        //【任意】外部CSSのURL
        ${(plugin?.externals?.css) ?
        ("css: " + String(plugin?.externals?.css)) :
        `//
        // 例
        // css: async (saveData) => [
        //     "https://example.com/aaa.css",
        //     "https://example.com/bbb.css"
        // ]`
    },

    },

    //##############################################################
}`;