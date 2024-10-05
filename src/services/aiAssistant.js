const { Configuration, OpenAIApi } = require("openai");
const redis = require('./redis');
const filterContent = require('../utils/contentFilter');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const getAIResponse = async (message) => {
  try {
    // 检查缓存
    const cachedResponse = await redis.get(`ai_response:${message}`);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant in a community forum." },
        { role: "user", content: message }
      ],
      max_tokens: 150,
      n: 1,
      temperature: 0.7,
    });

    const aiResponse = response.data.choices[0].message.content.trim();

    // 过滤 AI 响应
    const filteredResponse = filterContent(aiResponse);

    // 缓存过滤后的响应
    await redis.set(`ai_response:${message}`, filteredResponse, 'EX', 3600); // 缓存1小时

    return filteredResponse;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return "抱歉，我现在无法回答。请稍后再试。";
  }
};

module.exports = { getAIResponse };