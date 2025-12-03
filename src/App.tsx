import React, { useState } from "react";
import {
  GitMerge,
  Layout,
  Search,
  CheckCircle,
  BarChart2,
  MessageSquare,
  Award,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  X,
  BookOpen,
  FileText,
} from "lucide-react";

type NodeId =
  | "generic"
  | "specific"
  | "gap"
  | "methodology"
  | "impl_method"
  | "res_method"
  | "execution_impl"
  | "execution_res"
  | "results_impl"
  | "results_res"
  | "discussion"
  | "conclusion";

interface ContentData {
  title: string;
  question: string;
  wordCount: string;
  desc: string;
  tips: string[];
  pitfalls: string[];
  type?: string;
  examples?: {
    good: string;
    bad: string;
  };
  resources?: string[];
}

// Content Data - Now with "Pitfalls" and "Word Count"
const content: Record<NodeId, ContentData> = {
  generic: {
    title: "Broad Context",
    question:
      "What is the general state of the world/industry regarding this topic?",
    wordCount: "5-10%",
    desc: "Start broad. Discuss industry trends, general theories, and the broad academic landscape.",
    tips: [
      "Don't start with your specific tool.",
      "Use recent sources (last 3-5 years).",
    ],
    pitfalls: [
      "Writing a history lesson instead of a critical review.",
      "Using Wikipedia or non-academic blogs.",
    ],
    examples: {
      good: "Recent advances in machine learning have transformed data analysis across industries (Smith, 2023).",
      bad: "In 1950, computers were invented and they have changed over time.",
    },
    resources: [
      "Google Scholar for recent peer-reviewed papers",
      "Use citation management tools (Zotero, Mendeley)",
    ],
  },
  specific: {
    title: "Specific Focus",
    question: "What specific area/technology are we zooming in on?",
    wordCount: "10-15%",
    desc: "Narrow down to your niche. Critique existing solutions similar to yours.",
    tips: [
      "Group literature by themes, not by author.",
      "Identify what others have done in this specific area.",
    ],
    pitfalls: [
      "Describing books one by one ('Author A said this...').",
      "Forgetting to critique (saying what is good/bad).",
    ],
  },
  gap: {
    title: "THE GAP",
    question: "What is missing? Why does your project need to exist?",
    wordCount: "5%",
    desc: "The most critical part. You must prove that a problem exists that hasn't been fully solved.",
    tips: [
      "Explicitly state: 'However, little research exists on...'",
      "This leads directly to your Research Question.",
    ],
    pitfalls: [
      "Inventing a fake gap.",
      "Ignoring research that has already solved your problem.",
    ],
  },
  methodology: {
    title: "Methodology Strategy",
    question: "How will you solve the problem?",
    wordCount: "10-15%",
    desc: "The roadmap. Define your philosophy and justify your choices.",
    tips: [
      "Define: Positivism (Science) vs Interpretivism (Social).",
      "Justify why you chose X over Y.",
    ],
    pitfalls: [
      "Just listing tools without justification.",
      "Forgetting to discuss ethics.",
    ],
  },
  impl_method: {
    title: "Implementation Method",
    type: "Track A",
    question: "How will you build it?",
    wordCount: "Included in Methodology",
    desc: "The engineering plan. SDLC, Architecture, Tools.",
    tips: [
      "Justify your Tech Stack (Why React? Why Python?).",
      "Show Architecture Diagrams.",
    ],
    pitfalls: [
      "Writing a tutorial instead of a methodology.",
      "Ignoring design patterns.",
    ],
  },
  res_method: {
    title: "Research Method",
    type: "Track B",
    question: "How will you test it?",
    wordCount: "Included in Methodology",
    desc: "The validation plan. Surveys, Interviews, Testing metrics.",
    tips: [
      "Define your population and sample.",
      "Explain how you will analyze the data.",
    ],
    pitfalls: [
      "'I asked my friends' is not valid sampling.",
      "Vague testing criteria.",
    ],
  },
  execution_impl: {
    title: "Execution: Development",
    question: "What did you build?",
    wordCount: "N/A (Artifact)",
    desc: "The actual construction phase.",
    tips: ["Document challenges and how you solved them.", "Keep a dev log."],
    pitfalls: [
      "Perfect code but no documentation.",
      "Feature creep (building too much).",
    ],
  },
  execution_res: {
    title: "Execution: Data Gathering",
    question: "Who did you ask?",
    wordCount: "N/A (Data)",
    desc: "The data collection phase.",
    tips: [
      "Ensure ethical consent is signed.",
      "Clean your data before analysis.",
    ],
    pitfalls: ["Leading questions in surveys.", "Losing raw data."],
  },
  results_impl: {
    title: "Implementation Results",
    question: "Does it work as intended?",
    wordCount: "10-15%",
    desc: "Evidence of the artifact working.",
    tips: [
      "Use Screenshots and Walkthroughs.",
      "Pass/Fail test tables.",
      "Performance metrics (latency, speed).",
    ],
    pitfalls: [
      "Just showing code snippets.",
      "No objective proof of functionality.",
    ],
  },
  results_res: {
    title: "Research Results",
    question: "What does the data say?",
    wordCount: "10-15%",
    desc: "Analysis of the collected data.",
    tips: [
      "Charts and Graphs (Quantitative).",
      "Quotes and Themes (Qualitative).",
    ],
    pitfalls: [
      "Interpreting data here (save that for Discussion).",
      "Manipulating data to fit your hypothesis.",
    ],
  },
  discussion: {
    title: "Discussion",
    question: "So what? Did you fill the gap?",
    wordCount: "15-20%",
    desc: "The synthesis. Connect Results back to the Literature Gap.",
    tips: [
      "Compare your findings with the authors in your Lit Review.",
      "Acknowledge limitations frankly.",
    ],
    pitfalls: [
      "Just repeating the results.",
      "Claiming you solved world hunger (over-claiming).",
    ],
  },
  conclusion: {
    title: "Conclusion",
    question: "What is the final answer?",
    wordCount: "5-10%",
    desc: "Final summary and future steps.",
    tips: [
      "Answer the Research Question directly.",
      "Suggest 3 concrete future works.",
    ],
    pitfalls: [
      "Introducing new information.",
      "Being vague about your contribution.",
    ],
  },
};

// Tooltip Component
const Tooltip: React.FC<{
  data: ContentData | null;
  mousePos: { x: number; y: number };
}> = ({ data, mousePos }) => {
  if (!data) return null;
  return (
    <div
      className="fixed z-50 pointer-events-none hidden md:block"
      style={{
        left: mousePos.x + 20,
        top: mousePos.y + 20,
      }}
    >
      <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl max-w-xs border border-slate-600 animate-fadeIn backdrop-blur-sm">
        <h4 className="font-bold text-sm mb-1 text-emerald-400">
          {data.title}
        </h4>
        <p className="text-xs italic mb-2 text-slate-300">"{data.question}"</p>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold bg-slate-700 px-2 py-1 rounded w-fit">
          <span className="text-slate-400">Weight:</span>
          <span className="text-white">{data.wordCount}</span>
        </div>
      </div>
    </div>
  );
};

// Detail Panel Component
const DetailPanel: React.FC<{
  id: NodeId | null;
  onClose: () => void;
}> = ({
  id,
  onClose,
}) => {
  if (!id || !content[id]) return null;
  const data = content[id];

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end md:static md:h-full md:z-auto bg-black/20 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none"
      onClick={onClose}
    >
      <div
        className="w-full md:w-full h-full bg-white md:rounded-xl shadow-2xl md:shadow-none overflow-y-auto border-l md:border border-slate-200 p-6 md:p-8 animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-800">
              {data.title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-bold">
                Approx {data.wordCount}
              </span>
              {data.type && (
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-bold border border-slate-200">
                  {data.type}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-2">
              <HelpCircle className="w-4 h-4 text-indigo-500" /> Key Question
            </h3>
            <p className="text-slate-600 italic">"{data.question}"</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-3 border-b pb-2">
              What to Write
            </h3>
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
              {data.desc}
            </p>
            <ul className="space-y-2">
              {data.tips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start text-sm text-slate-600 bg-white p-2 rounded border border-slate-100 shadow-sm"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="flex items-center gap-2 font-bold text-red-800 mb-3 border-b pb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Common Pitfalls
            </h3>
            <ul className="space-y-2">
              {data.pitfalls.map((pit, i) => (
                <li
                  key={i}
                  className="flex items-start text-sm text-slate-600 bg-red-50 p-2 rounded border border-red-100"
                >
                  <X className="w-4 h-4 text-red-400 mt-0.5 mr-2 shrink-0" />
                  {pit}
                </li>
              ))}
            </ul>
          </div>

          {data.examples && (
            <div>
              <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3 border-b pb-2">
                <FileText className="w-4 h-4 text-blue-500" /> Examples
              </h3>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <div className="text-xs font-bold text-green-700 mb-1">✓ Good Example:</div>
                  <p className="text-sm text-slate-700 italic">{data.examples.good}</p>
                </div>
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <div className="text-xs font-bold text-red-700 mb-1">✗ Bad Example:</div>
                  <p className="text-sm text-slate-700 italic">{data.examples.bad}</p>
                </div>
              </div>
            </div>
          )}

          {data.resources && (
            <div>
              <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3 border-b pb-2">
                <BookOpen className="w-4 h-4 text-purple-500" /> Helpful Resources
              </h3>
              <ul className="space-y-2">
                {data.resources.map((resource, i) => (
                  <li
                    key={i}
                    className="flex items-start text-sm text-slate-600 bg-purple-50 p-2 rounded border border-purple-100"
                  >
                    <span className="mr-2">•</span>
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Flow Arrow Component
const FlowArrow: React.FC = () => (
  <div className="flex justify-center my-2">
    <div className="h-6 w-0.5 bg-slate-300"></div>
  </div>
);

const ThesisNavigator = () => {
  const [activeNode, setActiveNode] = useState<NodeId | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeId | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Update mouse position for floating tooltips
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Floating Tooltip */}
      <Tooltip
        data={hoveredNode ? content[hoveredNode] : null}
        mousePos={mousePos}
      />

      <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: DIAGRAM */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center w-full">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-2 text-center">
            Thesis Navigator
          </h1>
          <p className="text-slate-500 mb-8 text-center max-w-md text-sm md:text-base">
            Hover for quick tips, click for detailed breakdown.
          </p>

          {/* --- PHASE 1: LIT REVIEW --- */}
          <div className="w-full max-w-md bg-white p-6 pt-12 rounded-2xl shadow-sm border border-slate-200 relative mb-6">
            <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
              Phase 1
            </span>

            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-full h-16 bg-gradient-to-b from-slate-600 to-slate-700 text-white rounded-t-xl flex items-center justify-center cursor-pointer hover:brightness-110 transition-all shadow-md hover:shadow-lg hover:-translate-y-1 relative"
                onClick={() => setActiveNode("generic")}
                onMouseEnter={() => setHoveredNode("generic")}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <span className="font-bold">Generic Context</span>
              </div>

              <div
                className="w-4/5 h-16 bg-gradient-to-b from-teal-600 to-teal-700 text-white flex items-center justify-center cursor-pointer hover:brightness-110 transition-all shadow-md hover:shadow-lg relative"
                onClick={() => setActiveNode("specific")}
                onMouseEnter={() => setHoveredNode("specific")}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <span className="font-bold">Specific Focus</span>
              </div>

              <div
                className="w-3/5 h-16 bg-gradient-to-b from-amber-500 to-amber-600 text-white rounded-b-xl flex items-center justify-center cursor-pointer hover:brightness-110 transition-all shadow-lg border-2 border-white ring-2 ring-amber-200 hover:ring-amber-400 relative z-10"
                onClick={() => setActiveNode("gap")}
                onMouseEnter={() => setHoveredNode("gap")}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <span className="font-extrabold tracking-widest">THE GAP</span>
              </div>
            </div>
            <div className="text-center mt-4 text-sm text-slate-400 font-medium">
              Literature Funnel
            </div>
          </div>

          <FlowArrow />

          {/* --- PHASE 2: METHODOLOGY --- */}
          <div className="w-full max-w-2xl bg-white p-4 md:p-6 pt-12 rounded-2xl shadow-sm border border-slate-200 relative mb-6">
            <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
              Phase 2
            </span>

            {/* Central Strategy Node */}
            <div className="flex justify-center mb-8">
              <div
                className="px-8 py-3 bg-white border-2 border-slate-700 rounded-lg shadow cursor-pointer hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
                onClick={() => setActiveNode("methodology")}
                onMouseEnter={() => setHoveredNode("methodology")}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <GitMerge className="w-5 h-5" />
                <span className="font-bold">Methodology Strategy</span>
              </div>
            </div>

            {/* The Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative">
              {/* Visual Connector Lines - Hidden on mobile */}
              <svg className="hidden md:block absolute top-0 left-0 w-full h-full pointer-events-none -mt-4">
                <path
                  d="M 50% 0 L 50% 20 L 25% 20 L 25% 40"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <path
                  d="M 50% 0 L 50% 20 L 75% 20 L 75% 40"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              </svg>

              {/* Track A */}
              <div className="flex flex-col gap-3">
                <div className="text-center text-xs md:text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">
                  Track A: Build
                </div>
                <div
                  className="p-3 rounded bg-emerald-50 border border-emerald-200 hover:border-emerald-500 cursor-pointer transition-all text-center"
                  onClick={() => setActiveNode("impl_method")}
                  onMouseEnter={() => setHoveredNode("impl_method")}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <Layout className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                  <div className="text-sm font-bold text-emerald-900">
                    Implementation
                    <br />
                    Method
                  </div>
                </div>

                <FlowArrow />

                <div
                  className="p-2 rounded border border-dashed border-slate-300 bg-slate-50 text-center text-xs text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors"
                  onMouseEnter={() => setHoveredNode("execution_impl")}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setActiveNode("execution_impl")}
                >
                  Execution (Building)
                </div>

                <FlowArrow />

                <div
                  className="p-3 rounded bg-emerald-50 border border-emerald-200 hover:border-emerald-500 cursor-pointer transition-all text-center"
                  onClick={() => setActiveNode("results_impl")}
                  onMouseEnter={() => setHoveredNode("results_impl")}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <CheckCircle className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                  <div className="text-sm font-bold text-emerald-900">
                    Implementation
                    <br />
                    Results
                  </div>
                </div>
              </div>

              {/* Track B */}
              <div className="flex flex-col gap-3">
                <div className="text-center text-xs md:text-sm font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  Track B: Research
                </div>
                <div
                  className="p-3 rounded bg-indigo-50 border border-indigo-200 hover:border-indigo-500 cursor-pointer transition-all text-center"
                  onClick={() => setActiveNode("res_method")}
                  onMouseEnter={() => setHoveredNode("res_method")}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <Search className="w-6 h-6 mx-auto text-indigo-600 mb-1" />
                  <div className="text-sm font-bold text-indigo-900">
                    Research
                    <br />
                    Method
                  </div>
                </div>

                <FlowArrow />

                <div
                  className="p-2 rounded border border-dashed border-slate-300 bg-slate-50 text-center text-xs text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors"
                  onMouseEnter={() => setHoveredNode("execution_res")}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setActiveNode("execution_res")}
                >
                  Execution (Gathering)
                </div>

                <FlowArrow />

                <div
                  className="p-3 rounded bg-indigo-50 border border-indigo-200 hover:border-indigo-500 cursor-pointer transition-all text-center"
                  onClick={() => setActiveNode("results_res")}
                  onMouseEnter={() => setHoveredNode("results_res")}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <BarChart2 className="w-6 h-6 mx-auto text-indigo-600 mb-1" />
                  <div className="text-sm font-bold text-indigo-900">
                    Research
                    <br />
                    Results
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FlowArrow />

          {/* --- PHASE 3: DISCUSSION --- */}
          <div className="w-full max-w-md relative mb-6">
            <span className="block mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-white px-3 py-1 rounded-full w-fit mx-auto">
              Phase 3
            </span>
            <div
              className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 cursor-pointer group hover:shadow-md transition-all relative"
              onClick={() => setActiveNode("discussion")}
              onMouseEnter={() => setHoveredNode("discussion")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="bg-slate-800 text-white p-6 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold">Discussion</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Synthesis of Track A & B
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>

              {/* Visual indicator that this connects back to Gap */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-amber-400 hidden lg:block"></div>
              <div className="absolute -right-24 top-1/2 -translate-y-1/2 text-[10px] text-amber-600 font-bold uppercase hidden lg:block w-20">
                Fills the Gap
              </div>
            </div>
          </div>

          <FlowArrow />

          {/* --- CONCLUSION --- */}
          <div className="w-full max-w-sm">
            <span className="block mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-white px-3 py-1 rounded-full w-fit mx-auto">
              Final
            </span>
            <div
              className="bg-red-50 p-4 rounded-xl border border-red-100 cursor-pointer hover:bg-red-100 hover:border-red-200 transition-colors text-center"
              onClick={() => setActiveNode("conclusion")}
              onMouseEnter={() => setHoveredNode("conclusion")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="flex items-center justify-center gap-2 text-red-900 font-bold">
                <Award className="w-5 h-5" /> Conclusion
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS PANEL */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
          {activeNode ? (
            <DetailPanel
              id={activeNode}
              onClose={() => setActiveNode(null)}
            />
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center h-full bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center opacity-70">
              <Lightbulb className="w-16 h-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-serif font-bold text-slate-500">
                Interactive Guide
              </h3>
              <p className="text-slate-400 mt-2">
                Click any section on the left to view detailed breakdown, word
                counts, and common mistakes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThesisNavigator;
