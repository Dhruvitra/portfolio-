import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, onSnapshot, query, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { 
  Inbox, 
  Search, 
  Trash2, 
  Calendar, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink, 
  Briefcase, 
  Mail, 
  User, 
  PlusCircle, 
  Copy, 
  Check, 
  ArrowLeft, 
  Database, 
  Coins, 
  Lock, 
  RefreshCw,
  Clock,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { Submission } from './Contact';

export default function AdminPanelPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [clearConfirmActive, setClearConfirmActive] = useState<boolean>(false);
  const [locallyDeletedIds, setLocallyDeletedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('locally_deleted_submissions') || '[]');
    } catch {
      return [];
    }
  });

  // Sync and load submissions on mount from Firestore
  useEffect(() => {
    const q = query(collection(db, 'submissions'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const records: Submission[] = [];
      snapshot.forEach((docSnap) => {
        records.push(docSnap.data() as Submission);
      });
      
      // Sort records by timestamp descending
      records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      if (records.length === 0) {
        // Seed initial data if Firestore database is empty
        const seeds: Submission[] = [
          {
            id: 'seed-1',
            name: 'Arjun Ramesh',
            email: 'arjun.ramesh@techventures.io',
            company: 'TechVentures Inc.',
            budget: '$5k — $10k',
            message: 'Looking to implement a custom headless Shopify Liquid storefront with real-time checkout updates and deep multi-currency support. We require an optimized clean codebase.',
            timestamp: new Date(Date.now() - 3600000 * 3).toLocaleString(),
            status: 'new'
          },
          {
            id: 'seed-2',
            name: 'Richard Stone',
            email: 'richard.s@liquidcommerce.com',
            company: 'LiquidCommerce Co.',
            budget: 'Enterprise $10k+',
            message: 'Need a dedicated freelance engineer to develop our MERN stack vendor system and configure Express secure cookies for OAuth authentication. Standard compliance must be optimal.',
            timestamp: new Date(Date.now() - 3600000 * 24).toLocaleString(),
            status: 'read'
          }
        ];
        for (const seed of seeds) {
          try {
            await setDoc(doc(db, 'submissions', seed.id), seed);
          } catch (err) {
            console.error('Failed to seed resource: ', err);
          }
        }
      } else {
        setSubmissions(records);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'submissions', false);
    });

    return () => unsubscribe();
  }, []);

  const triggerNotification = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification(null);
    }, 3000);
  };

  // Helper to handle copying
  const handleCopyText = (text: string, id: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        // Fallback for secure contextual iframes/browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.warn('Clipboard writing blocked by sandbox restrictions: ', err);
    }
    setCopiedId(id);
    triggerNotification('Copied to clipboard');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Cycle states: new -> read -> replied -> new
  const cycleStatus = async (id: string) => {
    const current = submissions.find(s => s.id === id);
    if (!current) return;
    const states: ('new' | 'read' | 'replied')[] = ['new', 'read', 'replied'];
    const nextState = states[(states.indexOf(current.status) + 1) % states.length];
    
    try {
      await updateDoc(doc(db, 'submissions', id), { status: nextState });
      triggerNotification('Status updated successfully');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `submissions/${id}`);
    }
  };

  // Delete submission record
  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'submissions', id));
      triggerNotification('Record permanently deleted');
      if (expandedId === id) {
        setExpandedId(null);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `submissions/${id}`);
    }
  };

  // Generate mock lead for demo
  const generateMockSubmission = async () => {
    const firstNames = ['Sarah', 'David', 'Kenshin', 'Emory', 'Amira', 'Guillaume', 'Natsumi'];
    const lastNames = ['Miller', 'Tanaka', 'Duvall', 'Kovacs', 'Siddiqui', 'Chen', 'Vance'];
    const companies = ['SwiftShift Logistics', 'Zenith Carbon', 'Pulse Analytics', 'Ember Liquid', 'PixelCart Co.'];
    const budgetsArray = ['Under $1k', '$1k — $5k', '$5k — $10k', 'Enterprise $10k+'];
    const messages = [
      'We require a high performance Liquid landing page with interactive variant swatches and rapid cart processing.',
      'Requesting a React 19 visual dashboard to coordinate order streams. Needs clean state transitions and Tailwind standard.',
      'Need to audit our custom Shopify checkout script. Let us know your immediate availability for a MERN consulting arrangement.',
      'Hey Dhruvik! Saw your portfolio page. We are looking for an engineer to migrate our offline catalog to full Shopify stack.'
    ];

    const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const randomEmail = `${randomName.toLowerCase().replace(' ', '.')}@${companies[Math.floor(Math.random() * companies.length)].toLowerCase().replace(' ', '')}.com`;
    const randomPhone = `+91 ${Math.floor(70000 + Math.random() * 29999)} ${Math.floor(10000 + Math.random() * 89999)}`;
    
    const docId = 'mock-' + Math.random().toString(36).substring(2, 7);
    const mockLead: Submission = {
      id: docId,
      name: randomName,
      email: randomEmail,
      company: companies[Math.floor(Math.random() * companies.length)],
      phone: randomPhone,
      budget: budgetsArray[Math.floor(Math.random() * budgetsArray.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: new Date().toLocaleString(),
      status: 'new'
    };

    try {
      await setDoc(doc(db, 'submissions', docId), mockLead);
      triggerNotification('Mock inquiry generated');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `submissions/${docId}`);
    }
  };

  // Clear all submissions
  const clearAllSubmissions = async () => {
    try {
      setLocallyDeletedIds([]);
      localStorage.removeItem('locally_deleted_submissions');
      const querySnapshot = await getDocs(collection(db, 'submissions'));
      const deletePromises: Promise<any>[] = [];
      querySnapshot.forEach((docSnap) => {
        deletePromises.push(deleteDoc(doc(db, 'submissions', docSnap.id)));
      });
      await Promise.all(deletePromises);
      triggerNotification('Database cleared');
      setClearConfirmActive(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'submissions');
    }
  };

  const activeSubmissions = submissions.filter(s => !locallyDeletedIds.includes(s.id));

  // Calculations for Admin Analytics Row
  const totalLeads = activeSubmissions.length;
  const newLeads = activeSubmissions.filter(s => s.status === 'new').length;
  const readLeads = activeSubmissions.filter(s => s.status === 'read').length;
  const repliedLeads = activeSubmissions.filter(s => s.status === 'replied').length;
  
  // Calculate pipeline estimation
  const totalPipelineValue = activeSubmissions.reduce((sum, current) => {
    let value = 500; // default for Under $1k
    if (current.budget.includes('$1k')) value = 3000;
    else if (current.budget.includes('$5k')) value = 7500;
    else if (current.budget.includes('Enterprise')) value = 15000;
    return sum + value;
  }, 0);

  // Filter pipeline records
  const filteredRecords = activeSubmissions.filter(sub => {
    const textMatch = 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.company && sub.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sub.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.budget.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch = filterStatus === 'all' || sub.status === filterStatus;
    
    return textMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      {/* Upper Tech-Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a 
              href="/"
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shrink-0"
              title="Return to Portfolio Homepage"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-sm font-black tracking-wider uppercase text-slate-800 flex items-center gap-1.5 leading-none">
                  Dhruvik’s Private Portal
                </h1>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-1">
                SECURE INTERFACE • SYSTEM_PORT: 3000
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={generateMockSubmission}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200/80 hover:border-slate-300 rounded-xl text-[11px] font-bold text-slate-700 bg-white cursor-pointer active:scale-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#2563EB]" />
              Generate Mock Lead
            </button>
            
            <button
              type="button"
              onClick={() => {
                if (!clearConfirmActive) {
                  setClearConfirmActive(true);
                  setTimeout(() => setClearConfirmActive(false), 4000);
                  return;
                }
                clearAllSubmissions();
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[11px] font-bold cursor-pointer transition-all active:scale-95 ${
                clearConfirmActive 
                  ? 'text-white bg-rose-600 border-rose-600 hover:bg-rose-700 animate-pulse'
                  : 'text-rose-600 bg-rose-50/50 hover:bg-rose-50 border-rose-100'
              }`}
              title={clearConfirmActive ? "Click again to confirm database wipeout!" : "Reset entire database cache"}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {clearConfirmActive ? 'Confirm Reset?' : 'Reset DB'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* Statistics Dashboard Bento Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* PIPELINE ESTIMATION */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[110px]">
            <div>
              <p className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                Pipeline Capital Match
              </p>
              <h2 className="text-2xl font-black tracking-tight text-[#0F172A] mt-1">
                ${totalPipelineValue.toLocaleString()}
              </h2>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-50 pt-2.5 mt-2">
              <span className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-indigo-500" /> Based on brackets
              </span>
              <span className="font-mono">LIVE MATCHING</span>
            </div>
          </div>

          {/* TOTAL COMMUNICATIONS */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[110px]">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                Total Inquiries logged
              </p>
              <h2 className="text-2xl font-black tracking-tight text-[#0F172A] mt-1">
                {totalLeads}
              </h2>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-50 pt-2.5 mt-2">
              <span className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-slate-400" /> Local database
              </span>
              <span className="font-mono">INDEX_OK</span>
            </div>
          </div>

          {/* ACTIVE UNREAD */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[110px]">
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                New Submissions
              </p>
              <h2 className="text-2xl font-black tracking-tight text-emerald-600 mt-1 flex items-center gap-1.5">
                {newLeads}
                {newLeads > 0 && (
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </h2>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-50 pt-2.5 mt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" /> Awaiting evaluation
              </span>
              <span className="font-mono">REPLY_4H_MAX</span>
            </div>
          </div>

          {/* RESPONSE METRIC BALANCE */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[110px]">
            <div>
              <p className="text-[10px] font-black uppercase text-cyan-600 tracking-wider">
                Communication Ratio
              </p>
              <h2 className="text-2xl font-black tracking-tight text-[#0F172A] mt-1">
                {totalLeads > 0 ? Math.round(((repliedLeads + readLeads) / totalLeads) * 100) : 0}%
              </h2>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-50 pt-2.5 mt-2">
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-500" /> Completed actions
              </span>
              <span className="font-mono">{repliedLeads} REPLIES</span>
            </div>
          </div>

        </section>

        {/* Database Search Filter Matrix Controls */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 mb-6 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads by name, email, brand keywords, budget or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-50/80 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-slate-300 rounded-xl text-xs transition-all outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-650 text-xs font-bold font-mono p-1 rounded-md"
              >
                ✕
              </button>
            )}
          </div>

          {/* Row Filter Status Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 select-none w-full md:w-auto overflow-x-auto justify-between gap-1">
            {[
              { id: 'all', label: 'All Inquiries' },
              { id: 'new', label: 'New' },
              { id: 'read', label: 'Read' },
              { id: 'replied', label: 'Replied' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === tab.id
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Records Feed */}
        <section className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs relative">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-500" /> Database Registry
            </h3>

            <div className="text-[10px] text-slate-400 font-mono">
              RETRIEVED {filteredRecords.length} OF {totalLeads} ROWS
            </div>
          </div>

          <div className="space-y-4">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl bg-[#F8FAFC]">
                <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-600">No matching inquiries found</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                  Modify your parameters or trigger a mock client lead using the "Generate Mock Lead" button at the header.
                </p>
              </div>
            ) : (
              filteredRecords.map((sub) => {
                const isExpanded = expandedId === sub.id;

                // Budget Styling pills
                let budgetPillClass = "bg-slate-50 text-slate-600 border-slate-100";
                if (sub.budget.toLowerCase().includes('enterprise') || sub.budget.toLowerCase().includes('10k')) {
                  budgetPillClass = "bg-purple-50 text-purple-600 border border-purple-100/60";
                } else if (sub.budget.includes('$5k')) {
                  budgetPillClass = "bg-emerald-50 text-emerald-600 border border-emerald-100/60";
                } else if (sub.budget.includes('$1k')) {
                  budgetPillClass = "bg-blue-50 text-blue-600 border border-blue-100/60";
                }

                // Status styling pills
                let statusPillClass = "bg-gray-100 text-gray-700";
                if (sub.status === 'new') statusPillClass = "bg-indigo-50 text-indigo-600 border border-indigo-100/50 animate-pulse";
                else if (sub.status === 'replied') statusPillClass = "bg-emerald-50 text-emerald-600 border border-emerald-100/30";

                return (
                  <div 
                    key={sub.id}
                    className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                      isExpanded 
                        ? 'border-indigo-200 bg-[#FBFDFF]/85 shadow-md' 
                        : 'border-slate-100 hover:border-slate-300 bg-white hover:shadow-xs'
                    }`}
                  >
                    {/* Header bar section representing lead info */}
                    <div 
                      onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                      className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-slate-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-black text-[#0F172A] tracking-tight">
                              {sub.name}
                            </h4>
                            {sub.company && (
                              <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 bg-slate-100/80 rounded">
                                {sub.company}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>{sub.email}</span>
                            {sub.phone && (
                              <>
                                <span className="text-slate-300 select-none">•</span>
                                <span className="text-slate-400 font-mono">{sub.phone}</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto flex-wrap">
                        {/* Time indicator */}
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {sub.timestamp}
                        </span>

                        {/* Status Label */}
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${statusPillClass}`}>
                          {sub.status}
                        </span>

                        {/* Target budget bracket badge */}
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${budgetPillClass}`}>
                          {sub.budget}
                        </span>

                        <div className="p-1 text-slate-400 group-hover:text-slate-600 rounded">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Extended detail section */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="px-5 pb-5 pt-1 border-t border-indigo-50/50 bg-white/70">
                            
                            <div className="mb-4">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1 select-none">
                                <Briefcase className="w-3.5 h-3.5 text-slate-500" /> Project Specifications
                              </h5>
                              <div className="text-xs text-[#334155] bg-slate-50/50 border border-slate-100 p-4 rounded-xl font-sans whitespace-pre-wrap leading-relaxed select-text cursor-text">
                                {sub.message}
                              </div>
                            </div>

                            {/* Interaction controls block */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-4 select-none" onClick={e => e.stopPropagation()}>
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(JSON.stringify(sub, null, 2), sub.id)}
                                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-[10px] font-bold text-slate-600 transition-colors cursor-pointer"
                                >
                                  {copiedId === sub.id ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-500" />
                                      Payload Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      JSON Payload
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => cycleStatus(sub.id)}
                                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-[10px] font-bold text-slate-600 transition-colors cursor-pointer"
                                >
                                  <RefreshCw className="w-3 h-3 text-slate-500" />
                                  Cycle Status
                                </button>
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (deleteConfirmId !== sub.id) {
                                      setDeleteConfirmId(sub.id);
                                      setTimeout(() => setDeleteConfirmId(curr => curr === sub.id ? null : curr), 3000);
                                      return;
                                    }
                                    deleteRecord(sub.id);
                                    setDeleteConfirmId(null);
                                  }}
                                  className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                                    deleteConfirmId === sub.id
                                      ? 'text-white bg-rose-600 border-rose-600 hover:bg-rose-700 animate-pulse'
                                      : 'border-rose-150 bg-rose-50/40 hover:bg-rose-50 text-rose-600'
                                  }`}
                                  title={deleteConfirmId === sub.id ? "Click again to confirm permanent deletion" : "Delete record"}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  {deleteConfirmId === sub.id ? 'Confirm?' : 'Remove Record'}
                                </button>

                                <a
                                  href={`mailto:${sub.email}?subject=RE: Shopify %26 MERN Web Project Inquiry&body=Hi ${sub.name},%0D%0A%0D%0AThank you for reaching out in regards to your budget bracket: "${sub.budget}".%0D%0A%0D%0AI evaluated your requirements and would love to support you with your goal.%0D%0A%0D%0ABest regards,%0D%0ADhruvik Vanol`}
                                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-[#0F172A] hover:bg-[#2563EB] text-white rounded-xl text-[10px] font-bold transition-all shadow-xs"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Draft Email reply
                                </a>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })
            )}
          </div>
        </section>

      </main>

      {/* Embedded Floating alerts block */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999] bg-[#0F172A] text-white text-[11px] font-bold font-sans px-5 py-3 rounded-full border border-white/10 shadow-2xl flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            {showNotification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
