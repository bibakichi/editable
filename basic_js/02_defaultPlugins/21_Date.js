//#########################################################################################

plugins["Date"] = {
    "isDefault": true,
    "toolbox": {
        "render": async function (saveData) {
            const element = document.createElement('div');
            element.style.padding = "5px";
            element.innerHTML = "ページ内で連動した日時";
            return element;
        },
    },
    "viewer": {
        "renderHeavy": async function (blockId, saveData) {
            const element = document.createElement("p");
            element.id = blockId;
            element.classList.add("date_block");
            element.innerHTML = saveData.date;
            return element;
        },
        "changeEditMode": async function (blockId) {
            const element = document.getElementById(blockId);
            element.innerHTML = "";
            //
            const inputElement = document.createElement("input");
            inputElement.id = blockId + "_input";
            inputElement.type = "date";
            inputElement.value = settings[0]?.date;
            element.appendChild(inputElement);
        },
        "saveBlock": async function (blockId, pastSaveData) {
            const element = document.getElementById(blockId + "_input");
            console.log(element.value);
            settings[0] = {
                ...settings[0],
                date: element.value,
            };
            return {
                date: element.value,
            };
        },
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement("p");
            element.id = blockId;
            element.classList.add("date_block");
            element.innerHTML = settings[0]?.date;
            return element;
        },
    },
}
