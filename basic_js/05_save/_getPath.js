//#########################################################################################
function _getPath() {
    const paths = location.pathname.split('/');
    paths.pop();    // 末尾の「index.html」を取り除く
    if (paths.length < (settings.length - 1)) {
        return null;
    }
    if (paths.length == 0) {
        return null;
    }
    paths.pop();
    let pathName = _getFolderName();
    while (paths.length > 0) {
        pathName = paths.pop() + "＞" + pathName;
    }
    return pathName;
}