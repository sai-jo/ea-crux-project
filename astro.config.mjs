// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
      react(),
      starlight({
          title: 'EA Crux Project',
          customCss: ['./src/styles/global.css'],
          social: [
              { icon: 'github', label: 'GitHub', href: 'https://github.com/quantified-uncertainty/ea-crux-project' },
          ],
          sidebar: [
              {
                  label: 'Getting Started',
                  autogenerate: { directory: 'getting-started' },
              },
              {
                  label: 'Understanding AI Risk',
                  collapsed: true,
                  items: [
                      { label: 'Overview', slug: 'understanding-ai-risk' },
                      { label: 'Core Argument', collapsed: true, autogenerate: { directory: 'understanding-ai-risk/core-argument' } },
                      { label: 'Risk Models', collapsed: true, autogenerate: { directory: 'understanding-ai-risk/models' } },
                      { label: 'Worldviews', collapsed: true, autogenerate: { directory: 'understanding-ai-risk/worldviews' } },
                      { label: 'Key Debates', collapsed: true, autogenerate: { directory: 'understanding-ai-risk/debates' } },
                      { label: 'Arguments', collapsed: true, autogenerate: { directory: 'understanding-ai-risk/arguments' } },
                  ],
              },
              {
                  label: 'Knowledge Base',
                  collapsed: true,
                  items: [
                      { label: 'Safety Approaches', collapsed: true, items: [
                          { label: 'Overview', slug: 'knowledge-base/safety-approaches' },
                          { label: 'Technical', collapsed: true, autogenerate: { directory: 'knowledge-base/safety-approaches/technical' } },
                          { label: 'Governance', collapsed: true, autogenerate: { directory: 'knowledge-base/safety-approaches/governance' } },
                          { label: 'Institutional', collapsed: true, autogenerate: { directory: 'knowledge-base/safety-approaches/institutional' } },
                      ]},
                      { label: 'Risks & Failure Modes', collapsed: true, items: [
                          { label: 'Overview', slug: 'knowledge-base/risks' },
                          { label: 'Accident Risks', collapsed: true, autogenerate: { directory: 'knowledge-base/risks/accident' } },
                          { label: 'Misuse Risks', collapsed: true, autogenerate: { directory: 'knowledge-base/risks/misuse' } },
                          { label: 'Structural Risks', collapsed: true, autogenerate: { directory: 'knowledge-base/risks/structural' } },
                          { label: 'Epistemic Risks', collapsed: true, autogenerate: { directory: 'knowledge-base/risks/epistemic' } },
                      ]},
                      { label: 'Interventions', collapsed: true, autogenerate: { directory: 'knowledge-base/interventions' } },
                      { label: 'Solutions', collapsed: true, autogenerate: { directory: 'knowledge-base/solutions' } },
                      { label: 'Organizations', collapsed: true, autogenerate: { directory: 'knowledge-base/organizations' } },
                      { label: 'People', collapsed: true, autogenerate: { directory: 'knowledge-base/people' } },
                      { label: 'Capabilities', collapsed: true, autogenerate: { directory: 'knowledge-base/capabilities' } },
                      { label: 'Policies', collapsed: true, autogenerate: { directory: 'knowledge-base/policies' } },
                      { label: 'History', collapsed: true, autogenerate: { directory: 'knowledge-base/history' } },
                      { label: 'Resilience', collapsed: true, autogenerate: { directory: 'knowledge-base/resilience' } },
                      { label: 'Research Agendas', slug: 'knowledge-base/research-agendas' },
                      { label: 'Resources', collapsed: true, autogenerate: { directory: 'knowledge-base/resources' } },
                  ],
              },
              {
                  label: 'Analysis',
                  collapsed: true,
                  items: [
                      { label: 'Overview', slug: 'analysis' },
                      { label: 'Scenarios', collapsed: true, autogenerate: { directory: 'analysis/scenarios' } },
                      { label: 'Case Studies', collapsed: true, autogenerate: { directory: 'analysis/case-studies' } },
                      { label: 'AI Timeline', slug: 'analysis/ai-timeline' },
                      { label: 'Risk Map', slug: 'analysis/risk-map' },
                      { label: 'Estimates Dashboard', slug: 'analysis/estimates-dashboard' },
                      { label: 'Comparisons', slug: 'analysis/comparisons' },
                  ],
              },
              {
                  label: 'Interactive Tools',
                  collapsed: true,
                  autogenerate: { directory: 'guides' },
              },
          ],
      }),
	],

  vite: {
    plugins: [tailwindcss()],
  },
});