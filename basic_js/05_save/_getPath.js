//#########################################################################################
function _getPath() {
    let pathName;
    const paths = location.pathname.split('/');
    paths.pop();    // 末尾の「index.html」を取り除く
    if (paths.length < (settings.length - 1)) {
        return null;
    }
    for (let i = 0; i < (settings.length - 1); i++) {
        if (i == 0) {
            pathName = paths.pop();
        }
        else {
            pathName = paths.pop() + "＞" + pathName;
        }
    }
    return pathName;
}