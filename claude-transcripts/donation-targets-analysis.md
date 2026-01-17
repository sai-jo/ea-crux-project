# AI Safety Donation Targets: Comparative Analysis

*Analysis generated from ea-crux-project wiki master causal graph*

---

## Executive Summary

Based on the AI Transition Model master graph, this analysis identifies 3 alternative high-value donation targets that complement Palisade Research by addressing different causal pathways to existential risk.

**Bottom line:** If Palisade's SFF 1:1 match is still open, it likely offers the highest marginal impact due to the match alone. The alternatives below are valuable for portfolio diversification across the causal model.

---

## Comparison Table

| Organization | Primary Graph Nodes | Theory of Change | Overlap with Palisade |
|-------------|---------------------|------------------|----------------------|
| **Palisade Research** | `deceptive-alignment`, `dangerous-capability-evals`, `autonomous-hacking` | Empirical red-teaming produces policy-actionable evidence | Baseline |
| **Redwood Research** | `alignment-robustness`, `scalable-oversight`, `safety-talent` | Build defenses that work even assuming misalignment | Low - solutions vs. problem demos |
| **Center for AI Safety (CAIS)** | `safety-funding`, `safety-talent`, `regulatory-capacity` | Field-building multiplies all safety work | Low - upstream enabler |
| **GovAI (Oxford)** | `international-coordination`, `regulatory-capacity`, `deployment-safeguards` | Governance research shapes policy | Low - different intervention type |

---

## 1. Redwood Research

**What they do:** Applied alignment research focused on the "AI Control" methodology—building safety guarantees that work even if the AI is misaligned.

**Website:** https://redwoodresearch.org

**Funding:** ~$8M/year | **Size:** ~25 employees

### Graph Nodes Targeted

- `alignment-robustness` (direct)
- `control-methodology-adoption` (direct)
- `scalable-oversight` (supports)
- `safety-talent` (via ARENA program)

### Benefits

| Benefit | Rationale |
|---------|-----------|
| **Solutions-focused** | Where Palisade demonstrates problems (shutdown resistance), Redwood builds defenses that assume the problem exists |
| **High-leverage methodology** | AI Control doesn't require solving alignment—works with adversarial assumptions |
| **Talent pipeline** | ARENA program trains ~100+ researchers/year, addressing the "~300-500 FTE globally" safety talent bottleneck |
| **Lab influence** | Their work has been adopted by Anthropic; Buck Shlegeris now leads Anthropic's safety work |

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Control may not scale to superintelligence | Medium | But provides time buffer for harder alignment work |
| Already well-funded (~$8M/year) | Low | Still room-limited; marginal donations useful |
| Anthropic absorption risk | Medium | Core research continues; ARENA independent |

### Causal Position

Addresses the *response* to problems Palisade identifies. If shutdown resistance is real, AI Control provides a defense layer.

---

## 2. Center for AI Safety (CAIS)

**What they do:** Research org + field-builder. Runs compute grants, policy research, and advocacy. Led by Dan Hendrycks (representation engineering).

**Website:** https://safe.ai

**Funding:** Not public | **Size:** ~20-30 employees

### Graph Nodes Targeted

- `safety-funding` (direct—redistributes compute)
- `safety-talent` (direct—field-building programs)
- `regulatory-capacity` (policy research)
- `expert-policy-influence` (advocacy)

### Benefits

| Benefit | Rationale |
|---------|-----------|
| **Multiplier effect** | Funding CAIS enables dozens of other researchers via compute grants |
| **Policy access** | Published influential AI risk statement (signed by Hinton, Bengio, Hassabis) |
| **Technical research** | Representation engineering has practical safety applications |
| **Mainstream legitimacy** | Helps make AI safety concerns legible to policymakers and public |

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Advocacy may backfire | Low | Track record of careful messaging |
| Field-building less directly impactful | Medium | But necessary infrastructure for technical work |
| Broad mission = diluted focus | Low | Clear priorities (compute grants, policy, research) |

### Causal Position

Upstream enabler. Works on the "safety funding" and "safety talent" nodes that are bottlenecks for all technical safety work. Palisade benefits from this ecosystem.

---

## 3. GovAI (Centre for the Governance of AI)

**What they do:** Governance research at Oxford. Publishes policy analysis, runs fellowship programs, advises governments.

**Website:** https://www.governance.ai

**Funding:** ~$5-10M/year | **Size:** ~30 researchers

### Graph Nodes Targeted

- `international-coordination` (direct)
- `regulatory-capacity` (research informs policy)
- `international-ai-agreements` (research supports)
- `deployment-safeguards` (policy recommendations)

### Benefits

| Benefit | Rationale |
|---------|-----------|
| **Different intervention type** | Governance vs. technical; addresses "civilizational competence" branch of graph |
| **Track record** | Alumni in UK AISI, US AISI, RAND, major think tanks |
| **Neglected pathway** | "International coordination" node is critical but underfunded vs. technical safety |
| **Complements technical work** | Even if Palisade/Redwood succeed technically, governance needed to implement safeguards |

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Policy research → policy adoption gap | High | But research is necessary precondition |
| UK-focused may limit US/China impact | Medium | Expanding international focus |
| Slower feedback loops than technical work | Medium | Inherent to governance; still necessary |

### Causal Position

Addresses the "civilizational competence" and "transition turbulence" branches, which Palisade doesn't touch. If Palisade's demos convince policymakers, GovAI's research shapes what policies get implemented.

---

## Causal Graph Coverage

```
                          DONATION TARGETS BY CAUSAL PATHWAY
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         │                               │                               │
         ▼                               ▼                               ▼
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│   MISALIGNMENT      │      │    AI USES          │      │  CIVILIZATIONAL     │
│   POTENTIAL         │      │    (Misuse)         │      │   COMPETENCE        │
│                     │      │                     │      │                     │
│ ▣ Palisade (demos)  │      │ ▣ Palisade (cyber,  │      │ ▣ GovAI             │
│ ▣ Redwood (control) │      │   deepfakes)        │      │ ▣ CAIS (policy)     │
│ ▣ CAIS (talent)     │      │                     │      │                     │
└──────────┬──────────┘      └──────────┬──────────┘      └──────────┬──────────┘
           │                            │                            │
           └────────────────────────────┼────────────────────────────┘
                                        ▼
                              ┌───────────────────┐
                              │   EXISTENTIAL     │
                              │   CATASTROPHE     │
                              └───────────────────┘
```

---

## Counterfactual Impact Ranking

**Ranking for maximizing marginal dollar impact:**

| Rank | Organization | Rationale |
|------|--------------|-----------|
| **1** | **Palisade Research** | SFF 1:1 match doubles every dollar up to $1.1M. This dominates unless match is exhausted. |
| **2** | **GovAI** | Most neglected *category* (governance vs. technical), but no match. |
| **3** | **CAIS compute grants** | Multiplier via redistribution to researchers, but CAIS is better-funded. |
| **4** | **Redwood Research** | High quality work, but more established funding base. |

---

## Portfolio Diversification Strategy

If you want coverage across the causal model rather than maximizing a single donation:

| Causal Pathway | Recommended Org | Role |
|----------------|-----------------|------|
| Problem characterization | Palisade | Empirical red-teaming, policy evidence |
| Technical solutions | Redwood | AI Control methodology |
| Infrastructure | CAIS | Field-building, talent, compute redistribution |
| Implementation | GovAI | Governance research, international coordination |

---

## Key Uncertainties

1. **Match availability:** Palisade's SFF match status should be verified before donating
2. **Room for funding:** All orgs may have different marginal returns; worth asking directly
3. **Overlap with government:** UK AISI and US AISI now do some evaluation work that overlaps with Palisade
4. **Theory of change validity:** Governance research → policy adoption is a weaker causal link than technical research → deployed safety

---

## Sources

- AI Transition Model Master Graph (`src/data/graphs/ai-transition-model-master.yaml`)
- Palisade Research Analysis (`claude-transcripts/palisade-research-analysis.md`)
- Organization data (`src/data/organizations.yaml`)
- [Palisade Research](https://palisaderesearch.org/)
- [Redwood Research](https://redwoodresearch.org/)
- [Center for AI Safety](https://safe.ai/)
- [GovAI](https://www.governance.ai/)
