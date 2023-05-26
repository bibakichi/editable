
// ユーザー情報をもとにHTMLを再生成する関数
async function _regenerateHtmlByUserInfo({ blockId, eventTypeId, userInfo }) {
    if(!blockId){
        console.error(`引数「${blockId}」が渡されていません`);
    }
    if(!eventTypeId){
        console.error(`引数「${eventTypeId}」が渡されていません`);
    }
    if(!userInfo){
        console.error(`引数「${userInfo}」が渡されていません`);
    }
    console.log("¥n¥nユーザー情報を再描画します");
    console.log(userInfo);
    //
    const studentIdElement2 = document.getElementById("studentId2_" + blockId);
    studentIdElement2.innerText = "学籍番号：" + userInfo?.studentId;
    //
    const underReservation = document.getElementById("underReservation_" + blockId);
    const please5 = document.getElementById("please5_" + blockId);
    const notEligible = document.getElementById("notEligible_" + blockId);
    const calendarElement = document.getElementById("calendarElement_" + blockId);
    if (userInfo?.reservations.length > 0) {
        // 予約中の場合
        underReservation.style.display = "block";    //表示
        notEligible.style.display = "none";    //非表示
        please5.style.display = "none";    //非表示
        //
        const please4 = document.getElementById("please4_" + blockId);
        //
        // 予約情報の配列を、特定のイベントだけにフィルタリングする関数
        const reservationsOnlyThisEvent = _filterReservations({
            reservations: userInfo?.reservations ?? [],
            eventTypeId: eventTypeId,
        });
        if (reservationsOnlyThisEvent.length >= userInfo?.eventSetting?.reservedSlots) {
            // 予約可能枠を使い切った場合
            please4.style.display = "none";    //非表示
            calendarElement.style.display = "none";    //非表示
        }
        else {
            // 予約可能枠が残っている場合
            please4.style.display = "block";    //表示
            calendarElement.style.display = "block";    //表示
        }
    }
    else if (!userInfo?.eventSetting?.eligibilityFlag) {
        // 参加資格がない場合
        underReservation.style.display = "none";    //非表示
        notEligible.style.display = "block";    //表示
        please5.style.display = "none";    //非表示
        calendarElement.style.display = "none";    //非表示
        //
        notEligible.innerHTML = (userInfo?.eventSetting?.notEligibleMessage ?? 'あなたは参加資格がありません。')
            + "<br>学籍番号：" + userInfo?.studentId;
    }
    else {
        // １件も予約していない場合
        underReservation.style.display = "none";    //非表示
        notEligible.style.display = "none";    //非表示
        please5.style.display = "block";    //表示
        calendarElement.style.display = "block";    //表示
    }
    //
    //　予約中のイベント一覧を表示する
    const reservationsElement = document.getElementById("reservations_" + blockId);
    reservationsElement.innerHTML = "";
    for (const eventData of userInfo?.reservations ?? []) {
        const eventCard = document.createElement("div");
        eventCard.classList.add("event_card_large");
        reservationsElement.appendChild(eventCard);
        //
        const timeElement = document.createElement("span");
        timeElement.classList.add("event_time");
        eventCard.appendChild(timeElement);
        timeElement.innerHTML = `${eventData.startMonth}月${eventData.startDate}日<br>`;
        if (eventData.isAllDay) {
            timeElement.innerHTML += "終日";
        }
        else {
            const startMinutesString = ("0" + String(eventData.startMinutes)).slice(-2);
            const endMinutesString = ("0" + String(eventData.endMinutes)).slice(-2);
            timeElement.innerHTML += `${eventData.startHours}:${startMinutesString}～${eventData.endHours}:${endMinutesString}`;
        }
        //
        const buttonElement = document.createElement("button");
        buttonElement.classList.add("button3d");
        buttonElement.innerText = "キャンセル";
        eventCard.appendChild(buttonElement);
        buttonElement.addEventListener("click", async () => {
            await _deleteReservation({ blockId, eventData, userInfo });
        });
        //
        const commentElement = document.createElement("div");
        commentElement.innerHTML = eventData.eventTypeText;
        commentElement.style.textAlign = "left";
        commentElement.style.whiteSpace = "pre-wrap";
        eventCard.appendChild(commentElement);
    }
}