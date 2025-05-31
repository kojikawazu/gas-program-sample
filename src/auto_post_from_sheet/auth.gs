/**
 * Twitter APIに接続するためのOAuth2サービスを設定し、返します。
 * この関数は、認証プロセスに必要な各種パラメータを含むサービスオブジェクトを作成します。
 */
function getService() {
  pkceChallengeVerifier(); // PKCE認証フローのためのコードチャレンジと検証値を生成

  const userProps = PropertiesService.getUserProperties();     // ユーザーのプロパティを取得
  const scriptProps = PropertiesService.getScriptProperties(); // スクリプトのプロパティを取得

  const CLIENT_ID     = scriptProps.getProperty("X_API_CLIENT_ID");     // X APIのクライアントID
  const CLIENT_SECRET = scriptProps.getProperty("X_API_CLIENT_SECRET"); // X APIのクライアントシークレット
  const OAUTH_SCOPE   = scriptProps.getProperty("OAUTH_SCOPE");
  const OAUTH_RESPONSE_TYPE  = scriptProps.getProperty("OAUTH_RESPONSE_TYPE");
  const OAUTH_CODE_CHALLENGE = scriptProps.getProperty("OAUTH_CODE_CHALLENGE");

  // OAuth2サービスの設定
  return OAuth2.createService('twitter')
    .setAuthorizationBaseUrl('https://twitter.com/i/oauth2/authorize') // 認証ベースURLの設定
    .setTokenUrl('https://api.twitter.com/2/oauth2/token?code_verifier=' + userProps.getProperty("code_verifier"))                   // トークンURLの設定
    .setClientId(CLIENT_ID)              // クライアントIDの設定
    .setClientSecret(CLIENT_SECRET)      // クライアントシークレットの設定
    .setCallbackFunction('authCallback') // コールバック関数の設定
    .setPropertyStore(userProps)         // プロパティストアの設定
    .setScope(OAUTH_SCOPE)               // 必要なスコープの設定
    .setParam('response_type', OAUTH_RESPONSE_TYPE)           // レスポンスタイプの設定
    .setParam('code_challenge_method', OAUTH_CODE_CHALLENGE)  // コードチャレンジメソッドの設定
    .setParam('code_challenge', userProps.getProperty("code_challenge")) // コードチャレンジの設定
    .setTokenHeaders({
      'Authorization': 'Basic ' + Utilities.base64Encode(CLIENT_ID + ':' + CLIENT_SECRET), // トークンヘッダーの設定
      'Content-Type': 'application/x-www-form-urlencoded'
    })
}

/**
 * PKCE認証フローに必要なコードチャレンジとコード検証値を生成します。
 * この関数は、セキュリティを強化するためにOAuth2フローにおいて使用されます。
 */
function pkceChallengeVerifier() {
  var userProps = PropertiesService.getUserProperties();
  if (!userProps.getProperty("code_verifier")) {
    var verifier = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

    // コード検証値の生成
    for (var i = 0; i < 128; i++) {
      verifier += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    // コードチャレンジの生成
    var sha256Hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, verifier)

    var challenge = Utilities.base64Encode(sha256Hash)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    userProps.setProperty("code_verifier", verifier)
    userProps.setProperty("code_challenge", challenge)
  }
}

/**
 * OAuth2認証プロセスの一環として、認証後に呼び出される関数です。
 * この関数は、認証が成功したかどうかをチェックし、適切な応答を返します。
 */
function authCallback(request) {
  const service = getService();                       // OAuth2サービスの取得
  const authorized = service.handleCallback(request); // 認証リクエストのハンドリング

  // 認証が成功した場合の処理
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!'); // 認証成功のメッセージを表示
  } else {
    return HtmlService.createHtmlOutput('Denied.'); // 認証失敗のメッセージを表示
  }
}

/**
 * 指定された内容でツイートを送信します。
 * この関数は、X APIを使用してツイートを投稿します。
 */
function sendTweet(tweetContent) {
  if (!tweetContent) {
    Logger.log("No tweet content provided"); // ツイート内容がない場合のログ出力
    return;
  }

  var service = getService(); // OAuth2サービスの取得
  if (service.hasAccess()) {
    var url = 'https://api.twitter.com/2/tweets'; // Twitter APIのURL
    var response = UrlFetchApp.fetch(url, {
      method: 'POST', // POSTリクエスト
      contentType: 'application/json', // コンテンツタイプ
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken() // 認証ヘッダー
      },
      muteHttpExceptions: true,
      payload: JSON.stringify({ text: tweetContent }) // ツイート内容をJSON形式で送信
    });

    var result = JSON.parse(response.getContentText()); // レスポンスの解析
    Logger.log(JSON.stringify(result, null, 2)); // レスポンスのログ出力
  } else {
    var authorizationUrl = service.getAuthorizationUrl(); // 認証URLの取得
    Logger.log('Open the following URL and re-run the script: %s', authorizationUrl); // 認証URLのログ出力
  }
}
