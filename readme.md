# 電話とAIエージェント接続のチュートリアル

## 概要

* 電話で使える音声AIエージェントを作るためのアウトライン
* 構成（SIP TrunkとWebRTCを使うことの説明）
* onBridgeを使ってこの設定を行っていきましょう！というもの


##  手順

* LiveKitのプロジェクト開設
  * アカウントを作成し、プロジェクトを作ります。
* LiveKitエージェントをローカルで動作させる。
  * https://github.com/sparkleai/mini-livekit-agent-js
  * 上記をクローンし、npm install
  * 環境変数をそれぞれ用意する
    * LiveKit
    * OpenAI API KEY: https://platform.openai.com/
    * Deepgram: https://deepgram.com/
  * npm run start
* Sandboxを使ってのテスト
  * https://cloud.livekit.io/projects/p_3an99s0pzox/sandbox/templates/voice-assistant-frontend
  * Livekitには同じプロジェクトに設定されているエージェントをルームに繋いで会話できる状態にしてくれるフロントエンド実装のサンプルがあり、サンドボックス環境にそれをワンクリックでデプロイできます。

* LiveKitのSIP URIを取得
* OnBridgeの電話番号取得、SIP URLの設定
* LiveKit Inbound Trunkの設定
* LiveKit Dispatcherの設定


上記の内容で記事を書いたあと、このReadmeにはその記事へのリンクを貼り更新します。