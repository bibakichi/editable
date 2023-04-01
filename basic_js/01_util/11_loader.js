//#########################################################################################

function _showLoader() {
    let element = document.getElementById("loader");
    if (element) return;
    element = document.createElement('div');
    element.id = 'loader';
    element.appendChild(document.createElement('div'));
    try {
        const parent = document.querySelector("main");
        if (!parent) {
            alert("main が見つかりません");
            return;
        }
        parent.appendChild(element);
    }
    catch (e) { }
}

function _deleteLoader() {
    let element = document.getElementById("loader");
    if (element) {
        element.remove();
    }
}