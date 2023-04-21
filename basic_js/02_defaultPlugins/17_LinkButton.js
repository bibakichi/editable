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
            const openButtonElement = document.createElement('label');
            newElement.appendChild(openButtonElement);
            openButtonElement.classList.add("button3d");
            openButtonElement.id = blockId;
            openButtonElement.setAttribute("for", blockId + '_trigger');
            openButtonElement.innerText = saveData?.text ?? "リンク";
            //
            const checkboxElement = document.createElement("input");
            checkboxElement.id = blockId + '_trigger';
            checkboxElement.type = "checkbox";
            checkboxElement.style.display = "none";
            checkboxElement.classList.add("linkbutton_checkbox");
            newElement.appendChild(checkboxElement);
            //
            const overlayElement = document.createElement("div");
            overlayElement.style.position = "absolute";
            overlayElement.style.top = "-50px";
            overlayElement.style.height = "50px";
            overlayElement.style.width = "100%";
            overlayElement.style.background = "#fff";
            overlayElement.style.boxShadow = "0 0 8px gray";
            overlayElement.style.zIndex = "999";
            overlayElement.classList.add("linkbutton_overlay");
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
            //
            const divElement2 = document.createElement('div');
            overlayElement.appendChild(divElement2);
            //
            const labelElement2 = document.createElement('span');
            labelElement2.innerText = "表示するテキスト";
            divElement2.appendChild(labelElement2);
            //
            const inputElement2 = document.createElement('input');
            inputElement2.value = saveData?.text ?? "リンク";
            divElement2.appendChild(inputElement2);
            inputElement2.addEventListener("input", () => {
                const openButtonElement = document.getElementById(blockId);
                openButtonElement.innerText = inputElement2.value;
            });
        },
        "saveBlock": async function (blockId, pastSaveData) {
            const openButtonElement = document.getElementById(blockId);
            const urlElement = document.getElementById("url_" + blockId);
            return {
                text: openButtonElement.textContent,
                url: urlElement.innerText,
            };
        }
    }
}
