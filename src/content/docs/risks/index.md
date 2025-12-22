---
title: Risks & Failure Modes
description: Catalog of AI-related risks and potential failure modes
sidebar:
  order: 0
---

This section documents specific risks from advanced AI systems, from technical alignment failures to systemic risks.

## Categories

### Deceptive Behavior
Risks where AI systems strategically deceive or hide their true nature:
- [Scheming](/risks/scheming) - Strategic deception to pursue hidden goals (modern term)
- [Deceptive Alignment](/risks/deceptive-alignment) - Appearing aligned during training, diverging in deployment
- [Treacherous Turn](/risks/treacherous-turn) - Cooperating until powerful enough to defect
- [Sandbagging](/risks/sandbagging) - Hiding capabilities during evaluation
- [Sycophancy](/risks/sycophancy) - Telling users what they want to hear (observable now)

### Goal & Learning Failures
Risks from how AI systems learn and generalize objectives:
- [Mesa-Optimization](/risks/mesa-optimization) - Learned optimizers with different objectives
- [Goal Misgeneralization](/risks/goal-misgeneralization) - Goals that don't transfer to new contexts
- [Reward Hacking](/risks/reward-hacking) - Gaming reward signals in unintended ways
- [Sharp Left Turn](/risks/sharp-left-turn) - Capabilities generalizing while alignment doesn't

### Dangerous Tendencies
Default behaviors that emerge from optimization:
- [Instrumental Convergence](/risks/instrumental-convergence) - Why diverse goals lead to similar dangerous subgoals
- [Power-Seeking](/risks/power-seeking) - Tendency to acquire resources and influence

### Structural / Systemic Risks
Risks from the broader AI development landscape:
- [Racing Dynamics](/risks/racing-dynamics) - Competition driving unsafe practices
- Proliferation - Spread of dangerous capabilities
- Lock-in - Permanent entrenchment of bad outcomes

### Misuse Risks
Intentional harmful use of AI:
- Bioweapons - AI-assisted pathogen design
- Cyberattacks - Autonomous hacking at scale
- Manipulation - Large-scale influence operations

## Risk Assessment Framework

Each risk profile includes:
- **Severity**: Low / Medium / High / Catastrophic
- **Likelihood**: Probability estimate with uncertainty
- **Timeframe**: When might this become relevant?
- **Tractability**: Can we do anything about it?

## Observable vs Theoretical

| Currently Observable | Theoretical/Future |
|---------------------|-------------------|
| Sycophancy | Scheming |
| Reward Hacking | Treacherous Turn |
| Goal Misgeneralization | Sharp Left Turn |
| Racing Dynamics | Power-Seeking AI |

Understanding observable failures helps us reason about future risks.
