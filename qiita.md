# 家族向け書籍管理アプリの開発とVercelへのデプロイ

## はじめに

本アプリケーションは、家族間での書籍の重複購入を防ぐことを目的としています。開発は進行中で、現在の進捗は以下の通りです。

- フロントエンド：開発環境を構築し、GoogleBooksApiを使用して書籍情報を取得し表示しています。
- バックエンド：Loopbackを使用して各モジュールを作成し、Swaggerで動作を確認しています。

## プロジェクトの概要

このアプリケーションは、家族全員の書籍を一元管理するためのものです。GoogleBooksAPIを使用して書籍情報を検索し、各書籍の紙媒体と電子媒体の所有状況、読了状況などを管理します。最終的な目標は、Flutterを使用してモバイルアプリケーションを作成し、バーコードスキャン機能を追加して書籍の登録を容易にすることです。

## 開発環境

開発には以下のツールが必要です。

- Docker Desktop：アプリケーションの実行環境を構築します。
- Visual Studio Code：コードの編集に使用します。
  - Remote Development（拡張機能）：リモートの開発環境で作業を行うために使用します。

## 技術スタック

以下の技術を使用しています：

- Docker: アプリケーションのコンテナ化
- DevContainer: コンテナ内でのコーディング
- TypeScript: 静的型付けとオブジェクト指向を提供
- LoopBack: APIの作成と接続
- Nuxt.js: Vue.jsのユニバーサルアプリケーションフレームワーク
- Vue.js: UIの構築
- Vuetify: Vue.jsのマテリアルデザインフレームワーク
- Axios: PromiseベースのHTTPクライアント

## 内容

### Vercelアカウントの作成と設定

Vercelはサーバーレスアーキテクチャを採用したクラウドプラットフォームです。以下の手順でアカウントを作成し、設定します。

1. [Vercelのサインアップページ](https://vercel.com/signup)にアクセスしてアカウントを作成します。

2. VercelのCLIツールをインストールします。

```sh
yarn global add vercel

# Vercel CLIでログインします。
vercel login

# アプリケーションをデプロイします。
vercel

# 本番環境へのデプロイは以下のコマンドを使用します。
vercel --prod
```

### フォルダ構成

```
.
├── frontend
│   ├── node_modules
│   ├── nuxt.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── yarn.lock
│   ├── docker
│   │   └── Dockerfile
│   └── src
│       ├── assets
│       ├── components
│       ├── composables
│       ├── layouts
│       ├── pages
│       ├── plugins
│       └── utils
├── backend
│   └── docker
│       └── Dockerfile
├── docker-compose.yml
├── README.md
└── front
    ├── app.vue
    ├── node_modules
    ├── nuxt.config.ts
    ├── package.json
    ├── tsconfig.json
    └── yarn.lock
```

### docker-compose.ymlを作る

```yml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: docker/Dockerfile
    volumes:
      - ./frontend:/app:cached
      - frontend_node_modules:/app/node_modules
    # - 構築時は下記コマンドをコメントにする
    # command: sh -c "yarn && yarn dev"
    ports:
      - 3000:3000
      - 24678:24678
    tty: true
    environment:
      - HOST=0.0.0.0
      - port=80
      - CHOKIDAR_USEPOLLING=true
  backend:
    build:
      context: ./backend
      dockerfile: docker/Dockerfile
    volumes:
      - ./backend:/app
      - backend_node_modules:/app/node_modules
    # - 構築時は下記コマンドをコメントにする
    # command: sh -c "yarn && yarn start"
    ports:
      - 3001:3001
    tty: true
    environment:
      - HOST=0.0.0.0
      - port=80
      - CHOKIDAR_USEPOLLING=true
  mysql:
    image: mysql:8.0
    command: --default-authentication-plugin=mysql_native_password
    environment:
      MYSQL_ROOT_PASSWORD: rootp@ssword
      MYSQL_DATABASE: "bookman-db"
      MYSQL_USER: "bmuser"
      MYSQL_PASSWORD: "myp@ssword"
      MYSQLD_PUBLIC_KEY_RETRIEVAL: "true"
    ports:
      - 33306:3306
    volumes:
      - mysql-data:/var/lib/mysql
volumes:
  frontend_node_modules:
  backend_node_modules:
  mysql-data:
```

### Dockerfileの作成と配置

以下の内容のDockerfileを作成します。これを`frontend/docker/Dockerfile`と`backend/docker/Dockerfile`の両方に配置します。

```sh
FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y
```

### Dockerコンテナの作成と起動

- ターミナルを開き、以下のコマンドを実行してDockerコンテナを作成し、起動します。

```sh
docker compose up -d
```

### フロントエンドの開発環境の構築

以下の手順でフロントエンドの開発環境を構築します。

- Dockerコンテナに入ります。

```sh
docker compose exec frontend bash
```

- Nuxt.jsのプロジェクトを作成します。

```sh
npx nuxi init . --force
```

このコマンドを実行すると、フロントエンドディレクトリに以下のファイルが作成されます。

```
.gitignore
.npmrc
app.vue
nuxt.config.ts
package.json
README.md
tsconfig.json
```

- 必要なパッケージをインストールします。

```sh
yarn install
```

### Nuxt.jsアプリケーションの起動と確認

以下の手順でNuxt.jsアプリケーションを起動し、正しく動作していることを確認します。

- Nuxt.jsアプリケーションを起動します。

```sh
yarn dev
```

- ブラウザで「http://localhost:3000/」にアクセスします。

「Welcome to Nuxt!」が表示されれば成功しています。

- 確認が終わったら、ctrl + cを押してアプリケーションを停止します。

### [Vuetify](https://vuetifyjs.com/en/getting-started/installation/#using-nuxt-3)の導入と設定

VuetifyはVue.jsのマテリアルデザインフレームワークです。以下の手順で導入と設定を行います。

- Vuetifyとその関連パッケージをインストールします。

```sh
yarn add -D vuetify vite-plugin-vuetify
yarn add @mdi/font
```

- 必要なディレクトリを作成します。

```sh
mkdir -p src src/{assets,components,composables,layouts,pages,plugins,utils}
```

- nuxt.config.tsを編集して、Vuetifyとsrcディレクトリの設定を行います。

```ts
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  srcDir: 'src/',
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
```

この設定により、VuetifyがNuxt.jsアプリケーションで使用できるようになります。また、srcディレクトリがベースディレクトリとして設定されます。

- `src/plugins/vuetify.ts`を作成します。このファイルではVuetifyの設定を行います。

```ts
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // ... your configuration
  })
  app.vueApp.use(vuetify)
})
```

- app.vueは使用しないので削除します。
- src/layouts/default.vueを作成します。このファイルではアプリケーションの基本的なレイアウトを定義します。

```ts
<template>
  <v-app>
    <NuxtPage></NuxtPage>
  </v-app>
</template>
```

- src/pages/index.vueを作成します。このファイルではホームページの内容を定義します。

```ts
<template>
  <div>
    <h1>Hello Vuetify3</h1>
    <v-btn color="primary" @click=handleClick>Hello</v-btn>
  </div>
</template>

<script setup lang="ts">
const handleClick = () => {
  alert("nuxt3");
}
</script>
```

- ブラウザを開き、http://localhost:3000/にアクセスします。"Hello Vuetify3"と表示され、ボタンをクリックすると"nuxt3"というアラートが表示されれば、ホームページの作成に成功しています。

http://localhost:3000

### Google Books APIを使用して書籍情報を取得する方法

- まず、HTTPリクエストを送信するためのライブラリである[Axios](https://github.com/axios/axios)をインストールします。

```sh
yarn add axios
```

- 次に、src/pages/books.vueファイルを作成します。このファイルでは、Google Books APIを使用して書籍のタイトルを検索し、その結果をdatatableで表示します。

```ts
<template>
  <div>
    <v-text-field v-model="search" label="Search for books" @keyup.enter="fetchBooks" />
    <v-data-table :items="books">
      <template v-slot:item.thumbnail="{ item }" >
        <v-img 
          :src="item.thumbnail" 
          :aspect-ratop="16/9" 
          height="9vw" 
          min-height="100px"
          width="16vw" 
          min-width="160px" 
          class="ma-0 pa-0">
        </v-img>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

interface Book {
  thumbnail: string
  title: string
  subtitle: string
  publishedDate: string
  description: string
}

const search: Ref<string> = ref('')
const books: Ref<Book[]> = ref([])

const fetchBooks = async () => {
  books.value = []
  const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search.value}`)
  books.value = response.data.items.map((book: any) => {
    return {
      thumbnail: book.volumeInfo.imageLinks.smallThumbnail,
      title: book.volumeInfo.title,
      subtitle: book.volumeInfo.subtitle,
      publishedDate: book.volumeInfo.publishedDate,
      description: book.volumeInfo.description,
    }
  })
}
</script>
```

- 機能の確認方法

1. ブラウザを開き、`http://localhost:3000/books`にアクセスします。

2. 検索ボックスに検索したい書籍のタイトルや著者名を入力します。

3. 入力後、Enterキーを押すと、検索結果が表示されます。

補足：この機能はGoogle Books APIを使用して書籍情報を取得し、その結果を表示します。検索ボックスに入力した文字列を含む書籍の情報が表示されます。

### vercelへデプロイ

- gitでcommitして、github、gitlabなどにpushします。

```sh
git init
git add .
git commit -m "First Commit."
git remote ad origin https://github.com/{username}/{new_repo}.git
git push -u origin main
```

- ブラウザでvercelのサイトを開きログインします。
- 

- frontendは一旦ここまでにします。続き書くつもりです。

### backendの開発環境を作る

- コンテナに入ってloopback4の環境を作る

```sh
docker compose exec backend bash

# npm install -g @loopback/cli
yarn global add @loopback/cli

# LoopBack 4のプロジェクトを作成します。lb4 app コマンドを実行し、プロンプトに従ってプロジェクトの詳細を入力します。
lb4 app 

root@b2101ba89dc0:/app# lb4 app
? Project name: app
? Project description: Book Management Application
? Project root directory: app
? Application class name: AppApplication
? Select features to enable in the project Enable eslint, Enable prettier, Enable mocha, Enable loopbackBuild, Enable
vscode, Enable docker, Enable repositories, Enable services
? Yarn is available. Do you prefer to use it by default? Yes

```

- 一階層無駄なのでフォルダの中身を移動（コンテナ内ではなくホスト側で実行）

```sh
# 'backend/app' ディレクトリの内容を 'backend/' ディレクトリに移動
mv -f backend/app/* backend/

# 空の 'backend/app' ディレクトリを削除
rmdir backend/app
```

- 必要なソースを作っていく（user、Book、BookStatus）

```sh
# データベースとの接続を設定します。lb4 datasource コマンドを実行し、プロンプトに従ってデータベースの接続情報を入力します。docker-compose.ymlのmysqlの設定値で設定する
lb4 datasource

# モデルを作成します。lb4 model コマンドを実行し、プロンプトに従ってモデルの詳細を入力します。
lb4 model

# リポジトリを作成します。lb4 repository コマンドを実行し、プロンプトに従ってリポジトリの詳細を入力します。
lb4 repository

# コントローラを作成します。lb4 controller コマンドを実行し、プロンプトに従ってコントローラの詳細を入力します。
lb4 controller

# テストを書きます。各関数が正しく動作することを確認するためのテストコードを書きます。

# テストを実行します。yarn test コマンドを実行して、テストがすべてパスすることを確認します。
yarn test
```

### devcontainerでコンテナに接続して開発

- frontend/.devcontainer/devcontainer.jsonを作って下記のようにする

```json
{
  "name": "Frontend",
  "dockerComposeFile": "../../compose.yml",
  "service": "frontend",
  "workspaceFolder": "/app",
  "customizations": {
    "vscode": {
      "settings": {
        "terminal.integrated.shell.linux": "/bin/bash"
      },
      "extensions": [
        "octref.vetur",
        "Vue.volar",
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "vue.vscode-typescript-vue-plugin",
        "misterj.vue-volar-extention-pack",
      ]
    }
  }
}
```

- VSCodeの新しいウィンドウをfrontendフォルダで開く
- VSCodeの左下の緑の所をクリックして、「コンテナで再度開く」

- backend/.devcontainer/devcontainer.json

```
{
  "name": "Backend",
  "dockerComposeFile": "../../compose.yml",
  "service": "backend",
  "customizations": {
    "vscode": {
      "settings": {
        "terminal.integrated.shell.linux": "/bin/bash"
      },
      "extensions": [
        "octref.vetur",
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "github.copilot",
        "github.copilot-chat"
      ]
    }
  }
}
```

## プロジェクトの挑戦点

このプロジェクトで遭遇した主な挑戦は以下の通りです：

- Vercelへのデプロイ
- docker & devcontainerを使ったホストに影響のない開発環境構築

## まとめ

書ききれなかったので少しずつ書いて完成させます。
VercelはGitHubなどと連携設定するだけで簡単にデプロイできました。
VercelTeamなどを使わずにgithub actionsで直接デプロイしたりもできるようなので試してみたいと思います。

## 参考リンク

- [loopback4](https://loopback.io/doc/en/lb4/index.html)
- [Vuetify](https://vuetifyjs.com/en/)