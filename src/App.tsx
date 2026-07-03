import React, { useState, useEffect } from 'react'
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useReducedMotion 
} from 'framer-motion'
import { 
  Zap, 
  Phone, 
  ShieldCheck, 
  Award, 
  Star, 
  MapPin, 
  Menu, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown,
  ThumbsUp
} from 'lucide-react'

// Define the Service type
interface Service {
  id: string
  title: string
  description: string
  categories: ('residential' | 'commercial' | 'specialty')[]
  image: string
  details: string[]
}

// Define the Testimonial type
interface Testimonial {
  id: number
  name: string
  text: string
  rating: number
  source: string
}

// Define the FAQ type
interface FAQItem {
  question: string
  answer: string
}

export default function App() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  
  // Navigation states
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Signature Moment states
  const [activeCategory, setActiveCategory] = useState<'all' | 'residential' | 'commercial' | 'specialty'>('all')
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  // FAQ states
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0)

  // Form submission state
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '', serviceType: 'Residential' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Testimonials carousel index
  const [activeReviewIndex, setActiveReviewIndex] = useState(0)

  // Scroll event observer
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 80)
    })
  }, [scrollY])

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setFormSubmitted(true)
    }, 1500)
  }

  // Data declarations
  const services: Service[] = [
    {
      id: 'wiring',
      title: 'Commercial & Residential Wiring',
      description: 'Full-service electrical installation and maintenance for homes and businesses.',
      categories: ['residential', 'commercial'],
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
      details: ['Complete house rewiring', 'Troubleshooting & repairs', 'New outlet & switch installations', 'GFCI outlet setups']
    },
    {
      id: 'meter',
      title: 'New Meter Installation',
      description: 'Safe, code-compliant meter and service panel setup.',
      categories: ['residential', 'commercial', 'specialty'],
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      details: ['Meter box relocations', 'Temporary power connections', 'Service mast upgrades', 'Utility coordination']
    },
    {
      id: 'ev',
      title: 'EV Charger Installation',
      description: 'Certified installation for Tesla, ChargePoint, and all EV brands.',
      categories: ['residential', 'commercial', 'specialty'],
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
      details: ['Tesla Wall Connector setup', 'Level 2 EV installations', 'Electrical load assessments', 'Dedicated circuit setups']
    },
    {
      id: 'landscape',
      title: 'Landscape & Outdoor Lighting',
      categories: ['residential'],
      description: 'Create a stunning and secure outdoor space with weatherproof lighting.',
      image: 'https://images.unsplash.com/photo-1565538810844-1e119ab60ffc?auto=format&fit=crop&q=80&w=800',
      details: ['Low-voltage patio lighting', 'Pathway & architectural lights', 'Motion sensor floodlights', 'Smart timer controls']
    },
    {
      id: 'panel',
      title: 'Panel Upgrades',
      description: 'Increase your electrical capacity safely with modern breaker panels.',
      categories: ['residential', 'commercial'],
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800',
      details: ['100A to 200A upgrades', 'Fuse box replacements', 'Subpanel installations', 'Breaker replacements']
    },
    {
      id: 'lighting',
      title: 'Lighting Solutions',
      description: 'Ceiling fans, recessed lighting, patio and pool lighting, and more.',
      categories: ['residential'],
      image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=800',
      details: ['LED recessed lighting', 'Ceiling fan installs', 'Chandelier & pendant hanging', 'Dimmer switch upgrades']
    }
  ]

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Brian P.',
      text: '¡828 Electric es genial! Llamé justo después de que cerraran y aun así me atendieron enseguida. Los técnicos vinieron a mi casa a primera hora de la mañana para diagnosticar un problema eléctrico. Trabajaron rápido, solucionaron el problema y todos fueron profesionales y muy amables.',
      rating: 5,
      source: 'Google Review'
    },
    {
      id: 2,
      name: 'Francisco O.',
      text: 'Angel is professional, on time and trustworthy. Highly recommended. Angel y su compañia son super profesionales y honestos. Trabajo muy bien con ellos.',
      rating: 5,
      source: 'Google Review'
    },
    {
      id: 3,
      name: 'Carlo Q.',
      text: 'Trabajar con el equipo de 828 siempre ha sido fantástico. Los hemos contratado en muchos proyectos y siempre han sido justos, puntuales y un placer trabajar con ellos. Recomiendo ampliamente 828 para trabajos eléctricos residenciales y comerciales.',
      rating: 5,
      source: 'Google Review'
    },
    {
      id: 4,
      name: 'Eli',
      text: 'Angel nos explicó todo el proceso de la consulta. Javy fue excelente con la instalación y lo explicó todo con detalle. El equipo fue muy profesional.',
      rating: 5,
      source: 'Google Review'
    }
  ]

  const faqs: FAQItem[] = [
    {
      question: 'Do you offer free estimates?',
      answer: 'No, we do not offer free estimates. However, you can call to speak with one of our licensed electricians who can provide an estimated price range over the phone. For on-site evaluations, we schedule appointments to ensure accurate, professional assessments.'
    },
    {
      question: 'Are your electricians licensed and insured?',
      answer: 'Yes! All of our electricians are fully licensed and insured professionals. At 828 Electric LLC, we take pride in delivering safe, code-compliant electrical work for both residential and commercial projects.'
    },
    {
      question: 'What types of electrical work do you handle?',
      answer: 'We handle all commercial and residential electrical services, including panel upgrades, new meter installations, EV charger setups, ceiling fan installations, recessed lighting, landscape and patio lighting, and more.'
    },
    {
      question: 'Do you install EV chargers?',
      answer: 'Absolutely. We’re certified to install EV chargers for all brands, including Tesla, ChargePoint, and other major models. Whether for your home or business, we ensure your EV charger is safely installed and up to code.'
    },
    {
      question: 'What makes 828 Electric different from other electricians in El Paso?',
      answer: 'We’re a family-owned and operated business with over 8 years of experience and a long-standing BBB accreditation. We believe in integrity, transparency, and doing the job right the first time – so our customers can trust us for life.'
    }
  ]

  // Filtered services
  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(s => s.categories.includes(activeCategory))

  // Framer Motion spring definition
  const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
  }

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  }


  return (
    <div className="min-h-screen bg-brand-white text-brand-charcoal overflow-x-hidden font-body selection:bg-brand-red selection:text-white">
      
      {/* 1. STICKY HEADER */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(9, 9, 9, 0.4)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'blur(0px)',
          borderBottom: isScrolled ? '1px solid var(--color-brand-gray-border)' : '1px solid rgba(255,255,255,0.05)'
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 lg:py-5 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-brand-red flex items-center justify-center text-white transition-transform group-hover:scale-110">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-extrabold text-lg tracking-wider leading-none ${isScrolled ? 'text-brand-dark' : 'text-white'}`}>8/28</span>
              <span className={`font-display font-semibold text-xs tracking-widest ${isScrolled ? 'text-brand-red' : 'text-brand-red-light'}`}>ELECTRIC</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 font-display font-semibold text-sm">
            {[
              { label: 'HOME', href: '#' },
              { label: 'ABOUT', href: '#about' },
              { label: 'SERVICES', href: '#services' },
              { label: 'FAQ', href: '#faq' },
              { label: 'REVIEWS', href: '#reviews' }
            ].map((link) => (
              <a 
                key={link.label}
                href={link.href}
                className={`relative py-2 transition-colors ${isScrolled ? 'text-brand-charcoal hover:text-brand-red' : 'text-white/80 hover:text-white'}`}
              >
                {link.label}
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-red origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25 }}
                />
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="tel:+19152137178"
              className="flex items-center gap-2 font-display font-bold text-sm bg-brand-red text-white py-2.5 px-5 rounded-full transition-transform hover:scale-105 shadow-md shadow-brand-red/10 hover:shadow-brand-red/35 active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>(915) 213-7178</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'text-brand-dark hover:bg-brand-gray-light' : 'text-white hover:bg-white/10'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-brand-white z-50 shadow-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-brand-red flex items-center justify-center text-white">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <span className="font-display font-extrabold text-brand-dark text-lg leading-none">8/28 ELECTRIC</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-brand-gray-light text-brand-charcoal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-6 font-display font-semibold text-base text-brand-charcoal">
                  {[
                    { label: 'HOME', href: '#' },
                    { label: 'ABOUT', href: '#about' },
                    { label: 'SERVICES', href: '#services' },
                    { label: 'FAQ', href: '#faq' },
                    { label: 'REVIEWS', href: '#reviews' }
                  ].map((link) => (
                    <a 
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="hover:text-brand-red transition-colors py-2 border-b border-brand-gray-border"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <a 
                  href="tel:+19152137178"
                  className="flex items-center justify-center gap-2 bg-brand-red text-white py-3 px-6 rounded-xl font-display font-bold hover:bg-brand-red-dark transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call (915) 213-7178</span>
                </a>
                <p className="text-xs text-brand-charcoal/60 text-center font-display">
                  Serving El Paso & surrounding areas.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* 2. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 px-6 md:px-12 gradient-mesh text-white overflow-hidden">
        {/* Animated Shapes / Background layers */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <motion.div 
            animate={{ 
              x: shouldReduceMotion ? 0 : [0, 40, -40, 0],
              y: shouldReduceMotion ? 0 : [0, -50, 50, 0],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-brand-red filter blur-3xl"
          />
          <motion.div 
            animate={{ 
              x: shouldReduceMotion ? 0 : [0, -30, 30, 0],
              y: shouldReduceMotion ? 0 : [0, 60, -60, 0],
              scale: [1, 0.9, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-brand-red-light filter blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Copy (Staggered Entrance) */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center justify-center lg:justify-start gap-2 bg-white/10 backdrop-blur-md border border-white/20 py-1.5 px-4 rounded-full text-brand-red-light font-display font-semibold text-xs tracking-wider mb-6 w-fit mx-auto lg:mx-0">
              <ShieldCheck className="w-4 h-4" />
              <span>LICENSED & INSURED ELECTRICAL CONTRACTORS</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="font-display font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.1] tracking-tight mb-6"
            >
              Trustworthy Electricians. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red-light via-brand-red to-white">
                Electrical Solutions
              </span><br />
              for Homes & Business.
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg text-white/80 max-w-xl mb-8 leading-relaxed font-light mx-auto lg:mx-0"
            >
              At 828 Electric, we provide professional commercial and residential services in El Paso. From panels and meters to EV charging, we get the job done right the first time.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <motion.a 
                href="tel:+19152137178"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden w-full sm:w-auto bg-brand-red text-white py-4 px-8 rounded-xl font-display font-bold text-base shadow-lg shadow-brand-red/35 flex items-center justify-center gap-2 group"
              >
                {/* Hover Shimmer Effect */}
                <motion.span 
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.75, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                />
                <Phone className="w-5 h-5 fill-current" />
                <span>Call (915) 213-7178</span>
              </motion.a>

              <motion.a 
                href="#services"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 py-4 px-8 rounded-xl font-display font-bold text-base flex items-center justify-center gap-2 transition-colors"
              >
                <span>View Our Services</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.a>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-3 gap-6 pt-12 mt-12 border-t border-white/10 max-w-lg mx-auto lg:mx-0"
            >
              {[
                { val: '8+', label: 'Years Experience' },
                { val: 'A+', label: 'BBB Rating' },
                { val: 'Top 5', label: 'El Paso Magazine' }
              ].map((m) => (
                <div key={m.label} className="text-center lg:text-left">
                  <div className="font-display font-black text-2xl lg:text-3xl text-brand-red-light">{m.val}</div>
                  <div className="text-xs text-white/60 uppercase tracking-widest mt-1 font-semibold">{m.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Media Layer */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 group">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800" 
                alt="828 Electric Professional Work" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Floating Overlay Badge */}
              <motion.div 
                animate={{ y: shouldReduceMotion ? 0 : [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-6 left-6 right-6 z-20 bg-brand-dark-light/90 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-red/20 flex items-center justify-center text-brand-red-light shrink-0">
                  <Award className="w-7 h-7" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm text-white">Award-Winning Standard</span>
                  <span className="text-xs text-white/60">Ranked Top 5 Best Electricians in El Paso</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* 3. ABOUT US & KEY HIGHLIGHTS */}
      <section id="about" className="py-24 px-6 md:px-12 bg-brand-gray-light relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="font-display font-bold text-brand-red tracking-widest text-xs uppercase block mb-3">ABOUT US</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-brand-dark leading-tight mb-4">
              Top Electricians in Texas
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mb-6 rounded-full" />
            <p className="text-brand-charcoal text-base md:text-lg leading-relaxed">
              At 828 Electric, we’re proud to be a family-owned and operated electrical company serving the El Paso area for over eight years. Our licensed and insured electricians provide dependable commercial and residential electrical services.
            </p>
          </motion.div>

          {/* highlights 3-card grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Family-Owned & Operated',
                desc: 'For over 8 years, our family has proudly powered homes and businesses across El Paso. We treat every project like it’s for our own home.',
                icon: <ThumbsUp className="w-6 h-6" />,
                img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400'
              },
              {
                title: 'Licensed, Insured & BBB Accredited',
                desc: 'We’re fully licensed, insured, and accredited by the Better Business Bureau with 8 years of trusted service. Professional work, done right the first time.',
                icon: <ShieldCheck className="w-6 h-6" />,
                img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400'
              },
              {
                title: 'Top 5 Best Electricians in El Paso',
                desc: 'Recognized by El Paso Magazine for our quality and customer satisfaction. Trusted by families and businesses since 2017.',
                icon: <Award className="w-6 h-6" />,
                img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400'
              }
            ].map((card) => (
              <motion.div 
                key={card.title}
                variants={fadeInUp}
                whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                transition={springTransition}
                className="bg-brand-white border border-brand-gray-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center shadow-lg">
                    {card.icon}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-brand-dark mb-3">{card.title}</h3>
                    <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light">{card.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* 4. SERVICES - SIGNATURE MOMENT (TABBED Card Reflow Grid) */}
      <section id="services" className="py-24 px-6 md:px-12 bg-brand-white relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-display font-bold text-brand-red tracking-widest text-xs uppercase block mb-3">WHAT DO WE OFFER?</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-brand-dark leading-tight mb-4">
              Reliable Electric Services
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mb-6 rounded-full" />
            <p className="text-brand-charcoal text-base">
              From residential repairs to large-scale commercial installations, our licensed and insured electricians specialize in keeping your property safe and efficient.
            </p>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {(['all', 'residential', 'commercial', 'specialty'] as const).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category)
                  setSelectedService(null) // Reset detail dialog
                }}
                className={`px-6 py-2.5 rounded-full font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 border ${
                  activeCategory === category 
                    ? 'bg-brand-red border-brand-red text-white shadow-md shadow-brand-red/25' 
                    : 'bg-brand-gray-light border-brand-gray-border text-brand-charcoal hover:bg-brand-gray-border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Staggered dynamic cards container with layoutId */}
          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={service.id}
                  whileHover={{ y: -8 }}
                  className="bg-brand-gray-light rounded-2xl border border-brand-gray-border overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl hover:border-brand-red/30 transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white text-xs font-display font-semibold tracking-widest uppercase bg-brand-red py-1 px-3 rounded-full">
                        {service.categories.join(' / ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-brand-dark mb-2 group-hover:text-brand-red transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light mb-6">
                        {service.description}
                      </p>
                    </div>

                    <button 
                      onClick={() => setSelectedService(service)}
                      className="inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-brand-red hover:text-brand-red-dark group-hover:gap-3 transition-all"
                    >
                      <span>Explore Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Signature Moment: Details Lightbox overlay */}
      <AnimatePresence>
        {selectedService && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-brand-dark z-50 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="fixed inset-x-4 bottom-4 md:inset-y-16 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-brand-white z-50 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 flex flex-col justify-between border border-brand-gray-border"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-display font-bold text-brand-red tracking-widest uppercase bg-brand-red/10 px-3 py-1 rounded-full">
                    {selectedService.categories.join(' / ')} Service
                  </span>
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="p-1.5 rounded-full hover:bg-brand-gray-light text-brand-charcoal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <h3 className="font-display font-extrabold text-2xl text-brand-dark mb-4">
                  {selectedService.title}
                </h3>
                <p className="text-sm text-brand-charcoal/80 mb-6 font-light">
                  {selectedService.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-display font-bold text-sm text-brand-dark mb-3 uppercase tracking-wider">What We Provide:</h4>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {selectedService.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-sm text-brand-charcoal/80">
                        <CheckCircle2 className="w-4.5 h-4.5 text-brand-red shrink-0 mt-0.5" />
                        <span className="font-light">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-brand-gray-border mt-6">
                <a 
                  href="tel:+19152137178"
                  className="flex-1 bg-brand-red hover:bg-brand-red-dark text-white text-center py-3.5 px-6 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20 transition-all"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Call (915) 213-7178</span>
                </a>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="flex-1 border border-brand-gray-border hover:bg-brand-gray-light py-3.5 px-6 rounded-xl font-display font-bold text-sm text-brand-charcoal transition-all"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* 5. FAQ SECTION */}
      <section id="faq" className="py-24 px-6 md:px-12 bg-brand-gray-light relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
          {/* FAQ Left Block */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="font-display font-bold text-brand-red tracking-widest text-xs uppercase block mb-3">POPULAR QUESTIONS</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-brand-dark leading-tight mb-6">
              Get Answers to Your Questions
            </h2>
            <div className="w-16 h-1 bg-brand-red mb-6 rounded-full" />
            <p className="text-brand-charcoal text-base mb-8 font-light leading-relaxed">
              Electrical projects can raise a lot of questions. Here are answers to some of the most common ones our El Paso customers ask. Still need help? Call us and we will guide you.
            </p>
            
            <a 
              href="tel:+19152137178"
              className="inline-flex items-center justify-center gap-2 bg-brand-dark text-white py-4 px-6 rounded-xl font-display font-bold text-sm hover:bg-brand-dark-light transition-colors self-start shadow-md"
            >
              <Phone className="w-4.5 h-4.5" />
              <span>Call (915) 213-7178</span>
            </a>
          </div>

          {/* FAQ Right Accordions */}
          <div className="lg:col-span-7 flex flex-col gap-4 w-full">
            {faqs.map((faq, index) => {
              const isOpen = openFAQIndex === index
              return (
                <div 
                  key={index}
                  className="bg-brand-white border border-brand-gray-border rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFAQIndex(isOpen ? null : index)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 font-display font-bold text-base text-brand-dark"
                  >
                    <span>{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isOpen ? 'bg-brand-red text-white' : 'bg-brand-gray-light text-brand-charcoal'}`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 text-sm text-brand-charcoal/80 leading-relaxed font-light border-t border-brand-gray-border/50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>


      {/* 6. SOCIAL PROOF / REVIEWS SECTION */}
      <section id="reviews" className="py-24 px-6 md:px-12 bg-brand-white relative overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-display font-bold text-brand-red tracking-widest text-xs uppercase block mb-3">TESTIMONIALS</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-brand-dark leading-tight mb-4">
              What Our Clients Say
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mb-6 rounded-full" />
            <p className="text-brand-charcoal text-base">
              Don’t take our word for it. Here is what homeowners and business owners across El Paso think of our services.
            </p>
          </div>

          {/* Testimonial slider layout */}
          <div className="max-w-4xl mx-auto relative px-4">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReviewIndex}
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -50 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="bg-brand-gray-light border border-brand-gray-border p-8 md:p-12 rounded-3xl relative flex flex-col justify-between min-h-[300px] shadow-sm"
                >
                  <div>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-6 text-brand-red">
                      {[...Array(testimonials[activeReviewIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    {/* Content text */}
                    <p className="text-base md:text-lg text-brand-dark font-light italic leading-relaxed mb-6">
                      "{testimonials[activeReviewIndex].text}"
                    </p>
                  </div>
                  {/* Review Source Info */}
                  <div className="flex items-center justify-between border-t border-brand-gray-border/60 pt-6 mt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center font-display font-bold">
                        {testimonials[activeReviewIndex].name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-display font-bold text-sm text-brand-dark">
                          {testimonials[activeReviewIndex].name}
                        </div>
                        <div className="text-xs text-brand-charcoal/60 uppercase tracking-widest font-semibold">
                          Verified Client
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-display font-bold text-brand-red uppercase tracking-wider bg-brand-red/10 py-1 px-3 rounded-full">
                      {testimonials[activeReviewIndex].source}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveReviewIndex(index)}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${activeReviewIndex === index ? 'bg-brand-red w-8' : 'bg-brand-gray-border hover:bg-brand-charcoal/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* 7. CTA / ESTIMATE REQUEST FORM SECTION */}
      <section className="py-24 px-6 md:px-12 bg-brand-dark text-white relative overflow-hidden">
        {/* Particle Field Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* CTA Info */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <span className="font-display font-bold text-brand-red-light tracking-widest text-xs uppercase block mb-3">GET IN TOUCH</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl leading-tight mb-6">
              Let Us Assist with All Your Electrical Needs
            </h2>
            <p className="text-white/70 text-base mb-8 font-light leading-relaxed">
              We offer fast, safe, and code-compliant electrical work across El Paso, Texas. Have a question or need a budget estimate? Fill out our form, or call us directly!
            </p>
            
            <div className="flex flex-col gap-4 max-w-sm mx-auto lg:mx-0">
              <a 
                href="tel:+19152137178"
                className="flex items-center gap-3 bg-brand-red hover:bg-brand-red-dark text-white py-3.5 px-6 rounded-xl font-display font-bold transition-all shadow-lg shadow-brand-red/15"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-white/60 text-left uppercase leading-none font-bold">Call Now</div>
                  <div className="text-base font-display font-bold mt-0.5 leading-none">(915) 213-7178</div>
                </div>
              </a>
              
              <div className="flex items-center gap-3 bg-brand-dark-light/50 border border-white/10 py-3.5 px-6 rounded-xl font-display text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-white/50 uppercase leading-none font-bold">Office Address</div>
                  <div className="text-sm font-semibold mt-0.5 leading-none">8086 Alameda Ave, El Paso TX</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Interactive Form Container */}
          <div className="lg:col-span-6 w-full">
            <motion.div 
              layout
              className="bg-brand-dark-light border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative"
            >
              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                  >
                    <div>
                      <h3 className="font-display font-extrabold text-xl mb-1">Request a Phone Consultation</h3>
                      <p className="text-xs text-white/60 font-light">Tell us briefly about your project for an estimated price range.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-white/70 font-semibold uppercase tracking-wider">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-white/5 border border-white/15 focus:border-brand-red rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
                          placeholder="e.g. John Doe"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-white/70 font-semibold uppercase tracking-wider">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-white/5 border border-white/15 focus:border-brand-red rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
                          placeholder="e.g. (915) 555-0199"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/70 font-semibold uppercase tracking-wider">Service Needed</label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="bg-brand-dark-light border border-white/15 focus:border-brand-red rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
                      >
                        <option value="Residential">Residential Wiring & Lighting</option>
                        <option value="Commercial">Commercial Installations</option>
                        <option value="Meter">New Meter Setup</option>
                        <option value="Panel">Panel Upgrades</option>
                        <option value="EV Charger">EV Charger Installation</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/70 font-semibold uppercase tracking-wider">Project Details</label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-white/5 border border-white/15 focus:border-brand-red rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white resize-none"
                        placeholder="Tell us what you need help with..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-display font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20 transition-all text-sm uppercase tracking-wider mt-2 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Submit Request</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center py-8 gap-5"
                  >
                    <div className="w-16 h-16 rounded-full bg-brand-red/20 text-brand-red-light flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-10 h-10 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-2xl mb-2 text-white">Thank You, {formData.name}!</h3>
                      <p className="text-sm text-white/75 leading-relaxed font-light max-w-sm">
                        Your request for a **{formData.serviceType}** consultation has been received. Our licensed staff will call you at **{formData.phone}** shortly!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setFormSubmitted(false)
                        setFormData({ name: '', phone: '', email: '', message: '', serviceType: 'Residential' })
                      }}
                      className="border border-white/20 hover:bg-white/10 py-2.5 px-6 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-colors mt-4 text-white/80 hover:text-white"
                    >
                      Submit Another Request
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>


      {/* 8. FOOTER */}
      <footer className="bg-brand-dark text-white border-t border-white/10 pt-16 pb-8 px-6 md:px-12 font-display text-sm">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-brand-red flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="font-extrabold text-lg tracking-wider uppercase leading-none">8/28 ELECTRIC</span>
            </div>
            <p className="text-white/60 text-xs font-body font-light leading-relaxed max-w-xs mt-2">
              Licensed and insured electrical specialists serving El Paso and surrounding communities. Family-owned and operated with over 8 years of trusted expertise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3 font-medium text-white/70">
              <a href="#" className="hover:text-brand-red-light transition-colors">Home</a>
              <a href="#about" className="hover:text-brand-red-light transition-colors">About Us</a>
              <a href="#services" className="hover:text-brand-red-light transition-colors">Services Grid</a>
              <a href="#faq" className="hover:text-brand-red-light transition-colors">FAQs</a>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs mb-4">Contact Details</h4>
            <div className="flex flex-col gap-3 text-white/70 font-body font-light">
              <a href="tel:+19152137178" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-brand-red-light" />
                <span>Primary: (915) 213-7178</span>
              </a>
              <a href="tel:+19152719524" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-brand-red-light" />
                <span>Secondary: (915) 271-9524</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-red-light" />
                <span>8086 Alameda Ave, El Paso, TX 79915</span>
              </div>
            </div>
          </div>

          {/* Socials Col */}
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs mb-4">Follow Us</h4>
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-red transition-all flex items-center justify-center text-white/80 hover:text-white"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-red transition-all flex items-center justify-center text-white/80 hover:text-white"
              >
                <svg className="w-5 h-5 fill-current stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-xs">
          <p>© {new Date().getFullYear()} 828 Electric. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
