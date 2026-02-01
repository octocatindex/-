
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are a World-class Reverse Engineering Analyst, Network Protocol Expert, and Senior Java Crawler Developer.
Your core task is to perform static analysis on the target page's structure.

If the user provides a URL:
1. Use your tools (googleSearch) to access the page and retrieve its essential HTML structure, focusing on forms, scripts, and interactive elements.
2. If the tool provides snippets, reconstruct the logical flow of the interactions.

Workload Strategy:
1. Extract all interactive elements: <form>, <a>, <button>, <input>, and static <script> listeners.
2. For each element, infer the request URL (absolute or relative), HTTP Method, and Parameter list.
3. Determine parameter sources (Cookies, Hidden inputs, Previous responses, or Calculated values like timestamps).
4. Assign Confidence levels: High (explicit), Medium (inferable), Low (dynamic/obscure).
5. Generate production-ready Apache HttpClient 4.x Java code snippets.
6. Format everything into a professional Markdown table.

Constraints:
- Use Apache HttpClient 4.x style.
- Include BasicCookieStore management.
- Set headers like User-Agent, Referer, and Content-Type.
- Handle exceptions.
- NO casual conversation. Technical output only.
- Output MUST follow the Markdown structure requested by the user.
`;

export async function analyzeContent(input: string, mode: 'html' | 'url'): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-pro-preview';

  const prompt = mode === 'url' 
    ? `Access the following URL, retrieve its structure, and perform a full reverse engineering analysis on its interactive elements: ${input}`
    : `Analyze the following HTML source code and generate the interaction report:\n\n${input}`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1,
        tools: mode === 'url' ? [{ googleSearch: {} }] : [],
        thinkingConfig: { thinkingBudget: mode === 'url' ? 8000 : 4000 }
      },
    });

    return response.text || "Failed to generate analysis.";
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
        throw new Error("模型无法访问该页面。建议手动右键查看源码并粘贴到'源码模式'进行分析。");
    }
    throw new Error("分析失败：网络错误或内容过于复杂。请尝试精简 HTML 代码。");
  }
}
