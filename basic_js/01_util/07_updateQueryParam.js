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
    history.replaceState(null, document.title, '?' + params.toString());
}
