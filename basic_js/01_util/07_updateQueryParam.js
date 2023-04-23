//#########################################################################################
// ページを再読み込みせずに、クエリパラメータを更新
function _updateQueryParam(key, value) {
    const params = new URLSearchParams(location.search);
    if (value) {
        params.set(key, value);
    }
    else {
        params.delete(key);
    }
    const text = params.toString();
    if (text) {
        history.replaceState(null, document.title, '?' + text);
    }
    else {
        history.replaceState(null, document.title, '');
    }
}
