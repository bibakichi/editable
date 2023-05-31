//#########################################################################################

// メインコンテンツの表示
async function initMainContents() {
    const mainContents = document.getElementById('main_contents');
    for (const outerElement of mainContents.querySelectorAll(":scope>*")) {
        const jsonElement = outerElement.querySelector('.json');
        if (!jsonElement) continue;
        const saveData = JSON.parse(jsonElement.textContent);
        const outerElement2 = await _renderHeavy(saveData);
        if (outerElement2) {
            outerElement.replaceWith(outerElement2);
        }
        else {
            outerElement.remove();
        }
    }
}