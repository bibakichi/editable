//#########################################################################################
plugins["P"] = {
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
            newElement.innerHTML = qlEditor.innerHTML;
            newElement.classList.add("ql-container");
            return newElement;
        },
        "saveBlock": async function (blockId, pastSaveData) {
            const element = document.getElementById(blockId);
            const qlEditor = element.querySelector(".ql-editor");
            return {
                text: qlEditor.innerHTML,
            };
        },
        "changeEditMode": async function (blockId) {
            const quill = new Quill('#' + blockId, {
                /*modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],

                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                        [{ 'direction': 'rtl' }],                         // text direction

                        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        [{ 'font': [] }],
                        [{ 'align': [] }],

                        ['clean']                                         // remove formatting button
                    ]
                },*/
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
            toolboxElement.innerText = saveData?.text ?? '本文';
            return toolboxElement;
        },
    },
}
