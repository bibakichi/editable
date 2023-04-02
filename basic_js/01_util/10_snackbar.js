//#########################################################################################

function _showSnackbar(text) {
    let element = document.getElementById("snackbar");
    if (!element) {
        element = document.createElement('div');
        element.id = 'snackbar';
    }
    element.innerHTML = text;
}

function _deleteSnackbar() {
    let element = document.getElementById("snackbar");
    if (element) {
        element.remove();
    }
}
