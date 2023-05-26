
async function _getEventList({eventTypeId, year, month}) {
    const url = `https://mono-calendar.s3.ap-northeast-1.amazonaws.com/${eventTypeId}/${year}%E5%B9%B4${month}%E6%9C%88`;
    let eventDatas = null;
    const responseStream = await window.fetch(url, { cache: "no-store" });
    if (responseStream.status === 200) {
        try {
            eventDatas = await responseStream.json();
        }
        catch (e) {
            console.error('JSONに変換できませんでした');
            return null;
        }
    }
    else {
        console.error('サーバーから読み込めません');
        console.error(responseStream);
        return null;
    }
    console.log(eventDatas);
}