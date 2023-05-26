
async function _deleteReservation({ blockId, eventData, userInfo }) {
    if (!blockId) {
        console.error(`引数「${blockId}」が渡されていません`);
    }
    if (!eventData) {
        console.error(`引数「${eventData}」が渡されていません`);
    }
    if (!userInfo) {
        console.error(`引数「${userInfo}」が渡されていません`);
    }
    _showLoader();
    try {
        const url = "https://rfs7tgnp2e5bbqvnycc4ohh5sy0oixuw.lambda-url.ap-northeast-1.on.aws/delete_reservation";
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
        alert(responseData.message);
    }
    catch (err) { }
    _deleteLoader();
    //
    // 変数「userInfo」から、たった今キャンセルしたイベントの予約情報を削除する
    const newUserInfo = {
        ...userInfo,
        reservations: [],
    };
    for (const e of userInfo?.reservations ?? []) {
        if (eventData.eventId != e.eventId) {
            // たった今キャンセルしたイベントではなかったら
            newUserInfo.reservations.push(e);
        }
    }
    //
    // グローバル変数にも保存
    window.userInfo = newUserInfo;
    //
    // HTMLを再生成
    _regenerateHtmlByUserInfo({
        blockId,
        eventTypeId: eventData.eventTypeId,
        userInfo: newUserInfo,
    });
}
