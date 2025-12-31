import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { awsCredentialsProvider } from "@vercel/functions/oidc";

const credentials = awsCredentialsProvider({
  roleArn: process.env.AWS_ROLE_ARN ?? "", // Vercelの環境変数に設定したロールARN
});

export const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  credentials: process.env.VERCEL ? credentials : undefined,
});
