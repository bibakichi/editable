//#########################################################################################

async function _getMicrosoftProfile() {
    if (microsoftProfile) {
        return microsoftProfile;
    }
    microsoftProfile = await loadMicrosoftProfile();
    if (!microsoftProfile) {
        const redirectUri = new URL(window.location.href);
        redirectUri.searchParams.set("editmode", 1);
        const redirectUriText = window.encodeURIComponent(redirectUri.toString());
        window.location.href = `https://7mo.nl/login?redirect_uri=${redirectUriText}`;
    }
    return microsoftProfile;
}
