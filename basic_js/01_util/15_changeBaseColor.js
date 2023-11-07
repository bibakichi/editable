
//#########################################################################################

function _numberToHex(number) {
    return ('0000' + number.toString(16)).slice(-2);
}

function _changeBaseColor({ red, green, blue }) {
    //
    // 16進数表記に変換
    //   deploy_files > cloud_plugins > PageSetting.js
    //   にて、カラーピッカーを使うので、16進数表記である必要がある
    const hexText = "#" + _numberToHex(red) + _numberToHex(green) + _numberToHex(blue);
    //
    document.documentElement.style.setProperty('--base-color', hexText);
    document.documentElement.style.setProperty('--base-color-dark', `rgb(${red * 0.7},${green * 0.7},${blue * 0.7})`);

    let flag = false;
    if (red > 200 && green > 200) {
        flag = true;
    }
    if (green > 200 && blue > 200) {
        flag = true;
    }
    if (green > 230) {
        flag = true;
    }
    if (flag) {
        // ベースカラーが白っぽい場合
        //
        // 白背景の上の文字をベースカラーにせず、黒色にする
        document.documentElement.style.setProperty('--contrast-color', "#555");
        // ベースカラーの上の文字は黒色にする
        document.documentElement.style.setProperty('--contrast-color2', "black");
    }
    else {
        // ベースカラーが濃い色の場合
        //
        // 白背景の上の文字をベースカラーにする
        document.documentElement.style.setProperty('--contrast-color', `rgb(${red},${green},${blue})`);
        // ベースカラーの上の文字は白色にする
        document.documentElement.style.setProperty('--contrast-color2', "white");
    }
}
