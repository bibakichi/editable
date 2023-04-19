//#########################################################################################
plugins["PageSetting"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            return document.createElement("div");
        },
    },
    "toolbox": {
        "render": async function (saveData) {
            const { openButtonElement, mainElement } = createModal();
            openButtonElement.innerText = "ページ設定";
            //
            const titleElement = document.createElement('h2');
            titleElement.innerText = "ページ設定";
            titleElement.style.textAlign = "center";
            titleElement.style.margin = "50px 0";
            mainElement.appendChild(titleElement);
            //
            const divElement1 = document.createElement('div');
            mainElement.appendChild(divElement1);
            //
            const labelElement1 = document.createElement('label');
            labelElement1.innerText = "タイトル";
            divElement1.appendChild(labelElement1);
            //
            const inputElement1 = document.createElement('input');
            inputElement1.value = settings[0]?.title;
            divElement1.appendChild(inputElement1);
            //
            const divElement2 = document.createElement('div');
            mainElement.appendChild(divElement2);
            //
            const divElement3 = document.createElement('div');
            mainElement.appendChild(divElement3);
            //
            const divElement4 = document.createElement('div');
            mainElement.appendChild(divElement4);
            //
            const divElement5 = document.createElement('div');
            mainElement.appendChild(divElement5);
            //
            const divElement6 = document.createElement('div');
            mainElement.appendChild(divElement6);
            //
            return openButtonElement;
        },
    },
}
