import { randomUUID } from "crypto";

import {
  ScanCommand,
  QueryCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";

import { dynamo } from "@lib/dynamoClient";
import { Reward } from "@type/reward";
import { Submission } from "@type/submission";
import { Task } from "@type/task";
import { User } from "@type/user";

const TABLE_USER = process.env.TABLE_MASTER_USER!;
const TABLE_TASK = process.env.TABLE_MASTER_TASK!;
const TABLE_SUBMISSIONS = process.env.TABLE_SUBMISSIONS!;
const TABLE_REWARD = process.env.TABLE_MASTER_REWARD!;

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

export async function verifyUserPin(id: string, pin: string): Promise<User | null> {
  const res = await dynamo.send(
    new QueryCommand({
      TableName: TABLE_USER,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: { ":id": { S: id } },
      Limit: 1,
    }),
  );
  const item = res.Items?.[0];
  if (!item || item.pin?.S !== pin) return null;
  return {
    id: item.id.S!,
    user: item.user.S!,
    authority: item.authority.S!,
  };
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

export async function createTask(data: {
  task: string;
  point: string;
  whose: string;
}): Promise<void> {
  await dynamo.send(
    new PutItemCommand({
      TableName: TABLE_TASK,
      Item: {
        id: { S: randomUUID() },
        task: { S: data.task },
        point: { S: data.point },
        whose: { S: data.whose },
      },
    }),
  );
}

export async function updateTask(
  id: string,
  data: { task: string; point: string; whose: string },
): Promise<void> {
  await dynamo.send(
    new UpdateItemCommand({
      TableName: TABLE_TASK,
      Key: { id: { S: id } },
      UpdateExpression: "SET #t = :task, point = :point, whose = :whose",
      ExpressionAttributeNames: { "#t": "task" },
      ExpressionAttributeValues: {
        ":task": { S: data.task },
        ":point": { S: data.point },
        ":whose": { S: data.whose },
      },
    }),
  );
}

export async function deleteTask(id: string): Promise<void> {
  await dynamo.send(
    new DeleteItemCommand({
      TableName: TABLE_TASK,
      Key: { id: { S: id } },
    }),
  );
}

export async function updateSubmissionIsUsed(id: string): Promise<void> {
  await dynamo.send(
    new UpdateItemCommand({
      TableName: TABLE_SUBMISSIONS,
      Key: { id: { S: id } },
      UpdateExpression: "SET isUsed = :val",
      ExpressionAttributeValues: { ":val": { S: "使用済" } },
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

// ===== Rewards =====

export async function getRewards(): Promise<Reward[]> {
  const res = await dynamo.send(
    new ScanCommand({ TableName: TABLE_REWARD, Limit: 100 }),
  );
  if (!res.Items) return [];
  return res.Items.map((item) => ({
    id: item.id.S!,
    name: item.name.S!,
    point: item.point.S!,
  }));
}

export async function createReward(data: { name: string; point: string }): Promise<void> {
  await dynamo.send(
    new PutItemCommand({
      TableName: TABLE_REWARD,
      Item: {
        id: { S: randomUUID() },
        name: { S: data.name },
        point: { S: data.point },
      },
    }),
  );
}

export async function updateReward(id: string, data: { name: string; point: string }): Promise<void> {
  await dynamo.send(
    new UpdateItemCommand({
      TableName: TABLE_REWARD,
      Key: { id: { S: id } },
      UpdateExpression: "SET #n = :name, point = :point",
      ExpressionAttributeNames: { "#n": "name" },
      ExpressionAttributeValues: {
        ":name": { S: data.name },
        ":point": { S: data.point },
      },
    }),
  );
}

export async function deleteReward(id: string): Promise<void> {
  await dynamo.send(
    new DeleteItemCommand({
      TableName: TABLE_REWARD,
      Key: { id: { S: id } },
    }),
  );
}
