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
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

                        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

                        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        [{ 'align': [] }],
                    ]
                },
                theme: 'bubble'
            });
            setTimeout(() => {
                const element = document.getElementById(blockId);
                element.style.position = "relative";
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
                element.addEventListener("focusout", () => {
                    overlayElement.style.display = "block";
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
