//#########################################################################################
function _generateHTML({
    title = 'たいとる',
    mainContents = '',
    basicJsPath,
    jsZipPath,
    isFullSize = true,
    externalFiles,
    baseColor,
    baseColorDark,
    contrastColor,
    contrastColor2,
    officeName = '福岡大学ものづくりセンター',
    phoneNumber = '092-871-6631',
    extensionNumber = '6935',
    website = 'http://www.tec.fukuoka-u.ac.jp/mono/',
    mapUrl = 'https://goo.gl/maps/qD7ZYrmeWpW7uNgSA',
    address = '〒814-018 福岡市城南区七隈8-19-1 福岡大学 4号館 1F',
}) {
    const nowDate = new Date();
    return `<!DOCTYPE html>
<!--

【 Visual Studio Codeを使って、このコードを編集する人へ 】
    
    折り返し表示をOFFにすると見やすくなります。

    WindowsとLinuxでは [Alt] + [Z] キー

    macOSでは [Option] + [Z] キー

        で切り替えることができます。

-->
<html lang="ja">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>${title}</title>
        <meta name="author" content="${officeName}">
        <!-- 
            noindex: 検索に引っかからないようにする
            nofollow: クローラー（検索プログラム）を、このページから他のページへ移動しないようにする
            noarchive: 検索結果にキャッシュリンクを表示しない
            <meta name="robots" content="noindex,nofollow,noarchive">
        -->
        <meta name="robots" content="noarchive">
        <!---->
        <meta http-equiv="Cache-Control" content="no-cache"> <!--キャッシュさせない-->
        <meta name="google" content="notranslate"> <!-- google翻訳されないようにする -->
        <meta name="format-detection" content="telephone=no"> <!-- 電話番号の自動リンク機能を無効化 -->
        <meta name="theme-color" content="var(--base-color)"> <!-- テーマ色を設定 -->
        <link class="Do_not_store_in_HTML" rel="manifest" href="manifest.json">
        <!-- -->
        <style class="Do_not_store_in_HTML">

            /* グローバルにCSS変数を宣言する */
            :root {
                /* ベースカラー */
                --base-color: ${baseColor};
                /**/
                /* 暗めのベースカラー */
                --base-color-dark: ${baseColorDark};
                /**/
                /* 白背景の上で映える文字色 */
                --contrast-color: ${contrastColor};
                /**/
                /* ベースカラーの上で映える文字色 */
                --contrast-color2: ${contrastColor2};
            }

            /* WYSIWYGエディター「Quill」 */
            ${quillCSS}
            
            /* 数式ライブラリ「KaTex」 */
            ${kaTexCSS}
            
            /* 自作CSS */
            ${_minifyCSS(bacicCSS)}
        </style >
        <!-- -->
        <!-- 共通JavaScript -->
        <script type="text/javascript" class="Do_not_store_in_HTML">
            function _initReload() {
                const elements = document.querySelectorAll('.modal_trigger');
                for (const element of elements) {
                    element.checked = false; //サブモーダルを閉じる
                }
                document.getElementById('this_page_modal_trigger').checked = true; //メインモーダルを開く
            }

            // キャッシュされたページが表示されたとき
            window.addEventListener('pageshow', _initReload);

            //ページを離れた時やリロード時
            window.addEventListener('unload', _initReload);
        </script>
        <script defer class="Do_not_store_in_HTML" id="basic_js" src="${basicJsPath.split("?")[0]}?timestamp=${nowDate.getTime()}"></script>
        <script defer class="Do_not_store_in_HTML" id="jszip" src="${jsZipPath.split("?")[0]}?timestamp=${nowDate.getTime()}"></script>
        <!-- -->
        <!-- WYSIWYGエディター「Quill」を読み込み -->
        <script defer class="Do_not_store_in_HTML" src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
        <!-- -->
        <!-- 数式ライブラリ「KaTex」を読み込む -->
        <script defer class="Do_not_store_in_HTML" src="https://cdn.jsdelivr.net/npm/katex@0.16.6/dist/katex.min.js" integrity="sha384-j/ZricySXBnNMJy9meJCtyXTKMhIJ42heyr7oAdxTDBy/CYA9hzpMo+YTNV5C+1X" crossorigin="anonymous"></script>
        <!-- -->
        <!-- -->${externalFiles}
    </head>

    <body>
        <input type="checkbox" id="toolbox_more">
        <div id="body_right">
        </div>
        <div id="body_left">
            <div class="dummy_breadcrumbs" id="grandfather_dummy_breadcrumbs"></div>
            <!--  -->
            <!-- 子ページ遷移アニメーション用のモーダル -->
            <input class="modal_trigger modal_child" id="children_page_modal_trigger" type="checkbox">
            <label class="modal_overlay modal_child" for="children_page_modal_trigger"></label>
            <div class="modal_outer modal_child">
                <div class="dummy_breadcrumbs" id="child_dummy_breadcrumbs"></div>
            </div>
            <!--  -->
            <!-- メインモーダル -->
            <input class="modal_trigger modal_main" id="this_page_modal_trigger" type="checkbox" checked>
            <label class="modal_overlay modal_main" for="this_page_modal_trigger"></label>
            <div class="modal_outer modal_main ${isFullSize ? 'full_size' : ''}">
                <div id="breadcrumbs"> </div>
                <div class="modal_scroll">
                    <div class="modal_close_button_wrapper">
                        <label for="this_page_modal_trigger" class="buttonFlat closeButtonThisPage">戻る</label>
                    </div>
                    <main id="main_contents">${mainContents}
                    </main>
                    <div class="actions">
                        <div id="edit-switch-wrapper">
                            <span class="edit-label">編集する</span>
                            <label class="switch">
                                <input type="checkbox" id="edit-switch">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                    <footer>
                        <address>
                            ${officeName}
                            <div style="padding: 3px 0 0 10px;">
                                <a target="_blank" href="${mapUrl}">
                                    ${address}
                                </a>
                                <br>
                                ホームページ: <a href="${website}">${website}</a><br>
                                電話: <a href="tel:${phoneNumber.replaceAll("-", "")}">${phoneNumber}</a>
                                ${extensionNumber ? ("<br>内線:" + extensionNumber) : ""}
                            </div>
                        </address>
                        &copy; ${nowDate.getFullYear()} ${officeName}
                    </footer>
                </div>
            </div>
            <!--  -->
            <!-- 親ページ遷移アニメーション用のモーダル -->
            <label class="modal_overlay modal_parent"></label>
            <div class="modal_outer modal_parent">
                <div class="dummy_breadcrumbs" id="father_dummy_breadcrumbs"></div>
            </div>
        </div>
    </body>
</html>
`;
}