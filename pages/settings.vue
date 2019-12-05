<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">設定</v-card-title>
        <v-card-text>
          <v-btn v-on:click="logout">ログアウト</v-btn>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
var fetch = require("isomorphic-fetch"); // or another library of choice.
var Dropbox = require("dropbox").Dropbox;

var appkey = process.env.appkey;
var appsecret = process.env.appsecret;

var authorizeUrl =
  "https://www.dropbox.com/1/oauth2/authorize?response_type=code&client_id=" +
  appkey;

export default {
  data() {
    return {

    };
  },
  methods: {
    logout() {
      localStorage.removeItem("dbAccessToken");
      this.$router.replace("/");
    }
  },
  mounted() {
  }
};
</script>
