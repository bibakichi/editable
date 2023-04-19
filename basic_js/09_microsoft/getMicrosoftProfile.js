//#########################################################################################

async function _getMicrosoftProfile() {
    if (window.microsoftProfile) {
        return window.microsoftProfile;
    }
    window.microsoftProfile = await loadMicrosoftProfile();
    if (window.microsoftProfile) {
        console.log(window.microsoftProfile);
        return window.microsoftProfile;
    }
    window.isLoginRequired = true;
    const { openButtonElement, mainElement, checkboxElement } = createModal({ isEnableClose: false });
    //
    const h2Element = document.createElement("h2");
    h2Element.style.textAlign = "center";
    h2Element.innerText = "ログインをする必要があります";
    h2Element.style.margin = "50px 0";
    mainElement.appendChild(h2Element);
    //
    const divElement = document.createElement("div");
    divElement.style.textAlign = "center";
    mainElement.appendChild(divElement);
    //
    const buttonElement = document.createElement("a");
    buttonElement.classList.add("button3d");
    buttonElement.innerText = "ログイン";
    divElement.appendChild(buttonElement);
    //
    const redirectUri = new URL(window.location.href);
    redirectUri.searchParams.set("editmode", 1);
    const redirectUriText = window.encodeURIComponent(redirectUri.toString());
    buttonElement.href = `https://7mo.nl/login?redirect_uri=${redirectUriText}`;
    //
    window.setInterval(() => {
        checkboxElement.checked = true;
    }, 500);
    console.log("ログイン用ウィンドウを表示");
    return null;
}
