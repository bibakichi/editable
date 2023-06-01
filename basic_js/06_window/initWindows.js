//#########################################################################################

// 親子ウィンドウの初期設定
async function initWindows() {
    console.log(urls);
    //
    if (isDebugTree) console.log("============================");
    if (isDebugTree) console.log("親ページへ繋がる戻るボタンやパンくずリストを生成します。");
    //
    // 必要ならば、画面上部の赤いバーを消す
    if (settings.length >= 3) {
        // 祖父
        if (!settings[2].isTopbar) {
            document.getElementById("grandfather_dummy_breadcrumbs").remove();
        }
    }
    if (settings.length >= 2) {
        // 親
        if (!settings[1].isTopbar) {
            document.getElementById("father_dummy_breadcrumbs").remove();
        }
    }
    if (settings.length >= 1) {
        // 今のページ
        const breadcrumbs = document.getElementById("breadcrumbs");
        if (!settings[0].isTopbar) {
            breadcrumbs.remove();
        }
        else {
            // 画面上部のパンくずリストを書き換える
            for (let i = settings.length - 1; i >= 0; i--) {
                if (i == 1) {
                    breadcrumbs.innerHTML += `<label for="this_page_modal_trigger">${settings[i].title}</label>`;
                }
                else {
                    breadcrumbs.innerHTML += `<a href="${urls[i]}">${settings[i].title}</a>`;
                }
                //
                if (i > 0) {
                    breadcrumbs.innerHTML += '&nbsp;&gt;&nbsp;';
                }
            }
        }
    }
    //
    // 必要ならば、全画面にする
    if (settings.length >= 2) {
        if (settings[1].isFullSize) {
            // 全画面のページに戻る場合
            const element = document.querySelector('.modal_parent.modal_outer');
            element.classList.add('full_size');
        }
    }
    if (settings.length >= 1) {
        const element = document.querySelector('#this_page_modal_trigger+.modal_overlay+.modal_outer');
        if (settings[0].isFullSize) {
            element.classList.add('full_size');
        }
        else {
            element.classList.remove('full_size');
        }
    }
    //
    // 戻るボタンをセットする
    if (settings.length >= 2) {
        const trigger = document.getElementById('this_page_modal_trigger');
        trigger.addEventListener('change', async () => {
            if (isEditMode == false) {
                await _sleep(300);
            }
            else {
                trigger.checked = true;
            }
            window.location.href = settings[1].url;
        });
        const buttons = document.getElementsByClassName("closeButtonThisPage");
        for (const button of buttons) {
            button.style.display = "block";
        }
    }
    //
    //
    if (isDebugTree) console.log("============================");
    if (isDebugTree) console.log("子ページへ繋がるリンクを再生成します。");
    //
    const linkElements = document.querySelectorAll("a");
    for (const linkElement of linkElements) {
        const href = linkElement.getAttribute('href');
        if (isDebugTree) console.log("\naタグを発見");
        if (isDebugTree) console.log("  文章：" + linkElement.innerText.slice(0, 8) + ((linkElement.innerText.length > 8) ? '...' : ''));
        if (isDebugTree) console.log("  URL：" + _getShortUrlToDisplay(href));
        if (
            (
                (!href)
                || href.startsWith('http')
                || href.startsWith('../')
                || href.startsWith('index.html')
                || href.startsWith('./index.html')
                || href.startsWith('file:')
                || href.startsWith('tel:')
                || href.startsWith('mailto:')
            )
            && (!linkElement.classList.contains('go_child'))
        ) {
            if (isDebugTree) console.log("  そのままにします。");
        }
        else {
            const buttonElement = document.createElement('button');
            buttonElement.innerHTML = linkElement.innerHTML;
            const names = linkElement.getAttributeNames();
            for (const name of names) {
                buttonElement.setAttribute(name, linkElement.getAttribute(name));
            }
            const settingUrl = new URL('setting.js', new URL(href, window.location)).toString();
            const { isFullSize, isTopbar } = await _loadSetting(settingUrl);
            buttonElement.addEventListener('click', async () => {
                await _goChildPage({
                    url: href,
                    isFullSize: isFullSize,
                    isTopbar: isTopbar,
                });
            });
            linkElement.replaceWith(buttonElement);
            if (isDebugTree) console.log("  buttonタグに置き換えました。");
        }
    }
    if (isDebugTree) console.log("\n============================");
}