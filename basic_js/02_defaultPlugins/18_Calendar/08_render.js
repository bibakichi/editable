
function calendarRender({ blockId, saveData, isHeavy }) {
    const departmentId = '01GVJNAM1QSFVRSCAKN85BF972';
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
        studentIdElement.placeholder = "LC000000";
        studentIdOuterElement.appendChild(studentIdElement);
        //
        if (isHeavy) {
            // Enterキーが押されたとき
            studentIdElement.addEventListener('keypress', async (event) => {
                if (event.key !== 'Enter') return;
                const studentId = studentIdElement.value;
                await _searchUser({
                    blockId,
                    departmentId,
                    studentId,
                    eventTypeId: saveData?.eventTypeId,
                    saveData,
                });
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
                await _searchUser({
                    blockId,
                    departmentId,
                    studentId,
                    eventTypeId: saveData?.eventTypeId,
                    saveData,
                });
            });
        }
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
    if (isHeavy) {
        monthlyBoxCenter.innerHTML = `${year}年 ${month}月`;
    }
    else {
        monthlyBoxCenter.innerText = ` 年  月`;
    }
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
            if (!isHeavy) continue;
            //
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
            //
            const dateElement = document.createElement("div");
            dateElement.innerHTML = `
                <div class="${isToday ? 'today' : 'not-today'}"></div>
                ${thisDate}
            `;
            labelElement.appendChild(dateElement);
            //
            const eventsElement = document.createElement("div");
            eventsElement.classList.add(`label-${thisYear}-${thisMonth}-${blockId}`);
            eventsElement.id = `label-${thisYear}-${thisMonth}-${thisDate}-${blockId}`;
            labelElement.appendChild(eventsElement);
            //
            labelElement.addEventListener("click", async (event) => {
                const detail = await handleOpenDayModal({
                    blockId,
                    saveData,
                    year: thisYear,
                    month: thisMonth,
                    date: thisDate,
                    onClose: () => {
                        checkboxElement.checked = false;
                    },
                });
                mainElement.innerHTML = "";
                mainElement.appendChild(detail);
            });
        }
    }
    //
    //
    // ボタン「翌月」を生成する
    const bottomBox = document.createElement("div");
    bottomBox.style.textAlign = "center";
    bottomBox.innerHTML = `<a href="${nextMonthUrl}" class="buttonFlat">翌月</a>`;
    calendarElement.appendChild(bottomBox);
    //
    //
    async function _after({ year, month }) {
        //
        // 今月の予定を読み込む
        const flag = await _regenerateHtmlByEventList({
            blockId,
            saveData,
            year,
            month
        });
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
            await _regenerateHtmlByEventList({
                blockId,
                saveData,
                year: year - 1,
                month: 12
            });
        }
        else {
            await _regenerateHtmlByEventList({
                blockId,
                saveData,
                year: year,
                month: month - 1
            });
        }
        //
        // 来月の予定を読み込む
        if (month == 12) {
            await _regenerateHtmlByEventList({
                blockId,
                saveData,
                year: year + 1,
                month: 1
            });
        }
        else {
            await _regenerateHtmlByEventList({
                blockId,
                saveData,
                year: year,
                month: month + 1
            });
        }
        //
        const url = `https://rfs7tgnp2e5bbqvnycc4ohh5sy0oixuw.lambda-url.ap-northeast-1.on.aws/put_s3_monthly_file?eti=${saveData.eventTypeId}&year=${year}&month=${month}`;
        await window.fetch(url, { cache: "no-store" });
    }
    if (isHeavy) {
        if (saveData.eventTypeId) {
            _after({ year, month });
        }
    }
    return outerElement;
}