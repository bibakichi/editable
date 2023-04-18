//#########################################################################################

let microsoftProfile = null;

async function _getMicrosoftProfile() {
    if (microsoftProfile) {
        return microsoftProfile;
    }
    microsoftProfile = await loadMicrosoftProfile();
    if (!microsoftProfile) {
        const { openButtonElement, mainElement, checkboxElement } = createModal();
        //
        const iframeElement = document.createElement("iframe");
        const redirectUri = window.encodeURIComponent(window.location.href);
        iframeElement.src = `https://7mo.nl/login?redirect_uri=${redirectUri}`;
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
