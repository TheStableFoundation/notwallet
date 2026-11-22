export interface Translation {
  appName: string;
  home: string;
  lessons: string;
  wallet?: string;
  profile: string;
  settings: string;
  // AI Chat page translations
  chat: string;
  chatAssistantName: string;
  chatTagline: string;
  chatEmptyTitle: string;
  chatInputPlaceholder: string;
  chatModelLoading: string;
  chatModelReady: string;
  chatModelError: string;
  chatModelUnloaded: string;
  chatSendError: string;
  chatClearHistory: string;
  chatDisclaimer: string;
  chatUnsupportedPlatform: string;
  chatSuggestions: string[];
  welcome: string;
  welcomePersonal: (name: string) => string;
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
  tasks: string;
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
  googleOAuthLogin: string;
  oAuthLoginExplanation: string;
  logout: string;

  onboardingCreateWalletTitle: string;
  onboardingImportWalletTitle: string;
  onboardingCreatePasswordTitle: string;
  onboardingDisclaimerTitle: string;
  onboardingDisclaimerDesc1: string;
  onboardingDisclaimerDesc2: string;
  onboardingDisclaimerDesc3: string;
  onboardingDisclaimerDesc4: string;
  onboardingDisclaimerNonCustodial: string;
  onboardingContinue: string;
  onboardingUnderstandContinue: string;
  onboardingSetPasswordDesc: string;
  onboardingPasswordRequired: string;
  onboardingPasswordMinLength: string;
  onboardingPasswordMismatch: string;
  onboardingPasswordFoundTitle: string;
  onboardingPasswordFoundDesc: string;
  onboardingUseExistingPassword: string;
  onboardingCreateNewPassword: string;
  onboardingImportSeedPhraseDesc: string;
  onboardingImportWalletButton: string;
  onboardingImportSuccess: string;
  onboardingImportWarning: string;
  onboardingKeypairsTitle: string;
  onboardingNoKeypairs: string;
  onboardingGenerateNewAddress: string;
  onboardingSavedSeedPhrase: string;
  onboardingImportantDialogTitle: string;
  onboardingImportantDialogDesc: string;
  errorOccurred: string;
  processing: string;
  confirm: string;
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
  viewProposals: string;
  openInRealms: string;
  // Learn page translations
  learnTitle: string;
  aiAssistant: string;
  aiWelcomeMessage: string;
  askPlaceholder: string;
  thinking: string;
  aiDisclaimerMessage: string;
  frequentlyAskedQuestions: string;
  // Learn page translations
  tasksTitle: string;
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
  // Wallet specific translations
  walletTitle: string;
  switchKeypairTitle: string;
  addressQrCode: string;
  noKeypairsFound: string;
  noSolWarningTitle: string;
  noSolWarningDescription: string;
  account: string;
  active: string;
  assets: string;
  activity: string;
  transactionHistory: string;
  viewWalletActivity: string;
  openInSolscan: string;
  noAssetsFound: string;
  defaultUsername: string;
  pleaseSelectUsername: string;
  usernameTooLong: string;
  updateUsernameFailed: string;
  editWallet: string;
  success: string;
  username: string;
  maxCharacters: string;
  saving: string;
  pleaseEnterValidAmount: string;
  pleaseSelectRecipient: string;
  failedToSendTokens: string;
  transactionCompletedSuccessfully: string;
  tokenType: string;
  amount: string;
  available: string;
  recipient: string;
  enterCustomAddress: string;
  recipientAddress: string;
  enterRecipientPublicKey: string;
  customAddress: string;
  sending: string;
  failedToGetQuote: string;
  failedToSwap: string;
  swapTokens: string;
  swapCompleted: string;
  from: string;
  to: string;
  swapTokensTooltip: string;
  quoteDetails: string;
  outputAmount: string;
  fee: string;
  priceImpact: string;
  route: string;
  direct: string;
  transactionReady: string;
  blockHeight: string;
  priorityFee: string;
  computeUnits: string;
  finalSlippage: string;
  executeSwap: string;
  getQuote: string;
  insufficientBalance: string;
  sendToken: string;
  simulationWarning: string;
  buildNewTransaction: string;
  slippage: string;
  slippagePercent: string;
  buildingTransaction: string;
  prepareSwap: string;
  toggleLockWallet: string;
  walletSettings: string;
  copyPubkey: string;
  switchKeypair: string;
  buySol: string;
  // Common actions
  cancel: string;
  save: string;
  // Wallet settings translations
  addWallet: string;
  createNew: string;
  showSeedPhrase: string;
  viewRecoveryPhrase: string;
  importExisting: string;
  network: string;
  management: string;
  importRecovery: string;
  destroyWallets: string;
  destroyAllData: string;
  // Security translations
  securityNotice: string;
  storeOffline: string;
  // Common UI
  dangerZone: string;
  irreversibleActions: string;
  // Finance translations
  send: string;
  swap: string;
  balance: string;
  // Lib components translations
  importSeedPhrase: string;
  createNewWallet: string;
  walletLocked: string;
  enterPassword: string;
  incorrectPassword: string;
  unlockWallet: string;
  notwalletCrypto: string;
  createYourWallet: string;
  // Settings pages translations
  congratulations: string;
  congratulationsMessage: string;
  gotIt: string;
  stableFoundationCopyright: string;
  easterEggFound: string;
  easterEggDescription: string;
  applicationInformation: string;
  version: string;
  installationId: string;
  loading: string;
  supportNote: string;
  preferences: string;
  theme: string;
  chooseAppearance: string;
  system: string;
  matchDevice: string;
  light: string;
  cleanBright: string;
  dark: string;
  easyEyes: string;
  changesApplyImmediately: string;
  language: string;
  selectLanguage: string;
  english: string;
  indonesian: string;
  // Common translations
  about: string;
  appInfo: string;
  appPreferences: string;
  languagePreferences: string;
  app: string;
  legalSupport: string;
  termsOfService: string;
  privacyPolicy: string;
  openSource: string;
  // About page translations
  aboutDescription: string;
  developedBy: string;
  swedish: string;
  debug: string;
}

export type SupportedLanguages = "en" | "sv" | "id" | "fil" | "ar";

export const translations: Record<SupportedLanguages, Translation> = {
  en: {
    appName: "NotWallet",
    home: "Home",
    lessons: "Lessons",
    settings: "Settings",
    wallet: "Wallet",
    profile: "Profile",
    welcome: "Welcome to NotWallet Crypto!",
    welcomePersonal: (name) => `Welcome back, ${name}!`,
    homeDesc: "A fun way to learn Persian.",
    getStarted: "Start Learning",
    startLesson: "Start",

    onboardingCreateWalletTitle: "Create Wallet",
    onboardingImportWalletTitle: "Import Wallet",
    onboardingCreatePasswordTitle: "Create Password",
    onboardingDisclaimerTitle: "Important Disclaimer",
    onboardingDisclaimerDesc1: "You are about to create a self-custody wallet.",
    onboardingDisclaimerDesc2:
      "You are the only one who controls your wallet and funds.",
    onboardingDisclaimerDesc3:
      "Your seed phrase is the ONLY way to recover your wallet and assets.",
    onboardingDisclaimerDesc4:
      "If you lose your seed phrase, {red}your funds cannot be recovered.",
    onboardingDisclaimerNonCustodial:
      "This is a non-custodial wallet. Only you have access to your private keys and funds.",
    onboardingContinue: "Continue",
    onboardingUnderstandContinue: "I Understand, Continue",
    onboardingSetPasswordDesc: "Set a strong password to protect your wallet.",
    onboardingPasswordRequired:
      "This password will be required to access your wallet on this device.",
    onboardingPasswordMinLength: "Password must be at least 6 characters.",
    onboardingPasswordMismatch: "Passwords do not match.",
    onboardingPasswordFoundTitle: "Password Found",
    onboardingPasswordFoundDesc:
      "A password already exists for this wallet. Would you like to use the existing password or create a new one?",
    onboardingUseExistingPassword: "Use Existing Password",
    onboardingCreateNewPassword: "Create New Password",
    onboardingImportSeedPhraseDesc:
      "Enter your 12 or 24-word seed phrase below to import your wallet.",
    onboardingImportWalletButton: "Import Wallet",
    onboardingImportSuccess: "Import Successful!",
    onboardingImportWarning:
      "Make sure no one is watching your screen. Never share your seed phrase with anyone.",
    onboardingKeypairsTitle: "Imported Keypairs",
    onboardingNoKeypairs: "No keypairs found.",
    onboardingGenerateNewAddress: "Generate New Address",
    onboardingSavedSeedPhrase: "I have saved my seed phrase",
    onboardingImportantDialogTitle: "Important!",
    onboardingImportantDialogDesc:
      "Your seed phrase is the only way to recover your wallet. If you lose it, you will lose access to your funds forever. Make sure you have securely saved your seed phrase before continuing.",
    errorOccurred: "An error occurred. Please try again.",
    processing: "Processing...",
    confirm: "Confirm",
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
    tasks: "Tasks",
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
    saved: "Saved",
    usernameSavedSuccessfully: "Username saved successfully!",
    oAuthLoginExplanation: "Claim with your Google account",
    googleOAuthLogin: "Login with Google",
    logout: "Log out",
    // DAO page translations
    daoTitle: "DAO",
    theStableFoundation: "The Stable Foundation",
    lockedDaoTokens: "Locked DAO Tokens",
    treasury: "Treasury Wallet",
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
      "The Stable Foundation Treasury collects a 0.25% fee on all transactions to support the development and maintenance of the NotWallet Crypto ecosystem.",
    treasuryFundsUsage:
      "These funds are used for community development, security audits, infrastructure maintenance, and ecosystem growth initiatives.",
    markets: "Join the DAO",
    viewProposals: "Proposals",
    openInRealms: "See all proposals",
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
    // Learn page translations
    tasksTitle: "Tasks",
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
    // Wallet specific translations
    walletTitle: "Wallet",
    switchKeypairTitle: "Switch Wallet",
    addressQrCode: "Scan Address",
    noKeypairsFound: "No wallets found",
    noSolWarningTitle: "No SOL balance",
    noSolWarningDescription:
      "You need SOL to pay transaction fee in the Solana blockchain.",
    account: "Account",
    active: "Active",
    assets: "Assets",
    activity: "Activity",
    transactionHistory: "Transaction History",
    viewWalletActivity: "View all wallet activity on NotWallet web",
    openInSolscan: "Open in NotWallet web",
    noAssetsFound: "No assets found",
    defaultUsername: "Wallet",
    pleaseSelectUsername: "Please enter a username",
    usernameTooLong: "Username too long (max 6 characters)",
    updateUsernameFailed: "Failed to update username",
    editWallet: "Edit Wallet",
    success: "Success!",
    username: "Username",
    maxCharacters: "max 6 characters",
    saving: "Saving...",
    pleaseEnterValidAmount: "Please enter a valid amount",
    pleaseSelectRecipient: "Please select or enter a recipient",
    failedToSendTokens: "Failed to send tokens",
    transactionCompletedSuccessfully: "Transaction completed successfully!",
    tokenType: "Token Type",
    amount: "Amount",
    available: "Available",
    recipient: "Recipient",
    enterCustomAddress: "Enter custom address",
    recipientAddress: "Recipient Address",
    enterRecipientPublicKey: "Enter recipient public key",
    customAddress: "Custom Address",
    sending: "Sending...",
    failedToGetQuote: "Failed to get swap quote",
    failedToSwap: "Failed to execute swap",
    swapTokens: "Swap Tokens",
    swapCompleted: "Swap completed successfully!",
    from: "From",
    to: "To",
    swapTokensTooltip: "Swap token positions",
    quoteDetails: "Quote Details",
    outputAmount: "Output Amount",
    fee: "Fee",
    priceImpact: "Price Impact",
    route: "Route",
    direct: "Direct",
    transactionReady: "Transaction Ready",
    blockHeight: "Block Height",
    priorityFee: "Priority Fee",
    computeUnits: "Compute Units",
    finalSlippage: "Final Slippage",
    executeSwap: "Execute Swap",
    getQuote: "Get Quote",
    insufficientBalance: "Insufficient balance",
    sendToken: "Send Token",
    simulationWarning: "Simulation Warning",
    buildNewTransaction: "Build New Transaction",
    slippage: "Slippage",
    slippagePercent: "0.1%",
    buildingTransaction: "Building Transaction...",
    prepareSwap: "Prepare Swap",
    toggleLockWallet: "Toggle lock wallet",
    walletSettings: "Wallet settings",
    copyPubkey: "Copy public key",
    switchKeypair: "Switch wallet",
    buySol: "Buy SOL",
    // Common actions
    cancel: "Cancel",
    save: "Save",
    // Wallet settings translations
    addWallet: "Add Wallet",
    createNew: "Create a new wallet",
    showSeedPhrase: "Show Seed Phrase",
    viewRecoveryPhrase: "View your recovery phrase",
    importExisting: "Import an existing wallet",
    network: "Network",
    management: "Wallet Management",
    importRecovery: "Import & Recovery",
    destroyWallets: "Destroy Wallets",
    destroyAllData: "This will permanently delete all wallet data",
    // Security translations
    securityNotice: "Security Notice",
    storeOffline: "Store your seed phrase in a secure, offline location",
    // Common UI
    dangerZone: "Danger Zone",
    irreversibleActions:
      "Irreversible actions that will permanently delete your data",
    // Finance translations
    send: "Send",
    swap: "Swap",
    balance: "Balance",
    // Lib components translations
    importSeedPhrase: "Import Seed Phrase",
    createNewWallet: "Create New Wallet",
    walletLocked: "Wallet Locked",
    enterPassword: "Enter Password",
    incorrectPassword: "Incorrect password. Please try again.",
    unlockWallet: "Unlock Wallet",
    notwalletCrypto: "NotWallet Crypto",
    createYourWallet: "Create Your Wallet",
    // Settings pages translations
    congratulations: "🎉 Congratulations! 🎉",
    congratulationsMessage:
      "You just found one of many ways to get the BACH Token airdrop. Send an email to info@bach.money with subject SETTINGS_EASTER_EGG and your wallet address in the email body.",
    gotIt: "Got it!",
    stableFoundationCopyright: "© {year} The Stable Foundation",
    easterEggFound: "Easter Egg Found!",
    easterEggDescription: "You discovered a hidden feature in the settings.",
    applicationInformation: "Application Information",
    version: "Version",
    installationId: "Installation ID",
    loading: "Loading",
    supportNote: "This information helps with support and debugging",
    preferences: "Preferences",
    theme: "Theme",
    chooseAppearance: "Choose your preferred appearance",
    system: "System",
    matchDevice: "Match your device settings",
    light: "Light",
    cleanBright: "Clean and bright interface",
    dark: "Dark",
    easyEyes: "Easy on the eyes",
    changesApplyImmediately: "Changes will apply immediately",
    language: "Language",
    selectLanguage: "Select Language",
    english: "English",
    indonesian: "Indonesian",
    // Common translations
    about: "About",
    appInfo: "App Info",
    appPreferences: "App Preferences",
    languagePreferences: "Language Preferences",
    app: "App",
    legalSupport: "Legal & Support",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    openSource: "Open Source",
    // About page translations
    aboutDescription:
      "A modern, community-owned, non-custodial open-source Solana wallet app built for privacy, simplicity, and security.",
    developedBy: "Developed and maintained by The Stable Foundation.",
    swedish: "Swedish",
    debug: "Debug",
    chat: "Chat",
    chatAssistantName: "Amethyst",
    chatTagline: "Learn how crypto works. Private, on your device.",
    chatEmptyTitle: "What would you like to learn?",
    chatInputPlaceholder: "Ask about crypto…",
    chatModelLoading: "Loading Amethyst…",
    chatModelReady: "On-device · private",
    chatModelError: "Model error",
    chatModelUnloaded: "Tap to start chatting",
    chatSendError: "Something went wrong. Please try again.",
    chatClearHistory: "Clear conversation",
    chatDisclaimer:
      "Amethyst explains, it doesn't advise. Not financial advice.",
    chatUnsupportedPlatform: "AI Chat isn't available on this platform yet.",
    chatSuggestions: [
      "What is a stablecoin?",
      "How do I keep my wallet safe?",
      "Why do I need SOL for fees?",
      "How does a token swap work?",
    ],
  },
  sv: {
    appName: "NotWallet",
    home: "Hem",
    lessons: "Lektioner",
    settings: "Inställningar",
    wallet: "Plånbok",
    profile: "Profil",
    welcome: "Välkommen till NotWallet Crypto!",
    welcomePersonal: (name) => `Välkommen tillbaka, ${name}!`,
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
    tasks: "Uppgifter",
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
      "Signera detta meddelande för att bevisa plånboksägande och hämta din airdrop.",
    signing: "Signerar...",
    signAndClaim: "Signera & Hämta",
    signatureOnlyForVerification:
      "Din signatur används endast för att verifiera din plånboksadress.",
    tryAgain: "Försök igen",
    setYourUsername: "👤 Ange ditt användarnamn",
    chooseUsernamePersonalize:
      "Välj ett användarnamn för att personifiera din plånbok.",
    enterYourUsername: "Ange ditt användarnamn",
    saveUsername: "Spara användarnamn",

    onboardingCreateWalletTitle: "Skapa Plånbok",
    onboardingImportWalletTitle: "Importera Plånbok",
    onboardingCreatePasswordTitle: "Skapa Lösenord",
    onboardingDisclaimerTitle: "Viktig Ansvarsfriskrivning",
    onboardingDisclaimerDesc1:
      "Du är på väg att skapa en självförvarad plånbok.",
    onboardingDisclaimerDesc2:
      "Du är den enda som kontrollerar din plånbok och dina medel.",
    onboardingDisclaimerDesc3:
      "Din seed-fras är det ENDA sättet att återställa din plånbok och tillgångar.",
    onboardingDisclaimerDesc4:
      "Om du förlorar din seed-fras, {red}kan dina medel inte återställas.",
    onboardingDisclaimerNonCustodial:
      "Detta är en icke-förvaringsplånbok. Endast du har tillgång till dina privata nycklar och medel.",
    onboardingContinue: "Fortsätt",
    onboardingUnderstandContinue: "Jag Förstår, Fortsätt",
    onboardingSetPasswordDesc:
      "Ange ett starkt lösenord för att skydda din plånbok.",
    onboardingPasswordRequired:
      "Detta lösenord krävs för att komma åt din plånbok på denna enhet.",
    onboardingPasswordMinLength: "Lösenordet måste vara minst 6 tecken.",
    onboardingPasswordMismatch: "Lösenorden matchar inte.",
    onboardingPasswordFoundTitle: "Lösenord Hittades",
    onboardingPasswordFoundDesc:
      "Ett lösenord finns redan för denna plånbok. Vill du använda det befintliga lösenordet eller skapa ett nytt?",
    onboardingUseExistingPassword: "Använd Befintligt Lösenord",
    onboardingCreateNewPassword: "Skapa Nytt Lösenord",
    onboardingImportSeedPhraseDesc:
      "Ange din 12- eller 24-ords seed-fras nedan för att importera din plånbok.",
    onboardingImportWalletButton: "Importera Plånbok",
    onboardingImportSuccess: "Import Lyckades!",
    onboardingImportWarning:
      "Se till att ingen tittar på din skärm. Dela aldrig din seed-fras med någon.",
    onboardingKeypairsTitle: "Importerade Nyckelpar",
    onboardingNoKeypairs: "Inga nyckelpar hittades.",
    onboardingGenerateNewAddress: "Generera Ny Adress",
    onboardingSavedSeedPhrase: "Jag har sparat min seed-fras",
    onboardingImportantDialogTitle: "Viktigt!",
    onboardingImportantDialogDesc:
      "Din seed-fras är det enda sättet att återställa din plånbok. Om du förlorar den kommer du att förlora åtkomsten till dina medel för alltid. Se till att du har sparat din seed-fras säkert innan du fortsätter.",
    errorOccurred: "Ett fel uppstod. Vänligen försök igen.",
    processing: "Bearbetar...",
    confirm: "Bekräfta",
    saved: "Sparat",
    usernameSavedSuccessfully: "Användarnamn sparat framgångsrikt!",
    oAuthLoginExplanation: "Claim with your Google account",
    googleOAuthLogin: "Login with Google",
    logout: "Loga ut",
    // DAO page translations
    daoTitle: "DAO",
    theStableFoundation: "The Stable Foundation",
    lockedDaoTokens: "Låsta DAO-tokens",
    treasury: "Treasury Wallet",
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
      "The Stable Foundation Treasury tar ut en avgift på 0,25% på alla transaktioner för att stödja utveckling och underhåll av NotWallet-Crypto-ekosystemet.",
    treasuryFundsUsage:
      "Dessa medel används för samhällsutveckling, säkerhetsrevisioner, infrastrukturunderhåll och ekosystemtillväxtinitiativ.",
    markets: "Joina DAOn",
    viewProposals: "Proposals",
    openInRealms: "See all proposals",
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
    // Learn page translations
    tasksTitle: "Uppgifter",
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
    // Wallet specific translations
    walletTitle: "Plånbok",
    switchKeypairTitle: "Byt plånbok",
    addressQrCode: "Skanningsadress",
    noKeypairsFound: "Inga plånböcker hittades",
    noSolWarningTitle: "Ingen SOL balans",
    noSolWarningDescription:
      "Du behöver SOL för att betala transaktionsavgiften i Solana blockkedjan.",
    account: "Konto",
    active: "Aktiv",
    assets: "Tillgångar",
    activity: "Aktivitet",
    transactionHistory: "Transaktionshistorik",
    viewWalletActivity: "Visa all plånboksaktivitet på NotWallet web",
    openInSolscan: "Öppna i NotWallet web",
    noAssetsFound: "Inga tillgångar hittades",
    defaultUsername: "Plånbok",
    pleaseSelectUsername: "Ange ett användarnamn",
    usernameTooLong: "Användarnamnet för långt (max 6 tecken)",
    updateUsernameFailed: "Misslyckades att uppdatera användarnamn",
    editWallet: "Redigera plånbok",
    success: "Framgång!",
    username: "Användarnamn",
    maxCharacters: "max 6 tecken",
    saving: "Sparar...",
    pleaseEnterValidAmount: "Ange ett giltigt belopp",
    pleaseSelectRecipient: "Välj eller ange en mottagare",
    failedToSendTokens: "Misslyckades att skicka tokens",
    transactionCompletedSuccessfully: "Transaktion slutförd framgångsrikt!",
    tokenType: "Token-typ",
    amount: "Belopp",
    available: "Tillgängligt",
    recipient: "Mottagare",
    enterCustomAddress: "Ange anpassad adress",
    recipientAddress: "Mottagaradress",
    enterRecipientPublicKey: "Ange mottagarens publika nyckel",
    customAddress: "Anpassad adress",
    sending: "Skickar...",
    failedToGetQuote: "Misslyckades att få swap-offert",
    failedToSwap: "Misslyckades att utföra swap",
    swapTokens: "Swappa tokens",
    swapCompleted: "Swap slutförd framgångsrikt!",
    from: "Från",
    to: "Till",
    swapTokensTooltip: "Swappa token-positioner",
    quoteDetails: "Offertdetaljer",
    outputAmount: "Utdatabelopp",
    fee: "Avgift",
    priceImpact: "Prispåverkan",
    route: "Rutt",
    direct: "Direkt",
    transactionReady: "Transaktion klar",
    blockHeight: "Blockhöjd",
    priorityFee: "Prioritetsavgift",
    computeUnits: "Beräkningsenheter",
    finalSlippage: "Slutlig glidning",
    executeSwap: "Utför swap",
    getQuote: "Få offert",
    insufficientBalance: "Otillräckligt saldo",
    sendToken: "Skicka Token",
    simulationWarning: "Simuleringsvarning",
    buildNewTransaction: "Bygg ny transaktion",
    slippage: "Glidning",
    slippagePercent: "0,1%",
    buildingTransaction: "Bygger transaktion...",
    prepareSwap: "Förbered swap",
    toggleLockWallet: "Växla låsning av plånbok",
    walletSettings: "Plånboksinställningar",
    copyPubkey: "Kopiera publik nyckel",
    switchKeypair: "Byt plånbok",
    buySol: "Köp SOL",
    // Common actions
    cancel: "Avbryt",
    save: "Spara",
    // Wallet settings translations
    addWallet: "Lägg till plånbok",
    createNew: "Skapa en ny plånbok",
    showSeedPhrase: "Visa fröfras",
    viewRecoveryPhrase: "Visa din återställningsfras",
    importExisting: "Importera en befintlig plånbok",
    network: "Natverk",
    management: "Plånbokshantering",
    importRecovery: "Import & återställning",
    destroyWallets: "Förstör plånböcker",
    destroyAllData: "Detta kommer permanent ta bort all plånboksdata",
    // Security translations
    securityNotice: "Säkerhetsmeddelande",
    storeOffline: "Förvara din fröfras på en säker, offline-plats",
    // Common UI
    dangerZone: "Farlig zon",
    irreversibleActions:
      "Irreversibla åtgärder som permanent tar bort din data",
    // Finance translations
    send: "Skicka",
    swap: "Swappa",
    balance: "Saldo",
    // Lib components translations
    importSeedPhrase: "Importera fröfras",
    createNewWallet: "Skapa ny plånbok",
    walletLocked: "Plånbok låst",
    enterPassword: "Ange lösenord",
    incorrectPassword: "Felaktigt lösenord. Försök igen.",
    unlockWallet: "Lås upp plånbok",
    notwalletCrypto: "NotWallet Crypto",
    createYourWallet: "Skapa din plånbok",
    // Settings pages translations
    congratulations: "🎉 Grattis! 🎉",
    congratulationsMessage:
      "Du hittade ett av många sätt att få BACH Token airdrop. Skicka ett e-postmeddelande till info@bach.money med ämne SETTINGS_EASTER_EGG och din plånboksadress i e-postmeddelandets brödtext.",
    gotIt: "Förstått!",
    stableFoundationCopyright: "© {year} The Stable Foundation",
    easterEggFound: "Påskägg funnet!",
    easterEggDescription: "Du upptäckte en dold funktion i inställningarna.",
    applicationInformation: "Applikationsinformation",
    version: "Version",
    installationId: "Installations-ID",
    loading: "Laddar",
    supportNote: "Denna information hjälper med support och felsökning",
    preferences: "Inställningar",
    theme: "Tema",
    chooseAppearance: "Välj din föredragna utseende",
    system: "System",
    matchDevice: "Matcha dina enhetsinställningar",
    light: "Ljus",
    cleanBright: "Rent och ljust gränssnitt",
    dark: "Mörk",
    easyEyes: "Lätt för ögonen",
    changesApplyImmediately: "Ändringar tillämpas omedelbart",
    language: "Språk",
    selectLanguage: "Välj språk",
    english: "Engelska",
    indonesian: "Indonesiska",
    // Common translations
    about: "Om",
    appInfo: "App Info",
    appPreferences: "App Preferences",
    languagePreferences: "Language Preferences",
    app: "App",
    legalSupport: "Juridik & Support",
    termsOfService: "Användarvillkor",
    privacyPolicy: "Integritetspolicy",
    openSource: "Öppen källkod",
    // About page translations
    aboutDescription:
      "En modern, gemenskapsägd, icke-förvaringsbaserad open-source Solana-plånboksapp byggd för integritet, enkelhet och säkerhet.",
    developedBy: "Utvecklad och underhållen av The Stable Foundation.",
    swedish: "Svenska",
    debug: "Debug",
    chat: "Chatt",
    chatAssistantName: "Amethyst",
    chatTagline: "Lär dig hur krypto fungerar. Privat, på din enhet.",
    chatEmptyTitle: "Vad vill du lära dig?",
    chatInputPlaceholder: "Fråga om krypto…",
    chatModelLoading: "Laddar Amethyst…",
    chatModelReady: "På enheten · privat",
    chatModelError: "Modellfel",
    chatModelUnloaded: "Tryck för att börja chatta",
    chatSendError: "Något gick fel. Försök igen.",
    chatClearHistory: "Rensa konversation",
    chatDisclaimer:
      "Amethyst förklarar, men ger inte råd. Inte finansiell rådgivning.",
    chatUnsupportedPlatform:
      "AI-chatt är inte tillgängligt på den här plattformen än.",
    chatSuggestions: [
      "Vad är ett stablecoin?",
      "Hur skyddar jag min plånbok?",
      "Varför behöver jag SOL till avgifter?",
      "Hur fungerar en token-swap?",
    ],
  },
  id: {
    appName: "NotWallet",
    home: "Beranda",
    lessons: "Pelajaran",
    settings: "Pengaturan",
    wallet: "Dompet",
    profile: "Profil",
    welcome: "Selamat datang di NotWallet Crypto!",
    welcomePersonal: (name) => `Selamat datang kembali, ${name}!`,
    homeDesc: "Cara yang menyenangkan untuk belajar bahasa Persia.",
    getStarted: "Mulai Belajar",
    startLesson: "Mulai",

    onboardingCreateWalletTitle: "Buat Dompet",
    onboardingImportWalletTitle: "Impor Dompet",
    onboardingCreatePasswordTitle: "Buat Kata Sandi",
    onboardingDisclaimerTitle: "Disclaimer Penting",
    onboardingDisclaimerDesc1: "Anda akan membuat dompet self-custody.",
    onboardingDisclaimerDesc2:
      "Anda adalah satu-satunya yang mengontrol dompet dan dana Anda.",
    onboardingDisclaimerDesc3:
      "Frasa benih Anda adalah SATU-SATUNYA cara untuk memulihkan dompet dan aset Anda.",
    onboardingDisclaimerDesc4:
      "Jika Anda kehilangan frasa benih, {red}dana Anda tidak dapat dipulihkan.",
    onboardingDisclaimerNonCustodial:
      "Ini adalah dompet non-kustodian. Hanya Anda yang memiliki akses ke kunci privat dan dana Anda.",
    onboardingContinue: "Lanjutkan",
    onboardingUnderstandContinue: "Saya Mengerti, Lanjutkan",
    onboardingSetPasswordDesc:
      "Buat kata sandi yang kuat untuk melindungi dompet Anda.",
    onboardingPasswordRequired:
      "Kata sandi ini diperlukan untuk mengakses dompet Anda di perangkat ini.",
    onboardingPasswordMinLength: "Kata sandi harus minimal 6 karakter.",
    onboardingPasswordMismatch: "Kata sandi tidak cocok.",
    onboardingPasswordFoundTitle: "Kata Sandi Ditemukan",
    onboardingPasswordFoundDesc:
      "Kata sandi sudah ada untuk dompet ini. Apakah Anda ingin menggunakan kata sandi yang ada atau membuat yang baru?",
    onboardingUseExistingPassword: "Gunakan Kata Sandi yang Ada",
    onboardingCreateNewPassword: "Buat Kata Sandi Baru",
    onboardingImportSeedPhraseDesc:
      "Masukkan frasa benih 12 atau 24 kata Anda di bawah untuk mengimpor dompet Anda.",
    onboardingImportWalletButton: "Impor Dompet",
    onboardingImportSuccess: "Impor Berhasil!",
    onboardingImportWarning:
      "Pastikan tidak ada yang melihat layar Anda. Jangan pernah membagikan frasa benih Anda kepada siapa pun.",
    onboardingKeypairsTitle: "Keypair yang Diimpor",
    onboardingNoKeypairs: "Tidak ada keypair ditemukan.",
    onboardingGenerateNewAddress: "Buat Alamat Baru",
    onboardingSavedSeedPhrase: "Saya sudah menyimpan frasa benih saya",
    onboardingImportantDialogTitle: "Penting!",
    onboardingImportantDialogDesc:
      "Frasa benih Anda adalah satu-satunya cara untuk memulihkan dompet Anda. Jika Anda kehilangannya, Anda akan kehilangan akses ke dana Anda selamanya. Pastikan Anda telah menyimpan frasa benih Anda dengan aman sebelum melanjutkan.",
    errorOccurred: "Terjadi kesalahan. Silakan coba lagi.",
    processing: "Memproses...",
    confirm: "Konfirmasi",
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
    tasks: "Tugas",
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
    saved: "Tersimpan",
    usernameSavedSuccessfully: "Nama pengguna berhasil disimpan!",
    oAuthLoginExplanation: "Klaim dengan akun Google kamu",
    googleOAuthLogin: "Masuk dengan Google",
    logout: "Keluar",
    // DAO page translations
    daoTitle: "DAO",
    theStableFoundation: "The Stable Foundation",
    lockedDaoTokens: "Token DAO Terkunci",
    treasury: "Dompet Perbendaharaan",
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
      "Perbendaharaan The Stable Foundation mengenakan biaya 0,25% pada semua transaksi untuk mendukung pengembangan dan pemeliharaan ekosistem NotWallet Crypto.",
    treasuryFundsUsage:
      "Dana ini digunakan untuk pengembangan komunitas, audit keamanan, pemeliharaan infrastruktur, dan inisiatif pertumbuhan ekosistem.",
    markets: "Gabung DAO",
    viewProposals: "Proposal",
    openInRealms: "Lihat semua proposal",
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
    // Learn page translations
    tasksTitle: "Tugas",
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
    // Wallet specific translations
    walletTitle: "Dompet",
    switchKeypairTitle: "Ganti Dompet",
    addressQrCode: "Scan Alamat Dompet",
    noKeypairsFound: "Tidak ada dompet ditemukan",
    noSolWarningTitle: "Tidak ada SOL",
    noSolWarningDescription:
      "Anda memerlukan SOL untuk membayar biaya transaksi di blockchain Solana.",
    account: "Akun",
    active: "Aktif",
    assets: "Aset",
    activity: "Aktivitas",
    transactionHistory: "Riwayat Transaksi",
    viewWalletActivity: "Lihat semua aktivitas dompet di NotWallet web",
    openInSolscan: "Buka di NotWallet web",
    noAssetsFound: "Tidak ada aset ditemukan",
    defaultUsername: "Dompet",
    pleaseSelectUsername: "Silakan masukkan nama pengguna",
    usernameTooLong: "Nama pengguna terlalu panjang (maks 6 karakter)",
    updateUsernameFailed: "Gagal memperbarui nama pengguna",
    editWallet: "Edit Dompet",
    success: "Berhasil!",
    username: "Nama Pengguna",
    maxCharacters: "maks 6 karakter",
    saving: "Menyimpan...",
    pleaseEnterValidAmount: "Silakan masukkan jumlah yang valid",
    pleaseSelectRecipient: "Silakan pilih atau masukkan penerima",
    failedToSendTokens: "Gagal mengirim token",
    transactionCompletedSuccessfully: "Transaksi berhasil diselesaikan!",
    tokenType: "Jenis Token",
    amount: "Jumlah",
    available: "Tersedia",
    recipient: "Penerima",
    enterCustomAddress: "Masukkan alamat khusus",
    recipientAddress: "Alamat Penerima",
    enterRecipientPublicKey: "Masukkan kunci publik penerima",
    customAddress: "Alamat Khusus",
    sending: "Mengirim...",
    failedToGetQuote: "Gagal mendapatkan kutipan swap",
    failedToSwap: "Gagal melakukan swap",
    swapTokens: "Tukar Token",
    swapCompleted: "Swap berhasil diselesaikan!",
    from: "Dari",
    to: "Ke",
    swapTokensTooltip: "Tukar posisi token",
    quoteDetails: "Detail Kutipan",
    outputAmount: "Jumlah Output",
    fee: "Biaya",
    priceImpact: "Dampak Harga",
    route: "Rute",
    direct: "Langsung",
    transactionReady: "Transaksi Siap",
    blockHeight: "Tinggi Blok",
    priorityFee: "Biaya Prioritas",
    computeUnits: "Unit Komputasi",
    finalSlippage: "Slippage Akhir",
    executeSwap: "Jalankan Swap",
    getQuote: "Dapatkan Kutipan",
    insufficientBalance: "Saldo tidak mencukupi",
    sendToken: "Kirim Token",
    simulationWarning: "Peringatan Simulasi",
    buildNewTransaction: "Buat Transaksi Baru",
    slippage: "Slippage",
    slippagePercent: "0,1%",
    buildingTransaction: "Membangun Transaksi...",
    prepareSwap: "Persiapkan Swap",
    toggleLockWallet: "Alihkan kunci dompet",
    walletSettings: "Pengaturan dompet",
    copyPubkey: "Salin kunci publik",
    switchKeypair: "Ganti dompet",
    buySol: "Beli SOL",
    // Common actions
    cancel: "Batal",
    save: "Simpan",
    // Wallet settings translations
    addWallet: "Tambah Dompet",
    createNew: "Buat dompet baru",
    showSeedPhrase: "Tampilkan Frasa Seed",
    viewRecoveryPhrase: "Lihat frasa pemulihan Anda",
    importExisting: "Impor dompet yang ada",
    network: "Jaringan",
    management: "Manajemen Dompet",
    importRecovery: "Impor & Pemulihan",
    destroyWallets: "Hancurkan Dompet",
    destroyAllData: "Ini akan menghapus semua data dompet secara permanen",
    // Security translations
    securityNotice: "Pemberitahuan Keamanan",
    storeOffline: "Simpan frasa seed Anda di lokasi yang aman dan offline",
    // Common UI
    dangerZone: "Zona Berbahaya",
    irreversibleActions:
      "Tindakan yang tidak dapat dibatalkan yang akan menghapus data Anda secara permanen",
    // Finance translations
    send: "Kirim",
    swap: "Tukar",
    balance: "Saldo",
    // Lib components translations
    importSeedPhrase: "Impor Frasa Benih",
    createNewWallet: "Buat Dompet Baru",
    walletLocked: "Dompet Terkunci",
    enterPassword: "Masukkan Kata Sandi",
    incorrectPassword: "Kata sandi salah. Silakan coba lagi.",
    unlockWallet: "Buka Kunci Dompet",
    notwalletCrypto: "NotWallet Crypto",
    createYourWallet: "Buat Dompet Anda",
    // Settings pages translations
    congratulations: "🎉 Selamat! 🎉",
    congratulationsMessage:
      "Anda baru saja menemukan salah satu dari banyak cara untuk mendapatkan airdrop Token BACH. Kirim email ke info@bach.money dengan subjek SETTINGS_EASTER_EGG dan alamat dompet Anda di badan email.",
    gotIt: "Mengerti!",
    stableFoundationCopyright: "© {year} The Stable Foundation",
    easterEggFound: "Easter Egg Ditemukan!",
    easterEggDescription: "Anda menemukan fitur tersembunyi di pengaturan.",
    applicationInformation: "Informasi Aplikasi",
    version: "Versi",
    installationId: "ID Instalasi",
    loading: "Memuat",
    supportNote: "Informasi ini membantu dukungan dan debugging",
    preferences: "Preferensi",
    theme: "Tema",
    chooseAppearance: "Pilih tampilan yang Anda sukai",
    system: "Sistem",
    matchDevice: "Sesuaikan dengan pengaturan perangkat",
    light: "Terang",
    cleanBright: "Antarmuka yang bersih dan cerah",
    dark: "Gelap",
    easyEyes: "Nyaman untuk mata",
    changesApplyImmediately: "Perubahan akan diterapkan segera",
    language: "Bahasa",
    selectLanguage: "Pilih Bahasa",
    english: "Bahasa Inggris",
    indonesian: "Bahasa Indonesia",
    // Common translations
    about: "Tentang",
    appInfo: "Info Aplikasi",
    appPreferences: "Preferensi Aplikasi",
    languagePreferences: "Preferensi Bahasa",
    app: "Aplikasi",
    legalSupport: "Legal & Dukungan",
    termsOfService: "Syarat Layanan",
    privacyPolicy: "Kebijakan Privasi",
    openSource: "Sumber Terbuka",
    // About page translations
    aboutDescription:
      "Aplikasi dompet Solana open-source modern yang dimiliki komunitas, non-custodial yang dibangun untuk privasi, kesederhanaan, dan keamanan.",
    developedBy: "Dikembangkan dan dikelola oleh The Stable Foundation.",
    swedish: "Bahasa Swedia",
    debug: "Debug",
    chat: "Obrolan",
    chatAssistantName: "Amethyst",
    chatTagline: "Pelajari cara kerja kripto. Privat, di perangkatmu.",
    chatEmptyTitle: "Mau belajar apa?",
    chatInputPlaceholder: "Tanya soal kripto…",
    chatModelLoading: "Memuat Amethyst…",
    chatModelReady: "Di perangkat · privat",
    chatModelError: "Model bermasalah",
    chatModelUnloaded: "Ketuk untuk mulai mengobrol",
    chatSendError: "Terjadi kesalahan. Coba lagi.",
    chatClearHistory: "Hapus percakapan",
    chatDisclaimer: "Amethyst menjelaskan, bukan memberi nasihat keuangan.",
    chatUnsupportedPlatform: "AI Chat belum tersedia di platform ini.",
    chatSuggestions: [
      "Apa itu stablecoin?",
      "Bagaimana menjaga dompet tetap aman?",
      "Kenapa perlu SOL untuk biaya?",
      "Bagaimana cara kerja swap token?",
    ],
  },
  fil: {
    appName: "NotWallet",
    home: "Home",
    lessons: "Mga Aralin",
    settings: "Settings",
    wallet: "Wallet",
    profile: "Profile",
    welcome: "Maligayang dating sa NotWallet Crypto!",
    welcomePersonal: (name) => `Mabuhay, ${name}!`,
    homeDesc: "Isang masayang paraan upang matuto ng Persian.",
    getStarted: "Magsimula ng Pag-aaral",
    startLesson: "Simulan",

    onboardingCreateWalletTitle: "Gumawa ng Wallet",
    onboardingImportWalletTitle: "Mag-import ng Wallet",
    onboardingCreatePasswordTitle: "Gumawa ng Password",
    onboardingDisclaimerTitle: "Mahalagang Paalala",
    onboardingDisclaimerDesc1: "Ikaw ay gagawa ng self-custody wallet.",
    onboardingDisclaimerDesc2:
      "Ikaw lang ang may kontrol sa iyong wallet at pondo.",
    onboardingDisclaimerDesc3:
      "Ang iyong seed phrase ay ang TANGING paraan upang mabawi ang iyong wallet at assets.",
    onboardingDisclaimerDesc4:
      "Kung mawala mo ang iyong seed phrase, {red}hindi na maibabalik ang iyong pondo.",
    onboardingDisclaimerNonCustodial:
      "Ito ay non-custodial wallet. Ikaw lang ang may access sa iyong mga private keys at pondo.",
    onboardingContinue: "Magpatuloy",
    onboardingUnderstandContinue: "Nauunawaan Ko, Magpatuloy",
    onboardingSetPasswordDesc:
      "Magtakda ng malakas na password upang protektahan ang iyong wallet.",
    onboardingPasswordRequired:
      "Ang password na ito ay kailangan upang ma-access ang iyong wallet sa device na ito.",
    onboardingPasswordMinLength: "Ang password ay dapat kahit 6 characters.",
    onboardingPasswordMismatch: "Hindi magkatugma ang mga password.",
    onboardingPasswordFoundTitle: "May Nahanap na Password",
    onboardingPasswordFoundDesc:
      "May existing password na para sa wallet na ito. Gusto mo bang gamitin ang existing password o gumawa ng bago?",
    onboardingUseExistingPassword: "Gamitin ang Existing Password",
    onboardingCreateNewPassword: "Gumawa ng Bagong Password",
    onboardingImportSeedPhraseDesc:
      "Ilagay ang iyong 12 o 24-word seed phrase sa ibaba upang i-import ang iyong wallet.",
    onboardingImportWalletButton: "I-import ang Wallet",
    onboardingImportSuccess: "Matagumpay na Na-import!",
    onboardingImportWarning:
      "Siguraduhing walang nakatingin sa iyong screen. Huwag kailanman ibahagi ang iyong seed phrase sa kahit sino.",
    onboardingKeypairsTitle: "Na-import na mga Keypairs",
    onboardingNoKeypairs: "Walang nahanap na keypairs.",
    onboardingGenerateNewAddress: "Gumawa ng Bagong Address",
    onboardingSavedSeedPhrase: "Na-save ko na ang aking seed phrase",
    onboardingImportantDialogTitle: "Mahalaga!",
    onboardingImportantDialogDesc:
      "Ang iyong seed phrase ay ang tanging paraan upang mabawi ang iyong wallet. Kung mawala mo ito, mawawala mo ang access sa iyong pondo magpakailanman. Siguraduhing ligtas na naka-save ang iyong seed phrase bago magpatuloy.",
    errorOccurred: "May error na nangyari. Pakisubukan ulit.",
    processing: "Pinoproseso...",
    confirm: "Kumpirmahin",
    back: "← Bumalik",
    lessonCompleted: "Natapos ang Aralin! 🎉",
    user: "Username",
    guest: "Bisita",
    progress: "Progreso",
    completed: "natapos na aralin",
    question: "Tanong",
    of: "ng",
    afterChoice: "Makikita ang resulta pagkatapos mong pumili.",
    correct: "Tama!",
    incorrect: "Mali!",
    startThisLesson: "Simulan ang Aralin",

    quickActions: "Mabilis na Aksyon",
    dao: "DAO",
    learn: "Matuto",
    tasks: "Mga Gawain",
    activityFeed: "Activity Feed",
    bachAirdropLive: "🪂 BACH Airdrop Live!",
    airdropDescription:
      "Maraming paraan para kumita ng BACH tokens! Kumpletuhin ang mga gawain, mag-contribute sa music database, at lumahok sa ecosystem.",
    claimYourAirdrop: "Kunin ang Iyong Airdrop →",
    claimYourBachAirdrop: "🎉 Kunin ang Iyong $BACH Airdrop!",
    signUpAndClaim: "Mag-sign Up at Kumuha",
    walletAddressUsedAirdrop:
      "Ang iyong wallet address ay gagamitin para sa airdrop.",
    bachMoney: "bach.money",
    successClaimedAirdrop: "🎊 Success! Nakuha mo na ang iyong airdrop.",
    claimAirdrop: "Kunin ang Airdrop",
    signMessageProveOwnership:
      "I-sign ang mensaheng ito upang patunayan ang pagmamay-ari ng wallet at kunin ang iyong airdrop.",
    signing: "Nag-sign...",
    signAndClaim: "Mag-sign at Kumuha",
    signatureOnlyForVerification:
      "Ang iyong signature ay ginagamit lang upang i-verify ang iyong wallet address.",
    tryAgain: "Subukan Ulit",
    setYourUsername: "👤 Itakda ang Iyong Username",
    chooseUsernamePersonalize:
      "Pumili ng username upang i-personalize ang iyong wallet.",
    enterYourUsername: "Ilagay ang iyong username",
    saveUsername: "I-save ang Username",
    saved: "Na-save",
    usernameSavedSuccessfully: "Matagumpay na na-save ang username!",
    oAuthLoginExplanation: "Kumuha gamit ang iyong Google account",
    googleOAuthLogin: "Mag-login gamit ang Google",
    logout: "Mag-log out",

    daoTitle: "DAO",
    theStableFoundation: "The Stable Foundation",
    lockedDaoTokens: "Naka-lock na DAO Tokens",
    treasury: "Treasury Wallet",
    treasuryBalances: "Treasury Balances",
    viewOnExplorer: "Tingnan sa Explorer",
    failedToLoadDaoBalance: "Hindi na-load ang DAO balance",
    failedToLoadTreasuryBalances: "Hindi na-load ang treasury balances",
    retry: "Subukan Ulit",
    locked: "Naka-lock",
    activeProposals: "Mga Active na Proposals",
    noActiveProposals: "Walang active proposals sa ngayon",
    failedToLoadProposals: "Hindi na-load ang mga proposals",
    yesVotes: "Yes Votes",
    noVotes: "No Votes",
    ends: "Magtatapos",
    aboutTreasuryFees: "Tungkol sa Treasury Fees",
    treasuryFeeDescription:
      "Ang Stable Foundation Treasury ay nangongolekta ng 0.25% na bayad sa lahat ng transactions upang suportahan ang development at maintenance ng NotWallet Crypto ecosystem.",
    treasuryFundsUsage:
      "Ang mga pondo ay ginagamit para sa community development, security audits, infrastructure maintenance, at ecosystem growth initiatives.",
    markets: "Sumali sa DAO",
    viewProposals: "Mga Proposals",
    openInRealms: "Tingnan ang lahat ng proposals",

    learnTitle: "Matuto",
    aiAssistant: "AI Assistant",
    aiWelcomeMessage:
      "Hello! Nandito ako para tulungan kang matuto tungkol sa cryptocurrency at The Stable Foundation. Magtanong ka ng kahit ano!",
    askPlaceholder: "Magtanong tungkol sa crypto o The Stable Foundation...",
    thinking: "Nag-iisip...",
    aiDisclaimerMessage:
      "Ito ay demo AI assistant. Ang mga sagot ay simulated para sa educational purposes.",
    frequentlyAskedQuestions: "Mga Madalas Itanong",

    tasksTitle: "Mga Gawain",

    faqWhatIsStableFoundation: "Ano ang The Stable Foundation?",
    faqWhatIsStableFoundationAnswer:
      "Ang The Stable Foundation ay isang decentralized organization na nakatuon sa paglikha ng stable, accessible na financial infrastructure na binuo sa blockchain technology. Ang aming misyon ay magbigay ng transparent, community-driven na financial tools na nagpapalakas sa mga users sa buong mundo.",
    faqWhatIsCryptocurrency: "Ano ang cryptocurrency?",
    faqWhatIsCryptocurrencyAnswer:
      "Ang cryptocurrency ay digital o virtual na uri ng pera na gumagamit ng cryptography para sa seguridad. Umiiral ito nang independent sa traditional banking systems at nagbibigay-daan sa peer-to-peer transactions nang walang intermediaries.",
    faqWhatIsBlockchain: "Ano ang blockchain?",
    faqWhatIsBlockchainAnswer:
      "Ang blockchain ay distributed ledger technology na nag-maintain ng patuloy na lumalaking listahan ng mga records (blocks) na naka-link at secured gamit ang cryptography. Bawat block ay naglalaman ng transaction data, timestamp, at cryptographic hash ng nakaraang block.",
    faqHowToKeepWalletSecure:
      "Paano ko papanatilihing secure ang aking wallet?",
    faqHowToKeepWalletSecureAnswer:
      "Huwag kailanman ibahagi ang iyong private keys o seed phrases sa kahit sino. I-store ang iyong backup phrase sa secure, offline na lokasyon. Gumamit ng malakas na passwords at i-enable ang two-factor authentication kung possible. Laging i-verify ang transaction details bago mag-sign.",
    faqWhatAreTransactionFees: "Ano ang transaction fees?",
    faqWhatAreTransactionFeesAnswer:
      "Ang transaction fees ay maliliit na halaga na binabayaran sa network validators para sa pag-process at pag-confirm ng mga transactions sa blockchain. Ang mga bayad na ito ay tumutulong sa pag-secure ng network at pumipigil sa spam transactions.",
    faqWhatIsDao: "Ano ang DAO?",
    faqWhatIsDaoAnswer:
      "Ang DAO (Decentralized Autonomous Organization) ay isang organisasyon na pinamamahalaan ng smart contracts at community voting sa halip na traditional management structures. Ang mga members ay maaaring mag-propose at bumoto sa mga desisyon na nakakaapekto sa organisasyon.",
    faqHowToParticipateGovernance: "Paano ako makakalahok sa governance?",
    faqHowToParticipateGovernanceAnswer:
      "Makakalahok ka sa governance sa pamamagitan ng paghawak ng governance tokens, pag-review ng mga proposals, at pagboto sa mahahalagang desisyon. Ang active participation ay tumutulong sa paghubog ng future direction ng foundation.",
    faqWhatIsDefi: "Ano ang DeFi?",
    faqWhatIsDefiAnswer:
      "Ang DeFi (Decentralized Finance) ay tumutukoy sa mga financial services na binuo sa blockchain technology na umiiral nang walang traditional intermediaries tulad ng mga bangko. Kabilang dito ang lending, borrowing, trading, at pag-earn ng yield sa digital assets.",

    walletTitle: "Wallet",
    switchKeypairTitle: "Magpalit ng Wallet",
    addressQrCode: "I-scan ang Address",
    noKeypairsFound: "Walang nahanap na wallets",
    noSolWarningTitle: "Walang SOL balance",
    noSolWarningDescription:
      "Kailangan mo ng SOL upang magbayad ng transaction fee sa Solana blockchain.",
    account: "Account",
    active: "Active",
    assets: "Assets",
    activity: "Activity",
    transactionHistory: "Transaction History",
    viewWalletActivity: "Tingnan ang lahat ng wallet activity sa NotWallet web",
    openInSolscan: "Buksan sa NotWallet web",
    noAssetsFound: "Walang nahanap na assets",
    defaultUsername: "Wallet",
    pleaseSelectUsername: "Pakiusap ilagay ang username",
    usernameTooLong: "Masyadong mahaba ang username (max 6 characters)",
    updateUsernameFailed: "Hindi na-update ang username",
    editWallet: "I-edit ang Wallet",
    success: "Success!",
    username: "Username",
    maxCharacters: "max 6 characters",
    saving: "Nag-save...",
    pleaseEnterValidAmount: "Pakiusap ilagay ang valid na amount",
    pleaseSelectRecipient: "Pakiusap pumili o maglagay ng recipient",
    failedToSendTokens: "Hindi naipadala ang mga tokens",
    transactionCompletedSuccessfully:
      "Matagumpay na nakumpleto ang transaction!",
    tokenType: "Token Type",
    amount: "Halaga",
    available: "Available",
    recipient: "Recipient",
    enterCustomAddress: "Maglagay ng custom address",
    recipientAddress: "Recipient Address",
    enterRecipientPublicKey: "Ilagay ang recipient public key",
    customAddress: "Custom Address",
    sending: "Nagpapadala...",
    failedToGetQuote: "Hindi nakuha ang swap quote",
    failedToSwap: "Hindi naisagawa ang swap",
    swapTokens: "Mag-swap ng Tokens",
    swapCompleted: "Matagumpay na nakumpleto ang swap!",
    from: "Mula sa",
    to: "Papunta sa",
    swapTokensTooltip: "I-swap ang token positions",
    quoteDetails: "Quote Details",
    outputAmount: "Output Amount",
    fee: "Bayad",
    priceImpact: "Price Impact",
    route: "Route",
    direct: "Direct",
    transactionReady: "Handa na ang Transaction",
    blockHeight: "Block Height",
    priorityFee: "Priority Fee",
    computeUnits: "Compute Units",
    finalSlippage: "Final Slippage",
    executeSwap: "Isagawa ang Swap",
    getQuote: "Kunin ang Quote",
    insufficientBalance: "Kulang ang balance",
    sendToken: "Magpadala ng Token",
    simulationWarning: "Babala sa Simulation",
    buildNewTransaction: "Gumawa ng Bagong Transaction",
    slippage: "Slippage",
    slippagePercent: "0.1%",
    buildingTransaction: "Ginagawa ang Transaction...",
    prepareSwap: "Ihanda ang Swap",
    toggleLockWallet: "I-toggle ang lock wallet",
    walletSettings: "Wallet settings",
    copyPubkey: "Kopyahin ang public key",
    switchKeypair: "Magpalit ng wallet",
    buySol: "Bumili ng SOL",

    cancel: "Kanselahin",
    save: "I-save",

    addWallet: "Magdagdag ng Wallet",
    createNew: "Gumawa ng bagong wallet",
    showSeedPhrase: "Ipakita ang Seed Phrase",
    viewRecoveryPhrase: "Tingnan ang iyong recovery phrase",
    importExisting: "Mag-import ng existing wallet",
    network: "Network",
    management: "Wallet Management",
    importRecovery: "Import at Recovery",
    destroyWallets: "Sirain ang mga Wallets",
    destroyAllData: "Permanenteng buburahin nito ang lahat ng wallet data",

    securityNotice: "Paalala sa Seguridad",
    storeOffline:
      "I-store ang iyong seed phrase sa secure, offline na lokasyon",

    dangerZone: "Danger Zone",
    irreversibleActions:
      "Mga hindi maibabalik na aksyon na permanenteng magdelete ng iyong data",

    send: "Magpadala",
    swap: "Swap",
    balance: "Balance",

    importSeedPhrase: "Mag-import ng Seed Phrase",
    createNewWallet: "Gumawa ng Bagong Wallet",
    walletLocked: "Naka-lock ang Wallet",
    enterPassword: "Ilagay ang Password",
    incorrectPassword: "Maling password. Pakisubukan ulit.",
    unlockWallet: "I-unlock ang Wallet",
    notwalletCrypto: "NotWallet Crypto",
    createYourWallet: "Gumawa ng Iyong Wallet",

    congratulations: "🎉 Congratulations! 🎉",
    congratulationsMessage:
      "Nahanap mo lang ang isa sa maraming paraan para makakuha ng BACH Token airdrop. Magpadala ng email sa info@bach.money na may subject na SETTINGS_EASTER_EGG at ang iyong wallet address sa email body.",
    gotIt: "Sige!",
    stableFoundationCopyright: "© {year} The Stable Foundation",
    easterEggFound: "Nahanap ang Easter Egg!",
    easterEggDescription: "Natuklasan mo ang nakatagong feature sa settings.",
    applicationInformation: "Impormasyon ng Application",
    version: "Version",
    installationId: "Installation ID",
    loading: "Nag-loload",
    supportNote: "Ang impormasyong ito ay tumutulong sa support at debugging",
    preferences: "Mga Preference",
    theme: "Theme",
    chooseAppearance: "Pumili ng iyong preferred appearance",
    system: "System",
    matchDevice: "Itugma sa iyong device settings",
    light: "Light",
    cleanBright: "Malinis at maliwanag na interface",
    dark: "Dark",
    easyEyes: "Madaling tingnan",
    changesApplyImmediately: "Mag-apply agad ang mga pagbabago",
    language: "Wika",
    selectLanguage: "Pumili ng Wika",
    english: "English",
    indonesian: "Indonesian",

    about: "Tungkol",
    appInfo: "App Info",
    appPreferences: "Mga Preference ng App",
    languagePreferences: "Mga Preference sa Wika",
    app: "App",
    legalSupport: "Legal at Support",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    openSource: "Open Source",

    aboutDescription:
      "Isang modernong, community-owned, non-custodial open-source Solana wallet app na ginawa para sa privacy, simplicity, at security.",
    developedBy: "Developed at maintained ng The Stable Foundation.",
    swedish: "Swedish",
    debug: "Debug",
    chat: "Chat",
    chatAssistantName: "Amethyst",
    chatTagline: "Alamin kung paano gumagana ang crypto. Private, sa device mo.",
    chatEmptyTitle: "Ano ang gusto mong matutunan?",
    chatInputPlaceholder: "Magtanong tungkol sa crypto…",
    chatModelLoading: "Nilo-load si Amethyst…",
    chatModelReady: "Nasa device · private",
    chatModelError: "May error sa model",
    chatModelUnloaded: "I-tap para magsimulang mag-chat",
    chatSendError: "May nangyaring mali. Subukan ulit.",
    chatClearHistory: "I-clear ang usapan",
    chatDisclaimer:
      "Nagpapaliwanag si Amethyst — hindi ito financial advice.",
    chatUnsupportedPlatform:
      "Hindi pa available ang AI Chat sa platform na ito.",
    chatSuggestions: [
      "Ano ang stablecoin?",
      "Paano ko poprotektahan ang wallet ko?",
      "Bakit kailangan ng SOL para sa fees?",
      "Paano gumagana ang token swap?",
    ],
  },
  ar: {
    appName: "NotWallet",
    home: "الرئيسية",
    lessons: "الدروس",
    settings: "الإعدادات",
    wallet: "المحفظة",
    profile: "الملف الشخصي",
    welcome: "مرحباً بك في NotWallet Crypto!",
    welcomePersonal: (name) => `مرحباً بعودتك، ${name}!`,
    homeDesc: "طريقة ممتعة لتعلم الفارسية.",
    getStarted: "ابدأ التعلم",
    startLesson: "ابدأ",

    onboardingCreateWalletTitle: "إنشاء محفظة",
    onboardingImportWalletTitle: "استيراد محفظة",
    onboardingCreatePasswordTitle: "إنشاء كلمة مرور",
    onboardingDisclaimerTitle: "إخلاء مسؤولية مهم",
    onboardingDisclaimerDesc1: "أنت على وشك إنشاء محفظة حفظ ذاتي.",
    onboardingDisclaimerDesc2: "أنت الوحيد الذي يتحكم في محفظتك وأموالك.",
    onboardingDisclaimerDesc3:
      "عبارة الاسترداد الخاصة بك هي الطريقة الوحيدة لاستعادة محفظتك وأصولك.",
    onboardingDisclaimerDesc4:
      "إذا فقدت عبارة الاسترداد، {red}لا يمكن استرداد أموالك.",
    onboardingDisclaimerNonCustodial:
      "هذه محفظة غير احتجازية. أنت وحدك من لديه حق الوصول إلى مفاتيحك الخاصة وأموالك.",
    onboardingContinue: "متابعة",
    onboardingUnderstandContinue: "أفهم، تابع",
    onboardingSetPasswordDesc: "حدد كلمة مرور قوية لحماية محفظتك.",
    onboardingPasswordRequired:
      "ستكون هذه كلمة المرور مطلوبة للوصول إلى محفظتك على هذا الجهاز.",
    onboardingPasswordMinLength: "يجب أن تكون كلمة المرور 6 أحرف على الأقل.",
    onboardingPasswordMismatch: "كلمات المرور غير متطابقة.",
    onboardingPasswordFoundTitle: "تم العثور على كلمة مرور",
    onboardingPasswordFoundDesc:
      "توجد كلمة مرور بالفعل لهذه المحفظة. هل تريد استخدام كلمة المرور الحالية أو إنشاء واحدة جديدة؟",
    onboardingUseExistingPassword: "استخدم كلمة المرور الحالية",
    onboardingCreateNewPassword: "إنشاء كلمة مرور جديدة",
    onboardingImportSeedPhraseDesc:
      "أدخل عبارة الاسترداد المكونة من 12 أو 24 كلمة أدناه لاستيراد محفظتك.",
    onboardingImportWalletButton: "استيراد المحفظة",
    onboardingImportSuccess: "تم الاستيراد بنجاح!",
    onboardingImportWarning:
      "تأكد من أن لا أحد يشاهد شاشتك. لا تشارك عبارة الاسترداد الخاصة بك مع أي شخص.",
    onboardingKeypairsTitle: "أزواج المفاتيح المستوردة",
    onboardingNoKeypairs: "لم يتم العثور على أزواج مفاتيح.",
    onboardingGenerateNewAddress: "إنشاء عنوان جديد",
    onboardingSavedSeedPhrase: "لقد حفظت عبارة الاسترداد الخاصة بي",
    onboardingImportantDialogTitle: "مهم!",
    onboardingImportantDialogDesc:
      "عبارة الاسترداد الخاصة بك هي الطريقة الوحيدة لاستعادة محفظتك. إذا فقدتها، ستفقد الوصول إلى أموالك إلى الأبد. تأكد من حفظ عبارة الاسترداد بشكل آمن قبل المتابعة.",
    errorOccurred: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    processing: "جارٍ المعالجة...",
    confirm: "تأكيد",
    back: "← رجوع",
    lessonCompleted: "اكتمل الدرس! 🎉",
    user: "اسم المستخدم",
    guest: "ضيف",
    progress: "التقدم",
    completed: "درس مكتمل",
    question: "سؤال",
    of: "من",
    afterChoice: "ستظهر النتيجة بعد اختيارك.",
    correct: "صحيح!",
    incorrect: "خطأ!",
    startThisLesson: "ابدأ الدرس",

    quickActions: "إجراءات سريعة",
    dao: "DAO",
    learn: "تعلم",
    tasks: "المهام",
    activityFeed: "موجز النشاط",
    bachAirdropLive: "🪂 إسقاط BACH الجوي مباشر!",
    airdropDescription:
      "طرق متعددة لكسب رموز BACH الخاصة بك! أكمل المهام، ساهم في قاعدة بيانات الموسيقى، وشارك في النظام البيئي.",
    claimYourAirdrop: "احصل على الإسقاط الجوي الخاص بك →",
    claimYourBachAirdrop: "🎉 احصل على إسقاط $BACH الجوي!",
    signUpAndClaim: "سجل واحصل",
    walletAddressUsedAirdrop: "سيتم استخدام عنوان محفظتك للإسقاط الجوي.",
    bachMoney: "bach.money",
    successClaimedAirdrop: "🎊 نجاح! لقد حصلت على الإسقاط الجوي الخاص بك.",
    claimAirdrop: "احصل على الإسقاط الجوي",
    signMessageProveOwnership:
      "وقع على هذه الرسالة لإثبات ملكية المحفظة والحصول على الإسقاط الجوي الخاص بك.",
    signing: "جارٍ التوقيع...",
    signAndClaim: "وقع واحصل",
    signatureOnlyForVerification:
      "يتم استخدام توقيعك فقط للتحقق من عنوان محفظتك.",
    tryAgain: "حاول مرة أخرى",
    setYourUsername: "👤 حدد اسم المستخدم الخاص بك",
    chooseUsernamePersonalize: "اختر اسم مستخدم لتخصيص محفظتك.",
    enterYourUsername: "أدخل اسم المستخدم الخاص بك",
    saveUsername: "حفظ اسم المستخدم",
    saved: "تم الحفظ",
    usernameSavedSuccessfully: "تم حفظ اسم المستخدم بنجاح!",
    oAuthLoginExplanation: "احصل باستخدام حساب Google الخاص بك",
    googleOAuthLogin: "تسجيل الدخول باستخدام Google",
    logout: "تسجيل الخروج",

    daoTitle: "DAO",
    theStableFoundation: "The Stable Foundation",
    lockedDaoTokens: "رموز DAO المقفلة",
    treasury: "محفظة الخزينة",
    treasuryBalances: "أرصدة الخزينة",
    viewOnExplorer: "عرض في المستكشف",
    failedToLoadDaoBalance: "فشل تحميل رصيد DAO",
    failedToLoadTreasuryBalances: "فشل تحميل أرصدة الخزينة",
    retry: "إعادة المحاولة",
    locked: "مقفل",
    activeProposals: "المقترحات النشطة",
    noActiveProposals: "لا توجد مقترحات نشطة في الوقت الحالي",
    failedToLoadProposals: "فشل تحميل المقترحات",
    yesVotes: "أصوات نعم",
    noVotes: "أصوات لا",
    ends: "ينتهي",
    aboutTreasuryFees: "حول رسوم الخزينة",
    treasuryFeeDescription:
      "تجمع خزينة The Stable Foundation رسوماً بنسبة 0.25% على جميع المعاملات لدعم تطوير وصيانة نظام NotWallet Crypto البيئي.",
    treasuryFundsUsage:
      "تُستخدم هذه الأموال لتطوير المجتمع وعمليات التدقيق الأمني وصيانة البنية التحتية ومبادرات نمو النظام البيئي.",
    markets: "انضم إلى DAO",
    viewProposals: "المقترحات",
    openInRealms: "عرض جميع المقترحات",

    learnTitle: "تعلم",
    aiAssistant: "مساعد الذكاء الاصطناعي",
    aiWelcomeMessage:
      "مرحباً! أنا هنا لمساعدتك في التعرف على العملات الرقمية وThe Stable Foundation. اسألني أي شيء!",
    askPlaceholder: "اسألني عن العملات الرقمية أو The Stable Foundation...",
    thinking: "جارٍ التفكير...",
    aiDisclaimerMessage:
      "هذا مساعد ذكاء اصطناعي تجريبي. الإجابات محاكاة لأغراض تعليمية.",
    frequentlyAskedQuestions: "الأسئلة الشائعة",

    tasksTitle: "المهام",

    faqWhatIsStableFoundation: "ما هي The Stable Foundation؟",
    faqWhatIsStableFoundationAnswer:
      "The Stable Foundation هي منظمة لامركزية تركز على إنشاء بنية تحتية مالية مستقرة ويمكن الوصول إليها مبنية على تقنية البلوكتشين. مهمتنا هي توفير أدوات مالية شفافة يقودها المجتمع تمكّن المستخدمين في جميع أنحاء العالم.",
    faqWhatIsCryptocurrency: "ما هي العملة الرقمية؟",
    faqWhatIsCryptocurrencyAnswer:
      "العملة الرقمية هي شكل رقمي أو افتراضي من العملة يستخدم التشفير للأمان. تعمل بشكل مستقل عن الأنظمة المصرفية التقليدية وتتيح المعاملات من نظير إلى نظير دون وسطاء.",
    faqWhatIsBlockchain: "ما هو البلوكتشين؟",
    faqWhatIsBlockchainAnswer:
      "البلوكتشين هو تقنية دفتر الأستاذ الموزع التي تحتفظ بقائمة متزايدة باستمرار من السجلات (الكتل) المرتبطة والمؤمنة باستخدام التشفير. تحتوي كل كتلة على بيانات المعاملات وطابع زمني وتجزئة تشفيرية للكتلة السابقة.",
    faqHowToKeepWalletSecure: "كيف أحافظ على أمان محفظتي؟",
    faqHowToKeepWalletSecureAnswer:
      "لا تشارك أبداً مفاتيحك الخاصة أو عبارات الاسترداد مع أي شخص. قم بتخزين عبارة النسخ الاحتياطي في موقع آمن وغير متصل بالإنترنت. استخدم كلمات مرور قوية وفعّل المصادقة الثنائية عند الإمكان. تحقق دائماً من تفاصيل المعاملة قبل التوقيع.",
    faqWhatAreTransactionFees: "ما هي رسوم المعاملات؟",
    faqWhatAreTransactionFeesAnswer:
      "رسوم المعاملات هي مبالغ صغيرة تُدفع لمدققي الشبكة لمعالجة وتأكيد المعاملات على البلوكتشين. تساعد هذه الرسوم في تأمين الشبكة ومنع المعاملات العشوائية.",
    faqWhatIsDao: "ما هو DAO؟",
    faqWhatIsDaoAnswer:
      "DAO (المنظمة المستقلة اللامركزية) هي منظمة يحكمها العقود الذكية والتصويت المجتمعي بدلاً من هياكل الإدارة التقليدية. يمكن للأعضاء اقتراح والتصويت على القرارات التي تؤثر على المنظمة.",
    faqHowToParticipateGovernance: "كيف أشارك في الحوكمة؟",
    faqHowToParticipateGovernanceAnswer:
      "يمكنك المشاركة في الحوكمة من خلال الاحتفاظ برموز الحوكمة ومراجعة المقترحات والتصويت على القرارات المهمة. المشاركة النشطة تساعد في تشكيل الاتجاه المستقبلي للمؤسسة.",
    faqWhatIsDefi: "ما هو DeFi؟",
    faqWhatIsDefiAnswer:
      "DeFi (التمويل اللامركزي) يشير إلى الخدمات المالية المبنية على تقنية البلوكتشين التي تعمل دون وسطاء تقليديين مثل البنوك. يشمل ذلك الإقراض والاقتراض والتداول وكسب العائد على الأصول الرقمية.",

    walletTitle: "المحفظة",
    switchKeypairTitle: "تبديل المحفظة",
    addressQrCode: "مسح العنوان",
    noKeypairsFound: "لم يتم العثور على محافظ",
    noSolWarningTitle: "لا يوجد رصيد SOL",
    noSolWarningDescription:
      "أنت بحاجة إلى SOL لدفع رسوم المعاملات في بلوكتشين سولانا.",
    account: "الحساب",
    active: "نشط",
    assets: "الأصول",
    activity: "النشاط",
    transactionHistory: "سجل المعاملات",
    viewWalletActivity: "عرض جميع أنشطة المحفظة على NotWallet web",
    openInSolscan: "فتح في NotWallet web",
    noAssetsFound: "لم يتم العثور على أصول",
    defaultUsername: "محفظة",
    pleaseSelectUsername: "الرجاء إدخال اسم مستخدم",
    usernameTooLong: "اسم المستخدم طويل جداً (الحد الأقصى 6 أحرف)",
    updateUsernameFailed: "فشل تحديث اسم المستخدم",
    editWallet: "تحرير المحفظة",
    success: "نجاح!",
    username: "اسم المستخدم",
    maxCharacters: "حد أقصى 6 أحرف",
    saving: "جارٍ الحفظ...",
    pleaseEnterValidAmount: "الرجاء إدخال مبلغ صالح",
    pleaseSelectRecipient: "الرجاء اختيار أو إدخال مستلم",
    failedToSendTokens: "فشل إرسال الرموز",
    transactionCompletedSuccessfully: "اكتملت المعاملة بنجاح!",
    tokenType: "نوع الرمز",
    amount: "المبلغ",
    available: "متاح",
    recipient: "المستلم",
    enterCustomAddress: "إدخال عنوان مخصص",
    recipientAddress: "عنوان المستلم",
    enterRecipientPublicKey: "أدخل المفتاح العام للمستلم",
    customAddress: "عنوان مخصص",
    sending: "جارٍ الإرسال...",
    failedToGetQuote: "فشل الحصول على عرض التبديل",
    failedToSwap: "فشل تنفيذ التبديل",
    swapTokens: "تبديل الرموز",
    swapCompleted: "اكتمل التبديل بنجاح!",
    from: "من",
    to: "إلى",
    swapTokensTooltip: "تبديل مواضع الرموز",
    quoteDetails: "تفاصيل العرض",
    outputAmount: "مبلغ الناتج",
    fee: "الرسوم",
    priceImpact: "تأثير السعر",
    route: "المسار",
    direct: "مباشر",
    transactionReady: "المعاملة جاهزة",
    blockHeight: "ارتفاع الكتلة",
    priorityFee: "رسوم الأولوية",
    computeUnits: "وحدات الحوسبة",
    finalSlippage: "الانزلاق النهائي",
    executeSwap: "تنفيذ التبديل",
    getQuote: "احصل على عرض",
    insufficientBalance: "رصيد غير كافٍ",
    sendToken: "إرسال رمز",
    simulationWarning: "تحذير المحاكاة",
    buildNewTransaction: "إنشاء معاملة جديدة",
    slippage: "الانزلاق",
    slippagePercent: "0.1%",
    buildingTransaction: "جارٍ إنشاء المعاملة...",
    prepareSwap: "تحضير التبديل",
    toggleLockWallet: "تبديل قفل المحفظة",
    walletSettings: "إعدادات المحفظة",
    copyPubkey: "نسخ المفتاح العام",
    switchKeypair: "تبديل المحفظة",
    buySol: "شراء SOL",

    cancel: "إلغاء",
    save: "حفظ",

    addWallet: "إضافة محفظة",
    createNew: "إنشاء محفظة جديدة",
    showSeedPhrase: "إظهار عبارة الاسترداد",
    viewRecoveryPhrase: "عرض عبارة الاسترداد الخاصة بك",
    importExisting: "استيراد محفظة موجودة",
    network: "الشبكة",
    management: "إدارة المحفظة",
    importRecovery: "الاستيراد والاسترداد",
    destroyWallets: "إتلاف المحافظ",
    destroyAllData: "سيؤدي هذا إلى حذف جميع بيانات المحفظة نهائياً",

    securityNotice: "إشعار أمني",
    storeOffline:
      "احفظ عبارة الاسترداد الخاصة بك في موقع آمن وغير متصل بالإنترنت",

    dangerZone: "منطقة الخطر",
    irreversibleActions: "إجراءات لا رجعة فيها ستحذف بياناتك نهائياً",

    send: "إرسال",
    swap: "تبديل",
    balance: "الرصيد",

    importSeedPhrase: "استيراد عبارة الاسترداد",
    createNewWallet: "إنشاء محفظة جديدة",
    walletLocked: "المحفظة مقفلة",
    enterPassword: "أدخل كلمة المرور",
    incorrectPassword: "كلمة مرور غير صحيحة. يرجى المحاولة مرة أخرى.",
    unlockWallet: "فتح المحفظة",
    notwalletCrypto: "NotWallet Crypto",
    createYourWallet: "إنشاء محفظتك",

    congratulations: "🎉 تهانينا! 🎉",
    congratulationsMessage:
      "لقد وجدت للتو إحدى الطرق العديدة للحصول على إسقاط رمز BACH الجوي. أرسل بريداً إلكترونياً إلى info@bach.money مع الموضوع SETTINGS_EASTER_EGG وعنوان محفظتك في نص البريد الإلكتروني.",
    gotIt: "فهمت!",
    stableFoundationCopyright: "© {year} The Stable Foundation",
    easterEggFound: "تم العثور على بيضة عيد الفصح!",
    easterEggDescription: "اكتشفت ميزة مخفية في الإعدادات.",
    applicationInformation: "معلومات التطبيق",
    version: "الإصدار",
    installationId: "معرّف التثبيت",
    loading: "جارٍ التحميل",
    supportNote: "تساعد هذه المعلومات في الدعم وتصحيح الأخطاء",
    preferences: "التفضيلات",
    theme: "المظهر",
    chooseAppearance: "اختر المظهر المفضل لديك",
    system: "النظام",
    matchDevice: "مطابقة إعدادات جهازك",
    light: "فاتح",
    cleanBright: "واجهة نظيفة ومشرقة",
    dark: "داكن",
    easyEyes: "مريح للعينين",
    changesApplyImmediately: "سيتم تطبيق التغييرات على الفور",
    language: "اللغة",
    selectLanguage: "اختر اللغة",
    english: "الإنجليزية",
    indonesian: "الإندونيسية",

    about: "حول",
    appInfo: "معلومات التطبيق",
    appPreferences: "تفضيلات التطبيق",
    languagePreferences: "تفضيلات اللغة",
    app: "التطبيق",
    legalSupport: "القانونية والدعم",
    termsOfService: "شروط الخدمة",
    privacyPolicy: "سياسة الخصوصية",
    openSource: "مفتوح المصدر",

    aboutDescription:
      "تطبيق محفظة سولانا حديث مملوك للمجتمع وغير احتجازي ومفتوح المصدر مصمم للخصوصية والبساطة والأمان.",
    developedBy: "تم تطويره وصيانته بواسطة The Stable Foundation.",
    swedish: "السويدية",
    debug: "تصحيح الأخطاء",
    chat: "الدردشة",
    chatAssistantName: "أميثيست",
    chatTagline: "تعلّم كيف تعمل العملات الرقمية. بخصوصية، على جهازك.",
    chatEmptyTitle: "ماذا تريد أن تتعلم؟",
    chatInputPlaceholder: "اسأل عن العملات الرقمية…",
    chatModelLoading: "جارٍ تحميل أميثيست…",
    chatModelReady: "على الجهاز · خاص",
    chatModelError: "خطأ في النموذج",
    chatModelUnloaded: "اضغط لبدء الدردشة",
    chatSendError: "حدث خطأ ما. حاول مرة أخرى.",
    chatClearHistory: "مسح المحادثة",
    chatDisclaimer: "أميثيست يشرح ولا يقدّم نصيحة مالية.",
    chatUnsupportedPlatform: "الدردشة الذكية غير متاحة على هذه المنصة بعد.",
    chatSuggestions: [
      "ما هي العملة المستقرة؟",
      "كيف أحمي محفظتي؟",
      "لماذا أحتاج SOL لدفع الرسوم؟",
      "كيف تعمل مبادلة العملات؟",
    ],
  },
};
