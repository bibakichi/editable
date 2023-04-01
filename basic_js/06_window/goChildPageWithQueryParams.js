//#########################################################################################
// クエリパラメータを維持したまま子ページへ行く
async function _goChildPageWithQueryParams({ url, isFullSize, isTopbar }) {
    const addQueryParams = new URLSearchParams(new URL(url, window.location).search);
    const queryParams = new URLSearchParams(window.location.search);
    for (const [key, value] of addQueryParams) {
        queryParams.set(key, value);
    }
    await _goChildPage({
        url: url.split('?')[0] + '?' + queryParams.toString(),
        isFullSize: isFullSize,
        isTopbar: isTopbar,
    });
}
