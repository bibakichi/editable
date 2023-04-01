
function createModal() {
    const id = _uuid();
    `
    <input class="modal_trigger" id="id_trigger" type="checkbox">
    <label class="modal_overlay" for="id_trigger"></label>
    <div class="modal_outer">
        <div class="dummy_breadcrumbs"></div>
        <div class="modal_scroll">
            <div class="modal_close_button_wrapper">
                <label for="id_trigger" class="buttonFlat">戻る</label>
            </div>
            <main id="id">
                <br>
                <br>
            </main>
        </div>
    </div>
    `
    const bodyLeftElement = document.getElementById("body_left");
    const triggerElement = document.createElement("input");
    triggerElement.classList.add('modal_trigger');
    triggerElement.id = id + '_trigger';
    triggerElement.type = "checkbox";
    bodyLeftElement.appendChild(triggerElement);
    //
    const overlayElement = document.createElement("label");
    overlayElement.classList.add('modal_overlay');
    overlayElement.setAttribute('for', id + '_trigger');
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
    const modalCloseButtonWrapper = document.createElement("div");
    modalCloseButtonWrapper.classList.add('modal_close_button_wrapper');
    modalScrollElement.appendChild(modalCloseButtonWrapper);
    //
    const closeButtonElement = document.createElement("label");
    closeButtonElement.classList.add('buttonFlat');
    closeButtonElement.setAttribute('for', id + '_trigger');
    closeButtonElement.innerText = "戻る";
    modalCloseButtonWrapper.appendChild(closeButtonElement);
    //
    const mainElement = document.createElement("div");
    modalScrollElement.appendChild(mainElement);
    //
    const openButtonElement = document.createElement("label");
    openButtonElement.setAttribute('for', id + '_trigger');
    //
    return { openButtonElement, mainElement };
}