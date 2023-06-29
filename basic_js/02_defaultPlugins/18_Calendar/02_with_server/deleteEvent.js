
async function _deleteEvent({ blockId, eventData, saveData }) {
    if (!blockId) {
        console.error(`引数「${blockId}」が渡されていません`);
    }
    if (!eventData) {
        console.error(`引数「${eventData}」が渡されていません`);
    }
    _showLoader();
    try {
        const url = "https://rfs7tgnp2e5bbqvnycc4ohh5sy0oixuw.lambda-url.ap-northeast-1.on.aws/delete_event";
        const responseStream = await window.fetch(
            url,
            {
                method: "POST",
                cache: "no-store",
                body: JSON.stringify({
                    "eventId": eventData.eventId,
                }),
            }
        );
        if (responseStream.status !== 200) {
            console.error('サーバーから読み込めません');
            console.error(responseStream);
            return null;
        }
        let responseData = {};
        try {
            responseData = await responseStream.json();
        }
        catch (e) {
            console.error('JSONに変換できませんでした');
            return null;
        }
        alert(responseData.message);
    }
    catch (err) { }
    _deleteLoader();
    //
    window.setTimeout(() => {
        // サーバーから情報を取得して画面を更新
        _regenerateHtmlByEventList({
            blockId,
            saveData,
            year: eventData.startYear,
            month: eventData.startMonth,
        });
    }, 1500);
}
