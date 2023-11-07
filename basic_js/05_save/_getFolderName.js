//#########################################################################################
function _getFolderName() {
    const paths = location.pathname.split('/');
    paths.pop();    // 末尾の「index.html」を取り除く
    if (paths.length == 0) {
        return "/";
    }
    const folderName = paths.pop();
    if (folderName == "new") {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${year}${month}${day}_${hours}${minutes}`;
    }
    return folderName;
}