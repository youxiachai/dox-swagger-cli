


var doxSwagger = require('dox-swagger'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    ejs = require('ejs'),
    url = require('url'),
    ncp = require('ncp'),
    fs = require('fs');

exports.buildApiFile = function (program) {
    if (!/(http|https)/.test(program.basePath)) {
        program.basePath = 'http://' + program.basePath;
    }

    var basePath = path.resolve('.');


    var outputDir = path.join(basePath, program.client, program.output);


    mkdirp.sync(outputDir);



    var codeDir = path.join(basePath, program.input);

    mkdirp.sync(codeDir);


//加载模型定义
    if (program.models) {
        var modelDir = path.join(basePath, program.models);

        var modelFiles = fs.readdirSync(modelDir);


        var modelObj = {};
        modelFiles.forEach(function (item) {

            var point = item.lastIndexOf(".");
            var name = item.substr(0, point);

            modelObj[name] = require(path.join(modelDir, item))
        })

        program.models = modelObj;

    }


    var files = fs.readdirSync(codeDir);


    files.forEach(function (item) {

        var point = item.lastIndexOf(".");

        var type = item.substr(point);

        if (type === '.js') {
            doxSwagger.doxSwagger(path.join(codeDir, item), program);
        }

    })

    //客户端
    var defaultClientDir= path.join(__dirname, '../templates', 'default');



    //复制客户端
    ncp(defaultClientDir, outputDir, {clobber : false}, function (){
        var defaultIndexFile = path.join(defaultClientDir, 'index.html');

        //文档输出

        fs.writeFileSync(path.join(outputDir, 'api-docs'), JSON.stringify(doxSwagger.apiResourceList));

        var indexFile = fs.readFileSync(defaultIndexFile).toString();


        fs.writeFileSync(path.join(outputDir, 'index.html'),ejs.render(indexFile, {apiurl : program.basePath + '/' + program.output+ '/api-docs'}));

    })
}

exports.staticServer = function (options) {
    var basePath = path.resolve('.');

    var docDir = path.join(basePath, options.server);

    var app = require('connect')()
        , serveStatic = require('serve-static')
        , http = require('http');

    app.use(function (req, res, next) {
        //支持跨域访问
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })

    app.use(serveStatic(docDir, {'index': ['index.html']}));

    http.createServer(app).listen(options.port, function () {
        console.log('start listen ->' + options.port);
        console.log('api doc dir ->' + docDir);
        console.log('NODE_ENV ->  ' + process.env.NODE_ENV);
    });
}