//#########################################################################################
plugins["LinkButton"] = {
    "isDefault": true,
    "toolbox": {
        "render": async function (saveData) {
            const buttonElement = document.createElement('label');
            buttonElement.classList.add("button3d");
            buttonElement.innerText = saveData?.text ?? "リンク";
            return buttonElement;
        },
    },
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const buttonElement = document.createElement('a');
            buttonElement.id = blockId;
            buttonElement.classList.add("button3d");
            buttonElement.target = "_blank";
            buttonElement.href = saveData?.url;
            buttonElement.innerText = saveData?.text ?? "リンク";
            return buttonElement;
        },
        "changeEditMode": async function (blockId, saveData) {
            const pastElement = document.getElementById(blockId);
            const newElement = document.createElement('div');
            pastElement.replaceWith(newElement);
            //
            const urlElement = document.createElement('pre');
            urlElement.id = "url_" + blockId;
            urlElement.innerText = saveData?.url ?? "";
            urlElement.style.display = "none";
            newElement.appendChild(urlElement);
            //
            const checkboxElement = document.createElement("input");
            checkboxElement.classList.add('modal_trigger');
            checkboxElement.id = blockId + '_trigger';
            checkboxElement.type = "checkbox";
            newElement.appendChild(checkboxElement);
            //
            const openButtonElement = document.createElement('label');
            newElement.appendChild(openButtonElement);
            openButtonElement.classList.add("button3d");
            openButtonElement.id = blockId;
            openButtonElement.setAttribute("for", blockId + '_trigger');
            openButtonElement.innerText = saveData?.text ?? "リンク";
            openButtonElement.addEventListener('click', (event) => {
                //
                // この１文がなかったら、
                // 編集中のテキストの先頭をクリックすると、カーソルが自動的に最後まで移動してしまう
                if (openButtonElement.isContentEditable) return;
                //
                openButtonElement.contentEditable = true;
                openButtonElement.focus();
                // １文字以上の場合
                if (openButtonElement.childNodes.length > 0) {
                    // カーソル位置を最後にもっていく
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.setStart(openButtonElement.childNodes[0], openButtonElement.innerText.length);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });
            openButtonElement.addEventListener('focusout', (event) => {
                openButtonElement.contentEditable = false;
            });
            //
            const overlayElement = document.createElement("div");
            overlayElement.style.position = "absolute";
            overlayElement.style.top = "-50px";
            overlayElement.style.height = "50px";
            overlayElement.style.width = "100%";
            overlayElement.style.background = "#fff";
            overlayElement.style.boxShadow = "0 0 8px gray";
            overlayElement.style.zIndex = "999";
            newElement.appendChild(overlayElement);
            //
            //
            const divElement1 = document.createElement('div');
            overlayElement.appendChild(divElement1);
            //
            const labelElement1 = document.createElement('span');
            labelElement1.innerText = "URL";
            divElement1.appendChild(labelElement1);
            //
            const inputElement1 = document.createElement('input');
            inputElement1.value = urlElement.innerText;
            divElement1.appendChild(inputElement1);
            inputElement1.addEventListener("focusout", () => {
                const urlElement = document.getElementById("url_" + blockId);
                urlElement.innerText = inputElement1.value;
            });
        },
        "saveBlock": async function (blockId, pastSaveData) {
            const element = document.getElementById(blockId);
            const urlElement = document.getElementById("url_" + blockId);
            return {
                text: element.textContent,
                url: urlElement.innerText,
            };
        }
    }
}
