const {
    htmlAbsoluteToRelative,
    htmlRelativeToAbsolute,
    htmlToTransformReady
} = require('@tryghost/url-utils/lib/utils');
const _ = require('lodash');
const hljs = require('highlight.js');

module.exports = {
    name: 'code',
    type: 'dom',

    render({payload, env: {dom}}) {
        if (!payload.code) {
            return dom.createTextNode('');
        }

        let pre = dom.createElement('pre');
        let code = dom.createElement('code');
        pre.setAttribute('class', 'blog-code');
        {
            const lang = payload.language;
            const text = payload.code;
            const noHighlightRe = /^(no-?highlight|plain|text)$/i;

            if (hljs.getLanguage(lang)) {
                const result = hljs.highlight(lang, text);
                payload.language = result.language;
                payload.code = result.value;
            } else if (!noHighlightRe.test(lang)) {
                payload.code = _.escape(text);
            } else {
                const result = hljs.highlightAuto(text);
                payload.language = result.language;
                payload.code = result.value;
            }
        }
        if (payload.language) {
            code.setAttribute('class', `language-${payload.language}`);
        }

        code.appendChild(dom.createRawHTMLSection(payload.code));
        pre.appendChild(code);

        if (payload.caption) {
            let figure = dom.createElement('figure');
            figure.setAttribute('class', 'kg-card kg-code-card');
            figure.appendChild(pre);

            let figcaption = dom.createElement('figcaption');
            figcaption.appendChild(dom.createRawHTMLSection(payload.caption));
            figure.appendChild(figcaption);

            return figure;
        } else {
            return pre;
        }
    },

    absoluteToRelative(payload, options) {
        payload.caption =
            payload.caption &&
            htmlAbsoluteToRelative(payload.caption, options.siteUrl, options);
        return payload;
    },

    relativeToAbsolute(payload, options) {
        payload.caption =
            payload.caption &&
            htmlRelativeToAbsolute(
                payload.caption,
                options.siteUrl,
                options.itemUrl,
                options
            );
        return payload;
    },

    toTransformReady(payload, options) {
        payload.caption =
            payload.caption &&
            htmlToTransformReady(payload.caption, options.siteUrl, options);
        return payload;
    }
};
