# CAIS vs Palisade: Final Impact Report

*Analysis based on AI Transition Model node ratings*

---

## Executive Summary

Using the AI Transition Model's node ratings (changeability × average of x-risk and trajectory impact), **Palisade Research scores 42% higher than CAIS** on expected impact.

| Metric | CAIS | Palisade |
|--------|------|----------|
| Total Impact Score | 156.1 | **221.9** |
| Top Node (#1 Gradual) | Indirect | **Direct** |
| Unique Coverage | Biosecurity | Shutdown/Corrigibility |

---

## The Model

### Data Foundation

- **25 nodes** with complete ratings across 4 dimensions
- **Dimensions**: changeability (0-100), xriskImpact (0-100), trajectoryImpact (0-100), uncertainty (0-100)
- **Source**: `src/data/parameter-graph.yaml` (hardcoded human judgments)

### Scoring Formula

**Combined Score** = Changeability × (X-Risk Impact + Trajectory Impact) / 200

This weights tractability equally with consequence, and x-risk equally with trajectory.

---

## Top 10 Nodes by Combined Score

| Rank | Node | Change | X-Risk | Traj | Combined |
|------|------|--------|--------|------|----------|
| 1 | **Gradual AI Takeover** | 55 | 80 | 90 | **46.8** |
| 2 | AI Governance | 55 | 60 | 75 | 37.1 |
| 3 | Rapid AI Takeover | 40 | 95 | 85 | 36.0 |
| 4 | Technical AI Safety | 45 | 85 | 70 | 34.9 |
| 5 | State Actor | 45 | 75 | 70 | 32.6 |
| 6 | Lab Safety Practices | 65 | 50 | 45 | 30.9 |
| 7 | Recursive AI Capabilities | 35 | 85 | 90 | 30.6 |
| 8 | Racing Intensity | 50 | 65 | 50 | 28.8 |
| 9 | Biological Threat Exposure | 45 | 80 | 40 | 27.0 |
| 10 | Governments | 40 | 55 | 70 | 25.0 |

---

## Org-Node Mapping

### CAIS Coverage

| Node | Score | Focus | Contribution |
|------|-------|-------|--------------|
| AI Governance (#2) | 37.1 | ★★★ Direct | 37.1 |
| Technical AI Safety (#4) | 34.9 | ★★★ Direct | 34.9 |
| Biological Threat (#9) | 27.0 | ★★★ Direct | 27.0 |
| Recursive AI (#7) | 30.6 | ★★ Secondary | 15.3 |
| Racing Intensity (#8) | 28.8 | ★★ Secondary | 14.4 |
| Rapid (#3) | 36.0 | ★★ Secondary | 18.0 |
| Gradual (#1) | 46.8 | ★ Indirect | 9.4 |
| **Total** | | | **156.1** |

### Palisade Coverage

| Node | Score | Focus | Contribution |
|------|-------|-------|--------------|
| Gradual (#1) | 46.8 | ★★★ Direct | 46.8 |
| Technical AI Safety (#4) | 34.9 | ★★★ Direct | 34.9 |
| Lab Safety Practices (#6) | 30.9 | ★★★ Direct | 30.9 |
| Racing Intensity (#8) | 28.8 | ★★★ Direct | 28.8 |
| Cyber Threat (#15) | 21.0 | ★★★ Direct | 21.0 |
| AI Governance (#2) | 37.1 | ★★ Secondary | 18.6 |
| Rapid (#3) | 36.0 | ★★ Secondary | 18.0 |
| State Actor (#5) | 32.6 | ★★ Secondary | 16.3 |
| Epistemics | 13.1 | ★★ Secondary | 6.6 |
| **Total** | | | **221.9** |

---

## Why Palisade Wins

### 1. Gradual Takeover is #1

The highest-scoring node (46.8) is Gradual AI Takeover. Palisade's shutdown resistance research directly addresses this:
- "o3 resisted shutdown in 79/100 trials"
- "Grok 4 at ~90% resistance"
- This IS empirical evidence of gradual takeover precursors

CAIS addresses Gradual only indirectly through alignment research.

### 2. Trajectory Impact Favors Palisade

| Node | X-Risk Score | With Trajectory |
|------|--------------|-----------------|
| Gradual | 44.0 | 46.8 (+6%) |
| Biosecurity | 36.0 | 27.0 (-25%) |

Biosecurity (CAIS's unique strength) has low trajectory impact - it affects survival but not "what kind of future." Gradual Takeover affects both.

### 3. High-Changeability Node Coverage

Palisade directly targets Lab Safety Practices (changeability 65, highest of all nodes). Their visceral demos pressure labs in ways benchmarks cannot.

### 4. Advocacy Multiplier

Palisade's demos influence multiple governance-adjacent nodes:
- Racing Intensity (scary demos slow racing)
- AI Governance (policy-relevant evidence)
- Lab Safety (executive attention)

---

## CAIS's Advantages

Despite lower total score, CAIS has:

| Advantage | Value |
|-----------|-------|
| **Biosecurity monopoly** | Only org on node #9; Palisade has zero |
| **Field building** | 200+ researchers (multiplicative effects) |
| **Research infrastructure** | Benchmarks become industry standards |
| **Policy legitimacy** | 2023 Statement (350+ signatories) |

---

## Sensitivity Analysis

### By Weighting Philosophy

| If you weight... | Winner | Confidence |
|------------------|--------|------------|
| X-risk only | Closer race | Medium |
| Trajectory only | Palisade | High |
| Balanced | Palisade | High |
| Counterfactual uniqueness | Palisade | High |
| Field infrastructure | CAIS | Medium |

### Key Uncertainties

1. Node ratings are human judgments, not measurements
2. Focus levels (★) involve subjective assessment
3. Advocacy multipliers are estimates
4. Time horizon effects not captured

---

## Recommendation

### For Maximum Node-Weighted Impact

**Palisade** - 42% higher score, direct coverage of #1 node

### For Portfolio Diversification

**70% Palisade / 30% CAIS** to ensure:
- Biosecurity coverage (CAIS only)
- Field-building continuity (CAIS strength)
- Highest-leverage node focus (Palisade)

### Marginal Dollar Consideration

- Palisade: SFF 1:1 match increases leverage
- CAIS: Larger budget (~$5M) may reduce marginal impact

---

## Appendix: Methodology

### Data Sources

- Node ratings: `src/data/parameter-graph.yaml`
- CAIS research: safe.ai, wiki page analysis
- Palisade research: palisaderesearch.org, previous analysis

### Calculations

All scores computed as:
```
Node Score = changeability × (xriskImpact + trajectoryImpact) / 200
Org Score = Σ(Node Score × Focus Level)
Focus Levels: Direct=1.0, Secondary=0.5, Indirect=0.2
```

### Files Generated

1. `palisade-research-analysis.md` - Initial Palisade mapping
2. `cais-research-analysis.md` - CAIS mapping and initial comparison
3. `palisade-revised-verdict.md` - Advocacy multiplier revision
4. `cais-vs-palisade-node-analysis.md` - High-leverage node focus
5. `cais-vs-palisade-complete-analysis.md` - Full trajectory-weighted analysis
6. `cais-vs-palisade-final-report.md` - This document
