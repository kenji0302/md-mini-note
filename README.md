# md-mini-note

## Sample

<https://md-mini-note.web.app/>

## Setup

事前に開発環境用設定ファイル env.development.js と 本番環境よう設定ファイル env.production.js を作成する。 
中身は <https://www.dropbox.com/developers/apps> で取得した値を以下のフォーマットで設定する。

```json
module.exports = {
  oAuth2RedirectUrl: 'Redirect URI',
  appkey: 'App key',
  appsecret: 'App secret'
}
```

## Build

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```
