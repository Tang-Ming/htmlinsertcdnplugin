# htmlinsertcdnplugin

`npm install htmlinsertcdnplugin`
## Loading
`const HtmlWebpackInsertsPlugin = require('./htmlinsertcdnplugin')`

## Usage
```javascriptlet
/*webpack.config*/
//cdn file list
	cdnJs=[
      { inject :'head', type:'js', src: '//static.cdn.com/js/html2canvas.min.js' }, 
      { inject :'head', type:'js', src: '//static.cdn.com/js/react-router-dom.min.js' },
      { inject :'head', type:'js', src:  '//static.cdn.com/js/react-dom.production.min.js' },
      { inject :'head', type:'js', src:  '//static.cdn.com/js/react.production.min.js' }
    ]

	externals: isEnvProduction?{
		"react": "React",
		"react-dom": "ReactDOM",
		"react-router-dom": "ReactRouterDOM"
		}:{},
	
	plugins: [
      // Generates an `index.html` file with the <script> injected.
		new HtmlWebpackPlugin()
		new HtmlWebpackInsertsPlugin(cdnJs)
	```
## Result
```html
	<!doctype html>
	<html lang="en">
	<head>
	<meta charset="utf-8"/>
	<title>demo</title>
		<script src=//static.cdn.com/js/react.production.min.js></script>
		<script src=//static.cdn.com/js/react-dom.production.min.js></script>
		<script src=//static.cdn.com/js/react-router-dom.min.js></script>
		<script src=//static.cdn.com/js/html2canvas.min.js></script>
	</head>
	```