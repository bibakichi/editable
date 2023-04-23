
//#########################################################################################

function createModal(props) {
    const isEnableClose = props?.isEnableClose ?? true;
    const id = uuid();
    const bodyLeftElement = document.getElementById("body_left");
    const checkboxElement = document.createElement("input");
    checkboxElement.classList.add('modal_trigger');
    checkboxElement.id = id + '_trigger';
    checkboxElement.type = "checkbox";
    bodyLeftElement.appendChild(checkboxElement);
    //
    const overlayElement = document.createElement("label");
    overlayElement.classList.add('modal_overlay');
    if (isEnableClose) {
        overlayElement.setAttribute('for', id + '_trigger');
    }
    bodyLeftElement.appendChild(overlayElement);
    //
    const contentOuterElement = document.createElement("div");
    contentOuterElement.classList.add('modal_outer');
    bodyLeftElement.appendChild(contentOuterElement);
    //
    const topBarElement = document.createElement("div");
    topBarElement.classList.add('dummy_breadcrumbs');
    contentOuterElement.appendChild(topBarElement);
    //
    const modalScrollElement = document.createElement("div");
    modalScrollElement.classList.add('modal_scroll');
    contentOuterElement.appendChild(modalScrollElement);
    //
    if (isEnableClose) {
        const modalCloseButtonWrapper = document.createElement("div");
        modalCloseButtonWrapper.classList.add('modal_close_button_wrapper');
        modalScrollElement.appendChild(modalCloseButtonWrapper);
        //
        const closeButtonElement = document.createElement("label");
        closeButtonElement.classList.add('buttonFlat');
        closeButtonElement.setAttribute('for', id + '_trigger');
        closeButtonElement.innerText = "戻る";
        modalCloseButtonWrapper.appendChild(closeButtonElement);
    }
    //
    const mainElement = document.createElement("div");
    modalScrollElement.appendChild(mainElement);
    //
    const openButtonElement = document.createElement("label");
    openButtonElement.setAttribute('for', id + '_trigger');
    //
    return { openButtonElement, mainElement, checkboxElement };
}
