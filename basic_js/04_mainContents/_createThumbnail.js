
async function _createThumbnail({ url, width }) {
    // 動的にcanvasを生成する
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    //
    // canvasのコンテキストを取得しておく
    const ctx = canvas.getContext('2d');
    //
    // Imageオブジェクトを生成する
    const img = new Image();
    //
    // Imageオブジェクトに読みこんだデータを渡す
    img.src = url;
    //
    // 画像が読み込まれるまで待つ
    await waitLoadImage(img);
    //
    // コンテキストにImageオブジェクトの画像を描画する
    ctx.drawImage(img, 0, 0, 24, 24);
    //
    // canvasの描画結果をDataURL形式で取得して返却する
    return canvas.toDataURL('image/jpeg', 0.5);
}

// 画像が読み込まれるまで待つ関数
const waitLoadImage = (img) => new Promise((resolve, reject) => {
    // Imageの読み込みが完了した際の処理
    img.onload = () => {
        resolve();
    };
    // エラー処理
    img.onerror = (err) => {
        reject(err);
    };
    setTimeout(reject, 3000);
});