import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { notion } from './client'

export async function NotionAPI(usage: string) {
    if (usage == "user") {
        return getRows(await notion.databases.query({
            database_id: process.env.USER_DB_ID as string
        }))
    }
    if (usage == "point") {
        return getRows(await notion.databases.query({
            database_id: process.env.POINT_DB_ID as string
        }))
    }
    if (usage == "totalling") {
        return getRows(await notion.databases.query({
            database_id: process.env.TOTALLING_DB_ID as string
        }))
    }
    throw new Error("error")

}

async function getRows(response:QueryDatabaseResponse){
    
    const rows = await Promise.all(
        response.results.map(async (res) => {
            return await notion.pages.retrieve({
                page_id: res.id,
            });
        })
    );
    return rows
}

type body={
    type:string
    [key:string] :any 
}

export async function postNotionAPI(body:body) {
    let formattedProperties
    if (body.type === "register") {
        const { whatYouDid, point, whoDid, status } = body;

        // Notionのプロパティに合わせてデータを整形
        formattedProperties = {
            whatYouDid: {
                rich_text: [{ text: { content: whatYouDid } }]
            },
            point: {
                rich_text: [{ text: { content: point } }]
            },
            whoDid: {
                rich_text: [{ text: { content: whoDid } }]
            },
            status: {
                rich_text: [{ text: { content: status } }]
            }
        };
        try {
            return await notion.pages.create({
                parent: { database_id: process.env.TOTALLING_DB_ID as string },
                properties: formattedProperties,
            });
        } catch (e) {
            console.error("Notion APIエラー:", e);
        }
    
    }
    if (body.type === "approve") {
        const { id, status } = body;

        // Notionのプロパティに合わせてデータを整形
        formattedProperties = {
            status: {
                rich_text: [{ text: { content: status } }]
            }
        };
        try {
            return await notion.pages.update({
                page_id: id,  // 更新対象のページID
                properties: formattedProperties,
            });
        } catch (e) {
            console.error("Notion APIエラー:", e);
        }
    }
    if (body.type === "disapprove") {
        const { id } = body;

        try {
            return await notion.pages.update({
                page_id: id,  // 更新対象のページID
                archived: true,
            });
        } catch (e) {
            console.error("Notion APIエラー:", e);
        }
    }
    throw new Error("error");
}