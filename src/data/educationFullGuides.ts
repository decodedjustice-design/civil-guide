import type { EducationalGuide } from "./educationalGuides";

/**
 * Full educational guides for the 8 categories not yet covered
 * in educationalGuides.ts (housing + cps_dcyf already exist there).
 */
export const additionalEducationalGuides: EducationalGuide[] = [
  // ===== POLICE ENCOUNTERS =====
  {
    id: "police-full-guide",
    systemId: "police",
    title: "Understanding Police Encounters",
    readTime: "15 min read",

    beforeYouStart: {
      grounding:
        "Encounters with police — whether expected or not — can be frightening, confusing, and deeply stressful. Whatever brought you here, your need to understand is valid. Many people experience these situations and feel unsure about what happened or what they could have done.",
      consent:
        "You don't have to read all of this right now. Bookmark it, come back later, or read one section at a time. Understanding your rights is a process, not a test.",
    },

    whatThisSystemIs: {
      description:
        "Law enforcement agencies — police departments, sheriff's offices, state patrol — are government bodies authorized to enforce laws, investigate crimes, and maintain order. They operate under constitutional limits, but officers have significant discretion in how they apply their authority day to day.",
      whoRunsIt:
        "Officers make immediate decisions on the street. Supervisors review conduct internally. Prosecutors decide whether to press charges. Courts determine legality of stops, searches, and arrests. Civilian oversight boards and internal affairs units review complaints.",
      whatItControls:
        "The system controls who gets stopped, searched, arrested, and charged. It does not control court outcomes, and officers cannot determine guilt. Only courts and juries can do that.",
    },

    whyConfusing: {
      explanation:
        "Police encounters are confusing because they happen fast, involve authority, and rarely come with explanation. You may not know why you were stopped, what you're required to do, or what your options are — and that uncertainty is by design, not by accident.",
      structuralReasons: [
        "Officers are not required to explain all your rights during a stop",
        "The rules change depending on whether you're being detained, arrested, or are free to go",
        "Fear and adrenaline make it hard to think clearly in the moment",
        "What's legal and what's ethical are often different things",
        "Officers may present requests as commands",
        "Consequences for asserting rights can feel risky even when lawful",
      ],
    },

    whatUsuallyHappens: [
      "An officer initiates contact — during a stop, at your door, or on the street",
      "You may feel pressure to comply immediately with everything asked",
      "The officer may ask questions, request ID, or ask to search",
      "If you're detained, you're told (or not told) you're not free to leave",
      "If arrested, you're taken into custody and may be booked",
      "Afterward, you may feel confused about what happened and what your options are",
      "Documentation becomes critical — but most people don't think about it until later",
    ],

    successReframe: {
      reality:
        "Success in police encounters doesn't mean winning an argument with an officer. It usually means staying safe, preserving your rights for later, and documenting what happened so you have options afterward.",
      examples: [
        "Staying calm and surviving the encounter physically unharmed",
        "Clearly stating 'I do not consent to a search' on the record",
        "Getting badge numbers, car numbers, and witness contacts afterward",
        "Filing a complaint that creates an official record",
        "Having evidence suppressed in court because of an illegal search",
        "Receiving accountability through a civilian oversight process",
      ],
    },

    internalKnowledge: {
      explanation:
        "Officers have access to systems and information you don't see. Understanding what they track can help you think more clearly about your situation.",
      examples: [
        "Officers run your information through databases during stops (warrants, prior contacts)",
        "Body cameras may or may not be recording — policies vary",
        "Dispatch records document what the officer reported before and during the encounter",
        "Officers' reports are written after the encounter and may differ from what happened",
        "Internal complaint files may show patterns of behavior by the same officer",
        "Use of force reports are filed internally but can be requested through public records",
      ],
    },

    misunderstandings: {
      traps: [
        "That you have to answer all questions — you have the right to remain silent",
        "That officers always need a warrant to search — there are exceptions (consent, plain view, incident to arrest)",
        "That recording police is illegal — it's protected by the First Amendment in public",
        "That cooperating always helps — it can, but consenting to searches waives protections",
        "That the encounter is the trial — it's not; courts evaluate legality later",
        "That officers must read you Miranda rights at arrest — only required before custodial interrogation",
        "That nothing can be done afterward — complaints, lawsuits, and oversight processes exist",
      ],
    },

    whatMatters: [
      "Your physical safety is the first priority during any encounter",
      "Stating clearly (but calmly) that you do not consent to searches",
      "Asking 'Am I free to leave?' to establish whether you're being detained",
      "Writing down everything as soon as safely possible afterward",
      "Getting names, badge numbers, and vehicle numbers",
      "Identifying witnesses and getting their contact information",
      "Preserving any recordings, photos, or physical evidence",
    ],

    safeSteps: [
      "Stay as calm as possible — your safety comes first",
      "Keep your hands visible and avoid sudden movements",
      "You can say: 'I am choosing to remain silent' and 'I do not consent to a search'",
      "If arrested, say: 'I want a lawyer' and then stop talking",
      "As soon as it's safe, write down everything you remember — times, words, actions",
      "Take photos of any injuries, damage, or the scene if safe",
      "Contact a legal aid organization or civil rights attorney to discuss your options",
    ],

    escalation: {
      explanation:
        "Escalation doesn't mean confrontation with police. It means activating formal systems — complaints, oversight, legal processes — after the encounter is over and you're safe.",
      signs: [
        "You were searched without consent and without a warrant",
        "Force was used that seemed excessive or unnecessary",
        "You were detained for an extended time without explanation",
        "You believe you were stopped because of your race, ethnicity, or appearance",
        "The officer's report doesn't match what actually happened",
        "You were retaliated against for recording or asking questions",
      ],
    },

    closing: {
      reassurance:
        "However you responded during a police encounter — whether you froze, complied, argued, or said nothing — your rights still exist. What happened in the moment does not define your options going forward. Take time to process. Seek support. And know that understanding is a form of power.",
    },

    sources: [
      { label: "ACLU - Know Your Rights: Stopped by Police", url: "https://www.aclu.org/know-your-rights/stopped-by-police", type: "official" },
      { label: "Washington State Criminal Justice Training Commission", url: "https://www.cjtc.wa.gov/", type: "agency" },
      { label: "National Police Accountability Project", url: "https://www.nlg-npap.org/", type: "oversight" },
      { label: "Flex Your Rights", url: "https://www.flexyourrights.org/", type: "official" },
    ],
  },

  // ===== TRAFFIC STOPS =====
  {
    id: "traffic-stops-full-guide",
    systemId: "traffic",
    title: "Understanding Traffic Stops",
    readTime: "12 min read",

    beforeYouStart: {
      grounding:
        "Traffic stops are one of the most common interactions people have with law enforcement. They can feel routine or terrifying depending on your experience and background. Either response is valid.",
      consent:
        "This guide exists to help you understand the process — not to tell you what to do in the moment. Read at your own pace.",
    },

    whatThisSystemIs: {
      description:
        "Traffic stops are initiated by law enforcement when an officer believes a traffic violation has occurred or has reasonable suspicion of criminal activity. They are governed by the Fourth Amendment and state traffic laws.",
      whoRunsIt:
        "The officer on the scene has significant discretion — they decide whether to issue a warning, citation, or escalate. Their supervisor may review. Courts handle contested tickets and any resulting charges.",
      whatItControls:
        "The stop itself is brief, but it can lead to citations, vehicle searches, arrests, or impoundment. The officer's observations during the stop can become evidence.",
    },

    whyConfusing: {
      explanation:
        "Traffic stops are confusing because they blur the line between routine and serious. You may not know why you were stopped, whether you're being detained, or what you're required to do versus what's optional.",
      structuralReasons: [
        "Officers may not immediately explain the reason for the stop",
        "Requests to search can sound like orders",
        "The rules about passengers' rights are different from the driver's",
        "Some states require you to identify yourself; others don't",
        "The interaction can escalate quickly based on the officer's perception",
        "Racial profiling makes some communities more vulnerable during stops",
      ],
    },

    whatUsuallyHappens: [
      "You see lights in your mirror and pull over safely",
      "The officer approaches and asks for license, registration, and sometimes insurance",
      "The officer may ask questions about where you're going or what you're doing",
      "The officer runs your information through databases",
      "You may receive a warning, citation, or be asked to step out of the vehicle",
      "In some cases, the officer may ask to search your vehicle",
      "The stop ends and you either continue driving or deal with next steps (court date, etc.)",
    ],

    successReframe: {
      reality:
        "Success during a traffic stop means staying safe and preserving your rights for later. It doesn't mean winning an argument on the side of the road.",
      examples: [
        "Remaining calm and getting through the stop safely",
        "Politely declining consent to search ('I don't consent to searches')",
        "Noting the officer's name, badge number, and patrol car number",
        "Contesting a ticket in court and having it dismissed",
        "Filing a complaint about a stop that appeared to be based on profiling",
      ],
    },

    internalKnowledge: {
      explanation:
        "Officers have access to real-time information during stops that you don't see.",
      examples: [
        "They run your plates before approaching your car",
        "Database checks show warrants, prior stops, and vehicle ownership",
        "Dash cameras and body cameras may or may not be recording",
        "Officers are trained to observe nervousness, which they may interpret as suspicion",
        "Drug detection dogs can be called but must arrive without unreasonably extending the stop",
        "The officer's written report becomes the official version of events",
      ],
    },

    misunderstandings: {
      traps: [
        "That you must answer all questions — you only need to provide ID documents in most states",
        "That officers need your permission to look through car windows — they can observe anything in plain view",
        "That refusing a search makes you look guilty — it's a constitutional right",
        "That passengers have no rights — passengers can ask if they're free to leave",
        "That the officer's word is final — you can contest citations and file complaints",
        "That traffic stops are always about traffic — pretextual stops are legal but challengeable",
      ],
    },

    whatMatters: [
      "Keeping your hands visible and staying calm",
      "Providing required documents (license, registration)",
      "Clearly stating if you don't consent to a search",
      "Noting details about the stop immediately afterward",
      "Understanding the difference between a warning, citation, and arrest",
      "Knowing your court date and responding to citations",
    ],

    safeSteps: [
      "Pull over safely, turn off the engine, and turn on interior lights if it's dark",
      "Keep your hands on the steering wheel until the officer approaches",
      "Provide your license and registration when asked",
      "You can say: 'I prefer not to answer questions' and 'I don't consent to searches'",
      "Don't argue on the roadside — save your arguments for court",
      "Write down everything you remember as soon as the stop is over",
      "If you believe the stop was unlawful, contact a legal aid organization",
    ],

    escalation: {
      explanation:
        "Escalation after a traffic stop means using formal channels — not arguing during the stop itself.",
      signs: [
        "You believe you were stopped because of your race or appearance",
        "The stop lasted unreasonably long without explanation",
        "The officer searched your vehicle without consent or probable cause",
        "You were asked to exit the vehicle without clear justification",
        "Force was used during a routine traffic stop",
        "Your vehicle was impounded without proper procedure",
      ],
    },

    closing: {
      reassurance:
        "Traffic stops are brief but powerful interactions. How you felt during the stop — scared, confused, angry — is normal. Your rights don't disappear because the moment was stressful. Understanding what happened and what your options are is always a worthwhile step.",
    },

    sources: [
      { label: "ACLU - Know Your Rights: Stopped by Police", url: "https://www.aclu.org/know-your-rights/stopped-by-police", type: "official" },
      { label: "NHTSA - Traffic Safety", url: "https://www.nhtsa.gov/", type: "agency" },
      { label: "Flex Your Rights - Traffic Stops", url: "https://www.flexyourrights.org/faqs/when-can-police-search-your-car/", type: "official" },
    ],
  },

  // ===== COURTS =====
  {
    id: "courts-full-guide",
    systemId: "courts",
    title: "Understanding Courts & the Judicial Process",
    readTime: "16 min read",

    beforeYouStart: {
      grounding:
        "Facing a court process — whether you chose it or it was forced on you — can feel overwhelming. The language is unfamiliar, the stakes feel high, and the system wasn't designed with your comfort in mind. Whatever you're feeling right now is understandable.",
      consent:
        "You don't have to absorb everything at once. Focus on the section most relevant to your situation and come back for the rest when you're ready.",
    },

    whatThisSystemIs: {
      description:
        "Courts are where legal disputes are formally decided by judges (and sometimes juries). Different courts handle different matters: criminal, civil, family, small claims, traffic, and more. Each has its own procedures, forms, and expectations.",
      whoRunsIt:
        "Judges make rulings based on law and evidence. Attorneys advocate for their clients. Court clerks manage filings and scheduling. Prosecutors represent the state in criminal cases. In civil cases, parties represent their own interests.",
      whatItControls:
        "Courts control legal outcomes — who owes what, who has custody, who goes to jail, whether an eviction proceeds. Courts also interpret laws and set precedent for future cases.",
    },

    whyConfusing: {
      explanation:
        "Courts are confusing because they have their own language, unwritten customs, and procedures that assume you already know how things work. Pro se (self-represented) parties often feel at a disadvantage because the system wasn't designed for non-lawyers.",
      structuralReasons: [
        "Legal terminology creates barriers to understanding",
        "Different courts have different rules and different forms",
        "Deadlines are strict and missing them can be devastating",
        "The other side may have a lawyer when you don't",
        "Judges have limited time and can't explain everything",
        "Court culture includes unwritten norms about behavior and dress",
      ],
    },

    whatUsuallyHappens: [
      "A case is initiated — someone files a complaint, petition, or charge",
      "The other party is served (officially notified) and must respond within a deadline",
      "If the response deadline is missed, a default judgment may be entered",
      "Both sides exchange information (discovery in civil cases)",
      "Hearings, motions, and conferences happen along the way",
      "The case may settle, go to trial, or be resolved through a ruling",
      "After a ruling, there may be options to appeal",
    ],

    successReframe: {
      reality:
        "Success in court doesn't always mean 'winning everything.' It often means protecting what matters most, buying time, reaching a reasonable settlement, or having your voice heard in the record.",
      examples: [
        "Getting a case dismissed on procedural grounds",
        "Negotiating a settlement that avoids trial",
        "Reducing the severity of a judgment or sentence",
        "Successfully representing yourself in small claims court",
        "Having key evidence admitted that changes the outcome",
        "Filing an appeal that results in a new hearing",
      ],
    },

    internalKnowledge: {
      explanation:
        "Courts have internal systems and norms that aren't always visible to the public.",
      examples: [
        "Judges have preferences about how motions and arguments are presented",
        "Court calendars are packed — expect delays and continuances",
        "Clerks can tell you about forms and procedures but can't give legal advice",
        "Settlement is common and often encouraged by judges",
        "Court records are generally public and searchable",
        "Court facilitators (in many jurisdictions) help self-represented parties for free",
      ],
    },

    misunderstandings: {
      traps: [
        "That courts will 'figure out the truth' automatically — you must present your case",
        "That being right is enough — you also need to follow procedures",
        "That judges are always fair — judges are human and constrained by law",
        "That small claims court is informal — it still has rules and deadlines",
        "That you can explain everything verbally — written filings matter most",
        "That missing a deadline is fixable — it often isn't",
      ],
    },

    whatMatters: [
      "Meeting every deadline without exception",
      "Filing proper written responses to anything you receive",
      "Keeping organized copies of everything",
      "Understanding which court and which procedures apply to your case",
      "Showing up to every hearing — absence usually means you lose",
      "Being prepared, organized, and respectful in court",
      "Consulting with a lawyer if possible, even for a one-time session",
    ],

    safeSteps: [
      "Read any legal papers you receive immediately — note all deadlines",
      "Visit the court's self-help center or website for forms and guidance",
      "Make copies of everything you file and everything you receive",
      "Arrive early to court hearings and dress appropriately",
      "Bring organized documents — timeline, evidence, key facts",
      "Ask the court facilitator for help if you're representing yourself",
      "Consider consulting a legal aid organization for complex matters",
    ],

    escalation: {
      explanation:
        "Escalation in court means appealing a decision, filing motions for reconsideration, or seeking higher-level review when you believe errors were made.",
      signs: [
        "A judgment was entered against you by default because you weren't notified",
        "Evidence was improperly excluded or admitted",
        "The judge appeared biased or didn't follow proper procedures",
        "New evidence has emerged that wasn't available during trial",
        "You believe the law was applied incorrectly",
        "Your rights were violated during the process",
      ],
    },

    closing: {
      reassurance:
        "The court system is intimidating, but it can be navigated. Thousands of people represent themselves every day. Preparation, organization, and showing up are more powerful than most people realize. You don't have to be a lawyer to be heard.",
    },

    sources: [
      { label: "Washington Courts - Self-Help Resources", url: "https://www.courts.wa.gov/newsinfo/resources/?fa=newsinfo_jury.selfhelp", type: "official" },
      { label: "Washington Law Help", url: "https://www.washingtonlawhelp.org/", type: "official" },
      { label: "National Center for State Courts", url: "https://www.ncsc.org/", type: "oversight" },
      { label: "Legal Services Corporation", url: "https://www.lsc.gov/", type: "official" },
    ],
  },

  // ===== DISABILITY =====
  {
    id: "disability-full-guide",
    systemId: "disability",
    title: "Understanding Disability Rights",
    readTime: "14 min read",

    beforeYouStart: {
      grounding:
        "Navigating systems while managing a disability is exhausting — physically, emotionally, and bureaucratically. If you're here, you're already doing something important: seeking to understand a system that should be working for you.",
      consent:
        "Take this at your own pace. Skip sections that don't apply. Come back when you need to. Your energy matters.",
    },

    whatThisSystemIs: {
      description:
        "Disability rights law requires reasonable accommodations and prohibits discrimination in employment, housing, education, healthcare, and public services. The ADA, Section 504 of the Rehabilitation Act, the Fair Housing Act, and state laws all apply in different contexts.",
      whoRunsIt:
        "Employers, landlords, schools, and service providers must provide reasonable accommodations unless it causes undue hardship. Government agencies (EEOC, HUD, DOJ, OCR) enforce compliance. Disability Rights Washington provides advocacy.",
      whatItControls:
        "The system controls access — to jobs, housing, education, healthcare, and public spaces. It determines what accommodations are 'reasonable' and who qualifies for protection.",
    },

    whyConfusing: {
      explanation:
        "Disability rights are confusing because the 'interactive process' for accommodations can feel one-sided, what's 'reasonable' is often contested, and denials frequently lack clear explanation. You may feel like you're asking for a favor when you're actually exercising a right.",
      structuralReasons: [
        "The definition of 'disability' is broader than most people think",
        "You don't have to disclose your diagnosis — only your functional limitations",
        "What's 'reasonable' depends on context and is often negotiable",
        "Medical documentation requirements can feel invasive",
        "Denials are common but challengeable through formal processes",
        "Different laws apply in different settings (work vs. housing vs. school)",
      ],
    },

    whatUsuallyHappens: [
      "You identify a barrier — at work, in housing, at school, or accessing services",
      "You request an accommodation, ideally in writing",
      "The entity begins an 'interactive process' to discuss your needs",
      "They may ask for documentation of your disability and limitations",
      "A decision is made — accommodation granted, modified, or denied",
      "If denied, you can negotiate, escalate internally, or file a complaint",
      "Throughout this, documentation of every step is critical",
    ],

    successReframe: {
      reality:
        "Success in disability rights isn't about 'winning' against a system. It's about getting the access and support you need to participate equally. That might look different than what you initially imagined.",
      examples: [
        "Getting a workplace accommodation that lets you do your job effectively",
        "Having a housing modification approved that makes your home accessible",
        "Securing an IEP or 504 plan that actually addresses your child's needs",
        "Filing a complaint that results in policy changes beyond just your case",
        "Receiving back pay or damages for disability discrimination",
        "Having a denial reversed after providing additional documentation",
      ],
    },

    internalKnowledge: {
      explanation:
        "Entities responding to accommodation requests often have more information and experience with the process than you do.",
      examples: [
        "HR departments track accommodation requests and outcomes internally",
        "Employers may have granted similar accommodations before",
        "Housing providers may have policies that aren't shared with tenants",
        "Schools must follow specific timelines for evaluations and IEP meetings",
        "Government agencies have formal complaint investigation procedures",
        "Patterns of denial can become evidence of systemic discrimination",
      ],
    },

    misunderstandings: {
      traps: [
        "That you need a 'severe' disability to qualify — the ADA covers a wide range of conditions",
        "That you must disclose your full medical history — you only need to show functional limitations",
        "That accommodations are optional favors — they are legal requirements",
        "That an employer can fire you for requesting accommodation — that's retaliation and it's illegal",
        "That 'undue hardship' means any inconvenience — it's a high legal standard",
        "That you have to accept the first offer — the interactive process means negotiation",
      ],
    },

    whatMatters: [
      "Requesting accommodations in writing with specific details about what you need",
      "Keeping copies of all documentation and correspondence",
      "Understanding that you control how much medical information you share",
      "Following up on requests and documenting responses (or lack of response)",
      "Knowing where to file complaints and relevant deadlines",
      "Connecting with disability rights organizations for guidance",
    ],

    safeSteps: [
      "Identify the specific barrier you're facing and what would help",
      "Put your accommodation request in writing — email is fine",
      "Keep a log of all interactions about your accommodation request",
      "If denied, ask for the denial in writing with specific reasons",
      "Contact Disability Rights Washington or a similar organization for guidance",
      "Know your deadlines — EEOC complaints must be filed within 180-300 days",
      "Remember: asking for accommodation is not asking for a favor",
    ],

    escalation: {
      explanation:
        "Escalation in disability rights means using formal channels when informal processes fail. This isn't conflict — it's the system working as designed.",
      signs: [
        "Your accommodation request was denied without a clear reason",
        "The interactive process isn't happening or feels one-sided",
        "You've experienced retaliation for requesting accommodations",
        "You're being treated differently because of your disability",
        "You've been denied access to services, housing, or education",
        "An employer changed your job duties or conditions after your request",
      ],
    },

    closing: {
      reassurance:
        "Living with a disability and advocating for yourself at the same time takes enormous strength. You don't have to do it perfectly. You don't have to do it alone. And you don't have to do it all at once. Every step toward understanding your rights is a step toward being treated as you deserve — with dignity and equality.",
    },

    sources: [
      { label: "ADA.gov - Americans with Disabilities Act", url: "https://www.ada.gov/", type: "official" },
      { label: "Disability Rights Washington", url: "https://www.disabilityrightswa.org/", type: "oversight" },
      { label: "EEOC - Disability Discrimination", url: "https://www.eeoc.gov/disability-discrimination", type: "official" },
      { label: "HUD - Disability Rights in Housing", url: "https://www.hud.gov/program_offices/fair_housing_equal_opp/disability_main", type: "official" },
    ],
  },

  // ===== PROTEST RIGHTS =====
  {
    id: "protest-full-guide",
    systemId: "protest",
    title: "Understanding Protest & First Amendment Rights",
    readTime: "13 min read",

    beforeYouStart: {
      grounding:
        "The right to protest is fundamental to democracy. Whether you're planning to participate in a demonstration, already have, or are dealing with consequences from one — understanding your rights can help you feel more grounded.",
      consent:
        "This guide is educational, not tactical. Read what's useful to you. You don't need to prepare for every scenario at once.",
    },

    whatThisSystemIs: {
      description:
        "The First Amendment protects freedom of speech, assembly, and petition. This includes the right to march, demonstrate, picket, and protest in public spaces. However, these rights have limits — particularly regarding time, place, and manner restrictions.",
      whoRunsIt:
        "Local police enforce laws during protests. City governments may require permits. Courts decide when restrictions are constitutional. Federal agencies may be involved in monitoring. Legal observers and civil liberties organizations provide oversight.",
      whatItControls:
        "The system controls where, when, and how you can protest — but not whether you can. The content of your speech is generally protected; the logistics are what gets regulated.",
    },

    whyConfusing: {
      explanation:
        "Protest rights are confusing because the rules seem to change depending on the situation, the location, and the political climate. What's legal and what law enforcement tolerates are often different things.",
      structuralReasons: [
        "Permits may be required for large gatherings but not for spontaneous protests",
        "Public sidewalks and parks have different rules than private property",
        "Police may issue dispersal orders that create legal consequences if ignored",
        "Mass arrest situations can result in charges even against lawful protestors",
        "Counter-protestors have rights too, which complicates dynamics",
        "Social media documentation cuts both ways — it can protect or expose",
      ],
    },

    whatUsuallyHappens: [
      "A group organizes around an issue and plans a demonstration",
      "Organizers may apply for permits (depending on size and location)",
      "People gather, march, chant, hold signs, and make their voices heard",
      "Police may be present to monitor or control the crowd",
      "If things escalate, police may issue dispersal orders or make arrests",
      "Arrested individuals may face charges ranging from trespassing to disorderly conduct",
      "Legal support organizations often assist with post-arrest issues",
    ],

    successReframe: {
      reality:
        "Successful protest isn't measured only by whether you avoided arrest. It can mean making your voice heard, building community, drawing public attention, and creating a record of dissent.",
      examples: [
        "Peacefully exercising your rights without incident",
        "Having charges dropped after a wrongful arrest",
        "Drawing media attention to an important issue",
        "Building solidarity and community support",
        "Creating a documented record of government response",
        "Successfully challenging unconstitutional restrictions in court",
      ],
    },

    internalKnowledge: {
      explanation:
        "Law enforcement agencies plan for protests internally and have procedures you may not be aware of.",
      examples: [
        "Police often have pre-planned response strategies for anticipated protests",
        "Undercover officers may be present in crowds",
        "Social media monitoring is standard for many agencies",
        "Dispersal orders create legal consequences once issued",
        "Mass arrest processing may involve long detentions",
        "Intelligence sharing between agencies can affect future interactions",
      ],
    },

    misunderstandings: {
      traps: [
        "That you always need a permit to protest — spontaneous protests on public sidewalks generally don't require one",
        "That being arrested means you did something illegal — wrongful arrests happen",
        "That free speech means you can say anything anywhere — time, place, and manner restrictions exist",
        "That counter-protestors can be removed — they have First Amendment rights too",
        "That your employer can't fire you for protesting — private employers may have that right depending on context",
        "That recording is always safe — it creates evidence that can be used by any party",
      ],
    },

    whatMatters: [
      "Knowing your rights before you go",
      "Having a legal support contact number written on your body (not just your phone)",
      "Understanding what 'dispersal order' means and the consequences of staying",
      "Traveling in groups and having a buddy system",
      "Bringing ID (or understanding the consequences of not having it)",
      "Documenting police conduct if it appears unlawful",
    ],

    safeSteps: [
      "Write the number of a legal support hotline on your arm in permanent marker",
      "Bring water, a charged phone, and know your exit routes",
      "Stay aware of your surroundings and any police announcements",
      "If arrested, invoke your right to remain silent and ask for a lawyer",
      "Don't post details on social media that could be used against you or others",
      "Contact the National Lawyers Guild or ACLU if your rights were violated",
      "After the event, document what happened while it's fresh in your mind",
    ],

    escalation: {
      explanation:
        "Escalation means using formal legal channels after your rights have been violated — not during a confrontation.",
      signs: [
        "Police used force against peaceful protestors",
        "You were arrested without probable cause",
        "Dispersal orders were issued without adequate warning or exit routes",
        "Your recording equipment was confiscated or destroyed",
        "You were targeted for your speech content rather than your conduct",
        "You face charges that appear retaliatory",
      ],
    },

    closing: {
      reassurance:
        "The right to protest is among the most powerful rights in a democracy. Whether you've marched, stood silently, or simply shown up — you participated in something that matters. Take care of yourself afterward. Connect with others. And know that exercising your rights, even imperfectly, is never something to be ashamed of.",
    },

    sources: [
      { label: "ACLU - Know Your Rights: Protesters", url: "https://www.aclu.org/know-your-rights/protesters-rights", type: "official" },
      { label: "National Lawyers Guild - Legal Observer Program", url: "https://www.nlg.org/legal-observers/", type: "oversight" },
      { label: "First Amendment Watch", url: "https://firstamendmentwatch.org/", type: "official" },
    ],
  },

  // ===== EDUCATION / SCHOOLS =====
  {
    id: "education-full-guide",
    systemId: "education",
    title: "Understanding Schools & Student Rights",
    readTime: "14 min read",

    beforeYouStart: {
      grounding:
        "Whether you're a student dealing with an unfair situation or a parent advocating for your child, the school system can feel opaque and unresponsive. Your concern is valid, and understanding the system is the first step.",
      consent:
        "You don't have to read everything here. Focus on what applies to your situation. You can come back for the rest when you need it.",
    },

    whatThisSystemIs: {
      description:
        "Students have rights in schools protected by federal and state law. Title VI prohibits racial discrimination, Title IX covers sex discrimination and harassment, IDEA governs special education, and Section 504 requires disability accommodations. State laws add additional protections around discipline, privacy, and parent involvement.",
      whoRunsIt:
        "Teachers and administrators make daily decisions. School districts set policies. State education agencies provide oversight. Federal agencies (Office for Civil Rights, Department of Education) enforce civil rights laws. Parents and guardians are key advocates.",
      whatItControls:
        "Schools control daily education, discipline, placement, and access to services. They must follow specific legal procedures for suspensions, expulsions, special education, and accommodation requests.",
    },

    whyConfusing: {
      explanation:
        "Schools have significant authority over students, and the balance between school safety, educational mission, and student rights isn't always clear. Bureaucratic processes can make parents feel excluded from decisions that profoundly affect their children.",
      structuralReasons: [
        "School discipline can happen quickly without much due process",
        "Special education law (IDEA) is highly technical and full of timelines",
        "Schools may not proactively inform parents of all their rights",
        "IEP and 504 meetings can feel intimidating with multiple staff present",
        "Students' free speech rights are more limited in school than outside",
        "Complaints to federal agencies feel disproportionate to local problems",
      ],
    },

    whatUsuallyHappens: [
      "A problem arises — discipline, access, accommodation, or discrimination",
      "The parent or student raises the issue informally (conversation with teacher or admin)",
      "The school may or may not respond adequately",
      "If not resolved, the parent may request a formal meeting or put concerns in writing",
      "For special education, formal processes like IEP meetings or evaluations are triggered",
      "If still unresolved, options include complaints to the district, state agency, or federal Office for Civil Rights",
      "Throughout, documentation of every step matters enormously",
    ],

    successReframe: {
      reality:
        "Success in school advocacy often means getting a system to work as it's supposed to — providing appropriate education, following its own rules, and treating students fairly.",
      examples: [
        "Getting an IEP that actually addresses your child's needs",
        "Having a suspension reversed or removed from the record",
        "Securing a 504 plan for a student with a disability",
        "Having a school change a discriminatory policy",
        "Getting compensatory services for denied special education",
        "Successfully resolving a harassment complaint",
      ],
    },

    internalKnowledge: {
      explanation:
        "Schools track information about students that parents and students don't always see.",
      examples: [
        "Discipline records follow students between schools",
        "Teachers share observations about students in team meetings",
        "Schools have internal data on discipline disparities by race and disability",
        "Special education departments track compliance timelines",
        "Schools may have prior complaints about the same teacher or policy",
        "Administrative responses to parent concerns are often documented internally",
      ],
    },

    misunderstandings: {
      traps: [
        "That schools always act in students' best interest — they also manage liability and resources",
        "That verbal agreements in meetings are binding — get everything in the IEP or in writing",
        "That discipline is always final — appeal rights exist, especially for students with disabilities",
        "That parents can't attend meetings with support — you can bring an advocate or attorney",
        "That special education evaluations are optional for schools — they must evaluate when requested",
        "That only 'serious' discrimination counts — patterns of smaller incidents also matter",
      ],
    },

    whatMatters: [
      "Putting concerns in writing (emails create paper trails)",
      "Understanding the specific legal framework that applies (IDEA, 504, Title IX, etc.)",
      "Attending all meetings and bringing a support person when possible",
      "Requesting copies of your child's records (FERPA gives you this right)",
      "Understanding timeline requirements, especially in special education",
      "Knowing your right to request independent evaluations",
    ],

    safeSteps: [
      "Document the problem: dates, what happened, who was involved, what was said",
      "Send a written request to the school describing your concern and what you want",
      "Request a meeting — and confirm in writing what was discussed and decided",
      "If your child has a disability, request an evaluation in writing if they don't have an IEP/504 yet",
      "Bring an advocate or trusted person to meetings for support",
      "Contact your state's Parent Training and Information Center for free guidance",
      "If the school isn't responding, file a complaint with the district or Office for Civil Rights",
    ],

    escalation: {
      explanation:
        "Escalation in education means using formal complaint processes when schools don't follow their legal obligations.",
      signs: [
        "Your child was suspended or expelled without due process",
        "The school refuses to evaluate your child for special education services",
        "An IEP is being ignored or not implemented as written",
        "Your child is experiencing harassment or discrimination",
        "The school retaliates against you for advocating for your child",
        "Accommodations are being denied without explanation",
      ],
    },

    closing: {
      reassurance:
        "Advocating for a child — or for yourself as a student — is one of the most important things you can do. The system isn't always easy, but your voice matters. Schools respond to organized, documented advocacy. You don't have to be an expert. You just have to show up, write things down, and keep asking questions.",
    },

    sources: [
      { label: "U.S. Department of Education - Office for Civil Rights", url: "https://www2.ed.gov/about/offices/list/ocr/", type: "official" },
      { label: "Wrightslaw - Special Education Law & Advocacy", url: "https://www.wrightslaw.com/", type: "official" },
      { label: "Washington PAVE - Parent Training", url: "https://wapave.org/", type: "oversight" },
      { label: "TeamChild", url: "https://teamchild.org/", type: "oversight" },
    ],
  },

  // ===== GOVERNMENT BENEFITS =====
  {
    id: "government-full-guide",
    systemId: "government",
    title: "Understanding Government Benefits",
    readTime: "13 min read",

    beforeYouStart: {
      grounding:
        "Applying for or fighting to keep government benefits — unemployment, disability, food assistance, healthcare — is stressful. The bureaucracy can feel dehumanizing, especially when you're already in a difficult situation. You're not alone in that experience.",
      consent:
        "This guide is here to help you understand the system, not to add to your to-do list. Read what applies to you right now.",
    },

    whatThisSystemIs: {
      description:
        "Government agencies administer benefits, licenses, and regulatory programs. Each agency has its own rules, application processes, appeal procedures, and timelines. Administrative law governs how agencies must behave — including requirements for fair hearings and due process.",
      whoRunsIt:
        "Caseworkers make initial determinations. Their supervisors review decisions. Formal appeals go to administrative law judges who are independent of the agency. Courts can review agency actions for legal errors. Ombudsman offices exist in many systems.",
      whatItControls:
        "The system controls access to benefits — who qualifies, how much they receive, and for how long. It also controls the denial and termination process, including your right to appeal.",
    },

    whyConfusing: {
      explanation:
        "Benefits systems are confusing because they're designed for processing, not for people. Forms multiply, deadlines are strict, denial letters are vague, and getting a human to explain things can feel nearly impossible.",
      structuralReasons: [
        "Each program has different eligibility rules and documentation requirements",
        "Denial letters often don't clearly explain the reason or what to do next",
        "Appeal deadlines are strict and missing them can end your case",
        "Caseworker turnover means you may deal with different people each time",
        "The system can feel adversarial even when it's supposed to help",
        "Temporary approvals can create false security about long-term eligibility",
      ],
    },

    whatUsuallyHappens: [
      "You apply for benefits and provide documentation",
      "A caseworker reviews your application and makes a determination",
      "You receive an approval or denial letter (which may not clearly explain the decision)",
      "If denied, you have a limited window to appeal (often 30-90 days)",
      "An appeal hearing is scheduled before an administrative law judge",
      "You present your case, and the judge makes a decision",
      "If you lose the appeal, further review may be available through courts",
    ],

    successReframe: {
      reality:
        "Success in benefits cases often means understanding the system well enough to navigate it — getting the right documents to the right people at the right time.",
      examples: [
        "Having a denial reversed on appeal because proper evidence was presented",
        "Maintaining benefits by responding to review requests on time",
        "Getting back benefits retroactively after a successful appeal",
        "Finding an error in the agency's calculation that changes your eligibility",
        "Connecting with legal aid that helps you through a complex process",
        "Understanding why you were denied and reapplying with stronger documentation",
      ],
    },

    internalKnowledge: {
      explanation:
        "Agencies track information and use systems you may not see or understand.",
      examples: [
        "Case notes document every interaction you have with the agency",
        "Eligibility determinations follow specific regulatory criteria that may not be in the denial letter",
        "Agencies share information between programs (income, household size, etc.)",
        "Review dates are automated — missing them triggers automatic termination",
        "Appeals have a higher success rate than most people expect",
        "Legal aid organizations often have relationships with agency staff",
      ],
    },

    misunderstandings: {
      traps: [
        "That a denial is final — most denials can be appealed",
        "That the caseworker's word is law — they follow regulations that can be checked",
        "That you have to accept the first decision — appeal rates are surprisingly successful",
        "That verbal communication is enough — get everything in writing",
        "That being 'close' to the income limit means you don't qualify — other factors may apply",
        "That benefits programs are all the same — each has different rules and procedures",
      ],
    },

    whatMatters: [
      "Meeting every deadline without exception",
      "Keeping copies of everything you submit and receive",
      "Getting denials and decisions in writing",
      "Understanding the specific reason for denial (ask for it in writing if unclear)",
      "Following the appeal process exactly as described",
      "Seeking help from legal aid or benefits counselors early in the process",
    ],

    safeSteps: [
      "Read denial letters carefully and note all deadlines immediately",
      "File your appeal as soon as possible — don't wait until the deadline",
      "Gather all relevant documentation before your hearing",
      "Contact legal aid — many organizations specialize in benefits cases",
      "Keep a folder (physical or digital) with all documents, letters, and notes",
      "If you speak with the agency, follow up with an email summarizing what was discussed",
      "Ask for a continuation of benefits during appeal (available in some programs)",
    ],

    escalation: {
      explanation:
        "Escalation in benefits cases means using the formal appeal process, contacting ombudsman offices, or seeking legal representation.",
      signs: [
        "Your benefits were terminated without proper notice",
        "Your appeal deadline is approaching or has been missed for good cause",
        "The agency isn't following its own procedures",
        "You're unable to communicate effectively with your caseworker",
        "You've been denied and don't understand why",
        "You need benefits urgently for basic needs (food, housing, healthcare)",
      ],
    },

    closing: {
      reassurance:
        "Navigating government benefits while you're already struggling is one of the hardest things the system asks of people. The confusion and frustration you feel are not personal failings — they're features of a system that wasn't designed with your experience in mind. Understanding the process, even a little bit, is a meaningful step.",
    },

    sources: [
      { label: "Benefits.gov - Official Benefits Finder", url: "https://www.benefits.gov/", type: "official" },
      { label: "Washington DSHS", url: "https://www.dshs.wa.gov/", type: "agency" },
      { label: "Social Security Administration", url: "https://www.ssa.gov/", type: "official" },
      { label: "National Organization of Social Security Claimants' Representatives", url: "https://nosscr.org/", type: "oversight" },
    ],
  },

  // ===== INCARCERATION =====
  {
    id: "incarceration-full-guide",
    systemId: "incarceration",
    title: "Understanding Rights During Jail & Detention",
    readTime: "13 min read",

    beforeYouStart: {
      grounding:
        "If you or someone you care about is incarcerated, the experience is inherently stressful and isolating. This guide exists to provide clarity about what rights exist — even inside facilities — because understanding the system is a form of protection.",
      consent:
        "You don't have to read all of this now. Focus on what's most relevant to your situation and come back when you need more.",
    },

    whatThisSystemIs: {
      description:
        "People in jails, prisons, and detention facilities retain constitutional rights, though they're limited by legitimate security needs. Conditions of confinement, medical care, due process for discipline, communication, and grievance procedures are all subject to legal standards.",
      whoRunsIt:
        "Facility administrators and corrections officers control daily life. Grievance systems exist but are internal. State corrections ombudsman offices provide independent oversight. Courts can order changes to conditions. Family members and advocates can draw attention to problems from outside.",
      whatItControls:
        "The facility controls housing, food, medical care, discipline, communication, and access to legal resources. The system also controls classification (security level), good-time credits, and release planning.",
    },

    whyConfusing: {
      explanation:
        "Incarceration strips away most of your autonomy, making it hard to advocate for yourself. Retaliation fears are real. Grievance systems can feel like complaining to the people causing the problem. Access to legal information and outside help is extremely limited.",
      structuralReasons: [
        "Incarcerated people are isolated from outside resources and support",
        "Grievance procedures are internal and may feel futile",
        "Retaliation for complaints — real or perceived — creates chilling effects",
        "Legal mail and phone access may be restricted or monitored",
        "Medical care quality varies enormously between facilities",
        "Family members often don't know what's happening inside",
      ],
    },

    whatUsuallyHappens: [
      "A person enters a facility and is classified (security level, housing assignment)",
      "Daily life is governed by facility rules and officer discretion",
      "Problems arise — medical care, conditions, discipline, safety",
      "The person files a grievance through the internal system",
      "The grievance may be addressed, ignored, or denied",
      "If internal remedies are exhausted, court action may be possible",
      "Family members may contact oversight offices on behalf of the incarcerated person",
    ],

    successReframe: {
      reality:
        "Success inside a facility often means getting basic needs met, protecting yourself from harm, maintaining connections to the outside, and creating a record that can be used later if needed.",
      examples: [
        "Getting medical treatment that was previously denied",
        "Having a grievance resolved that improves conditions",
        "Maintaining family communication through regular contact",
        "Creating documentation that supports future legal action",
        "Connecting with legal aid for post-conviction or conditions issues",
        "Getting transferred to a safer or more appropriate facility",
      ],
    },

    internalKnowledge: {
      explanation:
        "Facilities track extensive information about incarcerated people that isn't always shared.",
      examples: [
        "Internal incident reports document use of force and disciplinary actions",
        "Medical records must be maintained but may be difficult to access",
        "Grievance files create an official record of complaints",
        "Classification decisions affect housing, programming, and release",
        "Monitoring of phone calls and mail is standard (except legal mail)",
        "Good-time credit calculations affect release dates",
      ],
    },

    misunderstandings: {
      traps: [
        "That incarcerated people have no rights — constitutional protections apply",
        "That grievances don't matter — they create records and are required before court action",
        "That medical care can be refused by the facility — deliberate indifference is unconstitutional",
        "That family can't do anything — families can contact oversight offices and attorneys",
        "That conditions are just 'part of the punishment' — cruel and unusual punishment is prohibited",
        "That nothing will change — court orders and advocacy have improved conditions in many facilities",
      ],
    },

    whatMatters: [
      "Filing grievances even when they seem futile (they create required records)",
      "Documenting everything in writing when possible",
      "Keeping copies of grievances, responses, and medical requests",
      "Contacting family or advocates to document from outside",
      "Knowing about independent oversight offices (corrections ombudsman)",
      "Understanding that exhausting internal remedies is usually required before court",
    ],

    safeSteps: [
      "File grievances in writing and keep copies of everything",
      "Request medical attention in writing and document denials",
      "Ask family members to contact the corrections ombudsman if you're unable to",
      "Know the facility's grievance procedure and follow it exactly",
      "If you feel unsafe, document why and request protective measures in writing",
      "Contact legal aid organizations that specialize in prisoners' rights",
      "Maintain family connections — they are your link to outside advocacy",
    ],

    escalation: {
      explanation:
        "Escalation while incarcerated means using formal oversight channels and, when internal remedies are exhausted, seeking court intervention.",
      signs: [
        "Medical care is being denied or inadequate despite requests",
        "You're experiencing or threatened with violence and the facility isn't responding",
        "Discipline was imposed without due process (no hearing, no notice)",
        "Conditions violate basic standards (sanitation, temperature, food)",
        "Your legal mail or attorney access is being restricted",
        "Retaliation for filing grievances is occurring",
      ],
    },

    closing: {
      reassurance:
        "Incarceration does not erase your humanity or your rights. The system is difficult to navigate from inside, but you are not powerless. Grievances create records. Family advocacy creates pressure. Oversight offices exist because the system needs watching. You deserve to be treated with basic dignity, and that is not just a moral statement — it is a legal requirement.",
    },

    sources: [
      { label: "Washington Office of the Corrections Ombuds", url: "https://oco.wa.gov/", type: "oversight" },
      { label: "ACLU - Prisoners' Rights", url: "https://www.aclu.org/issues/prisoners-rights", type: "official" },
      { label: "Prison Policy Initiative", url: "https://www.prisonpolicy.org/", type: "oversight" },
      { label: "Columbia Legal Services", url: "https://columbialegal.org/", type: "official" },
    ],
  },

  // ===== HEALTHCARE / MEDICAL CARE =====
  {
    id: "healthcare-full-guide",
    systemId: "healthcare",
    title: "Understanding Patient Rights & Medical Care",
    readTime: "13 min read",

    beforeYouStart: {
      grounding:
        "Dealing with the healthcare system while managing a health concern is inherently stressful. Power imbalances between patients and providers, confusing insurance rules, and the vulnerability of being sick or injured can make everything harder. Your need to understand this system is completely valid.",
      consent:
        "Take what's useful from this guide and leave the rest. You can return whenever you need to. Your health — physical and emotional — comes first.",
    },

    whatThisSystemIs: {
      description:
        "Patients have rights regarding medical decisions, privacy, access to records, informed consent, and freedom from discrimination. HIPAA protects your medical privacy. Civil rights laws prohibit discrimination in healthcare. State laws govern medical malpractice, informed consent, and complaint processes.",
      whoRunsIt:
        "Providers (doctors, nurses, hospitals) make medical decisions but must obtain informed consent. Insurance companies control coverage and payment. State licensing boards oversee provider conduct. The HHS Office for Civil Rights enforces federal anti-discrimination laws in healthcare.",
      whatItControls:
        "The system controls what care you receive, how much it costs, who provides it, and what recourse you have when things go wrong. It also controls your medical records and who can access them.",
    },

    whyConfusing: {
      explanation:
        "Healthcare is confusing because it combines medical complexity with insurance bureaucracy, legal requirements, and significant power imbalances. Rushed appointments, unclear bills, and fear of losing care make it hard to advocate for yourself.",
      structuralReasons: [
        "Medical terminology creates barriers to understanding your own care",
        "Insurance rules are complex and vary by plan",
        "Providers have limited appointment time and may not explain options fully",
        "Billing is opaque — the same procedure can cost vastly different amounts",
        "Complaining feels risky when you need ongoing care from the same provider",
        "Emergency situations limit your ability to research and decide",
      ],
    },

    whatUsuallyHappens: [
      "You seek medical care for a concern, condition, or emergency",
      "A provider examines you and recommends treatment",
      "You may or may not be fully informed about risks, alternatives, and costs",
      "Treatment is provided, and bills follow (often weeks or months later)",
      "If something goes wrong — medically, financially, or ethically — you try to resolve it",
      "Resolution may involve the provider, insurance company, or formal complaint processes",
      "Throughout, your medical records document what happened from the provider's perspective",
    ],

    successReframe: {
      reality:
        "Success in healthcare advocacy often means getting your questions answered, receiving appropriate care, understanding your options, and having your concerns taken seriously.",
      examples: [
        "Getting a second opinion that changes your treatment plan",
        "Having a denied insurance claim reversed on appeal",
        "Obtaining your complete medical records for your own files",
        "Filing a complaint that results in a provider changing their practices",
        "Successfully negotiating a medical bill",
        "Getting an accommodation for a disability in a healthcare setting",
      ],
    },

    internalKnowledge: {
      explanation:
        "Healthcare systems track information about you that you may not have access to or know about.",
      examples: [
        "Your medical records contain provider notes you may never have read",
        "Insurance companies maintain records of all claims, denials, and appeals",
        "Hospitals track patient complaints internally",
        "Providers document your 'compliance' with their recommendations",
        "Billing departments have more flexibility than they initially present",
        "State licensing boards keep records of complaints against providers",
      ],
    },

    misunderstandings: {
      traps: [
        "That you can't access your own records — HIPAA gives you the right to your records",
        "That informed consent means signing a form — it means understanding risks, benefits, and alternatives",
        "That insurance denials are final — you have the right to appeal, and appeals often succeed",
        "That providers can refuse to treat you for any reason — anti-discrimination laws apply",
        "That medical bills are non-negotiable — many hospitals have financial assistance and payment plans",
        "That complaining about a provider risks your care — retaliation is prohibited",
      ],
    },

    whatMatters: [
      "Requesting your medical records in writing (providers must respond within 30 days)",
      "Understanding your right to informed consent before any procedure",
      "Knowing your insurance plan's appeals process and deadlines",
      "Documenting concerns about your care as they happen",
      "Understanding that you can refuse treatment (with informed understanding of consequences)",
      "Knowing where to file complaints — hospital, state licensing board, or HHS OCR",
    ],

    safeSteps: [
      "Request a copy of your medical records and review them for accuracy",
      "Before procedures, ask: What are the risks? What are the alternatives? What happens if I wait?",
      "Keep a health journal documenting symptoms, treatments, and communications",
      "If you receive a bill you can't pay, contact the billing department about financial assistance",
      "If your insurance denies a claim, file a formal appeal within the deadline",
      "Bring a support person to important appointments who can take notes",
      "If you believe you've experienced discrimination, contact HHS Office for Civil Rights",
    ],

    escalation: {
      explanation:
        "Escalation in healthcare means using formal systems when your rights are violated or your care is inadequate.",
      signs: [
        "You were denied care or treated differently based on race, disability, or other protected status",
        "Informed consent was not obtained before a procedure",
        "Your medical records contain errors that the provider won't correct",
        "Your insurance has denied a claim you believe should be covered",
        "A provider's conduct was negligent or harmful",
        "Your medical privacy was violated",
      ],
    },

    closing: {
      reassurance:
        "Being a patient can feel powerless, especially when you're unwell. But you have more rights than most people realize — to your records, to your decisions, to respectful care, and to accountability when things go wrong. Understanding these rights doesn't make everything easier, but it can make you feel less alone in a system that often forgets you're a person, not a case number.",
    },

    sources: [
      { label: "HHS - Your Rights Under HIPAA", url: "https://www.hhs.gov/hipaa/for-individuals/index.html", type: "official" },
      { label: "Washington State Department of Health - Patient Rights", url: "https://doh.wa.gov/", type: "agency" },
      { label: "Centers for Medicare & Medicaid Services", url: "https://www.cms.gov/", type: "official" },
      { label: "Patient Advocate Foundation", url: "https://www.patientadvocate.org/", type: "oversight" },
    ],
  },
];
