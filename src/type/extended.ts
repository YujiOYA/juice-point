import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// rich_text型を定義
interface RichTextItemResponse {
  type: "text";
  text: {
    content: string;
    link?: { url: string };
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
  };
  plain_text: string;
  href?: string;
}

// 各プロパティ型を定義
interface NotionProperty {
  rich_text?: RichTextItemResponse[];
  number?: number | null;
  title?: RichTextItemResponse[];
  select?: { id: string; name: string };
  checkbox?: boolean;
  url?: string;
  date?: { start: string; end?: string | null };
  // 他にもプロパティに応じて型を追加
}

// PageObjectResponseを拡張した型
interface ExtendedPageObjectResponse extends PageObjectResponse {
  properties: {
    [key: string]: NotionProperty;
  };
}

// 使用例
const page: ExtendedPageObjectResponse = {
  object: "page",
  id: "some-page-id",
  properties: {
    task: {
      rich_text: [
        {
          type: "text",
          text: { content: "Task description" },
          annotations: { bold: true, italic: false, strikethrough: false, underline: true, code: false },
          plain_text: "Task description",
        },
      ],
    },
    point: { number: 10 },
    whoDid: {
      rich_text: [
        {
          type: "text",
          text: { content: "User name" },
          annotations: { bold: false, italic: true, strikethrough: false, underline: false, code: false },
          plain_text: "User name",
        },
      ],
    },
  },
  created_time: "2021-01-01T00:00:00.000Z",
  last_edited_time: "2021-01-01T01:00:00.000Z",
};

// rich_textプロパティへのアクセス
const taskDescription = page.properties.task?.rich_text?.[0]?.text.content || "No description";

// 使用例
console.log(taskDescription); // "Task description"
