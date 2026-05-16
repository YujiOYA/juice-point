import { randomUUID } from "crypto";

import bcrypt from "bcryptjs";
import {
    AttributeValue,
    ScanCommand,
    QueryCommand,
    GetItemCommand,
    PutItemCommand,
    UpdateItemCommand,
    DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";

import { dynamo } from "@lib/dynamoClient";
import { Reward } from "@type/reward";
import { Submission, SubmissionType } from "@type/submission";
import { Task } from "@type/task";
import { User } from "@type/user";
import { ENV } from "@const/constDefinition";

const TABLE_USER = ENV.tableUser;
const TABLE_TASK = ENV.tableTask;
const TABLE_SUBMISSIONS = ENV.tableSubmissions;
const TABLE_REWARD = ENV.tableReward;
const TABLE_PUSH_SUBSCRIPTIONS = ENV.tablePushSubs;

/** ScanCommand で全件取得するページネーションヘルパー */
async function scanAll(tableName: string): Promise<Record<string, AttributeValue>[]> {
    const items: Record<string, AttributeValue>[] = [];
    let lastKey: Record<string, AttributeValue> | undefined;
    do {
        const res = await dynamo.send(new ScanCommand({ TableName: tableName, ExclusiveStartKey: lastKey }));
        items.push(...(res.Items ?? []));
        lastKey = res.LastEvaluatedKey;
    } while (lastKey);
    return items;
}

export async function getUsers(id?: string): Promise<User[]> {
    if (id) {
        const res = await dynamo.send(
            new QueryCommand({
                TableName: TABLE_USER,
                KeyConditionExpression: "id = :id",
                ExpressionAttributeValues: { ":id": { S: id } },
            }),
        );
        if (!res.Items) return [];
        return res.Items.map((item) => ({
            id: item.id.S!,
            user: item.user.S!,
            authority: item.authority.S!,
        }));
    }

    const items = await scanAll(TABLE_USER);
    return items.map((item) => ({
        id: item.id.S!,
        user: item.user.S!,
        authority: item.authority.S!,
    }));
}

export async function createUser(data: { id?: string; user: string; pin: string; authority: string }): Promise<void> {
    const hashedPin = await bcrypt.hash(data.pin, 10);
    await dynamo.send(
        new PutItemCommand({
            TableName: TABLE_USER,
            Item: {
                id: { S: data.id ?? randomUUID() },
                user: { S: data.user },
                pin: { S: hashedPin },
                authority: { S: data.authority },
            },
            ConditionExpression: "attribute_not_exists(id)",
        }),
    );
}

export async function updateUser(id: string, data: { user: string; pin?: string; authority: string }): Promise<void> {
    if (data.pin) {
        const hashedPin = await bcrypt.hash(data.pin, 10);
        await dynamo.send(
            new UpdateItemCommand({
                TableName: TABLE_USER,
                Key: { id: { S: id } },
                UpdateExpression: "SET #u = :user, pin = :pin, authority = :authority",
                ExpressionAttributeNames: { "#u": "user" },
                ExpressionAttributeValues: {
                    ":user": { S: data.user },
                    ":pin": { S: hashedPin },
                    ":authority": { S: data.authority },
                },
            }),
        );
    } else {
        await dynamo.send(
            new UpdateItemCommand({
                TableName: TABLE_USER,
                Key: { id: { S: id } },
                UpdateExpression: "SET #u = :user, authority = :authority",
                ExpressionAttributeNames: { "#u": "user" },
                ExpressionAttributeValues: {
                    ":user": { S: data.user },
                    ":authority": { S: data.authority },
                },
            }),
        );
    }
}

export async function deleteUser(id: string): Promise<void> {
    await dynamo.send(
        new DeleteItemCommand({
            TableName: TABLE_USER,
            Key: { id: { S: id } },
        }),
    );
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
    if (!item) return null;

    const storedPin = item.pin?.S ?? "";
    const match = await bcrypt.compare(pin, storedPin);
    if (!match) return null;
    return { id: item.id.S!, user: item.user.S!, authority: item.authority.S! };
}

export async function getTasks(): Promise<Task[]> {
    const items = await scanAll(TABLE_TASK);
    return items.map((item) => ({
        id: item.id.S!,
        task: item.task.S!,
        point: item.point.S!,
        whose: item.whose.S!,
    }));
}

export async function getSubmissions(): Promise<Submission[]> {
    const items = await scanAll(TABLE_SUBMISSIONS);
    return items.map((item) => ({
        id: item.id.S!,
        whatYouDid: item.whatYouDid.S!,
        whoDid: item.whoDid.S!,
        point: item.point.S!,
        status: item.status.S!,
        createdAt: item.createdAt.S!,
        submissionType: item.submissionType?.S as SubmissionType | undefined,
    }));
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
    const result = await dynamo.send(
        new GetItemCommand({
            TableName: TABLE_SUBMISSIONS,
            Key: { id: { S: id } },
        }),
    );
    const item = result.Item;
    if (!item) return null;
    return {
        id: item.id.S!,
        whatYouDid: item.whatYouDid.S!,
        whoDid: item.whoDid.S!,
        point: item.point.S!,
        status: item.status.S!,
        createdAt: item.createdAt.S!,
        submissionType: item.submissionType?.S as SubmissionType | undefined,
    };
}

export async function createSubmission(data: {
    whatYouDid: string;
    whoDid: string;
    point: string;
    submissionType?: string;
}): Promise<string> {
    const id = randomUUID();
    const item: Record<string, { S: string }> = {
        id: { S: id },
        whatYouDid: { S: data.whatYouDid },
        whoDid: { S: data.whoDid },
        point: { S: data.point },
        status: { S: "未承認" },
        createdAt: { S: new Date().toISOString() },
    };
    if (data.submissionType) {
        item.submissionType = { S: data.submissionType };
    }
    await dynamo.send(new PutItemCommand({ TableName: TABLE_SUBMISSIONS, Item: item }));
    return id;
}

export async function createTask(data: { task: string; point: string; whose: string }): Promise<void> {
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

export async function updateTask(id: string, data: { task: string; point: string; whose: string }): Promise<void> {
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

export async function deleteSubmission(id: string): Promise<void> {
    await dynamo.send(
        new DeleteItemCommand({
            TableName: TABLE_SUBMISSIONS,
            Key: { id: { S: id } },
        }),
    );
}

export async function updateSubmissionPoint(id: string, point: number): Promise<void> {
    await dynamo.send(
        new UpdateItemCommand({
            TableName: TABLE_SUBMISSIONS,
            Key: { id: { S: id } },
            UpdateExpression: "SET point = :point",
            ExpressionAttributeValues: { ":point": { S: String(point) } },
        }),
    );
}

export async function updateSubmissionStatus(id: string, status: string): Promise<void> {
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
    const items = await scanAll(TABLE_REWARD);
    return items.map((item) => ({
        id: item.id.S!,
        name: item.name.S!,
        point: item.point.S!,
        whose: item.whose?.S ?? "",
    }));
}

export async function createReward(data: { name: string; point: string; whose: string }): Promise<void> {
    await dynamo.send(
        new PutItemCommand({
            TableName: TABLE_REWARD,
            Item: {
                id: { S: randomUUID() },
                name: { S: data.name },
                point: { S: data.point },
                whose: { S: data.whose },
            },
        }),
    );
}

export async function updateReward(id: string, data: { name: string; point: string; whose: string }): Promise<void> {
    const res = await dynamo.send(
        new QueryCommand({
            TableName: TABLE_REWARD,
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: { ":id": { S: id } },
            Limit: 1,
        }),
    );
    const currentItem = res.Items?.[0];
    if (!currentItem) throw new Error("Reward not found");
    const currentName = currentItem.name.S!;

    if (currentName === data.name) {
        await dynamo.send(
            new UpdateItemCommand({
                TableName: TABLE_REWARD,
                Key: { id: { S: id }, name: { S: currentName } },
                UpdateExpression: "SET point = :point, whose = :whose",
                ExpressionAttributeValues: {
                    ":point": { S: data.point },
                    ":whose": { S: data.whose },
                },
            }),
        );
    } else {
        await dynamo.send(
            new DeleteItemCommand({
                TableName: TABLE_REWARD,
                Key: { id: { S: id }, name: { S: currentName } },
            }),
        );
        await dynamo.send(
            new PutItemCommand({
                TableName: TABLE_REWARD,
                Item: {
                    id: { S: id },
                    name: { S: data.name },
                    point: { S: data.point },
                    whose: { S: data.whose },
                },
            }),
        );
    }
}

// ===== Push Subscriptions =====

export async function getPushSubscriptions(): Promise<string[]> {
    const items = await scanAll(TABLE_PUSH_SUBSCRIPTIONS);
    return items.map((item) => item.subscription.S!);
}

export async function savePushSubscription(endpoint: string, subscription: string): Promise<void> {
    await dynamo.send(
        new PutItemCommand({
            TableName: TABLE_PUSH_SUBSCRIPTIONS,
            Item: {
                endpoint: { S: endpoint },
                subscription: { S: subscription },
            },
        }),
    );
}

export async function deletePushSubscription(endpoint: string): Promise<void> {
    await dynamo.send(
        new DeleteItemCommand({
            TableName: TABLE_PUSH_SUBSCRIPTIONS,
            Key: { endpoint: { S: endpoint } },
        }),
    );
}

export async function deleteReward(id: string): Promise<void> {
    const res = await dynamo.send(
        new QueryCommand({
            TableName: TABLE_REWARD,
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: { ":id": { S: id } },
            Limit: 1,
        }),
    );
    const currentItem = res.Items?.[0];
    if (!currentItem) throw new Error("Reward not found");
    const currentName = currentItem.name.S!;

    await dynamo.send(
        new DeleteItemCommand({
            TableName: TABLE_REWARD,
            Key: { id: { S: id }, name: { S: currentName } },
        }),
    );
}
