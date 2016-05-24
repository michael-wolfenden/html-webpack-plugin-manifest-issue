# Reproduce an issue with the html-webpack-plugin and webpack2

## Getting started

To reproduce the issue run

    > npm start
    
You should see the following error message:

```
Unhandled rejection Error: Can not find chunk parent during dependency sort
    at D:\Dev\html-webpack-plugin-manifest-issue\node_modules\html-webpack-plugin\lib\chunksorter.js:45:17
    at Array.forEach (native)
    at D:\Dev\html-webpack-plugin-manifest-issue\node_modules\html-webpack-plugin\lib\chunksorter.js:42:21
    at Array.forEach (native)
    at Object.module.exports.dependency (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\html-webpack-plugin\lib\chunksorter.js:39:10)
    at HtmlWebpackPlugin.sortChunks (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\html-webpack-plugin\index.js:329:33)
    at Compiler.<anonymous> (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\html-webpack-plugin\index.js:70:19)
    at Compiler.applyPluginsAsync (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\tapable\lib\Tapable.js:85:13)
    at Compiler.emitAssets (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\webpack\lib\Compiler.js:260:7)
    at Compiler.onCompiled (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\webpack\lib\Compiler.js:202:11)
    at D:\Dev\html-webpack-plugin-manifest-issue\node_modules\webpack\lib\Compiler.js:437:12
    at next (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\tapable\lib\Tapable.js:81:11)
    at Compiler.<anonymous> (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\webpack\lib\CachePlugin.js:61:4)
    at Compiler.applyPluginsAsync (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\tapable\lib\Tapable.js:85:13)
    at Compiler.<anonymous> (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\webpack\lib\Compiler.js:434:9)
    at Compilation.<anonymous> (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\webpack\lib\Compilation.js:577:13)
    at Compilation.applyPluginsAsync (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\tapable\lib\Tapable.js:73:70)
    at Compilation.<anonymous> (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\webpack\lib\Compilation.js:572:10)
    at Compilation.applyPluginsAsync (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\tapable\lib\Tapable.js:73:70)
    at Compilation.<anonymous> (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\webpack\lib\Compilation.js:567:9)
    at Compilation.applyPluginsAsync (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\tapable\lib\Tapable.js:73:70)
    at Compilation.<anonymous> (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\webpack\lib\Compilation.js:563:8)
    at Compilation.applyPluginsAsync (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\tapable\lib\Tapable.js:73:70)
    at Compilation.seal (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\webpack\lib\Compilation.js:521:7)
    at Compiler.<anonymous> (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\webpack\lib\Compiler.js:431:15)
    at D:\Dev\html-webpack-plugin-manifest-issue\node_modules\tapable\lib\Tapable.js:152:11
    at D:\Dev\html-webpack-plugin-manifest-issue\node_modules\html-webpack-plugin\index.js:60:9
    at tryCatcher (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\bluebird\js\release\util.js:16:23)
    at Promise._settlePromiseFromHandler (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\bluebird\js\release\promise.js:502:31)
    at Promise._settlePromise (D:\Dev\html-webpack-plugin-manifest-issue\node_modules\bluebird\js\release\promise.js:559:18)
```

## Investigation

It looks like for webpack2, the default dependency sort changed from id to dependency

```
// In webpack 2 the ids have been flipped.
// Therefore the id sort doesn't work the same way as it did for webpack 1
// Luckily the dependency sort is working as expected
if (require('webpack/package.json').version.split('.')[0] === '2') {
  module.exports.auto = module.exports.dependency;
}
```

The issue is that if you look at the chunks

```json
[
    {
        "id": 1,
        "rendered": true,
        "initial": true,
        "entry": false,
        "extraAsync": false,
        "size": 57,
        "names": [
            "main"
        ],
        "files": [
            "main.fdb3f583baeb7d160bcc.js"
        ],
        "hash": "fdb3f583baeb7d160bcc",
        "parents": [
            0
        ],
        "origins": [
            {
                "moduleId": 0,
                "module": "D:\\Dev\\html-webpack-plugin-manifest-issue\\index.js",
                "moduleIdentifier": "D:\\Dev\\html-webpack-plugin-manifest-issue\\index.js",
                "moduleName": "./index.js",
                "loc": "",
                "name": "main",
                "reasons": []
            }
        ]
    }
]
```

You can see that the parent has id `0`, however there is no chunk with id `0` hence the exception


