
async function _postReservation({ blockId, eventData, userInfo, saveData }) {
    if (!blockId) {
        console.error(`引数「${blockId}」が渡されていません`);
    }
    if (!eventData) {
        console.error(`引数「${eventData}」が渡されていません`);
    }
    if (!userInfo) {
        console.error(`引数「${userInfo}」が渡されていません`);
    }
    if (!userInfo) {
        console.error(`引数「${userInfo}」が渡されていません`);
    }
    _showLoader();
    try {
        const url = "https://rfs7tgnp2e5bbqvnycc4ohh5sy0oixuw.lambda-url.ap-northeast-1.on.aws/post_reservation";
        const responseStream = await window.fetch(
            url,
            {
                method: "POST",
                cache: "no-store",
                body: JSON.stringify({
                    "departmentId": userInfo.departmentId,
                    "eventId": eventData.eventId,
                    "studentId": userInfo.studentId,
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
        if (responseData.isSuccess) {
            for (const completionMessage of eventData.completionMessages) {
                alert(completionMessage);
            }
        }
        else {
            alert(responseData.message);
        }
    }
    catch (err) { }
    _deleteLoader();
    //
    // 変数「userInfo」に、たった今キャンセルしたイベントの予約情報を追加する
    userInfo.reservations.push(eventData);
    //
    // グローバル変数にも保存
    window.userInfo = userInfo;
    //
    // HTMLを再生成（サーバーからの情報をもとにしておらず、とりあえずの画面更新）
    _regenerateHtmlByUserInfo({
        blockId,
        eventTypeId: eventData.eventTypeId,
        userInfo: userInfo,
        saveData,
    });
}