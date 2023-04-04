async function onDropBrotherFile({ file, isBefore }) {
    const reader = new FileReaderEx();
    console.log(file.type);
    if (file.type.startsWith("image")) {
        const url = await reader.readAsDataURL(file);
        const jsonData = {
            blockType: "Image",
            src: url,
        };
        onDropMainBlock({ jsonData, isBefore, sortableItem });
    }
    if (file.type === "text/javascript") {
        console.log("jsがドロップされました");
        const text = await reader.readAsText(file);
        if (text.trim().startsWith("plugins")) {
            const scriptElement = document.createElement('script');
            scriptElement.innerText = text;
            document.body.appendChild(scriptElement);
            alert("プラグインを追加しました");
        }
    }
}