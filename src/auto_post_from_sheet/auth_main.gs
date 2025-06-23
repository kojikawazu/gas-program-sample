/**
 * スクリプトのメイン関数で、OAuth2サービスの状態をチェックし、
 * 必要に応じて認証URLをログに出力します。
 */
function main() {
  const service = getService(); // OAuth2サービスの取得
  if (service.hasAccess()) {
    Logger.log("Already authorized"); // すでに認証済みの場合のログ出力
  } else {
    const authorizationUrl = service.getAuthorizationUrl(); // 認証URLの取得
    Logger.log('Open the following URL and re-run the script: %s', authorizationUrl); // 認証URLのログ出力
  }
}

/**
 * 投稿テスト用関数
 */
function testPost() {
  sendTweet("これはGASからのテスト投稿です。");
}