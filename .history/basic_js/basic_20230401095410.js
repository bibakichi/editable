const isDebugTree = false;
const isDebugPlugin = false;

//#########################################################################################

var isEnableLeaveCheck = false; // この変数がtrueのときは、モーダルのアニメーションを表示しない

// 「このサイトを離れますか？」を有効にする
function enableLeaveCheck() {
    isEnableLeaveCheck = true;
    window.onbeforeunload = function (event) {
        event.preventDefault();
        event.returnValue = 'Check';
    }
}

// 「このサイトを離れますか？」を無効にする
function disableLeaveCheck() {
    window.onbeforeunload = null;
    isEnableLeaveCheck = false;
}

//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################



async function _editEnable() {
    document.getElementById('body_right').style.display = 'flex';
    document.getElementById('edit-switch-wrapper').style.opacity = 1;
    document.getElementById('edit-switch').checked = true;
    //
    const mainContents = document.getElementById('main_contents');
    for (const sortableItem of mainContents.children) {
        const jsonElement = sortableItem.querySelector('.json');
        if (!jsonElement) {
            alert("ツールボックスのHTMLに.blockTypeが設定されていません");
            continue;
        }
        const saveData = JSON.parse(jsonElement.textContent);
        if (!saveData) continue;
        const plugin = plugins[saveData.blockType];
        if (!plugin) continue;
        const func = plugin?.viewer?.changeEditMode;
        if (typeof func !== "function") continue;
        await func("block_" + sortableItem.id);
    }
    // アイテムがなくなったとき用のドロップ専用エリア
    const sortableItem = new SortableItem({ isDropOnly: true });
    sortableItem.onDropBrotherJson = ({ jsonData, isBefore }) => _onDropMainBlock({ jsonData, isBefore, sortableItem });
    sortableItem.outerElement.classList.add("dropOnly");
    mainContents.appendChild(sortableItem.outerElement);
}


document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('edit-switch').addEventListener("change", async function () {
        if (this.checked) {
            // 編集スイッチがONになったとき
            await _editEnable();
        }
        else {
            // 編集スイッチがOFFになったとき
            window.location.reload();
        }
    });
});

//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################


//#########################################################################################

function uuid() {
    // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
    // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
}

//#########################################################################################

function _getTimeDiff(timestamp) {
    // 差分 = 現在の日時 - 投稿日時 
    let diff = new Date().getTime() - timestamp;
    // 経過時間をDateに変換
    let progress = new Date(diff);
    if (progress.getUTCFullYear() - 1970) {
        return progress.getUTCFullYear() - 1970 + '年前';
    } else if (progress.getUTCMonth()) {
        return progress.getUTCMonth() + 'ヶ月前';
    } else if (progress.getUTCDate() - 1) {
        return progress.getUTCDate() - 1 + '日前';
    } else if (progress.getUTCHours()) {
        return progress.getUTCHours() + '時間前';
    } else if (progress.getUTCMinutes()) {
        return progress.getUTCMinutes() + '分前';
    } else {
        return 'たった今';
    }
}

//#########################################################################################

// 特定のHTML要素がロードされるまで待つ関数
const _waitLoad = (element) => new Promise((resolve, reject) => {
    element.addEventListener("error", reject);
    element.addEventListener("load", resolve);
});

//#########################################################################################
// ページ遷移

// ページを再読み込みせずに、クエリパラメータを更新
function _updateQueryParam(key, value) {
    const params = new URLSearchParams(location.search);
    if (value) {
        params.set(key, value);
    }
    else {
        params.delete(key);
    }
    history.replaceState(null, document.title, '?' + params.toString());
}

// 今のページのファイル名を取得
function _getNowFileName() {
    return location.href.split('/').pop().split('?')[0];
}

// 子ページへ行く
async function _goChildPage({ url, isFullSize, isTopbar }) {
    if (isFullSize) {
        document.querySelector('.modal_outer.modal_child').classList.add('full_size');
    }
    else {
        document.querySelector('.modal_outer.modal_child').classList.remove('full_size');
    }
    if (isTopbar) {
        document.getElementById('child_dummy_breadcrumbs').style.display = 'block';
    }
    else {
        document.getElementById('child_dummy_breadcrumbs').style.display = 'none';
    }
    if (isEnableLeaveCheck == false) {
        document.getElementById('children_page_modal_trigger').checked = true;
        await _sleep(300);
    }
    location.href = url;
}

// クエリパラメータを維持したまま子ページへ行く
async function _goChildPageWithQueryParams({ url, isFullSize, isTopbar }) {
    const addQueryParams = new URLSearchParams(new URL(url, window.location).search);
    const queryParams = new URLSearchParams(window.location.search);
    for (const [key, value] of addQueryParams) {
        queryParams.set(key, value);
    }
    await _goChildPage({
        url: url.split('?')[0] + '?' + queryParams.toString(),
        isFullSize: isFullSize,
        isTopbar: isTopbar,
    });
}

//#########################################################################################

// 【デバッグ用】URLを省略して、末尾だけを取得
function _getShortUrlToDisplay(url) {
    const url2 = url.split('?')[0];
    if (url2.length > 20) {
        return '...' + url2.slice(-20);
    }
    else {
        return url2;
    }
}

//#########################################################################################

const _sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

//#########################################################################################

function _showSnackbar(text) {
    let element = document.getElementById("snackbar");
    if (!element) {
        element = document.createElement('div');
        element.id = 'snackbar';
    }
    element.innerHTML = text;
}

function _deleteSnackbar() {
    let element = document.getElementById("snackbar");
    if (element) {
        element.remove();
    }
}

//#########################################################################################

function _showLoader() {
    let element = document.getElementById("loader");
    if (element) return;
    element = document.createElement('div');
    element.id = 'loader';
    element.appendChild(document.createElement('div'));
    try {
        const parent = document.querySelector("main");
        if (!parent) {
            alert("main が見つかりません");
            return;
        }
        parent.appendChild(element);
    }
    catch (e) { }
}

function _deleteLoader() {
    let element = document.getElementById("loader");
    if (element) {
        element.remove();
    }
}

//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################

// 並び替え可能なリストのアイテム
class SortableItem {
    //
    // ドラッグ＆ドロップに必要な、外側のHTML要素（厚さゼロの枠なので、何も表示されない）
    get outerElement() { return this._outerElement; }
    //
    // 実際に表示される、内側のHTML要素
    set innerElement(innerElement) {
        innerElement.classList.add("innerElement");
        this._innerElement.replaceWith(innerElement);
        this._innerElement = innerElement;
    }
    get innerElement() { return this._innerElement; }
    //
    // ドラッグされたときに渡すJSONデータ
    set jsonData(jsonData) {
        this._jsonData = jsonData;
        //
        // outerElementの移動（ドラッグ）が始まった時のイベント
        const outerElement = this._outerElement;
        outerElement.ondragstart = function (event) {
            event.dataTransfer.setData("outerId", outerElement.id);  // データ転送用のデータをセット
            event.dataTransfer.setData("jsonData", JSON.stringify(jsonData));      // データ転送用のデータをセット
            outerElement.style.opacity = 0;
            const dropAreasList = document.getElementsByClassName('sortable_item_drop_areas');
            for (const dropAreas of dropAreasList) {
                dropAreas.style.display = 'block';
            }
        };
    }
    get jsonData() { return this._jsonData; }
    //
    // このアイテムの前後に、他のリストに所属しているアイテムが追加されたとき、何をすればいいか（関数）
    set onDropBrotherJson(func) {
        this._onDropBrotherJson = func;
        this._regenerateDropAreas();
    }
    get onDropBrotherJson() { return this._onDropBrotherJson; }
    //
    // このアイテムの前後にテキストが追加されたとき、何をすればいいか（関数）
    set onDropBrotherText(func) {
        this._onDropBrotherText = func;
        this._regenerateDropAreas();
    }
    get onDropBrotherText() { return this._onDropBrotherText; }
    //
    // このアイテムの前後に画像が追加されたとき、何をすればいいか（関数）
    set onDropBrotherImage(func) {
        this._onDropBrotherImage = func;
        this._regenerateDropAreas();
    }
    get onDropBrotherImage() { return this._onDropBrotherImage; }
    //
    // このアイテムの前後にファイルが追加されたとき、何をすればいいか（関数）
    set onDropBrotherFile(func) {
        this._onDropBrotherFile = func;
        this._regenerateDropAreas();
    }
    get onDropBrotherFile() { return this._onDropBrotherFile; }
    //
    // このアイテムの上に、他のアイテムをドロップできるか否か
    set isDroppable(flag = false) {
        this._isDroppable = flag;
    }
    get isDroppable() { return this._isDroppable; }
    //
    // このアイテムの上に、他のリストに所属しているアイテムがドロップされたとき、何をすればいいか（関数）
    set onDropChildJson(func) {
        this._onDropChildJson = func;
        this._regenerateDropAreas();
    }
    get onDropChildJson() { return this._onDropChildJson; }
    //
    // このアイテムの上にテキストがドロップされたとき、何をすればいいか（関数）
    set onDropChildText(func) {
        this._onDropChildText = func;
        this._regenerateDropAreas();
    }
    get onDropChildText() { return this._onDropChildText; }
    //
    // このアイテムの上に画像がドロップされたとき、何をすればいいか（関数）
    set onDropChildImage(func) {
        this._onDropChildImage = func;
        this._regenerateDropAreas();
    }
    get onDropChildImage() { return this._onDropChildImage; }
    //
    // このアイテムの上にファイルがドロップされたとき、何をすればいいか（関数）
    set onDropChildFile(func) {
        this._onDropChildFile = func;
        this._regenerateDropAreas();
    }
    get onDropChildFile() { return this._onDropChildFile; }


    _regenerateDropAreas() {
        if (this._isDragOnly) return;
        // ドロップエリアを作成（このアイテムの直前に、他のアイテムを追加するためのもの）
        const dropAreaTop = this._createDropAreaTop({
            isVertical: this._isVertical,
            outerElement: this._outerElement,
            isDroppable: this._isDroppable,
            onDropJson: async (jsonData) => await this._onDropBrotherJson({ jsonData, isBefore: true }),
            onDropText: async (text) => await this._onDropBrotherText({ text, isBefore: true }),
            onDropImage: async (img) => await this._onDropBrotherImage({ img, isBefore: true }),
            onDropFile: async (file) => await this._onDropBrotherFile({ file, isBefore: true }),
        });
        this._dropAreaTop.replaceWith(dropAreaTop);
        this._dropAreaTop = dropAreaTop;
        //
        if (!this._isDropOnly) {
            // ドロップエリアを作成（このアイテムの中にドロップするためのもの）
            const dropAreaMiddle = this._createDropAreaMiddle({
                isVertical: this._isVertical,
                outerElement: this._outerElement,
                isDroppable: this._isDroppable,
                onDragEnter: this._onDragEnter,
                onDragLeave: this._onDragLeave,
                onDragOver: this._onDragOver,
                onDrop: this._onDrop,
                onDropJson: this._onDropChildJson,
                onDropText: this._onDropChildText,
                onDropImage: this._onDropChildImage,
                onDropFile: this._onDropChildFile,
            });
            this._dropAreaMiddle.replaceWith(dropAreaMiddle);
            this._dropAreaMiddle = dropAreaMiddle;
            //
            // ドロップエリアを作成（このアイテムの直後に、他のアイテムを追加するためのもの）
            const dropAreaBottom = this._createDropAreaBottom({
                isVertical: this._isVertical,
                outerElement: this._outerElement,
                isDroppable: this._isDroppable,
                onDropJson: async (jsonData) => await this._onDropBrotherJson({ jsonData, isBefore: false }),
                onDropText: async (text) => await this._onDropBrotherText({ text, isBefore: false }),
                onDropImage: async (img) => await this._onDropBrotherImage({ img, isBefore: false }),
                onDropFile: async (file) => await this._onDropBrotherFile({ file, isBefore: false }),
            });
            this._dropAreaBottom.replaceWith(dropAreaBottom);
            this._dropAreaBottom = dropAreaBottom;
        }
    }

    constructor({ isDragOnly = false, isDropOnly = false }) {
        this._isDragOnly = isDragOnly;
        this._isDropOnly = isDropOnly;
        this._jsonData = {};
        this._isVertical = true;
        //
        // このアイテムの前後に、他のアイテムが追加（または移動）されたときの関数
        this._onDropBrotherJson = async ({ jsonData, isBefore = true }) => { };
        this._onDropBrotherText = async ({ text, isBefore = true }) => { };
        this._onDropBrotherImage = async ({ img, isBefore = true }) => { };
        this._onDropBrotherFile = async ({ file, isBefore = true }) => { };
        //
        // このアイテムの上に、他のアイテムをドロップできるか否か
        this._isDroppable = false;
        //
        // このアイテムの中に、他のアイテムが追加（または移動）されたときの関数
        this._onDropChildJson = async (jsonData) => { };
        this._onDropChildText = async (text) => { };
        this._onDropChildImage = async (img) => { };
        this._onDropChildFile = async (file) => { };
        this._onDragEnter = async () => { };
        this._onDragLeave = async () => { };
        this._onDragOver = async () => { };
        this._onDrop = async () => { };
        //
        const outerElement = document.createElement('div');
        outerElement.id = uuid();
        outerElement.draggable = true;
        outerElement.style.position = 'relative';
        outerElement.style.transition = 'opacity 0.1s';
        outerElement.style.cursor = 'grab';
        this._outerElement = outerElement;
        //
        const innerElement = document.createElement('div');
        innerElement.style.paddingTop = '50px';
        innerElement.classList.add("innerElement");
        this._innerElement = innerElement;
        outerElement.appendChild(innerElement);
        //
        if (!isDragOnly) {
            // ドロップエリアを作成（このアイテムの直前に、他のアイテムを追加するためのもの）
            this._dropAreaTop = this._createDropAreaTop({
                isVertical: this._isVertical,
                outerElement: this._outerElement,
                isDroppable: this._isDroppable,
                onDropJson: async (jsonData) => await this._onDropBrotherJson({ jsonData, isBefore: true }),
                onDropText: async (text) => await this._onDropBrotherText({ text, isBefore: true }),
                onDropImage: async (img) => await this._onDropBrotherImage({ img, isBefore: true }),
                onDropFile: async (file) => await this._onDropBrotherFile({ file, isBefore: true }),
            });
            if (!isDropOnly) {
                // ドロップエリアを作成（このアイテムの中にドロップするためのもの）
                this._dropAreaMiddle = this._createDropAreaMiddle({
                    isVertical: this._isVertical,
                    outerElement: this._outerElement,
                    isDroppable: this._isDroppable,
                    onDragEnter: this._onDragEnter,
                    onDragLeave: this._onDragLeave,
                    onDragOver: this._onDragOver,
                    onDrop: this._onDrop,
                    onDropJson: this._onDropChildJson,
                    onDropText: this._onDropChildText,
                    onDropImage: this._onDropChildImage,
                    onDropFile: this._onDropChildFile,
                });
                // ドロップエリアを作成（このアイテムの直後に、他のアイテムを追加するためのもの）
                this._dropAreaBottom = this._createDropAreaBottom({
                    isVertical: this._isVertical,
                    outerElement: this._outerElement,
                    isDroppable: this._isDroppable,
                    onDropJson: async (jsonData) => await this._onDropBrotherJson({ jsonData, isBefore: false }),
                    onDropText: async (text) => await this._onDropBrotherText({ text, isBinnerElementefore: false }),
                    onDropImage: async (img) => await this._onDropBrotherImage({ img, isBefore: false }),
                    onDropFile: async (file) => await this._onDropBrotherFile({ file, isBefore: false }),
                });
            }
            const dropAreas = document.createElement('div');
            dropAreas.classList.add('sortable_item_drop_areas');
            dropAreas.appendChild(this._dropAreaTop);
            if (!isDropOnly) {
                dropAreas.appendChild(this._dropAreaMiddle);
                dropAreas.appendChild(this._dropAreaBottom);
            }
            dropAreas.style.display = 'none';
            dropAreas.style.position = 'absolute';
            dropAreas.style.top = '-15px';
            dropAreas.style.height = 'calc(100% + 30px)';
            dropAreas.style.width = '100%';
            dropAreas.style.zIndex = 999;
            outerElement.appendChild(dropAreas);
        }
        if (!isDropOnly) {
            // outerElementの移動（ドラッグ）が始まった時のイベント
            outerElement.ondragstart = function (event) {
                event.dataTransfer.setData("outerId", outerElement.id);  // データ転送用のデータをセット
                event.dataTransfer.setData("jsonData", "{}");      // データ転送用のデータをセット
                outerElement.style.opacity = 0;
                const dropAreasList = document.getElementsByClassName('sortable_item_drop_areas');
                for (const dropAreas of dropAreasList) {
                    dropAreas.style.display = 'block';
                }
            };
            //
            // outerElementを移動（ドラッグ）している最中に連続してイベント発生
            outerElement.addEventListener("drag", function (event) {
                event.preventDefault();
            });
            //
            // outerElementの移動（ドラッグ）が終了したとき
            outerElement.addEventListener("dragend", function (event) {
                event.preventDefault();
                outerElement.style.opacity = 1;
                const dropAreasList = document.getElementsByClassName('sortable_item_drop_areas');
                for (const dropAreas of dropAreasList) {
                    dropAreas.style.display = 'none';
                }
            });
        }
    }

    // ドロップエリアを作成（このアイテムの直前に、他のアイテムを追加するためのもの）
    _createDropAreaTop({
        isVertical = true,
        outerElement,
        isDroppable = false,
        onDropJson = async (jsonData) => { },
        onDropText = async (text) => { },
        onDropImage = async (img) => { },
        onDropFile = async (file) => { },
    }) {
        const dropAreaTop = document.createElement('div');
        if (isDroppable) {
            dropAreaTop.style.height = '25%';
        }
        else {
            dropAreaTop.style.height = '50%';
        }
        this._setDropEvents({
            outerId: outerElement.id,
            element: dropAreaTop,
            onDragEnter: async () => {
                this._addInsertBarBefore(outerElement); //outerElementの直前に「挿入バー」を挿入
            },
            onDragLeave: async () => {
                this._removeInsertBarBefore(outerElement); //outerElementの直前の「挿入バー」を削除
            },
            onDragOver: async () => {
                this._addInsertBarBefore(outerElement); //outerElementの直前に「挿入バー」を挿入
            },
            onDrop: async () => {
                this._removeInsertBarBefore(outerElement); //outerElementの直前の「挿入バー」を削除
            },
            onDropJson: async (ballOuterId, jsonData) => {
                enableLeaveCheck(); // 「このサイトを離れますか？」を有効にする
                const ballItem = document.getElementById(ballOuterId);
                if (!ballItem) {
                    // 外部のブラウザ出身のアイテムがドロップされた場合
                    await onDropJson(jsonData);
                }
                else if (outerElement.parentElement == ballItem.parentElement) {
                    outerElement.before(ballItem);
                }
                else {
                    try {
                        await onDropJson(jsonData);
                        if (ballItem.parentElement.id !== "toolList" && ballItem.parentElement.id !== "toolShop") {
                            ballItem.remove();
                        }
                    }
                    catch (err) { }
                }
            },
            onDropText: onDropText,
            onDropImage: onDropImage,
            onDropFile: onDropFile,
        });
        return dropAreaTop;
    }

    // ドロップエリアを作成（このアイテムの中にドロップするためのもの）
    _createDropAreaMiddle({
        isVertical = true,
        outerElement,
        isDroppable = false,
        onDragEnter = async () => { },
        onDragLeave = async () => { },
        onDragOver = async () => { },
        onDrop = async () => { },
        onDropJson = async (jsonData) => { },
        onDropText = async (text) => { },
        onDropImage = async (img) => { },
        onDropFile = async (file) => { },
    }) {
        if (!isDroppable) {
            return document.createElement('div');
        }
        const dropAreaMiddle = document.createElement('div');
        this._setDropEvents({
            outerId: outerElement.id,
            element: dropAreaMiddle,
            onDragEnter: onDragEnter,
            onDragLeave: onDragLeave,
            onDragOver: onDragOver,
            onDrop: onDrop,
            onDropJson: async (ballListId, ballOuterId, jsonData) => {
                enableLeaveCheck(); // 「このサイトを離れますか？」を有効にする
                const ballItem = document.getElementById(ballOuterId);
                if (!ballItem) {
                    // 外部のブラウザ出身のアイテムがドロップされた場合
                    await onDropJson(jsonData);
                }
                try {
                    await onDropJson(jsonData);
                    if (ballItem.parentElement.id !== "toolList" && ballItem.parentElement.id !== "toolShop") {
                        ballItem.remove();
                    }
                }
                catch (err) { }
            },
            onDropText: onDropText,
            onDropImage: onDropImage,
            onDropFile: onDropFile,
        });
        return dropAreaMiddle;
    }

    // ドロップエリアを作成（このアイテムの直後に、他のアイテムを追加するためのもの）
    _createDropAreaBottom({
        isVertical = true,
        outerElement,
        isDroppable = false,
        onDropJson = async (jsonData) => { },
        onDropText = async (text) => { },
        onDropImage = async (img) => { },
        onDropFile = async (file) => { },
    }) {
        const dropAreaBottom = document.createElement('div');
        if (isDroppable) {
            dropAreaBottom.style.height = '25%';
        }
        else {
            dropAreaBottom.style.height = '50%';
        }
        this._setDropEvents({
            outerId: outerElement.id,
            element: dropAreaBottom,
            onDragEnter: async () => {
                this._addInsertBarAfter(outerElement); //outerElementの直後に「挿入バー」を挿入
            },
            onDragLeave: async () => {
                this._removeInsertBarAfter(outerElement);    //outerElementの直後の「挿入バー」を削除
            },
            onDragOver: async () => {
                this._addInsertBarAfter(outerElement); //outerElementの直後に「挿入バー」を挿入
            },
            onDrop: async () => {
                this._removeInsertBarAfter(outerElement);    //outerElementの直後の「挿入バー」を削除
            },
            onDropJson: async (ballOuterId, jsonData) => {
                enableLeaveCheck(); // 「このサイトを離れますか？」を有効にする
                const ballItem = document.getElementById(ballOuterId);
                if (!ballItem) {
                    // 外部のブラウザ出身のアイテムがドロップされた場合
                    await onDropJson(jsonData);
                }
                else if (outerElement.parentElement == ballItem.parentElement) {
                    outerElement.after(ballItem);
                }
                else {
                    try {
                        await onDropJson(jsonData);
                        if (ballItem.parentElement.id !== "toolList" && ballItem.parentElement.id !== "toolShop") {
                            ballItem.remove();
                        }
                    }
                    catch (err) { }
                }
            },
            onDropText: onDropText,
            onDropImage: onDropImage,
            onDropFile: onDropFile,
        });
        return dropAreaBottom;
    }

    //outerElementの直前に「挿入バー」を挿入
    _addInsertBarBefore(outerElement) {
        const beforeElement = outerElement.previousElementSibling;
        if (beforeElement && beforeElement.classList.contains('insert_bar')) return;
        const insertBar = document.createElement('div');
        insertBar.classList.add('insert_bar');
        insertBar.style.height = '10px';
        insertBar.style.width = '96%';
        insertBar.style.background = '#ccc';
        insertBar.style.borderRadius = '5px';
        insertBar.style.margin = '0 2%';
        outerElement.before(insertBar);
    }

    //outerElementの直後に「挿入バー」を挿入
    _addInsertBarAfter(outerElement) {
        const afterElement = outerElement.nextElementSibling;
        if (afterElement && afterElement.classList.contains('insert_bar')) return;
        const insertBar = document.createElement('div');
        insertBar.classList.add('insert_bar');
        insertBar.style.height = '10px';
        insertBar.style.width = '96%';
        insertBar.style.background = '#ccc';
        insertBar.style.borderRadius = '5px';
        insertBar.style.margin = '0 2%';
        outerElement.after(insertBar);
    }

    //outerElementの直前の「挿入バー」を削除
    _removeInsertBarBefore(outerElement) {
        while (true) {
            const beforeElement = outerElement.previousElementSibling;
            if (!beforeElement) break;
            if (beforeElement.classList.contains('insert_bar')) {
                beforeElement.remove();
            }
            else {
                break;
            }
        }
    }

    //outerElementの直後の「挿入バー」を削除
    _removeInsertBarAfter(outerElement) {
        while (true) {
            const afterElement = outerElement.nextElementSibling;
            if (!afterElement) break;
            if (afterElement.classList.contains('insert_bar')) {
                afterElement.remove();
            }
            else {
                break;
            }
        }
    }

    _setDropEvents({
        outerId = uuid(),
        element = document.createElement('div'),
        onDragEnter = async () => { },
        onDragLeave = async () => { },
        onDragOver = async () => { },
        onDrop = async () => { },
        onDropJson = async (ballOuterId, jsonData) => { },
        onDropText = async (text) => { },
        onDropImage = async (img) => { },
        onDropFile = async (file) => { },
    }) {
        // HTML要素の上に何かが入ってきたとき
        element.addEventListener("dragenter", async function (event) {
            event.preventDefault();
            await onDragEnter();
        });
        //
        // HTML要素の上から何かが出たとき
        element.addEventListener("dragleave", async function (event) {
            event.preventDefault();
            await onDragLeave();
        });
        //
        // HTML要素の上に何かがいる最中、連続してイベント発生
        element.addEventListener("dragover", async function (event) {
            event.preventDefault();
            await onDragOver();
        });
        //
        // HTML要素の上に何かが投下（ドロップ）されたとき
        element.addEventListener("drop", async function (event) {
            event.stopPropagation();
            event.preventDefault();
            await onDrop();
            const ballOuterId = event.dataTransfer.getData("outerId");   // データ転送により送られてきたデータ
            const jsonText = event.dataTransfer.getData("jsonData"); // データ転送により送られてきたデータ
            if (ballOuterId == outerId) return;   // アイテムを元の場所にドロップしただけの場合、何もしない
            if (ballOuterId && jsonText) {
                await onDropJson(ballOuterId, JSON.parse(jsonText));
            }
        });
        //
        return element;
    }
}

//#########################################################################################

async function _renderToolbox({ saveData, isDragOnly = false }) {
    if (!saveData) return;
    if (!saveData.blockType) {
        console.error('blockTypeが未定義です。');
        return;
    }
    if (!Array.isArray(saveData.children)) {
        saveData.children = [];
    }
    const plugin = await _loadPlugin(saveData.blockType);
    //
    if (typeof plugin?.toolbox?.render !== 'function') {
        alert(`プラグイン「${saveData.blockType}」の関数「toolbox.render()」が未定義です。`);
        console.error(`プラグイン「${saveData.blockType}」の関数「toolbox.render()」が未定義です。`);
    }
    let toolListInner;
    try {
        toolListInner = await plugin?.toolbox?.render(saveData);
    }
    catch (err) {
        alert(`プラグイン「${saveData.blockType}」の関数「toolbox.render()」でエラーが発生しました。`);
        console.error(`プラグイン「${saveData.blockType}」の関数「toolbox.render()」でエラーが発生しました。`);
        console.error(err);
        return;
    }
    //
    const card = document.createElement('div');
    card.style.margin = '10px';
    card.style.background = '#fff';
    card.style.borderRadius = '10px';
    card.style.padding = '10px';
    card.style.boxShadow = '2px 4px 12px rgb(0 0 0 / 8%)';
    //
    try {
        card.appendChild(toolListInner);
    }
    catch (err) {
        alert(`プラグイン「${saveData.blockType}」のツールボックスを描画できません。関数「toolbox.render()」を確認してください。`);
        console.error(`プラグイン「${saveData.blockType}」のツールボックスを描画できません。関数「toolbox.render()」を確認してください。`);
        console.error(err);
        return;
    }
    const sortableItem = new SortableItem({ isDragOnly });
    sortableItem.jsonData = saveData;
    sortableItem.innerElement = card;
    sortableItem.onDropBrotherJson = ({ jsonData, isBefore }) => _onDropToolList({ jsonData, isBefore, sortableItem });
    //
    const preElement = document.createElement('pre');
    preElement.classList.add("json");
    preElement.innerText = JSON.stringify(saveData);
    preElement.style.display = "none";
    sortableItem.outerElement.appendChild(preElement);
    //
    return sortableItem.outerElement;
}

async function _renderHeavy(saveData, isEditable = false) {
    if (!saveData) return;
    if (!saveData.blockType) {
        console.error('blockTypeが未定義です。');
        return;
    }
    const plugin = await _loadPlugin(saveData.blockType);
    if (!Array.isArray(saveData.children)) {
        saveData.children = [];
    }
    //
    const sortableItem = new SortableItem({});
    let viewerElement;
    if (typeof plugin?.viewer?.renderHeavy === 'function') {
        try {
            viewerElement = await plugin?.viewer?.renderHeavy("block_" + sortableItem.outerElement.id, saveData);
        }
        catch (err) {
            alert(`プラグイン「${saveData.blockType}」の関数「viewer.renderHeavy()」でエラーが発生しました。`);
            console.error(`プラグイン「${saveData.blockType}」の関数「viewer.renderHeavy()」でエラーが発生しました。`);
            console.error(err);
            return;
        }
    }
    else if (typeof plugin?.viewer?.renderLight === 'function') {
        try {
            viewerElement = await plugin?.viewer?.renderLight("block_" + sortableItem.outerElement.id, saveData);
        }
        catch (err) {
            alert(`プラグイン「${saveData.blockType}」の関数「viewer.renderLight()」でエラーが発生しました。`);
            console.error(`プラグイン「${saveData.blockType}」の関数「viewer.renderLight()」でエラーが発生しました。`);
            console.error(err);
            return;
        }
    }
    else {
        alert(`プラグイン「${saveData.blockType}」の関数「viewer.renderHeavy()」と「viewer.renderLight()」の両方が未定義です。`);
        console.error(`プラグイン「${saveData.blockType}」の関数「viewer.renderHeavy()」と「viewer.renderLight()」の両方が未定義です。`);
    }
    try {
        sortableItem.innerElement = viewerElement;
    }
    catch (err) {
        alert(`プラグイン「${saveData.blockType}」のブロックを描画できません。関数「viewer.renderHeavy()」と「viewer.renderLight()」を確認してください。`);
        console.error(`プラグイン「${saveData.blockType}」のブロックを描画できません。関数「viewer.renderHeavy()」と「viewer.renderLight()」を確認してください。`);
        console.error(err);
        return;
    }
    sortableItem.jsonData = saveData;
    sortableItem.onDropBrotherJson = ({ jsonData, isBefore }) => _onDropMainBlock({ jsonData, isBefore, sortableItem });
    //
    const preElement = document.createElement('pre');
    preElement.classList.add("json");
    preElement.innerText = JSON.stringify(saveData);
    preElement.style.display = "none";
    sortableItem.outerElement.appendChild(preElement);
    //
    if (isEditable) {
        setTimeout(async () => {
            //
            // 編集可にする
            if (typeof plugin?.viewer?.changeEditMode === 'function') {
                try {
                    await plugin?.viewer?.changeEditMode("block_" + sortableItem.outerElement.id);
                }
                catch (err) {
                    alert(`プラグイン「${saveData.blockType}」の関数「viewer.changeEditMode()」でエラーが発生しました。`);
                    console.error(`プラグイン「${saveData.blockType}」の関数「viewer.changeEditMode()」でエラーが発生しました。`);
                    console.error(err);
                    return;
                }
            }
        }, 500);
    }
    //
    return sortableItem.outerElement;
}

async function _saveBlock(outerElement) {
    if (!outerElement) return {};
    const jsonElement = outerElement.querySelector('.json');
    if (!jsonElement) return {};
    const pastSaveData = JSON.parse(jsonElement.textContent);
    if (!pastSaveData) return {};
    if (!pastSaveData.blockType) {
        console.error('blockTypeが未定義です。');
        return {};
    }
    const plugin = plugins[pastSaveData.blockType];
    if (!plugin) return {};
    //
    let newSaveData;
    if (typeof plugin?.viewer?.saveBlock !== 'function') {
        newSaveData = {};
        console.error(`プラグイン「${newSaveData.blockType}」の関数「viewer.saveBlock()」が未定義です。`);
    }
    else {
        try {
            newSaveData = await plugin?.viewer?.saveBlock("block_" + outerElement.id, pastSaveData);
        }
        catch (err) {
            alert(`プラグイン「${newSaveData.blockType}」の関数「viewer.saveBlock()」でエラーが発生しました。`);
            console.error(`プラグイン「${newSaveData.blockType}」の関数「viewer.saveBlock()」でエラーが発生しました。`);
            console.error(err);
            return {};
        }
    }
    newSaveData.blockType = pastSaveData.blockType;
    if (!Array.isArray(newSaveData.children)) {
        newSaveData.children = [];
    }
    //
    let lightElement;
    if (typeof plugin?.viewer?.renderLight !== 'function') {
        console.log(`プラグイン「${newSaveData.blockType}」の関数「viewer.renderLight()」が未定義です。`);
        lightElement = document.getElementById("block_" + outerElement.id);
    }
    else {
        try {
            lightElement = await plugin?.viewer?.renderLight("block_" + outerElement.id, newSaveData);
        }
        catch (err) {
            alert(`プラグイン「${newSaveData.blockType}」の関数「viewer.renderLight()」でエラーが発生しました。`);
            console.error(`プラグイン「${newSaveData.blockType}」の関数「viewer.renderLight()」でエラーが発生しました。`);
            console.error(err);
            return {};
        }
    }
    //
    const preElement = document.createElement('pre');
    preElement.classList.add("json");
    preElement.innerText = JSON.stringify(newSaveData);
    preElement.style.display = "none";
    //
    const newOuterElement = document.createElement('div');
    newOuterElement.appendChild(preElement);
    try {
        newOuterElement.appendChild(lightElement);
    }
    catch (err) {
        alert(`プラグイン「${newSaveData.blockType}」の軽量ブロックを描画できません。関数「viewer.renderLight()」を確認してください。`);
        console.error(`プラグイン「${newSaveData.blockType}」の軽量ブロックを描画できません。関数「viewer.renderLight()」を確認してください。`);
        console.error(err);
        return {};
    }
    //
    return { newOuterElement, newSaveData };
}


//#########################################################################################

async function _onDropToolList({ jsonData, isBefore = true, sortableItem }) {
    const brotherItem = await _renderToolbox({ saveData: jsonData });
    if (isBefore) {
        sortableItem.outerElement.before(brotherItem);
    }
    else {
        sortableItem.outerElement.after(brotherItem);
    }
};

async function _onDropMainBlock({ jsonData, isBefore = true, sortableItem }) {
    const brotherItem = await _renderHeavy(jsonData, true);
    if (isBefore) {
        sortableItem.outerElement.before(brotherItem);
    }
    else {
        sortableItem.outerElement.after(brotherItem);
    }
}

//#########################################################################################

// メインコンテンツの表示
document.addEventListener('DOMContentLoaded', async function () {
    const mainContents = document.getElementById('main_contents');
    for (const outerElement of mainContents.children) {
        const jsonElement = outerElement.querySelector('.json');
        if (!jsonElement) continue;
        const saveData = JSON.parse(jsonElement.textContent);
        const outerElement2 = await _renderHeavy(saveData);
        outerElement.replaceWith(outerElement2);
    }
});

async function initToolList(thisPageSetting) {
    for (const pluginName of thisPageSetting.plugins) {
        await _loadPlugin(pluginName);
    }
    //
    const saveButton = document.createElement('button');
    saveButton.classList.add("save_button");
    saveButton.innerText = '保存';
    saveButton.style.fontSize = '16px';
    saveButton.addEventListener('click', async () => await allSave({}));
    //
    const moreLabelElement = document.createElement('label');
    moreLabelElement.classList.add("more_button");
    moreLabelElement.innerHTML = "もっと見る";
    moreLabelElement.style.fontSize = '16px';
    moreLabelElement.setAttribute("for", "toolbox_more");
    //
    const closeMoreLabel1 = document.createElement('label');
    closeMoreLabel1.classList.add("close_more_button");
    closeMoreLabel1.innerHTML = "閉じる &gt;&gt;";
    closeMoreLabel1.setAttribute("for", "toolbox_more");
    //
    const closeMoreLabel2 = document.createElement('label');
    closeMoreLabel2.classList.add("close_more_button");
    closeMoreLabel2.innerHTML = "閉じる &gt;&gt;";
    closeMoreLabel2.setAttribute("for", "toolbox_more");
    //
    const bodyRightHeader = document.createElement('div');
    bodyRightHeader.style.textAlign = 'center';
    bodyRightHeader.appendChild(saveButton);
    bodyRightHeader.appendChild(closeMoreLabel1);
    //
    const bodyRightFooter = document.createElement('div');
    bodyRightFooter.style.textAlign = 'center';
    bodyRightFooter.appendChild(moreLabelElement);
    bodyRightFooter.appendChild(closeMoreLabel2);
    //
    const toolListInner = document.createElement('div');
    toolListInner.classList.add("toolListInner");
    toolListInner.id = "toolList";
    for (const saveData of thisPageSetting.toolList) {
        const outerElement = await _renderToolbox({ saveData, isShop: false });
        toolListInner.appendChild(outerElement);
    }
    //
    // アイテムがなくなったとき用のドロップ専用エリア
    const sortableItem = new SortableItem({ isDropOnly: true });
    sortableItem.onDropBrotherJson = ({ jsonData, isBefore }) => _onDropToolList({ jsonData, isBefore, sortableItem });
    sortableItem.outerElement.classList.add("dropOnly");
    toolListInner.appendChild(sortableItem.outerElement);
    //
    toolListInner.appendChild(bodyRightFooter);
    //
    const toolListOuter = document.createElement('div');
    toolListOuter.classList.add("toolListOuter");
    toolListOuter.appendChild(bodyRightHeader);
    toolListOuter.appendChild(toolListInner);
    //
    const toolShopElement = document.createElement('div');
    toolShopElement.id = "toolShop";
    toolShopElement.style.background = "#ddd";
    toolShopElement.style.height = "100%";
    toolShopElement.style.maxHeight = "100%";
    toolShopElement.style.flex = "1";
    toolShopElement.style.overflowX = "hidden";
    toolShopElement.style.overflowY = "auto";
    toolShopElement.style.display = "flex";
    toolShopElement.style.justifyContent = "space-around";
    toolShopElement.style.flexWrap = "wrap";
    for (const pluginName in plugins) {
        toolShopElement.appendChild(await _renderToolbox({
            saveData: {
                blockType: pluginName,
            },
            isShop: true,
            isDragOnly: true,
        }));
    }
    //
    const bodyRight = document.getElementById('body_right');
    if (!bodyRight) {
        alert("HTML要素「.body_right」が見つかりません");
        return;
    }
    bodyRight.appendChild(toolListOuter);
    bodyRight.appendChild(toolShopElement);
}

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

async function allSave() {
    /*
    const uri = new URL(window.location.href);
    console.log(uri.hostname);
    let pathName = window.location.pathname;
    if (!pathName || pathName.endsWith("/")) {
        pathName += "index.html";
    }
    if (uri.hostname === "8mo.nl") {
        //  以下のURLにアクセスがあった場合
        //    https://8mo.nl/【ストレージID】/【パス】
        return pathName;
    }
    else if (uri.hostname.endsWith(".8mo.nl")) {
    }
    */
    const toolListInner = document.getElementById("toolList");
    const toolBoxJsonDataList = [];
    //
    // 一番最後の要素は「もっと見る」なので、最後から１個手前まで繰り返す
    for (let i = 0; i < toolListInner.children.length - 1; i++) {
        const jsonElement = toolListInner.children[i].querySelector('.json');
        if (!jsonElement) {
            continue;
        }
        const jsonData = JSON.parse(jsonElement.textContent);
        toolBoxJsonDataList.push(jsonData);
    }
    settings[0].toolList = toolBoxJsonDataList;
    //
    const pastMainContents = document.getElementById('main_contents');
    const newMainContents = document.createElement('main');
    for (const sortableItem of pastMainContents.children) {
        if (sortableItem.classList.contains("dropOnly")) continue;
        const { newOuterElement, newSaveData } = await _saveBlock(sortableItem);
        if (!newOuterElement || !newSaveData) continue;
        newMainContents.appendChild(newOuterElement);
        console.log(newSaveData);
    }
    //
    const htmlCode = generateHTML({
        title: settings[0]?.title ?? "",
        mainContents: newMainContents.innerHTML,
        basicCssPath: document.getElementById("basic_css").getAttribute('href'),
        basicJsPath: document.getElementById("basic_js").getAttribute('src'),
        jsZipPath: document.getElementById("jszip").getAttribute('src'),
        isFullSize: settings[0]?.isFullSize,
        faviconsFolderPath: 'https://mono-file.s3.ap-northeast-1.amazonaws.com/favicons/',
    });
    //
    if (typeof JSZip === "undefined") {
        console.log("  JSZipファイルが見つかりません");
    }
    const zip = new JSZip();
    //
    zip.file("index.html", htmlCode);
    zip.file("setting.js", "window.fileToFileTransferVariable = " + JSON.stringify(settings[0]) + ";");
    for (const pluginName in plugins) {
        const plugin = plugins[pluginName];
        const str = _convertPluginToString({ pluginName, plugin });
        zip.file("plugins/" + pluginName + ".js", str);
    }
    //
    const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
            /* compression level ranges from 1 (best speed) to 9 (best compression) */
            level: 9
        },
    });
    await _downloadFile({
        fileName: (_getPath() ?? "web") + ".zip",
        mimeType: "octet/stream",
        content: content,
    });
}

async function _createDownloadUrl({
    content = "hello world!",
    mimeType = "text/plain",
}) {
    const blob = new Blob([content], { "type": mimeType });
    const url = window.URL.createObjectURL(blob);
    return url;
}

async function _downloadFile({
    content = "hello world!",
    fileName = "test.txt",
    mimeType = "text/plain",
}) {
    const blob = new Blob([content], { "type": mimeType });
    const url = window.URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = url;
    element.download = fileName;
    element.target = '_blank';
    element.click();
}

//#########################################################################################
// プラグインを文字列にする

const _convertPluginToString = ({ pluginName, plugin }) => `plugins["${pluginName}"] = {
    //##############################################################

    toolbox: {

        //【必須】ツールボックスに表示するHTML要素を生成する関数
        ${(plugin?.toolbox?.render) ?
        ("render: " + String(plugin?.toolbox?.render)) :
        `//
        // 例
        // render: async function (saveData) {
        //     const toolListInner = document.createElement('h1');
        //     toolListInner.innerText = saveData.text ?? '見出し１';
        //     return toolListInner;
        // }`
    },


        //【任意】ツールボックス（画面右側）のブロックの上にドラッグ中の何かが侵入したとき
        ${(plugin?.toolbox?.onDragEnter) ?
        ("onDragEnter: " + String(plugin?.toolbox?.onDragEnter)) :
        `//
        // 例
        // onDragEnter: async (blockId) => { }`
    },


        //【任意】ツールボックス（画面右側）のブロックの上からドラッグ中の何かが離れたとき
        ${(plugin?.toolbox?.onDragLeave) ?
        ("onDragLeave: " + String(plugin?.toolbox?.onDragLeave)) :
        `//
        // 例
        // onDragLeave: async (blockId) => { }`
    },


        //【任意】ツールボックス（画面右側）のブロックの上をドラッグ中の何かが通ったとき
        ${(plugin?.toolbox?.onDragOver) ?
        ("onDragOver: " + String(plugin?.toolbox?.onDragOver)) :
        `//
        // 例
        // onDragOver: async (blockId) => { }`},


        //【任意】ツールボックス（画面右側）のブロックの上に何かがドロップされたとき
        ${(plugin?.viewer?.onDrop) ?
        ("onDrop: " + String(plugin?.viewer?.onDrop)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropJson) ?
        ("onDropJson: " + String(plugin?.viewer?.onDropJson)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropText) ?
        ("onDropText: " + String(plugin?.viewer?.onDropText)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropImage) ?
        ("onDropImage: " + String(plugin?.viewer?.onDropImage)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropFile) ?
        ("onDropFile: " + String(plugin?.viewer?.onDropFile)) + ",\n        "
        :
        ""
    }//
        // 例
        // onDrop: async (blockId) => { },
        // onDropJson: async function (blockId, jsonData) { },
        // onDropText: async function (blockId, text) { },
        // onDropImage: async function (blockId, img) { },
        // onDropFile: async function (blockId, file) { },

    },

    //##############################################################

    viewer: {

        //【任意】
        //   true:  子ブロックを編集するときに、カード表示のエディターを使う
        //   false: 子ブロックを編集するときに、完成ページと同じレイアウトのまま編集する
        cardEditor: ${(plugin?.viewer?.cardEditor) ? "true" : "false"},


        //【任意】ビューワー（画面左側）に表示するHTML要素を生成する関数
        //    ※ページを開いた直後に、１度だけ実行されます。
        //    ※サーバーと連携して、表示するたびに内容が変化するような使い方もできます。
        //    ※未定義の場合は、ツールボックス（画面右側）の中だけで動作するブロックになり、ビューワー（画面左側）にドラッグ＆ドロップできなくなります。
        ${(plugin?.viewer?.renderHeavy) ?
        ("renderHeavy: " + String(plugin?.viewer?.renderHeavy)) :
        `//
        // 例
        // renderHeavy: async function (blockId, saveData) {
        //     const element = document.createElement('h1');
        //     element.id = blockId;
        //     element.innerText = saveData.text;
        //     //
        //     // 子ブロックを生成する
        //     for (const childSaveData of saveData.children) {
        //         const c = await _renderHeavy(childSaveData);
        //         element.appendChild(c);
        //     }
        //     return element;
        // }`
    },


        //【任意】読み込み中に表示する軽量なHTML要素を生成する関数
        //   ※画面右上の保存ボタンを押したときに実行されます。
        //   ※表示するときは、この関数は実行されません。
        //   ※表示するたびに内容が変化するような使い方はできません。
        ${(plugin?.viewer?.renderLight) ?
        ("renderLight: " + String(plugin?.viewer?.renderLight)) :
        `//
        // 例
        // renderLight: async function (blockId, saveData) {
        //     const element = document.createElement('h1');
        //     element.innerText = saveData.text;
        //     return element;
        // }`},


        //【任意】編集モードに切り替わったとき
        ${(plugin?.viewer?.changeEditMode) ?
        ("changeEditMode: " + String(plugin?.viewer?.changeEditMode)) :
        `//
        // 例
        // changeEditMode: async function (blockId) {
        //     const element = document.getElementById(blockId);
        //     element.contentEditable = true;
        // }`},


        //【任意】保存するJSONデータを生成する関数
        //    ※未定義の場合は、空のセーブデータとして保存されます。
        ${(plugin?.viewer?.saveBlock) ?
        ("saveBlock: " + String(plugin?.viewer?.saveBlock)) :
        `//
        // 例
        // saveBlock: async function (blockId, pastSaveData) {
        //     const element = document.getElementById(blockId);
        //     const saveData = {
        //         text: element.textContent,
        //         children: [],
        //     };
        //     //
        //     // 子ブロックを保存する
        //     for (const childrenElement of element.children) {
        //         const { newOuterElement, newSaveData } = await _saveBlock(childrenElement);
        //         childrenElement.replaceWith(newOuterElement);
        //         saveData.children.push(newSaveData);
        //     }
        //     return saveData;
        // }`},


        //【任意】ブロック内での改行を有効化するかどうか
        isEnableLineBreaks: ${(plugin?.viewer?.isEnableLineBreaks) ? "true" : "false"},


        //【任意】ビューワー（画面左側）のブロックの上にドラッグ中の何かが侵入したとき
        ${(plugin?.viewer?.onDragEnter) ?
        ("onDragEnter: " + String(plugin?.viewer?.onDragEnter)) :
        `//
        // 例
        // onDragEnter: async (blockId) => { }`},


        //【任意】ビューワー（画面左側）のブロックの上からドラッグ中の何かが離れたとき
        ${(plugin?.viewer?.onDragLeave) ?
        ("onDragLeave: " + String(plugin?.viewer?.onDragLeave)) :
        `//
        // 例
        // onDragLeave: async (blockId) => { }`},


        //【任意】ビューワー（画面左側）のブロックの上をドラッグ中の何かが通ったとき
        ${(plugin?.viewer?.onDragOver) ?
        ("onDragOver: " + String(plugin?.viewer?.onDragOver)) :
        `//
        // 例
        // onDragOver: async (blockId) => { }`},


        //【任意】ビューワー（画面左側）のブロックの上に何かがドロップされたとき
        ${(plugin?.viewer?.onDrop) ?
        ("onDrop: " + String(plugin?.viewer?.onDrop)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropJson) ?
        ("onDropJson: " + String(plugin?.viewer?.onDropJson)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropText) ?
        ("onDropText: " + String(plugin?.viewer?.onDropText)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropImage) ?
        ("onDropImage: " + String(plugin?.viewer?.onDropImage)) + ",\n        "
        :
        ""
    }${(plugin?.viewer?.onDropFile) ?
        ("onDropFile: " + String(plugin?.viewer?.onDropFile)) + ",\n        "
        :
        ""
    }//
        // 例
        // onDrop: async (blockId) => { },
        // onDropJson: async function (blockId, jsonData) { },
        // onDropText: async function (blockId, text) { },
        // onDropImage: async function (blockId, img) { },
        // onDropFile: async function (blockId, file) { },

    },

    //##############################################################

    //【任意】CSS
    ${(plugin?.css) ?
        ("css: " + String(plugin?.css)) :
        `//
    // 例
    // css: async () => \`
    //     input:checked+.slider {
    //         background-color: #8d0000;
    //         border: 1px solid transparent;
    //     }
    //     input:checked+.slider:before {
    //         transform: translateX(1.5em);
    //     }
    // \``
    },

    externals: {

        //【任意】外部JavaScriptのURL
        ${(plugin?.externals?.js) ?
        ("js: " + String(plugin?.externals?.js)) :
        `//
        // 例
        // js: async (saveData) => [
        //     "https://example.com/aaa.js",
        //     "https://example.com/bbb.js"
        // ]`
    },


        //【任意】外部CSSのURL
        ${(plugin?.externals?.css) ?
        ("css: " + String(plugin?.externals?.css)) :
        `//
        // 例
        // css: async (saveData) => [
        //     "https://example.com/aaa.css",
        //     "https://example.com/bbb.css"
        // ]`
    },

    },

    //##############################################################
}`;

//#########################################################################################

var loadingPlugins = {};
var plugins = {
    "H1": {
        "viewer": {
            "renderLight": async function (blockId, saveData) {
                const element = document.createElement('h1');
                element.id = blockId;
                element.innerText = saveData.text ?? "見出し１";
                return element;
            },
            "changeEditMode": async function (blockId) {
                const element = document.getElementById(blockId);
                element.contentEditable = true;
            },
            "saveBlock": async function (blockId, pastSaveData) {
                const element = document.getElementById(blockId);
                return {
                    text: element.textContent,
                };
            },
        },
        "toolbox": {
            "render": async function (saveData) {
                const toolboxElement = document.createElement('h1');
                toolboxElement.innerText = saveData.text ?? '見出し１';
                return toolboxElement;
            },
        },
    },
    "H2": {
        "viewer": {
            "renderLight": async function (blockId, saveData) {
                const element = document.createElement('h2');
                element.id = blockId;
                element.innerText = saveData.text ?? "見出し２";
                return element;
            },
            "changeEditMode": async function (blockId) {
                const element = document.getElementById(blockId);
                element.contentEditable = true;
            },
            "saveBlock": async function (blockId, pastSaveData) {
                const element = document.getElementById(blockId);
                return {
                    text: element.textContent,
                };
            },
        },
        "toolbox": {
            "render": async function (saveData) {
                const toolboxElement = document.createElement('h2');
                toolboxElement.innerText = saveData.text ?? '見出し２';
                return toolboxElement;
            },
        },
    },
    "H3": {
        "viewer": {
            "renderLight": async function (blockId, saveData) {
                const element = document.createElement('h3');
                element.id = blockId;
                element.innerText = saveData.text ?? "見出し３";
                return element;
            },
            "changeEditMode": async function (blockId) {
                const element = document.getElementById(blockId);
                element.contentEditable = true;
            },
            "saveBlock": async function (blockId, pastSaveData) {
                const element = document.getElementById(blockId);
                return {
                    text: element.textContent,
                };
            },
        },
        "toolbox": {
            "render": async function (saveData) {
                const toolboxElement = document.createElement('h3');
                toolboxElement.innerText = saveData.text ?? '見出し３';
                return toolboxElement;
            },
        },
    },
    "H4": {
        "viewer": {
            "renderLight": async function (blockId, saveData) {
                const element = document.createElement('h4');
                element.id = blockId;
                element.innerText = saveData.text ?? "見出し４";
                return element;
            },
            "changeEditMode": async function (blockId) {
                const element = document.getElementById(blockId);
                element.contentEditable = true;
            },
            "saveBlock": async function (blockId, pastSaveData) {
                const element = document.getElementById(blockId);
                return {
                    text: element.textContent,
                };
            },
        },
        "toolbox": {
            "render": async function (saveData) {
                const toolboxElement = document.createElement('h4');
                toolboxElement.innerText = saveData.text ?? '見出し４';
                return toolboxElement;
            },
        },
    },
    "H5": {
        "viewer": {
            "renderLight": async function (blockId, saveData) {
                const element = document.createElement('h5');
                element.id = blockId;
                element.innerText = saveData.text ?? "見出し５";
                return element;
            },
            "changeEditMode": async function (blockId) {
                const element = document.getElementById(blockId);
                element.contentEditable = true;
            },
            "saveBlock": async function (blockId, pastSaveData) {
                const element = document.getElementById(blockId);
                return {
                    text: element.textContent,
                };
            },
        },
        "toolbox": {
            "render": async function (saveData) {
                const toolboxElement = document.createElement('h5');
                toolboxElement.innerText = saveData.text ?? '見出し５';
                return toolboxElement;
            },
        },
    },
    "H6": {
        "viewer": {
            "renderLight": async function (blockId, saveData) {
                const element = document.createElement('h6');
                element.id = blockId;
                element.innerText = saveData.text ?? "見出し６";
                return element;
            },
            "changeEditMode": async function (blockId) {
                const element = document.getElementById(blockId);
                element.contentEditable = true;
            },
            "saveBlock": async function (blockId, pastSaveData) {
                const element = document.getElementById(blockId);
                return {
                    text: element.textContent,
                };
            },
        },
        "toolbox": {
            "render": async function (saveData) {
                const toolboxElement = document.createElement('h6');
                toolboxElement.innerText = saveData.text ?? '見出し６';
                return toolboxElement;
            },
        },
    },

};

// プラグインファイルを読み込む
async function _loadPlugin(blockType) {
    if (plugins[blockType]) {
        if (isDebugPlugin) console.log("  既にプラグインは読み込み済みです。");
        return plugins[blockType];
    }
    const url = './plugins/' + blockType + '.js?t=' + String(new Date().getTime());    //キャッシュ対策
    if (loadingPlugins[blockType] === true) {
        alert(`【エラー】プラグインファイル「${blockType}」を２つ同時に読み込もうとしています。`);
    }
    loadingPlugins[blockType] = true;
    //
    // JavaScriptファイルを読み込む
    const scriptElement = document.createElement('script');
    try {
        if (isDebugPlugin) console.log("  プラグインファイル：" + _getShortUrlToDisplay(url));
        scriptElement.src = url;
        document.body.appendChild(scriptElement);
    }
    catch (err) {
        alert(`プラグインファイル「${blockType}.js」を読み込めません`);
        console.error("  プラグインファイルを読み込めません");
        console.error(err);
        return null;
    }
    //
    try {
        // JavaScriptファイルのロードが終わるまで待つ
        await _waitLoad(scriptElement);
    }
    catch (err) { }
    //
    loadingPlugins[blockType] = false;
    //
    if (plugins[blockType]) {
        if (isDebugPlugin) console.log("  プラグイン読み込み成功");
    }
    else {
        console.error("  プラグインファイルが見つかりません");
        return null;
    }
    if (typeof plugins[blockType].css === "function") {
        const styleTag = document.createElement('style');
        try {
            styleTag.innerHTML = await plugins[blockType].css();
        }
        catch (err) {
            alert(`プラグイン「${blockType}」の関数「css()」でエラーが発生しました。`);
            console.error(`プラグイン「${blockType}」の関数「css()」でエラーが発生しました。`);
            console.error(err);
            return plugins[blockType];
        }
        // 作成したstyleタグを挿入
        document.getElementsByTagName('head')[0].insertAdjacentElement('beforeend', styleTag);
    }
    return plugins[blockType];
}

//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################
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

const settings = [];

//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################

// 親子ウィンドウの初期設定
document.addEventListener('DOMContentLoaded', async function () {
    //
    if (isDebugTree) console.log("============================");
    if (isDebugTree) console.log("親ページへ繋がる戻るボタンやパンくずリストを生成します。");
    //
    // 各階層のJavaScriptファイル「setting.js」と「setting_top.js」から設定を読み込む
    //
    // フォルダ階層ごとのループ
    //  例：「」=>「../」=>「../../」=>「../../../」
    let folderUrl = '';
    for (let i = 0; i < 30; i++) {
        if (isDebugTree) console.log('\n');
        const s1 = await _loadSetting(folderUrl + 'setting.js');
        if (!s1.isLoadSettingSuccess) {
            break;
        }
        settings.push(s1);
        //
        if (i === 0) {
            fontInit(s1);  // フォントを読み込む
            initToolList(s1);
        }
        //
        if (isDebugTree) console.log('\n');
        //
        const s2 = await _loadSetting(folderUrl + 'setting_top.js');
        if (s2.isLoadSettingSuccess) {
            settings.push(s2);
            // 「window_top.json」を発見した場合（一番上のファイル階層まで到達した場合）は
            //  for文の実行を終了する。
            break;
        }
        folderUrl += '../';
    }
    if (isDebugTree) console.log('\n');
    if (isDebugTree) console.log(settings);
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
                    breadcrumbs.innerHTML += `<a href="${settings[i].url}">${settings[i].title}</a>`;
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
            if (isEnableLeaveCheck == false) {
                await _sleep(300);
            }
            else {
                trigger.checked = true;
            }
            window.location.href = settings[1].url;
        });
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
});

//#########################################################################################

var _loadSettingFlag = false;

//「setting.js」を読み込む関数
async function _loadSetting(url) {
    url += '?t=' + String(new Date().getTime());    //キャッシュ対策
    if (_loadSettingFlag === true) {
        alert('【エラー】関数「_loadSetting」の処理を２つ同時に実行しようとしています。');
    }
    _loadSettingFlag = true;
    window.fileToFileTransferVariable = null;
    //
    // JavaScriptファイル「setting.js」を読み込む
    const scriptElement1 = document.createElement('script');
    try {
        if (isDebugTree) console.log("  設定ファイル：" + _getShortUrlToDisplay(url));
        scriptElement1.src = url;
        document.body.appendChild(scriptElement1);
    }
    catch (err) { }
    //
    // JavaScriptファイル「setting.js」が、
    // 配列「window.fileToFileTransferVariable」に代入してくれているはず
    //
    try {
        // JavaScriptファイル「setting.js」の実行が終わるまで待つ
        await _waitLoad(scriptElement1);
    }
    catch (err) { }
    //
    const result = window.fileToFileTransferVariable;
    _loadSettingFlag = false;
    window.fileToFileTransferVariable = null;
    if (result) {
        if (isDebugTree) console.log("  読み込み成功");
    }
    else {
        if (isDebugTree) console.log("  設定ファイルが見つかりません");
    }
    return {
        "isLoadSettingSuccess": result ? true : false,
        "title": result?.title ?? "？？",
        "isFullSize": result?.isFullSize ? true : false,
        "isTopbar": result?.isTopbar ? true : false,
        "url": result?.url ?? (new URL('index.html', new URL(url, window.location))).toString(),
        "fontFamily": result?.fontFamily ?? {
            "Hannari": false,
            "Kokoro": false,
            "Nico Moji": false,
            "Nikukyu": false,
            "M PLUS 1p": false,
            "M PLUS Rounded 1c": false,
            "Sawarabi Mincho": false,
            "Sawarabi Gothic": false,
            "Noto Sans JP": true
        },
        "toolList": result?.toolList ?? [],
        "plugins": result?.plugins ?? [],
    };
}

//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################
//#########################################################################################

const generateHTML = ({
    title = 'たいとる',
    mainContents = '',
    basicCssPath,
    basicJsPath,
    jsZipPath,
    isFullSize = true,
    faviconsFolderPath = 'https://mono-file.s3.ap-northeast-1.amazonaws.com/favicons/',
}) => `
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
        <!-- 共通CSS -->
        <link rel="stylesheet" href="${basicCssPath}" id="basic_css">
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
        <script src="${basicJsPath}" defer id="basic_js"></script>
        <script src="${jsZipPath}" defer id="jszip"></script>
        <!-- -->
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
                        <label for="this_page_modal_trigger" class="buttonFlat">戻る</label>
                    </div>
                    <header>
                        <div class="header_left">
                        </div>
                        <div class="header_right">
                        </div>
                    </header>
                    <main id="main_contents">${mainContents}</main>
                    <div id="info-for-print">最終更新日：20xx年x月x日</div>
                    <div class="actions">
                        <div class="print-button-wrapper">
                            <button class="buttonFlat" onclick="window.print();">印刷する</button>
                        </div>
                        <div id="info-for-device">最終更新：x日前</div>
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