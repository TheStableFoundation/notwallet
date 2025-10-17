export interface Translation {
  appName: string;
  home: string;
  lessons: string;
  wallet?: string;
  profile: string;
  settings: string;
  welcome: string;
  homeDesc: string;
  getStarted: string;
  startLesson: string;
  back: string;
  lessonCompleted: string;
  user: string;
  guest: string;
  progress: string;
  completed: string;
  question: string;
  of: string;
  afterChoice: string;
  correct: string;
  incorrect: string;
  startThisLesson: string;
  // Home page translations
  quickActions: string;
  dao: string;
  learn: string;
  activityFeed: string;
  bachAirdropLive: string;
  airdropDescription: string;
  claimYourAirdrop: string;
  claimYourBachAirdrop: string;
  signUpAndClaim: string;
  walletAddressUsedAirdrop: string;
  bachMoney: string;
  successClaimedAirdrop: string;
  claimAirdrop: string;
  signMessageProveOwnership: string;
  signing: string;
  signAndClaim: string;
  signatureOnlyForVerification: string;
  tryAgain: string;
  setYourUsername: string;
  chooseUsernamePersonalize: string;
  enterYourUsername: string;
  saveUsername: string;
  saved: string;
  usernameSavedSuccessfully: string;
  // DAO page translations
  daoTitle: string;
  theStableFoundation: string;
  lockedDaoTokens: string;
  treasury: string;
  treasuryBalances: string;
  viewOnExplorer: string;
  failedToLoadDaoBalance: string;
  failedToLoadTreasuryBalances: string;
  retry: string;
  locked: string;
  activeProposals: string;
  noActiveProposals: string;
  failedToLoadProposals: string;
  yesVotes: string;
  noVotes: string;
  ends: string;
  aboutTreasuryFees: string;
  treasuryFeeDescription: string;
  treasuryFundsUsage: string;
  markets: string;
  // Learn page translations
  learnTitle: string;
  aiAssistant: string;
  aiWelcomeMessage: string;
  askPlaceholder: string;
  thinking: string;
  aiDisclaimerMessage: string;
  frequentlyAskedQuestions: string;
  // FAQ questions and answers
  faqWhatIsStableFoundation: string;
  faqWhatIsStableFoundationAnswer: string;
  faqWhatIsCryptocurrency: string;
  faqWhatIsCryptocurrencyAnswer: string;
  faqWhatIsBlockchain: string;
  faqWhatIsBlockchainAnswer: string;
  faqHowToKeepWalletSecure: string;
  faqHowToKeepWalletSecureAnswer: string;
  faqWhatAreTransactionFees: string;
  faqWhatAreTransactionFeesAnswer: string;
  faqWhatIsDao: string;
  faqWhatIsDaoAnswer: string;
  faqHowToParticipateGovernance: string;
  faqHowToParticipateGovernanceAnswer: string;
  faqWhatIsDefi: string;
  faqWhatIsDefiAnswer: string;
}

export type SupportedLanguages = "en" | "sv" | "id";

export const translations: Record<SupportedLanguages, Translation> = {
  en: {
    appName: "NotWallet",
    home: "Home",
    lessons: "Lessons",
    settings: "Settings",
    wallet: "Wallet",
    profile: "Profile",
    welcome: "Welcome to NotWallet Crypto!",
    homeDesc: "A fun way to learn Persian.",
    getStarted: "Start Learning",
    startLesson: "Start",
    back: "← Back",
    lessonCompleted: "Lesson Complete! 🎉",
    user: "Username",
    guest: "Guest",
    progress: "Progress",
    completed: "lesson(s) completed",
    question: "Question",
    of: "of",
    afterChoice: "The result will be shown after you select.",
    correct: "Correct!",
    incorrect: "Incorrect!",
    startThisLesson: "Start Lesson",
    // Home page translations
    quickActions: "Quick Actions",
    dao: "DAO",
    learn: "Learn",
    activityFeed: "Activity Feed",
    bachAirdropLive: "🪂 BACH Airdrop Live!",
    airdropDescription:
      "Multiple ways to earn your BACH tokens! Complete tasks, contribute to the music database, and participate in the ecosystem.",
    claimYourAirdrop: "Claim Your Airdrop →",
    claimYourBachAirdrop: "🎉 Claim Your $BACH Airdrop!",
    signUpAndClaim: "Sign Up & Claim",
    walletAddressUsedAirdrop:
      "Your wallet address will be used for the airdrop.",
    bachMoney: "bach.money",
    successClaimedAirdrop: "🎊 Success! You have claimed your airdrop.",
    claimAirdrop: "Claim Airdrop",
    signMessageProveOwnership:
      "Sign this message to prove wallet ownership and claim your airdrop.",
    signing: "Signing...",
    signAndClaim: "Sign & Claim",
    signatureOnlyForVerification:
      "Your signature is only used to verify your wallet address.",
    tryAgain: "Try Again",
    setYourUsername: "👤 Set Your Username",
    chooseUsernamePersonalize: "Choose a username to personalize your wallet.",
    enterYourUsername: "Enter your username",
    saveUsername: "Save Username",
    saved: "Saved!",
    usernameSavedSuccessfully: "Username saved successfully!",
    // DAO page translations
    daoTitle: "DAO",
    theStableFoundation: "The Stable Foundation",
    lockedDaoTokens: "Locked DAO Tokens",
    treasury: "Treasury",
    treasuryBalances: "Treasury Balances",
    viewOnExplorer: "View on Explorer",
    failedToLoadDaoBalance: "Failed to load DAO balance",
    failedToLoadTreasuryBalances: "Failed to load treasury balances",
    retry: "Retry",
    locked: "Locked",
    activeProposals: "Active Proposals",
    noActiveProposals: "No active proposals at this time",
    failedToLoadProposals: "Failed to load proposals",
    yesVotes: "Yes Votes",
    noVotes: "No Votes",
    ends: "Ends",
    aboutTreasuryFees: "About Treasury Fees",
    treasuryFeeDescription:
      "The Stable Foundation Treasury collects a 0.25% fee on all transactions to support the development and maintenance of the NotWallet ecosystem.",
    treasuryFundsUsage:
      "These funds are used for community development, security audits, infrastructure maintenance, and ecosystem growth initiatives.",
    markets: "Markets",
    // Learn page translations
    learnTitle: "Learn",
    aiAssistant: "AI Assistant",
    aiWelcomeMessage:
      "Hello! I'm here to help you learn about cryptocurrency and The Stable Foundation. Ask me anything!",
    askPlaceholder: "Ask me about crypto or The Stable Foundation...",
    thinking: "Thinking...",
    aiDisclaimerMessage:
      "This is a demo AI assistant. Responses are simulated for educational purposes.",
    frequentlyAskedQuestions: "Frequently Asked Questions",
    // FAQ questions and answers
    faqWhatIsStableFoundation: "What is The Stable Foundation?",
    faqWhatIsStableFoundationAnswer:
      "The Stable Foundation is a decentralized organization focused on creating stable, accessible financial infrastructure built on blockchain technology. Our mission is to provide transparent, community-driven financial tools that empower users worldwide.",
    faqWhatIsCryptocurrency: "What is cryptocurrency?",
    faqWhatIsCryptocurrencyAnswer:
      "Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. It operates independently of traditional banking systems and enables peer-to-peer transactions without intermediaries.",
    faqWhatIsBlockchain: "What is a blockchain?",
    faqWhatIsBlockchainAnswer:
      "A blockchain is a distributed ledger technology that maintains a continuously growing list of records (blocks) linked and secured using cryptography. Each block contains transaction data, a timestamp, and a cryptographic hash of the previous block.",
    faqHowToKeepWalletSecure: "How do I keep my wallet secure?",
    faqHowToKeepWalletSecureAnswer:
      "Never share your private keys or seed phrases with anyone. Store your backup phrase in a secure, offline location. Use strong passwords and enable two-factor authentication when possible. Always verify transaction details before signing.",
    faqWhatAreTransactionFees: "What are transaction fees?",
    faqWhatAreTransactionFeesAnswer:
      "Transaction fees are small amounts paid to network validators for processing and confirming transactions on the blockchain. These fees help secure the network and prevent spam transactions.",
    faqWhatIsDao: "What is a DAO?",
    faqWhatIsDaoAnswer:
      "A DAO (Decentralized Autonomous Organization) is an organization governed by smart contracts and community voting rather than traditional management structures. Members can propose and vote on decisions that affect the organization.",
    faqHowToParticipateGovernance: "How do I participate in governance?",
    faqHowToParticipateGovernanceAnswer:
      "You can participate in governance by holding governance tokens, reviewing proposals, and casting votes on important decisions. Active participation helps shape the future direction of the foundation.",
    faqWhatIsDefi: "What is DeFi?",
    faqWhatIsDefiAnswer:
      "DeFi (Decentralized Finance) refers to financial services built on blockchain technology that operate without traditional intermediaries like banks. This includes lending, borrowing, trading, and earning yield on digital assets.",
  },
  sv: {
    appName: "NotWallet",
    home: "Hem",
    lessons: "Lektioner",
    settings: "Inställningar",
    wallet: "Plånbok",
    profile: "Profil",
    welcome: "Välkommen till NotWallet Crypto!",
    homeDesc: "Ett roligt sätt att lära sig persiska.",
    getStarted: "Börja lära",
    startLesson: "Starta",
    back: "← Tillbaka",
    lessonCompleted: "Lektion klar! 🎉",
    user: "Användarnamn",
    guest: "Gäst",
    progress: "Framsteg",
    completed: "lektion(er) slutförda",
    question: "Fråga",
    of: "av",
    afterChoice: "Resultatet visas när du har valt.",
    correct: "Rätt!",
    incorrect: "Fel!",
    startThisLesson: "Starta lektionen",
    // Home page translations
    quickActions: "Snabbåtgärder",
    dao: "DAO",
    learn: "Lär dig",
    activityFeed: "Aktivitetsflöde",
    bachAirdropLive: "🪂 BACH Airdrop Live!",
    airdropDescription:
      "Flera sätt att tjäna dina BACH-tokens! Slutför uppgifter, bidra till musikdatabasen och delta i ekosystemet.",
    claimYourAirdrop: "Hämta din Airdrop →",
    claimYourBachAirdrop: "🎉 Hämta din $BACH Airdrop!",
    signUpAndClaim: "Registrera dig & Hämta",
    walletAddressUsedAirdrop:
      "Din plånboksadress kommer att användas för airdroppen.",
    bachMoney: "bach.money",
    successClaimedAirdrop: "🎊 Framgång! Du har hämtat din airdrop.",
    claimAirdrop: "Hämta Airdrop",
    signMessageProveOwnership:
      "Signera detta meddelande för att bevisa ägarskap av plånbok och hämta din airdrop.",
    signing: "Signerar...",
    signAndClaim: "Signera & Hämta",
    signatureOnlyForVerification:
      "Din signatur används endast för att verifiera din plånboksadress.",
    tryAgain: "Försök igen",
    setYourUsername: "👤 Ange ditt användarnamn",
    chooseUsernamePersonalize:
      "Välj ett användarnamn för att personalisera din plånbok.",
    enterYourUsername: "Ange ditt användarnamn",
    saveUsername: "Spara användarnamn",
    saved: "Sparat!",
    usernameSavedSuccessfully: "Användarnamn sparat framgångsrikt!",
    // DAO page translations
    daoTitle: "DAO",
    theStableFoundation: "The Stable Foundation",
    lockedDaoTokens: "Låsta DAO-tokens",
    treasury: "Treasury",
    treasuryBalances: "Treasury-saldon",
    viewOnExplorer: "Visa på Explorer",
    failedToLoadDaoBalance: "Misslyckades att ladda DAO-saldo",
    failedToLoadTreasuryBalances: "Misslyckades att ladda treasury-saldon",
    retry: "Försök igen",
    locked: "Låst",
    activeProposals: "Aktiva förslag",
    noActiveProposals: "Inga aktiva förslag för tillfället",
    failedToLoadProposals: "Misslyckades att ladda förslag",
    yesVotes: "Ja-röster",
    noVotes: "Nej-röster",
    ends: "Slutar",
    aboutTreasuryFees: "Om Treasury-avgifter",
    treasuryFeeDescription:
      "The Stable Foundation Treasury tar ut en avgift på 0,25% på alla transaktioner för att stödja utveckling och underhåll av NotWallet-ekosystemet.",
    treasuryFundsUsage:
      "Dessa medel används för samhällsutveckling, säkerhetsrevisioner, infrastrukturunderhåll och ekosystemtillväxtinitiativ.",
    markets: "Marknader",
    // Learn page translations
    learnTitle: "Lär dig",
    aiAssistant: "AI-assistent",
    aiWelcomeMessage:
      "Hej! Jag är här för att hjälpa dig lära dig om kryptovaluta och The Stable Foundation. Fråga mig vad som helst!",
    askPlaceholder: "Fråga mig om krypto eller The Stable Foundation...",
    thinking: "Tänker...",
    aiDisclaimerMessage:
      "Detta är en demo AI-assistent. Svar simuleras för utbildningsändamål.",
    frequentlyAskedQuestions: "Vanliga frågor",
    // FAQ questions and answers
    faqWhatIsStableFoundation: "Vad är The Stable Foundation?",
    faqWhatIsStableFoundationAnswer:
      "The Stable Foundation är en decentraliserad organisation fokuserad på att skapa stabil, tillgänglig finansiell infrastruktur byggd på blockchain-teknik. Vårt uppdrag är att tillhandahålla transparenta, gemenskapsdrivna finansiella verktyg som stärker användare världen över.",
    faqWhatIsCryptocurrency: "Vad är kryptovaluta?",
    faqWhatIsCryptocurrencyAnswer:
      "Kryptovaluta är en digital eller virtuell form av valuta som använder kryptografi för säkerhet. Den fungerar oberoende av traditionella banksystem och möjliggör peer-to-peer-transaktioner utan mellanhänder.",
    faqWhatIsBlockchain: "Vad är en blockchain?",
    faqWhatIsBlockchainAnswer:
      "En blockchain är en distribuerad redovisningsteknik som upprätthåller en kontinuerligt växande lista över poster (block) länkade och säkrade med kryptografi. Varje block innehåller transaktionsdata, en tidsstämpel och ett kryptografiskt hash av föregående block.",
    faqHowToKeepWalletSecure: "Hur håller jag min plånbok säker?",
    faqHowToKeepWalletSecureAnswer:
      "Dela aldrig dina privata nycklar eller fröfraser med någon. Förvara din säkerhetskopieringsfras på en säker, offline-plats. Använd starka lösenord och aktivera tvåfaktorsautentisering när det är möjligt. Verifiera alltid transaktionsdetaljer innan du signerar.",
    faqWhatAreTransactionFees: "Vad är transaktionsavgifter?",
    faqWhatAreTransactionFeesAnswer:
      "Transaktionsavgifter är små belopp som betalas till nätverksvalidatorer för att bearbeta och bekräfta transaktioner på blockchain. Dessa avgifter hjälper till att säkra nätverket och förhindra spam-transaktioner.",
    faqWhatIsDao: "Vad är en DAO?",
    faqWhatIsDaoAnswer:
      "En DAO (Decentraliserad Autonom Organisation) är en organisation som styrs av smarta kontrakt och gemenskapsröstning snarare än traditionella ledningsstrukturer. Medlemmar kan föreslå och rösta på beslut som påverkar organisationen.",
    faqHowToParticipateGovernance: "Hur deltar jag i styrning?",
    faqHowToParticipateGovernanceAnswer:
      "Du kan delta i styrning genom att hålla styrnings-tokens, granska förslag och avge röster på viktiga beslut. Aktivt deltagande hjälper till att forma framtida riktning för stiftelsen.",
    faqWhatIsDefi: "Vad är DeFi?",
    faqWhatIsDefiAnswer:
      "DeFi (Decentraliserad Finans) hänvisar till finansiella tjänster byggda på blockchain-teknik som fungerar utan traditionella mellanhänder som banker. Detta inkluderar utlåning, upplåning, handel och avkastning på digitala tillgångar.",
  },
  id: {
    appName: "NotWallet",
    home: "Beranda",
    lessons: "Pelajaran",
    settings: "Pengaturan",
    wallet: "Dompet",
    profile: "Profil",
    welcome: "Selamat datang di NotWallet Crypto!",
    homeDesc: "Cara yang menyenangkan untuk belajar bahasa Persia.",
    getStarted: "Mulai Belajar",
    startLesson: "Mulai",
    back: "← Kembali",
    lessonCompleted: "Pelajaran Selesai! 🎉",
    user: "Nama Pengguna",
    guest: "Tamu",
    progress: "Kemajuan",
    completed: "pelajaran selesai",
    question: "Pertanyaan",
    of: "dari",
    afterChoice: "Hasil akan ditampilkan setelah Anda memilih.",
    correct: "Benar!",
    incorrect: "Salah!",
    startThisLesson: "Mulai Pelajaran",
    // Home page translations
    quickActions: "Aksi Cepat",
    dao: "DAO",
    learn: "Belajar",
    activityFeed: "Feed Aktivitas",
    bachAirdropLive: "🪂 Airdrop BACH Live!",
    airdropDescription:
      "Berbagai cara untuk mendapatkan token BACH Anda! Selesaikan tugas, berkontribusi pada database musik, dan berpartisipasi dalam ekosistem.",
    claimYourAirdrop: "Klaim Airdrop Anda →",
    claimYourBachAirdrop: "🎉 Klaim Airdrop $BACH Anda!",
    signUpAndClaim: "Daftar & Klaim",
    walletAddressUsedAirdrop:
      "Alamat dompet Anda akan digunakan untuk airdrop.",
    bachMoney: "bach.money",
    successClaimedAirdrop: "🎊 Berhasil! Anda telah mengklaim airdrop Anda.",
    claimAirdrop: "Klaim Airdrop",
    signMessageProveOwnership:
      "Tanda tangani pesan ini untuk membuktikan kepemilikan dompet dan klaim airdrop Anda.",
    signing: "Menandatangani...",
    signAndClaim: "Tanda Tangan & Klaim",
    signatureOnlyForVerification:
      "Tanda tangan Anda hanya digunakan untuk memverifikasi alamat dompet Anda.",
    tryAgain: "Coba Lagi",
    setYourUsername: "👤 Atur Nama Pengguna Anda",
    chooseUsernamePersonalize:
      "Pilih nama pengguna untuk mempersonalisasi dompet Anda.",
    enterYourUsername: "Masukkan nama pengguna Anda",
    saveUsername: "Simpan Nama Pengguna",
    saved: "Tersimpan!",
    usernameSavedSuccessfully: "Nama pengguna berhasil disimpan!",
    // DAO page translations
    daoTitle: "DAO",
    theStableFoundation: "The Stable Foundation",
    lockedDaoTokens: "Token DAO Terkunci",
    treasury: "Perbendaharaan",
    treasuryBalances: "Saldo Perbendaharaan",
    viewOnExplorer: "Lihat di Explorer",
    failedToLoadDaoBalance: "Gagal memuat saldo DAO",
    failedToLoadTreasuryBalances: "Gagal memuat saldo perbendaharaan",
    retry: "Coba Lagi",
    locked: "Terkunci",
    activeProposals: "Proposal Aktif",
    noActiveProposals: "Tidak ada proposal aktif saat ini",
    failedToLoadProposals: "Gagal memuat proposal",
    yesVotes: "Suara Ya",
    noVotes: "Suara Tidak",
    ends: "Berakhir",
    aboutTreasuryFees: "Tentang Biaya Perbendaharaan",
    treasuryFeeDescription:
      "Perbendaharaan The Stable Foundation mengenakan biaya 0,25% pada semua transaksi untuk mendukung pengembangan dan pemeliharaan ekosistem NotWallet.",
    treasuryFundsUsage:
      "Dana ini digunakan untuk pengembangan komunitas, audit keamanan, pemeliharaan infrastruktur, dan inisiatif pertumbuhan ekosistem.",
    markets: "Pasar",
    // Learn page translations
    learnTitle: "Belajar",
    aiAssistant: "Asisten AI",
    aiWelcomeMessage:
      "Halo! Saya di sini untuk membantu Anda belajar tentang cryptocurrency dan The Stable Foundation. Tanyakan apa saja!",
    askPlaceholder: "Tanya saya tentang crypto atau The Stable Foundation...",
    thinking: "Berpikir...",
    aiDisclaimerMessage:
      "Ini adalah asisten AI demo. Respons disimulasikan untuk tujuan edukasi.",
    frequentlyAskedQuestions: "Pertanyaan yang Sering Diajukan",
    // FAQ questions and answers
    faqWhatIsStableFoundation: "Apa itu The Stable Foundation?",
    faqWhatIsStableFoundationAnswer:
      "The Stable Foundation adalah organisasi terdesentralisasi yang fokus pada penciptaan infrastruktur keuangan yang stabil dan dapat diakses yang dibangun di atas teknologi blockchain. Misi kami adalah menyediakan alat keuangan yang transparan dan didorong oleh komunitas yang memberdayakan pengguna di seluruh dunia.",
    faqWhatIsCryptocurrency: "Apa itu cryptocurrency?",
    faqWhatIsCryptocurrencyAnswer:
      "Cryptocurrency adalah bentuk mata uang digital atau virtual yang menggunakan kriptografi untuk keamanan. Ini beroperasi secara independen dari sistem perbankan tradisional dan memungkinkan transaksi peer-to-peer tanpa perantara.",
    faqWhatIsBlockchain: "Apa itu blockchain?",
    faqWhatIsBlockchainAnswer:
      "Blockchain adalah teknologi buku besar terdistribusi yang memelihara daftar catatan yang terus berkembang (blok) yang terhubung dan diamankan menggunakan kriptografi. Setiap blok berisi data transaksi, timestamp, dan hash kriptografis dari blok sebelumnya.",
    faqHowToKeepWalletSecure: "Bagaimana cara menjaga keamanan dompet saya?",
    faqHowToKeepWalletSecureAnswer:
      "Jangan pernah berbagi kunci pribadi atau frasa seed Anda dengan siapa pun. Simpan frasa cadangan Anda di tempat yang aman dan offline. Gunakan kata sandi yang kuat dan aktifkan autentikasi dua faktor jika memungkinkan. Selalu verifikasi detail transaksi sebelum menandatangani.",
    faqWhatAreTransactionFees: "Apa itu biaya transaksi?",
    faqWhatAreTransactionFeesAnswer:
      "Biaya transaksi adalah jumlah kecil yang dibayarkan kepada validator jaringan untuk memproses dan mengkonfirmasi transaksi di blockchain. Biaya ini membantu mengamankan jaringan dan mencegah transaksi spam.",
    faqWhatIsDao: "Apa itu DAO?",
    faqWhatIsDaoAnswer:
      "DAO (Organisasi Otonom Terdesentralisasi) adalah organisasi yang diatur oleh kontrak pintar dan voting komunitas daripada struktur manajemen tradisional. Anggota dapat mengusulkan dan memilih keputusan yang mempengaruhi organisasi.",
    faqHowToParticipateGovernance:
      "Bagaimana cara berpartisipasi dalam tata kelola?",
    faqHowToParticipateGovernanceAnswer:
      "Anda dapat berpartisipasi dalam tata kelola dengan memegang token tata kelola, meninjau proposal, dan memberikan suara pada keputusan penting. Partisipasi aktif membantu membentuk arah masa depan yayasan.",
    faqWhatIsDefi: "Apa itu DeFi?",
    faqWhatIsDefiAnswer:
      "DeFi (Keuangan Terdesentralisasi) mengacu pada layanan keuangan yang dibangun di atas teknologi blockchain yang beroperasi tanpa perantara tradisional seperti bank. Ini termasuk pinjam-meminjam, perdagangan, dan memperoleh yield pada aset digital.",
  },
};
