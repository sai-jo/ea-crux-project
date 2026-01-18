# CAIS vs Palisade: Complete Impact Analysis

*Including trajectory impact weighting and full node coverage analysis*

---

## Node Rating Coverage

### Summary Statistics

| Metric | Count |
|--------|-------|
| **Parent nodes** (top-level categories) | 12 |
| **Sub-items** (ratable nodes) | 31 |
| **Nodes with complete ratings** | 25 (80.6%) |
| **Nodes missing ratings** | 6 |

### Rating Dimensions

All 25 rated nodes have values for all 4 dimensions:

| Dimension | Scale | Description |
|-----------|-------|-------------|
| **changeability** | 0-100 | How tractable/malleable (higher = easier to influence) |
| **xriskImpact** | 0-100 | Direct existential risk impact (higher = more extinction risk) |
| **trajectoryImpact** | 0-100 | Long-term welfare effects (higher = shapes future more) |
| **uncertainty** | 0-100 | How uncertain our knowledge is (higher = less certain) |

### Missing Ratings

6 nodes lack ratings entirely:
- Compute (AI Capabilities)
- 5 Long-term Lock-in sub-items (parsing issue in YAML)

---

## All 25 Rated Nodes

| Node | Changeability | X-Risk | Trajectory | Uncertainty |
|------|---------------|--------|------------|-------------|
| Lab Safety Practices | 65 | 50 | 45 | 40 |
| AI Governance | 55 | 60 | 75 | 50 |
| Gradual | 55 | 80 | 90 | 60 |
| Racing Intensity | 50 | 65 | 50 | 45 |
| Technical AI Safety | 45 | 85 | 70 | 60 |
| State Actor | 45 | 75 | 70 | 55 |
| Biological Threat Exposure | 45 | 80 | 40 | 60 |
| Coordination | 45 | 40 | 65 | 55 |
| Rapid | 40 | 95 | 85 | 70 |
| Governments | 40 | 55 | 70 | 50 |
| Adoption | 40 | 45 | 70 | 40 |
| Robot Threat Exposure | 40 | 60 | 50 | 65 |
| Economic Stability | 40 | 35 | 55 | 50 |
| Recursive AI Capabilities | 35 | 85 | 90 | 70 |
| Governance | 35 | 55 | 70 | 45 |
| Companies | 35 | 50 | 70 | 45 |
| Rogue Actor | 35 | 70 | 45 | 65 |
| Cyber Threat Exposure | 35 | 55 | 45 | 50 |
| Industries | 30 | 30 | 75 | 35 |
| Adaptability | 30 | 50 | 60 | 50 |
| Shareholders | 30 | 25 | 60 | 40 |
| Countries | 25 | 45 | 65 | 50 |
| Epistemics | 25 | 40 | 65 | 55 |
| Algorithms | 20 | 75 | 85 | 55 |
| Surprise Threat Exposure | 20 | 70 | 55 | 85 |

---

## Combined Impact Scores

### Scoring Formula

Three ways to combine changeability with impact:

1. **C × X-Risk**: `changeability × xriskImpact / 100` (extinction-focused)
2. **C × Trajectory**: `changeability × trajectoryImpact / 100` (future-quality-focused)
3. **C × Average**: `changeability × (xriskImpact + trajectoryImpact) / 200` (balanced)

### Top 15 Nodes by Combined Score

| Rank | Node | C×X-Risk | C×Trajectory | C×Average |
|------|------|----------|--------------|-----------|
| 1 | **Gradual** | 44.0 | **49.5** | **46.8** |
| 2 | **AI Governance** | 33.0 | 41.2 | 37.1 |
| 3 | Rapid | 38.0 | 34.0 | 36.0 |
| 4 | **Technical AI Safety** | **38.2** | 31.5 | 34.9 |
| 5 | State Actor | 33.8 | 31.5 | 32.6 |
| 6 | Lab Safety Practices | 32.5 | 29.2 | 30.9 |
| 7 | Recursive AI Capabilities | 29.8 | 31.5 | 30.6 |
| 8 | Racing Intensity | 32.5 | 25.0 | 28.8 |
| 9 | **Biological Threat Exposure** | **36.0** | 18.0 | 27.0 |
| 10 | Governments | 22.0 | 28.0 | 25.0 |
| 11 | Coordination | 18.0 | 29.2 | 23.6 |
| 12 | Adoption | 18.0 | 28.0 | 23.0 |
| 13 | Robot Threat Exposure | 24.0 | 20.0 | 22.0 |
| 14 | Governance | 19.2 | 24.5 | 21.9 |
| 15 | Companies | 17.5 | 24.5 | 21.0 |

### Key Insight

**Gradual AI Takeover dominates all three metrics**:
- Highest C×Trajectory (49.5)
- Highest C×Average (46.8)
- Second-highest C×X-Risk (44.0, after Rapid's 38.0 but Rapid has lower changeability)

---

## CAIS vs Palisade: Node Targeting

### Direct Node Coverage

| Node | C×Avg Score | CAIS | Palisade |
|------|-------------|------|----------|
| Gradual (46.8) | #1 | ★ Indirect | ★★★ Direct (shutdown resistance) |
| AI Governance (37.1) | #2 | ★★★ Direct (Statement, policy) | ★★ Indirect (demos inform policy) |
| Rapid (36.0) | #3 | ★★ Indirect | ★★ Indirect (shutdown applies) |
| Technical AI Safety (34.9) | #4 | ★★★ Direct (benchmarks, RepEng) | ★★★ Direct (red-teaming) |
| State Actor (32.6) | #5 | ★ Minor | ★★ (cyber/bio demos) |
| Lab Safety Practices (30.9) | #6 | ★ Minor | ★★★ Direct (demos pressure labs) |
| Recursive AI Capabilities (30.6) | #7 | ★★ (capability tracking) | ★ Minor |
| Racing Intensity (28.8) | #8 | ★★ (Statement effect) | ★★★ (scary demos slow racing) |
| Biological Threat Exposure (27.0) | #9 | ★★★ Direct (VCT, WMDP) | - None |
| Cyber Threat Exposure (21.0) | #15 | ★ Minor | ★★★ Direct (CTF, honeypot) |

---

## Revised Impact Calculation

### Method

**Score** = Σ (C×Average Score × Focus Level)

Where Focus Level:
- ★★★ Direct = 1.0
- ★★ Indirect/Secondary = 0.5
- ★ Minor = 0.2

### CAIS Impact Score

| Node | C×Avg | Focus | Contribution |
|------|-------|-------|--------------|
| AI Governance | 37.1 | 1.0 | 37.1 |
| Technical AI Safety | 34.9 | 1.0 | 34.9 |
| Biological Threat Exposure | 27.0 | 1.0 | 27.0 |
| Recursive AI Capabilities | 30.6 | 0.5 | 15.3 |
| Racing Intensity | 28.8 | 0.5 | 14.4 |
| Rapid | 36.0 | 0.5 | 18.0 |
| Gradual | 46.8 | 0.2 | 9.4 |
| **Total** | | | **156.1** |

### Palisade Impact Score

| Node | C×Avg | Focus | Contribution |
|------|-------|-------|--------------|
| Gradual | 46.8 | 1.0 | 46.8 |
| Technical AI Safety | 34.9 | 1.0 | 34.9 |
| Lab Safety Practices | 30.9 | 1.0 | 30.9 |
| Racing Intensity | 28.8 | 1.0 | 28.8 |
| Cyber Threat Exposure | 21.0 | 1.0 | 21.0 |
| AI Governance | 37.1 | 0.5 | 18.6 |
| Rapid | 36.0 | 0.5 | 18.0 |
| State Actor | 32.6 | 0.5 | 16.3 |
| Epistemics (deepfakes) | 13.1 | 0.5 | 6.6 |
| **Total** | | | **221.9** |

---

## Final Comparison

### Summary Scores

| Metric | CAIS | Palisade | Winner |
|--------|------|----------|--------|
| **Total Impact Score** | 156.1 | **221.9** | Palisade (+42%) |
| **Top node coverage** (#1 Gradual) | Indirect | **Direct** | Palisade |
| **Unique high-value node** | Biosecurity (#9) | Gradual (#1) | Palisade |
| **Breadth** (nodes at ★★+) | 6 | 8 | Palisade |

### By Weighting Philosophy

| If you weight... | Winner | Margin |
|------------------|--------|--------|
| X-risk only | CAIS (biosecurity) | Slight |
| Trajectory only | **Palisade** | Large (Gradual = 49.5) |
| Balanced (average) | **Palisade** | +42% |

### Strategic Position

```
                    IMPACT SCORE BREAKDOWN

    CAIS (156.1)                    Palisade (221.9)
    ────────────                    ────────────────
    ████████████░░░░░░░░            ████████████████████

    Top Contributors:               Top Contributors:
    1. AI Governance (37.1)         1. Gradual (46.8)
    2. Technical Safety (34.9)      2. Technical Safety (34.9)
    3. Biosecurity (27.0)           3. Lab Safety (30.9)
    4. Rapid indirect (18.0)        4. Racing Intensity (28.8)
    5. Recursive AI (15.3)          5. Cyber (21.0)
```

---

## Why Palisade Wins on Combined Metrics

### 1. Gradual Takeover Dominance

The #1 node by combined score (46.8) is Gradual AI Takeover. Palisade's shutdown resistance research is the **only empirical evidence** that this pathway is already emerging in current models. CAIS's alignment research addresses this indirectly at best.

### 2. Trajectory Impact Matters

When trajectory is weighted equally with x-risk:
- Gradual's score jumps from 44.0 (x-risk only) to 46.8 (average)
- Biosecurity drops from 36.0 to 27.0 (low trajectory impact)

This reflects that Gradual Takeover doesn't just affect survival—it determines **what kind of future we get**.

### 3. Lab Pressure Multiplier

Palisade directly targets Lab Safety Practices (#6, score 30.9)—the **highest-changeability node** (65). Their demos create pressure that benchmarks can't:
- "o3 resisted shutdown in 79/100 trials" → executive attention
- CAIS benchmark adoption → researcher attention

### 4. Racing Intensity Leverage

Palisade's scary demos directly affect Racing Intensity (#8, score 28.8). The mechanism: visceral evidence of danger slows the race more than academic papers.

---

## CAIS's Comparative Advantage

Despite lower total score, CAIS wins on:

| Advantage | Explanation |
|-----------|-------------|
| **Biosecurity (#9)** | Only org addressing this node; Palisade has zero coverage |
| **Field building** | 200+ researchers creates multiplicative effects not captured in node targeting |
| **Research infrastructure** | Benchmarks become industry standards; durable contribution |
| **Governance legitimacy** | 2023 Statement gives CAIS unique credibility with policymakers |

---

## Conclusion

### Quantitative Verdict

**Palisade has 42% higher impact score** when weighting changeability × average(x-risk, trajectory).

### Qualitative Verdict

| Priority | Choose |
|----------|--------|
| Maximize node-weighted impact | **Palisade** |
| Biosecurity specifically | **CAIS** |
| Long-term field infrastructure | **CAIS** |
| Near-term policy influence via demos | **Palisade** |
| Corrigibility/shutdown evidence | **Palisade** |
| Lab pressure via demonstrations | **Palisade** |

### Portfolio Recommendation

Optimal allocation depends on beliefs about:
1. **Trajectory vs. x-risk weighting** → Higher trajectory weight favors Palisade
2. **Counterfactual value** → Palisade's work is more unique
3. **Time horizon** → CAIS's field-building compounds over decades
4. **Marginal dollar leverage** → Palisade's SFF match increases marginal impact

A **70/30 split favoring Palisade** seems justified by the node analysis, with CAIS allocation ensuring biosecurity coverage and field-building continuity.

---

## Appendix: Methodology Notes

### Limitations

1. **Ratings are human judgments** - not measured quantities
2. **Focus levels (★) are subjective** - different analysts might assign differently
3. **Indirect effects hard to quantify** - advocacy multipliers are estimates
4. **Missing nodes** - 6 nodes lack ratings, including Compute
5. **Dynamic interactions** - model assumes independent contributions

### Data Sources

- Node ratings: `src/data/parameter-graph.yaml`
- CAIS research: `safe.ai/work/research`, existing wiki page
- Palisade research: `palisaderesearch.org`, previous analysis

### Reproducibility

All calculations can be reproduced from the 25-node rating table using the formulas specified.
