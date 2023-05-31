//#########################################################################################

// メインコンテンツの表示
async function initMainContents() {
    const mainContents = document.getElementById('main_contents');
    for (const outerElement of mainContents.querySelectorAll(":scope>*")) {
        const jsonElement = outerElement.querySelector('.json');
        if (!jsonElement) {
            const sortableItem = new SortableItem({
                isEnable: isEditable,
                enableCopy: false,
            });
            const innerElements = outerElement.querySelectorAll(":scope>*");
            if (innerElements.length == 1) {
                sortableItem.innerElement = innerElements[0];
            }
            else {
                for (const e of innerElements) {
                    sortableItem.innerElement.appendChild(e);
                }
            }
            outerElement.replaceWith(sortableItem.outerElement);
            continue;
        }
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