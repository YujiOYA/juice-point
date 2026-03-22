/**
 * DynamoDB マイグレーション: whose/whoDid をユーザー名 → ユーザーID に変換
 */
import { DynamoDBClient, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: "AKIA3OCVWCEFLHBNMPHV",
    secretAccessKey: "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",
  },
});

const USER_MAP = {
  "🍺おかあさん":      "bdadf7e7-723b-42cd-a117-c79d081b93ba",
  "☕おとうさん":      "3843e928-b015-4812-be19-6aaa5ddb4ca2",
  "🥸お父さん(管理者)": "30a92a2c-3b9f-4c37-9c49-dcdf3cd8c204",
  "👩お母さん(管理者)": "6f1ffd37-b160-4bbd-a305-58e88d203cc0",
  "🍛じっくん":        "efc0e394-1c23-46df-885f-30e964a5cde6",
  "🍜しんちゃん":      "bd96d327-b315-4af6-8659-eea01d2b2b71",
};

async function migrateWhose(tableName) {
  console.log(`\n--- ${tableName} (whose) ---`);
  const res = await client.send(new ScanCommand({ TableName: tableName }));
  let updated = 0, skipped = 0;
  for (const item of res.Items ?? []) {
    const current = item.whose?.S;
    if (!current) { skipped++; continue; }
    const userId = USER_MAP[current];
    if (!userId) {
      console.log(`  SKIP (unknown): whose="${current}"`);
      skipped++;
      continue;
    }
    // すでにIDなら skip
    if (Object.values(USER_MAP).includes(current)) {
      skipped++;
      continue;
    }
    await client.send(new UpdateItemCommand({
      TableName: tableName,
      Key: { id: { S: item.id.S }, ...(item.name ? { name: { S: item.name.S } } : {}) },
      UpdateExpression: "SET whose = :v",
      ExpressionAttributeValues: { ":v": { S: userId } },
    }));
    console.log(`  OK: "${current}" → ${userId}`);
    updated++;
  }
  console.log(`  updated=${updated}, skipped=${skipped}`);
}

async function migrateWhoDid(tableName) {
  console.log(`\n--- ${tableName} (whoDid) ---`);
  const res = await client.send(new ScanCommand({ TableName: tableName }));
  let updated = 0, skipped = 0;
  for (const item of res.Items ?? []) {
    const current = item.whoDid?.S;
    if (!current) { skipped++; continue; }
    const userId = USER_MAP[current];
    if (!userId) {
      console.log(`  SKIP (unknown): whoDid="${current}"`);
      skipped++;
      continue;
    }
    if (Object.values(USER_MAP).includes(current)) {
      skipped++;
      continue;
    }
    await client.send(new UpdateItemCommand({
      TableName: tableName,
      Key: { id: { S: item.id.S } },
      UpdateExpression: "SET whoDid = :v",
      ExpressionAttributeValues: { ":v": { S: userId } },
    }));
    console.log(`  OK: "${current}" → ${userId}`);
    updated++;
  }
  console.log(`  updated=${updated}, skipped=${skipped}`);
}

await migrateWhose("TABLE_MASTER_TASK");
await migrateWhose("TABLE_MASTER_REWARD");
await migrateWhoDid("TABLE_SUBMISSIONS");

console.log("\n✅ マイグレーション完了");
