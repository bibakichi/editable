//#########################################################################################
// 子ページへ行く
async function _goChildPage({ url, isFullSize, isTopbar }) {
    if (isFullSize) {
        document.querySelector('.modal_outer.modal_child').classList.add('full_size');
    }
    else {
        document.querySelector('.modal_outer.modal_child').classList.remove('full_size');
    }
    if (isTopbar) {
        document.getElementById('child_dummy_breadcrumbs').style.display = 'block';
    }
    else {
        document.getElementById('child_dummy_breadcrumbs').style.display = 'none';
    }
    if (isEditMode == false) {
        document.getElementById('children_page_modal_trigger').checked = true;
        await _sleep(300);
    }
    location.href = url;
}