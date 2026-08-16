import simResume from "@/assets/sim-resume.jpg";
import simFace from "@/assets/sim-face.jpg";
import simSales from "@/assets/sim-sales.jpg";
import simHealth from "@/assets/sim-health.jpg";
import simDocs from "@/assets/sim-docs.jpg";

export type CodeBlock = { title: string; language: string; code: string };
export type Shot = { src: string; caption: string };

export type ProjectDetail = {
  summary: string;
  problem: string;
  features: string[];
  architecture: string[];
  code: CodeBlock[];
  gallery: Shot[];
  results: { label: string; value: string }[];
};

export const projectDetails: Record<string, ProjectDetail> = {

  "ai-powered-talent-scouting-agent": {
    summary:
      "An intelligent recruiting agent that ingests Job Descriptions, discovers matching candidates from a synthetic pool, simulates recruiter outreach, and returns a recruiter-ready shortlist with Match Score, Interest Score, and auditable rationale for every ranking decision.",
    problem:
      "Recruiters face low precision with keyword filters, manual candidate outreach overhead, and black-box AI scores that lack transparent rationale. Existing screening tools fail to evaluate candidate engagement or calibrate fit scores accurately across technical and logistical constraints.",
    features: [
      "Hybrid Retrieval: Dense vector search (pgvector ANN), Sparse full-text search (BM25), and rules-based scoring",
      "Reciprocal Rank Fusion (RRF): Blends multi-channel retrieval signals into a unified candidate ranking",
      "Cross-Encoder Reranker: ms-marco-MiniLM-L6-v2 model for fine-grained semantic precision reranking",
      "Calibrated Scoring Engine: DPR-defined multi-axis formulas with Sigmoid & Platt calibration",
      "LLM Outreach Simulator: Gemini 2.5 Flash conversation engine for candidate interest & availability assessment",
      "Auditable Explainability: Dynamic feature contribution tables providing transparent score breakdowns rather than black-box LLM opinions",
      "Synthetic Candidate Pool: Pre-populated with 120 synthetic candidate profiles and 10 benchmark Job Descriptions",
      "Decoupled Architecture: FastAPI + Uvicorn backend with an interactive Streamlit UI dashboard",
    ],
    architecture: [
      "JD Input → JD Parser (Extract skills, experience, title, salary, notice period)",
      "Hard Filter (Apply strict checks on minimum experience, notice period, location)",
      "Hybrid Retrieval (Dense pgvector ANN + Sparse text search + Rule-based scoring)",
      "RRF Fusion (Reciprocal Rank Fusion combining multiple retrieval channels)",
      "Cross-Encoder Reranking (ms-marco-MiniLM-L6-v2 precision scoring)",
      "Match Scoring (Multi-axis feature fit S_f & raw match score M_raw + Sigmoid calibration)",
      "Outreach Simulation (LLM-powered or deterministic candidate engagement)",
      "Interest Scoring (Calibrated interest score I_raw with hard caps for notice & salary)",
      "Final Shortlist + Rationale (ShortlistRankScore = 0.70 * Match + 0.30 * Interest + Feature Contributions)",
    ],
    code: [
      {
        title: "Match Score & Calibrated Interest Score Formulas",
        language: "python",
        code: `def calculate_match_score(candidate: Candidate, jd: JobDescription) -> float:
    # S_f: Multi-axis hard feature fit score
    s_f = (
        0.30 * must_have_skills_fit(candidate, jd) +
        0.08 * nice_to_have_skills_fit(candidate, jd) +
        0.10 * title_match_score(candidate, jd) +
        0.12 * experience_fit_score(candidate, jd) +
        0.10 * domain_relevance_score(candidate, jd) +
        0.12 * past_role_similarity(candidate, jd) +
        0.08 * location_fit_score(candidate, jd) +
        0.10 * company_tier_fit(candidate, jd)
    )
    # M_raw: Composite raw score incorporating Cross-Encoder (X), Vector (V), Sparse (K)
    m_raw = 0.38 * s_f + 0.30 * cross_encoder_score + 0.17 * dense_sim + 0.15 * sparse_score
    return round(100 * calibrate_sigmoid(gate_factor * quality_factor * m_raw), 1)

def calculate_interest_score(sim: OutreachResult) -> float:
    # I_raw: Conversation signals & alignment weights
    i_raw = (
        0.35 * sim.intent_engagement +
        0.18 * sim.role_alignment +
        0.12 * sim.work_mode_fit +
        0.15 * sim.salary_fit +
        0.10 * sim.notice_period_fit +
        0.06 * sim.growth_qualifiers +
        0.04 * sim.flexibility_tolerance
    )
    calibrated = calibrate_platt(i_raw)
    # Apply hard caps for salary misalignment or notice period violations
    if sim.salary_exceeded or sim.notice_too_long:
        calibrated = min(calibrated, 0.40)
    return round(100 * calibrated, 1)`,
      },
      {
        title: "Hybrid Retrieval with Reciprocal Rank Fusion (RRF)",
        language: "python",
        code: `def hybrid_rrf_retrieval(query_vec: list[float], query_text: str, k: int = 60) -> list[Candidate]:
    # 1. Dense Vector Search via pgvector ANN
    dense_hits = db.query(Candidate).order_by(
        Candidate.embedding.l2_distance(query_vec)
    ).limit(k).all()

    # 2. Sparse Text Search (Full-text BM25)
    sparse_hits = db.query(Candidate).filter(
        Candidate.full_text.match(query_text)
    ).limit(k).all()

    # 3. Reciprocal Rank Fusion (RRF)
    rrf_map = {}
    C = 60  # RRF constant parameter
    for rank, c in enumerate(dense_hits):
        rrf_map[c.id] = rrf_map.get(c.id, 0.0) + 1.0 / (C + rank + 1)
    for rank, c in enumerate(sparse_hits):
        rrf_map[c.id] = rrf_map.get(c.id, 0.0) + 1.0 / (C + rank + 1)

    ranked_ids = sorted(rrf_map.keys(), key=lambda cid: rrf_map[cid], reverse=True)
    return get_candidates_by_ids(ranked_ids[:k])`,
      },
      {
        title: "Cross-Encoder Reranker & Shortlist Ranking",
        language: "python",
        code: `from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L6-v2")

def build_shortlist(jd: JobDescription, candidates: list[Candidate]) -> list[RankedCandidate]:
    pairs = [[jd.text, c.profile_summary] for c in candidates]
    rerank_scores = reranker.predict(pairs)

    shortlist = []
    for candidate, ce_score in zip(candidates, rerank_scores):
        match_score = calculate_match_score(candidate, jd)
        interest_score = simulate_outreach_and_score(candidate, jd)

        # Combined Shortlist Rank Score formula: 70% MatchScore + 30% InterestScore
        shortlist_rank_score = 0.70 * match_score + 0.30 * interest_score

        shortlist.append(RankedCandidate(
            candidate=candidate,
            match_score=match_score,
            interest_score=interest_score,
            shortlist_rank_score=round(rank_score, 1),
            feature_contributions=explain_scores(candidate, jd)
        ))

    return sorted(shortlist, key=lambda x: x.shortlist_rank_score, reverse=True)`,
      },
    ],
    gallery: [{ src: simResume, caption: "Shortlist dashboard featuring Match & Interest scores with feature contribution tables" }],
    results: [
      { label: "Top-10 Precision", value: "94%" },
      { label: "Synthetic Pool", value: "120 candidates" },
      { label: "Reranker Model", value: "MiniLM-L6" },
      { label: "LLM Model", value: "Gemini 2.5 Flash" },
    ],
  },



  "qwen-multimodal-face-recognition": {
    summary:
      "A high-throughput multimodal intelligence system fine-tuning Qwen2.5-VL-32B with QLoRA on NVIDIA L40s GPUs for Indian celebrity & cricketer face recognition, integrated with Buffalo-L face embeddings, Whisper-large-v3 audio transcription, and a Milvus-powered RAG pipeline.",
    problem:
      "Off-the-shelf vision models failed to accurately identify Indian celebrities and cricketers under varying lighting, broadcast angles, and fast motion. Additionally, video search lacked audio-visual alignment, making it impossible to query video content using both facial identity and spoken transcripts.",
    features: [
      "Fine-Tuned Qwen2.5-VL-32B: Parameter-efficient QLoRA fine-tuning on NVIDIA L40s GPUs for Indian celebrity & cricketer visual recognition",
      "Buffalo-L Face Recognition Pipeline: Deep feature extraction with InsightFace Buffalo-L model for high-precision facial matching",
      "Whisper-large-v3 Audio Transcription: Automatic speech-to-text pipeline synchronizing spoken audio with video timestamps",
      "Multimodal Video Understanding: Fused audio transcripts and visual frames into Qwen2.5-VL for contextual video QA",
      "Interactive Audio Chatbot: Voice-activated speech-to-text chatbot performing vector search & DB queries",
      "Vector Storage & RAG: High-dimensional embedding search powered by Milvus vector DB and LangChain orchestration",
      "CUDA & PyTorch Acceleration: Optimized GPU memory layout for low-latency batch inference on L40s hardware",
      "FastAPI Service Endpoint: RESTful microservice API serving real-time multimodal search & conversational queries",
    ],
    architecture: [
      "Video Input → Frame Sampler & Audio Stream Separator",
      "Buffalo-L Detector → Aligned Face Embeddings → Vector Matching",
      "Whisper-large-v3 → Speech-to-Text Transcription → Timestamp Alignment",
      "QLoRA Qwen2.5-VL-32B → Multimodal Fusion (Visual Frames + Transcripts)",
      "Milvus Vector DB → RAG Context Retrieval & Speech Chatbot Processing",
      "FastAPI Microservice → Real-Time Web App & Audio Chat Response",
    ],
    code: [
      {
        title: "QLoRA Fine-Tuning Setup for Qwen2.5-VL-32B",
        language: "python",
        code: `import torch
from transformers import AutoModelForVision2Seq, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model

# 4-bit Quantization Config for NVIDIA L40s GPU Execution
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)

model = AutoModelForVision2Seq.from_pretrained(
    "Qwen/Qwen2.5-VL-32B-Instruct",
    quantization_config=bnb_config,
    device_map="auto",
    torch_dtype=torch.bfloat16,
)

peft_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)
model = get_peft_model(model, peft_config)`,
      },
      {
        title: "Buffalo-L Embedding Match & Whisper-large-v3 Pipeline",
        language: "python",
        code: `import whisper
from insightface.app import FaceAnalysis
from pymilvus import Collection

# Initialize InsightFace Buffalo-L model & Whisper large-v3 on CUDA
face_app = FaceAnalysis(name="buffalo_l", providers=["CUDAExecutionProvider"])
face_app.prepare(ctx_id=0, det_size=(640, 640))
whisper_model = whisper.load_model("large-v3", device="cuda")

def process_multimodal_clip(video_frame: np.ndarray, audio_path: str):
    # 1. Face Recognition via Buffalo-L embeddings
    faces = face_app.get(video_frame)
    embeddings = [f.embedding / np.linalg.norm(f.embedding) for f in faces]
    search_res = milvus_collection.search(embeddings, "embedding_vec", param={"metric_type": "COSINE"}, limit=1)

    # 2. Audio Transcription via Whisper-large-v3
    transcript = whisper_model.transcribe(audio_path, language="en")["text"]

    return {"faces": search_res, "transcript": transcript}`,
      },
      {
        title: "Multimodal RAG & Audio Chatbot Querying",
        language: "python",
        code: `from langchain_community.vectorstores import Milvus
from langchain.chains import ConversationalRetrievalChain

vector_db = Milvus(embedding_function=embeddings, collection_name="multimodal_knowledge")

def audio_chatbot_query(audio_bytes: bytes) -> str:
    # Speech-to-Text conversion via Whisper
    user_query_text = whisper_model.transcribe(audio_bytes)["text"]

    # Contextual Retrieval over Milvus Vector Database
    retrieved_docs = vector_db.similarity_search(user_query_text, k=4)
    context = "\\n".join([doc.page_content for doc in retrieved_docs])

    # Context-aware Multimodal Generation via Fine-tuned Qwen2.5-VL-32B
    prompt = f"Audio Transcript Context:\\n{context}\\n\\nUser Query: {user_query_text}"
    return qwen_model.generate(prompt)`,
      },
    ],
    gallery: [{ src: simFace, caption: "Multimodal recognition pipeline with Qwen2.5-VL visual reasoning and Whisper audio RAG" }],
    results: [
      { label: "Celebrity Accuracy", value: "98.6%" },
      { label: "GPU Platform", value: "NVIDIA L40s" },
      { label: "Audio Transcriber", value: "Whisper-large-v3" },
      { label: "Vector DB Latency", value: "< 15 ms" },
    ],
  },


  "multi-branch-sales-analytics": {
    summary:
      "A full-stack multi-branch sales analytics and business intelligence dashboard for a retail enterprise operating across 5 branches (3 in Hyderabad, 2 in Andhra Pradesh). Ingests raw transactional sales reports into PostgreSQL to deliver real-time KPI monitoring, P&L profit tracking, multi-granularity revenue analytics, tax liability audits, and salesperson leaderboards.",
    problem:
      "Managing raw billing reports across 5 separate store locations made it difficult to identify revenue drivers, evaluate store-level profitability, track tax liabilities, and monitor individual salesperson contributions. Manual spreadsheet analysis caused delayed financial reporting and lacked interactive drill-down filtering by product, category, store, date range, or price point.",
    features: [
      "5-Branch Regional Analytics: Aggregate or single-store breakdown comparing 3 Hyderabad stores and 2 Andhra Pradesh branches",
      "Executive KPI Layer: Real-time tracking of Total Revenue, Quantity, Total Bills, Avg Bill Value, Today's Revenue, and Month-to-Date (MTD) Sales",
      "Financial & Profitability Engine: Exact profit calculation (Net Amount − Cost Price), Avg Profit per Bill, Gross Margin, and COGS breakdown",
      "Tax Liability & Audit Module: Automated tracking of basic pre-tax amount, tax collected, tax-to-revenue ratio, and periodic tax summary reports",
      "Product & Category Intelligence: Top-performing product rankings, underperforming inventory flags, and category/department revenue distribution",
      "Salesperson Leaderboard: Performance tracking and commission-ready sales leaderboards ranked by net revenue and bill count",
      "Multi-Granularity Time Series: Hourly peak-time sales curve, daily performance, and monthly/yearly seasonal trend visualizations with Recharts",
      "CSV/XLSX Ingestion Pipeline: Express/Multer file ingestion service utilizing PapaParse and XLSX to parse and index billing exports into PostgreSQL",
      "Interactive Multi-Param Filter: Deep search and filter by store branch, category, product, salesperson, date range, and price bracket",
    ],
    architecture: [
      "Raw Billing CSV/XLSX Export → Express Ingestion Endpoint (Multer + PapaParse/XLSX)",
      "Node.js Data Cleaning & Schema Normalization → PostgreSQL (Indexed on Date, Branch, Category)",
      "Express REST API Endpoints → SQL Aggregations (KPIs, Profit, Tax, Leaderboard)",
      "React Query Data Fetching & Caching → State Management Layer",
      "React 18 + Recharts + Tailwind CSS UI → Interactive Executive Dashboards & Filters",
    ],
    code: [
      {
        title: "PostgreSQL Sales Schema & Financial Aggregation Query",
        language: "typescript",
        code: `// Express REST Endpoint for Branch Financials & P&L Analysis
router.get("/api/analytics/financials", async (req, res) => {
  const { branchId, startDate, endDate } = req.query;
  const query = \`
    SELECT 
      branch_site,
      COUNT(DISTINCT transaction_id) AS total_bills,
      SUM(quantity) AS total_units_sold,
      SUM(net_amount) AS total_revenue,
      SUM(cost_price * quantity) AS total_cogs,
      SUM(net_amount - (cost_price * quantity)) AS gross_profit,
      ROUND(SUM(net_amount - (cost_price * quantity)) / NULLIF(SUM(net_amount), 0) * 100, 2) AS profit_margin_pct,
      SUM(basic_amount) AS total_pre_tax_amount,
      SUM(tax_amount) AS total_tax_collected,
      ROUND(AVG(net_amount), 2) AS avg_bill_value,
      ROUND(AVG(net_amount - (cost_price * quantity)), 2) AS avg_profit_per_bill
    FROM sales_data
    WHERE bill_date BETWEEN $1 AND $2
      AND ($3::text IS NULL OR branch_site = $3)
    GROUP BY branch_site
    ORDER BY total_revenue DESC;
  \`;
  const result = await db.query(query, [startDate, endDate, branchId || null]);
  res.json(result.rows);
});`,
      },
      {
        title: "React 18 Dashboard Executive KPI Component",
        language: "typescript",
        code: `import React from "react";
import { useQuery } from "@tanstack/react-query";

export const ExecutiveMetrics: React.FC<{ filters: FilterState }> = ({ filters }) => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["sales-metrics", filters],
    queryFn: () => fetchSalesMetrics(filters),
  });

  if (isLoading || !metrics) return <div className="animate-pulse h-48 bg-secondary/50 rounded-xl" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard title="Total Revenue" value={\`₹\${metrics.totalRevenue.toLocaleString()}\`} change="+12.4%" />
      <MetricCard title="Gross Profit" value={\`₹\${metrics.grossProfit.toLocaleString()}\`} subtitle={\`Margin: \${metrics.profitMarginPct}%\`} />
      <MetricCard title="Tax Collected" value={\`₹\${metrics.taxCollected.toLocaleString()}\`} subtitle={\`Tax Ratio: \${metrics.taxRatio}%\`} />
      <MetricCard title="Total Transactions" value={metrics.totalBills.toLocaleString()} subtitle={\`Avg Bill: ₹\${metrics.avgBillValue}\`} />
    </div>
  );
};`,
      },
      {
        title: "CSV/XLSX Sales File Ingestion Service",
        language: "typescript",
        code: `import multer from "multer";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export async function processUploadedSalesReport(fileBuffer: Buffer, mimeType: string) {
  let rawRows: any[] = [];
  if (mimeType.includes("csv")) {
    const text = fileBuffer.toString("utf-8");
    rawRows = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
  } else {
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }

  const normalizedData = rawRows.map(row => ({
    transactionId: row["Bill No"] || row["Transaction ID"],
    itemCode: row["Item Code"],
    billDate: new Date(row["Bill Date"]),
    productName: row["Description"] || row["Item Name"],
    category: row["Category"],
    subCategory: row["Department"],
    salespersonName: row["Salesman"],
    quantity: Number(row["Qty"] || 1),
    costPrice: Number(row["Cost Price"] || 0),
    basicAmount: Number(row["Basic Amt"] || 0),
    taxAmount: Number(row["Tax Amt"] || 0),
    netAmount: Number(row["Net Amt"] || row["Total Amount"]),
    branchSite: row["Branch"] || row["Store Location"]
  }));

  await batchInsertSalesRecords(normalizedData);
}`,
      },
    ],
    gallery: [{ src: simSales, caption: "Multi-Branch Executive Sales Analytics & Financial Intelligence Dashboard" }],
    results: [
      { label: "Active Branches", value: "5 (3 HYD, 2 AP)" },
      { label: "Analytics Modules", value: "7 Modules" },
      { label: "DB Query Latency", value: "< 25 ms" },
      { label: "Profit Calculation", value: "Net - Cost Price" },
    ],
  },

  "adaclip-denoising-anomaly-detection": {
    summary:
      "AdaCLIP-D is a multi-stage hybrid denoising framework that restores zero-shot anomaly detection performance under heavy noise and corruption by combining spatial U-Net image restoration with 3 embedded in-ViT DnCNN modules and noise-aware adaptive patch gating.",
    problem:
      "State-of-the-art zero-shot anomaly detection models like AdaCLIP drop sharply in accuracy under image corruption (e.g. AUROC falling from 89.7% to 71.2% under Gaussian noise σ=50). Conventional single-stage denoisers create domain gaps and over-smooth visual features, erasing critical anomaly cues.",
    features: [
      "Multi-Stage Hybrid Architecture: Dual-level noise removal combining global spatial U-Net restoration with in-transformer ViT feature refinement",
      "U-Net Spatial Denoiser (D1): 5-level encoder-decoder with PReLU, multi-scale residual connections, depthwise-separable convolutions, and Polarized Self-Attention (PSA) bottleneck",
      "Deep ViT DnCNN Integration (D2, D3, D4): Three 17-layer residual DnCNN modules injected at Transformer depths 4, 8, and 12 for feature-level noise subtraction",
      "Noise-Aware Adaptive Patch Gating: Dynamic gating weight α = sigmoid(MLP(Var(P_i))) blending denoised representations while retaining original semantics on clean patches",
      "Curriculum Training Scheme: Pretrained with Charbonnier + Perceptual + GAN loss on DIV2K, followed by 0.7 MSE + 0.3 SSIM hybrid objective with domain adaptation on MVTec AD & LoDoPaB-CT",
      "Gradient-Controlled Feature Preservation: Stop-gradient operations restricting gradient flow by ~30% and bounding residual noise (||ε||_2 ≤ 0.1·σ_input) to preserve subtle anomaly patterns",
      "Substantial Robustness Gains: Achieved +4.81 F1 score boost (83.44 → 88.25) and +0.70 AP on noisy VisA benchmark datasets",
      "Domain Evaluation: Comprehensive benchmarking across medical (ColonDB), industrial (MVTec AD), and object anomaly (VisA) datasets",
    ],
    architecture: [
      "Noisy Image → U-Net Denoiser (D1: Spatial Restoration with Polarized Self-Attention)",
      "Restored Image → CLIP ViT Patch Embedding & Linear Projection",
      "Transformer Blocks 1–4 → DnCNN (D2: Mid-Level Feature Denoising)",
      "Transformer Blocks 5–8 → DnCNN (D3: High-Level Feature Denoising)",
      "Transformer Blocks 9–12 → DnCNN (D4: Deep Semantic Denoising)",
      "Noise-Aware Patch Gating (α = sigmoid(MLP(Var(P_i)))) → Hybrid Semantic Fusion",
      "Zero-Shot Text Prompt Alignment → AdaCLIP Anomaly Prediction Map",
    ],
    code: [
      {
        title: "Noise-Aware Adaptive Patch Gating & In-ViT DnCNN Module",
        language: "python",
        code: `import torch
import torch.nn as nn

class NoiseAwarePatchGating(nn.Module):
    def __init__(self, embed_dim: int):
        super().__init__()
        self.mlp = nn.Sequential(
            nn.Linear(1, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.Sigmoid()
        )

    def forward(self, patch_tokens: torch.Tensor, denoised_tokens: torch.Tensor) -> torch.Tensor:
        # Calculate patch variance as a proxy for noise content
        patch_variance = torch.var(patch_tokens, dim=-1, keepdim=True)  # [B, N, 1]
        alpha = self.mlp(patch_variance)  # Dynamic gating weight alpha

        # Adaptive blending: high noise -> stronger denoising, clean -> retain original semantics
        return alpha * denoised_tokens + (1.0 - alpha) * patch_tokens

class InViTDnCNNModule(nn.Module):
    def __init__(self, num_layers: int = 17, in_channels: int = 768):
        super().__init__()
        layers = [nn.Conv2d(in_channels, 64, kernel_size=3, padding=1), nn.ReLU(inplace=True)]
        for _ in range(num_layers - 2):
            layers.extend([
                nn.Conv2d(64, 64, kernel_size=3, padding=1, bias=False),
                nn.BatchNorm2d(64),
                nn.ReLU(inplace=True)
            ])
        layers.append(nn.Conv2d(64, in_channels, kernel_size=3, padding=1, bias=False))
        self.dncnn = nn.Sequential(*layers)

    def forward(self, feature_map: torch.Tensor) -> torch.Tensor:
        predicted_noise = self.dncnn(feature_map)
        return feature_map - predicted_noise  # Residual noise subtraction`,
      },
      {
        title: "U-Net Spatial Denoiser with Polarized Self-Attention (PSA)",
        language: "python",
        code: `class PolarizedSelfAttention(nn.Module):
    def __init__(self, channel: int):
        super().__init__()
        self.ch_wv = nn.Conv2d(channel, channel // 2, kernel_size=1)
        self.ch_wq = nn.Conv2d(channel, 1, kernel_size=1)
        self.sp_wv = nn.Conv2d(channel, channel // 2, kernel_size=1)
        self.sp_wq = nn.Conv2d(channel, channel, kernel_size=1)
        self.softmax = nn.Softmax(dim=-1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        b, c, h, w = x.size()
        # Channel-only self-attention branch
        ch_q = self.ch_wq(x).view(b, 1, -1)
        ch_v = self.ch_wv(x).view(b, c // 2, -1)
        ch_attn = torch.matmul(ch_v, self.softmax(ch_q).transpose(-1, -2)).view(b, c // 2, 1, 1)
        ch_out = torch.sigmoid(ch_attn) * x

        # Spatial-only self-attention branch
        sp_q = self.sp_wq(x).view(b, c, -1)
        sp_v = self.sp_wv(x).view(b, c // 2, -1)
        sp_attn = torch.matmul(self.softmax(sp_q).transpose(-1, -2), sp_v).view(b, 1, h, w)
        sp_out = self.sigmoid(sp_attn) * x

        return ch_out + sp_out

# Loss function: Charbonnier + Perceptual + GAN composite objective
def composite_unet_loss(y_pred, y_true, perceptual_loss, gan_loss):
    charbonnier = torch.mean(torch.sqrt((y_pred - y_true) ** 2 + 1e-6))
    return 0.5 * charbonnier + 0.3 * perceptual_loss + 0.2 * gan_loss`,
      },
      {
        title: "AdaCLIP-D Forward Execution & Gradient-Controlled Preservation",
        language: "python",
        code: `def forward_adaclip_d(noisy_image: torch.Tensor, sigma_input: float) -> torch.Tensor:
    # Stage 1: Spatial Image Denoising via U-Net (D1)
    denoised_image = unet_denoiser(noisy_image)

    # Enforce bounded residual noise: ||epsilon||_2 <= 0.1 * sigma_input
    residual = denoised_image - noisy_image
    residual_norm = torch.norm(residual, p=2, dim=[1,2,3], keepdim=True)
    max_norm = 0.1 * sigma_input
    residual = torch.where(residual_norm > max_norm, residual * (max_norm / residual_norm), residual)
    denoised_image = noisy_image + residual

    # Stage 2: In-ViT Feature Denoising with Stop-Gradient
    tokens = clip_vit.patch_embed(denoised_image)
    for i, block in enumerate(clip_vit.blocks):
        tokens = block(tokens)
        if i + 1 in [4, 8, 12]:  # Insert DnCNN modules at depths 4, 8, 12
            feat_map = tokens_to_grid(tokens)
            denoised_feat = dncnn_modules[i](feat_map)
            denoised_tokens = grid_to_tokens(denoised_feat)

            # Apply Noise-Aware Adaptive Patch Gating
            tokens = patch_gating(tokens, denoised_tokens)

            # Reduce gradient flow by 30% to preserve anomaly features
            tokens = 0.7 * tokens + 0.3 * tokens.detach()

    # Stage 3: Hybrid Semantic Fusion & Anomaly Map Calculation
    anomaly_map = adaclip_head(tokens, prompt_embeddings)
    return anomaly_map`,
      },
    ],
    gallery: [{ src: simDocs, caption: "AdaCLIP-D multi-stage hybrid denoising architecture and anomaly localization map" }],
    results: [
      { label: "VisA Image-F1 Gain", value: "83.44 → 88.25" },
      { label: "MVTec AD Pixel-AUROC", value: "96.88%" },
      { label: "Gaussian Noise (σ=50)", value: "Robust Restoration" },
      { label: "DnCNN ViT Depths", value: "Depths 4, 8, 12" },
    ],
  },

  "adaclip-d-anomaly-detection": {
    summary:
      "AdaCLIP-D is a multi-stage hybrid denoising framework that restores zero-shot anomaly detection performance under heavy noise and corruption by combining spatial U-Net image restoration with 3 embedded in-ViT DnCNN modules and noise-aware adaptive patch gating.",
    problem:
      "State-of-the-art zero-shot anomaly detection models like AdaCLIP drop sharply in accuracy under image corruption (e.g. AUROC falling from 89.7% to 71.2% under Gaussian noise σ=50). Conventional single-stage denoisers create domain gaps and over-smooth visual features, erasing critical anomaly cues.",
    features: [
      "Multi-Stage Hybrid Architecture: Dual-level noise removal combining global spatial U-Net restoration with in-transformer ViT feature refinement",
      "U-Net Spatial Denoiser (D1): 5-level encoder-decoder with PReLU, multi-scale residual connections, depthwise-separable convolutions, and Polarized Self-Attention (PSA) bottleneck",
      "Deep ViT DnCNN Integration (D2, D3, D4): Three 17-layer residual DnCNN modules injected at Transformer depths 4, 8, and 12 for feature-level noise subtraction",
      "Noise-Aware Adaptive Patch Gating: Dynamic gating weight α = sigmoid(MLP(Var(P_i))) blending denoised representations while retaining original semantics on clean patches",
      "Curriculum Training Scheme: Pretrained with Charbonnier + Perceptual + GAN loss on DIV2K, followed by 0.7 MSE + 0.3 SSIM hybrid objective with domain adaptation on MVTec AD & LoDoPaB-CT",
      "Gradient-Controlled Feature Preservation: Stop-gradient operations restricting gradient flow by ~30% and bounding residual noise (||ε||_2 ≤ 0.1·σ_input) to preserve subtle anomaly patterns",
      "Substantial Robustness Gains: Achieved +4.81 F1 score boost (83.44 → 88.25) and +0.70 AP on noisy VisA benchmark datasets",
      "Domain Evaluation: Comprehensive benchmarking across medical (ColonDB), industrial (MVTec AD), and object anomaly (VisA) datasets",
    ],
    architecture: [
      "Noisy Image → U-Net Denoiser (D1: Spatial Restoration with Polarized Self-Attention)",
      "Restored Image → CLIP ViT Patch Embedding & Linear Projection",
      "Transformer Blocks 1–4 → DnCNN (D2: Mid-Level Feature Denoising)",
      "Transformer Blocks 5–8 → DnCNN (D3: High-Level Feature Denoising)",
      "Transformer Blocks 9–12 → DnCNN (D4: Deep Semantic Denoising)",
      "Noise-Aware Patch Gating (α = sigmoid(MLP(Var(P_i)))) → Hybrid Semantic Fusion",
      "Zero-Shot Text Prompt Alignment → AdaCLIP Anomaly Prediction Map",
    ],
    code: [
      {
        title: "Noise-Aware Adaptive Patch Gating & In-ViT DnCNN Module",
        language: "python",
        code: `import torch
import torch.nn as nn

class NoiseAwarePatchGating(nn.Module):
    def __init__(self, embed_dim: int):
        super().__init__()
        self.mlp = nn.Sequential(
            nn.Linear(1, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.Sigmoid()
        )

    def forward(self, patch_tokens: torch.Tensor, denoised_tokens: torch.Tensor) -> torch.Tensor:
        # Calculate patch variance as a proxy for noise content
        patch_variance = torch.var(patch_tokens, dim=-1, keepdim=True)  # [B, N, 1]
        alpha = self.mlp(patch_variance)  # Dynamic gating weight alpha

        # Adaptive blending: high noise -> stronger denoising, clean -> retain original semantics
        return alpha * denoised_tokens + (1.0 - alpha) * patch_tokens

class InViTDnCNNModule(nn.Module):
    def __init__(self, num_layers: int = 17, in_channels: int = 768):
        super().__init__()
        layers = [nn.Conv2d(in_channels, 64, kernel_size=3, padding=1), nn.ReLU(inplace=True)]
        for _ in range(num_layers - 2):
            layers.extend([
                nn.Conv2d(64, 64, kernel_size=3, padding=1, bias=False),
                nn.BatchNorm2d(64),
                nn.ReLU(inplace=True)
            ])
        layers.append(nn.Conv2d(64, in_channels, kernel_size=3, padding=1, bias=False))
        self.dncnn = nn.Sequential(*layers)

    def forward(self, feature_map: torch.Tensor) -> torch.Tensor:
        predicted_noise = self.dncnn(feature_map)
        return feature_map - predicted_noise  # Residual noise subtraction`,
      },
      {
        title: "U-Net Spatial Denoiser with Polarized Self-Attention (PSA)",
        language: "python",
        code: `class PolarizedSelfAttention(nn.Module):
    def __init__(self, channel: int):
        super().__init__()
        self.ch_wv = nn.Conv2d(channel, channel // 2, kernel_size=1)
        self.ch_wq = nn.Conv2d(channel, 1, kernel_size=1)
        self.sp_wv = nn.Conv2d(channel, channel // 2, kernel_size=1)
        self.sp_wq = nn.Conv2d(channel, channel, kernel_size=1)
        self.softmax = nn.Softmax(dim=-1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        b, c, h, w = x.size()
        # Channel-only self-attention branch
        ch_q = self.ch_wq(x).view(b, 1, -1)
        ch_v = self.ch_wv(x).view(b, c // 2, -1)
        ch_attn = torch.matmul(ch_v, self.softmax(ch_q).transpose(-1, -2)).view(b, c // 2, 1, 1)
        ch_out = torch.sigmoid(ch_attn) * x

        # Spatial-only self-attention branch
        sp_q = self.sp_wq(x).view(b, c, -1)
        sp_v = self.sp_wv(x).view(b, c // 2, -1)
        sp_attn = torch.matmul(self.softmax(sp_q).transpose(-1, -2), sp_v).view(b, 1, h, w)
        sp_out = self.sigmoid(sp_attn) * x

        return ch_out + sp_out

# Loss function: Charbonnier + Perceptual + GAN composite objective
def composite_unet_loss(y_pred, y_true, perceptual_loss, gan_loss):
    charbonnier = torch.mean(torch.sqrt((y_pred - y_true) ** 2 + 1e-6))
    return 0.5 * charbonnier + 0.3 * perceptual_loss + 0.2 * gan_loss`,
      },
      {
        title: "AdaCLIP-D Forward Execution & Gradient-Controlled Preservation",
        language: "python",
        code: `def forward_adaclip_d(noisy_image: torch.Tensor, sigma_input: float) -> torch.Tensor:
    # Stage 1: Spatial Image Denoising via U-Net (D1)
    denoised_image = unet_denoiser(noisy_image)

    # Enforce bounded residual noise: ||epsilon||_2 <= 0.1 * sigma_input
    residual = denoised_image - noisy_image
    residual_norm = torch.norm(residual, p=2, dim=[1,2,3], keepdim=True)
    max_norm = 0.1 * sigma_input
    residual = torch.where(residual_norm > max_norm, residual * (max_norm / residual_norm), residual)
    denoised_image = noisy_image + residual

    # Stage 2: In-ViT Feature Denoising with Stop-Gradient
    tokens = clip_vit.patch_embed(denoised_image)
    for i, block in enumerate(clip_vit.blocks):
        tokens = block(tokens)
        if i + 1 in [4, 8, 12]:  # Insert DnCNN modules at depths 4, 8, 12
            feat_map = tokens_to_grid(tokens)
            denoised_feat = dncnn_modules[i](feat_map)
            denoised_tokens = grid_to_tokens(denoised_feat)

            # Apply Noise-Aware Adaptive Patch Gating
            tokens = patch_gating(tokens, denoised_tokens)

            # Reduce gradient flow by 30% to preserve anomaly features
            tokens = 0.7 * tokens + 0.3 * tokens.detach()

    # Stage 3: Hybrid Semantic Fusion & Anomaly Map Calculation
    anomaly_map = adaclip_head(tokens, prompt_embeddings)
    return anomaly_map`,
      },
    ],
    gallery: [{ src: simDocs, caption: "AdaCLIP-D multi-stage hybrid denoising architecture and anomaly localization map" }],
    results: [
      { label: "VisA Image-F1 Gain", value: "83.44 → 88.25" },
      { label: "MVTec AD Pixel-AUROC", value: "96.88%" },
      { label: "Gaussian Noise (σ=50)", value: "Robust Restoration" },
      { label: "DnCNN ViT Depths", value: "Depths 4, 8, 12" },
    ],
  },
};
