
async function _postReservation({ eventData, userInfo }) {
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
    alert(responseData.message);
    //
    // 変数「userInfo」に、たった今キャンセルしたイベントの予約情報を追加する
    userInfo.reservations.push(eventData);
    //
    // HTMLを再生成
    _regenerateHtmlByUserInfo({ eventTypeId:eventData.eventTypeId, userInfo: userInfo });
}