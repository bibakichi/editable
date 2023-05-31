//#########################################################################################
function _generateHTML({
    title = 'たいとる',
    mainContents = '',
    basicJsPath,
    jsZipPath,
    isFullSize = true,
    faviconsFolderPath = 'https://mono-file.s3.ap-northeast-1.amazonaws.com/favicons/',
}) {
    const nowDate = new Date();
    return `
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>${title}</title>
        <meta name="author" content="福岡大学ものづくりセンター">
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
        <meta name="theme-color" content="#8d0000"> <!-- テーマ色を設定 -->
        <!-- -->
        <!-- ビバ吉アイコンの読み込み -->
        <meta name="msapplication-square70x70logo" content="${faviconsFolderPath}site-tile-70x70.png">
        <meta name="msapplication-square150x150logo" content="${faviconsFolderPath}site-tile-150x150.png">
        <meta name="msapplication-wide310x150logo" content="${faviconsFolderPath}site-tile-310x150.png">
        <meta name="msapplication-square310x310logo" content="${faviconsFolderPath}site-tile-310x310.png">
        <meta name="msapplication-TileColor" content="#0078d7">
        <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="${faviconsFolderPath}favicon.ico">
        <link rel="icon" type="image/vnd.microsoft.icon" href="${faviconsFolderPath}favicon.ico">
        <link rel="apple-touch-icon" sizes="57x57" href="${faviconsFolderPath}apple-touch-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="${faviconsFolderPath}apple-touch-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="${faviconsFolderPath}apple-touch-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="${faviconsFolderPath}apple-touch-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="${faviconsFolderPath}apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="${faviconsFolderPath}apple-touch-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="${faviconsFolderPath}apple-touch-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="${faviconsFolderPath}apple-touch-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="${faviconsFolderPath}apple-touch-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="36x36" href="${faviconsFolderPath}android-chrome-36x36.png">
        <link rel="icon" type="image/png" sizes="48x48" href="${faviconsFolderPath}android-chrome-48x48.png">
        <link rel="icon" type="image/png" sizes="72x72" href="${faviconsFolderPath}android-chrome-72x72.png">
        <link rel="icon" type="image/png" sizes="96x96" href="${faviconsFolderPath}android-chrome-96x96.png">
        <link rel="icon" type="image/png" sizes="128x128" href="${faviconsFolderPath}android-chrome-128x128.png">
        <link rel="icon" type="image/png" sizes="144x144" href="${faviconsFolderPath}android-chrome-144x144.png">
        <link rel="icon" type="image/png" sizes="152x152" href="${faviconsFolderPath}android-chrome-152x152.png">
        <link rel="icon" type="image/png" sizes="192x192" href="${faviconsFolderPath}android-chrome-192x192.png">
        <link rel="icon" type="image/png" sizes="256x256" href="${faviconsFolderPath}android-chrome-256x256.png">
        <link rel="icon" type="image/png" sizes="384x384" href="${faviconsFolderPath}android-chrome-384x384.png">
        <link rel="icon" type="image/png" sizes="512x512" href="${faviconsFolderPath}android-chrome-512x512.png">
        <link rel="icon" type="image/png" sizes="36x36" href="${faviconsFolderPath}icon-36x36.png">
        <link rel="icon" type="image/png" sizes="48x48" href="${faviconsFolderPath}icon-48x48.png">
        <link rel="icon" type="image/png" sizes="72x72" href="${faviconsFolderPath}icon-72x72.png">
        <link rel="icon" type="image/png" sizes="96x96" href="${faviconsFolderPath}icon-96x96.png">
        <link rel="icon" type="image/png" sizes="128x128" href="${faviconsFolderPath}icon-128x128.png">
        <link rel="icon" type="image/png" sizes="144x144" href="${faviconsFolderPath}icon-144x144.png">
        <link rel="icon" type="image/png" sizes="152x152" href="${faviconsFolderPath}icon-152x152.png">
        <link rel="icon" type="image/png" sizes="160x160" href="${faviconsFolderPath}icon-160x160.png">
        <link rel="icon" type="image/png" sizes="192x192" href="${faviconsFolderPath}icon-192x192.png">
        <link rel="icon" type="image/png" sizes="196x196" href="${faviconsFolderPath}icon-196x196.png">
        <link rel="icon" type="image/png" sizes="256x256" href="${faviconsFolderPath}icon-256x256.png">
        <link rel="icon" type="image/png" sizes="384x384" href="${faviconsFolderPath}icon-384x384.png">
        <link rel="icon" type="image/png" sizes="512x512" href="${faviconsFolderPath}icon-512x512.png">
        <link rel="icon" type="image/png" sizes="16x16" href="${faviconsFolderPath}icon-16x16.png">
        <link rel="icon" type="image/png" sizes="24x24" href="${faviconsFolderPath}icon-24x24.png">
        <link rel="icon" type="image/png" sizes="32x32" href="${faviconsFolderPath}icon-32x32.png">
        <!-- -->
        <style>
            /* WYSIWYGエディター「Quill」 */
            ${quillCSS}
            
            /* 数式ライブラリ「KaTex」 */
            ${kaTexCSS}
            
            /* 自作CSS */
            ${_minifyCSS(bacicCSS)}
        </style >
        <!-- -->
        <!-- 共通JavaScript -->
        <script type="text/javascript">
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
        <script defer id="basic_js" src="${basicJsPath.split("?")[0]}?timestamp=${nowDate.getTime()}"></script>
        <script defer id="jszip" src="${jsZipPath.split("?")[0]}?timestamp=${nowDate.getTime()}"></script>
        <!-- -->
        <!-- WYSIWYGエディター「Quill」を読み込み -->
        <script defer src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
        <!-- -->
        <!-- 数式ライブラリ「KaTex」を読み込む -->
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.6/dist/katex.min.js" integrity="sha384-j/ZricySXBnNMJy9meJCtyXTKMhIJ42heyr7oAdxTDBy/CYA9hzpMo+YTNV5C+1X" crossorigin="anonymous"></script>
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
                    <header>
                        <div class="header_left">
                        </div>
                        <div class="header_right">
                        </div>
                    </header>
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
                            福岡大学工学部ものづくりセンター
                            <div style="padding: 3px 0 0 10px;">
                                <a target="_blank" href="https://goo.gl/maps/qD7ZYrmeWpW7uNgSA">
                                    〒814-018 福岡市城南区七隈8-19-1 福岡大学 4号館 1F
                                </a><br>
                                ホームページ: <a href="http://www.tec.fukuoka-u.ac.jp/mono/">http://www.tec.fukuoka-u.ac.jp/mono/</a><br>
                                メール: <a target="_blank" href="mailto:mono@adm.fukuoka-u.ac.jp">mono@adm.fukuoka-u.ac.jp</a><br>
                                電話: <a href="tel:0928716631">092-871-6631</a>（代）<br>
                                内線: 6935
                            </div>
                        </address>
                        &copy; 2023 福岡大学工学部ものづくりセンター
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