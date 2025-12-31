import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { awsCredentialsProvider } from "@vercel/functions/oidc";

// ★デバッグ用：ビルドログにARNが出るか確認（確認後消してください）
console.log("----- DEBUG: AWS_ROLE_ARN check -----");
console.log("IS_VERCEL:", process.env.VERCEL ? "YES" : "NO");
console.log("ROLE_ARN:", process.env.AWS_ROLE_ARN); 
console.log("-------------------------------------");

const credentials = awsCredentialsProvider({
  roleArn: process.env.AWS_ROLE_ARN ?? "", // Vercelの環境変数に設定したロールARN
});

export const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  credentials: process.env.VERCEL ? credentials : undefined,
});
