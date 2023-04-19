//#########################################################################################
async function loadMicrosoftProfile() {
    //========================================================
    // Microsoft Graph APIの認証情報をデバイス内から取得
    let graphApi = {
        accessToken: {
            token: null, //アクセストークン
            timestamp: 0, //アクセストークンが生成された時刻のタイムスタンプ
        },
        refreshToken: {
            token: null, //リフレッシュトークン
            timestamp: 0, //リフレッシュトークンが生成された時刻のタイムスタンプ
        }
    };
    const text1 = window.localStorage.getItem("graphApiInfo");
    if (text1) {
        try {
            graphApi = JSON.parse(text1);
        }
        catch (err) { }
    }
    //========================================================
    if ((new Date().getTime() - graphApi.accessToken.timestamp) > 60 * 60 * 1000) {
        // アクセストークンの有効期限が切れていたら
        graphApi.accessToken.token = null;
    }
    //========================================================
    if ((new Date().getTime() - graphApi.refreshToken.timestamp) > 60 * 60 * 1000) {
        // リフレッシュトークンの有効期限が切れていたら
        graphApi.refreshToken.token = null;
    }
    //========================================================
    const params = new URLSearchParams(window.location.search);
    const keyPairId = params.get("Key-Pair-Id");
    params.delete("Expires");
    params.delete("Signature");
    params.delete("Key-Pair-Id");
    //
    let userName = null;
    let mailAddress = null;
    if (keyPairId) {
        //========================================================
        // ログインしたての場合
        // （AWS CloudFrontの認証情報がクエリパラメータから採取できた）
        const {
            userName: u,
            mailAddress: m,
            graphApi: g,
            queryParameters: q,
        } = await refreshAccessToken({ keyPairId });
        if (u) userName = u;
        if (m) mailAddress = m;
        if (g) graphApi = g;
        if (q) {
            for (const key in q) {
                params.set(key, q[key]);
            }
        }
        //========================================================
    }
    else if (graphApi.accessToken.token) {
        //========================================================
        // Microsoft Graph APIのアクセストークンが健在な場合
        const {
            userName: u,
            mailAddress: m,
        } = await getUserInfo({
            accessToken: graphApi.accessToken.token
        });
        if (u) userName = u;
        if (m) mailAddress = m;
        //========================================================
    }
    else if (graphApi.refreshToken.token) {
        //========================================================
        // Microsoft Graph APIのアクセストークンが有効期限切れで、リフレッシュトークンは健在な場合
        const {
            userName: u,
            mailAddress: m,
            graphApi: g,
        } = await refreshAccessToken({
            refreshToken: graphApi.refreshToken.token
        });
        if (u) userName = u;
        if (m) mailAddress = m;
        if (g) graphApi = g;
        //========================================================
    }
    else {
        console.error("認証に必要な情報が不足しています");
        console.error("クエリパラメータにkeyPairIdが存在せず、かつアクセストークンとリフレッシュトークンが端末内に残されていません");
        window.localStorage.removeItem("graphApiInfo");
        return null;
    }
    window.localStorage.setItem("graphApiInfo", JSON.stringify(graphApi));
    //
    //========================================================
    // URLの置き換え
    const nextUri = window.location.pathname.replaceAll(".login", "") +
        '?' + params.toString() +
        window.location.hash;
    window.history.replaceState('', '', nextUri);
    //
    //========================================================
    console.log({
        userName,
        mailAddress,
        queryParameters: Object.fromEntries(params.entries()),
        graphApi,
    });
    return {
        userName,
        mailAddress,
        queryParameters: Object.fromEntries(params.entries()),
        graphApi,
    };
}


// 引数はどちらかでOK
async function refreshAccessToken({ refreshToken, keyPairId }) {
    // アクセストークンの更新
    const params = new URLSearchParams(window.location.search);
    params.delete("Expires");
    params.delete("Signature");
    params.delete("Key-Pair-Id");
    let pathName = window.location.pathname.replace(".login", "");
    if (!pathName || pathName.endsWith("/")) {
        pathName += "index.html";
    }
    const redirectUri = window.location.origin + pathName +
        '?' + params.toString() +
        window.location.hash;
    const responseStream = await window.fetch(
        " https://vb3ef5vkz3tdhmvk726u4hjr640howob.lambda-url.ap-northeast-1.on.aws/refresh_access_token", {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify({
            "redirectUri": redirectUri,
            "refreshToken": refreshToken,
            "keyPairId": keyPairId,
        }),
    }
    );
    if (responseStream.status !== 200) {
        console.error(responseStream);
        throw 'サーバーから読み込めません';
    }
    let responseData = {};
    try {
        responseData = await responseStream.json();
    }
    catch (e) {
        throw 'JSONに変換できませんでした';
    }
    const { isSuccess, message, data } = responseData;
    if (!isSuccess) {
        console.error(message);
        throw "サーバー内でエラーが発生しました";
    }
    return {
        userName: data?.userName,
        mailAddress: data?.mailAddress,
        graphApi: {
            accessToken: {
                token: data?.graphApi?.accessToken?.token, //アクセストークン
                timestamp: data?.graphApi?.accessToken?.timestamp, //アクセストークンが生成された時刻のタイムスタンプ
            },
            refreshToken: {
                token: data?.graphApi?.refreshToken?.token, //リフレッシュトークン
                timestamp: data?.graphApi?.refreshToken?.timestamp, //リフレッシュトークンが生成された時刻のタイムスタンプ
            }
        },
        queryParameters: data?.queryParameters,
    };
}


async function getUserInfo({ accessToken }) {
    // ユーザー情報の取得
    const responseStream = await window.fetch(
        " https://vb3ef5vkz3tdhmvk726u4hjr640howob.lambda-url.ap-northeast-1.on.aws/get_user_info", {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify({
            "accessToken": accessToken,
        }),
    }
    );
    if (responseStream.status !== 200) {
        console.error(responseStream);
        throw 'サーバーから読み込めません';
    }
    let responseData = {};
    try {
        responseData = await responseStream.json();
    }
    catch (e) {
        throw 'JSONに変換できませんでした';
    }
    const { isSuccess, message, data } = responseData;
    if (!isSuccess) {
        console.error(message);
        throw "サーバー内でエラーが発生しました";
    }
    return {
        userName: data?.userName,
        mailAddress: data?.mailAddress,
    };
}
