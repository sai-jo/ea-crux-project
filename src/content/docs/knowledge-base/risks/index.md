---
title: Risks & Failure Modes
description: Comprehensive catalog of AI-related risks from technical failures to societal harms
sidebar:
  order: 0
---

This section documents risks from AI systems across four major categories: accident risks (technical failures), misuse risks (intentional harm), structural risks (systemic and societal), and epistemic risks (threats to knowledge and truth).

## Risk Categories

### [Accident Risks](/knowledge-base/risks/accident/)
Technical failures where AI systems behave in unintended ways, even without malicious intent. These are the core concerns of AI safety research.

**Deception & Strategic Behavior**
- [Scheming](/knowledge-base/risks/accident/scheming) - Strategic deception to pursue hidden goals
- [Deceptive Alignment](/knowledge-base/risks/accident/deceptive-alignment) - Appearing aligned during training, diverging in deployment
- [Treacherous Turn](/knowledge-base/risks/accident/treacherous-turn) - Cooperating until powerful enough to defect
- [Sandbagging](/knowledge-base/risks/accident/sandbagging) - Hiding capabilities during evaluation
- [Sycophancy](/knowledge-base/risks/accident/sycophancy) - Telling users what they want to hear

**Goal & Learning Failures**
- [Mesa-Optimization](/knowledge-base/risks/accident/mesa-optimization) - Learned optimizers with different objectives
- [Goal Misgeneralization](/knowledge-base/risks/accident/goal-misgeneralization) - Goals that don't transfer to new contexts
- [Reward Hacking](/knowledge-base/risks/accident/reward-hacking) - Gaming reward signals in unintended ways
- [Specification Gaming](/knowledge-base/risks/accident/specification-gaming) - Exploiting loopholes in objective definitions
- [Sharp Left Turn](/knowledge-base/risks/accident/sharp-left-turn) - Capabilities generalizing while alignment doesn't

**Dangerous Default Behaviors**
- [Instrumental Convergence](/knowledge-base/risks/accident/instrumental-convergence) - Why diverse goals lead to similar dangerous subgoals
- [Power-Seeking](/knowledge-base/risks/accident/power-seeking) - Tendency to acquire resources and influence
- [Corrigibility Failure](/knowledge-base/risks/accident/corrigibility-failure) - Resistance to correction or shutdown

**Capability & Deployment Risks**
- [Emergent Capabilities](/knowledge-base/risks/accident/emergent-capabilities) - Unexpected abilities appearing at scale
- [Distributional Shift](/knowledge-base/risks/accident/distributional-shift) - Failures when deployed in new contexts

### [Misuse Risks](/knowledge-base/risks/misuse/)
Intentional harmful applications of AI technology by malicious actors.

**Weapons**
- [Bioweapons](/knowledge-base/risks/misuse/bioweapons) - AI-assisted pathogen design
- [Cyberweapons](/knowledge-base/risks/misuse/cyberweapons) - Autonomous hacking and vulnerability exploitation
- [Autonomous Weapons](/knowledge-base/risks/misuse/autonomous-weapons) - Lethal autonomous weapons systems

**Manipulation & Deception**
- [Disinformation](/knowledge-base/risks/misuse/disinformation) - AI-generated propaganda at scale
- [Deepfakes](/knowledge-base/risks/misuse/deepfakes) - Synthetic media for impersonation

**Surveillance & Control**
- [Mass Surveillance](/knowledge-base/risks/misuse/surveillance) - AI-enabled monitoring at scale
- [Authoritarian Tools](/knowledge-base/risks/misuse/authoritarian-tools) - AI for censorship and political control

### [Structural Risks](/knowledge-base/risks/structural/)
Systemic risks from how AI reshapes society, institutions, and power dynamics.

**Power & Control**
- [Concentration of Power](/knowledge-base/risks/structural/concentration-of-power) - AI enabling unprecedented power accumulation
- [Lock-in](/knowledge-base/risks/structural/lock-in) - Permanent entrenchment of values or systems

**Competition & Coordination**
- [Racing Dynamics](/knowledge-base/risks/structural/racing-dynamics) - Competition driving unsafe practices
- [Multipolar Trap](/knowledge-base/risks/structural/multipolar-trap) - Competitive dynamics producing collectively bad outcomes
- [Proliferation](/knowledge-base/risks/structural/proliferation) - Spread of dangerous capabilities

**Human Agency & Society**
- [Erosion of Human Agency](/knowledge-base/risks/structural/erosion-of-agency) - Humans losing meaningful control
- [Enfeeblement](/knowledge-base/risks/structural/enfeeblement) - Humanity losing capability to function without AI
- [Economic Disruption](/knowledge-base/risks/structural/economic-disruption) - Mass displacement and restructuring

### [Epistemic Risks](/knowledge-base/risks/epistemic/)
Risks to knowledge, truth, and our collective ability to understand reality.

- [Epistemic Collapse](/knowledge-base/risks/epistemic/epistemic-collapse) - Inability to distinguish true from false
- [Trust Erosion](/knowledge-base/risks/epistemic/trust-erosion) - Loss of faith in institutions and verification
- [Automation Bias](/knowledge-base/risks/epistemic/automation-bias) - Over-reliance on AI outputs

## Risk Assessment Framework

Each risk profile includes:
- **Severity**: Low / Medium / High / Catastrophic
- **Likelihood**: Probability estimate with uncertainty
- **Timeframe**: When might this become relevant?
- **Status**: Theoretical, emerging, or currently occurring

## Observable vs Theoretical

| Currently Observable | Emerging | Theoretical/Future |
|---------------------|----------|-------------------|
| Sycophancy | Sandbagging | Scheming |
| Reward Hacking | Disinformation at scale | Treacherous Turn |
| Specification Gaming | Deepfakes | Sharp Left Turn |
| Racing Dynamics | Economic Disruption | Lock-in |
| Automation Bias | Emergent Capabilities | Corrigibility Failure |
| Trust Erosion | Concentration of Power | Power-Seeking AI |

Understanding observable failures helps us reason about future risks, though the relationship between current problems and future catastrophic risks is debated.

## How Categories Interact

These categories aren't independent:
- **Accident + Misuse**: Misuse is more dangerous when AI is more capable; accident risks determine capability levels
- **Structural + Accident**: Racing dynamics make accidents more likely by reducing safety investment
- **Epistemic + All**: If we can't agree on what risks exist, coordinating responses is impossible
- **Structural + Misuse**: Concentration of power determines who might misuse AI; proliferation determines who has access
