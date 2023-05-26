
async function _regenerateHtmlByEventList(eventTypeId, saveData, year, month) {
    const eventDatas = await _getEventList({eventTypeId, year, month});
    if(eventDatas===null){
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
        //
        // グローバル変数に保存
        if (!window.events) {
            window.events = {};
        }
        if (!window.events[blockId]) {
            window.events[blockId] = {};
        }
        const dateString = `${eventData.startYear}-${eventData.startMonth}-${eventData.startDate}`;
        if (!window.events[blockId][dateString]) {
            window.events[blockId][dateString] = [];
        }
        window.events[blockId][dateString].push(eventData);
    }
    //
    // イベントが最低１件ある日のタイトル
    const eventExistElements = document.querySelectorAll('.date-detail.event_exist>.openName');
    for (const element of eventExistElements) {
        element.style.display = "block";
    }
    return true;
}