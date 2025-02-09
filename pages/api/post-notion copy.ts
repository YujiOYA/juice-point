import { NextApiRequest, NextApiResponse } from "next";
import { postNotionAPI } from "../../src/useNotionAPI";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    console.log("Received body:", req.body);
    try {
        const { whatYouDid, point, whoDid, status } = req.body;

        console.log(1);
        
        const response = await postNotionAPI("register", {
            whatYouDid,
            point,
            whoDid,
            status
        });
        console.log(response);
        

        return res.status(200).json({ message: "Success", data: response });
    } catch (error) {
        console.error("Error posting to Notion:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
