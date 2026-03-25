import { useEffect, useMemo, useRef, useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, sendEmailVerification } from 'firebase/auth';
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';

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
  const [currentUser, setCurrentUser] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', photoUrl: '' });
  const profileRef = useRef(null);

  const [creatorProfile, setCreatorProfile] = useState({
    name: 'Tomás Notti',
    role: 'Creador de HomeFix',
    email: 'homefix@demo.com',
    phone: '+54 9 261 000-0000',
    city: 'Mendoza',
    bio: 'Estoy construyendo HomeFix para conectar clientes con profesionales confiables de forma simple y rápida.',
  });

  const [newWorker, setNewWorker] = useState({
    name: '',
    role: 'Plomería',
    area: 'Capital',
    contact: '',
    email: '',
    photoUrl: '',
    about: '',
  });

  const [addedWorkers, setAddedWorkers] = useState([]);
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

  const scrollToProfile = () => {
    profileRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Sesión cerrada');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleProfileSave = async () => {
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, {
        displayName: profileForm.name,
        photoURL: profileForm.photoUrl,
      });
      setCurrentUser({ ...auth.currentUser, displayName: profileForm.name, photoURL: profileForm.photoUrl });
      alert('Perfil actualizado');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    try {
      if (authMode === 'register') {
        if (authForm.password !== authForm.confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }

        const result = await createUserWithEmailAndPassword(
          auth,
          authForm.email,
          authForm.password
        );

        if (authForm.name.trim()) {
          await updateProfile(result.user, {
            displayName: authForm.name,
          });
        }

        try {
          await setDoc(doc(db, 'users', result.user.uid), {
            name: authForm.name || '',
            email: authForm.email,
            role: authRole,
            createdAt: new Date().toISOString(),
          });
        } catch (firestoreError) {
          console.error('Error Firestore:', firestoreError);
          alert('Falló guardar en Firestore');
          return;
        }

        await sendEmailVerification(result.user);

        alert('Cuenta creada. Verificá tu email antes de usar la app 📩');
        closeAuthModal();
      } else {
        const result = await signInWithEmailAndPassword(
          auth,
          authForm.email,
          authForm.password
        );

        await result.user.reload();

        if (!result.user.emailVerified) {
          alert('Tenés que verificar tu email antes de ingresar 📩');
          await signOut(auth);
          return;
        }

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
    const fetchWorkers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'workers'));
        const workers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAddedWorkers(workers);
      } catch (error) {
        console.error('Error cargando workers:', error);
      }
    };

    fetchWorkers();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setProfileForm({
          name: user.displayName || '',
          email: user.email || '',
          photoUrl: user.photoURL || '',
        });
      } else {
        setProfileForm({ name: '', email: '', photoUrl: '' });
      }
    });

    return () => unsubscribe();
  }, []);

  const addWorker = async () => {
    const phoneDigits = String(newWorker.contact || '').replace(/[^0-9]/g, '');

    if (!newWorker.name.trim() || !newWorker.role.trim()) return;

    if (phoneDigits.length !== 10) {
      alert('El teléfono debe tener 10 dígitos.');
      return;
    }

    const workerToSave = {
      ...newWorker,
      contact: phoneDigits,
      rating: 'Nuevo',
      reviews: 0,
      availability: 'Disponible ahora',
      reviewEntries: [],
    };

    try {
      await addDoc(collection(db, 'workers'), workerToSave);

      const snapshot = await getDocs(collection(db, 'workers'));
      const workers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAddedWorkers(workers);
      setNewWorker({ name: '', role: 'Plomería', area: 'Capital', contact: '', email: '', photoUrl: '', about: '' });
      setNewWorkerFileInputKey((prev) => prev + 1);
      alert('Profesional guardado en la nube 🚀');
    } catch (error) {
      console.error(error);
      alert('Error guardando en Firebase');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Mantené desde tu App actual el resto del JSX igual */}
    </div>
  );
}
