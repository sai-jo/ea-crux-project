# The Case for Donating to the Center for AI Safety (CAIS)

*Analysis based on the AI Transition Model master causal graph*

---

## Executive Summary

The Center for AI Safety (CAIS) occupies a unique position in the AI safety ecosystem: it operates at the **bottleneck nodes** of `safety-funding` and `safety-talent` that constrain all downstream technical safety work. Unlike organizations that produce research directly, CAIS acts as a **force multiplier**—redistributing compute to researchers who lack it and building the pipeline of talent that every other safety org draws from.

For donations in the $5-25k range, CAIS's **compute grants program** offers unusually high counterfactual impact because grants are modular ($1-10k each), meaning your donation can fully fund specific research projects rather than being absorbed into general overhead.

---

## What CAIS Does

| Program | Description | Annual Scale |
|---------|-------------|--------------|
| **Compute Grants** | Provides GPU access to researchers at universities and small orgs who lack frontier-scale compute | ~$1-2M distributed |
| **ML Safety Scholars** | 10-week research program training new safety researchers | ~50 participants/year |
| **Policy Research** | Analysis of AI governance, risk communication | Ongoing |
| **Technical Research** | Representation engineering, anomaly detection, benchmarks | 5-10 papers/year |
| **Public Advocacy** | AI risk statement, media engagement | High-profile interventions |

**Leadership:** Dan Hendrycks (director), who developed representation engineering and maintains influential safety benchmarks.

**Website:** https://safe.ai

---

## Mapping to the Master Causal Graph

CAIS's work directly targets upstream nodes that constrain the entire safety ecosystem:

### Primary Nodes (Direct Impact)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MISALIGNMENT POTENTIAL                           │
│                              │                                      │
│    ┌─────────────────────────┼─────────────────────────┐           │
│    │                         │                         │           │
│    ▼                         ▼                         ▼           │
│ ┌──────────┐          ┌──────────┐          ┌──────────────┐       │
│ │ SAFETY   │          │ SAFETY   │          │ SAFETY       │       │
│ │ FUNDING  │◄─────────│ TALENT   │◄─────────│ CULTURE      │       │
│ │          │  CAIS    │          │  CAIS    │              │       │
│ │ ~$100M/yr│ compute  │ ~300-500 │ scholars │              │       │
│ └────┬─────┘ grants   └────┬─────┘ program  └──────────────┘       │
│      │                     │                                        │
│      └──────────┬──────────┘                                        │
│                 ▼                                                   │
│    ┌────────────────────────┐                                       │
│    │   TECHNICAL SAFETY     │                                       │
│    │   RESEARCH OUTPUT      │                                       │
│    │                        │                                       │
│    │ • Interpretability     │                                       │
│    │ • Alignment techniques │                                       │
│    │ • Evaluations          │                                       │
│    └────────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────────┘
```

| Graph Node | CAIS Program | Mechanism |
|------------|--------------|-----------|
| `safety-funding` | Compute grants | Redistributes resources to funding-constrained researchers |
| `safety-talent` | ML Safety Scholars | Trains ~50 new researchers/year; alumni join labs and orgs |
| `safety-culture` | Advocacy, risk statement | Shifts Overton window; legitimizes safety concerns |
| `regulatory-capacity` | Policy research | Informs government understanding of AI risk |
| `expert-policy-influence` | Public statements | Hinton/Bengio/Hassabis statement reached policymakers |

### Secondary Nodes (Indirect Impact via Grantees)

CAIS compute grants enable research across the full technical safety stack:

| Node | Example Grantee Research |
|------|-------------------------|
| `interpretability-research` | Sparse autoencoders, circuit analysis requiring large models |
| `dangerous-capability-evals` | Evaluating frontier models for deception, autonomy |
| `alignment-techniques` | RLHF variants, constitutional AI experiments |
| `red-teaming` | Adversarial attacks on safety measures |

---

## Why CAIS Over Other Organizations?

### Comparison Matrix

| Criterion | CAIS | Palisade | GovAI | Redwood |
|-----------|------|----------|-------|---------|
| **Primary output** | Multiplier (funding, talent) | Research (red-teaming) | Research (governance) | Research (AI control) |
| **Causal position** | Upstream bottleneck | Downstream evidence | Parallel pathway | Downstream solutions |
| **Donation granularity** | High (compute grants $1-10k) | Medium | Low (salaries ~$80k) | Low (salaries) |
| **Neglectedness** | Medium | High | High | Medium |
| **Room for funding** | Good (compute always useful) | Good (SFF match) | Unclear | Limited |
| **Your counterfactual** | Fund specific projects | 2x via match | Absorbed into overhead | Absorbed into overhead |

### The Granularity Advantage

At the **$15k donation level**, CAIS has a structural advantage:

| Organization | What $15k Buys | Counterfactual Impact |
|--------------|----------------|----------------------|
| **CAIS compute grants** | 2-5 complete research grants | You are the marginal funder of specific papers/projects |
| **GovAI** | ~15% of one researcher-year | Absorbed into general operations |
| **Redwood** | ~10% of one researcher-year | Absorbed into general operations |
| **Palisade** | $30k effective (with match) | High, but match may be exhausted |

**Key insight:** Research salaries are "lumpy"—you need ~$80-150k to fund a position. Compute grants are modular—$5k can fully fund a project. At sub-$30k donation sizes, CAIS offers higher counterfactual impact per dollar.

### The Multiplier Effect

Every compute grant CAIS makes enables research that wouldn't otherwise happen:

```
$15k donation to CAIS
        │
        ▼
┌───────────────────────┐
│  3-5 compute grants   │
│  to PhD students and  │
│  small-org researchers│
└───────────┬───────────┘
            │
    ┌───────┴───────┐
    ▼               ▼
┌─────────┐   ┌─────────┐
│Paper on │   │Paper on │
│deception│   │interp.  │
│evals    │   │methods  │
└────┬────┘   └────┬────┘
     │             │
     └──────┬──────┘
            ▼
   ┌─────────────────┐
   │Cited by labs,   │
   │informs RSPs,    │
   │shapes policy    │
   └─────────────────┘
```

This multiplier doesn't exist at orgs where donations fund fractional researcher time.

---

## CAIS's Theory of Change

### Short-term (1-2 years)
1. Compute grants enable experiments that wouldn't otherwise run
2. ML Safety Scholars pipeline feeds talent to Anthropic, DeepMind, MIRI, etc.
3. Technical research (representation engineering) gets adopted by labs

### Medium-term (2-5 years)
1. Safety field grows from ~500 to ~2000+ researchers (partly via CAIS programs)
2. Benchmarks and evals CAIS develops become industry standard
3. Policy research shapes regulatory frameworks (EU AI Act, US executive orders)

### Long-term (5+ years)
1. Larger safety field produces breakthroughs in interpretability, alignment
2. Safety culture becomes default at frontier labs (vs. current racing dynamics)
3. Technical solutions exist before AGI/ASI capabilities arrive

---

## Addressing Potential Concerns

### "CAIS is already well-funded"

**Response:** CAIS has a larger donor base than Palisade or GovAI, but:
- Compute demand always exceeds supply (GPU costs scale with model size)
- The marginal compute grant still enables research that wouldn't happen
- Earmarking for compute grants avoids funding going to lower-impact programs

### "Field-building is less directly impactful than technical research"

**Response:** This is true in expectation per dollar, but:
- At $15k, you can't fund meaningful technical research directly (researcher salaries too high)
- Funding the multiplier (CAIS) → funds the object-level work (grantees)
- Field-building has compounding returns (trained researcher produces for decades)

### "CAIS does advocacy, which might backfire"

**Response:**
- Their advocacy has been careful and well-received (AI risk statement)
- You can earmark donations for compute grants specifically, avoiding advocacy spend
- Even critics of AI safety advocacy generally exempt CAIS from concerns

### "I'd rather fund frontier research directly"

**Response:** With $15k, you can't. Options are:
1. Fund CAIS → they fund researchers with compute
2. Fund researcher salaries fractionally → absorbed into overhead
3. Wait until you have $100k+ → opportunity cost

CAIS is the best vehicle for converting $15k into object-level safety research.

---

## Specific Recommendation

### For a $15k allocation:

**Donate $15k to CAIS, earmarked for compute grants.**

When donating, email team@safe.ai or use their donation form to specify:
> "Please direct this donation to the compute grants program for AI safety researchers."

This ensures:
- Maximum counterfactual impact (you fund specific projects)
- Avoids fungibility concerns (not absorbed into general operations)
- Aligns with CAIS's highest-leverage program

### Why not split with GovAI?

At $15k total:
- $15k to CAIS = 2-5 complete compute grants
- $7.5k to each = 1-2 grants + fractional GovAI contribution

The concentrated donation has higher expected impact due to the granularity advantage.

### If you later have $30k+:

Consider splitting:
- $15k CAIS (compute grants)
- $15k GovAI (approaches threshold for meaningful contribution)

At higher donation levels, GovAI's neglectedness becomes more relevant.

---

## How CAIS Complements Your Other Donations

| Donation | Causal Pathway | Role |
|----------|---------------|------|
| **Lightcone ($15k)** | Community infrastructure | Supports discourse, coordination |
| **Palisade ($20k)** | Technical red-teaming | Produces evidence of risk |
| **CAIS ($15k)** | Safety research enablement | Funds researchers who build on Palisade's findings |

This portfolio covers:
- ✅ Problem identification (Palisade)
- ✅ Solution development (CAIS grantees)
- ✅ Community infrastructure (Lightcone)
- ❌ Governance (not covered, but $15k insufficient for GovAI anyway)

---

## Conclusion

CAIS is the optimal recipient for a $15k AI safety donation because:

1. **Bottleneck position:** Targets `safety-funding` and `safety-talent` nodes that constrain all downstream work
2. **Granularity:** Compute grants are modular; your $15k fully funds 2-5 specific projects
3. **Counterfactual impact:** You are the marginal funder of research that wouldn't otherwise happen
4. **Complementarity:** Fills the "solution development" gap in a portfolio with Palisade (problems) and Lightcone (infrastructure)

The structural advantage of funding a multiplier organization, combined with the modularity of compute grants at this donation size, makes CAIS the highest-impact allocation for your remaining $15k.

---

## Sources

- AI Transition Model Master Graph (`src/data/graphs/ai-transition-model-master.yaml`)
- CAIS website: https://safe.ai
- CAIS compute grants: https://safe.ai/compute
- Representation engineering paper: https://arxiv.org/abs/2310.01405
- AI risk statement: https://www.safe.ai/statement-on-ai-risk
