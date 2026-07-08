import { useState, useEffect } from 'react'
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useReducedMotion 
} from 'framer-motion'
import { 
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

import patioLighting from './assets/patio-lighting.jpg'
import solarInstall from './assets/solar-install.jpg'
import evCharger from './assets/ev-charger.jpg'
import outletInstall from './assets/outlet-install.jpg'
import solarWiring from './assets/solar-wiring.jpg'
import logo from './assets/logo.png'
import awardTeam from './assets/award-team.jpg'
import meterInstall from './assets/meter-install.jpg'
import wiringHands from './assets/wiring-hands.jpg'
import constructionWorker from './assets/construction-worker.jpg'

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

type Locale = 'en' | 'es'

const content = {
  en: {
    navigation: [
      { label: 'HOME', href: '#' },
      { label: 'ABOUT', href: '#about' },
      { label: 'SERVICES', href: '#services' },
      { label: 'FAQ', href: '#faq' },
      { label: 'REVIEWS', href: '#reviews' }
    ],
    categories: {
      all: 'ALL',
      residential: 'RESIDENTIAL',
      commercial: 'COMMERCIAL',
      specialty: 'SPECIALTY'
    },
    hero: {
      badge: 'Colossians 3:23',
      titleLine1: 'Trustworthy Electricians.',
      titleLine2: 'Electrical Solutions',
      titleLine3: 'for Homes & Business.',
      description: 'At 828 Electric, we provide professional commercial and residential services in El Paso. From panels and meters to EV charging, we get the job done right the first time.',
      primaryCta: 'Call (915) 213-7178',
      secondaryCta: 'View Our Services',
      stats: [
        { val: '8+', label: 'Years Experience' },
        { val: 'A+', label: 'BBB Rating' },
        { val: 'Top 5', label: 'El Paso Magazine' }
      ],
      floatingBadgeTitle: 'Award-Winning Standard',
      floatingBadgeSubtitle: 'Ranked Top 5 Best Electricians in El Paso'
    },
    about: {
      eyebrow: 'ABOUT US',
      heading: 'Top Electricians in Texas',
      description: 'At 828 Electric, we’re proud to be a family-owned and operated electrical company serving the El Paso area for over eight years. Our licensed and insured electricians provide dependable commercial and residential electrical services.',
      cards: [
        {
          title: 'Family-Owned & Operated',
          desc: 'For over 8 years, our family has proudly powered homes and businesses across El Paso. We treat every project like it’s for our own home.',
          img: 'awardTeam'
        },
        {
          title: 'Licensed, Insured & BBB Accredited',
          desc: 'We’re fully licensed, insured, and accredited by the Better Business Bureau with 8 years of trusted service. Professional work, done right the first time.',
          img: 'solarWiring'
        },
        {
          title: 'Top 5 Best Electricians in El Paso',
          desc: 'Recognized by El Paso Magazine for our quality and customer satisfaction. Trusted by families and businesses since 2017.',
          img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400'
        }
      ]
    },
    servicesSection: {
      eyebrow: 'WHAT DO WE OFFER?',
      heading: 'Reliable Electric Services',
      description: 'From residential repairs to large-scale commercial installations, our licensed and insured electricians specialize in keeping your property safe and efficient.',
      explore: 'Explore Details',
      serviceBadge: 'Service',
      detailsTitle: 'What We Provide:',
      close: 'Close Details',
      viewDetails: 'View Details'
    },
    faq: {
      eyebrow: 'POPULAR QUESTIONS',
      heading: 'Get Answers to Your Questions',
      description: 'Electrical projects can raise a lot of questions. Here are answers to some of the most common ones our El Paso customers ask. Still need help? Call us and we will guide you.',
      button: 'Call (915) 213-7178'
    },
    reviews: {
      eyebrow: 'TESTIMONIALS',
      heading: 'What Our Clients Say',
      description: 'Don’t take our word for it. Here is what homeowners and business owners across El Paso think of our services.',
      verified: 'Verified Client'
    },
    cta: {
      eyebrow: 'GET IN TOUCH',
      heading: 'Let Us Assist with All Your Electrical Needs',
      description: 'We offer fast, safe, and code-compliant electrical work across El Paso, Texas. Have a question or need a budget estimate? Call us directly!',
      callNow: 'Call Now',
      officeAddress: 'Office Address',
      address: '8086 Alameda Ave, El Paso TX'
    },
    footer: {
      quickLinks: 'Quick Links',
      home: 'Home',
      aboutUs: 'About Us',
      servicesGrid: 'Services Grid',
      faqs: 'FAQs',
      contactDetails: 'Contact Details',
      primary: 'Primary: (915) 213-7178',
      secondary: 'Secondary: (915) 271-9524',
      followUs: 'Follow Us',
      copyright: '© {year} 828 Electric. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions'
    },
    services: [
      {
        id: 'wiring',
        title: 'Commercial & Residential Wiring',
        description: 'Full-service electrical installation and maintenance for homes and businesses.',
        categories: ['residential', 'commercial'],
        details: ['Complete house rewiring', 'Troubleshooting & repairs', 'New outlet & switch installations', 'GFCI outlet setups']
      },
      {
        id: 'meter',
        title: 'New Meter Installation',
        description: 'Safe, code-compliant meter and service panel setup.',
        categories: ['residential', 'commercial', 'specialty'],
        details: ['Meter box relocations', 'Temporary power connections', 'Service mast upgrades', 'Utility coordination']
      },
      {
        id: 'ev',
        title: 'EV Charger Installation',
        description: 'Certified installation for Tesla, ChargePoint, and all EV brands.',
        categories: ['residential', 'commercial', 'specialty'],
        details: ['Tesla Wall Connector setup', 'Level 2 EV installations', 'Electrical load assessments', 'Dedicated circuit setups']
      },
      {
        id: 'landscape',
        title: 'Landscape & Outdoor Lighting',
        categories: ['residential'],
        description: 'Create a stunning and secure outdoor space with weatherproof lighting.',
        details: ['Low-voltage patio lighting', 'Pathway & architectural lights', 'Motion sensor floodlights', 'Smart timer controls']
      },
      {
        id: 'panel',
        title: 'Panel Upgrades',
        description: 'Increase your electrical capacity safely with modern breaker panels.',
        categories: ['residential', 'commercial'],
        details: ['100A to 200A upgrades', 'Fuse box replacements', 'Subpanel installations', 'Breaker replacements']
      },
      {
        id: 'lighting',
        title: 'Lighting Solutions',
        description: 'Ceiling fans, recessed lighting, patio and pool lighting, and more.',
        categories: ['residential'],
        details: ['LED recessed lighting', 'Ceiling fan installs', 'Chandelier & pendant hanging', 'Dimmer switch upgrades']
      }
    ],
    testimonials: [
      {
        id: 1,
        name: 'Brian P.',
        text: '828 Electric is fantastic! I called right after closing and they still took care of me right away. The technicians came to my home early in the morning to diagnose an electrical issue. They worked quickly, fixed it, and were both professional and very kind.',
        rating: 5,
        source: 'Google Review'
      },
      {
        id: 2,
        name: 'Francisco O.',
        text: 'Angel is professional, on time, and trustworthy. Highly recommended. Angel and his company are super professional and honest. I work very well with them.',
        rating: 5,
        source: 'Google Review'
      },
      {
        id: 3,
        name: 'Carlo Q.',
        text: 'Working with the 828 team has always been fantastic. We have hired them on many projects and they have always been fair, punctual, and a pleasure to work with. I highly recommend 828 for residential and commercial electrical work.',
        rating: 5,
        source: 'Google Review'
      },
      {
        id: 4,
        name: 'Eli',
        text: 'Angel explained the whole process clearly. Javy was excellent with the installation and explained everything in detail. The team was very professional.',
        rating: 5,
        source: 'Google Review'
      }
    ],
    faqs: [
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
  },
  es: {
    navigation: [
      { label: 'INICIO', href: '#' },
      { label: 'NOSOTROS', href: '#about' },
      { label: 'SERVICIOS', href: '#services' },
      { label: 'PREGUNTAS', href: '#faq' },
      { label: 'RESEÑAS', href: '#reviews' }
    ],
    categories: {
      all: 'TODO',
      residential: 'RESIDENCIAL',
      commercial: 'COMERCIAL',
      specialty: 'ESPECIALIDAD'
    },
    hero: {
      badge: 'Colosenses 3:23',
      titleLine1: 'Electricistas de Confianza.',
      titleLine2: 'Soluciones Eléctricas',
      titleLine3: 'para Hogares y Negocios.',
      description: 'En 828 Electric ofrecemos servicios profesionales comerciales y residenciales en El Paso. Desde paneles y medidores hasta carga para vehículos eléctricos, hacemos el trabajo bien desde la primera vez.',
      primaryCta: 'Llama al (915) 213-7178',
      secondaryCta: 'Ver Nuestros Servicios',
      stats: [
        { val: '8+', label: 'Años de Experiencia' },
        { val: 'A+', label: 'Calificación BBB' },
        { val: 'Top 5', label: 'El Paso Magazine' }
      ],
      floatingBadgeTitle: 'Estándar Reconocido',
      floatingBadgeSubtitle: 'Clasificados entre los 5 mejores electricistas de El Paso'
    },
    about: {
      eyebrow: 'SOBRE NOSOTROS',
      heading: 'Los Mejores Electricistas de Texas',
      description: 'En 828 Electric estamos orgullosos de ser una empresa eléctrica familiar que atiende el área de El Paso desde hace más de ocho años. Nuestros electricistas licenciados y asegurados ofrecen servicios eléctricos comerciales y residenciales de confianza.',
      cards: [
        {
          title: 'Familia Propietaria y Operada',
          desc: 'Durante más de 8 años, nuestra familia ha energizado hogares y negocios en El Paso. Tratamos cada proyecto como si fuera para nuestra propia casa.',
          img: 'awardTeam'
        },
        {
          title: 'Licenciados, Asegurados y Acreditados por BBB',
          desc: 'Estamos completamente licenciados, asegurados y acreditados por la Better Business Bureau con 8 años de servicio confiable. Trabajo profesional, hecho bien desde la primera vez.',
          img: 'solarWiring'
        },
        {
          title: 'Top 5 de los Mejores Electricistas en El Paso',
          desc: 'Reconocidos por El Paso Magazine por nuestra calidad y satisfacción del cliente. Con la confianza de familias y negocios desde 2017.',
          img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400'
        }
      ]
    },
    servicesSection: {
      eyebrow: '¿QUÉ OFRECEMOS?',
      heading: 'Servicios Eléctricos Confiables',
      description: 'Desde reparaciones residenciales hasta instalaciones comerciales de gran escala, nuestros electricistas licenciados y asegurados se especializan en mantener su propiedad segura y eficiente.',
      explore: 'Ver Detalles',
      serviceBadge: 'Servicio',
      detailsTitle: 'Lo Que Brindamos:',
      close: 'Cerrar Detalles',
      viewDetails: 'Ver Detalles'
    },
    faq: {
      eyebrow: 'PREGUNTAS POPULARES',
      heading: 'Obtenga Respuestas a Sus Preguntas',
      description: 'Los proyectos eléctricos suelen generar muchas preguntas. Aquí encontrará respuestas a algunas de las más comunes que hacen nuestros clientes en El Paso. ¿Aún necesita ayuda? Llámenos y le guiaremos.',
      button: 'Llama al (915) 213-7178'
    },
    reviews: {
      eyebrow: 'TESTIMONIOS',
      heading: 'Lo Que Dicen Nuestros Clientes',
      description: 'No crean solo en nuestra palabra. Esto es lo que piensan los propietarios de viviendas y negocios de El Paso sobre nuestros servicios.',
      verified: 'Cliente Verificado'
    },
    cta: {
      eyebrow: 'PONTE EN CONTACTO',
      heading: 'Permítanos Ayudarle con Todas Sus Necesidades Eléctricas',
      description: 'Ofrecemos un trabajo eléctrico rápido, seguro y conforme a código en El Paso, Texas. ¿Tiene una pregunta o necesita un presupuesto? ¡Llámenos directamente!',
      callNow: 'Llámanos Ahora',
      officeAddress: 'Dirección de la Oficina',
      address: '8086 Alameda Ave, El Paso TX'
    },
    footer: {
      quickLinks: 'Enlaces Rápidos',
      home: 'Inicio',
      aboutUs: 'Sobre Nosotros',
      servicesGrid: 'Servicios',
      faqs: 'Preguntas Frecuentes',
      contactDetails: 'Detalles de Contacto',
      primary: 'Principal: (915) 213-7178',
      secondary: 'Secundario: (915) 271-9524',
      followUs: 'Síganos',
      copyright: '© {year} 828 Electric. Todos los derechos reservados.',
      privacy: 'Política de Privacidad',
      terms: 'Términos y Condiciones'
    },
    services: [
      {
        id: 'wiring',
        title: 'Cableado Comercial y Residencial',
        description: 'Instalación y mantenimiento eléctrico integral para hogares y negocios.',
        categories: ['residential', 'commercial'],
        details: ['Reconexión completa de casa', 'Solución de problemas y reparaciones', 'Instalación de nuevos tomacorrientes e interruptores', 'Instalaciones de tomacorrientes GFCI']
      },
      {
        id: 'meter',
        title: 'Instalación de Nuevo Medidor',
        description: 'Instalación segura y conforme a código de medidores y paneles de servicio.',
        categories: ['residential', 'commercial', 'specialty'],
        details: ['Traslado de cajas de medidores', 'Conexiones de energía temporal', 'Mejoras de mástiles de servicio', 'Coordinación con servicios públicos']
      },
      {
        id: 'ev',
        title: 'Instalación de Cargadores para Vehículos Eléctricos',
        description: 'Instalación certificada para Tesla, ChargePoint y todas las marcas de vehículos eléctricos.',
        categories: ['residential', 'commercial', 'specialty'],
        details: ['Instalación de Tesla Wall Connector', 'Instalaciones de nivel 2', 'Evaluaciones de carga eléctrica', 'Circuitos dedicados']
      },
      {
        id: 'landscape',
        title: 'Iluminación de Exterior y Paisajismo',
        categories: ['residential'],
        description: 'Cree un espacio exterior impresionante y seguro con iluminación resistente al clima.',
        details: ['Iluminación de patio de bajo voltaje', 'Luces de senderos y arquitectura', 'Reflectores con sensor de movimiento', 'Controles inteligentes por temporizador']
      },
      {
        id: 'panel',
        title: 'Actualizaciones de Paneles',
        description: 'Aumente la capacidad eléctrica de forma segura con paneles de breakers modernos.',
        categories: ['residential', 'commercial'],
        details: ['Actualizaciones de 100A a 200A', 'Reemplazo de cajas de fusibles', 'Instalaciones de subpaneles', 'Reemplazo de breakers']
      },
      {
        id: 'lighting',
        title: 'Soluciones de Iluminación',
        description: 'Ventiladores de techo, iluminación empotrada, iluminación de patio y alberca, y más.',
        categories: ['residential'],
        details: ['Iluminación empotrada LED', 'Instalación de ventiladores', 'Colgaduras de candelabros y pendientes', 'Actualizaciones de interruptores dimmers']
      }
    ],
    testimonials: [
      {
        id: 1,
        name: 'Brian P.',
        text: '¡828 Electric es fantástico! Llamé justo después del cierre y aun así me atendieron enseguida. Los técnicos llegaron a mi casa temprano en la mañana para diagnosticar un problema eléctrico. Trabajaron rápido, lo solucionaron y fueron muy profesionales y amables.',
        rating: 5,
        source: 'Reseña de Google'
      },
      {
        id: 2,
        name: 'Francisco O.',
        text: 'Angel es profesional, puntual y confiable. Muy recomendable. Angel y su empresa son súper profesionales y honestos. Trabajo muy bien con ellos.',
        rating: 5,
        source: 'Reseña de Google'
      },
      {
        id: 3,
        name: 'Carlo Q.',
        text: 'Trabajar con el equipo de 828 siempre ha sido fantástico. Los hemos contratado en muchos proyectos y siempre han sido justos, puntuales y un placer trabajar con ellos. Recomiendo ampliamente 828 para trabajos eléctricos residenciales y comerciales.',
        rating: 5,
        source: 'Reseña de Google'
      },
      {
        id: 4,
        name: 'Eli',
        text: 'Angel nos explicó todo el proceso con claridad. Javy fue excelente en la instalación y lo explicó todo con detalle. El equipo fue muy profesional.',
        rating: 5,
        source: 'Reseña de Google'
      }
    ],
    faqs: [
      {
        question: '¿Ofrecen cotizaciones gratis?',
        answer: 'No, no ofrecemos cotizaciones gratis. Sin embargo, puede llamar para hablar con uno de nuestros electricistas licenciados, quienes pueden ofrecer un rango de precio estimado por teléfono. Para evaluaciones en sitio, programamos citas para asegurar valoraciones precisas y profesionales.'
      },
      {
        question: '¿Sus electricistas están licenciados y asegurados?',
        answer: '¡Sí! Todos nuestros electricistas son profesionales plenamente licenciados y asegurados. En 828 Electric LLC, nos enorgullece ofrecer trabajos eléctricos seguros y conformes a código, tanto para proyectos residenciales como comerciales.'
      },
      {
        question: '¿Qué tipos de trabajos eléctricos manejan?',
        answer: 'Manejamos todos los servicios eléctricos comerciales y residenciales, incluyendo actualizaciones de paneles, instalaciones de nuevos medidores, configuraciones de cargadores de vehículos eléctricos, instalaciones de ventiladores de techo, iluminación empotrada, iluminación de paisaje y patio, y más.'
      },
      {
        question: '¿Instalan cargadores para vehículos eléctricos?',
        answer: 'Claro. Estamos certificados para instalar cargadores de vehículos eléctricos de todas las marcas, incluyendo Tesla, ChargePoint y otros modelos importantes. Ya sea para su hogar o negocio, aseguramos que su cargador se instale de forma segura y conforme a código.'
      },
      {
        question: '¿Qué hace diferente a 828 Electric de otros electricistas en El Paso?',
        answer: 'Somos una empresa familiar con más de 8 años de experiencia y una acreditación BBB de larga trayectoria. Creemos en la integridad, la transparencia y hacer el trabajo bien desde la primera vez para que nuestros clientes puedan confiar en nosotros toda la vida.'
      }
    ]
  }
} as const

export default function App() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  
  // Navigation states
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState<Locale>('en')
  const t = content[language]
  const toggleLanguage = () => setLanguage((current) => current === 'en' ? 'es' : 'en')
  
  // Signature Moment states
  const [activeCategory, setActiveCategory] = useState<'all' | 'residential' | 'commercial' | 'specialty'>('all')
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  // FAQ states
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0)

  // Testimonials carousel index
  const [activeReviewIndex, setActiveReviewIndex] = useState(0)

  // Scroll event observer
  useEffect(() => {
    document.documentElement.lang = language
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 80)
    })
  }, [language, scrollY])

  // Data declarations
  const services: Service[] = t.services.map((service, index) => ({
    id: service.id,
    title: service.title,
    description: service.description,
    categories: [...service.categories] as Service['categories'],
    image: [wiringHands, meterInstall, evCharger, patioLighting, solarInstall, outletInstall][index],
    details: [...service.details]
  }))

  const formatCategoryLabel = (category: Service['categories'][number]) => {
    if (category === 'residential') return language === 'en' ? 'Residential' : 'Residencial'
    if (category === 'commercial') return language === 'en' ? 'Commercial' : 'Comercial'
    return language === 'en' ? 'Specialty' : 'Especialidad'
  }

  const testimonials: Testimonial[] = t.testimonials as unknown as Testimonial[]
  const faqs: FAQItem[] = t.faqs as unknown as FAQItem[]

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
            <img 
              src={logo} 
              alt="828 Electric Logo" 
              className={`h-9 w-auto transition-all group-hover:scale-105 ${
                isScrolled ? '' : 'brightness-0 invert'
              }`} 
            />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 font-display font-semibold text-sm">
            {t.navigation.map((link) => (
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

          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className={`rounded-full border px-3 py-2 text-sm font-semibold backdrop-blur transition-colors ${
                isScrolled
                  ? 'border-brand-gray-border bg-brand-gray-light text-brand-charcoal hover:bg-brand-gray-border'
                  : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
              }`}
              aria-label="Switch language"
            >
              {language === 'en' ? 'ES' : 'EN'}
            </button>
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
                    <img 
                      src={logo} 
                      alt="828 Electric Logo" 
                      className="h-8 w-auto" 
                    />
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-brand-gray-light text-brand-charcoal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-6 font-display font-semibold text-base text-brand-charcoal">
                  {t.navigation.map((link) => (
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
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="rounded-full border border-brand-gray-border px-4 py-2 text-sm font-semibold text-brand-charcoal transition-colors hover:bg-brand-gray-light"
                >
                  {language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
                </button>
                <a 
                  href="tel:+19152137178"
                  className="flex items-center justify-center gap-2 bg-brand-red text-white py-3 px-6 rounded-xl font-display font-bold hover:bg-brand-red-dark transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>{t.hero.primaryCta}</span>
                </a>
                <p className="text-xs text-brand-charcoal/60 text-center font-display">
                  {language === 'en' ? 'Serving El Paso & surrounding areas.' : 'Atendemos El Paso y sus alrededores.'}
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
              <span>{t.hero.badge}</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="font-display font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.1] tracking-tight mb-6"
            >
              {t.hero.titleLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red-light via-brand-red to-white">
                {t.hero.titleLine2}
              </span><br />
              {t.hero.titleLine3}
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg text-white/80 max-w-xl mb-8 leading-relaxed font-light mx-auto lg:mx-0"
            >
              {t.hero.description}
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
                <span>{t.hero.primaryCta}</span>
              </motion.a>

              <motion.a 
                href="#services"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 py-4 px-8 rounded-xl font-display font-bold text-base flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t.hero.secondaryCta}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.a>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-3 gap-6 pt-12 mt-12 border-t border-white/10 max-w-lg mx-auto lg:mx-0"
            >
              {t.hero.stats.map((m) => (
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
                src={constructionWorker} 
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
                  <span className="font-display font-bold text-sm text-white">{t.hero.floatingBadgeTitle}</span>
                  <span className="text-xs text-white/60">{t.hero.floatingBadgeSubtitle}</span>
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
            <span className="font-display font-bold text-brand-red tracking-widest text-xs uppercase block mb-3">{t.about.eyebrow}</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-brand-dark leading-tight mb-4">
              {t.about.heading}
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mb-6 rounded-full" />
            <p className="text-brand-charcoal text-base md:text-lg leading-relaxed">
              {t.about.description}
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
            {t.about.cards.map((card, index) => {
              const images = [awardTeam, solarWiring, 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400']
              const icons = [<ThumbsUp className="w-6 h-6" />, <ShieldCheck className="w-6 h-6" />, <Award className="w-6 h-6" />]
              const positions = ['object-top', 'object-center', 'object-center']
              return (
                <motion.div 
                  key={card.title}
                  variants={fadeInUp}
                  whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                  transition={springTransition}
                  className="bg-brand-white border border-brand-gray-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={images[index]} alt={card.title} className={`w-full h-full object-cover ${positions[index]}`} />
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center shadow-lg">
                      {icons[index]}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-brand-dark mb-3">{card.title}</h3>
                      <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light">{card.desc}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>


      {/* 4. SERVICES - SIGNATURE MOMENT (TABBED Card Reflow Grid) */}
      <section id="services" className="py-24 px-6 md:px-12 bg-brand-white relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-display font-bold text-brand-red tracking-widest text-xs uppercase block mb-3">{t.servicesSection.eyebrow}</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-brand-dark leading-tight mb-4">
              {t.servicesSection.heading}
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mb-6 rounded-full" />
            <p className="text-brand-charcoal text-base">
              {t.servicesSection.description}
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
                {t.categories[category]}
              </button>
            ))}
          </div>

          {/* Stable service cards */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredServices.map((service) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={service.id}
                  className="bg-brand-gray-light rounded-2xl border border-brand-gray-border overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl hover:border-brand-red/30 transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white text-xs font-display font-semibold tracking-widest uppercase bg-brand-red py-1 px-3 rounded-full">
                        {service.categories.map(formatCategoryLabel).join(' / ')}
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
                      className="inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-brand-red hover:text-brand-red-dark transition-colors"
                    >
                      <span>{t.servicesSection.viewDetails}</span>
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
                    {selectedService.categories.map(formatCategoryLabel).join(' / ')} {t.servicesSection.serviceBadge}
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
                  <h4 className="font-display font-bold text-sm text-brand-dark mb-3 uppercase tracking-wider">{t.servicesSection.detailsTitle}</h4>
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
                  {t.servicesSection.close}
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
            <span className="font-display font-bold text-brand-red tracking-widest text-xs uppercase block mb-3">{t.faq.eyebrow}</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-brand-dark leading-tight mb-6">
              {t.faq.heading}
            </h2>
            <div className="w-16 h-1 bg-brand-red mb-6 rounded-full" />
            <p className="text-brand-charcoal text-base mb-8 font-light leading-relaxed">
              {t.faq.description}
            </p>
            
            <a 
              href="tel:+19152137178"
              className="inline-flex items-center justify-center gap-2 bg-brand-dark text-white py-4 px-6 rounded-xl font-display font-bold text-sm hover:bg-brand-dark-light transition-colors self-start shadow-md"
            >
              <Phone className="w-4.5 h-4.5" />
              <span>{t.faq.button}</span>
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
            <span className="font-display font-bold text-brand-red tracking-widest text-xs uppercase block mb-3">{t.reviews.eyebrow}</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-brand-dark leading-tight mb-4">
              {t.reviews.heading}
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mb-6 rounded-full" />
            <p className="text-brand-charcoal text-base">
              {t.reviews.description}
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
                          {t.reviews.verified}
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

        <div className="max-w-6xl mx-auto relative z-10">
          {/* CTA Info */}
          <div className="text-center">
            <span className="font-display font-bold text-brand-red-light tracking-widest text-xs uppercase block mb-3">{t.cta.eyebrow}</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl leading-tight mb-6">
              {t.cta.heading}
            </h2>
            <p className="text-white/70 text-base mb-8 font-light leading-relaxed max-w-2xl mx-auto">
              {t.cta.description}
            </p>
            
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <a 
                href="tel:+19152137178"
                className="flex items-center gap-3 bg-brand-red hover:bg-brand-red-dark text-white py-3.5 px-6 rounded-xl font-display font-bold transition-all shadow-lg shadow-brand-red/15"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-white/60 text-left uppercase leading-none font-bold">{t.cta.callNow}</div>
                  <div className="text-base font-display font-bold mt-0.5 leading-none">(915) 213-7178</div>
                </div>
              </a>
              
              <div className="flex items-center gap-3 bg-brand-dark-light/50 border border-white/10 py-3.5 px-6 rounded-xl font-display text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-white/50 uppercase leading-none font-bold">{t.cta.officeAddress}</div>
                  <div className="text-sm font-semibold mt-0.5 leading-none">{t.cta.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 8. FOOTER */}
      <footer className="bg-brand-dark text-white border-t border-white/10 pt-16 pb-8 px-6 md:px-12 font-display text-sm">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img 
                src={logo} 
                alt="828 Electric Logo" 
                className="h-9 w-auto brightness-0 invert" 
              />
            </div>
            <p className="text-white/60 text-xs font-body font-light leading-relaxed max-w-xs mt-2">
              {language === 'en' ? 'Licensed and insured electrical specialists serving El Paso and surrounding communities. Family-owned and operated with over 8 years of trusted expertise.' : 'Especialistas eléctricos licenciados y asegurados que atienden El Paso y sus comunidades vecinas. Familia propietaria y operada con más de 8 años de experiencia de confianza.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs mb-4">{t.footer.quickLinks}</h4>
            <div className="flex flex-col gap-3 font-medium text-white/70">
              <a href="#" className="hover:text-brand-red-light transition-colors">{t.footer.home}</a>
              <a href="#about" className="hover:text-brand-red-light transition-colors">{t.footer.aboutUs}</a>
              <a href="#services" className="hover:text-brand-red-light transition-colors">{t.footer.servicesGrid}</a>
              <a href="#faq" className="hover:text-brand-red-light transition-colors">{t.footer.faqs}</a>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs mb-4">{t.footer.contactDetails}</h4>
            <div className="flex flex-col gap-3 text-white/70 font-body font-light">
              <a href="tel:+19152137178" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-brand-red-light" />
                <span>{t.footer.primary}</span>
              </a>
              <a href="tel:+19152719524" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-brand-red-light" />
                <span>{t.footer.secondary}</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-red-light" />
                <span>8086 Alameda Ave, El Paso, TX 79915</span>
              </div>
            </div>
          </div>

          {/* Socials Col */}
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs mb-4">{t.footer.followUs}</h4>
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
          <p>{t.footer.copyright.replace('{year}', String(new Date().getFullYear()))}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
