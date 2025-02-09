export default function env(usage:string, res:any) {
    if (usage === "point") {
        const dbId = process.env.POINT_DB_ID; // 環境変数を取得
        if (!dbId) {
            return res.status(500).json({ error: "環境変数が設定されていません" });
        }
    
        res.status(200).json({ databaseId: dbId });
    }
}