const { ChatGroq } = require("@langchain/groq");
const { StateGraph } = require("@langchain/langgraph");

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "allam-2-7b",
  temperature: 0,
});

// 🔹 Parse Node
async function parseNode(state) {
  try {
    const res = await model.invoke([
      {
        role: "system",
        content: `
Convert user input into STRICT JSON only.

Rules:
- action: "draw_rectangle", "draw_circle", or "draw_triangle"
- count: number
- width/height: for rectangle/triangle
- radius: only for circle
- color: string

RETURN ONLY JSON.
        `,
      },
      {
        role: "user",
        content: state.input,
      },
    ]);

    let cleaned = res.content.trim();

    
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(cleaned);

    return {
      ...state,
      parsed,
    };
  } catch (err) {
    console.error("Parse Error:", err.message);

    return {
      ...state,
      parsed: null,
      error: "Invalid JSON from model",
    };
  }
}

// 🔹 Decision Node
function decisionNode(state) {
  if (!state.parsed) return "__end__";

  const action = state.parsed.action;

  if (["draw_rectangle", "draw_circle", "draw_triangle"].includes(action)) {
    return "loop";
  }

  return "__end__";
}

// 🔹 Loop Node
function loopNode(state) {
  const shapes = [];

  const {
    action,
    count = 1,
    width,
    height,
    radius,
    color,
  } = state.parsed;

  for (let i = 0; i < count; i++) {
    const baseSpacing = radius ? radius * 2.5 : (width || 80) + 20;

    const shapeBase = {
      color: color || "black",
      left: 100 + i * baseSpacing,
      top: 100,
    };

    if (action === "draw_circle") {
      shapes.push({
        ...shapeBase,
        type: "circle",
        radius: radius || 50,
      });
    } else if (action === "draw_triangle") {
      shapes.push({
        ...shapeBase,
        type: "triangle",
        width: width || 100,
        height: height || 100,
      });
    } else {
      shapes.push({
        ...shapeBase,
        type: "rectangle",
        width: width || 100,
        height: height || 100,
      });
    }
  }

  return {
    ...state,
    shapes,
  };
}

// 🔥 Graph setup
const graph = new StateGraph({
  channels: {
    input: null,
    parsed: null,
    shapes: null,
    error: null,
  },
});

graph.addNode("parse", parseNode);
graph.addNode("loop", loopNode);

graph.setEntryPoint("parse");

graph.addConditionalEdges("parse", decisionNode, {
  loop: "loop",
  __end__: "__end__",
});

graph.addEdge("loop", "__end__");

const appGraph = graph.compile();

module.exports = appGraph;