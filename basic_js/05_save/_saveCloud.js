//#########################################################################################
async function saveCloud({ storageId, folderPath, htmlCode, setting }) {
    const fileList = [];
    const fileMap = {};
    for (const pluginName in plugins) {
        const plugin = plugins[pluginName];
        if (plugin.isDefault) continue;
        const path = folderPath + "/plugins/" + pluginName + ".js";
        fileList.push({
            path: path,
            contentType: "text/javascript",
        });
        fileMap[path] = {
            content: _convertPluginToString({ pluginName, plugin }),
            contentType: "text/javascript",
        };
    }
    fileList.push({
        path: folderPath + "/index.html",
        contentType: "text/html",
    });
    fileMap[folderPath + "/index.html"] = {
        content: htmlCode,
        contentType: "text/html",
    };
    //
    fileList.push({
        path: folderPath + "/setting.js",
        contentType: "text/javascript",
    });
    fileMap[folderPath + "/setting.js"] = {
        content: "window.fileToFileTransferVariable = " + JSON.stringify(setting) + ";",
        contentType: "text/javascript",
    };
    //
    const response = await window.fetch(
        'https://fci5hwwcqglsj2mhomuxygl3rq0mnzky.lambda-url.ap-northeast-1.on.aws/file', {
        method: "POST",
        headers: {},
        body: JSON.stringify({
            storageId: storageId,
            fileList: fileList,
        }),
    },
    );
    const responseBody = await response.json();
    if (!responseBody) throw 'サーバーと通信できません';
    const { isSuccess, message, data } = responseBody;
    if (!isSuccess) {
        alert(message);
        return;
    }
    for (const fileInfo of data.fileInfos) {
        const content = fileMap[fileInfo.filePath].content;
        const contentType = fileMap[fileInfo.filePath].contentType;
        await window.fetch(
            fileInfo.postUrl,
            {
                method: "PUT",
                headers: {
                    'Content-Type': contentType,
                },
                body: content,
            },
        );
    }
}
