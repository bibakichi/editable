
async function _getEventList({ blockId, eventTypeId, year, month }) {
    if (!eventTypeId) {
        console.error(`引数「${eventTypeId}」が渡されていません`);
    }
    if (!year) {
        console.error(`引数「${year}」が渡されていません`);
    }
    if (!month) {
        console.error(`引数「${month}」が渡されていません`);
    }
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
    //
    // グローバル変数にも保存する
    if (!window.events) {
        window.events = {};
    }
    window.events[blockId] = {};
    for (const eventData of eventDatas.events) {
        const dateString = `${eventData.startYear}-${eventData.startMonth}-${eventData.startDate}`;
        if (!window.events[blockId][dateString]) {
            window.events[blockId][dateString] = [];
        }
        window.events[blockId][dateString].push(eventData);
    }
    return eventDatas;
}