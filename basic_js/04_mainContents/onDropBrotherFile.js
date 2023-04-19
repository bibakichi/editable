
let pluginsBuffer = {};

async function onDropBrotherFile({ file, isBefore, sortableItem }) {
    const reader = new FileReaderEx();
    if (file.type.startsWith("image")) {
        const url = await reader.readAsDataURL(file);
        const jsonData = {
            blockType: "Image",
            src: url,
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