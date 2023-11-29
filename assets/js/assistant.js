const OpenAI = require("openai").default;
require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

async function assistant() {
  const myAssistant = await openai.beta.assistants.create({
    instructions:
      "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    name: "Math Tutor",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-3.5-turbo-1106",
  });

  console.log(myAssistant);
}

async function thread() {
  const emptyThread = await openai.beta.threads.create();

  console.log(emptyThread);
}

async function addMessage(userInput) {
  const threadMessages = await openai.beta.threads.messages.create(
    "thread_abc123",
    { role: "user", content: userInput }
  );

  console.log(threadMessages);
}

module.exports = { assistant, thread, addMessage };
