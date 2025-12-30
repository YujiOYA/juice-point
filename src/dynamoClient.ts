import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION!,
});
