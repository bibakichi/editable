
// カレンダーの日付をクリックしたときに実行される関数。
// 戻り値にモーダルウィンドウのHTML要素を返す必要がある。
async function handleOpenDayModal({ blockId, saveData, year, month, date, onClose }) {
    if (!blockId) {
        console.error(`引数「${blockId}」が渡されていません`);
    }
    if (!year) {
        console.error(`引数「${year}」が渡されていません`);
    }
    if (!month) {
        console.error(`引数「${month}」が渡されていません`);
    }
    if (!date) {
        console.error(`引数「${date}」が渡されていません`);
    }
    if (!onClose) {
        console.error(`引数「${onClose}」が渡されていません`);
    }
    const outerElement = document.createElement("div");
    outerElement.classList.add('date-detail');
    //
    const weeks = ['日', '月', '火', '水', '木', '金', '土'];
    const targetDate = new Date(year, month - 1, date, 23, 59, 59);
    const nowDate = new Date();
    const isPast = (targetDate.getTime() < nowDate.getTime());
    //
    const dateTitleElement = document.createElement("h2");
    dateTitleElement.style.marginTop = "40px";
    dateTitleElement.innerText = `${year}年${month}月${date}日（${weeks[targetDate.getDay()]}）`;
    outerElement.appendChild(dateTitleElement);
    //
    if ((!window.events) || (!window.events[blockId]) || (!window.events[blockId][`${year}-${month}-${date}`])) {
        return outerElement;
    }
    if (window.events[blockId][`${year}-${month}-${date}`]?.length > 0) {
        outerElement.classList.add('event_exist');
        //
        if (saveData?.openName) {
            const eventTitleElement = document.createElement("h2");
            eventTitleElement.style.margin = "20px 0";
            eventTitleElement.innerText = saveData?.openName;
            outerElement.appendChild(eventTitleElement);
        }
    }
    for (const eventData of window.events[blockId][`${year}-${month}-${date}`]) {
        //
        const eventCard = document.createElement("div");
        eventCard.classList.add("event_card_large");
        outerElement.appendChild(eventCard);
        if (isPast) {
            // すでに終了したイベントの場合
            eventCard.classList.add("disabled");
        }
        if (saveData?.isReservable && !eventData.isReservable) {
            // イベントの全体は予約を受け付けているのに、この時間帯だけ予約できない場合
            eventCard.classList.add("disabled");
        }
        //
        const timeElement = document.createElement("span");
        timeElement.classList.add("event_time");
        eventCard.appendChild(timeElement);
        if (eventData.isAllDay) {
            timeElement.innerText = "終日";
        }
        else {
            const startMinutesString = ("0" + String(eventData.startMinutes)).slice(-2);
            const endMinutesString = ("0" + String(eventData.endMinutes)).slice(-2);
            timeElement.innerText = `${eventData.startHours}:${startMinutesString}～${eventData.endHours}:${endMinutesString}`;
        }
        //
        if (saveData?.isReservable && !isPast) {
            // 予約受付中
            //
            let isBooking = false;
            if (window?.userInfo) {
                for (const e of window?.userInfo?.reservations ?? []) {
                    if (e.eventId == eventData.eventId) {
                        // もし予約中なら
                        isBooking = true;
                    }
                }
            }
            if (isBooking) {
                const buttonElement = document.createElement("button");
                buttonElement.classList.add("button3d");
                buttonElement.innerText = "キャンセル";
                eventCard.appendChild(buttonElement);
                buttonElement.addEventListener("click", async () => {
                    await _deleteReservation({ blockId, eventData, userInfo });
                });
                //
                const commentElement = document.createElement("div");
                commentElement.innerHTML = "予約中";
                commentElement.style.color = "#0f0";
                commentElement.style.fontWeight = "bold";
                commentElement.style.textAlign = "left";
                commentElement.style.whiteSpace = "pre-wrap";
                eventCard.appendChild(commentElement);
            }
            else {
                const buttonElement = document.createElement("button");
                buttonElement.classList.add("button3d");
                buttonElement.innerText = "予約";
                eventCard.appendChild(buttonElement);
                if (!eventData.isReservable) {
                    buttonElement.disabled = true;
                }
                buttonElement.addEventListener("click", async () => await _handleClickReservation({ blockId, eventData, userInfo, onClose, saveData }));
                //
                if (eventData.reserveComment) {
                    const commentElement = document.createElement("div");
                    commentElement.innerHTML = eventData.reserveComment;
                    if (eventData.isReservable && !isPast) {
                        commentElement.style.color = "#fff";
                    }
                    else {
                        commentElement.style.color = "#555";
                    }
                    commentElement.style.fontSize = "small";
                    commentElement.style.textAlign = "left";
                    commentElement.style.whiteSpace = "pre-wrap";
                    eventCard.appendChild(commentElement);
                }
            }
        }
        else {
            const paddingElement = document.createElement("div");
            paddingElement.style.height = "30px";
            eventCard.appendChild(paddingElement);
        }
    }
    return outerElement;
}

