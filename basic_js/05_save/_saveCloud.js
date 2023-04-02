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
    /*await window.fetch(
        data.postUrl, {
        method: "PUT",
        headers: {
            'Content-Type': "text/html",
        },
        body: htmlCode,
    },
    );*/
}
