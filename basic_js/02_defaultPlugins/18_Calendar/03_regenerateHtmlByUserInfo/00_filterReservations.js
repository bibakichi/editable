
// 予約情報の配列を、特定のイベントだけにフィルタリングする関数
function _filterReservations({ reservations, eventTypeId }) {
    if(!Array.isArray(reservations)){
        console.error(`引数「${reservations}」が渡されていません`);
    }
    if(!eventTypeId){
        console.error(`引数「${eventTypeId}」が渡されていません`);
    }
    const newReservations = [];
    for (const reservation of reservations) {
        if (eventTypeId == reservation.eventTypeId) {
            newReservations.push(reservation);
        }
    }
    return newReservations;
}