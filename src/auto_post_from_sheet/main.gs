/**
 * X 投稿用関数
 * スプレットシートから取得した投稿データをXへ投稿する。
 */
function autoPostFromSheet() {
  // 「SPREAD_SHEET_NAME」シートへアクセス
  const SHEET_NAME = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SPREAD_SHEET_NAME);
  // 開始行
  const START_ROW  = 4;
  // 最後行
  const LAST_ROW   = SHEET_NAME.getLastRow();
  // 行カウント
  const ROW_COUNT  = LAST_ROW - START_ROW + 1;
  // データ取得
  const RANGE_DATA = SHEET_NAME.getRange(START_ROW, 1, ROW_COUNT, 2).getValues();
 
  // ランダム値を取得
  let rand = Math.random();
  rand     = Math.floor(rand * ROW_COUNT) + 1;

  // 現在の日付時刻の取得
  const TODAY     = new Date();
  const year      = TODAY.getFullYear();
  const month     = String(TODAY.getMonth() + 1).padStart(2, '0');
  const day       = String(TODAY.getDate()).padStart(2, '0');
  const hour      = String(TODAY.getHours()).padStart(2, '0');
  const minute    = String(TODAY.getMinutes()).padStart(2, '0');
  const second    = String(TODAY.getSeconds()).padStart(2, '0');
  const formatted = `${year}/${month}/${day} ${hour}:${minute}:${second}`;

  // 指定時刻チェック
  if (!X_POST_HOURS.includes(TODAY.getHours())) {
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
      // ランダム値と一致しない場合はスキップ
      continue;
    }

    // X APIを使って投稿する。
    const message = `${formatted}\n${postData}`;
    sendTweet(message);
  }
}
