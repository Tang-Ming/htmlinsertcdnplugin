/*author ：tommy
* date:20200901
* emile:992968380@qq.cpm
*/
const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
//get webpack version
const webpackVersion=parseInt(require(resolveApp('package.json')).dependencies.webpack||require(resolveApp('package.json')).devDependencies.webpack) 
const handleSource = ( opt) => {
  let source = '';
  if ( opt.type === 'js'){
      source += '<script src='+ opt.src +'></script>'
  } else if ( opt.type === 'css'){
      source+= '<link rel=stylesheet href='+ opt.src +' />'
  }
  return source;
}

class HtmlWebpackInsertsPlugin {
  constructor( options,isProductEnv){
      this.options = options
  }
  apply(compiler){
      console.log(webpackVersion)
      if(webpackVersion>=4){
        // over webpack4 config
        compiler.hooks.emit.tap('HtmlWebpackInsertsPlugin', (compilation) => {
            var options = this.options;
            options && options.length && Object.keys( compilation.assets).forEach( data => {
                if ( /\.html$/ig.test(data)){
                    let content = compilation.assets[data].source();
                    for ( let i = 0; i<options.length; i++){
                        if ( !options[i].ignore || !options[i].ignore.includes(data)){ //忽略配置项
                            let tagReg = options[i].inject === 'head' ? '</title>' : '</body>';
                            let source = handleSource( options[i] );
                            content = content.replace( tagReg, tagReg + source)
                        }
                    }
                    compilation.assets[data] = {
                        source(){
                            return content
                        },
                        size(){
                            return content.length
                        }
                    }
                }

            })
        })
      }else{
          // lower version
          compiler.plugin('emit', (compilation,callback) => {
            // compilation.plugin("optimize", function() {
            //   console.log("Assets are being optimized.");
            // });
              var options = this.options;
              options && options.length && Object.keys( compilation.assets).forEach( data => {
                  if ( /\.html$/ig.test(data)){
                      let content = compilation.assets[data].source();
                      for ( let i = 0; i<options.length; i++){
                          if ( !options[i].ignore || !options[i].ignore.includes(data)){ //忽略配置项
                              let tagReg = options[i].inject === 'head' ? '</head>' :(options[i].inject === 'top'?'</title>': '</body>');
                              let source = handleSource( options[i],this.isProductEnv );
                              content = content.replace( tagReg, tagReg + source)
                          }
                      }
                      compilation.assets[data] = {
                          source(){
                              return content
                          },
                          size(){
                              return content.length
                          }
                      }
                  }
              })
              callback()
          })
          compiler.plugin('done', function() {
              console.log('=========cdn inserted========= '); 
            });
      }
    
      
  }
}
module.exports = HtmlWebpackInsertsPlugin