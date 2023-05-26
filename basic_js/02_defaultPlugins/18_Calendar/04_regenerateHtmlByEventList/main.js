
async function _regenerateHtmlByEventList({ blockId, saveData, year, month }) {
    if (!blockId) {
        console.error(`引数「${blockId}」が渡されていません`);
    }
    if (!saveData) {
        console.error(`引数「${saveData}」が渡されていません`);
    }
    if (!year) {
        console.error(`引数「${year}」が渡されていません`);
    }
    if (!month) {
        console.error(`引数「${month}」が渡されていません`);
    }
    //
    // AWS S3サーバーから講習会の一覧を取得
    const eventDatas = await _getEventList({
        eventTypeId: saveData?.eventTypeId,
        year,
        month
    });
    if (!eventDatas) {
        return false;
    }
    if (!Array.isArray(eventDatas.events)) {
        return false;
    }
    //
    const nowDate = new Date();
    //
    for (const eventData of eventDatas.events) {
        if (!eventData.startYear || !eventData.startMonth || !eventData.startDate) continue;
        const labelElement = document.getElementById(`label-${eventData.startYear}-${eventData.startMonth}-${eventData.startDate}`);
        if (!labelElement) continue;
        //
        const targetDate = new Date(eventData.startYear, eventData.startMonth - 1, eventData.startDate, 23, 59, 59);
        const isPast = (targetDate.getTime() < nowDate.getTime());
        //
        const eventCard = document.createElement("div");
        eventCard.classList.add("event_card_small");
        labelElement.appendChild(eventCard);
        if (isPast) {
            // すでに終了したイベントの場合
            eventCard.classList.add("disabled");
        }
        if (saveData?.isReservable && !eventData.isReservable) {
            // イベントの全体は予約を受け付けているのに、この時間帯だけ予約できない場合
            eventCard.classList.add("disabled");
        }
        if (eventData.isAllDay) {
            eventCard.innerText = "終日";
        }
        else {
            const startMinutesString = ("0" + String(eventData.startMinutes)).slice(-2);
            const endMinutesString = ("0" + String(eventData.endMinutes)).slice(-2);
            eventCard.innerText = `${eventData.startHours}:${startMinutesString}～${eventData.endHours}:${endMinutesString}`;
        }
    }
    //
    // イベントが最低１件ある日のタイトル
    const eventExistElements = document.querySelectorAll('.date-detail.event_exist>.openName');
    for (const element of eventExistElements) {
        element.style.display = "block";
    }
    return true;
}