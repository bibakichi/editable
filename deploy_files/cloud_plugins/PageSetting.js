//#########################################################################################

plugins["PageSetting"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const divElement = document.createElement("div");
            divElement.style.background = "#555";
            divElement.style.height = "300px";
            divElement.style.color = "#f00";
            divElement.innerHTML = "このブロックは配置できません";
            divElement.id = blockId;
            return divElement;
        }
    },
    "toolbox": {
        "render": async function (saveData) {
            //
            const { openButtonElement, mainElement } = createModal();
            openButtonElement.innerText = "ページ設定";
            mainElement.style.padding = "10px";
            //
            // 入力フォームを作る関数
            function _createTextField({ labelText, key, onChange }) {
                const divElement1 = document.createElement('div');
                mainElement.appendChild(divElement1);
                //
                const labelElement1 = document.createElement('span');
                labelElement1.innerText = labelText;
                divElement1.appendChild(labelElement1);
                //
                const inputElement1 = document.createElement('input');
                if (settings[0]) {
                    inputElement1.value = settings[0][key];
                }
                divElement1.appendChild(inputElement1);
                inputElement1.addEventListener("input", () => {
                    settings[0] = {
                        ...settings[0],
                        [key]: inputElement1.value,
                    };
                    if (typeof onChange == "function") {
                        onChange(inputElement1.value);
                    }
                });
            }
            //
            const titleElement = document.createElement('h2');
            titleElement.innerText = "ページ設定";
            titleElement.style.textAlign = "center";
            titleElement.style.margin = "50px 0";
            mainElement.appendChild(titleElement);
            //
            //####################################################
            //
            _createTextField({
                labelText: "ブラウザの上部に表示するタイトル（必須）",
                key: "title",
                onChange: (text) => {
                    document.title = text;
                },
            });
            //
            //####################################################
            //
            _createTextField({
                labelText: "親ページに表示するタイトル（必須）",
                key: "headline",
                onChange: (text) => { },
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
            divElement3.appendChild(labelElement3);
            //
            const inputElement3 = document.createElement('input');
            inputElement3.type = "color";
            const SelectStyle = getComputedStyle(document.querySelector(':root'));
            const colorText = String(SelectStyle.getPropertyValue('--base-color') ?? "#8d0000");
            inputElement3.value = colorText;
            divElement3.appendChild(inputElement3);
            inputElement3.addEventListener("input", () => {
                const colorText = inputElement3.value;
                try {
                    const redText = colorText.substring(1, 3);
                    const greenText = colorText.substring(3, 5);
                    const blueText = colorText.substring(5, 7);
                    const red = parseInt(redText, 16);
                    const green = parseInt(greenText, 16);
                    const blue = parseInt(blueText, 16);
                    _changeBaseColor({ red, green, blue });
                }
                catch (err) {
                    console.error(err);
                }
            });
            //
            //####################################################
            //
            _createTextField({
                labelText: "組織名（必須）",
                key: "officeName",
                onChange: (text) => { },
            });
            //
            //####################################################
            //
            _createTextField({
                labelText: "電話番号（必須）",
                key: "phoneNumber",
                onChange: (text) => { },
            });
            //
            //####################################################
            //
            _createTextField({
                labelText: "内線番号",
                key: "extensionNumber",
                onChange: (text) => { },
            });
            //
            //####################################################
            //
            _createTextField({
                labelText: "ホームページのURL（必須）",
                key: "website",
                onChange: (text) => { },
            });
            //
            //####################################################
            //
            _createTextField({
                labelText: "googleマップのURL（必須）",
                key: "mapUrl",
                onChange: (text) => { },
            });
            //
            //####################################################
            //
            _createTextField({
                labelText: "住所（必須）",
                key: "address",
                onChange: (text) => { },
            });
            //
            //####################################################
            //
            return openButtonElement;
        },
    },
}
