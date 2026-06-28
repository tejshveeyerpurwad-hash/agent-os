import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Hexagon, ArrowRight, ChevronRight, Menu, X, Play, Sparkles,
  Workflow, Bot, Brain, BarChart3, Shield, Users, Globe,
  Layers, Cpu, Zap, TrendingUp, CheckCircle, ChevronDown,
  Quote, MessageCircle, ExternalLink, Mail,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

const agents = [
  { role: 'CEO Agent', desc: 'Strategic decision-making, executive summaries, and high-level business insights powered by market data analysis.', color: 'from-blue-500/20 to-blue-600/10', icon: 'Crown' },
  { role: 'HR Agent', desc: 'Talent acquisition, employee engagement, performance reviews, and organizational development automation.', color: 'from-emerald-500/20 to-emerald-600/10', icon: 'Users' },
  { role: 'Finance Agent', desc: 'Real-time financial analysis, forecasting, budget optimization, and compliance monitoring across departments.', color: 'from-amber-500/20 to-amber-600/10', icon: 'TrendingUp' },
  { role: 'Sales Agent', desc: 'Lead scoring, pipeline management, prospect intelligence, and revenue forecasting with behavioral analysis.', color: 'from-violet-500/20 to-violet-600/10', icon: 'Zap' },
  { role: 'Marketing Agent', desc: 'Campaign optimization, audience segmentation, content strategy, and multi-channel performance analytics.', color: 'from-pink-500/20 to-pink-600/10', icon: 'Globe' },
  { role: 'Operations Agent', desc: 'Process optimization, resource allocation, supply chain intelligence, and operational workflow automation.', color: 'from-cyan-500/20 to-cyan-600/10', icon: 'Layers' },
  { role: 'Legal Agent', desc: 'Contract review, compliance monitoring, risk assessment, and regulatory documentation automation.', color: 'from-red-500/20 to-red-600/10', icon: 'Shield' },
  { role: 'Support Agent', desc: 'Intelligent ticket routing, knowledge base retrieval, sentiment analysis, and automated issue resolution.', color: 'from-indigo-500/20 to-indigo-600/10', icon: 'Bot' },
]

const problems = [
  { title: 'Tool Fragmentation', desc: 'Teams juggle 10+ tools daily — Slack, email, docs, CRMs, analytics — wasting 40% of their time switching context.', metric: '40%' },
  { title: 'Information Silos', desc: 'Critical data trapped in separate systems. No single source of truth means decisions are made on incomplete information.', metric: '60%' },
  { title: 'Manual Processes', desc: 'Repetitive workflows consume 30% of employee hours. Talent wasted on tasks that AI agents can execute autonomously.', metric: '30%' },
  { title: 'Slow Decision-Making', desc: 'Average enterprise takes 3+ days to generate a cross-departmental report. By then, the opportunity has passed.', metric: '3x' },
]

const features = [
  { icon: Cpu, title: 'Multi-Agent Orchestration', desc: 'Deploy specialized agents that collaborate across departments. Each agent has domain expertise and communicates autonomously.' },
  { icon: Workflow, title: 'Visual Workflow Builder', desc: 'Design complex business processes with drag-and-drop simplicity. Conditional branching, parallel execution, and real-time monitoring.' },
  { icon: Brain, title: 'Unified Knowledge Base', desc: 'Centralized vector database that all agents query. Automatically ingests documents, emails, Slack threads, and CRM data.' },
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Live dashboards showing agent performance, workflow efficiency, cost metrics, and business impact across your organization.' },
  { icon: Shield, title: 'Enterprise Security', desc: 'SOC 2 compliant, end-to-end encryption, role-based access control, and full audit trails for every agent action.' },
  { icon: Zap, title: 'API-First Architecture', desc: 'Every agent and workflow exposes REST APIs. Integrate with your existing stack in minutes. Webhooks for event-driven automation.' },
]

const testimonials = [
  { quote: 'AgentOS reduced our reporting time from 3 days to 12 minutes. The finance agent alone saves us $40k/month in analyst hours.', author: 'Sarah Chen', role: 'CFO, TechScale Inc.', rating: 5 },
  { quote: 'We deployed 8 agents across departments in one afternoon. The orchestration between sales and marketing agents doubled our lead conversion rate.', author: 'Marcus Rodriguez', role: 'VP of Operations, DataFlow', rating: 5 },
  { quote: 'The HR agent transformed our hiring pipeline. Automated screening, scheduling, and initial assessments cut our time-to-hire by 60%.', author: 'Emily Nakamura', role: 'Head of People, NexusCorp', rating: 5 },
]

const faqs = [
  { q: 'What is AgentOS and how does it work?', a: 'AgentOS is an AI Business Operating System where multiple specialized AI agents collaborate to execute business workflows. Each agent has domain expertise, and they communicate autonomously to complete tasks end-to-end.' },
  { q: 'How is this different from chatbots or GPT wrappers?', a: 'Unlike single-chatbot interfaces, AgentOS is a multi-agent system. Each agent has a specific role, memory, and toolset. They work together like a team of specialists, orchestrating complex business processes.' },
  { q: 'Can I integrate AgentOS with my existing tools?', a: 'Yes. AgentOS is API-first. We provide native integrations with Slack, Salesforce, HubSpot, Notion, Google Workspace, Microsoft 365, and more. Custom integrations via webhooks and REST APIs.' },
  { q: 'How long does deployment take?', a: 'Most teams deploy their first agent within 30 minutes. Full multi-agent workflows across departments typically take 2-3 days to configure and optimize.' },
  { q: 'Is my data secure?', a: 'Absolutely. SOC 2 Type II certified, data encrypted at rest and in transit, role-based access control, and comprehensive audit logging. Your data never trains external models.' },
  { q: 'What does pricing look like?', a: 'We offer usage-based pricing starting at $1 per agent per hour. Enterprise plans include dedicated infrastructure, custom model fine-tuning, and priority support.' },
]

const logos = [
  'NexusCorp', 'DataFlow', 'TechScale', 'QuantumLabs', 'AtlasGlobal', 'MeridianAI',
  'NexusCorp', 'DataFlow', 'TechScale', 'QuantumLabs', 'AtlasGlobal', 'MeridianAI',
]

function AgentIcon({ icon, className }: { icon: string; className?: string }) {
  const icons: Record<string, typeof Hexagon> = {
    Crown: Hexagon, Users: Users, TrendingUp: TrendingUp, Zap: Zap,
    Globe: Globe, Layers: Layers, Shield: Shield, Bot: Bot,
  }
  const Icon = icons[icon] || Bot
  return <Icon className={className} />
}

function SectionHeader({ label, title, desc }: { label: string; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      className="text-center max-w-3xl mx-auto mb-16 lg:mb-24"
    >
      <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary-400/80 mb-4">
        {label}
      </span>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-100 mb-5 tracking-tight">
        {title}
      </h2>
      <p className="text-base sm:text-lg text-dark-400 leading-relaxed max-w-2xl mx-auto">
        {desc}
      </p>
    </motion.div>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', (y) => setScrolled(y > 40))
  }, [scrollY])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-surface/80 backdrop-blur-xl border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
              <Hexagon className="h-8 w-8 text-primary-400" />
            </motion.div>
            <span className="text-lg font-bold text-dark-100 tracking-tight">AgentOS</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {['Product', 'Agents', 'Features', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm text-dark-400 hover:text-dark-100 transition-colors duration-200">
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to={ROUTES.DASHBOARD}
              className="px-4 py-2 text-sm text-dark-300 hover:text-dark-100 transition-colors">
              Sign In
            </Link>
            <Link to={ROUTES.DASHBOARD}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white 
                bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl overflow-hidden
                hover:shadow-glow transition-shadow duration-300">
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="relative z-10 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 
                group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-dark-400 hover:text-dark-100 transition-colors">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-surface/95 backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-4">
              {['Product', 'Agents', 'Features', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-dark-400 hover:text-dark-100 transition-colors py-2">
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                <Link to={ROUTES.DASHBOARD} onClick={() => setMobileOpen(false)}
                  className="text-sm text-dark-300 hover:text-dark-100 transition-colors py-2">
                  Sign In
                </Link>
                <Link to={ROUTES.DASHBOARD} onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white 
                    bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl">
                  Get Started <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, 150])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 lg:pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-500/8 via-transparent to-surface pointer-events-none" />
      <motion.div style={{ y: heroY, opacity }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary-400" />
              <span className="text-xs font-medium text-primary-300">Introducing Multi-Agent Orchestration</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-dark-100 leading-[1.05] tracking-tight mb-6">
              The AI Operating System for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-primary-400 to-accent-400">
                Business
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-dark-400 leading-relaxed mb-8 max-w-lg">
              Deploy specialized AI agents that collaborate autonomously across departments.
              Turn your business into a self-operating intelligence engine.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
              <Link to={ROUTES.DASHBOARD}
                className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-medium text-white 
                  bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl overflow-hidden
                  hover:shadow-glow transition-all duration-300">
                <span className="relative z-10">Launch AgentOS</span>
                <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <button className="group inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-medium 
                text-dark-300 hover:text-dark-100 transition-colors">
                <span className="flex items-center justify-center w-10 h-10 rounded-full border border-dark-700 
                  group-hover:border-dark-500 transition-colors">
                  <Play className="h-4 w-4 ml-0.5" />
                </span>
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-6 text-xs text-dark-500">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> 30-min setup</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> SOC 2 certified</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-border-light bg-surface-alt/50 backdrop-blur-sm overflow-hidden
              shadow-elevation-3">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <span className="ml-3 text-xs text-dark-500">prompt.agentos.ai</span>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-dark-200 font-medium mb-1">You</p>
                    <p className="text-sm text-dark-300">Generate a Q3 revenue report with sales forecasts, marketing ROI analysis, and competitor intelligence.</p>
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="ml-10 space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs text-dark-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                    Orchestrating agents...
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Hexagon className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-dark-200 font-medium mb-1">AgentOS · 6 agents</p>
                    <div className="space-y-1.5">
                      {['Finance Agent analyzed revenue data', 'Sales Agent updated pipeline forecasts',
                        'Marketing Agent calculated campaign ROI', 'Research Agent gathered competitor intel'].map((s, i) => (
                        <motion.div key={s}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.8 + i * 0.2 }}
                          className="flex items-center gap-2 text-xs text-dark-400">
                          <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0" />
                          {s}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TrustedBy() {
  return (
    <section className="py-16 lg:py-20 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-dark-500 mb-8">
          Trusted by innovative teams worldwide
        </p>
        <div className="overflow-hidden mask-edges">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex gap-16 items-center"
          >
            {logos.map((name, i) => (
              <div key={`${name}-${i}`}
                className="flex items-center gap-2 text-dark-600 hover:text-dark-500 transition-colors shrink-0">
                <Hexagon className="h-5 w-5" />
                <span className="text-sm font-semibold tracking-tight whitespace-nowrap">{name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function BusinessProblems() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="The Problem"
          title="Business runs on fragmented systems"
          desc="Your team switches between 10+ tools daily. Data is scattered. Decisions are slow. Enterprise complexity is at an all-time high."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="group relative p-6 lg:p-8 rounded-2xl border border-border bg-surface-alt/50 
                hover:border-border-light transition-all duration-500"
            >
              <div className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br 
                from-primary-400 to-accent-400 mb-4">{p.metric}</div>
              <h3 className="text-base font-semibold text-dark-100 mb-2">{p.title}</h3>
              <p className="text-sm text-dark-400 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Solution() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-surface-alt/30 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="The Solution"
          title="One operating system for your entire business"
          desc="AgentOS replaces tool fragmentation with a unified intelligence layer. AI agents work together across departments, turning prompts into executed workflows."
        />
        <div className="relative grid lg:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'You Describe the Task', desc: 'Type a natural language prompt describing what needs to be done — a report, a workflow, an analysis.' },
            { step: '02', title: 'Agents Orchestrate', desc: 'AgentOS decomposes the task, assigns sub-tasks to specialized agents, and coordinates execution in real-time.' },
            { step: '03', title: 'Business Executes', desc: 'The result is delivered as a completed workflow — data enriched, reports generated, actions taken across systems.' },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative p-6 lg:p-8 rounded-2xl border border-border bg-surface-alt/40"
            >
              <span className="text-5xl lg:text-6xl font-bold text-dark-800/50 mb-4 block leading-none">{s.step}</span>
              <h3 className="text-lg font-semibold text-dark-100 mb-3">{s.title}</h3>
              <p className="text-sm text-dark-400 leading-relaxed">{s.desc}</p>
              {i < 2 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ChevronRight className="h-6 w-6 text-dark-600" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AIAgents() {
  return (
    <section id="agents" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="AI Agents"
          title="A specialized agent for every department"
          desc="Each agent has deep domain expertise, memory, and tool access. They work together like a world-class team."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.role}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group relative p-5 lg:p-6 rounded-2xl border border-border bg-surface-alt/30 
                hover:bg-surface-alt/60 hover:border-border-light transition-all duration-300 cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center mb-4
                group-hover:scale-110 transition-transform duration-300`}>
                <AgentIcon icon={agent.icon} className="h-5 w-5 text-dark-100" />
              </div>
              <h3 className="text-sm font-semibold text-dark-100 mb-2">{agent.role}</h3>
              <p className="text-xs text-dark-400 leading-relaxed">{agent.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkflowAnimation() {
  const [activeStep, setActiveStep] = useState(0)
  const steps = [
    { icon: Bot, label: 'You Submit a Prompt', desc: 'Describe what needs to be done in natural language' },
    { icon: Cpu, label: 'AgentOS Decomposes', desc: 'The orchestrator splits the task into sub-tasks' },
    { icon: Users, label: 'Agents Collaborate', desc: 'Specialized agents work in parallel, sharing context' },
    { icon: CheckCircle, label: 'Business Executes', desc: 'Completed workflow delivered across your systems' },
  ]

  useEffect(() => {
    const timer = setInterval(() => setActiveStep((p) => (p + 1) % steps.length), 2500)
    return () => clearInterval(timer)
  }, [steps.length])

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-surface-alt/20 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="How It Works"
          title="From prompt to execution in seconds"
          desc="AgentOS transforms your natural language request into a coordinated multi-agent workflow."
        />
        <div className="flex flex-col lg:flex-row items-center justify-center gap-0 lg:gap-2 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div key={step.label} className="flex items-center w-full lg:w-auto">
              <motion.div
                animate={{
                  scale: activeStep === i ? 1.05 : 1,
                  borderColor: activeStep === i ? 'rgba(56, 189, 248, 0.5)' : 'rgba(51, 65, 85, 1)',
                }}
                transition={{ duration: 0.4 }}
                className={`relative flex flex-col items-center text-center p-5 lg:p-6 rounded-2xl border w-full lg:w-48
                  ${activeStep === i ? 'bg-primary-500/10 border-primary-500/30' : 'bg-surface-alt/30 border-border'}
                  transition-all duration-500`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3
                  ${activeStep === i ? 'bg-primary-500/20 text-primary-400' : 'bg-dark-800 text-dark-500'}
                  transition-all duration-500`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <span className={`text-xs font-semibold mb-1.5 transition-colors duration-500
                  ${activeStep === i ? 'text-primary-300' : 'text-dark-300'}`}>
                  {step.label}
                </span>
                <span className="text-[10px] text-dark-500 leading-relaxed">{step.desc}</span>
              </motion.div>
              {i < steps.length - 1 && (
                <div className="hidden lg:flex items-center px-2">
                  <motion.div
                    animate={{ x: activeStep === i ? 4 : 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ArrowRight className={`h-5 w-5 transition-colors duration-500
                      ${activeStep >= i ? 'text-primary-400' : 'text-dark-700'}`} />
                  </motion.div>
                </div>
              )}
              {i < steps.length - 1 && (
                <div className="flex lg:hidden w-full h-6 items-center justify-center">
                  <motion.div
                    animate={{ y: activeStep === i ? 2 : 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ChevronDown className={`h-4 w-4 transition-colors duration-500
                      ${activeStep >= i ? 'text-primary-400' : 'text-dark-700'}`} />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">Average execution time: 47 seconds</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Features"
          title="Everything you need to run your business on AI"
          desc="A comprehensive platform built for enterprise scale. Every feature designed for real business impact."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              whileHover={{ y: -2 }}
              className="group p-6 lg:p-8 rounded-2xl border border-border bg-surface-alt/30 
                hover:border-border-light hover:bg-surface-alt/50 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 
                flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="h-5 w-5 text-primary-400" />
              </div>
              <h3 className="text-base font-semibold text-dark-100 mb-2">{f.title}</h3>
              <p className="text-sm text-dark-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArchitecturePreview() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Architecture"
          title="Enterprise-grade multi-agent infrastructure"
          desc="Built for scale, security, and reliability. AgentOS orchestrates agents across any infrastructure."
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-border bg-surface-alt/30 p-6 lg:p-10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 pointer-events-none" />
          <div className="relative grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="space-y-4">
              <span className="text-xs font-semibold tracking-wider uppercase text-dark-500">Input Layer</span>
              <div className="space-y-2">
                {['REST API', 'Webhooks', 'Slack / Email', 'Scheduled Jobs'].map((item) => (
                  <div key={item}
                    className="px-4 py-2.5 rounded-lg border border-border bg-surface-alt/50 text-sm text-dark-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <span className="text-xs font-semibold tracking-wider uppercase text-dark-500">Agent Layer</span>
              <div className="space-y-2">
                {['Orchestrator Engine', '8 Specialized Agents', 'Knowledge Graph', 'Memory Store'].map((item) => (
                  <div key={item}
                    className="px-4 py-2.5 rounded-lg border border-primary-500/20 bg-primary-500/5 text-sm text-primary-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <span className="text-xs font-semibold tracking-wider uppercase text-dark-500">Output Layer</span>
              <div className="space-y-2">
                {['Dashboard', 'Reports', 'API Responses', 'System Actions'].map((item) => (
                  <div key={item}
                    className="px-4 py-2.5 rounded-lg border border-border bg-surface-alt/50 text-sm text-dark-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden lg:flex absolute top-1/2 left-1/3 right-1/3 -translate-y-1/2 justify-between px-8 pointer-events-none">
            <ArrowRight className="h-5 w-5 text-primary-500/30" />
            <ArrowRight className="h-5 w-5 text-accent-500/30" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Testimonials() {
  const [current, setCurrent] = useState(0)

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Testimonials"
          title="Trusted by industry leaders"
          desc="See how AgentOS transforms businesses across industries."
        />
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative p-8 lg:p-12 rounded-3xl border border-border bg-surface-alt/40"
            >
              <Quote className="h-8 w-8 text-primary-500/30 mb-4" />
              <p className="text-lg lg:text-xl text-dark-200 leading-relaxed mb-8">
                {testimonials[current].quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 
                  flex items-center justify-center text-white font-semibold text-sm">
                  {testimonials[current].author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark-100">{testimonials[current].author}</p>
                  <p className="text-xs text-dark-400">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-primary-400 w-6' : 'bg-dark-700 hover:bg-dark-600'
                }`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-surface-alt/20 to-transparent">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="FAQ"
          title="Frequently asked questions"
          desc="Everything you need to know about AgentOS."
        />
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 lg:p-6 text-left
                  hover:bg-surface-alt/30 transition-colors duration-200"
              >
                <span className="text-sm font-medium text-dark-200 pr-4">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-dark-500 shrink-0 transition-transform duration-300 ${
                  openIndex === i ? 'rotate-180' : ''
                }`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 lg:px-6 pb-5 lg:pb-6 text-sm text-dark-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-100 tracking-tight mb-5">
            Ready to transform your business?
          </h2>
          <p className="text-base sm:text-lg text-dark-400 mb-10 max-w-2xl mx-auto">
            Join forward-thinking companies that have already automated their operations with AgentOS.
            Deploy your first agent in under 30 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={ROUTES.DASHBOARD}
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 text-base font-medium text-white 
                bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl overflow-hidden
                hover:shadow-glow transition-all duration-300">
              <span className="relative z-10">Start Free Trial</span>
              <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 
                group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link to={ROUTES.DASHBOARD}
              className="px-8 py-4 text-base font-medium text-dark-300 border border-border-light rounded-xl
                hover:text-dark-100 hover:border-dark-500 transition-all duration-300">
              Talk to Sales
            </Link>
          </div>
          <p className="mt-6 text-xs text-dark-500">No credit card required · Free 14-day trial · Cancel anytime</p>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Hexagon className="h-7 w-7 text-primary-400" />
              <span className="text-lg font-bold text-dark-100">AgentOS</span>
            </div>
            <p className="text-sm text-dark-400 leading-relaxed max-w-xs mb-6">
              The AI Business Operating System. Deploy intelligent agents that collaborate to automate and optimize your enterprise.
            </p>
            <div className="flex items-center gap-3">
              {[MessageCircle, Globe, ExternalLink, Mail].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-lg border border-border bg-surface-alt/30 flex items-center justify-center
                    text-dark-500 hover:text-dark-300 hover:border-dark-600 transition-all duration-200">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Partners'] },
            { title: 'Resources', links: ['Documentation', 'API Reference', 'Tutorials', 'Community', 'Support'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold tracking-wider uppercase text-dark-500 mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-dark-400 hover:text-dark-200 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dark-500">&copy; 2026 AgentOS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-xs text-dark-500 hover:text-dark-400 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export function Landing() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <Hero />
      <TrustedBy />
      <BusinessProblems />
      <Solution />
      <AIAgents />
      <WorkflowAnimation />
      <Features />
      <ArchitecturePreview />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
