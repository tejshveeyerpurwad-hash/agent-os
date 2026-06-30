import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight, GitBranch, Globe, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ROUTES } from '@/utils/constants'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toast'

export function Register() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({})

  function validate() {
    const errs: typeof errors = {}
    if (!name.trim()) errs.name = 'Name is required'
    else if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email address'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) errs.password = 'Must include uppercase, lowercase & number'
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      await login({ email, password, name })
      toast('success', 'Account created!', 'Welcome to AgentOS. Redirecting...')
      setTimeout(() => navigate(ROUTES.DASHBOARD, { replace: true }), 500)
    } catch {
      toast('error', 'Registration failed', 'Could not create your account. Please try again.')
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

          <h1 className="text-2xl font-bold text-dark-100 mb-1">Create your account</h1>
          <p className="text-sm text-dark-400 mb-8">Join AgentOS and orchestrate your AI workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-dark-300 mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })) }}
                  placeholder="John Doe"
                  className={cn(
                    'w-full bg-dark-900/50 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-dark-100 placeholder:text-dark-600',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/40 transition-all',
                    errors.name ? 'border-red-500/40' : 'border-border-light hover:border-dark-600',
                  )}
                />
              </div>
              {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name}</p>}
            </div>

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
                  placeholder="Create a strong password"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-dark-300 mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500 pointer-events-none" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: undefined })) }}
                  placeholder="Repeat your password"
                  className={cn(
                    'w-full bg-dark-900/50 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-dark-100 placeholder:text-dark-600',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/40 transition-all',
                    errors.confirmPassword ? 'border-red-500/40' : 'border-border-light hover:border-dark-600',
                  )}
                />
              </div>
              {errors.confirmPassword && <p className="text-[10px] text-red-400 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Sign Up Button */}
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
              {isLoading ? 'Creating account...' : 'Create Account'}
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

          {/* Sign In Link */}
          <p className="mt-8 text-center text-xs text-dark-500">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in
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
          <h2 className="text-xl font-bold text-dark-100 mb-2">Start Free, Scale Fast</h2>
          <p className="text-sm text-dark-400 leading-relaxed">
            Get started with 8 specialized AI agents, real-time execution pipelines, and enterprise-grade analytics. No credit card required.
          </p>
          <div className="mt-6 flex flex-col gap-2 text-left">
            {[
              'Full access to all 8 AI agents',
              '100+ workflow executions per month',
              'Real-time collaboration & communication',
              'Executive business reports & analytics',
              'Community support & documentation',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 text-xs text-dark-400"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400 shrink-0" />
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
