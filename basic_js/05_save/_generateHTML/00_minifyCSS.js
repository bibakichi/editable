function _minifyCSS(css) {
    return css.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '').replace(/\s+/g, ' ').replace(/:\s/g, ':').replace(/;}/g, '}').replace(/([^\d])0+px/gi, '$1' + '0').replace(/([^\d])0+([1-9])/gi, '$1' + '$2');
}
