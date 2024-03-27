const replacements = [
    { from: /```(.*?)```/gs, to: '<pre>$1</pre>' }, // preformatted
    { from: /(?:^|\n)(.*?)\n/g, to: '<p>$1</p>' }, // paragraph
    { 
        from: /(?<![\dA-Za-zА-Яа-я])\*\*([\dA-Za-zА-Яа-я])(.*?)([\dA-Za-zА-Яа-я])\*\*(?![\dA-Za-zА-Яа-я])/,
        to: '<i>$1$2$3</i>', // bold
    },
    { 
        from: /(?<![\dA-Za-zА-Яа-я])_([\dA-Za-zА-Яа-я])(.*?)([\dA-Za-zА-Яа-я])_(?![\dA-Za-zА-Яа-я])/,
        to: '<i>$1$2$3</i>', // italic
    },
    { 
        from: /(?<![\dA-Za-zА-Яа-я])`([\dA-Za-zА-Яа-я])(.*?)([\dA-Za-zА-Яа-я])`(?![\dA-Za-zА-Яа-я])/,
        to: '<i>$1$2$3</i>', // monospaced
    },
];

export const convertMarkdown = (text) => {
    const {replaced, preformattedBlocks } = replacePreformatedWithToken(text);
    let html = replaced;

    replacements.slice(1).forEach(replacement => {
        html = html.replace(replacement.from, replacement.to);
    });

    html = replaceTokenWithPreformatted(html, preformattedBlocks);

    return html;
};

const replacePreformatedWithToken = (text) => {
    const preformattedBlocks = [];
    const token = '%%PRE%%';

    const replaced = text.replace(replacements[0].from, (match, group) => {
        preformattedBlocks.push(group);
        return token;
    });

    return {
        replaced,
        preformattedBlocks,
    }
}

const replaceTokenWithPreformatted = (text, preformattedBlocks) => {
    return text.replace(/%%PRE%%/g, () => {
        return `<pre>${preformattedBlocks.shift()}</pre>`;
    });
}

const checkForNestedTags = (text) => {
    tegRegexp = /<(\w+)>(.*)<\/\1>/g;

    const matches = text.matchAll(tegRegexp);
    for (const match of matches) {
        const [fullMatch, tag, content] = match;
        if (content.match(tegRegexp)) {
            return true;
        }
    }
}