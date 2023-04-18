//#########################################################################################

let microsoftProfile = null;

async function _getMicrosoftProfile() {
    if (microsoftProfile) {
        return microsoftProfile;
    }
    microsoftProfile = await loadMicrosoftProfile();
    console.log(microsoftProfile);
    if (!microsoftProfile) {
        const { openButtonElement, mainElement, checkboxElement } = createModal();
        //
        const iframeElement = document.createElement("iframe");
        const redirectUri = new URL(window.location.href);
        redirectUri.searchParams.set("login_iframe", 1);
        const redirectUriText = window.encodeURIComponent(redirectUri.toString());
        iframeElement.src = `https://7mo.nl/login?redirect_uri=${redirectUriText}`;
        iframeElement.style.width = "100%";
        iframeElement.style.height = "100%";
        iframeElement.style.position = "absolute";
        iframeElement.style.margin = 0;
        iframeElement.style.border = "none";
        mainElement.replaceWith(iframeElement);
        //
        checkboxElement.checked = true;
    }
}
