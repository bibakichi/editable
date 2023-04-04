//#########################################################################################
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
    toolShopElement.style.justifyContent = "space-evenly";
    toolShopElement.style.flexWrap = "wrap";
    toolShopElement.style.alignItems = "center";
    for (const pluginName in plugins) {
        const outerElement = await _renderToolbox({
            saveData: {
                blockType: pluginName,
            },
            isShop: true,
            isDragOnly: true,
        });
        if (outerElement) {
            toolShopElement.appendChild(outerElement);
        }
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