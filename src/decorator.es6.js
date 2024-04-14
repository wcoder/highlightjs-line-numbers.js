import { decorateHljs as coreDecorator } from './core.js';

const decorateHljs = (hljs) => {
    coreDecorator(window, document, hljs);
}

export { decorateHljs };
