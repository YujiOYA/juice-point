import { NextApiRequest, NextApiResponse } from "next";
import { postNotionAPI } from "../../src/NotionAPI";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    console.log("Received body:", req.body);
    try {
        const response = await postNotionAPI(req.body)
        return res.status(200).json({ message: "Success", data: response });
    } catch (error) {
        console.error("Error posting to Notion:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
