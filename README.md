## 安装

```bash
win npm install -g dox-swagger-cli

*nix sudo npm install -g dox-swagger-cli
```


## 基本使用

如果,你的代码注释是基于jsdoc style 来写那么就很简单了.只要在原来的注释基础上加几个标签就行.

基于dox 注释提取器,在dox 基础上,补充了几个 swagger 需要的标签.

对于一个api ,你必须拥有如下几个参数

```js
/**
 * get user by id  api 描述
 * @resourcePath /users
 * @path /users/{id} 参数描述
 * @method GET
 * @param {string|paramType=path} id 参数描述
 */
exports.getUserById = function (id, done) {

}
```
|注释参数|说明|
|:--|:--|
|@resourcePath|该api 的资源根目录|
|@path|该api 具体路径|
|@method|http请求方法, GET, POST, PUT, DELETE|
|@param|参数,约定第一个为数据类型,string,object,integer,float|

### @param
第一个为数据类型,第二个为为api 文档的设置,用竖线 | 分隔


* paramType path|query|form
* required  true|false

例如例子中id 的paramType 为path 路径,在文档生成时候,就会自动填充路径上同样参数.

## 文档生成

```bash
 Usage: doxswagger [options] [command]

 Commands:

   server [options]       run a simple static server

 Options:

   -h, --help                              output usage information
   -V, --version                           output the version number
   -b, --basePath [http://localhost:1984]  api url path default use localhost
   -d, --description                       api description
   -c, --client [swaggerui]                default swagger ui
   -m, --models [models]                   spec doc models dir
   -o, --output [swaggerdocs]              spec doc output dir
   -i, --input [lib]                       code dir default use lib

```



一般而言,你需要指定你的代码目录,还有api 访问的地址

```bash
doxswagger -i controllers -b  localhost:5000
```

没有任何东西输出的时候,就说明成功了,你当前目录就会有一个docs 的目录了,你可以把它拷到任何一个静态服务器里面.

接着你用

```bash
doxswagger server
```

用浏览器打开 `http://localhost:1984/swaggerdocs`  就可以看到生成的文档了

```bash
  Usage: server [options]

  Options:

    -h, --help                output usage information
    -s, --server [swaggerui]  spec doc dir
    -p, --port [port]         spec api doc server port
```

填上你的api-docs 的路径就可以用了..