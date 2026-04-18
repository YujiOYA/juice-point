import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { awsCredentialsProvider } from "@vercel/functions/oidc";
import { ENV } from "@const/constDefinition";

const credentials = awsCredentialsProvider({
  roleArn: ENV.awsRoleArn,
});

export const dynamo = new DynamoDBClient({
  region: ENV.awsRegion,
  credentials: ENV.isVercel ? credentials : undefined,
});
