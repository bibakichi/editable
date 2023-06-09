
async function _handleClickReservation({ blockId, eventData, onClose, saveData }) {
    if (!blockId) {
        console.error(`引数「${blockId}」が渡されていません`);
    }
    if (!eventData) {
        console.error(`引数「${eventData}」が渡されていません`);
    }
    if (!onClose) {
        console.error(`引数「${onClose}」が渡されていません`);
    }
    const userInfo = window.userInfo;
    if (!userInfo) {
        onClose();
        setTimeout(() => alert("学籍番号を入力してください"), 500);
        //
        // 学籍番号の入力欄まで自動スクロールする
        const modalScroll = document.querySelector(".modal_outer.modal_main");
        const targetContent = document.getElementById(blockId);
        const rectTop = targetContent.getBoundingClientRect().top;
        modalScroll.scrollTo({
            top: rectTop + modalScroll.scrollTop - (window.innerHeight * 0.3),
            behavior: "smooth",
        });
        return;
    }
    await _postReservation({ blockId, eventData, userInfo, saveData });
    //
    window.setTimeout(() => {
        // サーバーから情報を取得して画面を更新
        _regenerateHtmlByEventList({
            blockId,
            saveData,
            year: eventData.startYear,
            month: eventData.startMonth,
        });
        _searchUser({
            blockId,
            departmentId: userInfo.departmentId,
            studentId: userInfo.studentId,
            eventTypeId: saveData?.eventTypeId,
            saveData,
        });
    }, 1500);
    //
    // 予約が完了したら
    onClose();
}