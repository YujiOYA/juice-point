import { randomUUID } from "crypto";

import {
  ScanCommand,
  QueryCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

import { dynamo } from "@/lib/dynamoClient";
import { Submission } from "@/types/submission";
import { Task } from "@/types/task";
import { User } from "@/types/user";

const TABLE_USER = process.env.TABLE_MASTER_USER!;
const TABLE_TASK = process.env.TABLE_MASTER_TASK!;
const TABLE_SUBMISSIONS = process.env.TABLE_SUBMISSIONS!;

export async function getUsers(id?: string): Promise<User[]> {
  let res;
  if (id) {
    res = await dynamo.send(
      new QueryCommand({
        TableName: TABLE_USER,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": { S: id } },
        Limit: 100,
      }),
    );
  } else {
    res = await dynamo.send(
      new ScanCommand({ TableName: TABLE_USER, Limit: 100 }),
    );
  }
  if (!res.Items) return [];
  return res.Items.map((item) => ({
    id: item.id.S!,
    user: item.user.S!,
    authority: item.authority.S!,
  }));
}

export async function getTasks(): Promise<Task[]> {
  const res = await dynamo.send(
    new ScanCommand({ TableName: TABLE_TASK, Limit: 100 }),
  );
  if (!res.Items) return [];
  return res.Items.map((item) => ({
    id: item.id.S!,
    task: item.task.S!,
    point: item.point.S!,
    whose: item.whose.S!,
  }));
}

export async function getSubmissions(): Promise<Submission[]> {
  const res = await dynamo.send(
    new ScanCommand({ TableName: TABLE_SUBMISSIONS, Limit: 500 }),
  );
  if (!res.Items) return [];
  return res.Items.map((item) => ({
    id: item.id.S!,
    whatYouDid: item.whatYouDid.S!,
    whoDid: item.whoDid.S!,
    point: item.point.S!,
    status: item.status.S!,
    isUsed: item.isUsed.S!,
    createdAt: item.createdAt.S!,
  }));
}

export async function createSubmission(data: {
  whatYouDid: string;
  whoDid: string;
  point: string;
}): Promise<void> {
  await dynamo.send(
    new PutItemCommand({
      TableName: TABLE_SUBMISSIONS,
      Item: {
        id: { S: randomUUID() },
        whatYouDid: { S: data.whatYouDid },
        whoDid: { S: data.whoDid },
        point: { S: data.point },
        status: { S: "未承認" },
        isUsed: { S: "未使用" },
        createdAt: { S: new Date().toISOString() },
      },
    }),
  );
}

export async function updateSubmissionStatus(
  id: string,
  status: string,
): Promise<void> {
  await dynamo.send(
    new UpdateItemCommand({
      TableName: TABLE_SUBMISSIONS,
      Key: { id: { S: id } },
      UpdateExpression: "SET #s = :status",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":status": { S: status } },
    }),
  );
}
