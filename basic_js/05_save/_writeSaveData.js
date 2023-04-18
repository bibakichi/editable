//#########################################################################################
async function _writeSaveData(blockId, saveData) {
    const innerElement = document.getElementById(blockId);
    console.log(innerElement);
    const jsonElement = innerElement.querySelector('~.json');
    console.log(jsonElement);
    if (!jsonElement) {
        return;
    }
    jsonElement.innerText = JSON.stringify(saveData);
}
