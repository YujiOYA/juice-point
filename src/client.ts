import { Client } from'@notionhq/client';

// Notion クライアントを初期化
export const notion = new Client({ auth: process.env.NOTION_TOKEN});
