//#########################################################################################

function _showLoader() {
    let outer = document.getElementById("loader");
    if (outer) return;
    outer = document.createElement('div');
    outer.id = 'loader';
    outer.appendChild(document.createElement('div'));
    document.body.appendChild(outer);
}

function _deleteLoader() {
    let outer = document.getElementById("loader");
    if (outer) {
        outer.remove();
    }
}
