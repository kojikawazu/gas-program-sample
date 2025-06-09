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

/**
 * X APIの投稿用関数
 * スプレットシートから取得した投稿データをXへ投稿する。
 */
function autoPostFromSheet() {
  // 「sample」シートへアクセス
  const SAMPLE_SHEET = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("sample");
  // 開始行
  const START_ROW = 4;
  // 最後行
  const LAST_ROW = SAMPLE_SHEET.getLastRow();
  // 行カウント
  const ROW_COUNT = LAST_ROW - START_ROW + 1;
  // データ取得
  const RANGE_DATA = SAMPLE_SHEET.getRange(START_ROW, 1, ROW_COUNT, 2).getValues();
 
  // ランダム値を取得
  let rand = Math.random();
  rand = Math.floor(rand * ROW_COUNT) + 1;

  // 現在の日付時刻の取得
  const TODAY = new Date();
  const year = TODAY.getFullYear();
  const month = String(TODAY.getMonth() + 1).padStart(2, '0');
  const day = String(TODAY.getDate()).padStart(2, '0');
  const hour = String(TODAY.getHours()).padStart(2, '0');
  const minute = String(TODAY.getMinutes()).padStart(2, '0');
  const second = String(TODAY.getSeconds()).padStart(2, '0');
  const formatted = `${year}/${month}/${day} ${hour}:${minute}:${second}`;

  // 指定時刻チェック
  const TARGET_HOUR = [6, 8, 10, 12, 14, 16, 18, 20, 22, 23, 0];
  if (!TARGET_HOUR.includes(TODAY.getHours())) {
    // 現在時刻が指定時刻でない場合、スキップ
    Logger.log("Scheduled execution skipped. [" + formatted + "]");
    return;
  }

  for (let i = 0; i < RANGE_DATA.length; i++) {
    // #
    const postNumber = RANGE_DATA[i][0];
    // postData
    const postData = RANGE_DATA[i][1];

    if (postNumber != rand) {
      continue;
    }

    const message = `${formatted}\n${postData}`;
    sendTweet(message);
  }
}


