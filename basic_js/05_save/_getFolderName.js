//#########################################################################################
function _getFolderName() {
    const paths = location.pathname.split('/');
    paths.pop();    // 末尾の「index.html」を取り除く
    if (paths.length == 0) {
        return "/";
    }
    const folderName = paths.pop();
    if (folderName == "new") {
        return getDateText();
    }
    return folderName;
}