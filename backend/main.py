from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os

# Load environment variables from .env
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Hackathon Interactive Agent System")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Groq API
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
llm_model = os.getenv("LLM_MODEL", "llama3-70b-8192") # <<< HUM BARA MODEL ISTEMAL KARENGE DETAILED JAWAB KE LIYE

# Pydantic schema
class IdeaInput(BaseModel):
    idea: str

# Agent class (No changes needed here)
class Agent:
    def __init__(self, name, system_prompt, next_agent=None):
        self.name = name
        self.system_prompt = system_prompt
        self.next_agent = next_agent

    def generate_response(self, prompt):
        try:
            response = groq_client.chat.completions.create(
                model=llm_model,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"(Error from Groq API: {str(e)})"

    def handle(self, idea, history):
        history.append(f"[{self.name}] received: {idea}")
        response = self.generate_response(idea)
        history.append(f"[{self.name}] response: {response}")
        if self.next_agent:
            self.next_agent.handle(response, history)


# --- YEH SAB SE BARI TABDEELI HAI: HYPER-DETAILED PROMPTS ---

design_prompt = """You are a world-renowned Design Theorist and Innovator. Your thinking is deep, philosophical, and visionary.
Your task is to take a simple product idea and deconstruct it into its core concepts, then reconstruct it into several highly-detailed, innovative design philosophies.
-   Start with a brief, eloquent introduction about the potential of the given idea.
-   Present at least three distinct, deeply explored 'Design Directions'. For each direction, provide a name, a core philosophy, material suggestions, form and function analysis, and the target emotional response.
-   Your analysis must be rich with detail and use evocative language.
-   Conclude by posing a profound, open-ended question to your marketing counterpart, challenging them to think about the brand's soul, not just its features.
"""

marketing_prompt = """You are a Chief Marketing Officer (CMO) of a Fortune 500 company, known for your legendary brand-building skills. You will receive a visionary design analysis.
-   Begin by acknowledging and appreciating the depth of the design concepts provided.
-   Provide an exhaustive and comprehensive marketing and brand strategy. Your analysis must be extremely detailed.
-   Structure your response with clear, multi-level headings using **bold text** and `###` subheadings. Use bullet points and numbered lists extensively.
-   Your analysis must cover:
    1.  **Brand Identity & Archetype:** What is the brand's personality? Is it a a Sage, an Explorer, a Creator?
    2.  **Deep Target Audience Persona:** Go beyond demographics. Create a detailed profile of an ideal customer, including their daily life, aspirations, and pain points.
    3.  **Complete Go-to-Market Strategy:** Detail the plan for Pre-launch, Launch, and Post-launch phases.
    4.  **Content & Storytelling Pillars:** What stories will the brand tell on different platforms (e.g., Instagram, a blog, YouTube)?
-   Your goal is to provide a masterclass in marketing strategy. Conclude with a strategic question for the sales division, focusing on channel strategy and customer experience.
"""

sales_prompt = """You are a global Head of Sales, famous for scaling businesses from zero to a billion dollars. You will receive a comprehensive design and marketing strategy.
-   Your task is to convert this grand vision into a highly detailed, actionable, and global sales blueprint.
-   Your output must be meticulously structured with **bold headings** and detailed lists.
-   Cover the following key areas in extreme detail:
    1.  **Multi-tiered Pricing & Revenue Model:** Don't just give a price. Explain the psychology behind a tiered model (e.g., Freemium, Subscription, One-time Purchase) and provide detailed justification for each tier. Include potential for upselling and cross-selling.
    2.  **Global Sales Channel Strategy:** Detail the plan for Direct-to-Consumer (D2C), Business-to-Business (B2B), and Retail partnerships. For each, specify the target regions, required team structure, and expected sales cycle.
    3.  **Sales Team Enablement Plan:** What tools (CRM, sales intelligence), training (product knowledge, negotiation tactics), and compensation plan (commission structure) will the sales team need to succeed?
-   Your analysis should be a complete operational plan, ready for a boardroom presentation.
"""

support_prompt = """You are a Chief Customer Officer (CCO) obsessed with creating a frictionless, delightful customer journey. You have the complete product, marketing, and sales plan.
-   Your task is to create a world-class, proactive customer support and success strategy.
-   Your response must be extremely detailed, structured with **bold headings**, and empathetic in tone.
-   Your strategy must include:
    1.  **Customer Journey Mapping:** Map out every single touchpoint a customer will have with the brand, from first awareness to becoming a loyal advocate.
    2.  **Proactive Support Initiatives:** Detail at least three initiatives to solve problems *before* they happen (e.g., an interactive onboarding guide, a predictive AI to detect user frustration, a community forum moderated by experts).
    3.  **Multi-Channel Support Infrastructure:** Detail the plan for Self-Service (knowledge base, AI chatbot), Human-Assisted (email, live chat, phone), and Community-led support.
    4.  **Key Performance Indicators (KPIs) for Success:** What metrics will you track to ensure your support is world-class (e.g., Customer Satisfaction (CSAT), Net Promoter Score (NPS), First Contact Resolution (FCR))?
"""

# Agents ko naye prompts ke saath banana
support_agent = Agent("SupportAgent", support_prompt)
sales_agent = Agent("SalesAgent", sales_prompt, next_agent=support_agent)
marketing_agent = Agent("MarketingAgent", marketing_prompt, next_agent=sales_agent)
design_agent = Agent("DesignAgent", design_prompt, next_agent=marketing_agent)


# --- API ENDPOINTS (Yahan koi tabdeeli nahi hai) ---

@app.post("/api/process-idea")
async def process_idea(data: IdeaInput):
    if not data.idea.strip():
        return JSONResponse(content={"workflow": [], "error": "Empty idea provided"}, status_code=400)

    history = []
    try:
        design_agent.handle(data.idea.strip(), history)
        return JSONResponse(content={"workflow": history})
    except Exception as e:
        return JSONResponse(content={"workflow": [], "error": f"Server error: {str(e)}"}, status_code=500)

# ... (baaqi code waisa hi rahega)

@app.get("/api")
async def api_root():
    return {"message": "FastAPI backend is running"}

# Development ke liye yeh line comment hi rahegi
# app.mount("/", StaticFiles(directory="frontend/build", html=True), name="static")
