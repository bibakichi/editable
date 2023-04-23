//#########################################################################################
plugins["Div"] = {
    "isDefault": true,
    "viewer": {
        "renderHeavy": async function (blockId, saveData) {
            const element = document.createElement('div');
            element.id = blockId;
            element.innerHTML = saveData?.text ?? "";
            return element;
        },
        "renderLight": async function (blockId, saveData) {
            const element = document.getElementById(blockId);
            const qlEditor = element.querySelector(".ql-editor");
            const newElement = document.createElement('div');
            if (qlEditor) {
                newElement.innerHTML = qlEditor.innerHTML;
            }
            else {
                newElement.innerHTML = element.innerHTML;
            }
            newElement.classList.add("ql-container");
            return newElement;
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
