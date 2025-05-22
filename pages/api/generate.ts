import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { city, days, preference } = req.body;

    const prompt = `你是一个经验丰富的旅行规划师，请帮我规划一次${days}天的${city}自由行行程。

用户偏好：${preference || "无特别偏好"}

请按照每天的上午、下午、晚上列出活动安排，并简要说明推荐理由。
格式清晰、适合直接复制发送给朋友查看。`;

    const baseUrl = process.env.OPENAI_API_BASE || "https://api.moonshot.cn/v1";
    const apiKey = process.env.OPENAI_API_KEY;

    const moonshotRes = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "moonshot-v1-8k", // moonshot 的推荐模型
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const json = await moonshotRes.json();
    const plan = json.choices?.[0]?.message?.content || "生成失败，请稍后再试";

    return res.status(200).json({ plan });
  } catch (error) {
    console.error("Moonshot 请求失败：", error);
    return res.status(500).json({ plan: "生成失败，发生错误，请稍后再试。" });
  }
}