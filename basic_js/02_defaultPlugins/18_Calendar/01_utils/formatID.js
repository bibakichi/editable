
//全角を半角に直す関数
function toHalfWidth(strVal) {
    // 半角変換
    var halfVal = strVal.replace(/[！-～]/g,
        function (tmpStr) {
            // 文字コードをシフト
            return String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0);
        }
    );
    // 文字コードシフトで対応できない文字の変換
    return halfVal.replace(/”/g, "\"")
        .replace(/’/g, "'")
        .replace(/‘/g, "`")
        .replace(/￥/g, "\\")
        .replace(/　/g, " ")
        .replace(/〜/g, "~");
}

//文字列を0で埋める関数
//numにオリジナルの数字を、lengthに桁数をいれてください。
function zeroPadding(num, length) {
    return ('0000000000' + num).slice(-length);
}

//学籍番号を整形する関数
function formatID(id) {
    if (id == '' || id == null) {
        return '';
    }
    id = toHalfWidth(id);
    id = zeroPadding(id, 8);
    id = id.toUpperCase();
    return id;
}