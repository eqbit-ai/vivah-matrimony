'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Heart,
  Shield,
  Users,
  Search,
  Star,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Quote,
  CheckCircle2,
} from 'lucide-react';

// Navbar Component
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="font-display text-2xl font-bold text-gradient">JMD Shaadi</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">How It Works</a>
            <a href="#testimonials" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Success Stories</a>
            <Link href="/login" className="px-6 py-2.5 text-primary-600 font-semibold hover:bg-primary-50 rounded-xl transition-colors">Login</Link>
            <Link href="/signup" className="btn-primary">Sign Up Free</Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <a href="#features" className="block text-gray-700 font-medium">Features</a>
            <a href="#how-it-works" className="block text-gray-700 font-medium">How It Works</a>
            <a href="#testimonials" className="block text-gray-700 font-medium">Success Stories</a>
            <div className="pt-4 space-y-3">
              <Link href="/login" className="block w-full text-center py-3 border-2 border-primary-500 text-primary-600 font-semibold rounded-xl">Login</Link>
              <Link href="/signup" className="block w-full text-center py-3 bg-primary-600 text-white font-semibold rounded-xl">Sign Up Free</Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

// Hero Section
function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
      <motion.div style={{ y: y1 }} className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
      <motion.div style={{ y: y2 }} className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl" />
      <div className="absolute inset-0 mandala-overlay" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="font-hindi text-xl text-primary-600 mb-4">"सात जन्मों का साथ, एक पवित्र बंधन"</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-gray-900">Find Your</span><br />
            <span className="text-gradient">Perfect Life Partner</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Begin your journey to eternal love. Join thousands of families who found their perfect match through JMD Shaadi Matrimony.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />Start Your Journey<ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="#how-it-works">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-outline text-lg px-8 py-4">Learn More</motion.button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[{ number: '50,000+', label: 'Happy Couples' }, { number: '1,00,000+', label: 'Verified Profiles' }, { number: '98%', label: 'Success Rate' }].map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }} className="text-center">
                <p className="text-4xl font-bold text-gradient-gold">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-primary-400 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-400 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    { icon: Shield, title: 'Verified Profiles', description: 'Every profile is manually verified by our team to ensure authenticity and safety.', color: 'from-green-400 to-emerald-500' },
    { icon: Search, title: 'Smart Matchmaking', description: 'Our intelligent algorithm finds the most compatible matches based on your preferences.', color: 'from-blue-400 to-cyan-500' },
    { icon: Users, title: 'Family Involvement', description: 'Designed to involve families in the matchmaking process, respecting Indian traditions.', color: 'from-purple-400 to-pink-500' },
    { icon: Heart, title: 'Privacy Protected', description: 'Your personal information is kept secure and only shared with your consent.', color: 'from-primary-400 to-rose-500' },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-primary-50/30 to-white" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-secondary-500 font-semibold uppercase tracking-wider">Why Choose Us</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">Features That Make Us <span className="text-gradient">Special</span></h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">We combine traditional values with modern technology to help you find your perfect match.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }} className="glass-card p-8 card-hover group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    { step: '01', title: 'Create Your Profile', description: 'Sign up and create a detailed profile with your preferences, photos, and family background.' },
    { step: '02', title: 'Discover Matches', description: 'Browse through verified profiles and use our smart filters to find compatible partners.' },
    { step: '03', title: 'Express Interest', description: 'Like profiles you find interesting and express your interest to connect.' },
    { step: '04', title: 'Meet & Connect', description: 'Once both parties express interest, connect and plan your meeting.' },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-secondary-400 font-semibold uppercase tracking-wider">Simple Process</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">How <span className="text-gradient-gold">JMD Shaadi</span> Works</h2>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">Your journey to finding the perfect partner is just four simple steps away.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div key={step.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }} className="relative">
              {index < steps.length - 1 && <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-secondary-400 to-transparent" />}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-6xl font-bold text-secondary-400/30 mb-4">{step.step}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-primary-200">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    { name: 'Priya & Rahul Sharma', location: 'Mumbai, Maharashtra', quote: 'We found each other on JMD Shaadi and knew instantly that we were meant to be. The platform made it so easy for our families to connect.', married: 'Married in January 2024' },
    { name: 'Sneha & Amit Patel', location: 'Ahmedabad, Gujarat', quote: 'The verification process gave us confidence. Within 3 months, we found our perfect match. Thank you, Vivah!', married: 'Married in March 2024' },
    { name: 'Ananya & Vikram Singh', location: 'Delhi, NCR', quote: "JMD Shaadi's smart matching algorithm understood exactly what we were looking for. Our hearts matched perfectly!", married: 'Married in December 2023' },
  ];

  return (
    <section id="testimonials" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-secondary-50/30 to-white" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-secondary-500 font-semibold uppercase tracking-wider">Success Stories</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">Couples Who Found <span className="text-gradient">Love</span></h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Real stories from real couples who found their happily ever after.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div key={testimonial.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="glass-card p-8 relative">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-secondary-200" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-xl">
                  {testimonial.name.split(' ')[0][0]}{testimonial.name.split(' ')[2]?.[0] || testimonial.name.split(' ')[1][0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-2 text-secondary-600">
                <Heart className="w-4 h-4" fill="currentColor" />
                <span className="text-sm font-medium">{testimonial.married}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Marriage Message Section
function MarriageMessageSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DAA520' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <Heart className="w-16 h-16 mx-auto mb-6 text-secondary-400" fill="currentColor" />
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Marriage is a Sacred Bond</h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            In Indian culture, marriage is not just a union of two individuals but a coming together of two families,
            two souls, and two destinies. It's a celebration of love, commitment, and the promise of a lifetime together.
          </p>
          <p className="font-hindi text-2xl text-secondary-300 mb-8">"विवाह एक पवित्र बंधन है जो दो आत्माओं को जोड़ता है"</p>
          <div className="flex flex-wrap justify-center gap-6">
            {['Trust', 'Respect', 'Love', 'Commitment', 'Family'].map((value, index) => (
              <motion.div key={value} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-secondary-400" />
                <span className="font-medium">{value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card-gold p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" />
          <Sparkles className="w-12 h-12 mx-auto mb-6 text-secondary-500" />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">Ready to Find Your Soulmate?</h2>
          <p className="text-xl text-gray-600 mb-8">Join millions of happy couples who found their perfect match on JMD Shaadi Matrimony.</p>
          <Link href="/signup">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary text-lg px-10 py-4">
              Create Free Profile <ArrowRight className="inline w-5 h-5 ml-2" />
            </motion.button>
          </Link>
          <p className="mt-6 text-sm text-gray-500">Free registration • 100% verified profiles • Privacy protected</p>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="font-display text-2xl font-bold">JMD Shaadi</span>
            </div>
            <p className="text-gray-400 mb-4">India's most trusted matrimonial platform for finding your perfect life partner.</p>
            <div className="flex gap-4">
              {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <span className="sr-only">{social}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Success Stories', 'Membership Plans', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}><a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Help & Support</h4>
            <ul className="space-y-2">
              {['FAQs', 'Contact Us', 'Safety Tips', 'Report Misuse', 'Feedback'].map((link) => (
                <li key={link}><a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-secondary-400" /><span className="text-gray-400">+91 77400 56098</span></li>
              <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-secondary-400" /><span className="text-gray-400">support@jmdshaadi.com</span></li>
              <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-secondary-400 mt-1" /><span className="text-gray-400">Khanna,Punjab India</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} JMD Shaadi Matrimony. All rights reserved. Made with ❤️ in India by Eqbit Ai</p>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page
export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <MarriageMessageSection />
      <CTASection />
      <Footer />
    </main>
  );
}
