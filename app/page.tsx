'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Particles } from '@/components/ui/particles';
import { BarChart3, Zap, Lock, ArrowRight } from 'lucide-react';
import { fadeIn, slideUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Hero Section with 3D Background */}
      <motion.section
        initial="initial"
        animate="animate"
        className="container mx-auto px-4 py-20 text-center relative overflow-hidden"
      >
        <motion.div {...slideUp} className="max-w-4xl mx-auto relative z-10">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ 
              color: '#e5e5e5',
              letterSpacing: '-0.02em',
              lineHeight: '1.1'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Manage All Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0033AD] via-[#0055D4] to-[#00D4AA] animate-gradient">
              Crypto Subscriptions
            </span>{' '}
            in One Place
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl mb-12"
            style={{ 
              color: '#8a8a8a',
              lineHeight: '1.6',
              maxWidth: '900px',
              margin: '0 auto 3rem'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Track, optimize, and cancel subscriptions with privacy-first design. Built with Tailwind CSS, this component delivers pixel-perfect, responsive hero sections that adapt beautifully across all devices.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-4 group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Launch Demo
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#0033AD] to-[#00D4AA]"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle top gradient */}
          <div 
            className="absolute top-0 left-0 right-0 h-96"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(0, 51, 173, 0.08) 0%, transparent 60%)',
            }}
          />
          
          {/* Subtle bottom gradient */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-96"
            style={{
              background: 'radial-gradient(ellipse at bottom, rgba(0, 212, 170, 0.05) 0%, transparent 60%)',
            }}
          />
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="container mx-auto px-4 py-20"
      >
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(0, 51, 173, 0.4)' }}
            className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 rounded-xl border border-[#334155] hover:border-[#0033AD] transition-all duration-300 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#0033AD]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div className="relative z-10">
              <motion.div 
                className="bg-[#0033AD]/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <BarChart3 className="h-8 w-8 text-[#0033AD]" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-[#F8FAFC] mb-4">
                Unified Dashboard
              </h3>
              <p className="text-[#94A3B8]">
                See all your subscriptions, spending trends, and upcoming payments in one beautiful interface
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={staggerItem}
            whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(0, 212, 170, 0.4)' }}
            className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 rounded-xl border border-[#334155] hover:border-[#00D4AA] transition-all duration-300 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#00D4AA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div className="relative z-10">
              <motion.div 
                className="bg-[#00D4AA]/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Zap className="h-8 w-8 text-[#00D4AA]" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-[#F8FAFC] mb-4">
                Hydra-Ready
              </h3>
              <p className="text-[#94A3B8]">
                Lightning-fast payments with Cardano's Layer 2 solution. 100x faster, 95% cheaper
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={staggerItem}
            whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)' }}
            className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 rounded-xl border border-[#334155] hover:border-[#10B981] transition-all duration-300 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div className="relative z-10">
              <motion.div 
                className="bg-[#10B981]/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Lock className="h-8 w-8 text-[#10B981]" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-[#F8FAFC] mb-4">
                Privacy-First
              </h3>
              <p className="text-[#94A3B8]">
                Your data, your control. No tracking, no profiling. Export or delete anytime
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-20"
      >
        <h2 className="text-4xl font-bold text-center text-[#F8FAFC] mb-16">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-1 text-center"
          >
            <div className="bg-gradient-to-br from-[#0033AD] to-[#0029] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">Connect</h3>
            <p className="text-[#94A3B8]">Link your Cardano wallet</p>
          </motion.div>

          <div className="hidden md:block text-[#00D4AA] text-3xl">→</div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-1 text-center"
          >
            <div className="bg-gradient-to-br from-[#00D4AA] to-[#00c299] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#0F172A]">
              2
            </div>
            <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">Track</h3>
            <p className="text-[#94A3B8]">Monitor all subscriptions</p>
          </motion.div>

          <div className="hidden md:block text-[#00D4AA] text-3xl">→</div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-1 text-center"
          >
            <div className="bg-gradient-to-br from-[#10B981] to-[#059669] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">Optimize</h3>
            <p className="text-[#94A3B8]">Save money, stay in control</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-[#334155]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-[#0033AD] w-8 h-8 rounded-lg" />
            <span className="text-[#F8FAFC] font-semibold text-lg">Subscrybe</span>
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="https://github.com/subscrybe" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
              GitHub
            </a>
            <a href="https://docs.subscrybe.io" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
              Documentation
            </a>
            <a href="https://cardanoscan.io" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
              Explorer
            </a>
            <a href="https://hydra.family" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
              Hydra
            </a>
          </div>

          <div className="text-[#94A3B8] text-sm text-center md:text-right">
            Built on Cardano • Privacy-First by Design
            <br />
            <span className="text-xs">Powered by Hydra Layer 2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
