//#########################################################################################
// 今のページのファイル名を取得
function _getNowFileName() {
    return location.href.split('/').pop().split('?')[0];
}