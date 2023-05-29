
//#########################################################################################
plugins["Calendar"] = {
    "isDefault": true,

    "css": calendarCSS,

    "viewer": {


        //【必須】実際に表示するHTML要素を生成する関数
        //    ※ページを開いた直後に、１度だけ実行されます。
        //    ※サーバーと連携して、表示するたびに内容が変化するような使い方もできます。
        //    ※未定義の場合は、ツールボックスの中だけで動作するプラグインになります。（例：画質変換）
        "renderHeavy": async (blockId, saveData) => calendarRender({ blockId, saveData, isHeavy: true }),

        renderLight: async (blockId, saveData) => calendarRender({ blockId, saveData, isHeavy: false }),

        //【任意】編集モードに切り替わったとき
        changeEditMode: async function (blockId, saveData) {
            const outerElement = document.getElementById(blockId);
            //
            const overlayElement = document.createElement("div");
            outerElement.appendChild(overlayElement);
            overlayElement.style.position = "absolute";
            overlayElement.style.top = 0;
            overlayElement.style.height = "100%";
            overlayElement.style.width = "100%";
            overlayElement.style.padding = "20px 0";
            overlayElement.style.boxSizing = "border-box";
            //
            const innerElement = document.createElement("div");
            overlayElement.appendChild(innerElement);
            innerElement.style.boxShadow = "0 0 8px gray";
            innerElement.style.width = "400px";
            innerElement.style.height = "100%";
            innerElement.style.background = "rgba(255,255,255,0.95)";
            innerElement.style.margin = "0 auto";
            innerElement.style.overflowY = "scroll";
            //
            const scrollElement = document.createElement("div");
            innerElement.appendChild(scrollElement);
            //
            const h2Element = document.createElement("h2");
            h2Element.innerHTML = "カレンダーの設定";
            h2Element.style.textAlign = "center";
            h2Element.style.padding = "20px";
            scrollElement.appendChild(h2Element);
            //
            const checkboxElement = document.createElement("input");
            checkboxElement.type = "checkbox";
            checkboxElement.checked = saveData?.isReservable ?? "";
            checkboxElement.id = "checkbox_isReservable_" + blockId;
            scrollElement.appendChild(checkboxElement);
            checkboxElement.addEventListener("change", async function () {
                console.log(checkboxElement.checked);
                await _writeSaveData(
                    blockId,
                    { isReservable: checkboxElement.checked }
                );
            });
            //
            const checkboxLabelElement = document.createElement("label");
            checkboxLabelElement.setAttribute("for", "checkbox_isReservable_" + blockId);
            checkboxLabelElement.innerText = "予約可能";
            scrollElement.appendChild(checkboxLabelElement);
            //
            const brElement = document.createElement("br");
            scrollElement.appendChild(brElement);
            //
            const brElement2 = document.createElement("br");
            scrollElement.appendChild(brElement2);
            //
            const openLabelElement = document.createElement("label");
            openLabelElement.innerText = "表示名";
            scrollElement.appendChild(openLabelElement);
            //
            const openElement = document.createElement("input");
            openElement.value = saveData?.openName ?? "";
            openElement.style.width = "200px";
            scrollElement.appendChild(openElement);
            openElement.addEventListener("change", async function () {
                await _writeSaveData(
                    blockId,
                    { openName: openElement.value }
                );
            });
            //
            const brElement3 = document.createElement("br");
            scrollElement.appendChild(brElement3);
            //
            const brElement4 = document.createElement("br");
            scrollElement.appendChild(brElement4);
            //
            const microsoftProfile = await _getMicrosoftProfile();
            //console.log(microsoftProfile);
            //
            const responseStream = await window.fetch(
                "https://rfs7tgnp2e5bbqvnycc4ohh5sy0oixuw.lambda-url.ap-northeast-1.on.aws/list_event_type", {
                method: "POST",
                headers: {},
                body: JSON.stringify({
                    //graphApi: microsoftProfile.graphApi,
                }),
            },
            );
            let responseData;
            if (responseStream.status === 200) {
                try {
                    responseData = await responseStream.json();
                }
                catch (e) {
                    console.error('JSONに変換できませんでした');
                    return;
                }
            }
            else {
                console.error('サーバーから読み込めません');
                console.error(responseStream);
                return;
            }
            if (!responseData.isSuccess) {
                console.error(responseData.message);
                return;
            }
            for (const eventType of responseData.data) {
                const divElement = document.createElement("div");
                divElement.style.overflowX = "hidden";
                divElement.style.whiteSpace = "nowrap";
                scrollElement.appendChild(divElement);
                //
                const studentIdElement = document.createElement("input");
                studentIdElement.type = "radio";
                studentIdElement.name = blockId;
                studentIdElement.id = blockId + "_" + eventType.eventTypeId;
                studentIdElement.value = eventType.eventTypeId;
                studentIdElement.checked = (saveData?.eventTypeId == eventType.eventTypeId);
                divElement.appendChild(studentIdElement);
                studentIdElement.addEventListener("change", async function () {
                    await _writeSaveData(
                        blockId,
                        { eventTypeId: studentIdElement.value }
                    );
                });
                //
                const labelElement = document.createElement("label");
                labelElement.innerHTML = eventType.eventTypeText;
                labelElement.setAttribute("for", blockId + "_" + eventType.eventTypeId);
                divElement.appendChild(labelElement);
            }
        },
    },

    "toolbox": {

        //【必須】ツールボックスに表示されるHTML要素を生成する関数
        "render": async function (saveData) {
            const toolboxElement = document.createElement('div');
            toolboxElement.innerHTML = 'カレンダー';
            return toolboxElement;
        },
    },

}
