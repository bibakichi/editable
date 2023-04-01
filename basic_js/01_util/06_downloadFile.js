//#########################################################################################
async function downloadFile({
    content = "hello world!",
    fileName = "test.txt",
    mimeType = "text/plain",
}) {
    const blob = new Blob([content], { "type": mimeType });
    const url = window.URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = url;
    element.download = fileName;
    element.target = '_blank';
    element.click();
}