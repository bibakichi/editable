//#########################################################################################
async function _writeSaveData(blockId, newSaveData) {
    const innerElement = document.getElementById(blockId);
    const jsonElement = innerElement.parentElement.querySelector('.json');
    if (!jsonElement) {
        return;
    }
    const pastSaveData = JSON.parse(jsonElement.textContent);
    jsonElement.innerText = JSON.stringify({
        ...pastSaveData,
        ...newSaveData,
        blockId: pastSaveData.blockId,
    });
}
