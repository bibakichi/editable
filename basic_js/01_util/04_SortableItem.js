//#########################################################################################

const sortableItems = {};

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
        outerElement.ondragstart = (event) => this._handleDragStart(event, jsonData);
        outerElement.ondragend = (event) => {
            outerElement.style.zIndex = 999;
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
    // ドラッグ＆ドロップを有効にするか否か
    set isEnable(flag = true) {
        this._isEnable = flag;
        this._outerElement.draggable = (this._isEnable && !this._isDropOnly);
        this._outerElement.style.cursor = (this._isEnable && !this._isDropOnly) ? 'grab' : 'auto';
    }
    get isEnable() { return this._isEnable; }
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

    _handleDragStart(event, jsonData) {
        console.log("ドラッグ開始：" + this._enableCopy);
        event.dataTransfer.setData("enableCopy", this._enableCopy);  // データ転送用のデータをセット
        event.dataTransfer.setData("outerId", this._outerElement.id);  // データ転送用のデータをセット
        event.dataTransfer.setData("jsonData", JSON.stringify(jsonData));      // データ転送用のデータをセット
        if (!this._enableCopy) {
            this._outerElement.style.opacity = 0;
        }
        this._outerElement.style.zIndex = 999;
        const sortableItemList = document.getElementsByClassName('sortable_item');
        for (const sortableItem of sortableItemList) {
            if (sortableItem.id != this._outerElement.id) {
                sortableItem.style.zIndex = 1;
                const dropAreas = sortableItem.querySelector('.sortable_item_drop_areas');
                if (dropAreas) {
                    dropAreas.style.display = 'block';
                }
            }
        }
    }

    constructor({ isDragOnly = false, isDropOnly = false, isEnable = true, enableCopy = true }) {
        const id = uuid();
        sortableItems[id] = this;
        this._isEnable = isEnable;
        this._isDragOnly = isDragOnly;
        this._isDropOnly = isDropOnly;
        this._jsonData = {};
        this._isVertical = true;
        this._enableCopy = enableCopy;
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
        outerElement.classList.add("sortable_item");
        outerElement.id = id;
        outerElement.draggable = (this._isEnable && !this._isDropOnly);
        outerElement.style.position = 'relative';
        outerElement.style.transition = 'opacity 0.1s';
        outerElement.style.cursor = (this._isEnable && !this._isDropOnly) ? 'grab' : 'auto';
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
            outerElement.ondragstart = (event) => this._handleDragStart(event, {});
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
            onDropJson: async (ballOuterId, jsonData, enableCopy) => {
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
                        console.log("ドロップ２：" + enableCopy);
                        await onDropJson(jsonData);
                        console.log("ドロップ３：" + enableCopy);
                        if (!enableCopy) {
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
            onDropJson: async (ballOuterId, jsonData, enableCopy) => {
                const ballItem = document.getElementById(ballOuterId);
                if (!ballItem) {
                    // 外部のブラウザ出身のアイテムがドロップされた場合
                    await onDropJson(jsonData);
                }
                try {
                    console.log("ドロップ２：" + enableCopy);
                    await onDropJson(jsonData);
                    console.log("ドロップ３：" + enableCopy);
                    if (!enableCopy) {
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
            onDropJson: async (ballOuterId, jsonData, enableCopy) => {
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
                        console.log("ドロップ２：" + enableCopy);
                        await onDropJson(jsonData);
                        console.log("ドロップ３：" + enableCopy);
                        if (!enableCopy) {
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
        onDropJson = async (ballOuterId, jsonData, enableCopy) => { },
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
            const enableCopy = event.dataTransfer.getData("enableCopy");   // データ転送により送られてきたデータ
            const ballOuterId = event.dataTransfer.getData("outerId");   // データ転送により送られてきたデータ
            const jsonText = event.dataTransfer.getData("jsonData"); // データ転送により送られてきたデータ
            if (ballOuterId == outerId) return;   // アイテムを元の場所にドロップしただけの場合、何もしない
            if (ballOuterId && jsonText) {
                console.log("ドロップ：" + enableCopy);
                await onDropJson(ballOuterId, JSON.parse(jsonText), enableCopy);
            }
        });
        //
        return element;
    }
}
