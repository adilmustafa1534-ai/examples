import React, { useState, useRef, useEffect } from "react";

/*
  AIMC Physio League '25 — Muscle Contraction Puzzle Game
  - Start screen where participant enters name
  - 5 stages (interfaces) each with 15 questions (multiple choice)
  - Doctors panel: Dr Adil, Dr Amna, Dr Aliza, Dr Abeeha, Dr Ayesha, Dr Ahmed, Dr Adeena, Dr Adina
  - AIMC logo at left and "Physio League '25" at right in header
  - Background music, correct/wrong sounds
  - Leaderboard stored in localStorage (top 10)
  - Questions inspired by Guyton & Hall (muscle contraction topics)
*/

const DOCTORS = [
  { name: "Dr Adil", avatar: "👨‍⚕️" },
  { name: "Dr Amna", avatar: "👩‍⚕️" },
  { name: "Dr Aliza", avatar: "👩‍⚕️" },
  { name: "Dr Abeeha", avatar: "👩‍⚕️" },
  { name: "Dr Ayesha", avatar: "👩‍⚕️" },
  { name: "Dr Ahmed", avatar: "👨‍⚕️" },
  { name: "Dr Adeena", avatar: "👩‍⚕️" },
  { name: "Dr Adina", avatar: "👩‍⚕️" },
];

// 5 stages x 15 questions = 75 questions. Each question: {q, options:[...], a}
// Questions below are concise, focused on Guyton topics (NMJ, E-C coupling, cross-bridge, muscle mechanics, metabolism).
const STAGES = [
  {
    id: 1,
    title: "Stage 1 — Neuromuscular Junction",
    questions: [
      { q: "Which neurotransmitter is released at the motor end plate?", options: ["Dopamine","Acetylcholine","Noradrenaline","Serotonin"], a: "Acetylcholine" },
      { q: "Acetylcholine acts on which receptor type at the motor end plate?", options: ["Muscarinic AChR","Nicotinic AChR","GABA-A","NMDA"], a: "Nicotinic AChR" },
      { q: "The enzyme that degrades ACh in the synaptic cleft is:", options: ["Choline acetyltransferase","Acetylcholinesterase","Monoamine oxidase","Butyrylcholinesterase"], a: "Acetylcholinesterase" },
      { q: "Opening of ACh-gated channels primarily allows influx of which ion to depolarize the end plate?", options: ["Cl-","Ca2+","Na+","K+"], a: "Na+" },
      { q: "A single action potential at the NMJ produces an end-plate potential sufficient to trigger a muscle AP because of the _____ factor.", options: ["safety","threshold","refractory","augmented"], a: "safety" },
      { q: "Vesicular release of ACh at the nerve terminal requires entry of which ion?", options: ["Na+","K+","Cl-","Ca2+"], a: "Ca2+" },
      { q: "The motor end plate is a specialization of the muscle fiber's _____.", options: ["sarcoplasmic reticulum","T-tubule","sarcolemma","myofibril"], a: "sarcolemma" },
      { q: "Which of the following reduces ACh action at the NMJ and causes paralysis?", options: ["Curare","Neostigmine","Physostigmine","Pilocarpine"], a: "Curare" },
      { q: "Acetylcholine is synthesized from choline and _____ by choline acetyltransferase.", options: ["acetyl-CoA","ATP","choline kinase","acetylcholinesterase"], a: "acetyl-CoA" },
      { q: "Subneural clefts increase the surface area of the motor end plate to concentrate _____ receptors.", options: ["nicotinic","muscarinic","GABA","dopamine"], a: "nicotinic" },
      { q: "The width of the synaptic cleft is roughly: ", options: ["1 nm","20-50 nm","1 µm","10 µm"], a: "20-50 nm" },
      { q: "End-plate potentials are produced primarily by increased permeability to which two ions?", options: ["Na+ and K+","Ca2+ and Cl-","Na+ and Ca2+","K+ and Cl-"], a: "Na+ and K+" },
      { q: "Acetylcholinesterase inhibitors (e.g., neostigmine) would: ", options: ["block ACh release","increase ACh lifetime","destroy receptors","hyperpolarize membrane"], a: "increase ACh lifetime" },
      { q: "Botulinum toxin causes paralysis by blocking: ", options: ["ACh synthesis","ACh vesicle release","ACh receptor binding","ACh breakdown"], a: "ACh vesicle release" },
      { q: "Safety factor at NMJ ensures muscle fiber activation despite small fluctuations in: ", options: ["temperature","end-plate potential amplitude","mitochondrial ATP","blood flow"], a: "end-plate potential amplitude" },
    ],
  },
  {
    id: 2,
    title: "Stage 2 — Excitation-Contraction Coupling",
    questions: [
      { q: "Depolarization enters the fiber via structures called:", options: ["Sarcoplasmic reticulum","T-tubules","Myofibrils","Intercalated discs"], a: "T-tubules" },
      { q: "Voltage sensing in T-tubules is performed by which receptor?", options: ["Ryanodine receptor","Dihydropyridine receptor (DHPR)","ACh receptor","Na+ channel"], a: "Dihydropyridine receptor (DHPR)" },
      { q: "Calcium released from the SR enters the cytosol through which receptor/channel?", options: ["Ryanodine receptor","SERCA pump","IP3 receptor","Na+/Ca2+ exchanger"], a: "Ryanodine receptor" },
      { q: "The organelle that stores Ca2+ for muscle contraction is the:", options: ["Mitochondrion","Sarcoplasmic reticulum","Golgi apparatus","Nucleus"], a: "Sarcoplasmic reticulum" },
      { q: "SERCA pumps are responsible for: ", options: ["releasing Ca2+","pumping Ca2+ into SR","synthesizing ATP","generating action potentials"], a: "pumping Ca2+ into SR" },
      { q: "Calcium binds to which subunit of troponin to initiate contraction?", options: ["Troponin I","Troponin T","Troponin C","Troponin M"], a: "Troponin C" },
      { q: "When Ca2+ binds troponin, tropomyosin moves to expose: ", options: ["myosin ATPase","actin binding sites","sarcolemma channels","ACh receptors"], a: "actin binding sites" },
      { q: "Excitation-contraction coupling couples electrical events to mechanical response via: ", options: ["Na+/K+ ATPase","Ca2+ signaling","mitochondrial respiration","glucose uptake"], a: "Ca2+ signaling" },
      { q: "The time between an action potential and the start of contraction is called: ", options: ["latent period","refractory period","twitch","tetanus"], a: "latent period" },
      { q: "Calcium-induced calcium release means: ", options: ["external Ca2+ entry triggers more SR Ca2+ release","Ca2+ inhibits SR","Ca2+ gets pumped out","Ca2+ binds myosin"], a: "external Ca2+ entry triggers more SR Ca2+ release" },
      { q: "Terminal cisternae are enlarged regions of the: ", options: ["T-tubule","Sarcoplasmic reticulum","Sarcolemma","Mitochondria"], a: "Sarcoplasmic reticulum" },
      { q: "The structural unit that links T-tubule DHPR and SR RYR allows rapid: ", options: ["ATP synthesis","Ca2+ release","glycolysis","Na+ reuptake"], a: "Ca2+ release" },
      { q: "Blocking ryanodine receptors would: ", options: ["increase contraction","prevent Ca2+ release and weaken contraction","increase Ca2+ storage","activate SERCA"], a: "prevent Ca2+ release and weaken contraction" },
      { q: "In skeletal muscle, the primary trigger for SR Ca2+ release is: ", options: ["voltage sensor activation in T-tubule","ACh binding to muscarinic receptors","mitochondrial Ca2+","extracellular ATP"], a: "voltage sensor activation in T-tubule" },
      { q: "Troponin I function is to: ", options: ["bind Ca2+","bind tropomyosin","inhibit actin–myosin interaction when Ca2+ is low","pump Ca2+ into SR"], a: "inhibit actin–myosin interaction when Ca2+ is low" },
    ],
  },
  {
    id: 3,
    title: "Stage 3 — Cross-Bridge Cycle & Biochemistry",
    questions: [
      { q: "The myosin head binds to actin to form a _____.", options: ["tetanus","cross-bridge","sarcomere","motor unit"], a: "cross-bridge" },
      { q: "ATP is required for which step of the cross-bridge cycle?", options: ["power stroke","myosin detachment from actin","Ca2+ release","troponin binding"], a: "myosin detachment from actin" },
      { q: "Hydrolysis of ATP on the myosin head provides energy to: ", options: ["rotate the power stroke","re-cock the myosin head","bind Ca2+","pump Ca2+"], a: "re-cock the myosin head" },
      { q: "The power stroke corresponds to release of which product?", options: ["ADP + Pi","ATP","AMP","Creatine"], a: "ADP + Pi" },
      { q: "Rigor mortis occurs after death because: ", options: ["excess ATP is made","no ATP is available for cross-bridge detachment","Ca2+ is absent","SERCA is hyperactive"], a: "no ATP is available for cross-bridge detachment" },
      { q: "Which protein runs along actin and blocks myosin binding sites at rest?", options: ["Troponin","Tropomyosin","Nebulin","Titin"], a: "Tropomyosin" },
      { q: "Fast-twitch fibers have _____ myosin ATPase activity compared to slow-twitch.", options: ["lower","higher","equal","no"], a: "higher" },
      { q: "Creatine phosphate in muscle primarily serves to: ", options: ["store Ca2+","rapidly regenerate ATP","bind O2","stabilize membranes"], a: "rapidly regenerate ATP" },
      { q: "Prolonged intense exercise leading to lactic acid accumulation primarily uses which pathway?", options: ["oxidative phosphorylation","glycolysis (anaerobic)","beta-oxidation","gluconeogenesis"], a: "glycolysis (anaerobic)" },
      { q: "Myosin ATPase activity determines muscle _____ speed.", options: ["fatigue","contraction","length","diameter"], a: "contraction" },
      { q: "During a single twitch, the peak tension is lower than during tetanus because: ", options: ["Ca2+ is lower and cross-bridges fewer","ATP is absent","no ACh released","muscle is damaged"], a: "Ca2+ is lower and cross-bridges fewer" },
      { q: "ADP and inorganic phosphate (Pi) release from myosin is associated with: ", options: ["myosin detachment","power stroke","ATP binding","tropomyosin movement"], a: "power stroke" },
      { q: "Oxidative (type I) fibers have _____ mitochondria and myoglobin than glycolytic fibers.", options: ["more","fewer","same","absent"], a: "more" },
      { q: "Phosphocreatine donates a phosphate to ADP via _____ to form ATP quickly.", options: ["creatine kinase","ATP synthase","lactate dehydrogenase","myokinase"], a: "creatine kinase" },
      { q: "The sliding filament theory states that: ", options: ["thick and thin filaments shorten","filaments slide past one another","only actin shortens","only myosin shortens"], a: "filaments slide past one another" },
    ],
  },
  {
    id: 4,
    title: "Stage 4 — Muscle Mechanics & Neural Control",
    questions: [
      { q: "A motor unit consists of: ", options: ["one muscle fiber","one motor neuron and all muscle fibers it innervates","all neurons to a muscle","one sarcomere"], a: "one motor neuron and all muscle fibers it innervates" },
      { q: "Recruitment increases muscle force by: ", options: ["increasing AP frequency","activating more motor units","lengthening sarcomeres","removing Ca2+"], a: "activating more motor units" },
      { q: "Frequency summation leads to tetanus when: ", options: ["APs are far apart","AP frequency is high enough to maintain Ca2+","ATP is depleted","muscle is cold"], a: "AP frequency is high enough to maintain Ca2+" },
      { q: "Length–tension relationship describes optimal force at: ", options: ["very short sarcomere lengths","optimal overlap of actin and myosin","no overlap","maximal overlap only"], a: "optimal overlap of actin and myosin" },
      { q: "Force–velocity relationship indicates that maximal shortening velocity is highest when load is: ", options: ["zero","maximum","moderate","unknown"], a: "zero" },
      { q: "Isometric contraction means muscle develops tension without: ", options: ["changing length","using ATP","receiving nerve input","releasing Ca2+"], a: "changing length" },
      { q: "Isotonic contraction means the muscle changes length while: ", options: ["tension changes","tension is constant","no ATP used","no Ca2+ involved"], a: "tension is constant" },
      { q: "Motor unit size (small to large) correlates with: ", options: ["fine control to gross movement","strength to endurance","age","fiber color"], a: "fine control to gross movement" },
      { q: "The refractory period in skeletal muscle is ____ the contraction duration, allowing tetanus.", options: ["longer than","shorter than","equal to","unrelated to"], a: "shorter than" },
      { q: "Central fatigue primarily involves: ", options: ["depletion of ATP in muscle","changes in central nervous system drive","lactic acid buildup","SR Ca2+ depletion"], a: "changes in central nervous system drive" },
      { q: "Muscle tone is maintained by: ", options: ["continuous low-level motor unit recruitment","complete relaxation","constant AChE inhibition","high-frequency tetanus"], a: "continuous low-level motor unit recruitment" },
      { q: "Post-activation potentiation temporarily increases force due to: ", options: ["more Ca2+ or phosphorylation of myosin light chains","ATP depletion","mitochondrial swelling","ACh accumulation"], a: "more Ca2+ or phosphorylation of myosin light chains" },
      { q: "The term " + '"twitch"' + " refers to: ", options: ["single rapid contraction–relaxation cycle","sustained contraction","slow contraction","no contraction"], a: "single rapid contraction–relaxation cycle" },
      { q: "Lengthening (eccentric) contractions typically produce _____ force than concentric ones.", options: ["more","less","equal","no"], a: "more" },
      { q: "Motor unit recruitment follows Henneman's size principle meaning: ", options: ["small units recruited first","large units recruited first","random recruitment","largest units only"], a: "small units recruited first" },
    ],
  },
  {
    id: 5,
    title: "Stage 5 — Fatigue, Recovery & Clinical Correlates",
    questions: [
      { q: "Muscular fatigue during long exercise is most associated with: ", options: ["ATP excess","glycogen depletion and central factors","increased Ca2+ storage","increased SR activity"], a: "glycogen depletion and central factors" },
      { q: "Oxygen debt after exercise is primarily repaid by: ", options: ["increased anaerobic glycolysis","restoring phosphocreatine and clearing lactate","reducing body temperature","removing Na+"], a: "restoring phosphocreatine and clearing lactate" },
      { q: "Myasthenia gravis is caused by: ", options: ["autoimmune antibodies against ACh receptors","excess ACh release","SERCA hyperactivity","Ryanodine receptor deficiency"], a: "autoimmune antibodies against ACh receptors" },
      { q: "Botulism causes weakness by: ", options: ["blocking ACh vesicle release","overstimulating receptors","destroying sarcomeres","blocking SERCA"], a: "blocking ACh vesicle release" },
      { q: "Malignant hyperthermia is linked to mutations in: ", options: ["ACh receptor","Ryanodine receptor","Troponin C","Myosin heavy chain"], a: "Ryanodine receptor" },
      { q: "Statin-induced myopathy primarily affects: ", options: ["NMJ function","muscle metabolism and integrity","AChE levels","SERCA activity"], a: "muscle metabolism and integrity" },
      { q: "Periodic paralysis disorders commonly involve abnormal: ", options: ["Ca2+ channels only","Na+/K+ ATPase","ion channels (Na+/K+ or Ca2+)","ACh synthesis"], a: "ion channels (Na+/K+ or Ca2+)" },
      { q: "Rigor mortis onset occurs because ATP levels fall and cross-bridges: ", options: ["cannot detach","detach rapidly","do not form","become phosphorylated"], a: "cannot detach" },
      { q: "A prolonged depolarization of the muscle fiber membrane would likely cause: ", options: ["no Ca2+ release","sustained Ca2+ release and tetany","immediate relaxation","decreased ATP usage"], a: "sustained Ca2+ release and tetany" },
      { q: "Electromyography (EMG) records: ", options: ["muscle tension directly","electrical activity of muscle fibers","SR Ca2+ levels","ACh release"], a: "electrical activity of muscle fibers" },
      { q: "Succinylcholine produces prolonged depolarization because it: ", options: ["is an AChE activator","is a persistent ACh receptor agonist","blocks Na+ channels","inhibits SERCA"], a: "is a persistent ACh receptor agonist" },
      { q: "Central fatigue may be influenced by: ", options: ["brain neurotransmitter changes","only peripheral lactic acid","ACh receptor numbers","SERCA mutations"], a: "brain neurotransmitter changes" },
      { q: "Heat generation during muscle activity primarily comes from: ", options: ["ATP hydrolysis and inefficient recovery","mitochondrial O2 consumption only","ACh breakdown","tropomyosin movement"], a: "ATP hydrolysis and inefficient recovery" },
      { q: "Delayed onset muscle soreness (DOMS) is most associated with: ", options: ["lactic acid accumulation exclusively","eccentric exercise and microtrauma","ACh overactivity","immediate inflammation only"], a: "eccentric exercise and microtrauma" },
      { q: "A clinical test for myasthenia gravis improvement uses: ", options: ["curare injection","edrophonium (Tensilon) test","botulinum toxin","caffeine challenge"], a: "edrophonium (Tensilon) test" },
    ],
  },
];

// Utilities: shuffle options for each question when presented
const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

const STORAGE_KEY = "physio_league_leaderboard_v1";

export default function PhysioLeagueGame() {
  const [player, setPlayer] = useState("");
  const [started, setStarted] = useState(false);
  const [stageIndex, setStageIndex] = useState(0); // 0..4
  const [qIndex, setQIndex] = useState(0); // question within stage
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [musclePower, setMusclePower] = useState(0);
  const [doctor, setDoctor] = useState(DOCTORS[0]);
  const [doctorLine, setDoctorLine] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const audioCorrect = useRef(null);
  const audioWrong = useRef(null);
  const bgMusic = useRef(null);

  useEffect(() => {
    // preload audio
    if (bgMusic.current) { bgMusic.current.loop = true; bgMusic.current.volume = 0.25; }
  }, []);

  const startGame = () => {
    if (!player.trim()) {
      alert("Please enter your name before starting.");
      return;
    }
    setStarted(true);
    setStageIndex(0);
    setQIndex(0);
    setScore(0);
    setMusclePower(0);
    setDoctor(DOCTORS[Math.floor(Math.random()*DOCTORS.length)]);
    setDoctorLine("Let\'s begin — flex your knowledge!");
    try { bgMusic.current && bgMusic.current.play(); } catch(e){}
  };

  const presentQuestion = STAGES[stageIndex].questions[qIndex];
  const shuffledOptions = shuffle([...presentQuestion.options]);

  const handleAnswer = (opt) => {
    if (selected) return; // prevent double answer
    setSelected(opt);
    const correct = opt === presentQuestion.a;
    if (correct) {
      setScore((s) => s + 1);
      setMusclePower((m) => Math.min(100, m + 100 / (STAGES.length * 15) * 100));
      setDoctorLine("Great! Ca2+ did its job — nice answer.");
      audioCorrect.current && audioCorrect.current.play();
    } else {
      setDoctorLine("Oops — re-check the Guyton step on this one.");
      setMusclePower((m) => Math.max(0, m - 5));
      audioWrong.current && audioWrong.current.play();
    }

    setTimeout(() => {
      setSelected(null);
      const nextQ = qIndex + 1;
      if (nextQ < STAGES[stageIndex].questions.length) {
        setQIndex(nextQ);
        setDoctor(DOCTORS[Math.floor(Math.random()*DOCTORS.length)]);
        setDoctorLine("");
      } else {
        // move to next stage or finish
        const nextStage = stageIndex + 1;
        if (nextStage < STAGES.length) {
          setStageIndex(nextStage);
          setQIndex(0);
          setDoctor(DOCTORS[Math.floor(Math.random()*DOCTORS.length)]);
          setDoctorLine(`Stage ${nextStage+1} ready — keep going!`);
        } else {
          // finish game
          finishGame();
        }
      }
    }, 900);
  };

  const finishGame = () => {
    setStarted(false);
    // save to leaderboard
    const entry = { name: player.trim(), score, date: new Date().toISOString() };
    const updated = [...leaderboard, entry].sort((a,b)=>b.score-a.score).slice(0,50);
    setLeaderboard(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setShowLeaderboard(true);
    setDoctorLine("Well done — view the leaderboard!");
    try { bgMusic.current && bgMusic.current.pause(); } catch(e){}
  };

  const resetAll = () => {
    setPlayer("");
    setStarted(false);
    setStageIndex(0);
    setQIndex(0);
    setScore(0);
    setMusclePower(0);
    setShowLeaderboard(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 p-6 font-sans text-gray-800">
      <audio ref={audioCorrect} src="https://cdn.pixabay.com/audio/2022/03/15/audio_1b2fa4f40f.mp3" preload="auto" />
      <audio ref={audioWrong} src="https://cdn.pixabay.com/audio/2022/03/15/audio_b3c6a4c1dc.mp3" preload="auto" />
      <audio ref={bgMusic} src="https://cdn.pixabay.com/audio/2023/04/19/audio_d7c8e87a33.mp3" preload="auto" />

      {/* Header */}
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/aimc-logo.png" alt="AIMC" className="w-16 h-16 rounded-md shadow" />
          <div>
            <h1 className="text-2xl font-bold">AIMC — Physio League</h1>
            <div className="text-sm text-gray-600">Muscle Contraction Puzzle — Guyton inspired</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold">Physio League '25</div>
          <div className="text-sm text-gray-600">AIMC • Department of Physiology</div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-6">
        {/* Doctor panel */}
        <aside className="bg-white rounded-2xl p-4 shadow flex flex-col items-center text-center">
          <div className="text-6xl mb-2">{doctor.avatar}</div>
          <div className="font-semibold text-lg">{doctor.name}</div>
          <div className="text-xs text-gray-500 mb-3">Your clinical coach</div>
          <div className="bg-blue-50 rounded-lg p-3 w-full text-sm italic text-gray-700">{doctorLine || "Enter your name and press Start — I'll coach you."}</div>

          <div className="mt-4 w-full text-sm">
            <div className="mb-2">Player</div>
            {!started ? (
              <input value={player} onChange={(e)=>setPlayer(e.target.value)} placeholder="Enter your name" className="w-full p-2 rounded border" />
            ) : (
              <div className="p-2 bg-gray-100 rounded">{player}</div>
            )}

            <div className="mt-3 flex gap-2">
              <button onClick={startGame} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Start</button>
              <button onClick={()=>{setShowLeaderboard(true);}} className="flex-1 bg-gray-200 py-2 rounded">Leaderboard</button>
            </div>

            <div className="mt-3 text-xs text-gray-600">Stages: {STAGES.length} • Questions per stage: {STAGES[0].questions.length}</div>
            <div className="mt-2 text-xs text-gray-600">Total questions: {STAGES.length * STAGES[0].questions.length}</div>
          </div>
        </aside>

        {/* Quiz / Leaderboard card */}
        <section className="bg-white rounded-2xl p-6 shadow">
          {showLeaderboard ? (
            <div>
              <h2 className="text-xl font-bold mb-3">Leaderboard</h2>
              {leaderboard.length===0 ? <p className="text-sm">No scores yet — be the first!</p> : (
                <ol className="space-y-2">
                  {leaderboard.map((e,idx)=> (
                    <li key={idx} className="flex justify-between bg-gray-50 p-2 rounded">
                      <div><span className="font-semibold">{e.name}</span> <span className="text-xs text-gray-500">({new Date(e.date).toLocaleString()})</span></div>
                      <div className="font-medium">{e.score}</div>
                    </li>
                  ))}
                </ol>
              )}
              <div className="mt-4 flex gap-2">
                <button onClick={()=>{setShowLeaderboard(false);}} className="px-4 py-2 bg-blue-600 text-white rounded">Back</button>
                <button onClick={()=>{ localStorage.removeItem(STORAGE_KEY); setLeaderboard([]); }} className="px-4 py-2 bg-red-200 rounded">Clear</button>
              </div>
            </div>
          ) : (!started ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome to Physio League '25</h2>
              <p className="text-sm text-gray-600 mb-4">Puzzles & MCQs on muscle contraction (Guyton-inspired). Complete all stages to post your score.</p>
              <div className="mb-4">
                <div className="text-sm font-semibold mb-1">Game rules</div>
                <ul className="text-xs text-gray-600 text-left inline-block">
                  <li>• Enter name and press Start.</li>
                  <li>• There are {STAGES.length} stages with {STAGES[0].questions.length} questions each.</li>
                  <li>• Each correct answer gives +1 point. No negative scoring.</li>
                  <li>• Leaderboard stores scores locally (top entries by score).</li>
                </ul>
              </div>
              <div className="text-sm text-gray-700">Doctors available: {DOCTORS.map(d=>d.name).join(', ')}</div>
            </div>
          ) : (
            // Quiz view
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-gray-500">{STAGES[stageIndex].title}</div>
                  <div className="text-lg font-semibold">Q {qIndex+1} / {STAGES[stageIndex].questions.length}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">Player: <span className="font-semibold">{player}</span></div>
                  <div className="text-sm">Score: <span className="font-semibold">{score}</span></div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded mb-4">
                <div className="text-md font-medium">{presentQuestion.q}</div>
              </div>

              <div className="grid gap-3 mb-4">
                {shuffledOptions.map((opt, i)=> (
                  <button key={i} onClick={()=>handleAnswer(opt)} disabled={!!selected} className={`p-3 text-left rounded border ${selected ? (opt===presentQuestion.a? 'bg-green-500 text-white':'bg-red-200') : 'bg-white hover:bg-blue-50'}`}>
                    {opt}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Stage progress: {stageIndex+1} / {STAGES.length}</div>
                <div className="text-sm text-gray-600">Overall muscle power: {Math.round(musclePower)}%</div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto mt-6 text-center text-xs text-gray-500">
        Questions inspired by Guyton & Hall — use for study and review. This web game is an educational tool and not an official publication of AIMC.
      </footer>
    </div>
  );
}

