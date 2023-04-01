//#########################################################################################
// 【デバッグ表示用】URLを省略して、末尾だけを取得
function _getShortUrlToDisplay(url) {
    const url2 = url.split('?')[0];
    if (url2.length > 20) {
        return '...' + url2.slice(-20);
    }
    else {
        return url2;
    }
}
