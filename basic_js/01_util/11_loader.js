//#########################################################################################

function _showLoader() {
    let outer = document.getElementById("loader");
    if (outer) return;
    outer = document.createElement('div');
    outer.id = 'loader';
    outer.appendChild(document.createElement('div'));
    try {
        document.body.appendChild(divElement);
    }
    catch (e) { }
}

function _deleteLoader() {
    let outer = document.getElementById("loader");
    if (outer) {
        outer.remove();
    }
}
