
function _changeBaseColor({ red, green, blue }) {
    const rootElement = document.querySelector(':root');
    rootElement.style.setProperty('--base-color', `rgb(${red},${green},${blue})`);
    rootElement.style.setProperty('--base-color-dark', `rgb(${red * 0.7},${green * 0.7},${blue * 0.7})`);

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
        rootElement.style.setProperty('--contrast-color', "#555");
        // ベースカラーの上の文字は黒色にする
        rootElement.style.setProperty('--contrast-color2', "black");
    }
    else {
        // ベースカラーが濃い色の場合
        //
        // 白背景の上の文字をベースカラーにする
        rootElement.style.setProperty('--contrast-color', `rgb(${red},${green},${blue})`);
        // ベースカラーの上の文字は白色にする
        rootElement.style.setProperty('--contrast-color2', "white");
    }
}