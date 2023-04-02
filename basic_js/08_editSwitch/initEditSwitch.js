//#########################################################################################
async function initEditSwitch() {
    const editSwitchElement = document.getElementById('edit-switch');
    editSwitchElement.addEventListener("change", async function () {
        if (this.checked) {
            // 編集スイッチがONになったとき
            await _editEnable();
        }
        else {
            // 編集スイッチがOFFになったとき
            window.location.reload();
        }
    });
}