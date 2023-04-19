//#########################################################################################

async function _getMicrosoftProfile() {
    if (microsoftProfile) {
        return microsoftProfile;
    }
    microsoftProfile = await loadMicrosoftProfile();
    if (!microsoftProfile) {
        const { openButtonElement, mainElement, checkboxElement } = createModal();
        //
        const h2Element = document.createElement("h2");
        h2Element.style.textAlign = "center";
        h2Element.innerText = "ログインをする必要があります";
        mainElement.appendChild(h2Element);
        //
        const buttonElement = document.createElement("a");
        buttonElement.innerText = "ログイン";
        mainElement.appendChild(buttonElement);
        //
        const redirectUri = new URL(window.location.href);
        redirectUri.searchParams.set("editmode", 1);
        const redirectUriText = window.encodeURIComponent(redirectUri.toString());
        buttonElement.href = `https://7mo.nl/login?redirect_uri=${redirectUriText}`;
        //
        checkboxElement.checked = true;
    }
    return microsoftProfile;
}
