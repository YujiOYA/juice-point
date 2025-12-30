import {
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

import { dynamo } from "./dynamoClient";

const TABLE_NAME = process.env.TABLE_MASTER_USER!;

export async function getUsers(id?: string) {
  let res;
  if (id) {
    res = await dynamo.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": { S: id } },
        Limit: 100,
      }),
    );
  } else {
    res = await dynamo.send(
      new ScanCommand({
        TableName:

          TABLE_NAME,
        Limit: 100,
      }),
    );
  }
  if (!res.Items) {
    return [];
  }
  return res.Items.map((item) => ({
    id: item.id.S!,
    user: item.user.S!,
    authority: item.authority.S!,
  }));
}
