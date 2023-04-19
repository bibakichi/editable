//#########################################################################################
plugins["Logout"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const buttonElement = document.createElement('button');
            buttonElement.id = blockId;
            buttonElement.innerText = "ログアウト";
            buttonElement.addEventListener("click", () => {
                window.localStorage.removeItem("graphApiInfo");
                window.location.href = "https://login.microsoftonline.com/logout.srf";
            });
            return buttonElement;
        },
    },
    "toolbox": {
        "render": async function (saveData) {
            const buttonElement = document.createElement('button');
            buttonElement.id = blockId;
            buttonElement.innerText = "ログアウト";
            buttonElement.addEventListener("click", () => {
                window.localStorage.removeItem("graphApiInfo");
                window.location.href = "https://login.microsoftonline.com/logout.srf";
            });
            return buttonElement;
        },
    },
}
