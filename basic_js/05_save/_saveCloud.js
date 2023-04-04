//#########################################################################################
async function saveCloud({ storageId, filePath, htmlCode }) {
    const response = await window.fetch(
        'https://fci5hwwcqglsj2mhomuxygl3rq0mnzky.lambda-url.ap-northeast-1.on.aws/file', {
        method: "POST",
        headers: {},
        body: JSON.stringify({
            storageId: storageId,
            fileList: [
                {
                    path: filePath,
                    contentType: "text/html",
                },
                {
                    path: filePath.replace("index.html", "setting.js"),
                    contentType: "text/javascript",
                }
            ],
            filePath: filePath,
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
    console.log(data);
    for (const fileInfo of data.fileInfos) {
        if (fileInfo.filePath.endsWith("index.html")) {
            const response = await window.fetch(
                fileInfo.postUrl, {
                method: "PUT",
                headers: {
                    'Content-Type': "text/html",
                },
                body: htmlCode,
            },
            );
            console.log(response);
        }
        else if (fileInfo.filePath.endsWith("setting.js")) {
            await window.fetch(
                fileInfo.postUrl, {
                method: "PUT",
                headers: {
                    'Content-Type': "text/javascript",
                },
                body: "window.fileToFileTransferVariable = " + JSON.stringify(settings[0]) + ";",
            },
            );
            console.log(response);
        }
    }
}
