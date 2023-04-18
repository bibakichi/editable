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
        const redirectUri = encodeURIComponent(window.href);
        iframeElement.src = `https://7mo.nl/login?redirect_uri=${redirectUri}`;
        mainElement.appendChild(iframeElement);
        //
        checkboxElement.checked = true;
    }
}
