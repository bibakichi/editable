
async function _searchUser({ blockId, departmentId, studentId, eventTypeId }) {
    if(!blockId){
        console.error(`引数「${blockId}」が渡されていません`);
    }
    if(!departmentId){
        console.error(`引数「${departmentId}」が渡されていません`);
    }
    if(!studentId){
        console.error(`引数「${studentId}」が渡されていません`);
    }
    if(!eventTypeId){
        console.error(`引数「${eventTypeId}」が渡されていません`);
    }
    studentId = formatID(studentId);
    //
    // 厳しくチェックをする（フォーマット後だから）
    const regex = /^([0-9]{8})|(((LC)|(LH)|(LJ)|(LP)|(LE)|(LG)|(LF)|(LA)|(JJ)|(JB)|(EE)|(EI)|(CC)|(CB)|(CF)|(BB)|(SM)|(SP)|(SC)|(SE)|(TM)|(TE)|(TL)|(TK)|(TC)|(TA)|(MM)|(MN)|(PP)|(GS)|(GH)|(LD)|(JD)|(ED)|(CD)|(SD)|(TD)|(MD)|(PD)|(GD)|(AU)|(AG)|(XA)|(ES)|(FS)|(RE)|(DG)|(XR)|(GD)|(XL))[0-9]{6})$/;
    if (!regex.test(studentId)) return;
    //
    const studentIdElement = document.getElementById("studentId_" + blockId);
    studentIdElement.value = studentId;
    //
    const userInfo = await _getUserInfo({ departmentId, studentId, eventTypeId });
    await _regenerateHtmlByUserInfo({ blockId, eventTypeId, userInfo });
}
