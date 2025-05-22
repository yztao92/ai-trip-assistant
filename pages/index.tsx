import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Home() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [preference, setPreference] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city, days, preference }),
    });
    const data = await res.json();
    setResult(data.plan);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI 旅行助手 - 成都版</h1>
      <div className="mb-4">
        <label className="block mb-1">目的地城市：</label>
        <input
          className="border p-2 w-full"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="如：成都"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">旅行天数：</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">旅行偏好（可选）：</label>
        <input
          className="border p-2 w-full"
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
          placeholder="如：美食、慢节奏、夜景"
        />
      </div>
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? "规划中..." : "生成行程"}
      </Button>

      {result && (
        <Card className="mt-6">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">推荐行程</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {result}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}