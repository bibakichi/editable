
let pluginsBuffer = {};

async function onDropBrotherFile({ file, isBefore, sortableItem }) {
    const reader = new FileReaderEx();
    if (file.type.startsWith("image")) {
        const originalData = await reader.readAsDataURL(file);
        //const middleData = await _createThumbnail({ url: originalData, width: 200 });
        const smallData = await _createThumbnail({ url: originalData, width: 40 });
        const jsonData = {
            blockType: "Image",
            smallData: smallData,
            originalData: originalData,
            src: originalData,
        };
        onDropMainBlock({ jsonData, isBefore, sortableItem });
    }
    if (file.type === "text/javascript") {
        let text = await reader.readAsText(file);
        text = text.trim();
        if (text.startsWith("plugins")) {
            pluginsBuffer = {};
            text = text.replace("plugins", "pluginsBuffer");
            const scriptElement = document.createElement('script');
            scriptElement.classList.add("Do_not_store_in_HTML"); s
            scriptElement.innerHTML = text;
            document.body.appendChild(scriptElement);
            await _sleep(1000);
            const blockType = Object.keys(pluginsBuffer)[0];
            plugins[blockType] = pluginsBuffer[blockType];
            alert(`プラグイン${blockType}を追加しました`);
            onDropMainBlock({
                jsonData: {
                    blockType: blockType,
                },
                isBefore,
                sortableItem
            });
            const toolShopElement = document.getElementById("toolShop");
            toolShopElement.innerHTML = "";
            for (const pluginName in plugins) {
                toolShopElement.appendChild(await _renderToolbox({
                    saveData: {
                        blockType: pluginName,
                    },
                    isShop: true,
                    isDragOnly: true,
                }));
            }
        }
    }
}