
async function _getUserInfo({ departmentId, studentId, eventTypeId }) {
    const url = `https://rfs7tgnp2e5bbqvnycc4ohh5sy0oixuw.lambda-url.ap-northeast-1.on.aws/get_user_info`;
    const responseStream = await window.fetch(
        url,
        {
            method: "POST",
            cache: "no-store",
            body: JSON.stringify({
                "departmentId": departmentId,
                "studentId": studentId,
                "eventTypeId": eventTypeId,
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
    if (!responseData.isSuccess) {
        alert(responseData.message);
        throw responseData.message;
    }
    return responseData.data;
}