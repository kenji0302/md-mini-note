<template>
  <div>
    <v-alert
      v-model="saveSuccess"
      dismissible
      type="secondary"
      transition="fade-transition"
    >
      保存しました
    </v-alert>
    <editor v-if="body" v-model="body.content" :options="editorOptions" :visible="editorVisible" height="500px" previewStyle="vertical" />
    <!-- <viewer :value="editorText" /> -->
    <v-btn v-on:click="saveFile(file, body)">保存</v-btn>

  </div>

</template>
<script>
  import {
    Editor,
    Viewer
  } from '@toast-ui/vue-editor'
var fetch = require("isomorphic-fetch"); // or another library of choice.
var Dropbox = require("dropbox").Dropbox;
var js2coffee = require("js2coffee/dist/js2coffee");
var uuidv4 = require('uuid/v4');

  export default {
    components: {
      'editor': Editor,
      'viewer': Viewer
    },
    data() {
      return {
        path: "",
        body: "",
        dbx: {},
        file: "",
        saveSuccess: false,
        editorText: '',
        editorOptions: {
          hideModeSwitch: false,
          previewStyle: 'tab',
          language: "ja_JP"
        },
        editorVisible: true
      }
    },
  mounted() {
    var self = this;
    self.path = this.$route.query.path;
    var accessToken = localStorage.getItem("dbAccessToken");

    //DropBoxへのアクセスオブジェクト生成
    self.dbx = new Dropbox({
      accessToken: accessToken,
      fetch: fetch
    });
    // ビュー全体がレンダリングされた後に実行
    this.$nextTick(() => {
      if(self.path) {
        //ファイル読み込み
        self.getFile(self.path);
      } else {
        //TODO: 新しいファイル作成
        self.path = "/notes/" + uuidv4() + ".cson";
        self.file =self.path;
        var event = new Date();
        var createdAt = event.toISOString();
        var result = {
          "createdAt": createdAt,
          "updatedAt": createdAt,
          "type": "MARKDOWN_NOTE",
          "folder": "bd6e4a0853b74f8d5da0",
          "title": "no title",
          "tags": [],
          "content": "# no title",
          "linesHighlighted": [0],
          "isStarred": false,
          "isTrashed": false
        }
        console.log(result);
        self.body = result;
        console.log(self.path);
      }
    });
  },
  methods: {
    /**
     * タイトル取得
     */
    getTitle(entry) {
      var self = this;

      self.dbx
        .filesDownload({ path: entry.path_display })
        .then(function(response) {
          // console.log(response);
          var blob = response.fileBlob;
          var reader = new FileReader();
          reader.addEventListener("loadend", function() {
            var result = reader.result;
            var title = CoffeeScript.eval(result).title;
            console.log(title);
            //タイトルをセット
            self.$set(entry, "title", title);
          });
          reader.readAsText(blob);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    /**
     * ファイル取得
     */
    getFile(filename) {
      var self = this;
      self.file = filename;

      self.dbx
        .filesDownload({ path: filename })
        .then(function(response) {
          // console.log(response);
          var blob = response.fileBlob;
          var reader = new FileReader();
          reader.addEventListener("loadend", function() {
            var result = reader.result;
            self.body = CoffeeScript.eval(result);
          });
          reader.readAsText(blob);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    /**
     * ファイル保存
     */
    saveFile(filename, contents) {

      //更新日時
      var event = new Date();
      contents.updatedAt = event.toISOString();
      //タイトル
      contents.title = contents.content.split(/\r\n|\r|\n/)[0].replace(/^[# -]+/, '');

      var note = JSON.stringify(contents);
      var cson = js2coffee.build("(" + note + ");").code;
      // console.log(cson);
      // return;
      var self = this;
      self.saveSuccess = false;
      self.dbx
        .filesUpload({ path: filename, contents: cson, mode: "overwrite" })
        .then(function(response) {
          self.saveSuccess = true;

          //ダイアログ表示終了
          setTimeout(function() {
            self.saveSuccess = false;
          }, 3000);


          console.log(response);
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  }
};

/**
 * csonの展開
 * <https://github.com/BoostIO/boostnote-mobile/blob/9cdc61725fbe41351a382215fb4737e005731a7a/app/lib/CofeeScriptEval.js>
 */
var CoffeeScript = require("coffeescript/lib/coffeescript/coffeescript");
var compile = CoffeeScript.compile;

CoffeeScript.eval = function(code, options = {}) {
  if (options.bare == null) {
    options.bare = true;
  }
  return eval(compile(code, options));
};
</script>
