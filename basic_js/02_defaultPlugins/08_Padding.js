//#########################################################################################
plugins["Padding"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement('div');
            element.id = blockId;
            element.style.width = "100%";
            element.style.height = "40px";
            // mouseoverイベントリスナーを追加
            element.addEventListener('mouseover', function () {
                element.style.background = 'rgba(0,255,0,0.5);'; // 背景色を青にする
            });

            // mouseoutイベントリスナーを追加
            element.addEventListener('mouseout', function () {
                element.style.background = 'none'; // 背景色を白に戻す
            });

            return element;
        },
    },
    "toolbox": {
        "render": async function (saveData) {
            const toolboxElement = document.createElement('h4');
            toolboxElement.innerText = saveData?.text ?? '空白';
            return toolboxElement;
        },
    },
}
