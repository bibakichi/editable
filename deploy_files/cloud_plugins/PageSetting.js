//#########################################################################################
plugins["PageSetting"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            //
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
            const labelElement1 = document.createElement('span');
            labelElement1.innerText = "タイトル";
            divElement1.appendChild(labelElement1);
            //
            const inputElement1 = document.createElement('input');
            inputElement1.value = settings[0]?.title;
            divElement1.appendChild(inputElement1);
            inputElement1.addEventListener("input", () => {
                document.title = inputElement1.value;
                settings[0] = {
                    ...settings[0],
                    title: inputElement1.value,
                };
            });
            //
            //
            const divElement2 = document.createElement('div');
            mainElement.appendChild(divElement2);
            //
            const spanElement2 = document.createElement('span');
            spanElement2.innerText = "全画面表示";
            spanElement2.classList.add("edit-label");
            divElement2.appendChild(spanElement2);
            //
            const labelElement2 = document.createElement('label');
            labelElement2.classList.add("switch");
            divElement2.appendChild(labelElement2);
            //
            const inputElement2 = document.createElement('input');
            inputElement2.type = "checkbox";
            inputElement2.checked = settings[0]?.isFullSize;
            labelElement2.appendChild(inputElement2);
            inputElement2.addEventListener("change", () => {
                settings[0] = {
                    ...settings[0],
                    isFullSize: inputElement2.checked,
                };
                const element = document.querySelector('#this_page_modal_trigger+.modal_overlay+.modal_outer');
                if (settings[0].isFullSize) {
                    element.classList.add('full_size');
                }
                else {
                    element.classList.remove('full_size');
                }
            });
            //
            const sliderElement2 = document.createElement('span');
            sliderElement2.classList.add("slider");
            labelElement2.appendChild(sliderElement2);
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
    "toolbox": {
        "render": async function (saveData) {
            //
            const { openButtonElement, mainElement } = createModal();
            openButtonElement.innerText = "ページ設定";
            //
            const titleElement = document.createElement('h2');
            titleElement.innerText = "ページ設定";
            titleElement.style.textAlign = "center";
            titleElement.style.margin = "50px 0";
            mainElement.appendChild(titleElement);
            //
            //####################################################
            //
            const divElement1 = document.createElement('div');
            mainElement.appendChild(divElement1);
            //
            const labelElement1 = document.createElement('span');
            labelElement1.innerText = "タイトル";
            divElement1.appendChild(labelElement1);
            //
            const inputElement1 = document.createElement('input');
            inputElement1.value = settings[0]?.title;
            divElement1.appendChild(inputElement1);
            inputElement1.addEventListener("input", () => {
                document.title = inputElement1.value;
                settings[0] = {
                    ...settings[0],
                    title: inputElement1.value,
                };
            });
            //
            //####################################################
            //
            const divElement2 = document.createElement('div');
            mainElement.appendChild(divElement2);
            //
            const spanElement2 = document.createElement('span');
            spanElement2.innerText = "全画面表示";
            spanElement2.classList.add("edit-label");
            divElement2.appendChild(spanElement2);
            //
            const labelElement2 = document.createElement('label');
            labelElement2.classList.add("switch");
            divElement2.appendChild(labelElement2);
            //
            const inputElement2 = document.createElement('input');
            inputElement2.type = "checkbox";
            inputElement2.checked = settings[0]?.isFullSize;
            labelElement2.appendChild(inputElement2);
            inputElement2.addEventListener("change", () => {
                settings[0] = {
                    ...settings[0],
                    isFullSize: inputElement2.checked,
                };
                const element = document.querySelector('#this_page_modal_trigger+.modal_overlay+.modal_outer');
                if (settings[0].isFullSize) {
                    element.classList.add('full_size');
                }
                else {
                    element.classList.remove('full_size');
                }
            });
            //
            const sliderElement2 = document.createElement('span');
            sliderElement2.classList.add("slider");
            labelElement2.appendChild(sliderElement2);
            //
            //####################################################
            //
            const divElement3 = document.createElement('div');
            mainElement.appendChild(divElement3);
            //
            const labelElement3 = document.createElement('span');
            labelElement3.innerText = "テーマ色";
            divElement3.appendChild(labelElement1);
            //
            const inputElement3 = document.createElement('input');
            inputElement3.type = "color";
            inputElement3.value = settings[0]?.title;
            divElement3.appendChild(inputElement3);
            inputElement3.addEventListener("input", () => {
                console.log(inputElement3.value);
            });
            //
            //####################################################
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
