import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  BarChart3, 
  ArrowRight,
  Brain,
  MessageSquare,
  RefreshCw,
  Users,
  Eye,
  Printer
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { AQ_QUESTIONS, SUBSCALES, POPULATION_DATA } from './constants';
import { cn } from './lib/utils';

type Gender = 'men' | 'women';

function encodeAnswers(answers: Record<number, number>): string {
  const arr = new Uint8Array(13);
  for (let i = 0; i < 50; i++) {
    const val = (answers[i + 1] || 1) - 1; // 0-3
    const byteIdx = Math.floor(i / 4);
    const bitOffset = (i % 4) * 2;
    arr[byteIdx] |= (val << bitOffset);
  }
  // Use a URL-safe base64-like approach or just standard btoa
  return btoa(String.fromCharCode(...arr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function decodeAnswers(code: string): Record<number, number> {
  try {
    // Normalize from URL-safe
    const normalized = code.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(normalized);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
    const answers: Record<number, number> = {};
    for (let i = 0; i < 50; i++) {
      const byteIdx = Math.floor(i / 4);
      const bitOffset = (i % 4) * 2;
      const val = (arr[byteIdx] >> bitOffset) & 0x03;
      answers[i + 1] = val + 1;
    }
    return answers;
  } catch (e) {
    console.error("Decoding failed", e);
    return {};
  }
}

export default function App() {
  const [step, setStep] = useState<'intro' | 'screening' | 'test' | 'results'>('intro');
  const [gender, setGender] = useState<Gender>('men');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [importCode, setImportCode] = useState('');
  const [showFullList, setShowFullList] = useState(false);
  const questionsPerPage = 10;

  const totalPages = Math.ceil(AQ_QUESTIONS.length / questionsPerPage);
  const progress = (Object.keys(answers).length / AQ_QUESTIONS.length) * 100;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, step]);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateResults = useMemo(() => {
    if (Object.keys(answers).length < AQ_QUESTIONS.length) return null;

    const scores = {
      total: 0,
      social: 0,
      switching: 0,
      communication: 0,
      imagination: 0,
      detail: 0,
    };

    AQ_QUESTIONS.forEach(q => {
      let score = answers[q.id];
      if (q.reverse) {
        score = 5 - score; // 1->4, 2->3, 3->2, 4->1
      }
      scores.total += score;

      if (SUBSCALES.social.includes(q.id)) scores.social += score;
      if (SUBSCALES.switching.includes(q.id)) scores.switching += score;
      if (SUBSCALES.communication.includes(q.id)) scores.communication += score;
      if (SUBSCALES.imagination.includes(q.id)) scores.imagination += score;
      if (SUBSCALES.detail.includes(q.id)) scores.detail += score;
    });

    return scores;
  }, [answers]);

  const chartData = useMemo(() => {
    if (!calculateResults) return [];
    const pop = POPULATION_DATA[gender];
    
    return [
      { name: 'Sociaal', score: calculateResults.social, ass: pop.ass.social, none: pop.none.social },
      { name: 'Wisselen', score: calculateResults.switching, ass: pop.ass.switching, none: pop.none.switching },
      { name: 'Comm.', score: calculateResults.communication, ass: pop.ass.communication, none: pop.none.communication },
      { name: 'Fantasie', score: calculateResults.imagination, ass: pop.ass.imagination, none: pop.none.imagination },
      { name: 'Details', score: calculateResults.detail, ass: pop.ass.detail, none: pop.none.detail },
    ];
  }, [calculateResults, gender]);

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6">
      <header className="max-w-4xl w-full mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-serif font-medium mb-4 tracking-tight">
          ASS Screening & AQ Score
        </h1>
        <p className="text-stone-500 max-w-2xl mx-auto">
          Een wetenschappelijk onderbouwde zelf-screening voor het autismespectrum.
        </p>
      </header>

      <main className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-8 sm:p-12"
            >
              <h2 className="text-2xl font-serif font-medium mb-6">Welkom bij de screening</h2>
              <div className="space-y-6 text-stone-600 leading-relaxed">
                <p>
                  Deze website biedt een screening voor Autisme Spectrum Stoornis (ASS) op basis van de 
                  <strong> Autism-Spectrum Quotient (AQ)</strong>. De AQ is een gevalideerde vragenlijst 
                  die kijkt naar verschillende aspecten van gedrag en persoonlijkheid.
                </p>
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl flex gap-4">
                  <AlertCircle className="text-amber-600 shrink-0" />
                  <div className="text-sm text-amber-900">
                    <p className="font-semibold mb-1">Belangrijke opmerking:</p>
                    <p>
                      Recent onderzoek laat zien dat de AQ onvoldoende sensitief kan zijn in populaties met andere 
                      psychische problematiek (zoals angststoornissen). Een hoge score is geen diagnose, 
                      en een lage score sluit ASS niet volledig uit. Gebruik dit resultaat als startpunt voor 
                      gesprek met een professional.
                    </p>
                  </div>
                </div>
                <p>
                  Voordat we naar de volledige vragenlijst gaan, adviseren experts (zoals Dr. Annelies Spek) 
                  om eerst stil te staan bij enkele kernvragen uit het DSM-5 interview.
                </p>

                <div className="pt-6 border-t border-stone-200">
                  <p className="text-sm font-semibold mb-3 text-stone-900">Heeft u al een resultaatcode?</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Plak code hier..." 
                      value={importCode}
                      onChange={(e) => setImportCode(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                    <button 
                      onClick={() => {
                        const decoded = decodeAnswers(importCode);
                        if (Object.keys(decoded).length === 50) {
                          setAnswers(decoded);
                          setStep('results');
                        } else {
                          alert("Ongeldige code. Controleer of u de volledige code heeft gekopieerd.");
                        }
                      }}
                      className="px-4 py-2 bg-stone-100 text-stone-900 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors"
                    >
                      Laden
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setStep('screening')}
                className="btn-primary mt-10 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Start Screening <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 'screening' && (
            <motion.div
              key="screening"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8 sm:p-12"
            >
              <div className="flex items-center gap-2 text-stone-400 mb-6 uppercase tracking-widest text-xs font-semibold">
                <Info size={14} /> Kernvragen DSM-5
              </div>
              <h2 className="text-2xl font-serif font-medium mb-8">Reflecteer op deze vragen</h2>
              <div className="space-y-8">
                {[
                  {
                    q: "Voelde u zich als kind sociaal gezien anders dan anderen?",
                    icon: <Users className="text-stone-400" size={20} />
                  },
                  {
                    q: "Hebt u moeite om anderen aan te voelen en te troosten?",
                    icon: <Brain className="text-stone-400" size={20} />
                  },
                  {
                    q: "Hebt u moeite met praktische veranderingen in het dagelijks leven?",
                    icon: <RefreshCw className="text-stone-400" size={20} />
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors">
                    <div className="mt-1">{item.icon}</div>
                    <p className="text-lg text-stone-800 font-serif italic">{item.q}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button onClick={() => setStep('test')} className="btn-primary flex-1">
                  Door naar de AQ-vragenlijst
                </button>
                <button onClick={() => setStep('intro')} className="btn-secondary">
                  Terug
                </button>
              </div>
            </motion.div>
          )}

          {step === 'test' && (
            <motion.div
              key="test"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="glass-card p-6 mb-6 sticky top-4 z-10 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-stone-500">
                    Vraag {Object.keys(answers).length} van {AQ_QUESTIONS.length}
                  </span>
                  <span className="text-sm font-bold text-stone-900">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-stone-900"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                {AQ_QUESTIONS.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage).map((q) => (
                  <div key={q.id} className="glass-card p-6 sm:p-8">
                    <p className="text-lg mb-6 font-serif">{q.id}. {q.text}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Geheel mee eens", val: 1 },
                        { label: "Enigszins mee eens", val: 2 },
                        { label: "Enigszins mee oneens", val: 3 },
                        { label: "Geheel mee oneens", val: 4 },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => handleAnswer(q.id, opt.val)}
                          className={cn(
                            "py-3 px-4 rounded-xl text-sm transition-all border",
                            answers[q.id] === opt.val
                              ? "bg-stone-900 text-white border-stone-900 shadow-lg scale-[1.02]"
                              : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-between items-center">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <ChevronLeft size={18} /> Vorige
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        currentPage === i ? "bg-stone-900 w-4" : "bg-stone-300"
                      )}
                    />
                  ))}
                </div>

                {currentPage < totalPages - 1 ? (
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="btn-primary flex items-center gap-2"
                  >
                    Volgende <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    disabled={Object.keys(answers).length < AQ_QUESTIONS.length}
                    onClick={() => setStep('results')}
                    className="btn-primary bg-emerald-600 hover:bg-emerald-700 border-emerald-600 flex items-center gap-2"
                  >
                    Bekijk Resultaten <CheckCircle2 size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === 'results' && calculateResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="glass-card p-8 sm:p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 mb-6">
                  <BarChart3 className="text-stone-900" size={32} />
                </div>
                <h2 className="text-3xl font-serif font-medium mb-2">Uw AQ Score</h2>
                <div className="text-6xl font-bold text-stone-900 my-6">
                  {calculateResults.total}
                </div>
                
                <div className="mb-8">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">Uw Resultaatcode</p>
                  <div className="inline-flex items-center gap-2 bg-stone-50 px-4 py-2 rounded-lg border border-stone-100 font-mono text-sm print:bg-white print:border-stone-200">
                    {encodeAnswers(answers)}
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(encodeAnswers(answers));
                        alert("Code gekopieerd naar klembord!");
                      }}
                      className="text-stone-400 hover:text-stone-900 transition-colors no-print"
                      title="Kopieer code"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-stone-500 max-w-md mx-auto mb-8">
                  De totaalscore op de AQ varieert van 50 tot 200. Een hogere score duidt op meer autistische trekken.
                </p>
                
                <div className="flex justify-center gap-4 mb-8 no-print">
                  <button 
                    onClick={() => setGender('men')}
                    className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all", gender === 'men' ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600")}
                  >
                    Vergelijk als Man
                  </button>
                  <button 
                    onClick={() => setGender('women')}
                    className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all", gender === 'women' ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600")}
                  >
                    Vergelijk als Vrouw
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 40]} tick={false} axisLine={false} />
                        <Radar
                          name="Uw Score"
                          dataKey="score"
                          stroke="#1c1917"
                          fill="#1c1917"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="ASS Gemiddelde"
                          dataKey="ass"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.2}
                        />
                        <Tooltip />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4 text-left">
                    <h3 className="font-serif text-xl mb-4">Interpretatie</h3>
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-stone-500">Uw Totaalscore</span>
                        <span className="font-bold">{calculateResults.total}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-stone-500">Gem. {gender === 'men' ? 'Mannen' : 'Vrouwen'} met ASS</span>
                        <span className="font-medium text-emerald-600">{POPULATION_DATA[gender].ass.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-stone-500">Gem. {gender === 'men' ? 'Mannen' : 'Vrouwen'} zonder ASS</span>
                        <span className="font-medium text-stone-400">{POPULATION_DATA[gender].none.total}</span>
                      </div>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed italic">
                      Scores boven de 130-140 worden vaak gezien bij mensen met een ASS diagnose. 
                      Echter, scores tussen de 90 en 130 kunnen ook voorkomen bij zowel de algemene populatie 
                      als bij mensen met ASS.
                    </p>
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-stone-100">
                  <h3 className="text-lg font-serif mb-6 text-left print:text-xl">Subscores</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
                    {[
                      { label: 'Sociaal inzicht', score: calculateResults.social, icon: <Users size={20} />, desc: 'Interactie en sociaal begrip' },
                      { label: 'Aandacht wisselen', score: calculateResults.switching, icon: <RefreshCw size={20} />, desc: 'Flexibiliteit en routine' },
                      { label: 'Communicatie', score: calculateResults.communication, icon: <MessageSquare size={20} />, desc: 'Taalgebruik en gesprek' },
                      { label: 'Fantasie', score: calculateResults.imagination, icon: <Brain size={20} />, desc: 'Inbeeldingsvermogen' },
                      { label: 'Detailgerichtheid', score: calculateResults.detail, icon: <Eye size={20} />, desc: 'Focus op kleine details' },
                    ].map((sub, i) => (
                      <div key={i} className="p-4 rounded-xl bg-stone-50 border border-stone-100 text-left print:bg-white print:border-stone-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-1.5 bg-white rounded-lg text-stone-900 border border-stone-100 print:bg-stone-50">{sub.icon}</div>
                          <h4 className="font-medium text-sm">{sub.label}</h4>
                        </div>
                        <div className="text-2xl font-bold">{sub.score}</div>
                        <p className="text-[10px] text-stone-500 mt-1">{sub.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 bg-stone-900 text-stone-50 no-print">
                <h3 className="text-xl font-serif mb-4">Vervolgstappen</h3>
                <p className="text-stone-400 mb-6 leading-relaxed">
                  Deze screening is bedoeld om inzicht te geven, niet om een diagnose te stellen. 
                  Als u zich herkent in de resultaten, raden wij u aan contact op te nemen met uw huisarts 
                  voor een verwijzing naar een gespecialiseerde psycholoog of psychiater.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => {
                      setStep('intro');
                      setAnswers({});
                      setCurrentPage(0);
                    }}
                    className="btn-secondary bg-transparent border-stone-700 text-stone-50 hover:bg-stone-800 flex-1"
                  >
                    Opnieuw starten
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      window.focus();
                      window.print();
                    }}
                    className="btn-primary bg-stone-50 text-stone-900 hover:bg-stone-200 flex-1 flex items-center justify-center gap-2"
                  >
                    <Printer size={18} /> Print als PDF
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 mt-4 text-center no-print opacity-60">
                  Lukt het printen niet? Open de app in een nieuw tabblad via het icoontje rechtsboven in de preview.
                </p>
              </div>

              <div className="mt-12 no-print">
                <button 
                  onClick={() => setShowFullList(!showFullList)}
                  className="text-stone-500 text-sm flex items-center gap-2 hover:text-stone-900 transition-colors mx-auto"
                >
                  {showFullList ? 'Verberg' : 'Toon'} volledige vragenlijst {showFullList ? <ChevronLeft size={14} className="rotate-90" /> : <ChevronRight size={14} className="rotate-90" />}
                </button>
              </div>

              {(showFullList || typeof window !== 'undefined') && (
                <div className={cn("mt-8 space-y-4 print:mt-12", !showFullList && "hidden print:block")}>
                  <h3 className="text-xl font-serif mb-6 border-b pb-2 print:text-2xl">Ingevulde Vragenlijst</h3>
                  <div className="grid grid-cols-1 gap-4 print:gap-2">
                    {AQ_QUESTIONS.map((q) => (
                      <div key={q.id} className="p-4 rounded-xl border border-stone-100 bg-white text-left text-sm print:p-2 print:border-stone-200">
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-stone-800 flex-1"><span className="font-bold mr-2">{q.id}.</span>{q.text}</p>
                          <div className="flex gap-1 shrink-0">
                            {[1, 2, 3, 4].map((v) => (
                              <div 
                                key={v} 
                                className={cn(
                                  "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border",
                                  answers[q.id] === v 
                                    ? "bg-stone-900 text-white border-stone-900 print:bg-stone-800" 
                                    : "bg-stone-50 text-stone-300 border-stone-100 print:text-stone-200"
                                )}
                              >
                                {v}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 text-stone-400 text-xs text-center max-w-2xl">
        <p className="mb-2">Gebaseerd op de Autism-Spectrum Quotient (AQ) door Simon Baron-Cohen et al. (2001).</p>
        <p>Nederlandse vertaling gevalideerd door Hoekstra et al. (2008). Bron: anneliesspek.nl</p>
      </footer>
    </div>
  );
}
