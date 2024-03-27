const replacements = [
    { from: /```(.*?)```/gs, to: '<pre>$1</pre>' }, // preformatted
    { from: /(?:^|\n)(.*?)\n/g, to: '<p>$1</p>' }, // paragraph
    { 
        from: /(?<![\dA-Za-zА-Яа-яҐґЄєІіЇї])\*\*([\dA-Za-zА-Яа-яҐґЄєІіЇї])(.*?)([\dA-Za-zА-Яа-яҐґЄєІіЇї])\*\*(?![\dA-Za-zА-Яа-яҐґЄєІіЇї])/,
        to: '<b>$1$2$3</b>', // bold
    },
    { 
        from: /(?<![\dA-Za-zА-Яа-яҐґЄєІіЇї])_([\dA-Za-zА-Яа-яҐґЄєІіЇї])(.*?)([\dA-Za-zА-Яа-яҐґЄєІіЇї])_(?![\dA-Za-zА-Яа-яҐґЄєІіЇї])/,
        to: '<i>$1$2$3</i>', // italic
    },
    { 
        from: /(?<![\dA-Za-zА-Яа-яҐґЄєІіЇї])`([\dA-Za-zА-Яа-яҐґЄєІіЇї])(.*?)([\dA-Za-zА-Яа-яҐґЄєІіЇї])`(?![\dA-Za-zА-Яа-яҐґЄєІіЇї])/,
        to: '<tt>$1$2$3</tt>', // monospaced
    },
];

const forbidden = [
    /(?<![\dA-Za-zА-Яа-яҐґЄєІіЇї])_([\dA-Za-zА-Яа-яҐґЄєІіЇї])/,
    /(?<![\dA-Za-zА-Яа-яҐґЄєІіЇї])`([\dA-Za-zА-Яа-яҐґЄєІіЇї])/,
    /([\dA-Za-zА-Яа-яҐґЄєІіЇї])\*\*([\dA-Za-zА-Яа-яҐґЄєІіЇї])/,
    /([\dA-Za-zА-Яа-яҐґЄєІіЇї])_(?![\dA-Za-zА-Яа-яҐґЄєІіЇї])/,
    /([\dA-Za-zА-Яа-яҐґЄєІіЇї])`(?![\dA-Za-zА-Яа-яҐґЄєІіЇї])/,
    /([\dA-Za-zА-Яа-яҐґЄєІіЇї])\*\*(?![\dA-Za-zА-Яа-яҐґЄєІіЇї])/,
];

export const convertMarkdown = (text) => {
    const {replaced, preformattedBlocks } = replacePreformatedWithToken(text);
    let html = replaced;

    replacements.slice(2).forEach(replacement => {
        html = html.replace(replacement.from, replacement.to);
    });

    const hasNestedTags = checkForNestedTags(html);

    if (hasNestedTags) {
        throw new Error('Nested tags are not allowed');
    }

    const forbiddenTags = checkForbidden(html);

    if (forbiddenTags) {
        throw new Error('Unopened/unclosed tags');
    }

    html = html.replace(replacements[1].from, replacements[1].to);

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
    const tegRegexp = /<(\w+)>(.*?)<\/\1>/g;

    const matches = text.matchAll(tegRegexp);
    for (const match of matches) {
        const [fullMatch, tag, content] = match;
        if (content.match(tegRegexp) || content.match(/%%PRE%%/)) {
            return true;
        }
    }
}

const checkForbidden = (text) => {
    for (const forbiddenTag of forbidden) {
        if (text.match(forbiddenTag)) {
            console.log(text.match(forbiddenTag));
            return true;
        }
    }
}