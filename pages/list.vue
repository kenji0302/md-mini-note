<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>

    <v-list>
      <!-- <v-subheader inset>Files</v-subheader> -->

      <v-list-tile
      v-for="entry in entries" :key="entry.name"
      v-bind:disabled="entry.isTrashed"
      avatar
      @click="$router.push({ path: 'file', query: { path: entry.path_lower }})">
        <v-list-tile-avatar>
          <template v-if="entry.isTrashed">
            <v-icon>delete</v-icon>
          </template>
          <template v-if="!entry.isTrashed">
            <v-icon>assignment</v-icon>
          </template>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>{{ entry.title }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ entry.name }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
            <v-btn
              color="primary"
              dark
              fab
              fixed
              bottom
              right
              @click="createFile"
            >
              <v-icon>add</v-icon>
            </v-btn>

  </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
var fetch = require("isomorphic-fetch"); // or another library of choice.
var Dropbox = require("dropbox").Dropbox;
const uuidv4 = require('uuid/v4');

export default {
  data() {
    return {
      body: "",
      folders: {},
      entries: [],
      dbx: {}
    };
  },
  mounted() {
    var self = this;
    //DropBoxへのアクセスオブジェクト生成
    var self = this;
    var accessToken = localStorage.getItem("dbAccessToken");

    //DropBoxへのアクセスオブジェクト生成
    self.dbx = new Dropbox({
      accessToken: accessToken,
      fetch: fetch
    });
    // ビュー全体がレンダリングされた後に実行
    this.$nextTick(() => {
      self.getList();
    });
  },
  methods: {
    /**
     * ファイルリスト取得
     */
    getList() {
      var self = this;
      self.dbx
        .filesListFolder({ path: "/notes" })
        .then(function(response) {
          self.entries = response.entries;
          //タイトル取得
          self.entries.forEach(value => {
            self.getTitle(value);
          });
          console.log(response.entries);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
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
            var isTrashed = CoffeeScript.eval(result).isTrashed;
            console.log(title);
            //タイトルをセット
            self.$set(entry, "title", title);
            self.$set(entry, "isTrashed", isTrashed);

            // self.folders = JSON.parse(self.body).folders;
          });
          reader.readAsText(blob);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    createFile() {
      var self = this;
      self.$router.replace("/file2");
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
