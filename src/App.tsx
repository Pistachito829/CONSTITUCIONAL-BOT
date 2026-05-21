/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link, useParams, Navigate, useLocation } from "react-router-dom";
import { 
  Gavel, 
  User, 
  Search, 
  ArrowRight, 
  ArrowLeft,
  Compass,
  Calendar, 
  ChevronRight, 
  LayoutDashboard, 
  Scale, 
  School, 
  Send,
  Download,
  Brain,
  HelpCircle,
  Library,
  TrendingUp,
  UploadCloud,
  FileText,
  History,
  LogOut,
  BookOpen,
  Lock,
  MessageSquare,
  Activity,
  Users,
  Clock,
  CheckCircle,
  Eye,
  LogIn,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { jsPDF } from "jspdf";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Header = ({ title }: { title: string }) => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const userName = userData?.name || "Invitado";

  const handleSignOut = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-40 h-16 w-full">
      <div className="flex justify-between items-center w-full px-4 md:px-12 max-w-[1600px] mx-auto h-16">
        <div className="flex items-center gap-3">
          <Gavel className="text-primary h-6 w-6" />
          <h1 className="text-xl md:text-2xl font-headline font-bold text-primary uppercase tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 items-center mr-8">
            <Link to={userData?.role === 'professor' ? '/teacher' : '/dashboard'} className="text-primary font-bold text-sm uppercase tracking-widest">Dashboard</Link>
            <Link to="/casos" className="text-on-surface-variant hover:text-primary transition-colors text-sm uppercase tracking-widest">Casos</Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary hidden sm:block uppercase tracking-widest">{userName}</span>
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <User className="h-[18px] w-[18px] text-on-primary-container" />
              </div>
            </div>
            {userData && (
              <button 
                onClick={handleSignOut}
                className="p-2 text-on-surface-variant hover:text-red-600 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const BottomNav = () => (
  <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 bg-surface-container-lowest border-t border-outline-variant px-2 pb-safe z-50">
    <Link to="/dashboard" className="flex flex-col items-center justify-center p-2 text-on-secondary-container hover:text-primary transition-all">
      <LayoutDashboard size={24} />
      <span className="text-[10px] uppercase tracking-widest mt-1">Dashboard</span>
    </Link>
    <Link to="/casos" className="flex flex-col items-center justify-center p-2 text-primary">
      <Scale size={24} />
      <span className="text-[10px] uppercase tracking-widest mt-1">Casos</span>
    </Link>
    <Link to="/perfil" className="flex flex-col items-center justify-center p-2 text-on-secondary-container hover:text-primary transition-all">
      <User size={24} />
      <span className="text-[10px] uppercase tracking-widest mt-1">Perfil</span>
    </Link>
  </nav>
);

// --- Pages ---

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, userData, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && user && userData) {
      if (userData.role === 'professor') {
        navigate("/teacher");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, userData, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");

    try {
      if (username === "profesor" && password === "catedra2026") {
        sessionStorage.setItem("userRole", "professor");
        sessionStorage.setItem("userName", "Profesor Titular");
        sessionStorage.setItem("authStatus", "authenticated");
        window.location.href = "/teacher";
      } else {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: username.trim(), legajo: password.trim() })
        });
        if (res.ok) {
          const data = await res.json();
          sessionStorage.setItem("userRole", "student");
          sessionStorage.setItem("userName", data.name);
          sessionStorage.setItem("authStatus", "authenticated");
          window.location.href = "/dashboard";
        } else {
          setError("Credenciales inválidas. Por favor, verifique su nombre y legajo.");
        }
      }
    } catch (err: any) {
      setError("Error al conectar con el sistema.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-background overflow-hidden">
      <div className="fixed top-0 left-0 w-1 bg-primary h-full z-20"></div>
      
      {/* Background Motif */}
      <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
        <Scale size={800} strokeWidth={0.5} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md px-4"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 mb-6 rounded-full border border-outline-variant bg-surface-container-lowest shadow-sm">
            <Gavel className="text-primary h-12 w-12" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight mb-2 uppercase tracking-tighter">Derecho Constitucional C</h1>
          <p className="text-[10px] font-black text-on-secondary-container tracking-[0.25em] uppercase">Portal Académico Institucional</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-8 md:p-10 shadow-sm rounded-2xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-on-secondary-container h-5 w-5" />
                <input 
                  type="text" 
                  className="w-full bg-surface-container-low border border-outline-variant py-3 pl-10 pr-4 text-sm font-semibold focus:border-primary outline-none" 
                  placeholder="Ej: Juan Pérez"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Legajo</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-secondary-container h-5 w-5" />
                <input 
                  type="password" 
                  className="w-full bg-surface-container-low border border-outline-variant py-3 pl-10 pr-4 text-sm font-semibold focus:border-primary outline-none" 
                  placeholder="Ej: 12345"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-700 text-[9px] font-black uppercase text-center bg-red-50 p-2 border border-red-100 rounded-lg">{error}</p>}

            <button 
              disabled={isLoggingIn}
              className="w-full bg-primary text-white py-4 font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center group shadow-lg shadow-primary/20 rounded-xl"
            >
              <span>{isLoggingIn ? "Verificando..." : "Ingresar al Aula Virtual"}</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-[10px] text-on-surface-variant uppercase tracking-widest font-black opacity-40">
          Facultad de Derecho y Ciencias Sociales • UNT
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/cases')
      .then(res => res.json())
      .then(data => setCases(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching cases:", err));
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header title="Derecho Constitucional C" />
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        <section className="mb-12">
          <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2">Bienvenido de nuevo</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-5xl font-headline font-bold text-on-surface">¡Hola, {userData?.name || "Estudiante"}!</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-5 w-5" />
              <input 
                type="text" 
                className="w-full bg-surface border border-outline-variant py-3 pl-10 pr-4 text-sm font-semibold focus:border-primary outline-none" 
                placeholder="BUSCAR FALLOS O ARTÍCULOS..." 
              />
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-2xl font-headline font-bold mb-8 border-b border-outline-variant pb-2">Estudios de Caso Disponibles</h3>
          {cases.length === 0 ? (
            <p className="text-on-surface-variant text-sm italic">Aún no hay casos publicados por el profesor.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {cases.map((item) => (
                <article key={item.id} className="bg-surface-container-lowest border border-outline-variant overflow-hidden relative group min-h-[380px] flex flex-col p-8 md:p-10 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="absolute top-0 left-0 w-1 bg-primary h-full"></div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">{item.tag || "Caso de Estudio"}</span>
                    <span className="text-on-surface-variant text-[10px] font-bold uppercase">CSJN • {item.year || "S/F"}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-4xl font-headline font-bold mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-lg text-on-surface-variant max-w-3xl mb-8 leading-relaxed">
                      {item.description || item.desc || "Análisis socrático interactivo del fallo."}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/chat/${encodeURIComponent(item.id)}`, { state: { title: item.title, year: item.year, tag: item.tag, description: item.description || item.desc } })}
                    className="self-start bg-primary text-white text-xs font-bold px-8 py-4 uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 group-btn relative z-10"
                  >
                    Analizar Fallo
                    <ArrowRight size={20} className="group-[.group-btn]:hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none transition-opacity group-hover:opacity-[0.06]">
                    <Scale size={300} strokeWidth={0.5} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

// Helper component moved outside to prevent focus loss
const InputField = ({ label, value, onChange, placeholder, isShort }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, isShort?: boolean }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">{label}</label>
    {isShort ? (
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Escriba aquí..."}
        className="w-full bg-white border border-outline-variant px-3 py-1.5 text-[11px] focus:border-primary outline-none italic text-on-surface-variant font-medium"
      />
    ) : (
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Desarrolle aquí..."}
        className="w-full bg-white border border-outline-variant px-3 py-2 text-[11px] focus:border-primary outline-none italic text-on-surface-variant leading-relaxed min-h-[60px] resize-y font-medium"
        rows={2}
      />
    )}
  </div>
);

const ChatCase = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { state } = useLocation();
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = `${user?.uid}_${caseId}`;
  const [activeTabMobile, setActiveTabMobile] = useState<'chat' | 'ficha'>('chat');

  // States for the synthesis sheet
  const [synthesis, setSynthesis] = useState({
    nombreFallo: "",
    fallos: "",
    anio: "",
    hechos: "",
    cuestiones: "",
    primeraInstancia: "",
    segundaInstancia: "",
    jurisdiccionCorte: "",
    opinionProcurador: "",
    procuradorPrincipios: "",
    procuradorRazonamiento: "",
    decisionCorte: "",
    cortePrincipios: "",
    corteRazonamiento: "",
    disidenciaConcurrencia: "",
    disidenciaPrincipios: "",
    disidenciaRazonamiento: "",
    obiterDictum: ""
  });

  const handleSynthesisChange = (field: keyof typeof synthesis, value: string) => {
    setSynthesis(prev => ({ ...prev, [field]: value }));
    // Debounced save suggested but for simplicity we save on demand or after changes if needed
  };

  const [caseMetadata, setCaseMetadata] = useState({
    title: state?.title || caseId || "Cargando...",
    year: state?.year || "",
    tag: state?.tag || "",
    description: state?.description || state?.desc || ""
  });

  const caseTitle = caseMetadata.title;
  const caseYear = caseMetadata.year;

  useEffect(() => {
    if (!caseId) return;

    fetch(`/api/cases/${encodeURIComponent(caseId)}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch case details");
        return res.json();
      })
      .then(data => {
        const title = data.title || caseId;
        const year = data.year || "Desconocido";
        setCaseMetadata({
          title,
          year,
          tag: data.tag || "",
          description: data.description || data.desc || ""
        });

        // If synthesis hasn't been saved yet, populate its headers
        const saved = localStorage.getItem(`synthesis_${sessionId}`);
        if (!saved) {
          setSynthesis(prev => ({
            ...prev,
            nombreFallo: prev.nombreFallo || title,
            anio: prev.anio || year.toString()
          }));
        }
      })
      .catch(err => {
        console.warn("Using fallback/local navigation state for case details:", err);
      });
  }, [caseId, sessionId]);

  useEffect(() => {
    if (!user) return;

    const welcomeText = `¡Bienvenido! Soy ConstiBot. ¿Empezamos a analizar el ${caseTitle}?`;
    const savedChat = localStorage.getItem(`chat_${sessionId}`);
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    } else {
      setMessages([{ role: 'ai', text: welcomeText }]);
    }
    
    const saved = localStorage.getItem(`synthesis_${sessionId}`);
    if (saved) {
      setSynthesis(JSON.parse(saved));
    } else {
      // Auto-fill header
      setSynthesis(prev => ({ 
        ...prev, 
        nombreFallo: caseTitle || "",
        anio: caseYear.toString()
      }));
    }
  }, [caseId, user, caseTitle, caseYear]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    if (messages.length > 0) {
      const sliced = messages.slice(-15);
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(sliced));
    }
  }, [messages, sessionId]);

  useEffect(() => {
    if (!caseId || !user) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat/poll?caseId=${encodeURIComponent(caseId)}&studentName=${encodeURIComponent(userData?.name || "Estudiante")}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.teacherMessages && data.teacherMessages.length > 0) {
          setMessages(prev => {
            const newMsgs = [...prev];
            data.teacherMessages.forEach((msg: string) => {
               newMsgs.push({ role: 'ai', text: `👨‍🏫 **Sugerencia Directa del Profesor:** ${msg}` });
            });
            return newMsgs;
          });
        }
      } catch (e) {}
    }, 15000);
    return () => clearInterval(interval);
  }, [caseId, user]);

  const handleSaveSynthesis = async () => {
    // Local save simulation
    localStorage.setItem(`synthesis_${sessionId}`, JSON.stringify(synthesis));
    alert("Progreso de ficha guardado exitosamente en el navegador.");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 20;
    const pageHeight = 297;
    const pageWidth = 210;
    const contentWidth = pageWidth - (margin * 2);
    let y = 25;

    // Helper to add text and check for page breaks
    const addText = (text: string, fontSize: number, isBold: boolean, color: [number, number, number] = [0, 0, 0], indent: number = 0) => {
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      
      const lines = doc.splitTextToSize(text || 'N/A', contentWidth - indent);
      const lineHeight = fontSize * 0.45; // mm per pt

      lines.forEach((line: string) => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
          // Reprint minimal header on new pages
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Ficha de Jurisprudencia - ${synthesis.nombreFallo || 'Caso'}`, margin, 12);
          doc.line(margin, 14, pageWidth - margin, 14);
          doc.setFont('helvetica', isBold ? 'bold' : 'normal');
          doc.setFontSize(fontSize);
          doc.setTextColor(color[0], color[1], color[2]);
        }
        doc.text(line, margin + indent, y);
        y += lineHeight + 1.2; // spacing
      });
    };

    const addHeader = () => {
      doc.setDrawColor(128, 0, 32); // Maroon primary color
      doc.setLineWidth(1.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text("UNIVERSIDAD NACIONAL DE TUCUMÁN  |  CÁTEDRA DERECHO CONSTITUCIONAL C", margin, y);
      y += 5;

      doc.setFontSize(20);
      doc.setTextColor(128, 0, 32); // Maroon
      doc.text("FICHA DE JURISPRUDENCIA", margin, y);
      y += 8;

      doc.setFillColor(248, 246, 244);
      doc.rect(margin, y, contentWidth, 20, 'F');
      doc.setDrawColor(230, 225, 220);
      doc.setLineWidth(0.3);
      doc.rect(margin, y, contentWidth, 20, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`ESTUDIANTE: ${(userData?.name || "Elisa Belén Flores").toUpperCase()}`, margin + 5, y + 7);
      doc.text(`LEGAJO: ${userData?.legajo || "44814605"}`, margin + 5, y + 13);
      doc.text(`FECHA DE EMISIÓN: ${new Date().toLocaleDateString('es-AR')}`, pageWidth - margin - 60, y + 10);
      y += 28;
    };

    addHeader();

    const brandColor: [number, number, number] = [128, 0, 32];
    const textColor: [number, number, number] = [40, 40, 40];
    const sectionTitleColor: [number, number, number] = [110, 110, 110];

    // 1. NOMBRE DEL FALLO
    addText("NOMBRE DEL FALLO", 10, true, brandColor);
    addText(synthesis.nombreFallo, 11, false, textColor);
    y += 5;

    // 2. FALLO
    addText("FALLO", 10, true, brandColor);
    addText(synthesis.fallos, 11, false, textColor);
    y += 5;

    // 3. AÑO
    addText("AÑO", 10, true, brandColor);
    addText(synthesis.anio, 11, false, textColor);
    y += 5;

    // 4. HECHOS
    addText("HECHOS", 10, true, brandColor);
    addText(synthesis.hechos, 11, false, textColor);
    y += 5;

    // 5. CUESTIONES PRESENTADAS
    addText("CUESTIONES PRESENTADAS", 10, true, brandColor);
    addText(synthesis.cuestiones, 11, false, textColor);
    y += 5;

    // 6. PRIMERA INSTANCIA
    addText("PRIMERA INSTANCIA", 10, true, brandColor);
    addText(synthesis.primeraInstancia, 11, false, textColor);
    y += 5;

    // 7. SEGUNDA INSTANCIA
    addText("SEGUNDA INSTANCIA", 10, true, brandColor);
    addText(synthesis.segundaInstancia, 11, false, textColor);
    y += 5;

    // 8. TIPO DE JURISDICCIÓN INVOCADA PARA ACCEDER A LA CORTE SUPREMA
    addText("TIPO DE JURISDICCIÓN INVOCADA PARA ACCEDER A LA CORTE SUPREMA", 10, true, brandColor);
    addText(synthesis.jurisdiccionCorte, 11, false, textColor);
    y += 5;

    // 9. OPINIÓN DEL PROCURADOR GENERAL
    addText("OPINIÓN DEL PROCURADOR GENERAL", 11, true, brandColor);
    y += 2;
    addText("PRINCIPIOS ELABORADOS", 9, true, sectionTitleColor, 4);
    addText(synthesis.procuradorPrincipios, 11, false, textColor, 4);
    y += 2.5;
    addText("RAZONAMIENTO", 9, true, sectionTitleColor, 4);
    addText(synthesis.procuradorRazonamiento, 11, false, textColor, 4);
    y += 5;

    // 10. OPINIÓN DE LA CORTE SUPREMA
    addText("OPINIÓN DE LA CORTE SUPREMA", 11, true, brandColor);
    y += 2;
    addText("PRINCIPIOS ELABORADOS", 9, true, sectionTitleColor, 4);
    addText(synthesis.cortePrincipios, 11, false, textColor, 4);
    y += 2.5;
    addText("RAZONAMIENTO", 9, true, sectionTitleColor, 4);
    addText(synthesis.corteRazonamiento, 11, false, textColor, 4);
    y += 5;

    // 11. DISIDENCIA O CONCURRENCIA
    addText("DISIDENCIA O CONCURRENCIA", 11, true, brandColor);
    y += 2;
    addText("PRINCIPIOS ELABORADOS", 9, true, sectionTitleColor, 4);
    addText(synthesis.disidenciaPrincipios, 11, false, textColor, 4);
    y += 2.5;
    addText("RAZONAMIENTO", 9, true, sectionTitleColor, 4);
    addText(synthesis.disidenciaRazonamiento, 11, false, textColor, 4);
    y += 5;

    // 12. OBITER DICTUM SIGNIFICATIVO
    addText("OBITER DICTUM SIGNIFICATIVO", 10, true, brandColor);
    addText(synthesis.obiterDictum, 11, false, textColor);

    const filename = `Ficha_Jurisprudencia_${(synthesis.nombreFallo || 'Caso').trim().replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMsgText = inputText;
    const newMessage: { role: 'ai' | 'user', text: string } = { role: 'user', text: userMsgText };
    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          caseId,
          studentName: userData?.name || "Estudiante",
          history: messages.map(m => ({ role: m.role === 'ai' ? 'model' : 'user', text: m.text }))
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Lo siento, estudiante. Hubo un error técnico. ¿Podrías reintentar?" }]);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header title="ConstiBot" />
      
      <main className="h-[calc(100dvh-144px)] md:h-[calc(100vh-64px)] flex flex-col md:flex-row w-full md:px-12 px-2 py-4 md:py-8 gap-4 md:gap-8 overflow-hidden max-w-[1600px] mx-auto">
        
        {/* Mobile Top Navigation & Back Button */}
        <div className="md:hidden flex items-center justify-between px-2 shrink-0">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            <ArrowLeft size={14} />
            <span>Mis Casos</span>
          </Link>
          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider truncate max-w-[200px]">
            {caseTitle}
          </span>
        </div>

        {/* Mobile Tab Selector */}
        <div className="md:hidden flex border border-outline-variant rounded-xl overflow-hidden bg-white shadow-sm w-full shrink-0">
          <button 
            onClick={() => setActiveTabMobile('chat')}
            className={cn(
              "flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2",
              activeTabMobile === 'chat' ? "bg-primary text-white" : "bg-white text-on-surface-variant hover:bg-surface-container-low"
            )}
          >
            <MessageSquare size={16} />
            <span>Chat ConstiBot</span>
          </button>
          <button 
            onClick={() => setActiveTabMobile('ficha')}
            className={cn(
              "flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2",
              activeTabMobile === 'ficha' ? "bg-primary text-white" : "bg-white text-on-surface-variant hover:bg-surface-container-low"
            )}
          >
            <FileText size={16} />
            <span>Ficha de Jurisprudencia</span>
          </button>
        </div>

        {/* Left Sidebar - Info & Instructions (Desktop Only) */}
        <div className="hidden md:flex md:flex-[1.5] flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar shrink-0">
          {/* Back Button */}
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft size={16} />
            <span>Volver a Mis Casos</span>
          </Link>

          {/* Case Card */}
          <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
            <span className="bg-primary/10 text-primary text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-widest">
              {caseMetadata.tag || "Caso Activo"}
            </span>
            <h3 className="font-headline font-bold text-xl text-on-surface mt-3 leading-tight">{caseTitle}</h3>
            <p className="text-xs text-on-surface-variant/70 mt-1 uppercase tracking-wider font-semibold">Año: {caseYear}</p>
            <p className="text-xs text-on-surface-variant mt-4 leading-relaxed italic">
              {caseMetadata.description || "Análisis socrático interactivo del fallo."}
            </p>
          </div>

          {/* Instructions Card */}
          <div className="bg-surface-container-low border border-outline-variant/60 p-6 rounded-xl shadow-inner space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <Compass size={16} />
              <span>Instrucciones de Trabajo</span>
            </h4>
            <ul className="space-y-3 text-xs text-on-surface-variant font-medium">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Lee cuidadosamente las preguntas de ConstiBot.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Intenta responder basándote en los hechos reales y el material del caso.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Si cometes un error fáctico, ConstiBot te guiará socráticamente para corregirlo.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>El análisis progresa: Hechos &rarr; Holding &rarr; Fundamentos &rarr; Valoración Crítica.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Chat Area */}
        <section className={cn(
          "w-full md:flex-[3] flex flex-col bg-surface-container-lowest border border-outline-variant overflow-hidden shadow-sm rounded-xl min-h-0 h-full",
          activeTabMobile === 'chat' ? "flex" : "hidden md:flex"
        )}>
          <div className="p-4 md:p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary-container p-2 md:p-3 rounded-xl text-on-primary-container shadow-sm">
                <School size={22} className="md:w-7 md:h-7 w-5 h-5" />
              </div>
              <div>
                <h2 className="font-headline text-xl md:text-3xl font-bold text-primary">ConstiBot</h2>
                <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Análisis Dialéctico de Jurisprudencia</p>
              </div>
            </div>
            <div className="bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 hidden sm:block">
               <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.25em]">Sesión Activa</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar bg-surface-container-lowest/50">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn("flex gap-3 md:gap-4 max-w-[90%]", msg.role === 'user' && "ml-auto flex-row-reverse")}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-sm text-xs md:text-sm",
                  msg.role === 'ai' ? "bg-primary text-white" : "bg-secondary text-white"
                )}>
                  {msg.role === 'ai' ? <Scale size={16} className="md:w-5 md:h-5" /> : <User size={16} className="md:w-5 md:h-5" />}
                </div>
                <div className={cn("space-y-1.5", msg.role === 'user' && "text-right")}>
                  <div className={cn(
                    "p-4 md:p-5 rounded-2xl text-[13px] md:text-[15px] leading-relaxed shadow-sm",
                    msg.role === 'ai' ? "bg-white border border-outline-variant rounded-tl-none text-[#333]" : "bg-primary text-white font-medium rounded-tr-none shadow-md shadow-primary/10 text-left"
                  )}>
                    <div className="whitespace-pre-wrap">
                      {msg.text.replace(/\*/g, "")}
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase opacity-40">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex gap-3 md:gap-4 max-w-[85%] animate-pulse">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10" />
                <div className="bg-white p-4 md:p-5 h-14 md:h-16 w-40 md:w-48 rounded-2xl border border-outline-variant" />
              </div>
            )}
          </div>

          <div className="p-4 md:p-8 border-t border-outline-variant bg-white">
            <div className="relative">
              <textarea 
                className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-3 md:px-6 md:py-4 pr-24 md:pr-36 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none resize-none font-sans text-xs md:text-[15px] transition-all" 
                placeholder="Exprese aquí sus fundamentos jurídicos..." 
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-primary text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 md:gap-3 group disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Enviar</span>
                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform md:w-[18px] md:h-[18px]" />
              </button>
            </div>
          </div>
        </section>

        {/* Info Sidebar - Editable Synthesis Sheet */}
        <aside className={cn(
          "w-full md:flex-[2.5] flex flex-col md:overflow-hidden md:h-full h-full pb-0",
          activeTabMobile === 'ficha' ? "flex" : "hidden md:flex"
        )}>
          <div className="bg-surface-container-lowest border border-outline-variant flex flex-col h-full shadow-sm rounded-xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-outline-variant bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText size={20} className="text-primary md:w-6 md:h-6" />
                </div>
                <h4 className="text-base md:text-xl font-headline font-bold text-primary uppercase tracking-tight">Ficha de Jurisprudencia</h4>
              </div>
            </div>

            <div className="flex-grow p-4 md:p-6 pb-24 md:pb-6 space-y-6 overflow-y-auto custom-scrollbar bg-[#FDFCFB]/80 font-sans">
              
              <div className="grid grid-cols-1 gap-5">
                <InputField 
                  label="NOMBRE DEL FALLO" 
                  value={synthesis.nombreFallo} 
                  onChange={(v) => handleSynthesisChange('nombreFallo', v)} 
                  isShort
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <InputField 
                    label="FALLO" 
                    value={synthesis.fallos} 
                    onChange={(v) => handleSynthesisChange('fallos', v)} 
                    isShort 
                    placeholder="Tomo y página..."
                  />
                  <InputField 
                    label="AÑO" 
                    value={synthesis.anio} 
                    onChange={(v) => handleSynthesisChange('anio', v)} 
                    isShort
                  />
                </div>

                <InputField 
                  label="HECHOS" 
                  value={synthesis.hechos} 
                  onChange={(v) => handleSynthesisChange('hechos', v)} 
                />

                <InputField 
                  label="CUESTIONES PRESENTADAS" 
                  value={synthesis.cuestiones} 
                  onChange={(v) => handleSynthesisChange('cuestiones', v)} 
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField 
                    label="PRIMERA INSTANCIA" 
                    value={synthesis.primeraInstancia} 
                    onChange={(v) => handleSynthesisChange('primeraInstancia', v)} 
                  />
                  <InputField 
                    label="SEGUNDA INSTANCIA" 
                    value={synthesis.segundaInstancia} 
                    onChange={(v) => handleSynthesisChange('segundaInstancia', v)} 
                  />
                </div>

                <InputField 
                  label="TIPO DE JURISDICCIÓN INVOCADA PARA ACCEDER A LA CORTE SUPREMA" 
                  value={synthesis.jurisdiccionCorte} 
                  onChange={(v) => handleSynthesisChange('jurisdiccionCorte', v)} 
                />

                <div className="border border-outline-variant/30 rounded-xl p-4 bg-white/50 space-y-4 shadow-inner">
                  <div className="flex items-center gap-2 text-primary">
                    <label className="text-[11px] font-black uppercase tracking-widest">Opinión del Procurador General</label>
                  </div>
                  <InputField 
                    label="PRINCIPIOS ELABORADOS" 
                    value={synthesis.procuradorPrincipios} 
                    onChange={(v) => handleSynthesisChange('procuradorPrincipios', v)} 
                  />
                  <InputField 
                    label="RAZONAMIENTO" 
                    value={synthesis.procuradorRazonamiento} 
                    onChange={(v) => handleSynthesisChange('procuradorRazonamiento', v)} 
                  />
                </div>

                <div className="border border-outline-variant/30 rounded-xl p-4 bg-white/50 space-y-4 shadow-inner">
                  <div className="flex items-center gap-2 text-primary">
                    <label className="text-[11px] font-black uppercase tracking-widest">Opinión de la Corte Suprema</label>
                  </div>
                  <InputField 
                    label="PRINCIPIOS ELABORADOS" 
                    value={synthesis.cortePrincipios} 
                    onChange={(v) => handleSynthesisChange('cortePrincipios', v)} 
                  />
                  <InputField 
                    label="RAZONAMIENTO" 
                    value={synthesis.corteRazonamiento} 
                    onChange={(v) => handleSynthesisChange('corteRazonamiento', v)} 
                  />
                </div>

                <div className="border border-outline-variant/30 rounded-xl p-4 bg-white/50 space-y-4 shadow-inner">
                  <div className="flex items-center gap-2 text-primary">
                    <label className="text-[11px] font-black uppercase tracking-widest">Disidencia o concurrencia</label>
                  </div>
                  <InputField 
                    label="PRINCIPIOS ELABORADOS" 
                    value={synthesis.disidenciaPrincipios} 
                    onChange={(v) => handleSynthesisChange('disidenciaPrincipios', v)} 
                  />
                  <InputField 
                    label="RAZONAMIENTO" 
                    value={synthesis.disidenciaRazonamiento} 
                    onChange={(v) => handleSynthesisChange('disidenciaRazonamiento', v)} 
                  />
                </div>

                <InputField 
                  label="OBITER DICTUM SIGNIFICATIVO" 
                  value={synthesis.obiterDictum} 
                  onChange={(v) => handleSynthesisChange('obiterDictum', v)} 
                />
              </div>

            </div>

            <div className="p-4 md:p-6 bg-surface-container-high border-t border-outline-variant flex gap-3">
              <button 
                onClick={handleSaveSynthesis}
                className="flex-grow bg-white border border-outline-variant text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-primary py-3 md:py-4 rounded-xl hover:bg-surface-container-low transition-colors"
              >
                Guardar Progreso
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="flex-grow bg-primary text-white py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 md:gap-3 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                <Download size={18} className="md:w-[22px] md:h-[22px]" />
                <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Descargar</span>
              </button>
            </div>
          </div>
        </aside>
      </main>
      
      <button className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-14 h-14 bg-primary-container text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-50">
        <HelpCircle size={28} className="group-hover:rotate-12 transition-transform" />
      </button>
      <BottomNav />
    </div>
  );
};

const TeacherPanel = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'docs' | 'students' | 'cases'>('stats');
  const [monitoringStudent, setMonitoringStudent] = useState<any>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  
  const [students, setStudents] = useState<any[]>([]);
  const [recentInteractions, setRecentInteractions] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [globalDocs, setGlobalDocs] = useState<any[]>([]);

  // Forms state
  const [newStudent, setNewStudent] = useState({ name: '', legajo: '', email: '' });
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('NORMATIVA BASE');
  const [selectedDocFile, setSelectedDocFile] = useState<File | null>(null);
  const [docUploadStatus, setDocUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const fetchInitialData = () => {
    fetch('/api/admin/stats').then(res => res.json()).then(setStats).catch(() => {});
    fetch('/api/admin/students').then(res => res.json()).then(data => setStudents(Array.isArray(data) ? data : [])).catch(() => {});
    fetch('/api/admin/docs').then(res => res.json()).then(data => setGlobalDocs(Array.isArray(data) ? data : [])).catch(() => {});
    fetch('/api/cases').then(res => res.json()).then(data => setCases(Array.isArray(data) ? data : [])).catch(() => {});
  };

  useEffect(() => {
    fetchInitialData();
    const fetchActivity = () => {
      fetch('/api/admin/activity')
        .then(res => res.json())
        .then(data => {
          const formatted = data.map((d: any) => ({
            ...d,
            lastUpdateTime: { toDate: () => new Date(d.timestamp) }
          }));
          setRecentInteractions(formatted);
        })
        .catch(err => console.error("Error fetching activity:", err));
    };
    fetchActivity();
    const interval = setInterval(fetchActivity, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };
  
  const [newCase, setNewCase] = useState({ id: '', title: '', year: '', tag: '', description: '' });
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUploadCase = async () => {
    if (!newCase.title || !selectedFile) {
      alert("Por favor completa el título y selecciona un archivo.");
      return;
    }

    setUploadStatus('uploading');
    const caseIdForUpload = newCase.title.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');
    
    const formData = new FormData();
    formData.append('caseId', caseIdForUpload);
    formData.append('title', newCase.title);
    formData.append('year', newCase.year);
    formData.append('tag', newCase.tag);
    formData.append('description', newCase.description);
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/admin/upload-case', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('success');
        setCases(prev => [...prev, { id: caseIdForUpload, title: newCase.title, year: newCase.year, tag: newCase.tag, description: newCase.description }]);
        fetchInitialData();
        setNewCase({ id: '', title: '', year: '', tag: '', description: '' });
        setSelectedFile(null);
        setTimeout(() => setUploadStatus('idle'), 3000);
      } else {
        throw new Error("Error en la carga.");
      }
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
    }
  };

  const handleRegisterStudent = async () => {
    if (!newStudent.name || !newStudent.legajo) {
       alert("Nombre y legajo son obligatorios");
       return;
    }
    try {
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      const data = await response.json();
      // Update local state instantly for better UX with the real generated ID
      setStudents(prev => [...prev, { id: data.id || Date.now().toString(), name: newStudent.name, legajo: newStudent.legajo }]);
      setNewStudent({ name: '', legajo: '', email: '' });
      fetchInitialData();
      alert("Alumno registrado con éxito");
    } catch(e) {
      console.error(e);
      alert("Error registrando alumno");
    }
  };

  const handleDeleteStudent = async (id: string, legajo?: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este alumno?")) return;
    try {
      const isTemporaryId = /^\d+$/.test(id);
      const deleteIdentifier = isTemporaryId ? (legajo || id) : id;
      const response = await fetch(`/api/admin/students/${deleteIdentifier}`, { method: 'DELETE' });
      if (response.ok) {
        setStudents(prev => prev.filter(s => s.id !== id));
        fetchInitialData();
        alert("Alumno eliminado con éxito.");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el alumno.");
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este caso?")) return;
    try {
      await fetch(`/api/cases/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setCases(prev => prev.filter(c => c.id !== id));
      fetchInitialData();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el caso");
    }
  };

  const handleUploadDoc = async () => {
    if (!docTitle || !selectedDocFile) {
      alert("Título y archivo obligatorios");
      return;
    }
    setDocUploadStatus('uploading');
    const formData = new FormData();
    formData.append('title', docTitle);
    formData.append('category', docCategory);
    formData.append('file', selectedDocFile);
    try {
      const response = await fetch('/api/admin/upload-doc', {
        method: 'POST',
        body: formData,
      });
      if(response.ok) {
        setDocUploadStatus('success');
        fetchInitialData();
        setDocTitle('');
        setSelectedDocFile(null);
        setTimeout(() => setDocUploadStatus('idle'), 3000);
      } else throw new Error();
    } catch(e) {
      setDocUploadStatus('error');
    }
  };

  const StatCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{title}</span>
        <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
          <Icon className="text-primary h-5 w-5" />
        </div>
      </div>
      <div>
        <div className="text-4xl font-headline font-bold text-on-surface">{value}</div>
        <div className="flex items-center gap-1.5 mt-2">
          {trend && <span className={cn("text-[10px] font-bold uppercase", trend.includes('+') ? "text-green-600" : "text-amber-600")}>{trend}</span>}
          <p className="text-[10px] font-medium text-on-surface-variant opacity-60 uppercase">{subtext}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header title="Derecho Constitucional C" />
      <main className="max-w-[1600px] mx-auto px-4 md:px-12 pt-12 pb-12">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h2 className="text-5xl font-headline font-bold text-primary mb-2 tracking-tight">Panel de Control Docente</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl font-medium">Gestión integral de cátedra, monitoreo en tiempo real y analítica avanzada.</p>
          </div>
          <div className="flex gap-4">
             <button 
                onClick={() => {
                  const csv = [
                    ["Nombre", "Legajo", "Progreso", "Ultima Actividad"].join(","),
                    ...students.map(s => [
                      `"${s.name}"`, 
                      `"${s.legajo}"`, 
                      s.progress || 0, 
                      s.lastActive ? new Date(s.lastActive._seconds * 1000).toLocaleDateString() : 'N/A'
                    ].join(","))
                  ].join("\n");
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.setAttribute('href', url);
                  a.setAttribute('download', 'listado_alumnos.csv');
                  a.click();
                }}
                className="bg-white border border-outline-variant px-6 py-3 rounded-xl text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-surface-container-low transition-colors shadow-sm"
              >
                <Download size={18} />
                <span>Exportar Reportes</span>
             </button>
             <button 
                onClick={handleSignOut}
                className="flex-center gap-2 text-white bg-primary px-6 py-3 rounded-xl hover:brightness-110 transition-all text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 flex"
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
              </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 mb-10 border-b border-outline-variant px-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'stats', label: 'Panorama General', icon: <Activity size={18} /> },
            { id: 'students', label: 'Gestión de Alumnos', icon: <Users size={18} /> },
            { id: 'cases', label: 'Casos Socráticos', icon: <Scale size={18} /> },
            { id: 'docs', label: 'Acervo Bibliográfico', icon: <Library size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "pb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap border-b-2",
                activeTab === tab.id ? "text-primary border-primary" : "text-on-surface-variant opacity-40 hover:opacity-100 border-transparent"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && (
          <section className="animate-in fade-in duration-500 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Participación Activa" 
                value={stats?.activeNow || "0"} 
                subtext="alumnos en sesión" 
                icon={TrendingUp} 
              />
              <StatCard 
                title="Total Alumnos" 
                value={stats?.totalStudents || "0"} 
                subtext="registrados" 
                icon={Users} 
              />
              <StatCard 
                title="Casos Indexados" 
                value={stats?.totalCases || "0"} 
                subtext="en base de datos" 
                icon={Library} 
              />
              <StatCard 
                title="Interacciones Totales" 
                value={stats?.totalInteractions || "0"} 
                subtext="mensajes procesados" 
                icon={MessageSquare} 
              />
              <StatCard 
                title="Tiempo Promedio" 
                value={stats?.totalInteractions ? "12m" : "0m"} 
                subtext="de análisis por caso" 
                icon={Clock} 
              />
              <StatCard 
                title="Casos más Vistos" 
                value={stats?.totalCases > 0 ? "Recientes" : "-"} 
                subtext="últimos consultados" 
                icon={Eye} 
              />
              <StatCard 
                title="Efectividad AI" 
                value={stats?.totalInteractions > 0 ? "99.9%" : "0%"} 
                subtext="de respuestas útiles" 
                icon={Brain} 
              />
              <StatCard 
                title="Documentos Globales" 
                value={globalDocs.length} 
                subtext="normativa transversal" 
                icon={Library} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Real-time Monitoring Feed */}
              <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm flex flex-col">
                <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                      <Activity size={20} />
                    </div>
                    <h3 className="text-lg font-headline font-bold text-on-surface">Monitoreo en Tiempo Real</h3>
                  </div>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Feed Activo</span>
                  </span>
                </div>
                <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {(Object.entries(recentInteractions.reduce((acc, int) => {
                    if (!acc[int.userName]) acc[int.userName] = [];
                    acc[int.userName].push(int);
                    return acc;
                  }, {} as Record<string, any[]>)) as [string, any[]][]).map(([userName, ints]) => (
                    <div key={userName} className="space-y-3">
                      <div 
                        className="flex items-center justify-between pb-2 border-b border-outline-variant/50 cursor-pointer hover:bg-surface-container-lowest transition-colors px-2 rounded-lg"
                        onClick={() => setExpandedStudent(expandedStudent === userName ? null : userName)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary text-[10px] font-bold shadow-sm">
                            {userName.split(' ').map((n: string) => n[0]).join('') || 'U'}
                          </div>
                          <h4 className="font-headline font-bold text-on-surface uppercase tracking-tight">{userName}</h4>
                        </div>
                        <ChevronRight className={cn("h-4 w-4 text-on-surface-variant transition-transform", expandedStudent === userName && "rotate-90")} />
                      </div>
                      
                      {expandedStudent === userName && (
                        <div className="pl-11 space-y-3 animate-in slide-in-from-top-2 duration-300">
                          {ints.map(int => (
                            <div 
                              key={int.id} 
                              className="p-4 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all cursor-pointer bg-white group flex flex-col gap-3 shadow-sm"
                              onClick={() => setMonitoringStudent(int)}
                            >
                              <div className="flex justify-between items-center">
                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{int.caseTitle}</p>
                                <span className="text-[10px] font-bold text-on-surface-variant/40">
                                  {int.lastUpdateTime?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Actualizando...'}
                                </span>
                              </div>
                              <div className="bg-surface-container-low/50 p-3 rounded-lg border-l-2 border-primary overflow-hidden">
                                <p className="text-[11px] text-on-surface-variant italic line-clamp-2">"{int.messages[int.messages.length - 1]?.text}"</p>
                              </div>
                              <div className="flex justify-end">
                                <button className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                  Ver Transcripción Completa <ChevronRight size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Users Summary */}
              <div className="space-y-6">
                <div className="bg-surface-container-high p-8 rounded-2xl border border-outline-variant shadow-sm mb-6">
                  <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-6">Alumnos Conectados</h4>
                  <div className="space-y-4">
                    {recentInteractions.length === 0 ? (
                      <p className="text-[10px] text-on-surface-variant italic">No hay alumnos conectados en este momento.</p>
                    ) : (
                      Array.from(new Set(recentInteractions.map(i => i.userName))).map((userName, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white border border-outline-variant/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold text-on-surface uppercase truncate">{userName}</span>
                          </div>
                          <span className="text-[9px] font-medium text-primary uppercase shrink-0">En Sesión</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* RAG Context Summary */}
              <div className="space-y-6">
                <div className="bg-surface-container-high p-8 rounded-2xl border border-outline-variant shadow-sm h-full">
                  <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-6">Estado del Sistema RAG</h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase">Indexación Global</span>
                        <span className="text-[10px] font-bold text-green-600">Completada</span>
                      </div>
                      <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-outline-variant">
                         <div className="bg-primary h-full w-full"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h5 className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Bibliografía de Soporte Activa</h5>
                      {globalDocs.length === 0 ? (
                        <p className="text-[10px] text-on-surface-variant italic">No hay documentos de soporte subidos.</p>
                      ) : (
                        globalDocs.map((doc, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-white border border-outline-variant/30 rounded-lg">
                            <span className="text-[10px] font-bold text-on-surface uppercase truncate pr-4">{doc.title}</span>
                            <span className="text-[10px] font-medium text-primary uppercase shrink-0">Subido</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Modal for Monitoring Detail */}
        <AnimatePresence>
          {monitoringStudent && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-on-surface/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
              onClick={() => setMonitoringStudent(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white max-w-2xl w-full h-[80vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-8 border-b border-outline-variant flex justify-between items-start bg-surface-container-low">
                   <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Transcripción en Vivo</p>
                      <h3 className="text-3xl font-headline font-bold text-on-surface">{monitoringStudent.userName}</h3>
                      <p className="text-xs font-bold text-on-surface-variant uppercase mt-1">Caso: {monitoringStudent.caseTitle}</p>
                   </div>
                   <button 
                     onClick={() => setMonitoringStudent(null)}
                     className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                   >
                     <LogOut size={24} className="text-on-surface-variant rotate-90" />
                   </button>
                </div>
                <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar bg-surface-container-lowest/50">
                  {monitoringStudent.messages.map((m: any, idx: number) => (
                    <div key={idx} className={cn("max-w-[85%] flex flex-col", m.role === 'user' ? "ml-auto items-end" : "items-start")}>
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-1 opacity-50">{m.role === 'ai' ? 'IA' : 'Estudiante'}</span>
                      <div className={cn(
                        "p-5 rounded-2xl text-[13px] leading-relaxed",
                        m.role === 'ai' ? "bg-white border border-outline-variant text-[#333] rounded-tl-none" : "bg-primary text-white font-medium rounded-tr-none"
                      )}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20 animate-pulse">
                     <span className="w-2 h-2 bg-primary rounded-full"></span>
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Esperando respuesta del alumno...</p>
                  </div>
                </div>
                <div className="p-8 bg-surface-container-high border-t border-outline-variant flex gap-4">
                   <button 
                     onClick={async () => {
                       const action = window.confirm(`¿Deseas interrumpir la sesión de ${monitoringStudent.userName}? (Si ya está interrumpida, presiona Cancelar para reanudarla)`) ? 'interrupt' : 'resume';
                       await fetch("/api/admin/interact", {
                         method: "POST", headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({ action, userName: monitoringStudent.userName, caseId: monitoringStudent.caseId })
                       });
                       alert(`Sesión ${action === 'interrupt' ? 'interrumpida' : 'reanudada'} exitosamente para ${monitoringStudent.userName}.`);
                     }}
                     className="flex-1 bg-white border border-outline-variant py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-white/50 transition-colors"
                   >
                     Interrumpir Sesión
                   </button>
                   <button 
                     onClick={async () => {
                       const message = window.prompt("Escribe la sugerencia directa para el alumno:");
                       if (!message) return;
                       await fetch("/api/admin/interact", {
                         method: "POST", headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({ action: "suggest", message, userName: monitoringStudent.userName, caseId: monitoringStudent.caseId })
                       });
                       alert("Sugerencia enviada correctamente al chat del alumno.");
                     }}
                     className="flex-1 bg-primary text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110"
                   >
                     Enviar Sugerencia Directa
                   </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'docs' && (
          <section className="animate-in fade-in space-y-12">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-headline font-bold text-on-surface">Documentación Global</h3>
              </div>
              <div className="bg-white border border-outline-variant rounded-xl overflow-hidden mb-8 p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                 <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Título</label>
                    <input className="w-full p-3 border border-outline-variant text-sm" value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="Ej. Const. Nacional" />
                 </div>
                 <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Categoría</label>
                    <select className="w-full p-3 border border-outline-variant text-sm" value={docCategory} onChange={e => setDocCategory(e.target.value)}>
                       <option>NORMATIVA BASE</option>
                       <option>COMPLEMENTO</option>
                       <option>DOCTRINA</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Archivo</label>
                    <input type="file" className="w-full text-sm" accept=".pdf,.txt" onChange={e => setSelectedDocFile(e.target.files?.[0] || null)} />
                 </div>
                 <button onClick={handleUploadDoc} disabled={docUploadStatus === 'uploading'} className="bg-primary text-white p-3 font-bold text-xs uppercase tracking-widest disabled:opacity-50 h-[46px]">
                   {docUploadStatus === 'uploading' ? 'Subiendo...' : 'Subir Documento'}
                 </button>
              </div>
              <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low border-b border-outline-variant text-[10px] font-bold uppercase">
                    <tr>
                      <th className="px-6 py-4">Archivo</th>
                      <th className="px-6 py-4">Categoría</th>
                      <th className="px-6 py-4 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant text-sm">
                    {globalDocs.map(doc => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 font-medium">{doc.title}</td>
                      <td className="px-6 py-4 text-xs font-bold text-primary">{doc.category}</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold uppercase text-[10px]">Indexado</td>
                    </tr>
                    ))}
                    {globalDocs.length === 0 && (
                      <tr><td colSpan={3} className="px-6 py-4 text-center text-on-surface-variant text-sm">Sin documentos cargados.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'students' && (
          <section className="animate-in fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white border border-outline-variant p-8 rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-primary">Alta Directa</h4>
                  <div className="space-y-4">
                    <input 
                       className="w-full bg-surface-container-low border border-outline-variant p-3 outline-none text-sm" 
                       placeholder="Nombre Completo" 
                       value={newStudent.name}
                       onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                    />
                    <input 
                       className="w-full bg-surface-container-low border border-outline-variant p-3 outline-none text-sm" 
                       placeholder="Legajo" 
                       value={newStudent.legajo}
                       onChange={e => setNewStudent({...newStudent, legajo: e.target.value})}
                    />
                    <button onClick={handleRegisterStudent} className="w-full bg-primary text-white py-4 font-bold text-xs uppercase tracking-widest">Registrar Alumno</button>
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/20 p-8 rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-primary">Carga Masiva (Versátil)</h4>
                  <div className="border-2 border-dashed border-primary/30 p-8 flex flex-col items-center justify-center bg-white cursor-pointer group hover:border-primary transition-all">
                    <UploadCloud size={24} className="text-primary/50 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-bold mt-2 uppercase text-primary">Subir Listado de Cátedra</span>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center text-[10px] font-bold uppercase">
                   <span>Nómina de Alumnos</span>
                   <span className="text-primary">Total: {students.length}</span>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low/30 border-b border-outline-variant text-[9px] font-bold uppercase">
                    <tr>
                      <th className="px-6 py-3">Alumno</th>
                      <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant text-sm">
                    {students.map(s => (
                      <tr key={s.id}>
                        <td className="px-6 py-4 font-medium">{s.name} <span className="block text-[10px] text-on-surface-variant/60">Legajo: {s.legajo}</span></td>
                        <td className="px-6 py-4 text-right flex justify-end gap-3">
                          <button 
                            onClick={() => {
                              const int = recentInteractions.find(i => i.userName === s.name);
                              if (int) setMonitoringStudent(int);
                            }}
                            className={cn("text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors", recentInteractions.find(i => i.userName === s.name) ? "bg-primary/5 text-primary hover:bg-primary/10" : "bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed")}
                            disabled={!recentInteractions.find(i => i.userName === s.name)}
                            title={recentInteractions.find(i => i.userName === s.name) ? "Ver actividad en vivo" : "El alumno no tiene actividad reciente"}
                          >
                            <Eye size={12} /> Monitorear IA
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(s.id, s.legajo)}
                            className="text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Eliminar Alumno"
                          >
                            <Trash2 size={12} /> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'cases' && (
          <section className="animate-in fade-in space-y-8">
            <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="p-8 bg-surface-container-low border-b border-outline-variant grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Nuevo Caso de Estudio</h4>
                    <input 
                      className="w-full p-4 border border-outline-variant text-sm" 
                      placeholder="Título (Ej. Sapi vs. Municipalidad)" 
                      value={newCase.title}
                      onChange={e => setNewCase(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <div className="flex gap-4">
                      <input 
                        className="flex-1 p-4 border border-outline-variant text-sm" 
                        placeholder="Año" 
                        value={newCase.year}
                        onChange={e => setNewCase(prev => ({ ...prev, year: e.target.value }))}
                      />
                      <input 
                        className="flex-1 p-4 border border-outline-variant text-sm" 
                        placeholder="Temática" 
                        value={newCase.tag}
                        onChange={e => setNewCase(prev => ({ ...prev, tag: e.target.value }))}
                      />
                    </div>
                    <textarea 
                      className="w-full p-4 border border-outline-variant text-sm resize-none" 
                      rows={4} 
                      placeholder="Breve introducción para el alumno..." 
                      value={newCase.description}
                      onChange={e => setNewCase(prev => ({ ...prev, description: e.target.value }))}
                    />
                 </div>
                 <div className="space-y-4 flex flex-col">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Contexto del Fallo (PDF/TXT)</h4>
                    <label className={cn(
                      "flex-grow border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 transition-all cursor-pointer relative",
                      selectedFile ? "border-primary bg-primary/5" : "border-outline-variant bg-white hover:bg-primary/5 hover:border-primary"
                    )}>
                       <input 
                         type="file" 
                         className="absolute inset-0 opacity-0 cursor-pointer" 
                         accept=".pdf,.txt"
                         onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                       />
                       <UploadCloud size={32} className={cn("mb-2", selectedFile ? "text-primary" : "text-on-surface-variant/40")} />
                       {selectedFile ? (
                         <div className="text-center">
                            <p className="text-xs font-bold uppercase text-primary">{selectedFile.name}</p>
                            <p className="text-[10px] text-on-surface-variant opacity-60 uppercase mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                         </div>
                       ) : (
                         <p className="text-xs font-bold uppercase text-on-surface-variant/40">Cargar Documento para RAG</p>
                       )}
                    </label>
                    <button 
                      onClick={handleUploadCase}
                      disabled={uploadStatus === 'uploading'}
                      className={cn(
                        "w-full py-4 font-bold text-xs uppercase tracking-widest mt-4 transition-all flex items-center justify-center gap-2",
                        uploadStatus === 'uploading' ? "bg-primary/50 cursor-not-allowed" : 
                        uploadStatus === 'success' ? "bg-green-600" : "bg-primary text-white"
                      )}
                    >
                      {uploadStatus === 'uploading' ? (
                        <>Iniciando Indexación Socrática...</>
                      ) : uploadStatus === 'success' ? (
                        <>¡Caso Publicado con RAG!</>
                      ) : (
                        <>Publicar Caso Socrático</>
                      )}
                    </button>
                    {uploadStatus === 'error' && (
                      <p className="text-[10px] text-red-600 font-bold uppercase text-center mt-2">Error al procesar el documento. Intenta de nuevo.</p>
                    )}
                 </div>
              </div>
              <div className="p-8">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-60">Casos Publicados</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cases.map(c => (
                    <div key={c.id} className="p-5 border border-outline-variant rounded-xl bg-[#FDFCFB]">
                       <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{c.tag} • {c.year}</span>
                       <h5 className="font-headline font-bold text-lg text-on-surface mt-2">{c.title}</h5>
                       <div className="mt-4 flex gap-3 pt-3 border-t border-outline-variant/30">
                          <button className="text-[9px] font-bold uppercase text-on-surface-variant hover:text-primary transition-colors">Editar</button>
                          <button onClick={() => handleDeleteCase(c.id)} className="text-[9px] font-bold uppercase text-red-700 ml-auto hover:underline">Eliminar</button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, userData, loading, isAdmin } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!user) return <Navigate to="/" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" />;

  return <>{children}</>;
};

// --- App ---

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/casos" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/chat/:caseId" element={<ProtectedRoute><ChatCase /></ProtectedRoute>} />
          <Route path="/teacher" element={<ProtectedRoute requireAdmin><TeacherPanel /></ProtectedRoute>} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
