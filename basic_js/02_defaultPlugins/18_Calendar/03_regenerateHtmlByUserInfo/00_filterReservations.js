
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