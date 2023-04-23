//#########################################################################################
plugins["P"] = {
    "isDefault": true,
    "viewer": {
        "renderHeavy": async function (blockId, saveData) {
            const container = document.createElement('div');
            container.id = blockId;
            container.style.padding = "12px 0";
            container.classList.add("ql-container");
            //
            const qlEditor = document.createElement('div');
            qlEditor.classList.add("ql-editor");
            qlEditor.innerHTML = saveData?.text ?? "";
            container.appendChild(qlEditor);
            //
            return container;
        },
        "renderLight": async function (blockId, saveData) {
            const container = document.getElementById(blockId);
            const qlEditor = container.querySelector(".ql-editor");
            //
            const newContainer = document.createElement('div');
            newContainer.style.padding = "12px 0";
            newContainer.classList.add("ql-container");
            //
            const newQlEditor = document.createElement('div');
            newQlEditor.classList.add("ql-editor");
            newContainer.appendChild(newQlEditor);
            //
            if (qlEditor) {
                newQlEditor.innerHTML = qlEditor.innerHTML;
            }
            else {
                newQlEditor.innerHTML = container.innerHTML;
            }
            return newContainer;
        },
        "saveBlock": async function (blockId, pastSaveData) {
            const element = document.getElementById(blockId);
            const qlEditor = element.querySelector(".ql-editor");
            if (qlEditor) {
                return {
                    text: qlEditor.innerHTML,
                };
            }
            else {
                return {
                    text: element.innerHTML,
                };
            }
        },
        "changeEditMode": async function (blockId) {
            const quill = new Quill('#' + blockId, {
                placeholder: '本文（文章を範囲選択すると、リンクの追加や書式設定ができます）',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike', 'link', 'formula'],        // toggled buttons

                        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

                        [{ 'size': ['small', 'normal', 'large', 'huge'] }],  // custom dropdown

                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        [{ 'align': [] }],
                    ]
                },
                theme: 'bubble'
            });
            setTimeout(() => {
                const element = document.getElementById(blockId);
                element.style.position = "relative";
                //
                // ドラッグ用の掴む部分（透明で、ブロックの上に覆いかぶさっている）
                const overlayElement = document.createElement('div');
                overlayElement.style.top = 0;
                overlayElement.style.position = "absolute";
                overlayElement.style.width = "100%";
                overlayElement.style.height = "100%";
                overlayElement.style.zIndex = 999;
                element.appendChild(overlayElement);
                overlayElement.addEventListener("click", () => {
                    overlayElement.style.display = "none";
                    quill.focus();
                });
                element.addEventListener("focusin", () => {
                    window["focus_" + blockId] = true;
                });
                element.addEventListener("focusout", () => {
                    window["focus_" + blockId] = false;
                    //
                    // フォーカスが外れたら、ドラッグ用の掴む部分を復活させる
                    // ただし「フォーカスが外れる」といっても、ブロック内でクリックしただけの可能性がある。
                    // そこで、フォーカスが外れた0.5秒後に、グローバル変数を使って再確認する
                    setTimeout(() => {
                        if (!window["focus_" + blockId]) {
                            overlayElement.style.display = "block";
                        }
                    }, 500);
                });
            }, 500);
        },
    },
    "toolbox": {
        "render": async function (saveData) {
            const toolboxElement = document.createElement('p');
            toolboxElement.innerHTML = saveData?.text ?? '本文';
            return toolboxElement;
        },
    },
}
