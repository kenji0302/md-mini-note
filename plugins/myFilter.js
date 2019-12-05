import Vue from 'vue'

var MarkdownIt = require('markdown-it');
Vue.filter('markdown2html', function (value) {
  if(!value){
    return;
  }
  var md = new MarkdownIt();
  return md.render(value);
})
