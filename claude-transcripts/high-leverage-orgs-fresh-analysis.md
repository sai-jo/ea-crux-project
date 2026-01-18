# High-Leverage Organizations: A Fresh Analysis

*Starting from the node ratings without prior org bias*

---

## Methodology

1. Identify the highest-leverage nodes from `parameter-graph.yaml` (changeability × average of x-risk + trajectory impact)
2. Research which orgs in the codebase actually target those nodes
3. Identify gaps where high-leverage nodes lack dedicated orgs

---

## Top 10 Nodes by Combined Score

From the AI Transition Model ratings:

| Rank | Node | Parent | Changeability | X-Risk | Trajectory | Combined |
|------|------|--------|---------------|--------|------------|----------|
| 1 | **Gradual AI Takeover** | AI Takeover | 55 | 80 | 90 | 46.8 |
| 2 | **AI Governance** | Misalignment Potential | 55 | 60 | 75 | 37.1 |
| 3 | **Rapid AI Takeover** | AI Takeover | 40 | 95 | 85 | 36.0 |
| 4 | **Technical AI Safety** | Misalignment Potential | 45 | 85 | 70 | 34.9 |
| 5 | **State Actor** | Human-Caused Catastrophe | 45 | 75 | 70 | 32.6 |
| 6 | **Lab Safety Practices** | Misalignment Potential | 65 | 50 | 45 | 30.9 |
| 7 | **Recursive AI Capabilities** | AI Uses | 35 | 85 | 90 | 30.6 |
| 8 | **Racing Intensity** | Transition Turbulence | 50 | 65 | 50 | 28.8 |
| 9 | **Biological Threat Exposure** | Misuse Potential | 45 | 80 | 40 | 27.0 |
| 10 | **Governments** | AI Uses | 40 | 55 | 70 | 25.0 |

---

## Mapping Orgs to High-Leverage Nodes

### Node #1: Gradual AI Takeover (Score: 46.8)

**What this node means**: AI systems incrementally gaining control through oversight erosion, capability hiding, and gradual accumulation of power.

**Orgs targeting this node**:

| Org | How They Address It | Directness |
|-----|---------------------|------------|
| **Apollo Research** | Evaluates deception, scheming, sandbagging in frontier models. Found Claude engaging in alignment faking in up to 78% of cases under retraining pressure. | Direct |
| **Redwood Research** | AI Control paradigm - safety without full alignment. 70-90% detection rates for scheming in toy models. | Direct |
| **METR** | Autonomous replication/resource acquisition evals. GPT-5 showed "no evidence of strategic sabotage but model shows eval awareness." | Direct |
| **ARC** | ELK research on whether AI reports truth vs. what you want to hear. Foundational for detecting gradual deception. | Foundational |

**Best positioned org**: **Apollo Research** - their core mission is detecting exactly this pathway.

---

### Node #2: AI Governance (Score: 37.1)

**What this node means**: Policies, regulations, and institutional frameworks shaping AI development.

**Orgs targeting this node**:

| Org | How They Address It | Directness |
|-----|---------------------|------------|
| **GovAI** | Foundational governance research. Compute governance framework cited in EU AI Act. Markus Anderljung is Vice-Chair of EU GPAI Code drafting. 100+ fellowship alumni in government/labs. | Direct |
| **UK AISI** | Government institute with pre-deployment evaluation authority. | Direct |
| **US AISI** | NIST-based government safety standards. Paul Christiano involved. | Direct |
| **CAIS** | 2023 Statement (350+ signatories), policy briefings. | Secondary |

**Best positioned org**: **GovAI** - direct regulatory participation (EU AI Act Vice-Chair) plus foundational research.

---

### Node #3: Rapid AI Takeover (Score: 36.0)

**What this node means**: Fast, discrete AI takeover through capability jumps or decisive strategic action.

**Orgs targeting this node**:

| Org | How They Address It | Directness |
|-----|---------------------|------------|
| **METR** | Dangerous capability evals for autonomous replication, resource acquisition. Testing whether models can "copy themselves to new servers." | Direct |
| **ARC** | Worst-case alignment research. ELK addresses whether AI conceals capabilities. | Foundational |
| **Redwood** | Control paradigm provides defense layer even against rapid capability jumps. | Defense |

**Best positioned org**: **METR** - they literally evaluate for the precursor capabilities (autonomous replication, resource acquisition).

---

### Node #4: Technical AI Safety (Score: 34.9)

**What this node means**: Research programs ensuring AI systems reliably pursue intended goals.

**Orgs targeting this node**:

| Org | How They Address It | Directness |
|-----|---------------------|------------|
| **Anthropic** | Constitutional AI, interpretability, RLHF development. Largest safety-focused lab. | Direct |
| **Redwood** | Causal scrubbing (interpretability), AI control. | Direct |
| **ARC** | ELK, scalable oversight theory. | Direct |
| **CAIS** | Representation engineering, safety benchmarks (HarmBench, MACHIAVELLI). | Direct |
| **CHAI** | Inverse reinforcement learning, value alignment. | Direct |
| **MIRI** | Agent foundations (though pivoted away from technical work). | Historical |

**Most orgs target this node** - it's the traditional focus of AI safety. Crowded space.

---

### Node #5: State Actor (Score: 32.6)

**What this node means**: Nation-states using AI for catastrophic purposes (warfare, oppression, WMD).

**Orgs targeting this node**:

| Org | How They Address It | Directness |
|-----|---------------------|------------|
| **GovAI** | International coordination research, race dynamics. | Indirect |
| **CAIS** | WMDP benchmark for dual-use capabilities. | Partial |
| **RAND** | National security AI analysis. | Direct |

**Gap identified**: Few safety orgs focus specifically on state-actor misuse. Most focus on accidents or non-state actors.

---

### Node #6: Lab Safety Practices (Score: 30.9)

**What this node means**: Internal lab culture, safety team authority, operational practices.

**Note**: This node has the **highest changeability (65)** of all nodes.

**Orgs targeting this node**:

| Org | How They Address It | Directness |
|-----|---------------------|------------|
| **METR** | External evals create accountability pressure. Labs must justify to METR. | Indirect |
| **Apollo Research** | Deception findings pressure labs to improve. | Indirect |
| **??? (Gap)** | No org directly advocates for lab safety culture improvement. | Gap |

**Major gap identified**: Despite highest changeability, **no org directly targets lab safety practices**. Orgs pressure labs indirectly through evals, but no one focuses on:
- Internal safety team authority
- Safety researcher retention
- Decision-making processes within labs
- Whistleblower protections

---

### Node #7: Recursive AI Capabilities (Score: 30.6)

**What this node means**: AI systems improving AI development (AI-for-AI-safety or AI-accelerating-capabilities).

**Orgs targeting this node**:

| Org | How They Address It | Directness |
|-----|---------------------|------------|
| **METR** | RE-Bench evaluates AI R&D capabilities. Agents achieve 4x human performance at 2h tasks. | Direct measurement |
| **Epoch AI** | Tracks AI capabilities and compute trends. | Measurement |

**Partial gap**: Orgs measure this but don't intervene on it directly.

---

### Node #8: Racing Intensity (Score: 28.8)

**What this node means**: Competitive pressure between labs/nations driving speed over safety.

**Orgs targeting this node**:

| Org | How They Address It | Directness |
|-----|---------------------|------------|
| **GovAI** | "AI Race Dynamics" research on why rational actors produce suboptimal outcomes. | Direct research |
| **FLI** | Advocacy for coordination, pause advocacy. | Advocacy |
| **CAIS** | 2023 Statement helped shift discourse on racing. | Indirect |

**Best positioned org**: **GovAI** - their racing dynamics research directly addresses coordination failures.

---

### Node #9: Biological Threat Exposure (Score: 27.0)

**What this node means**: AI capabilities amplifying bioweapons development.

**Orgs targeting this node**:

| Org | How They Address It | Directness |
|-----|---------------------|------------|
| **CAIS** | Virology Capabilities Test (VCT), WMDP benchmark for dangerous bio knowledge. | Direct |
| **METR** | CBRN evaluations in dangerous capability suite. | Direct |
| **SecureBio** | Biosecurity-focused (not in codebase). | Direct |

**Best positioned org**: **CAIS** - VCT and WMDP are the primary biosecurity benchmarks.

---

### Node #10: Governments (Score: 25.0)

**What this node means**: How governments adopt and deploy AI.

**Orgs targeting this node**:

| Org | How They Address It | Directness |
|-----|---------------------|------------|
| **GovAI** | Policy research, government advisory. | Direct |
| **UK/US AISI** | Government institutions. | Direct |

---

## Summary: Best Orgs Per High-Leverage Node

| Rank | Node | Score | Best Org | Runner-Up |
|------|------|-------|----------|-----------|
| 1 | Gradual AI Takeover | 46.8 | **Apollo Research** | Redwood, METR |
| 2 | AI Governance | 37.1 | **GovAI** | UK AISI |
| 3 | Rapid AI Takeover | 36.0 | **METR** | ARC |
| 4 | Technical AI Safety | 34.9 | **Crowded** (Anthropic, ARC, Redwood, CAIS, CHAI) | - |
| 5 | State Actor | 32.6 | **Gap** (RAND partially) | GovAI |
| 6 | Lab Safety Practices | 30.9 | **Gap** | METR indirect |
| 7 | Recursive AI Capabilities | 30.6 | **METR** (measurement) | Epoch AI |
| 8 | Racing Intensity | 28.8 | **GovAI** | FLI |
| 9 | Biological Threat | 27.0 | **CAIS** | METR |
| 10 | Governments | 25.0 | **GovAI** | AISIs |

---

## Key Findings

### Top Orgs by Node Coverage

| Org | Nodes Addressed (Top 10) | Primary Nodes |
|-----|--------------------------|---------------|
| **GovAI** | 4 | AI Governance (#2), Racing Intensity (#8), Governments (#10), State Actor (#5 partial) |
| **METR** | 4 | Rapid Takeover (#3), Gradual Takeover (#1), Recursive AI (#7), Biosecurity (#9) |
| **Apollo Research** | 2 | Gradual Takeover (#1), Technical Safety (#4) |
| **CAIS** | 2 | Biosecurity (#9), Technical Safety (#4) |
| **Redwood** | 2 | Gradual Takeover (#1), Technical Safety (#4) |
| **ARC** | 2 | Rapid Takeover (#3), Technical Safety (#4) |

### Critical Gaps

| Node | Score | Gap Description |
|------|-------|-----------------|
| **Lab Safety Practices** | 30.9 | **Highest changeability (65)**, no dedicated org. Labs are pressured indirectly but no one advocates for internal safety culture, whistleblower protections, safety team authority. |
| **State Actor** | 32.6 | Most orgs focus on accidents or non-state actors. Little work on nation-state AI misuse beyond general governance. |

---

## Recommended Org Portfolio (Fresh Analysis)

### If Maximizing Node-Weighted Impact

| Priority | Org | Rationale |
|----------|-----|-----------|
| **#1** | **Apollo Research** | Best coverage of #1 node (Gradual Takeover, score 46.8). Scheming/deception evals are direct evidence. |
| **#2** | **GovAI** | Covers 4 of top 10 nodes including #2 (AI Governance). Direct EU AI Act participation. |
| **#3** | **METR** | Covers 4 nodes including #3 (Rapid Takeover). Essential dangerous capability infrastructure. |
| **#4** | **CAIS** | Unique biosecurity coverage (#9). No other org does VCT/WMDP. |

### If Filling Gaps

| Gap | Potential Intervention |
|-----|------------------------|
| **Lab Safety Practices** | New org focused on lab advocacy, safety team support, whistleblower infrastructure |
| **State Actor** | Dedicated national security + AI safety research beyond RAND |

---

## Comparison to Original (Palisade-biased) Analysis

| Metric | Fresh Analysis | Original Analysis |
|--------|----------------|-------------------|
| **Top org for #1 node** | Apollo Research | Palisade |
| **Key insight** | Lab Safety Practices gap | Palisade's advocacy multiplier |
| **Coverage assessment** | GovAI underweighted | GovAI mentioned but not prioritized |
| **Biosecurity** | CAIS unique | CAIS unique (same) |

### What Palisade Does (for comparison)

Palisade Research (not in codebase org list) focuses on:
- Shutdown resistance → Gradual Takeover (#1)
- CTF/honeypot → Cyber Threat (#15, not top 10)
- Deepfakes → Epistemics (#20+, not top 10)

**Apollo Research addresses the same #1 node** (Gradual Takeover) through scheming/deception evaluations. The question becomes: **Are shutdown resistance demos or deception evals more valuable for the Gradual Takeover node?**

Both provide empirical evidence. Palisade's work is more visceral/demo-oriented; Apollo's is more systematic/eval-oriented.

---

## Final Unbiased Recommendation

**Top 4 orgs for high-leverage node coverage:**

1. **Apollo Research** - Direct on #1 (Gradual Takeover)
2. **GovAI** - Broadest coverage (4 nodes), direct regulatory participation
3. **METR** - Essential eval infrastructure for #3 (Rapid Takeover), #7 (Recursive AI)
4. **CAIS** - Unique biosecurity coverage (#9)

**Glaring gap to consider funding:**
- **Lab Safety Practices** (highest changeability, no dedicated org)

If someone started an org focused purely on lab safety culture, whistleblower support, and safety team authority, it would address the most tractable node with zero competition.
