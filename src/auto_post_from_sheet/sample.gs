// スプレットシートから投稿用のデータを取得して、投稿する（TODO: 開発する）
function autoPostFromSheet() {
  // 「sample」シートへアクセス
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("sample");
  // 全データ取得
  const data = sheet.getDataRange().getValues();

  // 現在の時刻を取得
  const now = new Date();
  const timeZone = "Asia/Tokyo";
  const timeFormat = "HH:mm";
  const nowTimeStr = Utilities.formatDate(now, timeZone, timeFormat);

  // 開始行
  const startRow = 3;

  // 開始行以降のデータでループ
  for (let i = startRow; i < data.length; i++) {
    // #
    const postNumber = data[i][0];
    // postData
    const postData = data[i][1];
    // postTrigger
    const postTrigger = data[i][2];

    // postTriggerが空の場合はスキップ
    if (!postTrigger) continue;

    // postTriggerを時刻変換
    const triggerTimeStr = Utilities.formatDate(new Date(postTrigger), timeZone, timeFormat);

    Logger.log("data A: " + postNumber);
    Logger.log("data B: " + postData);
    Logger.log("data C: " + postTrigger);

    // 時刻一致
    if (nowTimeStr == triggerTimeStr) {
      Logger.log("時刻一致");
    }    
  }
}
