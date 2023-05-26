
//#########################################################################################
plugins["Calendar"] = {
    "isDefault": true,

    "css": async function (saveData) {
        return `
            /*===========================================================================*/

            table.calendar {
                border-spacing: 0;
                border-collapse: collapse;
                width: 100%;
                table-layout: fixed;
                font-size: 16px;
                text-align: center;
            }

            table.calendar>tbody>tr>th {
                font-weight: normal;
            }

            table.calendar>tbody>tr>td {
                border: 1px solid #ddd;
                vertical-align: top;
                min-height: max-content;
                height: 90px;
                box-sizing: border-box;
                background: #fafafa;
            }

            @media print {
                table.calendar>tbody>tr>td {
                    background: none;
                }
            }

            table.calendar>tbody>tr>td>label {
                display: block;
                padding: 0;
                height: 100%;
            }

            table.calendar>tbody>tr>td>label:hover {
                cursor: pointer;
                background: #fff;
            }

            .not-today {
                padding-top: 9px;
            }

            .today {
                border-top: 5px solid #8d0000;
                padding-top: 2px;
                border-bottom: 2px solid #8d0000;
            }

            @media print {
                .today {
                    padding-top: 9px;
                    border: none;
                }
            }

            table.calendar>tbody>tr>td>label {
                color: black;
            }

            table.calendar>tbody>tr>td:first-child>label {
                color: red;
            }

            table.calendar>tbody>tr>td:last-child>label {
                color: royalblue;
            }

            table.calendar>tbody>tr>td>label.not_this_month {
                color: #ccc;
            }

            .event_card_small {
                background: #8d0000b3;
                color: #fff;
                font-size: 12px;
                margin: 3px;
                border-radius: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-align: left;
                padding-left: 3px;
            }

            @media print {
                .event_card_small {
                    background: none;
                    color: #000;
                    font-size: 10px;
                    border: solid 1px #ccc;
                }
            }

            .event_card_small.disabled {
                background: #8d000024;
            }

            /*===========================================================================*/
            #monthly-box-outer {
                width: 100%;
                position: relative;
                height: 70px;
            }

            #monthly-box-outer>div {
                position: absolute;
                width: 100%;
                top: 0;
                bottom: 0;
                margin: auto;
                height: min-content;
                pointer-events: none;
            }

            #monthly-box-outer>div>a {
                pointer-events: all;
            }

            @media print {
                #monthly-box-outer>div>a {
                    display: none;
                }
            }

            #monthly-box-outer>#monthly-box-left {
                text-align: left;
            }

            #monthly-box-outer>#monthly-box-center {
                text-align: center;
                font-size: 20px;
            }

            #monthly-box-outer>#monthly-box-right {
                text-align: right;
            }

            /*===========================================================================*/

            .date-detail {
                text-align: center;
            }

            .date-detail.visible {
                display: block;
            }

            .event_card_large {
                background: #8d0000b3;
                color: #fff;
                position: relative;
                font-size: 16px;
                margin: 10px auto;
                border-radius: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-align: left;
                padding: 10px;
                text-align: right;
                max-width: 300px;
                min-height: 35px;
            }

            .event_card_large.disabled {
                background: #8d000024;
            }

            @media print {
                .event_card_large {
                    background: none;
                    color: #000;
                    font-size: 10px;
                    border: solid 1px #ccc;
                }
            }

            .event_time {
                position: absolute;
                left: 10px;
                top: 10px;
                text-align: left;
            }

            .date-detail>.openName{
                display:none;
            }

            .date-detail.event_exist>.openName{
                display:block;
            }


            /*===========================================================================*/
        `;
    },

    "viewer": {


        //【必須】実際に表示するHTML要素を生成する関数
        //    ※ページを開いた直後に、１度だけ実行されます。
        //    ※サーバーと連携して、表示するたびに内容が変化するような使い方もできます。
        //    ※未定義の場合は、ツールボックスの中だけで動作するプラグインになります。（例：画質変換）
        "renderHeavy": async function (blockId, saveData) {
            const departmentId = '01GVJNAM1QSFVRSCAKN85BF972';

            //全角を半角に直す関数
            function toHalfWidth(strVal) {
                // 半角変換
                var halfVal = strVal.replace(/[！-～]/g,
                    function (tmpStr) {
                        // 文字コードをシフト
                        return String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0);
                    }
                );
                // 文字コードシフトで対応できない文字の変換
                return halfVal.replace(/”/g, "\"")
                    .replace(/’/g, "'")
                    .replace(/‘/g, "`")
                    .replace(/￥/g, "\\")
                    .replace(/　/g, " ")
                    .replace(/〜/g, "~");
            }

            //文字列を0で埋める関数
            //numにオリジナルの数字を、lengthに桁数をいれてください。
            function zeroPadding(num, length) {
                return ('0000000000' + num).slice(-length);
            }

            //学籍番号を整形する関数
            function formatID(id) {
                if (id == '' || id == null) {
                    return '';
                }
                id = toHalfWidth(id);
                id = zeroPadding(id, 8);
                id = id.toUpperCase();
                return id;
            }

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

            // 予約情報の配列を、特定のイベントだけにフィルタリングする関数
            function _filterReservations({ reservations, eventTypeId }) {
                const newReservations = [];
                for (const reservation of reservations) {
                    if (eventTypeId == reservation.eventTypeId) {
                        newReservations.push(reservation);
                    }
                }
                return newReservations;
            }
            
            async function _handleCancelReservation({eventId,studentId}) {
                const url = "https://rfs7tgnp2e5bbqvnycc4ohh5sy0oixuw.lambda-url.ap-northeast-1.on.aws/delete_reservation";
                const responseStream = await window.fetch(
                    url,
                    {
                        method: "POST",
                        cache: "no-store",
                        body: JSON.stringify({
                            "departmentId": "01GVJNAM1QSFVRSCAKN85BF972",
                            "eventId": eventId,
                            "studentId": studentId,
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

            // ユーザー情報をもとにHTMLを再生成する関数
            async function _regenerateByUserInfo({ userInfo }) {
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
                        eventTypeId: saveData?.eventTypeId,
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
                        await _handleCancelReservation({
                            eventId:eventData.eventId,
                            studentId:userInfo?.studentId,
                        });
                    });
                    //
                    const commentElement = document.createElement("div");
                    commentElement.innerHTML = eventData.eventTypeText;
                    commentElement.style.textAlign = "left";
                    commentElement.style.whiteSpace = "pre-wrap";
                    eventCard.appendChild(commentElement);
                }
            }

            async function _search({ studentId }) {
                studentId = formatID(studentId);
                //
                // 厳しくチェックをする（フォーマット後だから）
                const regex = /^([0-9]{8})|(((LC)|(LH)|(LJ)|(LP)|(LE)|(LG)|(LF)|(LA)|(JJ)|(JB)|(EE)|(EI)|(CC)|(CB)|(CF)|(BB)|(SM)|(SP)|(SC)|(SE)|(TM)|(TE)|(TL)|(TK)|(TC)|(TA)|(MM)|(MN)|(PP)|(GS)|(GH)|(LD)|(JD)|(ED)|(CD)|(SD)|(TD)|(MD)|(PD)|(GD)|(AU)|(AG)|(XA)|(ES)|(FS)|(RE)|(DG)|(XR)|(GD)|(XL))[0-9]{6})$/;
                if (!regex.test(studentId)) return;
                //
                const studentIdElement = document.getElementById("studentId_" + blockId);
                studentIdElement.value = studentId;
                //
                const userInfo = await _getUserInfo({
                    departmentId,
                    studentId,
                    eventTypeId: saveData?.eventTypeId,
                });
                await _regenerateByUserInfo({ userInfo });
            }

            async function _handleReservation({eventId,studentId}) {
                const url = "https://rfs7tgnp2e5bbqvnycc4ohh5sy0oixuw.lambda-url.ap-northeast-1.on.aws/post_reservation";
                const responseStream = await window.fetch(
                    url,
                    {
                        method: "POST",
                        cache: "no-store",
                        body: JSON.stringify({
                            "departmentId": "01GVJNAM1QSFVRSCAKN85BF972",
                            "eventId": eventId,
                            "studentId": studentId,
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

            async function _getMonthlyData(eventTypeId, saveData, year, month) {
                const url = `https://mono-calendar.s3.ap-northeast-1.amazonaws.com/${eventTypeId}/${year}%E5%B9%B4${month}%E6%9C%88`;
                let eventDatas = null;
                const responseStream = await window.fetch(url, { cache: "no-store" });
                if (responseStream.status === 200) {
                    try {
                        eventDatas = await responseStream.json();
                    }
                    catch (e) {
                        console.error('JSONに変換できませんでした');
                        return false;
                    }
                }
                else {
                    console.error('サーバーから読み込めません');
                    console.error(responseStream);
                    return false;
                }
                console.log(eventDatas);
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

            async function createDateDetail({ year, month, date }) {
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
                        // イベントの全体が予約を受け付けているのに、この時間帯だけ予約できない場合
                        const buttonElement = document.createElement("button");
                        buttonElement.classList.add("button3d");
                        buttonElement.innerText = "予約";
                        eventCard.appendChild(buttonElement);
                        if (!eventData.isReservable) {
                            buttonElement.disabled = true;
                        }
                        buttonElement.addEventListener("click", async () => {
                            await _handleReservation({
                                eventId:eventData.eventId,
                                studentId:"00045175",
                            });
                        });
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
                    else {
                        const paddingElement = document.createElement("div");
                        paddingElement.style.height = "30px";
                        eventCard.appendChild(paddingElement);
                    }
                }
                return outerElement;
            }



            _showLoader();
            //
            const outerElement = document.createElement("div");
            outerElement.style.position = "relative";
            outerElement.id = blockId;
            //
            if (saveData?.isReservable) {
                //
                const please1 = document.createElement("h3");
                please1.innerText = "1. 学籍番号を入力してください";
                outerElement.appendChild(please1);
                //
                const studentIdOuterElement = document.createElement("div");
                studentIdOuterElement.style.padding = "5px 5px 5px 30px";
                outerElement.appendChild(studentIdOuterElement);
                //
                const studentIdElement = document.createElement('input');
                studentIdElement.id = "studentId_" + blockId;
                studentIdElement.style.width = "200px";
                studentIdElement.style.boxSizing = "border-box";
                studentIdOuterElement.appendChild(studentIdElement);
                //
                // Enterキーが押されたとき
                studentIdElement.addEventListener('keypress', async (event) => {
                    if (event.key !== 'Enter') return;
                    const studentId = studentIdElement.value;
                    await _search({ studentId });
                });
                //
                // 学籍番号が入力途中のとき
                studentIdElement.addEventListener('input', async () => {
                    let studentId = studentIdElement.value;
                    try {
                        studentId = toHalfWidth(studentId);
                        studentId = studentId.toUpperCase();
                    }
                    catch (e) { }
                    //
                    // ゆるくチェックをする（フォーマット前だから）
                    const regex = /^([1-9][0-9]{4})|([0-9]{8})|(((LC)|(LH)|(LJ)|(LP)|(LE)|(LG)|(LF)|(LA)|(JJ)|(JB)|(EE)|(EI)|(CC)|(CB)|(CF)|(BB)|(SM)|(SP)|(SC)|(SE)|(TM)|(TE)|(TL)|(TK)|(TC)|(TA)|(MM)|(MN)|(PP)|(GS)|(GH)|(LD)|(JD)|(ED)|(CD)|(SD)|(TD)|(MD)|(PD)|(GD)|(AU)|(AG)|(XA)|(ES)|(FS)|(RE)|(DG)|(XR)|(GD)|(XL)|(lc)|(lh)|(lj)|(lp)|(le)|(lg)|(lf)|(la)|(jj)|(jb)|(ee)|(ei)|(cc)|(cb)|(cf)|(bb)|(sm)|(sp)|(sc)|(se)|(tm)|(te)|(tl)|(tk)|(tc)|(ta)|(mm)|(mn)|(pp)|(gs)|(gh)|(ld)|(jd)|(ed)|(cd)|(bd)|(sd)|(td)|(md)|(pd)|(gd))[0-9]{6})$/;
                    if (!regex.test(studentId)) return;
                    //
                    await _search({ studentId });
                });
                //
                //-----------------------------------
                // 利用資格が無い場合だけ表示
                //
                const notEligible = document.createElement("h3");
                notEligible.id = "notEligible_" + blockId;
                notEligible.innerText = "参加資格がありません";
                notEligible.style.display = "none";    //最初は非表示
                notEligible.style.marginTop = "50px";
                notEligible.style.color = "red";
                outerElement.appendChild(notEligible);
                //
                //-----------------------------------
                // 予約中の時だけ表示
                //
                const underReservation = document.createElement("div");
                underReservation.id = "underReservation_" + blockId;
                underReservation.style.display = "none";    //最初は非表示
                outerElement.appendChild(underReservation);
                //
                const please3 = document.createElement("h3");
                please3.innerText = "2. あなたは以下のイベントを予約中です。";
                please3.style.marginTop = "50px";
                underReservation.appendChild(please3);
                //
                const studentIdElement2 = document.createElement("div");
                studentIdElement2.id = "studentId2_" + blockId;
                studentIdElement2.style.marginLeft = "30px";
                studentIdElement2.innerText = "学籍番号：";
                underReservation.appendChild(studentIdElement2);
                //
                const reservationsElement = document.createElement("div");
                reservationsElement.id = "reservations_" + blockId;
                reservationsElement.style.marginLeft = "30px";
                reservationsElement.style.maxWidth = "300px";
                underReservation.appendChild(reservationsElement);
                //
                const please4 = document.createElement("h3");
                please4.id = "please4_" + blockId;
                please4.innerText = "3. 追加で予約する場合は、日時を選択してください";
                please4.style.marginTop = "50px";
                underReservation.appendChild(please4);
                //
                //-----------------------------------
                // 予約していない時だけ表示
                //
                const please5 = document.createElement("h3");
                please5.id = "please5_" + blockId;
                please5.innerText = "2. 日時を選択してください";
                please5.style.marginTop = "50px";
                outerElement.appendChild(please5);
                //
                //-----------------------------------
            }
            //
            const calendarElement = document.createElement("div");
            calendarElement.id = "calendarElement_" + blockId;
            outerElement.appendChild(calendarElement);
            //
            const monthlyBoxOuter = document.createElement("div");
            monthlyBoxOuter.id = "monthly-box-outer";
            calendarElement.appendChild(monthlyBoxOuter);
            //
            const tableElement = document.createElement("table");
            tableElement.classList.add("calendar");
            calendarElement.appendChild(tableElement);
            //
            const tbodyElement = document.createElement("tbody");
            tableElement.appendChild(tbodyElement);
            //
            // クエリパラメータから、year、month の３つを取得
            const nowDateObj = new Date();
            const params = new URLSearchParams(location.search);
            //
            let year = params.get("y");
            if (!year) {
                year = nowDateObj.getFullYear();
            }
            else {
                try {
                    year = Number(year);
                }
                catch (e) {
                    alert('クエリパラメータ「y」（年）を数値に変換できません');
                    _deleteLoader();
                    return;
                }
            }
            let month = params.get("m");
            if (!month) {
                month = nowDateObj.getMonth() + 1;
            }
            else {
                try {
                    month = Number(month);
                }
                catch (e) {
                    alert('クエリパラメータ「m」（月）を数値に変換できません');
                    _deleteLoader();
                    return;
                }
            }
            //
            const planeUrl = location.href.split('?')[0];
            //
            // ボタン「先月」を生成する
            const monthlyBoxLeft = document.createElement("div");
            monthlyBoxLeft.id = "monthly-box-left";
            monthlyBoxOuter.appendChild(monthlyBoxLeft);
            let lastMonthUrl;
            if (month == 1) {
                lastMonthUrl = `${planeUrl}?y=${year - 1}&m=${12}`;
            }
            else {
                lastMonthUrl = `${planeUrl}?y=${year}&m=${month - 1}`;
            }
            monthlyBoxLeft.innerHTML = `<a href="${lastMonthUrl}" class="buttonFlat">先月</a>`;
            //
            const monthlyBoxCenter = document.createElement("div");
            monthlyBoxCenter.id = "monthly-box-center";
            monthlyBoxCenter.innerHTML = `${year}年 ${month}月`;
            monthlyBoxOuter.appendChild(monthlyBoxCenter);
            //
            // ボタン「翌月」を生成する
            const monthlyBoxRight = document.createElement("div");
            monthlyBoxRight.id = "monthly-box-right";
            monthlyBoxOuter.appendChild(monthlyBoxRight);
            let nextMonthUrl;
            if (month == 12) {
                nextMonthUrl = `${planeUrl}?y=${year + 1}&m=${1}`;
            }
            else {
                nextMonthUrl = `${planeUrl}?y=${year}&m=${month + 1}`;
            }
            monthlyBoxRight.innerHTML = `<a href="${nextMonthUrl}" class="buttonFlat">翌月</a>`;
            //
            const weeks = ['日', '月', '火', '水', '木', '金', '土'];
            const startDate = new Date(year, month - 1, 1) // 月の最初の日を取得
            const endDate = new Date(year, month, 0) // 月の最後の日を取得
            const endDayCount = endDate.getDate() // 月の末日
            const lastMonthEndDate = new Date(year, month - 1, 0) // 前月の最後の日の情報
            const lastMonthendDayCount = lastMonthEndDate.getDate() // 前月の末日
            const startDay = startDate.getDay() // 月の最初の日の曜日を取得
            let dayCount = 1 // 日にちのカウント

            const trElement = document.createElement("tr");
            tbodyElement.appendChild(trElement);

            // 曜日の行を作成
            for (let i = 0; i < weeks.length; i++) {
                const thElement = document.createElement("th");
                thElement.innerHTML = weeks[i];
                trElement.appendChild(thElement);
            }

            const nowYear = nowDateObj.getFullYear();
            const nowMonth = nowDateObj.getMonth() + 1;
            const nowDate = nowDateObj.getDate();
            //
            const { openButtonElement, mainElement, checkboxElement } = createModal();
            //
            for (let w = 0; w < 6; w++) {
                const trElement = document.createElement("tr");
                tbodyElement.appendChild(trElement);

                for (let d = 0; d < 7; d++) {
                    const tdElement = document.createElement("td");
                    trElement.appendChild(tdElement);
                    const labelElement = openButtonElement.cloneNode(false);
                    tdElement.appendChild(labelElement);
                    let thisYear, thisMonth, thisDate;
                    if (w == 0 && d < startDay) {
                        // 1行目で1日の曜日の前
                        thisYear = (month == 1) ? (year - 1) : year;
                        thisMonth = (month == 1) ? 12 : (month - 1);
                        thisDate = lastMonthendDayCount - startDay + d + 1;
                        labelElement.classList.add("not_this_month");
                    } else if (dayCount > endDayCount) {
                        // 末尾の日数を超えた
                        thisYear = (month == 12) ? (year + 1) : year;
                        thisMonth = (month == 12) ? 1 : (month + 1);
                        thisDate = dayCount - endDayCount;
                        labelElement.classList.add("not_this_month");
                        dayCount++
                    } else {
                        thisYear = year;
                        thisMonth = month;
                        thisDate = dayCount;
                        dayCount++
                    }
                    const isToday = (thisYear === nowYear) && (thisMonth === nowMonth) && (thisDate === nowDate);
                    labelElement.innerHTML = `
                        <div class="${isToday ? 'today' : 'not-today'}"></div>
                        ${thisDate}
                    `;
                    labelElement.id = `label-${thisYear}-${thisMonth}-${thisDate}`;
                    labelElement.addEventListener("click", async (event) => {
                        const detail = await createDateDetail({ year: thisYear, month: thisMonth, date: thisDate });
                        mainElement.innerHTML = "";
                        mainElement.appendChild(detail);
                    });

                }
            }
            //
            //
            async function _after({ year, month }) {
                //
                // 今月の予定を読み込む
                const flag = await _getMonthlyData(saveData.eventTypeId, saveData, year, month);
                //
                if (!flag) {
                    // データなし（未定）
                    const noDataElements = document.querySelectorAll('.date-detail:not(.event_exist)>.noDataText');
                    for (const element of noDataElements) {
                        element.style.display = "block";
                    }
                }
                _deleteLoader();
                //
                // 先月の予定を読み込む
                if (month == 1) {
                    await _getMonthlyData(saveData.eventTypeId, saveData, year - 1, 12);
                }
                else {
                    await _getMonthlyData(saveData.eventTypeId, saveData, year, month - 1);
                }
                //
                // 来月の予定を読み込む
                if (month == 12) {
                    await _getMonthlyData(saveData.eventTypeId, saveData, year + 1, 1);
                }
                else {
                    await _getMonthlyData(saveData.eventTypeId, saveData, year, month + 1);
                }
                //
                const url = `https://rfs7tgnp2e5bbqvnycc4ohh5sy0oixuw.lambda-url.ap-northeast-1.on.aws/put_s3_monthly_file?eti=${saveData.eventTypeId}&year=${year}&month=${month}`;
                await window.fetch(url, { cache: "no-store" });
            }
            if (saveData.eventTypeId) {
                _after({ year, month });
            }
            else {
                _deleteLoader();
            }
            return outerElement;
        },

        renderLight: async function (blockId, saveData) {
            return document.createElement('div');
        },

        //【任意】編集モードに切り替わったとき
        changeEditMode: async function (blockId, saveData) {
            const outerElement = document.getElementById(blockId);
            //
            const overlayElement = document.createElement("div");
            outerElement.appendChild(overlayElement);
            overlayElement.style.position = "absolute";
            overlayElement.style.top = 0;
            overlayElement.style.height = "100%";
            overlayElement.style.width = "100%";
            overlayElement.style.padding = "20px 0";
            overlayElement.style.boxSizing = "border-box";
            //
            const innerElement = document.createElement("div");
            overlayElement.appendChild(innerElement);
            innerElement.style.boxShadow = "0 0 8px gray";
            innerElement.style.width = "400px";
            innerElement.style.height = "100%";
            innerElement.style.background = "rgba(255,255,255,0.95)";
            innerElement.style.margin = "0 auto";
            innerElement.style.overflowY = "scroll";
            //
            const scrollElement = document.createElement("div");
            innerElement.appendChild(scrollElement);
            //
            const h2Element = document.createElement("h2");
            h2Element.innerHTML = "カレンダーの設定";
            h2Element.style.textAlign = "center";
            h2Element.style.padding = "20px";
            scrollElement.appendChild(h2Element);
            //
            const checkboxElement = document.createElement("input");
            checkboxElement.type = "checkbox";
            checkboxElement.checked = saveData?.isReservable ?? "";
            checkboxElement.id = "checkbox_isReservable_" + blockId;
            scrollElement.appendChild(checkboxElement);
            checkboxElement.addEventListener("change", async function () {
                console.log(checkboxElement.checked);
                await _writeSaveData(
                    blockId,
                    { isReservable: checkboxElement.checked }
                );
            });
            //
            const checkboxLabelElement = document.createElement("label");
            checkboxLabelElement.setAttribute("for", "checkbox_isReservable_" + blockId);
            checkboxLabelElement.innerText = "予約可能";
            scrollElement.appendChild(checkboxLabelElement);
            //
            const brElement = document.createElement("br");
            scrollElement.appendChild(brElement);
            //
            const brElement2 = document.createElement("br");
            scrollElement.appendChild(brElement2);
            //
            const openLabelElement = document.createElement("label");
            openLabelElement.innerText = "表示名";
            scrollElement.appendChild(openLabelElement);
            //
            const openElement = document.createElement("input");
            openElement.value = saveData?.openName ?? "";
            openElement.style.width = "200px";
            scrollElement.appendChild(openElement);
            openElement.addEventListener("change", async function () {
                await _writeSaveData(
                    blockId,
                    { openName: openElement.value }
                );
            });
            //
            const brElement3 = document.createElement("br");
            scrollElement.appendChild(brElement3);
            //
            const brElement4 = document.createElement("br");
            scrollElement.appendChild(brElement4);
            //
            //const microsoftProfile = await _getMicrosoftProfile();
            //console.log(microsoftProfile);
            //
            const responseStream = await window.fetch(
                "https://rfs7tgnp2e5bbqvnycc4ohh5sy0oixuw.lambda-url.ap-northeast-1.on.aws/list_event_type", {
                method: "POST",
                headers: {},
                body: JSON.stringify({
                    //graphApi: microsoftProfile.graphApi,
                }),
            },
            );
            let responseData;
            if (responseStream.status === 200) {
                try {
                    responseData = await responseStream.json();
                }
                catch (e) {
                    console.error('JSONに変換できませんでした');
                    return;
                }
            }
            else {
                console.error('サーバーから読み込めません');
                console.error(responseStream);
                return;
            }
            if (!responseData.isSuccess) {
                console.error(responseData.message);
                return;
            }
            for (const eventType of responseData.data) {
                const divElement = document.createElement("div");
                divElement.style.overflowX = "hidden";
                divElement.style.whiteSpace = "nowrap";
                scrollElement.appendChild(divElement);
                //
                const studentIdElement = document.createElement("input");
                studentIdElement.type = "radio";
                studentIdElement.name = blockId;
                studentIdElement.id = blockId + "_" + eventType.eventTypeId;
                studentIdElement.value = eventType.eventTypeId;
                studentIdElement.checked = (saveData?.eventTypeId == eventType.eventTypeId);
                divElement.appendChild(studentIdElement);
                studentIdElement.addEventListener("change", async function () {
                    await _writeSaveData(
                        blockId,
                        { eventTypeId: studentIdElement.value }
                    );
                });
                //
                const labelElement = document.createElement("label");
                labelElement.innerHTML = eventType.eventTypeText;
                labelElement.setAttribute("for", blockId + "_" + eventType.eventTypeId);
                divElement.appendChild(labelElement);
            }
        },
    },

    "toolbox": {

        //【必須】ツールボックスに表示されるHTML要素を生成する関数
        "render": async function (saveData) {
            const toolboxElement = document.createElement('div');
            toolboxElement.innerHTML = 'リソース一覧';
            return toolboxElement;
        },
    },

}
