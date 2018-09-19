var path = require('path');

export default {
    // 禁用css-module
    "disableCSSModules": true,

    // 定制主题https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
    "theme": {
        "@layout-header-background": "#3f94e2",
        "@primary-color": "#3f94e2",
        "@layout-header-height": "56px"
        // "@link-color": "#5dacf5",
        // "@border-radius-base": "2px",
        // "@font-size-base": "16px",
        // "@line-height-base": "1.2"
    },

    "extraBabelPlugins": [
        "@babel/transform-runtime",
        ["import", { "libraryName": "antd", "style": true }]
    ],

    "alias": {
        "@": path.resolve(__dirname, "./src")
    },

    "commons": [{
        "async": "common",
        "children": true
    }],

    "browserslist": [
        "> 5%",
        "last 40 Chrome versions"
    ],
    
    "entry": "src/index.js",

    "html": {
        "template": "./src/index.ejs"
    },
    
    "hash": true
}