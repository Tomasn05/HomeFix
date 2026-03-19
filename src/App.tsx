import { useEffect, useMemo, useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
const BASE_SERVICES = [
  {
    name: 'Plomería',
    icon: '🔧',
    desc: 'Pérdidas, destapes, instalaciones y reparaciones.',
    workers: [
      { name: 'Nicolás Rivas', role: 'Plomero domiciliario', rating: '4.9', reviews: 154, area: 'Godoy Cruz', availability: 'Disponible hoy · 17:00 a 21:00', contact: '+54 9 261 555-3121' },
      { name: 'Franco Lima', role: 'Destapes e instalaciones', rating: '4.7', reviews: 96, area: 'Luján de Cuyo', availability: 'Mañana · 09:00 a 13:00', contact: '+54 9 261 555-4482' },
      { name: 'Ezequiel Torres', role: 'Urgencias y reparaciones', rating: '4.8', reviews: 121, area: 'Ciudad de Mendoza', availability: 'Disponible ahora', contact: '+54 9 261 555-6604' },
    ],
  },
  {
    name: 'Electricidad',
    icon: '⚡',
    desc: 'Arreglos, cableado, luces, tableros y urgencias.',
    workers: [
      { name: 'Tomás Notti', role: 'Electricista domiciliario', rating: '5.0', reviews: 32, area: 'Godoy Cruz', availability: 'Disponible ahora', contact: '+54 9 261 555-0000', photoUrl: '', about: 'Electricista con experiencia en instalaciones, urgencias y mantenimiento general. Trabajo prolijo y rápido.' },
      { name: 'Matías Gil', role: 'Electricista matriculado', rating: '4.9', reviews: 138, area: 'Maipú', availability: 'Hoy · 18:30 a 22:00', contact: '+54 9 261 555-7810' },
      { name: 'Santiago Correa', role: 'Tableros y luminarias', rating: '4.6', reviews: 82, area: 'Guaymallén', availability: 'Mañana · 08:00 a 12:00', contact: '+54 9 261 555-9205' },
      { name: 'Bruno Agüero', role: 'Urgencias eléctricas', rating: '4.8', reviews: 110, area: 'Chacras de Coria', availability: 'Disponible ahora', contact: '+54 9 261 555-3348' },
    ],
  },
  {
    name: 'Gas',
    icon: '🔥',
    desc: 'Gasistas matriculados para revisiones e instalaciones.',
    workers: [
      { name: 'Juan Pérez', role: 'Gasista matriculado', rating: '4.9', reviews: 128, area: 'Godoy Cruz', availability: 'Disponible hoy · 18:00 a 21:00', contact: '+54 9 261 555-1234' },
      { name: 'Martín Sosa', role: 'Gasista domiciliario', rating: '4.8', reviews: 94, area: 'Chacras de Coria', availability: 'Disponible mañana · 09:00 a 13:00', contact: '+54 9 261 555-2088' },
      { name: 'Leandro Díaz', role: 'Instalaciones y reparaciones', rating: '4.7', reviews: 76, area: 'Ciudad de Mendoza', availability: 'Disponible ahora', contact: '+54 9 261 555-4477' },
    ],
  },
  {
    name: 'Aire acondicionado',
    icon: '❄️',
    desc: 'Instalación, mantenimiento y service técnico.',
    workers: [
      { name: 'Federico Lobo', role: 'Instalación y service', rating: '4.8', reviews: 102, area: 'Ciudad de Mendoza', availability: 'Hoy · 16:00 a 20:00', contact: '+54 9 261 555-1470' },
      { name: 'Tomás Becerra', role: 'Mantenimiento preventivo', rating: '4.7', reviews: 73, area: 'Godoy Cruz', availability: 'Mañana · 10:00 a 14:00', contact: '+54 9 261 555-2589' },
      { name: 'Lucas Ferreyra', role: 'Reparaciones y carga', rating: '4.9', reviews: 131, area: 'Guaymallén', availability: 'Disponible ahora', contact: '+54 9 261 555-6691' },
    ],
  },
  {
    name: 'Pintura',
    icon: '🎨',
    desc: 'Interior, exterior, retoques y trabajos completos.',
    workers: [
      { name: 'Agustín Vera', role: 'Pintor interior', rating: '4.8', reviews: 88, area: 'Luján de Cuyo', availability: 'Hoy · 15:00 a 19:00', contact: '+54 9 261 555-7402' },
      { name: 'Facundo Paz', role: 'Retoques y terminaciones', rating: '4.6', reviews: 61, area: 'Ciudad de Mendoza', availability: 'Mañana · 09:00 a 12:00', contact: '+54 9 261 555-8023' },
      { name: 'Gonzalo Videla', role: 'Pintura completa', rating: '4.9', reviews: 117, area: 'Chacras de Coria', availability: 'Disponible ahora', contact: '+54 9 261 555-9317' },
    ],
  },
  {
    name: 'Carpintería',
    icon: '🪚',
    desc: 'Muebles, arreglos, puertas y trabajos a medida.',
    workers: [
      { name: 'Lucas Herrera', role: 'Carpintero general', rating: '4.8', reviews: 95, area: 'Godoy Cruz', availability: 'Hoy · 16:00 a 20:00', contact: '+54 9 261 555-2231' },
      { name: 'Mariano Díaz', role: 'Muebles a medida', rating: '4.9', reviews: 112, area: 'Luján de Cuyo', availability: 'Mañana · 09:00 a 13:00', contact: '+54 9 261 555-7782' },
      { name: 'Sergio López', role: 'Reparaciones', rating: '4.7', reviews: 68, area: 'Ciudad de Mendoza', availability: 'Disponible ahora', contact: '+54 9 261 555-9901' },
    ],
  },
  {
    name: 'Piletero',
    icon: '🏊',
    desc: 'Mantenimiento, limpieza y tratamiento de piscinas.',
    workers: [
      { name: 'Diego Ruiz', role: 'Mantenimiento de piletas', rating: '4.9', reviews: 87, area: 'Chacras de Coria', availability: 'Hoy · 14:00 a 18:00', contact: '+54 9 261 555-4412' },
      { name: 'Facundo Ríos', role: 'Limpieza y químicos', rating: '4.6', reviews: 55, area: 'Maipú', availability: 'Mañana · 10:00 a 13:00', contact: '+54 9 261 555-6633' },
      { name: 'Tomás Vega', role: 'Service completo', rating: '4.8', reviews: 74, area: 'Guaymallén', availability: 'Disponible ahora', contact: '+54 9 261 555-8890' },
    ],
  },
];

const HELP_SUGGESTIONS = [
  { title: 'Pierde agua una canilla', service: 'Plomería', answer: 'Parece un problema de plomería. Te mostramos plomeros disponibles.' },
  { title: 'Salta la térmica', service: 'Electricidad', answer: 'Esto suele ser eléctrico. Te mostramos electricistas.' },
  { title: 'Problema con calefón o gas', service: 'Gas', answer: 'Necesitás un gasista matriculado. Te mostramos opciones.' },
  { title: 'El aire no enfría', service: 'Aire acondicionado', answer: 'Probablemente sea el aire acondicionado. Te mostramos técnicos.' },
  { title: 'Quiero pintar mi casa', service: 'Pintura', answer: 'Te mostramos pintores disponibles.' },
  { title: 'Necesito arreglar un mueble', service: 'Carpintería', answer: 'Te mostramos carpinteros.' },
  { title: 'Mantenimiento de pileta', service: 'Piletero', answer: 'Te mostramos pileteros disponibles.' },
];

const MENDOZA_DEPARTMENTS = [
  'Capital', 'Godoy Cruz', 'Guaymallén', 'Las Heras', 'Luján de Cuyo', 'Maipú',
  'Junín', 'Rivadavia', 'San Martín', 'Santa Rosa', 'La Paz', 'Lavalle',
  'Tunuyán', 'Tupungato', 'San Carlos', 'San Rafael', 'General Alvear', 'Malargüe',
];

function initials(name) {
  return String(name || '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
}

function matchesService(role, serviceName) {
  const roleText = String(role || '').toLowerCase();
  const name = String(serviceName || '').toLowerCase();
  if (name === 'plomería') return roleText.includes('plom');
  if (name === 'electricidad') return roleText.includes('electric');
  if (name === 'gas') return roleText.includes('gas');
  if (name === 'aire acondicionado') return roleText.includes('aire');
  if (name === 'pintura') return roleText.includes('pint');
  if (name === 'carpintería') return roleText.includes('carp');
  if (name === 'piletero') return roleText.includes('pile');
  return false;
}

function safeUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `worker-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function HomeFixPage() {
  const [selectedService, setSelectedService] = useState('Gas');
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [assistantInput, setAssistantInput] = useState('');
  const [isCreatorMode, setIsCreatorMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState('cliente');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [creatorProfile, setCreatorProfile] = useState({
    name: 'Tomás Notti',
    role: 'Creador de HomeFix',
    email: 'homefix@demo.com',
    phone: '+54 9 261 000-0000',
    city: 'Mendoza',
    bio: 'Estoy construyendo HomeFix para conectar clientes con profesionales confiables de forma simple y rápida.',
  });
  const [newWorker, setNewWorker] = useState({
    name: '', role: 'Plomería', area: 'Capital', contact: '', email: '', photoUrl: '', about: '',
  });
  const [addedWorkers, setAddedWorkers] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('fixnow_workers');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.map((worker, index) => ({ id: worker.id || `worker-${index}`, ...worker }));
    } catch {
      return [];
    }
  });
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [newWorkerFileInputKey, setNewWorkerFileInputKey] = useState(0);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterZone, setFilterZone] = useState('all');
  const [sortMode, setSortMode] = useState('rating');
  const [editingWorkerId, setEditingWorkerId] = useState(null);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [tempReviews, setTempReviews] = useState({});
  const [reviewFilter, setReviewFilter] = useState('all');

  const services = useMemo(() => {
    return BASE_SERVICES.map((service) => {
      const extra = addedWorkers.filter((worker) => matchesService(worker.role, service.name));
      return { ...service, workers: [...service.workers, ...extra], pros: service.workers.length + extra.length };
    });
  }, [addedWorkers]);

  const activeService = services.find((service) => service.name === selectedService) || services[2];

  const processedWorkers = useMemo(() => {
    let list = [...activeService.workers];
    if (filterAvailable) list = list.filter((w) => String(w.availability || '').toLowerCase().includes('disponible ahora'));
    if (filterZone !== 'all') list = list.filter((w) => w.area === filterZone);
    if (sortMode === 'rating') list.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
    if (sortMode === 'available') {
      list.sort((a, b) => {
        const aNow = String(a.availability || '').toLowerCase().includes('disponible ahora');
        const bNow = String(b.availability || '').toLowerCase().includes('disponible ahora');
        return Number(bNow) - Number(aNow);
      });
    }
    return list;
  }, [activeService, filterAvailable, filterZone, sortMode]);

  const totalProfessionals = services.reduce((acc, service) => acc + service.workers.length, 0);

  const formatPhoneForWhatsApp = (contact) => {
    const digits = String(contact || '').replace(/[^0-9]/g, '');
    if (digits.length === 10) return `549${digits}`;
    if (digits.length === 12 && digits.startsWith('54')) return digits;
    if (digits.length === 13 && digits.startsWith('549')) return digits;
    return digits;
  };

  const formatPhoneDisplay = (contact) => {
    const digits = String(contact || '').replace(/[^0-9]/g, '');
    const local = digits.length === 10 ? digits : digits.startsWith('549') ? digits.slice(3) : digits.startsWith('54') ? digits.slice(2) : digits;
    if (local.length === 10) return `+54 9 ${local.slice(0, 3)} ${local.slice(3, 6)}-${local.slice(6)}`;
    return String(contact || '');
  };

  const creatorWhatsappLink = `https://wa.me/${formatPhoneForWhatsApp(creatorProfile.phone)}`;

  const getSmartMessage = (pro, service) => {
    const base = `Hola ${pro.name}, te encontré en HomeFix.`;
    if (service === 'Plomería') return `${base} Tengo una pérdida de agua en casa, ¿podés ayudarme?`;
    if (service === 'Electricidad') return `${base} Estoy teniendo problemas eléctricos (salta la térmica / cortes).`;
    if (service === 'Gas') return `${base} Necesito revisar un tema de gas o calefón.`;
    if (service === 'Aire acondicionado') return `${base} El aire acondicionado no está funcionando bien.`;
    if (service === 'Pintura') return `${base} Quiero pintar un ambiente de mi casa.`;
    if (service === 'Carpintería') return `${base} Necesito arreglar o hacer un mueble.`;
    if (service === 'Piletero') return `${base} Necesito mantenimiento para la pileta.`;
    return `${base} Quería consultarte por un trabajo.`;
  };

  const openWhatsApp = (contact, message) => {
    const phone = formatPhoneForWhatsApp(contact);
    if (!phone) return;
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const resetHome = () => {
    setSelectedProfessional(null);
    setSelectedService('Gas');
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthRole('cliente');
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthOpen(false);
    setAuthForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

 const handleAuthSubmit = async (e) => {
  e.preventDefault();

  try {
    if (authMode === 'register') {
      if (authForm.password !== authForm.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      await createUserWithEmailAndPassword(
        auth,
        authForm.email,
        authForm.password
      );

      alert('Cuenta creada con éxito');
      closeAuthModal();
    } else {
      await signInWithEmailAndPassword(
        auth,
        authForm.email,
        authForm.password
      );

      alert('Ingreso exitoso');
      closeAuthModal();
    }
  } catch (error) {
    alert(error.message);
  }
  };

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdminAccess = () => {
    if (adminPassword === 'apolo') {
      setIsCreatorMode((prev) => !prev);
      setShowAdminInput(false);
      setAdminPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const updateWorker = (workerId, field, value) => {
    setAddedWorkers((prev) => prev.map((worker) => (worker.id === workerId ? { ...worker, [field]: value } : worker)));
  };

  const removeWorker = (workerId) => {
    setAddedWorkers((prev) => prev.filter((worker) => worker.id !== workerId));
  };

  const findWorkerIndex = (pro) => {
    const normalized = String(pro.contact || '').replace(/[^0-9]/g, '').slice(-10);
    return addedWorkers.findIndex((w) => w.id === pro.id || String(w.contact || '').replace(/[^0-9]/g, '').slice(-10) === normalized);
  };

  const ensureEditableWorker = (pro) => {
    const existingIndex = findWorkerIndex(pro);
    if (existingIndex !== -1) return addedWorkers[existingIndex]?.id || null;
    const clonedWorker = {
      id: safeUuid(),
      name: pro.name || '',
      role: pro.role || selectedService,
      area: pro.area || 'Capital',
      contact: String(pro.contact || '').replace(/[^0-9]/g, '').slice(-10),
      email: pro.email || '',
      photoUrl: pro.photoUrl || '',
      about: pro.about || '',
      rating: pro.rating || 'Nuevo',
      reviews: pro.reviews || 0,
      availability: pro.availability || 'Disponible ahora',
      reviewEntries: tempReviews[pro.contact] || [],
    };
    setAddedWorkers((prev) => [...prev, clonedWorker]);
    return clonedWorker.id;
  };

  const addReview = (pro) => {
    if (!reviewStars) return;
    const entry = { id: safeUuid(), stars: reviewStars, text: reviewText || '' };
    const idx = findWorkerIndex(pro);
    if (idx !== -1) {
      setAddedWorkers((prev) => prev.map((w, i) => {
        if (i !== idx) return w;
        const list = w.reviewEntries || [];
        const nextList = [...list, entry];
        const nextCount = nextList.length;
        const nextRating = (nextList.reduce((sum, item) => sum + item.stars, 0) / nextCount).toFixed(1);
        return { ...w, reviewEntries: nextList, reviews: nextCount, rating: nextRating };
      }));
    } else {
      setTempReviews((prev) => ({ ...prev, [pro.contact]: [...(prev[pro.contact] || []), entry] }));
    }
    setReviewStars(5);
    setReviewText('');
    setReviewFilter('all');
  };

  const getReviewsForProfessional = (pro) => {
    const idx = findWorkerIndex(pro);
    const dynamicReviews = idx !== -1 ? addedWorkers[idx]?.reviewEntries || [] : tempReviews[pro.contact] || [];
    const baseReviews = [
      { id: 'seed-1', stars: 5, text: 'Muy buen servicio.' },
      { id: 'seed-2', stars: 4, text: 'Llegó puntual y resolvió rápido.' },
    ];
    const list = dynamicReviews.length > 0 ? dynamicReviews : baseReviews;
    if (reviewFilter === 'highest') return [...list].sort((a, b) => b.stars - a.stars);
    if (reviewFilter === 'lowest') return [...list].sort((a, b) => a.stars - b.stars);
    return list;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('fixnow_workers', JSON.stringify(addedWorkers));
  }, [addedWorkers]);

  const addWorker = () => {
    const phoneDigits = String(newWorker.contact || '').replace(/[^0-9]/g, '');
    if (!newWorker.name.trim() || !newWorker.role.trim()) return;
    if (phoneDigits.length !== 10) {
      alert('El teléfono debe tener 10 dígitos.');
      return;
    }
    setAddedWorkers((prev) => [...prev, {
      id: safeUuid(),
      ...newWorker,
      contact: phoneDigits,
      rating: 'Nuevo',
      reviews: 0,
      availability: 'Disponible ahora',
      reviewEntries: [],
    }]);
    setNewWorker({ name: '', role: 'Plomería', area: 'Capital', contact: '', email: '', photoUrl: '', about: '' });
    setNewWorkerFileInputKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {isCreatorMode && (
        <div className="fixed left-0 top-0 z-[60] w-full bg-black py-2 text-center text-sm font-semibold text-white">
          MODO CREADOR ACTIVADO
        </div>
      )}

      <header className={`sticky ${isCreatorMode ? 'top-8' : 'top-0'} z-50 border-b border-black/10 bg-white/90 backdrop-blur`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div onClick={resetHome} className="flex cursor-pointer items-center gap-3 text-left">
            <div className="flex overflow-hidden rounded-3xl border-2 border-black shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center bg-black text-2xl font-black tracking-tight text-white">H</div>
              <div className="flex h-12 w-12 items-center justify-center bg-white text-2xl font-black tracking-tight text-black">F</div>
            </div>
            <div className="relative">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight">HomeFix</h1>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setAdminClickCount((prev) => {
                      const next = prev + 1;
                      if (next === 3) {
                        setShowAdminInput(true);
                        return 0;
                      }
                      return next;
                    });
                  }}
                  className="cursor-pointer rounded-full border px-2 py-1 text-xs"
                >
                  ●
                </span>
                {isCreatorMode && <span className="rounded-full bg-black px-2 py-1 text-xs font-bold text-white">Modo creador</span>}
              </div>
              <p className="text-sm text-black/60">Servicios para tu hogar</p>

              {showAdminInput && (
                <div className="absolute left-0 top-14 z-50 w-56 rounded-2xl border border-black bg-white p-3 shadow-xl">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Acceso creador</p>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full rounded-xl border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                  <div className="mt-2 flex gap-2">
                    <button onClick={handleAdminAccess} className="flex-1 rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white">Entrar</button>
                    <button onClick={() => { setShowAdminInput(false); setAdminPassword(''); }} className="flex-1 rounded-xl border border-black px-3 py-2 text-sm font-semibold">Cerrar</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => openAuthModal('login')} className="text-sm font-semibold">Ingresar</button>
            <button onClick={() => openAuthModal('register')} className="rounded-xl border border-black px-3 py-2 text-sm font-semibold">Registrarme</button>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-2xl border border-black/15 transition hover:border-black"
                aria-label="Abrir menú"
              >
                <span className="h-0.5 w-5 bg-black" />
                <span className="h-0.5 w-5 bg-black" />
                <span className="h-0.5 w-5 bg-black" />
              </button>

              {isMenuOpen && (
                <>
                  <button onClick={() => setIsMenuOpen(false)} className="fixed inset-0 z-40 bg-black/10" aria-label="Cerrar menú" />
                  <div className="absolute right-0 top-16 z-50 w-72 rounded-3xl border border-black bg-white p-4 shadow-2xl">
                    <div className="mb-3 px-2 pt-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Menú</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => scrollToSection('servicios')} className="rounded-2xl px-4 py-3 text-left font-semibold transition hover:bg-zinc-100">Servicios</button>
                      <button onClick={() => scrollToSection('como-funciona')} className="rounded-2xl px-4 py-3 text-left font-semibold transition hover:bg-zinc-100">Cómo funciona</button>
                      <button onClick={() => scrollToSection('profesionales')} className="rounded-2xl px-4 py-3 text-left font-semibold transition hover:bg-zinc-100">Profesionales</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {isAuthOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/45">{authMode === 'login' ? 'Ingreso' : 'Registro'}</p>
                  <h3 className="mt-2 text-3xl font-black tracking-tight">{authMode === 'login' ? 'Entrá a HomeFix' : 'Creá tu cuenta'}</h3>
                  <p className="mt-2 text-sm text-black/65">Esta pantalla ya está lista para conectarla con Firebase Auth.</p>
                </div>
                <button onClick={closeAuthModal} className="rounded-full border border-black px-3 py-1 text-sm font-semibold">✕</button>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-zinc-100 p-1">
                <button onClick={() => setAuthMode('login')} className={`rounded-2xl px-4 py-3 text-sm font-semibold ${authMode === 'login' ? 'bg-white shadow-sm' : ''}`}>Ingresar</button>
                <button onClick={() => setAuthMode('register')} className={`rounded-2xl px-4 py-3 text-sm font-semibold ${authMode === 'register' ? 'bg-white shadow-sm' : ''}`}>Registrarme</button>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-sm font-semibold">Tipo de cuenta</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setAuthRole('cliente')} className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${authRole === 'cliente' ? 'border-black bg-black text-white' : 'border-black/15'}`}>Cliente</button>
                  {authMode === 'login' && (
                    <button onClick={() => setAuthRole('profesional')} className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${authRole === 'profesional' ? 'border-black bg-black text-white' : 'border-black/15'}`}>Profesional</button>
                  )}
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {authMode === 'register' && (
                  <input value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} placeholder="Nombre y apellido" className="w-full rounded-2xl border border-black/15 px-4 py-3 outline-none focus:border-black" />
                )}
                <input type="email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} placeholder="Email" className="w-full rounded-2xl border border-black/15 px-4 py-3 outline-none focus:border-black" />
                <input type="password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} placeholder="Contraseña" className="w-full rounded-2xl border border-black/15 px-4 py-3 outline-none focus:border-black" />
                {authMode === 'register' && (
                  <input type="password" value={authForm.confirmPassword} onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })} placeholder="Confirmar contraseña" className="w-full rounded-2xl border border-black/15 px-4 py-3 outline-none focus:border-black" />
                )}
                <button type="submit" className="w-full rounded-2xl bg-black px-4 py-3 font-semibold text-white">{authMode === 'login' ? 'Ingresar' : 'Crear cuenta'}</button>
              </form>

              <div className="mt-4 rounded-2xl border border-dashed border-black/20 p-4 text-sm text-black/65">
                Próximo paso: conectar esta pantalla con Firebase Authentication y guardar perfiles en Firestore.
              </div>
            </div>
          </div>
        )}

        {selectedProfessional && (
          <section className="mx-auto max-w-7xl px-6 pt-10">
            <div className="rounded-[2rem] border border-black bg-zinc-50 p-8 md:p-10">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-5">
                  {selectedProfessional.photoUrl ? (
                    <img src={selectedProfessional.photoUrl} alt={selectedProfessional.name} className="h-20 w-20 rounded-3xl border border-black object-cover" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-black text-3xl font-black text-white">{initials(selectedProfessional.name)}</div>
                  )}
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/50">Perfil del profesional</p>
                    <h3 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">{selectedProfessional.name}</h3>
                    <p className="mt-2 text-lg text-black/70">{selectedProfessional.role}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <span className="rounded-full border border-black px-4 py-2">⭐ {(() => {
                        const reviews = getReviewsForProfessional(selectedProfessional);
                        const avg = reviews.length ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1) : selectedProfessional.rating;
                        return avg;
                      })()}</span>
                      <span className="rounded-full border border-black px-4 py-2">📍 {selectedProfessional.area}</span>
                      <span className="rounded-full border border-black px-4 py-2">⏰ {selectedProfessional.availability}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedProfessional(null)} className="rounded-2xl border border-black px-5 py-3 font-semibold">Cerrar perfil</button>
                  {isCreatorMode && (
                    <button
                      onClick={() => {
                        const workerId = ensureEditableWorker(selectedProfessional);
                        setEditingWorkerId(workerId);
                        setSelectedProfessional(null);
                        setIsCreatorMode(true);
                        setTimeout(() => document.querySelector('[data-creator-panel]')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }}
                      className="rounded-2xl bg-black px-5 py-3 font-semibold text-white"
                    >
                      Editar
                    </button>
                  )}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  <div className="rounded-3xl border border-black bg-white p-6 shadow-sm">
                    <h4 className="text-xl font-bold">Sobre este profesional</h4>
                    <p className="mt-4 text-black/75">{selectedProfessional.about || 'Profesional verificado dentro de HomeFix con atención personalizada y coordinación directa con el cliente.'}</p>
                  </div>

                  <div className="rounded-3xl border border-black bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-xl font-bold">Reseñas</h4>
                      <select value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)} className="rounded-xl border border-black/20 px-3 py-2 text-sm">
                        <option value="all">Todas</option>
                        <option value="highest">Más altas</option>
                        <option value="lowest">Más bajas</option>
                      </select>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} onClick={() => setReviewStars(s)} className={`text-2xl ${reviewStars >= s ? '' : 'opacity-30'}`}>⭐</button>
                        ))}
                      </div>
                      <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Dejá tu reseña" className="w-full rounded-2xl border border-black p-3 text-sm" />
                      <button onClick={() => addReview(selectedProfessional)} className="rounded-2xl bg-black px-4 py-2 font-semibold text-white">Enviar reseña</button>

                      {getReviewsForProfessional(selectedProfessional).map((r) => (
                        <div key={r.id} className="rounded-2xl border border-black/10 bg-zinc-50 p-4 text-sm text-black/75">
                          {'⭐'.repeat(r.stars)}{r.text ? ` ${r.text}` : ''}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-black bg-black p-6 text-white shadow-sm">
                    <h4 className="text-xl font-bold">Información principal</h4>
                    <div className="mt-5 space-y-3 text-sm text-white/85">
                      <p><span className="font-semibold text-white">Contacto:</span> {formatPhoneDisplay(selectedProfessional.contact)}</p>
                      {selectedProfessional.email && <p><span className="font-semibold text-white">Email:</span> {selectedProfessional.email}</p>}
                      <p><span className="font-semibold text-white">Precio:</span> Consultar precio</p>
                      <p><span className="font-semibold text-white">Opiniones:</span> {getReviewsForProfessional(selectedProfessional).length} reseñas</p>
                    </div>
                    <button onClick={() => openWhatsApp(selectedProfessional.contact, getSmartMessage(selectedProfessional, selectedService))} className="mt-6 w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black">Contactar por WhatsApp</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="mb-6 inline-flex rounded-full border border-black px-4 py-2 text-sm font-semibold">Encontrá ayuda confiable en minutos</span>
            <h2 className="mb-6 text-5xl font-black leading-none tracking-tight md:text-6xl">Soluciones reales para problemas reales.</h2>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-black/70">En HomeFix conectamos personas con profesionales confiables para resolver tareas del hogar de forma rápida, clara y segura.</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollToSection('servicios')} className="rounded-2xl bg-black px-6 py-4 font-semibold text-white shadow-lg">Buscar servicio</button>
              <button onClick={() => scrollToSection('profesionales')} className="rounded-2xl border border-black px-6 py-4 font-semibold">Ver profesionales</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-black bg-black p-6 text-white shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-white/70">Profesionales</p>
              <p className="mt-3 text-4xl font-black">+{totalProfessionals}</p>
              <p className="mt-4 text-sm text-white/80">Verificados y listos para trabajar.</p>
            </div>
            <div className="rounded-3xl border border-black p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-black/60">Rubros</p>
              <p className="mt-3 text-4xl font-black">7</p>
              <p className="mt-4 text-sm text-black/70">Servicios clave para el hogar.</p>
            </div>
            <div className="col-span-2 rounded-3xl border border-black p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-black/60">Confianza</p>
              <p className="mt-3 text-3xl font-black">Sistema de reseñas y calificaciones reales</p>
              <p className="mt-4 text-sm text-black/70">Cada cliente puede dejar su experiencia para ayudar a otros a elegir mejor.</p>
            </div>
          </div>
        </section>

        <section id="servicios" className="mx-auto max-w-7xl px-6 py-8 md:py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/50">Servicios</p>
              <h3 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Elegí lo que necesitás</h3>
            </div>
            <p className="hidden max-w-md text-right text-black/60 md:block">Cada categoría muestra profesionales con horarios, zona, calificación y modalidad de precio.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.name} className="rounded-3xl border border-black bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-4 text-4xl">{service.icon}</div>
                <h4 className="mb-2 text-2xl font-black">{service.name}</h4>
                <p className="mb-5 leading-relaxed text-black/70">{service.desc}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-black/60">{service.pros} profesionales</span>
                  <button
                    onClick={() => {
                      setSelectedService(service.name);
                      setTimeout(() => scrollToSection('profesionales'), 50);
                    }}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
                  >
                    Ver opciones
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-[2rem] bg-black p-8 text-white md:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Cómo funciona</p>
            <h3 className="mb-10 mt-3 text-3xl font-black tracking-tight md:text-4xl">Rápido, claro y con ayuda inteligente</h3>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-3xl bg-white/10 p-6"><div className="mb-3 text-3xl">🔎</div><h4 className="mb-2 text-lg font-bold">1. Buscás</h4><p className="text-sm text-white/75">Elegís el servicio que necesitás o consultás al asistente.</p></div>
              <div className="rounded-3xl bg-white/10 p-6"><div className="mb-3 text-3xl">💡</div><h4 className="mb-2 text-lg font-bold">2. Te orienta</h4><p className="text-sm text-white/75">El asistente te ayuda a encontrar el rubro correcto.</p></div>
              <div className="rounded-3xl bg-white/10 p-6"><div className="mb-3 text-3xl">👷‍♂️</div><h4 className="mb-2 text-lg font-bold">3. Comparás</h4><p className="text-sm text-white/75">Ves perfiles con zona, horarios y calificación.</p></div>
              <div className="rounded-3xl bg-white/10 p-6"><div className="mb-3 text-3xl">⭐</div><h4 className="mb-2 text-lg font-bold">4. Contratás y calificás</h4><p className="text-sm text-white/75">Contactás al profesional y después dejás tu reseña.</p></div>
            </div>
          </div>
        </section>

        <section id="profesionales" className="mx-auto max-w-7xl px-6 py-10 md:py-16">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/50">Categoría seleccionada</p>
            <h3 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">{activeService.name} disponibles</h3>
            <p className="mt-3 max-w-2xl text-black/70">Estas son opciones modelo dentro de {activeService.name}.</p>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            <button onClick={() => setFilterAvailable((prev) => !prev)} className={`rounded-full border px-4 py-2 ${filterAvailable ? 'bg-black text-white' : ''}`}>Disponible ahora</button>
            <select value={filterZone} onChange={(e) => setFilterZone(e.target.value)} className="rounded border px-3 py-2">
              <option value="all">Todas las zonas</option>
              {MENDOZA_DEPARTMENTS.map((z) => <option key={z}>{z}</option>)}
            </select>
            <select value={sortMode} onChange={(e) => setSortMode(e.target.value)} className="rounded border px-3 py-2">
              <option value="rating">Mejor puntuados</option>
              <option value="available">Disponibles ahora</option>
            </select>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {processedWorkers.map((pro) => {
              const reviews = getReviewsForProfessional(pro);
              const avg = reviews.length ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1) : (pro.rating || 'Nuevo');
              return (
                <div key={`${pro.name}-${pro.contact}`} className="rounded-3xl border border-black p-6 shadow-sm transition hover:shadow-xl">
                  <div className="mb-2 flex gap-2">
                    {String(pro.availability || '').toLowerCase().includes('disponible ahora') && <span className="rounded-full bg-green-500 px-2 py-1 text-xs text-white">Disponible</span>}
                    {parseFloat(pro.rating || 0) >= 4.8 && <span className="rounded-full bg-black px-2 py-1 text-xs text-white">Destacado</span>}
                  </div>

                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-2xl font-black leading-tight">{pro.name}</h4>
                      <p className="mt-1 text-black/70">{pro.role}</p>
                    </div>
                    <div className="rounded-2xl bg-black px-3 py-2 text-sm font-bold text-white">⭐ {avg}</div>
                  </div>

                  <div className="space-y-3 text-sm text-black/75">
                    <p><span className="font-semibold text-black">Reseñas:</span> {reviews.length} opiniones</p>
                    <p><span className="font-semibold text-black">Zona:</span> {pro.area}</p>
                    <p><span className="font-semibold text-black">Disponibilidad:</span> {pro.availability || 'Disponible ahora'}</p>
                    <p><span className="font-semibold text-black">Contacto:</span> {formatPhoneDisplay(pro.contact)}</p>
                    {pro.email && <p><span className="font-semibold text-black">Email:</span> {pro.email}</p>}
                    <p><span className="font-semibold text-black">Precio:</span> Consultar precio</p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button onClick={() => openWhatsApp(pro.contact, getSmartMessage(pro, selectedService))} className="rounded-2xl bg-black px-4 py-3 text-center font-semibold text-white">Contactar por WhatsApp</button>
                    <button onClick={() => { setSelectedProfessional(pro); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50); }} className="rounded-2xl border border-black px-4 py-3 font-semibold">Ver perfil</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 pt-6">
          <div className="flex flex-col items-center justify-between gap-8 rounded-[2rem] border border-black p-8 md:flex-row md:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/50">Para profesionales</p>
              <h3 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Sumate a HomeFix</h3>
              <p className="mt-4 max-w-2xl text-black/70">Mostrá tu perfil, tu disponibilidad y tus calificaciones para llegar a nuevos clientes todos los días.</p>
            </div>
            <button onClick={() => openWhatsApp(creatorProfile.phone, 'Hola Tomi, quiero ofrecer mis servicios en HomeFix.')} className="whitespace-nowrap rounded-2xl bg-black px-6 py-4 font-semibold text-white shadow-lg">Quiero ofrecer mis servicios</button>
          </div>
        </section>

        {isCreatorMode && (
          <section data-creator-panel className="mx-auto max-w-7xl px-6 py-8">
            <div className="rounded-[2rem] border-2 border-dashed border-black bg-zinc-50 p-8 md:p-10">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/50">Panel privado del creador</p>
                <h3 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Tu perfil de creador</h3>
                <p className="mt-3 max-w-2xl text-black/70">Gestioná tu perfil y cargá profesionales manualmente.</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-black bg-white p-6">
                  <h4 className="mb-4 font-bold">Perfil de Tomás Notti</h4>
                  <input value={creatorProfile.name} onChange={(e) => setCreatorProfile({ ...creatorProfile, name: e.target.value })} className="mb-2 w-full rounded border p-2" placeholder="Nombre" />
                  <input value={creatorProfile.role} onChange={(e) => setCreatorProfile({ ...creatorProfile, role: e.target.value })} className="mb-2 w-full rounded border p-2" placeholder="Rol" />
                  <input value={creatorProfile.email} onChange={(e) => setCreatorProfile({ ...creatorProfile, email: e.target.value })} className="mb-2 w-full rounded border p-2" placeholder="Email" />
                  <input value={creatorProfile.phone} onChange={(e) => setCreatorProfile({ ...creatorProfile, phone: e.target.value })} className="mb-2 w-full rounded border p-2" placeholder="WhatsApp" />
                  <input value={creatorProfile.city} onChange={(e) => setCreatorProfile({ ...creatorProfile, city: e.target.value })} className="mb-2 w-full rounded border p-2" placeholder="Ciudad" />
                  <textarea value={creatorProfile.bio} onChange={(e) => setCreatorProfile({ ...creatorProfile, bio: e.target.value })} className="min-h-[96px] w-full rounded border p-2" placeholder="Descripción" />
                </div>

                <div className="rounded-3xl border border-black bg-white p-6">
                  <h4 className="mb-4 font-bold">Agregar profesional</h4>
                  <input placeholder="Nombre" value={newWorker.name} onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })} className="mb-2 w-full rounded border p-2" />
                  <select value={newWorker.role} onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })} className="mb-2 w-full rounded border p-2">
                    {BASE_SERVICES.map((service) => <option key={service.name} value={service.name}>{service.name}</option>)}
                  </select>
                  <select value={newWorker.area} onChange={(e) => setNewWorker({ ...newWorker, area: e.target.value })} className="mb-2 w-full rounded border p-2">
                    {MENDOZA_DEPARTMENTS.map((department) => <option key={department} value={department}>{department}</option>)}
                  </select>
                  <input placeholder="Teléfono (10 dígitos)" value={newWorker.contact} onChange={(e) => setNewWorker({ ...newWorker, contact: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })} className="mb-2 w-full rounded border p-2" />
                  <p className="mb-2 text-xs text-black/55">Se agrega automáticamente +54 9 para WhatsApp.</p>
                  <input placeholder="Email" value={newWorker.email} onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })} className="mb-2 w-full rounded border p-2" />
                  <input
                    key={newWorkerFileInputKey}
                    type="file"
                    accept="image/*"
                    className="mb-2 w-full rounded border p-2"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => setNewWorker((prev) => ({ ...prev, photoUrl: reader.result }));
                      reader.readAsDataURL(file);
                    }}
                  />
                  <textarea placeholder="Sobre este profesional" value={newWorker.about} onChange={(e) => setNewWorker({ ...newWorker, about: e.target.value })} className="mb-2 min-h-[96px] w-full rounded border p-2" />
                  <button onClick={addWorker} className="rounded bg-black px-4 py-2 text-white">Guardar</button>

                  <div className="mt-4 space-y-4">
                    {addedWorkers.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-black/30 p-4 text-sm text-black/60">Todavía no cargaste profesionales nuevos.</div>
                    )}

                    {addedWorkers.map((worker, index) => (
                      <div key={worker.id} className="rounded-2xl border p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold">Perfil creado #{index + 1}</p>
                            <p className="text-xs text-black/55">{worker.name || 'Sin nombre'} · {worker.role || 'Sin especialidad'}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingWorkerId(editingWorkerId === worker.id ? null : worker.id)} className="rounded-lg border border-black px-3 py-1 text-xs font-semibold">{editingWorkerId === worker.id ? 'Cerrar' : 'Editar'}</button>
                            <button onClick={() => removeWorker(worker.id)} className="rounded-lg border border-black px-3 py-1 text-xs font-semibold">Eliminar</button>
                          </div>
                        </div>

                        {editingWorkerId === worker.id && (
                          <div className="grid gap-2 md:grid-cols-2">
                            <input value={worker.name} onChange={(e) => updateWorker(worker.id, 'name', e.target.value)} className="w-full rounded border p-2" placeholder="Nombre" />
                            <select value={worker.role} onChange={(e) => updateWorker(worker.id, 'role', e.target.value)} className="w-full rounded border p-2">
                              {BASE_SERVICES.map((service) => <option key={service.name} value={service.name}>{service.name}</option>)}
                            </select>
                            <select value={worker.area} onChange={(e) => updateWorker(worker.id, 'area', e.target.value)} className="w-full rounded border p-2">
                              {MENDOZA_DEPARTMENTS.map((department) => <option key={department} value={department}>{department}</option>)}
                            </select>
                            <input value={String(worker.contact || '').replace(/[^0-9]/g, '').slice(-10)} onChange={(e) => updateWorker(worker.id, 'contact', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} className="w-full rounded border p-2" placeholder="Teléfono (10 dígitos)" />
                            <input value={worker.email || ''} onChange={(e) => updateWorker(worker.id, 'email', e.target.value)} className="w-full rounded border p-2" placeholder="Email" />
                            <input
                              type="file"
                              accept="image/*"
                              className="w-full rounded border p-2 md:col-span-2"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => updateWorker(worker.id, 'photoUrl', reader.result);
                                reader.readAsDataURL(file);
                              }}
                            />
                            <textarea value={worker.about || ''} onChange={(e) => updateWorker(worker.id, 'about', e.target.value)} className="min-h-[96px] w-full rounded border p-2 md:col-span-2" placeholder="Sobre este profesional" />
                            <div className="mt-2 flex items-center justify-between md:col-span-2">
                              <span className="text-sm font-semibold">Disponibilidad</span>
                              <button
                                onClick={() => updateWorker(worker.id, 'availability', worker.availability === 'Disponible ahora' ? 'No disponible' : 'Disponible ahora')}
                                className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${worker.availability === 'Disponible ahora' ? 'bg-green-500' : 'bg-red-500'}`}
                              >
                                {worker.availability === 'Disponible ahora' ? 'Disponible ahora' : 'No disponible'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-black/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-black/60 md:flex-row">
          <p>© 2026 HomeFix. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-black">Términos</a>
            <a href="#" className="hover:text-black">Privacidad</a>
            <a href="#" className="hover:text-black">Contacto</a>
          </div>
        </div>

        <div className="fixed bottom-6 right-6 z-50">
          {isChatOpen && (
            <div className="mb-4 w-[340px] rounded-3xl border border-black bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/50">Asistente HomeFix</p>
                  <h4 className="text-lg font-black">¿A quién necesito contratar?</h4>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="rounded-full border border-black px-3 py-1 text-sm">✕</button>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {HELP_SUGGESTIONS.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setAssistantMessage(item.answer);
                      setSelectedService(item.service);
                      setTimeout(() => document.getElementById('profesionales')?.scrollIntoView({ behavior: 'smooth' }), 200);
                    }}
                    className="rounded-full border px-3 py-2 text-xs font-semibold"
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              <div className="mb-3 flex gap-2">
                <input value={assistantInput} onChange={(e) => setAssistantInput(e.target.value)} placeholder="Describí tu problema" className="flex-1 rounded-xl border border-black/20 px-3 py-2 text-sm" />
                <button
                  onClick={() => {
                    const text = assistantInput.toLowerCase();
                    if (text.includes('agua') || text.includes('caño')) setSelectedService('Plomería');
                    else if (text.includes('luz') || text.includes('térmica') || text.includes('electric')) setSelectedService('Electricidad');
                    else if (text.includes('gas') || text.includes('calef')) setSelectedService('Gas');
                    else if (text.includes('aire')) setSelectedService('Aire acondicionado');
                    else if (text.includes('pint')) setSelectedService('Pintura');
                    else if (text.includes('mueble') || text.includes('puerta')) setSelectedService('Carpintería');
                    else if (text.includes('pileta')) setSelectedService('Piletero');
                    setAssistantMessage('Te mostramos profesionales que pueden ayudarte.');
                    setTimeout(() => document.getElementById('profesionales')?.scrollIntoView({ behavior: 'smooth' }), 200);
                  }}
                  className="rounded-xl bg-black px-3 py-2 text-sm text-white"
                >
                  Buscar
                </button>
              </div>

              <div className="min-h-[120px] rounded-2xl bg-black p-4 text-sm text-white">
                <p>{assistantMessage || 'Elegí una duda frecuente y te orientamos con el rubro correcto.'}</p>
                <div className="mt-4 rounded-2xl bg-white/10 p-3">
                  <p className="text-sm font-semibold">¿Te gustaría hablar con una persona?</p>
                  <p className="mt-1 text-xs text-white/75">Si todavía tenés dudas, podés hablar directo con nosotros por WhatsApp.</p>
                  <a href={creatorWhatsappLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black">Hablar con una persona</a>
                </div>
              </div>
            </div>
          )}

          <button onClick={() => setIsChatOpen((prev) => !prev)} className="flex items-center gap-3 rounded-full bg-black px-5 py-4 font-semibold text-white shadow-2xl">
            <span>Asistente HomeFix</span>
          </button>
        </div>
      </footer>
    </div>
  );

