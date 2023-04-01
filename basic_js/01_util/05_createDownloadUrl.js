//#########################################################################################

async function createDownloadUrl({
    content = "hello world!",
    mimeType = "text/plain",
}) {
    const blob = new Blob([content], { "type": mimeType });
    const url = window.URL.createObjectURL(blob);
    return url;
}