//#########################################################################################

// Googleフォントを読み込む
async function fontInit(thisPageSetting) {
    const css1 = document.createElement('link');
    css1.rel = 'stylesheet';
    if (thisPageSetting.fontFamily["Hannari"]) {
        css1.href = "https://fonts.googleapis.com/earlyaccess/hannari.css";
    }
    else if (thisPageSetting.fontFamily["Kokoro"]) {
        css1.href = "https://fonts.googleapis.com/earlyaccess/kokoro.css";
    }
    else if (thisPageSetting.fontFamily["Nico Moji"]) {
        css1.href = "https://fonts.googleapis.com/earlyaccess/nicomoji.css";
    }
    else if (thisPageSetting.fontFamily["Nikukyu"]) {
        css1.href = "https://fonts.googleapis.com/earlyaccess/nikukyu.css";
    }
    else if (thisPageSetting.fontFamily["M PLUS 1p"]) {
        css1.href = "https://fonts.googleapis.com/css?family=M+PLUS+1p";
    }
    else if (thisPageSetting.fontFamily["M PLUS Rounded 1c"]) {
        css1.href = "https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c";
    }
    else if (thisPageSetting.fontFamily["Sawarabi Mincho"]) {
        css1.href = "https://fonts.googleapis.com/css?family=Sawarabi+Mincho";
    }
    else if (thisPageSetting.fontFamily["Sawarabi Gothic"]) {
        css1.href = "https://fonts.googleapis.com/css?family=Sawarabi+Gothic";
    }
    else if (thisPageSetting.fontFamily["Noto Sans JP"]) {
        css1.href = "https://fonts.googleapis.com/css?family=Noto+Sans+JP";
    }
    document.head.appendChild(css1);
}
