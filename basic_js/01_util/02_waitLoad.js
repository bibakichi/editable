//#########################################################################################

// 特定のHTML要素がロードされるまで待つ関数
const waitLoad = (element) => new Promise((resolve, reject) => {
    element.addEventListener("error", reject);
    element.addEventListener("load", resolve);
});
