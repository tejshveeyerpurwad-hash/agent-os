import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, GitBranch, Globe, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ROUTES } from '@/utils/constants'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toast'

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  function validate() {
    const errs: typeof errors = {}
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email address'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      await login({ email, password })
      toast('success', 'Welcome back!', 'Redirecting to dashboard...')
      setTimeout(() => navigate(ROUTES.DASHBOARD, { replace: true }), 500)
    } catch {
      toast('error', 'Login failed', 'Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-8">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-dark-100">AgentOS</span>
          </Link>

          <h1 className="text-2xl font-bold text-dark-100 mb-1">Welcome back</h1>
          <p className="text-sm text-dark-400 mb-8">Sign in to your AgentOS workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-dark-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })) }}
                  placeholder="you@company.com"
                  className={cn(
                    'w-full bg-dark-900/50 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-dark-100 placeholder:text-dark-600',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/40 transition-all',
                    errors.email ? 'border-red-500/40' : 'border-border-light hover:border-dark-600',
                  )}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-dark-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })) }}
                  placeholder="Enter your password"
                  className={cn(
                    'w-full bg-dark-900/50 border rounded-xl pl-10 pr-10 py-2.5 text-sm text-dark-100 placeholder:text-dark-600',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/40 transition-all',
                    errors.password ? 'border-red-500/40' : 'border-border-light hover:border-dark-600',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-400 mt-1">{errors.password}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-border-light bg-dark-900/50 text-primary-500 focus:ring-primary-500/30 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs text-dark-400">Remember me</span>
              </label>
              <button type="button" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.01 } : {}}
              whileTap={!isLoading ? { scale: 0.99 } : {}}
              className={cn(
                'w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all',
                isLoading
                  ? 'bg-primary-500/50 text-white/70 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600 shadow-glow',
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-light" /></div>
            <div className="relative flex justify-center"><span className="px-3 text-[10px] text-dark-500 bg-surface">or continue with</span></div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-light bg-dark-900/50 hover:bg-dark-800/50 hover:border-dark-600 transition-all text-xs text-dark-300">
              <Globe className="h-4 w-4" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-light bg-dark-900/50 hover:bg-dark-800/50 hover:border-dark-600 transition-all text-xs text-dark-300">
              <GitBranch className="h-4 w-4" />
              GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-xs text-dark-500">
            Don&apos;t have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500/[0.03] to-accent-500/[0.03] border-l border-border-light items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-sm text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/10 flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Sparkles className="h-10 w-10 text-primary-400" />
          </div>
          <h2 className="text-xl font-bold text-dark-100 mb-2">AI-Powered Workspace</h2>
          <p className="text-sm text-dark-400 leading-relaxed">
            Your autonomous AI operating system. Deploy intelligent agents, automate workflows, and execute business objectives in parallel — all from one command center.
          </p>
          <div className="mt-6 flex flex-col gap-2 text-left">
            {[
              '8 specialized AI agents at your command',
              'Real-time parallel task execution',
              'Automated knowledge retrieval & analysis',
              'Executive reports with actionable insights',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 text-xs text-dark-400"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
