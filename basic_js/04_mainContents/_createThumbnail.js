
async function _createThumbnail({ url, width = 40 }) {
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
    const height = img.height * width / img.width;
    //
    // 動的にcanvasを生成する
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    //
    // canvasのコンテキストを取得しておく
    const context = canvas.getContext('2d');
    //
    // 背景
    context.beginPath();
    context.fillStyle = 'rgb(255,255,255)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    //
    // コンテキストにImageオブジェクトの画像を描画する
    context.drawImage(img, 0, 0, width, height);
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
