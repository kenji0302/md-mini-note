<template>
        <v-layout row wrap>
    <v-flex xs12>

      <v-card  class="flex">
        <v-card-title class="headline">最初に</v-card-title>
        <v-card-text>
          Dropboxにログインしてください<br />
          <v-btn v-bind:href="redirectUrl" color="primary">ログイン</v-btn>
          <!--
          <v-btn v-bind:href="authorizeUrl" target="_blank" color="primary">DropBoxでコードを取得する</v-btn>
          -->
        </v-card-text>
        <!--        
        <v-card-text>
          <v-text-field v-model="dbCode" label="コード"></v-text-field>
          <v-text-field v-model="accessToken" label="アクセストークン"></v-text-field>
          <v-btn v-on:click="getAccessToken" color="primary" v-bind:disabled="!dbCode">アクセストークン取得</v-btn>
          <v-btn v-on:click="submitAccessToken" color="primary">登録</v-btn>
        </v-card-text>
        -->
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-card class="flex">
        <v-card-title class="headline">boostnote と連携するには</v-card-title>
        <v-card-text>
          ログインすると <b>Dropbox/アプリ/md-mini-note</b> が生成されます。<br />
          <img src="md-mini-note_01.png" width=250> <br />
          これを boostnote のストレージロケーションに追加します。
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<style scoped>
.flex {
    padding: 8px;
}
img {
      padding: 8px;
}
</style>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";
var fetch = require("isomorphic-fetch"); // or another library of choice.
var Dropbox = require("dropbox").Dropbox;
var axios = require('axios');


var appkey = process.env.appkey;
var appsecret = process.env.appsecret;
var authorizeUrl =
  "https://www.dropbox.com/1/oauth2/authorize?response_type=code&client_id=" +
  appkey;

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  data() {
    return {
      authorizeUrl: authorizeUrl,
      callbackUrl: "",
      redirectUrl: "",
      accessToken: "",
      dbCode: "",
      dbx: {}
    };
  },
  methods: {
    submitAccessToken() {
      // localStorage.setItem("dbCode", this.dbCode);
      localStorage.setItem("dbAccessToken", this.accessToken);
    },
    /**
     * フォルダの有無確認、作成
     */
    initFiles() {
      var self = this;
      self.dbx
        .filesListFolder({path: "/notes"})
        .then(function(response) {
          console.log(response);
          // self.$router.replace("/list");
        })
        .catch(function(error) {
          if(error.status == 409) {
            self.createNotes();
            // self.$router.replace("/list");
          }
        });

      self.dbx
        .filesDownload({ path: "/boostnote.json" })
        .then(function(response) {
         })
        .catch(function(error) {
          if(error.status == 409) {
            self.createJson();
            // self.$router.replace("/list");
          }

        });

    },
    /**
     * フォルダの作成
     */
    createNotes(){
      var self = this;
      self.dbx
        .filesCreateFolder({path: "/notes"})
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(response);
        });
    },
    /**
     * jsonファイルの作成
     */
    createJson(){
      var self = this;
      var json = '{"folders": [  ],  "version": "1.0"}';
      self.dbx
        .filesUpload({ path: "/boostnote.json", contents: json, mode: "overwrite" })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(response);
        });
    },
    /**
     * AccessToken取得
     */
    getAccessToken(){
      self = this;
      var params = new URLSearchParams();
      params.append('code', self.dbCode);
      params.append('grant_type', 'authorization_code');
      params.append('client_id', appkey);
      params.append('client_secret', appsecret);
      if (self.$nuxt.$route.query.code) {
       console.log(self.callbackUrl);
        params.append('redirect_uri', self.callbackUrl);
      }

      axios.post('https://api.dropboxapi.com/1/oauth2/token', params)
        .then(response => {
        // console.log('status:', response.status); // 200
        // console.log('body:', response.data);     // response body.
          self.accessToken = response.data.access_token;
          self.submitAccessToken();
          self.$router.replace("/list");
        // catchでエラー時の挙動を定義する
      }).catch(err => {
        alert("失敗しました。コードを再度取得してください。");
        console.log('err:', err);
      });
    }

  },
  created() {
  
    // console.log(process.env.);
// var callbackUrl = "http://localhost:3000/";

    var self = this;

    self.callbackUrl = process.env.oAuth2RedirectUrl;
    console.log(self.callbackUrl);
    self.redirectUrl = "https://www.dropbox.com/1/oauth2/authorize?client_id=" + appkey + "&response_type=code&redirect_uri=" + self.callbackUrl;

    //callback
    console.log(this.$nuxt.$route.query.code);
    //貼り付け
    self.accessToken = localStorage.getItem("dbAccessToken");

    if(!self.accessToken && self.$nuxt.$route.query.code) {
      self.dbCode = self.$nuxt.$route.query.code;
      self.getAccessToken();
    } 

    //dbAccessTokenがあれば一覧画面に遷移
    if (self.accessToken && self.accessToken.length > 0) {
      self.dbx = new Dropbox({
        accessToken: self.accessToken,
        fetch: fetch
      });

      self.dbx
        .usersGetCurrentAccount()
        .then(function(response) {
          console.log(response.email);
          self.initFiles();
          self.$router.replace("/list");
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
