export interface GuideSection {
  title: string;
  content: string[];
}

export interface TopicGuide {
  id: string;
  label: string;
  icon: string;
  sections: {
    overview: GuideSection;
    rights: GuideSection;
    commonScenarios: GuideSection;
    whatToDo: GuideSection;
    whatNotToDo: GuideSection;
    documentationTips: GuideSection;
    evidencePreservation: GuideSection;
    reportingComplaints: GuideSection;
    resources: GuideSection;
    emergencyActions: GuideSection;
    safetyPlanning?: GuideSection;
  };
}

export const topicGuides: Record<string, TopicGuide> = {
  police: {
    id: "police",
    label: "Police",
    icon: "Shield",
    sections: {
      overview: {
        title: "Overview",
        content: [
          "Police interactions involve complex power dynamics where officers have significant authority but citizens retain fundamental rights.",
          "Understanding the difference between voluntary encounters, investigative stops, and arrests can help you navigate these situations.",
          "Officers may not always explain your rights — knowing them in advance provides crucial protection.",
          "Documentation during and after interactions can be essential for accountability and legal proceedings."
        ]
      },
      rights: {
        title: "Your Rights",
        content: [
          "You have the right to remain silent and cannot be punished for refusing to answer questions.",
          "You have the right to refuse consent to searches of your person, vehicle, or home.",
          "You have the right to know if you are being detained or are free to leave.",
          "You have the right to an attorney before and during questioning.",
          "You have the right to record police interactions in most public spaces.",
          "You have the right to a phone call if you are arrested."
        ]
      },
      commonScenarios: {
        title: "Common Scenarios",
        content: [
          "Traffic stops: Officers may request license, registration, and proof of insurance. You may decline searches.",
          "Street encounters: You can ask 'Am I free to leave?' — if yes, you may walk away calmly.",
          "Home visits: Officers generally need a warrant to enter unless there's an emergency or you consent.",
          "Witness interviews: You can decline to speak without an attorney present.",
          "Arrests: Remain calm, state clearly that you wish to remain silent and want an attorney."
        ]
      },
      whatToDo: {
        title: "What To Do",
        content: [
          "Stay calm and keep your hands visible at all times.",
          "Clearly state: 'I do not consent to searches' and 'I am exercising my right to remain silent.'",
          "Ask if you are being detained or are free to leave.",
          "Request a supervisor if you feel your rights are being violated.",
          "Note officer names, badge numbers, patrol car numbers, and witness information.",
          "Seek medical attention immediately if you are injured."
        ]
      },
      whatNotToDo: {
        title: "What Not To Do",
        content: [
          "Do not physically resist, run, or make sudden movements — even if you believe the stop is unlawful.",
          "Do not lie or provide false identification.",
          "Do not consent to searches even if you have nothing to hide.",
          "Do not argue, debate, or become confrontational during the interaction.",
          "Do not answer questions beyond providing identification if required by state law.",
          "Do not destroy evidence or attempt to flee."
        ]
      },
      documentationTips: {
        title: "Documentation Tips",
        content: [
          "Write down everything you remember as soon as possible after the interaction.",
          "Include date, time, location, officer descriptions, and exact words used.",
          "Take photos of the location and any visible injuries.",
          "Collect contact information from witnesses.",
          "Save any relevant text messages, emails, or voicemails.",
          "Request copies of any reports filed about the incident."
        ]
      },
      evidencePreservation: {
        title: "Evidence Preservation",
        content: [
          "Save all video and audio recordings in multiple secure locations.",
          "Do not edit or alter any recordings — preserve original files.",
          "Keep clothing worn during the incident unwashed if relevant to evidence.",
          "Screenshot and save social media posts from officers or witnesses.",
          "Request dashcam and bodycam footage through public records requests.",
          "Preserve medical records if you sought treatment."
        ]
      },
      reportingComplaints: {
        title: "Reporting & Complaints",
        content: [
          "File a complaint with the police department's internal affairs division.",
          "Contact civilian oversight boards or police accountability offices in your jurisdiction.",
          "File a complaint with the Department of Justice Civil Rights Division for serious violations.",
          "Consult with a civil rights attorney about potential legal action.",
          "Document all complaint filings and keep copies of everything submitted.",
          "Note deadlines for filing complaints — some have short time limits."
        ]
      },
      resources: {
        title: "Legal & Community Resources",
        content: [
          "ACLU — Know Your Rights resources and legal support referrals.",
          "National Lawyers Guild — Legal observer training and attorney referrals.",
          "NAACP Legal Defense Fund — Civil rights litigation support.",
          "Local legal aid organizations for free or low-cost legal assistance.",
          "Copwatch and police accountability organizations in your community.",
          "Public defender's office if you cannot afford an attorney."
        ]
      },
      emergencyActions: {
        title: "Emergency Actions",
        content: [
          "If arrested: State clearly 'I am exercising my right to remain silent' and 'I want a lawyer.'",
          "Do not sign anything without an attorney present.",
          "Contact a trusted person to notify them of your arrest.",
          "Do not discuss your case with anyone except your attorney — including other detainees.",
          "Request medical attention immediately if injured.",
          "Remember: You can invoke your rights at any time, even after initially speaking."
        ]
      },
      safetyPlanning: {
        title: "Safety Planning",
        content: [
          "Keep emergency contacts easily accessible, including attorneys and advocates.",
          "Know your local police department's complaint process before you need it.",
          "Consider using apps that automatically record and store police interactions.",
          "Inform trusted friends or family when you anticipate police contact.",
          "Have a plan for childcare if you are detained.",
          "Know the location of your nearest legal aid office."
        ]
      }
    }
  },
  cps: {
    id: "cps",
    label: "CPS",
    icon: "Users",
    sections: {
      overview: {
        title: "Overview",
        content: [
          "Child Protective Services (CPS) investigates reports of child abuse or neglect to ensure child safety.",
          "CPS has significant authority but parents retain constitutional rights including due process.",
          "Cooperation and compliance are different — you can cooperate without waiving your rights.",
          "Understanding the investigation process can reduce fear and help you respond appropriately."
        ]
      },
      rights: {
        title: "Your Rights",
        content: [
          "You have the right to know the allegations against you (in most states).",
          "You have the right to have an attorney present during interviews and meetings.",
          "You have the right to refuse entry to your home unless there is a court order or emergency.",
          "You have the right to record interactions in many states (check your state's recording laws).",
          "You have the right to request a different caseworker if you believe there is bias.",
          "You have the right to access your case file and request copies of documents."
        ]
      },
      commonScenarios: {
        title: "Common Scenarios",
        content: [
          "Initial contact: A caseworker may call or arrive unannounced. You can ask for identification and purpose.",
          "Home visits: You can step outside to speak, or schedule a time when you have support present.",
          "Child interviews: Schools may allow interviews without parent consent — know your district's policy.",
          "Safety plans: These are often 'voluntary' but refusing may escalate the case. Consult an attorney.",
          "Court involvement: If a petition is filed, you have the right to an attorney in court proceedings."
        ]
      },
      whatToDo: {
        title: "What To Do",
        content: [
          "Stay calm and polite — hostility can be used against you in reports.",
          "Ask for the caseworker's name, supervisor, and a copy of the report (where allowed).",
          "Take notes during every interaction including dates, times, and what was said.",
          "Consult with an attorney before signing any documents or safety plans.",
          "Follow through on any services you agree to and document your compliance.",
          "Keep all communication in writing when possible (emails, texts)."
        ]
      },
      whatNotToDo: {
        title: "What Not To Do",
        content: [
          "Do not lie or try to hide children — this escalates risk significantly.",
          "Do not sign anything without reading it carefully or consulting an attorney.",
          "Do not speak negatively about the other parent to the caseworker.",
          "Do not allow interviews with children without understanding your rights first.",
          "Do not miss scheduled appointments or court dates.",
          "Do not discuss your case on social media."
        ]
      },
      documentationTips: {
        title: "Documentation Tips",
        content: [
          "Keep a detailed log of every CPS interaction with dates, times, and names.",
          "Save all letters, emails, and documents received from CPS.",
          "Document your home environment with dated photos showing cleanliness and safety.",
          "Keep records of all services completed (parenting classes, therapy, etc.).",
          "Collect character references from teachers, doctors, and community members.",
          "Request copies of all reports and assessments in your case file."
        ]
      },
      evidencePreservation: {
        title: "Evidence Preservation",
        content: [
          "Save all text messages and voicemails related to the case.",
          "Keep medical records showing children are healthy and receiving care.",
          "Document children's school attendance and performance.",
          "Preserve evidence of safe and stable housing.",
          "Save receipts for food, clothing, and children's necessities.",
          "Keep records of participation in recommended services."
        ]
      },
      reportingComplaints: {
        title: "Reporting & Complaints",
        content: [
          "Contact the supervisor of your assigned caseworker for immediate concerns.",
          "File a formal grievance with the CPS agency's complaint department.",
          "Contact your state's Office of the Ombudsman for child welfare concerns.",
          "Reach out to the Office of Child and Family Ombud (OFCO) in applicable states.",
          "Consult with a family law attorney about your legal options.",
          "Contact advocacy organizations specializing in parent representation."
        ]
      },
      resources: {
        title: "Legal & Community Resources",
        content: [
          "Office of Family and Children's Ombuds (OFCO) — State-level advocacy.",
          "TeamChild — Legal advocacy for children and families.",
          "Parent representation organizations in your state.",
          "Family defense attorneys and legal aid societies.",
          "Parent support groups and family advocacy organizations.",
          "Community-based family services and support networks."
        ]
      },
      emergencyActions: {
        title: "Emergency Actions",
        content: [
          "If children are being removed: Ask for the court order and note all details.",
          "Request information on where children will be placed.",
          "Immediately contact an attorney — many offer emergency consultations.",
          "Request a shelter care hearing (typically within 72 hours).",
          "Gather all documentation of your parenting and children's wellbeing.",
          "Identify relatives who may be approved for placement."
        ]
      },
      safetyPlanning: {
        title: "Safety Planning",
        content: [
          "Identify trusted family members who could provide temporary care if needed.",
          "Keep important documents organized and accessible (birth certificates, medical records).",
          "Build a support network of people who can vouch for your parenting.",
          "Know the contact information for family law attorneys before you need one.",
          "Create a communication log template for documenting all CPS interactions.",
          "Connect with parent advocacy groups for support and information."
        ]
      }
    }
  },
  housing: {
    id: "housing",
    label: "Housing",
    icon: "Home",
    sections: {
      overview: {
        title: "Overview",
        content: [
          "Tenant rights protect you from unfair practices by landlords and property managers.",
          "Housing law varies significantly by state and locality — local ordinances may provide additional protections.",
          "Documentation is critical in housing disputes for establishing timelines and proving violations.",
          "Many housing issues have specific timelines and procedures for addressing complaints."
        ]
      },
      rights: {
        title: "Your Rights",
        content: [
          "You have the right to habitable housing that meets health and safety codes.",
          "You have the right to privacy — landlords must provide notice before entering (usually 24-48 hours).",
          "You have the right to be free from discrimination based on protected characteristics.",
          "You have the right to organize with other tenants and participate in tenant unions.",
          "You have the right to proper eviction procedures — 'self-help' evictions are illegal.",
          "You have the right to have your security deposit returned within legal timeframes."
        ]
      },
      commonScenarios: {
        title: "Common Scenarios",
        content: [
          "Repair requests: Document in writing, give reasonable time, and know when rent withholding is legal.",
          "Eviction notices: Check that notice periods and reasons comply with local law.",
          "Lease renewals: Understand rent increase limits in rent-controlled areas.",
          "Discrimination: Document instances and file complaints with HUD or local fair housing agencies.",
          "Security deposits: Know your state's laws on deductions and return timelines."
        ]
      },
      whatToDo: {
        title: "What To Do",
        content: [
          "Put all requests and complaints in writing and keep copies.",
          "Document conditions with dated photos and videos.",
          "Pay rent on time and keep receipts or use traceable payment methods.",
          "Review your lease carefully and understand all terms.",
          "Respond promptly to any notices from your landlord.",
          "Seek legal advice before withholding rent or taking self-help measures."
        ]
      },
      whatNotToDo: {
        title: "What Not To Do",
        content: [
          "Do not stop paying rent without legal guidance — even if repairs are needed.",
          "Do not make unauthorized alterations or repairs without documentation.",
          "Do not ignore eviction notices — respond within the legal timeframe.",
          "Do not retaliate against landlords with property damage.",
          "Do not move out before understanding your lease obligations.",
          "Do not rely solely on verbal agreements — get everything in writing."
        ]
      },
      documentationTips: {
        title: "Documentation Tips",
        content: [
          "Keep a copy of your signed lease and all amendments.",
          "Photograph the unit at move-in and move-out with timestamps.",
          "Save all correspondence with landlord (emails, texts, letters).",
          "Document repair requests with dates sent and landlord responses.",
          "Keep records of all rent payments with confirmation numbers.",
          "Note witnesses to any verbal agreements or incidents."
        ]
      },
      evidencePreservation: {
        title: "Evidence Preservation",
        content: [
          "Create backup copies of all housing documents in cloud storage.",
          "Save original condition reports and inspection documents.",
          "Preserve evidence of habitability issues (mold, pests, broken systems).",
          "Keep records of any health impacts from housing conditions.",
          "Document communication attempts and landlord non-response.",
          "Save evidence of discriminatory statements or treatment."
        ]
      },
      reportingComplaints: {
        title: "Reporting & Complaints",
        content: [
          "File complaints with local housing authorities for code violations.",
          "Contact HUD for federal fair housing violations.",
          "File with your state's tenant protection agency.",
          "Reach out to local tenant unions and housing advocacy organizations.",
          "Consult with a housing attorney or legal aid for serious violations.",
          "Document all complaints filed and responses received."
        ]
      },
      resources: {
        title: "Legal & Community Resources",
        content: [
          "HUD (Department of Housing and Urban Development) — Fair housing enforcement.",
          "Local legal aid societies — Free legal assistance for qualifying tenants.",
          "Tenant unions and housing advocacy organizations.",
          "State tenant protection agencies and hotlines.",
          "Community mediation services for landlord-tenant disputes.",
          "Housing counseling agencies approved by HUD."
        ]
      },
      emergencyActions: {
        title: "Emergency Actions",
        content: [
          "If locked out illegally: Call police and document the illegal lockout.",
          "If utilities are shut off illegally: Document and contact local code enforcement.",
          "If you receive an eviction notice: Respond within the legal timeframe.",
          "If facing immediate homelessness: Contact emergency housing services.",
          "For dangerous conditions: Document and contact code enforcement immediately.",
          "If discriminated against: File a complaint within one year of the incident."
        ]
      },
      safetyPlanning: {
        title: "Safety Planning",
        content: [
          "Know emergency housing resources in your area before you need them.",
          "Keep important documents in a safe, accessible location.",
          "Build relationships with neighbors who can be witnesses if needed.",
          "Know the contact information for legal aid before a crisis.",
          "Understand your lease termination options if safety becomes a concern.",
          "Identify trusted people who could provide temporary housing if needed."
        ]
      }
    }
  },
  courts: {
    id: "courts",
    label: "Courts",
    icon: "Scale",
    sections: {
      overview: {
        title: "Overview",
        content: [
          "The court system can be complex and intimidating, but understanding the basics helps you navigate it.",
          "Courts follow specific procedures and timelines that must be respected.",
          "You have constitutional rights in court proceedings that protect you throughout the process.",
          "Self-represented parties can succeed with proper preparation and understanding of procedures."
        ]
      },
      rights: {
        title: "Your Rights",
        content: [
          "You have the right to access the courts and have your case heard.",
          "You have the right to an interpreter if you don't speak English fluently.",
          "You have the right to represent yourself (pro se) in most proceedings.",
          "You have the right to an attorney in criminal cases if you cannot afford one.",
          "You have the right to present evidence and question witnesses.",
          "You have the right to appeal decisions in most cases."
        ]
      },
      commonScenarios: {
        title: "Common Scenarios",
        content: [
          "Small claims court: Simplified procedures for disputes under a certain dollar amount.",
          "Family court: Handles custody, divorce, child support, and protection orders.",
          "Civil court: Personal injury, contracts, property disputes, and more.",
          "Criminal court: Arraignment, pre-trial motions, plea negotiations, and trials.",
          "Administrative hearings: Benefits appeals, licensing issues, and agency decisions."
        ]
      },
      whatToDo: {
        title: "What To Do",
        content: [
          "Arrive early and dress appropriately for court appearances.",
          "Bring organized copies of all relevant documents.",
          "Address the judge as 'Your Honor' and wait to be spoken to.",
          "Answer questions directly and honestly.",
          "Take notes during proceedings for your records.",
          "Follow all court orders immediately, even if you plan to appeal."
        ]
      },
      whatNotToDo: {
        title: "What Not To Do",
        content: [
          "Do not miss court dates — this can result in default judgments or warrants.",
          "Do not interrupt the judge, opposing party, or witnesses.",
          "Do not bring weapons, recording devices, or prohibited items.",
          "Do not discuss your case in hallways where others can hear.",
          "Do not make arguments based on emotion rather than facts and law.",
          "Do not ignore court orders even if you disagree with them."
        ]
      },
      documentationTips: {
        title: "Documentation Tips",
        content: [
          "Organize documents chronologically with clear labels.",
          "Bring three copies of exhibits (for you, opposing party, and the judge).",
          "Create a summary sheet of key facts and dates.",
          "Keep a timeline of events relevant to your case.",
          "Document all court dates, deadlines, and requirements.",
          "Save all filings with date stamps from the clerk."
        ]
      },
      evidencePreservation: {
        title: "Evidence Preservation",
        content: [
          "Preserve all original documents — do not write on originals.",
          "Authenticate electronic evidence with metadata when possible.",
          "Organize physical evidence in a secure location.",
          "Create backup copies of all important documents.",
          "Obtain certified copies of official records when needed.",
          "Preserve witness contact information and statements."
        ]
      },
      reportingComplaints: {
        title: "Reporting & Complaints",
        content: [
          "File complaints about attorneys with the state bar association.",
          "File complaints about judges with the judicial conduct commission.",
          "Report court staff misconduct to the court administrator.",
          "Contact legal aid for help with procedural violations.",
          "Document all issues with specific dates and details.",
          "Know appeal deadlines — they are strictly enforced."
        ]
      },
      resources: {
        title: "Legal & Community Resources",
        content: [
          "Court self-help centers — Free assistance with forms and procedures.",
          "Legal aid societies — Free or low-cost legal representation.",
          "Law libraries — Access to legal resources and research assistance.",
          "Pro bono attorney programs — Free legal help from volunteer attorneys.",
          "Court facilitators — Guidance on family court procedures.",
          "Online court resources and instructional videos."
        ]
      },
      emergencyActions: {
        title: "Emergency Actions",
        content: [
          "If you miss a court date: Contact the court immediately and explain the circumstances.",
          "If arrested on a warrant: Comply with officers and contact an attorney immediately.",
          "If served with papers: Note the deadline and respond before it expires.",
          "If you need emergency relief: Ask about ex parte motions or emergency hearings.",
          "If you can't afford filing fees: Ask about fee waivers.",
          "If you need more time: File a motion for continuance before the deadline."
        ]
      }
    }
  },
  benefits: {
    id: "benefits",
    label: "Benefits",
    icon: "Wallet",
    sections: {
      overview: {
        title: "Overview",
        content: [
          "Public benefits programs help people meet basic needs including food, healthcare, housing, and income.",
          "Each program has specific eligibility requirements, application processes, and appeal rights.",
          "Denials and reductions can be appealed — understanding the process improves outcomes.",
          "Documentation is essential for applications and appeals."
        ]
      },
      rights: {
        title: "Your Rights",
        content: [
          "You have the right to apply for benefits and receive a decision within specified timeframes.",
          "You have the right to receive written notice of decisions with explanations.",
          "You have the right to appeal denials and reductions.",
          "You have the right to continue benefits during appeal in many cases.",
          "You have the right to request accommodations for disabilities.",
          "You have the right to receive information in your preferred language."
        ]
      },
      commonScenarios: {
        title: "Common Scenarios",
        content: [
          "SNAP (food stamps): Income-based food assistance with work requirements for some.",
          "Medicaid: Healthcare coverage based on income and household composition.",
          "SSI/SSDI: Disability benefits requiring medical documentation and work history.",
          "TANF: Temporary cash assistance with time limits and work requirements.",
          "Unemployment: Wage replacement for those who lost jobs through no fault of their own."
        ]
      },
      whatToDo: {
        title: "What To Do",
        content: [
          "Apply promptly — benefits often start from the application date.",
          "Provide complete and accurate information on applications.",
          "Keep copies of everything you submit.",
          "Respond to requests for information within deadlines.",
          "Report changes in income or household composition as required.",
          "Appeal denials within the specified timeframe."
        ]
      },
      whatNotToDo: {
        title: "What Not To Do",
        content: [
          "Do not provide false information — this can result in fraud charges.",
          "Do not miss deadlines for submitting documents or appeals.",
          "Do not ignore notices from benefit agencies.",
          "Do not assume initial denials are final — most can be appealed.",
          "Do not give up if the process is confusing — seek help.",
          "Do not cash checks for benefits you know you're not entitled to."
        ]
      },
      documentationTips: {
        title: "Documentation Tips",
        content: [
          "Keep copies of all applications, correspondence, and submitted documents.",
          "Document dates of all submissions and contacts with agencies.",
          "Save confirmation numbers and names of people you speak with.",
          "Organize medical records chronologically for disability claims.",
          "Keep pay stubs, tax returns, and income documentation accessible.",
          "Create a timeline of events for appeal hearings."
        ]
      },
      evidencePreservation: {
        title: "Evidence Preservation",
        content: [
          "Save all written notices and decisions from agencies.",
          "Preserve voicemails and phone records of agency contacts.",
          "Keep original medical records and obtain copies for submissions.",
          "Document how your condition affects daily activities for disability claims.",
          "Save evidence of job search activities for work-related requirements.",
          "Keep records of all benefits received and reporting made."
        ]
      },
      reportingComplaints: {
        title: "Reporting & Complaints",
        content: [
          "File formal appeals within the timeframe stated in denial notices.",
          "Request supervisory review for unresolved issues.",
          "Contact your state's health and human services ombudsman.",
          "File complaints with the state agency overseeing the program.",
          "Contact legal aid for help with appeals and systemic issues.",
          "Report fraud or abuse through official agency channels."
        ]
      },
      resources: {
        title: "Legal & Community Resources",
        content: [
          "Legal aid organizations specializing in public benefits.",
          "Community action agencies for application assistance.",
          "Disability rights organizations for SSI/SSDI appeals.",
          "State and local social services agencies.",
          "Benefits counseling through community organizations.",
          "National organizations for specific benefit programs."
        ]
      },
      emergencyActions: {
        title: "Emergency Actions",
        content: [
          "If benefits are cut off suddenly: Request a fair hearing immediately to continue benefits.",
          "If you're denied: Note the appeal deadline in the notice and act quickly.",
          "If you're facing hunger: Contact food banks while waiting for SNAP.",
          "If you're facing homelessness: Contact emergency housing services.",
          "If you can't pay medical bills: Ask about charity care and payment plans.",
          "If you need immediate help: Contact 211 for local emergency resources."
        ]
      }
    }
  },
  immigration: {
    id: "immigration",
    label: "Immigration",
    icon: "Globe",
    sections: {
      overview: {
        title: "Overview",
        content: [
          "Immigration law is complex and constantly changing — staying informed is essential.",
          "Immigration status affects access to work, benefits, travel, and more.",
          "Enforcement actions have specific procedures and rights that apply regardless of status.",
          "Legal representation significantly improves outcomes in immigration proceedings."
        ]
      },
      rights: {
        title: "Your Rights",
        content: [
          "You have the right to remain silent and do not have to discuss your immigration status.",
          "You have the right to refuse consent to searches of your person and belongings.",
          "You have the right to speak with an attorney before answering questions.",
          "You have the right to a hearing before an immigration judge in most cases.",
          "You have constitutional protections regardless of immigration status.",
          "You have the right not to sign documents you don't understand."
        ]
      },
      commonScenarios: {
        title: "Common Scenarios",
        content: [
          "Workplace raids: You have the right to remain silent and can refuse to sign documents.",
          "Traffic stops: Immigration status questions are generally not required for driver's licenses.",
          "Home visits: ICE needs a judicial warrant (not an administrative warrant) to enter without consent.",
          "Detention: You have the right to contact your consulate and an attorney.",
          "Court proceedings: You have the right to present your case and appeal decisions."
        ]
      },
      whatToDo: {
        title: "What To Do",
        content: [
          "Carry emergency contact information including an immigration attorney.",
          "Know your rights and practice asserting them calmly.",
          "Keep important documents in a safe, accessible location.",
          "Create a family emergency plan in case of detention.",
          "Consult with an immigration attorney about your specific situation.",
          "Stay informed about changes in immigration law and enforcement priorities."
        ]
      },
      whatNotToDo: {
        title: "What Not To Do",
        content: [
          "Do not lie about your immigration status or use false documents.",
          "Do not sign documents you don't understand.",
          "Do not flee or resist if approached by immigration officers.",
          "Do not carry documents from other countries unless necessary.",
          "Do not miss immigration court dates — this results in deportation orders.",
          "Do not work with notarios who claim to be lawyers but are not."
        ]
      },
      documentationTips: {
        title: "Documentation Tips",
        content: [
          "Keep copies of all immigration documents in a secure location.",
          "Document your presence in the US with dated records (bills, taxes, etc.).",
          "Save evidence of family ties and community connections.",
          "Keep records of any criminal history and court documents.",
          "Document any persecution or danger in your home country.",
          "Keep medical records, especially for any conditions affecting proceedings."
        ]
      },
      evidencePreservation: {
        title: "Evidence Preservation",
        content: [
          "Preserve evidence of continuous presence in the United States.",
          "Save documents showing family relationships (birth certificates, marriage licenses).",
          "Keep records of employment, taxes, and community involvement.",
          "Document conditions in your home country for asylum claims.",
          "Preserve evidence of any crimes committed against you.",
          "Keep character references from community members."
        ]
      },
      reportingComplaints: {
        title: "Reporting & Complaints",
        content: [
          "Report civil rights violations to the DHS Office of Civil Rights and Civil Liberties.",
          "File complaints about detention conditions with ICE oversight offices.",
          "Contact the Office of the Inspector General for serious misconduct.",
          "Report fraud by immigration service providers to state bar associations.",
          "Document all interactions with immigration officers.",
          "Contact immigrant rights organizations for support and advocacy."
        ]
      },
      resources: {
        title: "Legal & Community Resources",
        content: [
          "Immigration legal aid organizations in your area.",
          "Consulates and embassy services for your country of origin.",
          "Know Your Rights training organizations.",
          "Immigrant rights coalitions and advocacy groups.",
          "Family preparedness resources and planning guides.",
          "Bond funds for detained immigrants."
        ]
      },
      emergencyActions: {
        title: "Emergency Actions",
        content: [
          "If detained: State 'I wish to remain silent' and 'I want to speak with a lawyer.'",
          "Contact your consulate and an immigration attorney immediately.",
          "Do not sign any documents until you speak with an attorney.",
          "Memorize the phone number of an immigration attorney or hotline.",
          "Ensure someone knows how to access your important documents.",
          "Have a power of attorney prepared for someone to care for dependents."
        ]
      },
      safetyPlanning: {
        title: "Safety Planning",
        content: [
          "Create a family safety plan including care for children.",
          "Designate trusted people with access to important documents.",
          "Carry a know-your-rights card at all times.",
          "Have emergency contacts memorized, not just in your phone.",
          "Know the location of immigrant-friendly legal services.",
          "Stay connected with community organizations for support."
        ]
      }
    }
  },
  schools: {
    id: "schools",
    label: "Schools",
    icon: "GraduationCap",
    sections: {
      overview: {
        title: "Overview",
        content: [
          "Students have constitutional rights that don't disappear at the schoolhouse gate.",
          "Parents and guardians have rights to participate in their children's education.",
          "Special education laws provide additional protections for students with disabilities.",
          "School discipline must follow due process requirements."
        ]
      },
      rights: {
        title: "Your Rights",
        content: [
          "Students have free speech rights, though schools can regulate some expression.",
          "Students are protected from unreasonable searches and seizures.",
          "Students have due process rights before serious disciplinary actions.",
          "Students with disabilities have rights to appropriate education and accommodations.",
          "Parents have rights to access educational records and participate in decisions.",
          "Students cannot be discriminated against based on protected characteristics."
        ]
      },
      commonScenarios: {
        title: "Common Scenarios",
        content: [
          "Discipline: Schools must follow procedures before suspensions and expulsions.",
          "Special education: IEP meetings, evaluations, and placement decisions.",
          "Bullying: Schools must respond appropriately to reported harassment.",
          "Police in schools: Student rights during school-based police interactions.",
          "Records: Access to grades, disciplinary records, and special education documents."
        ]
      },
      whatToDo: {
        title: "What To Do",
        content: [
          "Document all communications with schools in writing.",
          "Attend IEP meetings and request copies of all documents.",
          "Request written explanations for disciplinary decisions.",
          "Report bullying and discrimination in writing.",
          "Know the grievance procedures for your school district.",
          "Seek advocacy support for special education disputes."
        ]
      },
      whatNotToDo: {
        title: "What Not To Do",
        content: [
          "Do not sign documents you don't understand, especially IEPs.",
          "Do not let schools pressure you into decisions without time to consider.",
          "Do not ignore notices of meetings or hearings.",
          "Do not assume schools always have your child's best interest in mind.",
          "Do not waive rights without understanding the consequences.",
          "Do not confront other parents directly about bullying — use school channels."
        ]
      },
      documentationTips: {
        title: "Documentation Tips",
        content: [
          "Keep all report cards, IEPs, and evaluation reports.",
          "Document meetings with notes on who attended and what was discussed.",
          "Save emails and letters from school officials.",
          "Keep a log of incidents (bullying, discipline, etc.) with dates.",
          "Request written confirmation of verbal conversations.",
          "Take photos of relevant items (injuries, damaged property, etc.)."
        ]
      },
      evidencePreservation: {
        title: "Evidence Preservation",
        content: [
          "Save all electronic communications and text messages.",
          "Preserve physical evidence of bullying or harassment.",
          "Keep copies of all special education evaluations and reports.",
          "Document patterns of discriminatory treatment.",
          "Save social media posts relevant to incidents.",
          "Keep attendance records and any related documentation."
        ]
      },
      reportingComplaints: {
        title: "Reporting & Complaints",
        content: [
          "File complaints with the school principal first, then district level.",
          "Contact the Office for Civil Rights (OCR) for discrimination complaints.",
          "File due process complaints for special education disputes.",
          "Contact state education agencies for systemic issues.",
          "Report unsafe conditions to appropriate authorities.",
          "Document all complaints and responses received."
        ]
      },
      resources: {
        title: "Legal & Community Resources",
        content: [
          "Parent Training and Information Centers (PTIs) for special education.",
          "Office for Civil Rights (OCR) for discrimination complaints.",
          "Education law attorneys and legal aid organizations.",
          "Parent advocacy organizations in your state.",
          "School board meeting attendance for systemic advocacy.",
          "State special education dispute resolution services."
        ]
      },
      emergencyActions: {
        title: "Emergency Actions",
        content: [
          "If your child is suspended: Request a hearing and review all documentation.",
          "If an IEP isn't being followed: Document and request an IEP meeting.",
          "If your child is bullied: Report in writing and request the school's response.",
          "If your child is arrested at school: Contact an attorney immediately.",
          "If facing expulsion: Request a formal hearing and consider legal representation.",
          "If there's a safety threat: Contact school administration and police if necessary."
        ]
      }
    }
  },
  disability: {
    id: "disability",
    label: "Disability",
    icon: "Accessibility",
    sections: {
      overview: {
        title: "Overview",
        content: [
          "Disability rights laws protect people with disabilities from discrimination in many areas of life.",
          "The ADA, Section 504, and other laws require accommodations in employment, education, and public services.",
          "Reasonable accommodations must be provided unless they cause undue hardship.",
          "Documentation of disability and needed accommodations is important for enforcement."
        ]
      },
      rights: {
        title: "Your Rights",
        content: [
          "You have the right to reasonable accommodations in employment.",
          "You have the right to accessible public facilities and services.",
          "You have the right to accessible housing and reasonable modifications.",
          "You have the right to participate in government programs and services.",
          "You have the right to be free from discrimination based on disability.",
          "You have the right to confidentiality of your medical information."
        ]
      },
      commonScenarios: {
        title: "Common Scenarios",
        content: [
          "Employment: Requesting accommodations, facing discrimination in hiring or firing.",
          "Housing: Requesting modifications, emotional support animals, accessible features.",
          "Education: IEPs, 504 plans, college accommodations.",
          "Public access: Inaccessible businesses, lack of assistive services.",
          "Benefits: SSI/SSDI applications and appeals, Medicaid services."
        ]
      },
      whatToDo: {
        title: "What To Do",
        content: [
          "Request accommodations in writing and keep copies.",
          "Document the interactive process with employers or institutions.",
          "Obtain documentation from healthcare providers supporting your needs.",
          "Know the specific laws that apply to your situation (ADA, FHAA, IDEA, etc.).",
          "Engage with the interactive process in good faith.",
          "Report violations to appropriate enforcement agencies."
        ]
      },
      whatNotToDo: {
        title: "What Not To Do",
        content: [
          "Do not assume accommodations will be provided without requesting them.",
          "Do not accept 'no' without exploring alternative accommodations.",
          "Do not provide more medical information than necessary.",
          "Do not miss deadlines for filing complaints or appeals.",
          "Do not give up because the process is complicated.",
          "Do not let others define what accommodations you need without input."
        ]
      },
      documentationTips: {
        title: "Documentation Tips",
        content: [
          "Keep all medical records and evaluations in an organized system.",
          "Document all accommodation requests with dates and responses.",
          "Save communications about your disability and accommodations.",
          "Keep records of how your disability affects daily activities.",
          "Document denials of accommodation or access.",
          "Maintain a timeline of events for any disputes."
        ]
      },
      evidencePreservation: {
        title: "Evidence Preservation",
        content: [
          "Preserve all written accommodation requests and responses.",
          "Save medical documentation supporting your needs.",
          "Document inaccessible conditions with photos and descriptions.",
          "Keep records of denied services or opportunities.",
          "Save evidence of discriminatory statements or treatment.",
          "Document the impact of denied accommodations."
        ]
      },
      reportingComplaints: {
        title: "Reporting & Complaints",
        content: [
          "File ADA complaints with the Department of Justice or relevant agency.",
          "File employment discrimination complaints with the EEOC.",
          "File housing discrimination complaints with HUD.",
          "Contact Disability Rights organizations in your state.",
          "File education complaints with the Office for Civil Rights.",
          "Consult with a disability rights attorney for complex cases."
        ]
      },
      resources: {
        title: "Legal & Community Resources",
        content: [
          "Protection and Advocacy organizations in each state.",
          "Disability Rights Legal Center and similar organizations.",
          "Centers for Independent Living for community support.",
          "Job Accommodation Network (JAN) for workplace accommodations.",
          "EEOC for employment discrimination resources.",
          "National disability rights organizations for your specific disability."
        ]
      },
      emergencyActions: {
        title: "Emergency Actions",
        content: [
          "If terminated for disability-related reasons: Document everything and contact an attorney.",
          "If denied emergency medical care: File a complaint and seek alternative care.",
          "If evicted for disability-related reasons: Contact a housing attorney immediately.",
          "If denied essential services: Document and escalate to supervisory level.",
          "If facing loss of benefits: File an appeal before the deadline.",
          "If facing institutional placement: Contact a disability rights organization."
        ]
      }
    }
  },
  "domestic-violence": {
    id: "domestic-violence",
    label: "Domestic Violence",
    icon: "Heart",
    sections: {
      overview: {
        title: "Overview",
        content: [
          "Domestic violence includes physical, emotional, financial, and other forms of abuse.",
          "Safety planning is essential — leaving can be the most dangerous time.",
          "Legal protections exist including protection orders and emergency housing.",
          "Survivors have rights and resources, though navigating systems can be challenging."
        ]
      },
      rights: {
        title: "Your Rights",
        content: [
          "You have the right to seek protection orders against abusers.",
          "You have the right to emergency housing and shelter services.",
          "You have the right to keep your address confidential through address confidentiality programs.",
          "You have the right to leave a lease early for safety reasons in many states.",
          "You have employment protections for domestic violence-related absences in many states.",
          "You have the right to access victim advocates in court proceedings."
        ]
      },
      commonScenarios: {
        title: "Common Scenarios",
        content: [
          "Protection orders: Requesting temporary and permanent orders for safety.",
          "Custody disputes: Addressing abuse in custody and visitation decisions.",
          "Housing: Breaking leases, accessing emergency shelter, long-term housing.",
          "Employment: Job protections, confidentiality, and schedule flexibility.",
          "Immigration: VAWA protections for immigrant survivors."
        ]
      },
      whatToDo: {
        title: "What To Do",
        content: [
          "Create a safety plan with a domestic violence advocate.",
          "Document abuse through photos, journals, and saved messages.",
          "Identify safe places and people you can go to.",
          "Keep important documents and emergency supplies accessible.",
          "Contact local domestic violence hotlines for resources and support.",
          "Consider consulting with an attorney about legal options."
        ]
      },
      whatNotToDo: {
        title: "What Not To Do",
        content: [
          "Do not announce your departure plans to the abuser.",
          "Do not delete evidence of abuse.",
          "Do not let anyone pressure you to leave before you're ready.",
          "Do not share your location with people connected to the abuser.",
          "Do not assume the first protection order hearing is the only chance.",
          "Do not stop documenting if abuse continues after separation."
        ]
      },
      documentationTips: {
        title: "Documentation Tips",
        content: [
          "Keep a private journal of abusive incidents with dates and details.",
          "Photograph injuries with date stamps.",
          "Save threatening texts, emails, and voicemails.",
          "Document destruction of property.",
          "Keep records of police reports and medical visits.",
          "Save evidence of financial abuse and control."
        ]
      },
      evidencePreservation: {
        title: "Evidence Preservation",
        content: [
          "Store documentation in a safe location the abuser cannot access.",
          "Create cloud backups that are password protected.",
          "Give copies to a trusted person.",
          "Preserve evidence of stalking and monitoring.",
          "Screenshot social media posts and messages.",
          "Keep records of witness information."
        ]
      },
      reportingComplaints: {
        title: "Reporting & Complaints",
        content: [
          "File for protection orders through your local court.",
          "Report crimes to police and request victim advocate support.",
          "Contact domestic violence hotlines for guidance and resources.",
          "Report violations of protection orders immediately.",
          "File complaints about inadequate police response.",
          "Contact victim advocacy organizations for systems navigation."
        ]
      },
      resources: {
        title: "Legal & Community Resources",
        content: [
          "National Domestic Violence Hotline: 1-800-799-7233.",
          "Local domestic violence shelters and programs.",
          "Legal aid organizations with domestic violence expertise.",
          "Victim advocacy services through prosecutors' offices.",
          "Address Confidentiality Programs in your state.",
          "Domestic violence-specific housing programs."
        ]
      },
      emergencyActions: {
        title: "Emergency Actions",
        content: [
          "If in immediate danger: Call 911 or go to a safe location.",
          "If leaving an abuser: Activate your safety plan with support.",
          "If a protection order is violated: Call police immediately.",
          "If you need emergency shelter: Contact the domestic violence hotline.",
          "If children are involved: Consult with an advocate about custody safety.",
          "If your location is discovered: Contact advocates for relocation support."
        ]
      },
      safetyPlanning: {
        title: "Safety Planning",
        content: [
          "Identify safe places you can go at any time of day or night.",
          "Pack an emergency bag with important documents, clothes, and supplies.",
          "Memorize important phone numbers in case you don't have your phone.",
          "Create a code word with trusted people to signal you need help.",
          "Know the location of domestic violence resources in your area.",
          "Have a plan for pets if you may need to leave suddenly.",
          "Consider new accounts and devices the abuser doesn't know about.",
          "Plan for children's safety including school notification if needed."
        ]
      }
    }
  },
  "child-welfare": {
    id: "child-welfare",
    label: "Child Welfare",
    icon: "Baby",
    sections: {
      overview: {
        title: "Overview",
        content: [
          "The child welfare system includes foster care, adoption, and family preservation services.",
          "Parents and children have rights throughout child welfare proceedings.",
          "The goal of most cases is family reunification when safely possible.",
          "Understanding the system helps families navigate it more effectively."
        ]
      },
      rights: {
        title: "Your Rights",
        content: [
          "Parents have the right to an attorney in dependency proceedings.",
          "Parents have the right to participate in case planning and decisions.",
          "Parents have the right to visit with their children in foster care.",
          "Children have the right to be heard in court proceedings.",
          "Foster youth have education stability and other specific rights.",
          "Families have the right to culturally appropriate services."
        ]
      },
      commonScenarios: {
        title: "Common Scenarios",
        content: [
          "Dependency petitions: Court filings alleging abuse or neglect.",
          "Case planning: Service plans and requirements for reunification.",
          "Visitation: Scheduling and conditions for parent-child visits.",
          "Permanency: Reunification, adoption, guardianship, or another planned permanent living arrangement.",
          "Aging out: Transition planning for youth leaving foster care."
        ]
      },
      whatToDo: {
        title: "What To Do",
        content: [
          "Engage an attorney as early as possible in the case.",
          "Participate fully in case planning and required services.",
          "Document your compliance with case plan requirements.",
          "Attend all scheduled visits and court hearings.",
          "Communicate concerns through proper channels.",
          "Build a support network of family and community members."
        ]
      },
      whatNotToDo: {
        title: "What Not To Do",
        content: [
          "Do not miss court dates or caseworker appointments.",
          "Do not violate visitation rules or safety plan requirements.",
          "Do not speak negatively about foster parents to children.",
          "Do not sign documents without attorney review.",
          "Do not give up on reunification without exploring all options.",
          "Do not make major decisions without consulting your attorney."
        ]
      },
      documentationTips: {
        title: "Documentation Tips",
        content: [
          "Keep copies of all case plans and court orders.",
          "Document completion of required services with certificates and letters.",
          "Keep a log of all visits and contacts with children.",
          "Save all correspondence with caseworkers and attorneys.",
          "Document compliance with case plan requirements.",
          "Keep records of housing stability and employment."
        ]
      },
      evidencePreservation: {
        title: "Evidence Preservation",
        content: [
          "Preserve evidence of case plan compliance.",
          "Save documentation of parent-child bonding.",
          "Keep records of appropriate home environment.",
          "Document any concerns about children's placement or treatment.",
          "Preserve evidence of changed circumstances.",
          "Keep records supporting reunification readiness."
        ]
      },
      reportingComplaints: {
        title: "Reporting & Complaints",
        content: [
          "Contact your attorney about concerns with the case.",
          "File complaints with the child welfare agency's grievance process.",
          "Contact the state ombudsman for child welfare concerns.",
          "Report concerns about children's placement to the caseworker and court.",
          "Contact foster care licensing for placement-related concerns.",
          "Reach out to parent advocacy organizations for support."
        ]
      },
      resources: {
        title: "Legal & Community Resources",
        content: [
          "Parent representation programs in your county.",
          "Family advocacy organizations.",
          "Parent mentor and peer support programs.",
          "Child welfare ombudsman offices.",
          "Foster youth advocacy organizations.",
          "Community-based family support services."
        ]
      },
      emergencyActions: {
        title: "Emergency Actions",
        content: [
          "If children are removed: Request immediate information about placement and next steps.",
          "If reunification is denied: Discuss appeal options with your attorney.",
          "If you have concerns about your children's placement: Report to caseworker and court.",
          "If a hearing is approaching: Prepare with your attorney thoroughly.",
          "If timelines are expiring: Discuss options for extensions or modifications.",
          "If facing termination of parental rights: Seek immediate legal consultation."
        ]
      }
    }
  },
  employment: {
    id: "employment",
    label: "Employment",
    icon: "Briefcase",
    sections: {
      overview: {
        title: "Overview",
        content: [
          "Employment law protects workers from discrimination, retaliation, and unfair treatment.",
          "Workers have rights regarding wages, working conditions, and workplace safety.",
          "Understanding your rights helps you recognize and address violations.",
          "Documentation is essential for employment-related claims."
        ]
      },
      rights: {
        title: "Your Rights",
        content: [
          "You have the right to be free from discrimination based on protected characteristics.",
          "You have the right to reasonable accommodations for disabilities and religious practices.",
          "You have the right to minimum wage and overtime pay under federal and state law.",
          "You have the right to a safe workplace free from recognized hazards.",
          "You have the right to report violations without retaliation.",
          "You have the right to organize and engage in collective action."
        ]
      },
      commonScenarios: {
        title: "Common Scenarios",
        content: [
          "Discrimination: Unfair treatment in hiring, firing, pay, or conditions based on protected status.",
          "Harassment: Hostile work environment or quid pro quo harassment.",
          "Wage theft: Unpaid wages, overtime violations, misclassification.",
          "Retaliation: Adverse actions for reporting violations or exercising rights.",
          "Accommodations: Disability or religious accommodation requests."
        ]
      },
      whatToDo: {
        title: "What To Do",
        content: [
          "Document incidents of discrimination or violations with dates and details.",
          "Report concerns through internal HR processes when appropriate.",
          "Request accommodations in writing and engage in interactive process.",
          "Keep copies of all employment documents (contracts, reviews, pay stubs).",
          "File complaints with appropriate agencies within deadlines.",
          "Consult with an employment attorney before signing agreements."
        ]
      },
      whatNotToDo: {
        title: "What Not To Do",
        content: [
          "Do not sign severance agreements without understanding what you're waiving.",
          "Do not discuss your claims with coworkers who might inform management.",
          "Do not delete work-related emails or documents.",
          "Do not miss filing deadlines for EEOC or state agency complaints.",
          "Do not assume internal HR will protect your interests.",
          "Do not retaliate against the employer or individuals involved."
        ]
      },
      documentationTips: {
        title: "Documentation Tips",
        content: [
          "Keep a detailed log of incidents with dates, times, witnesses, and what was said.",
          "Save all communications related to your employment and any disputes.",
          "Document performance reviews and feedback you've received.",
          "Keep pay stubs, time records, and any evidence of hours worked.",
          "Screenshot or print relevant emails and send copies to personal email.",
          "Note the names and positions of people involved in incidents."
        ]
      },
      evidencePreservation: {
        title: "Evidence Preservation",
        content: [
          "Forward relevant emails to personal accounts before losing access.",
          "Preserve voicemails and text messages related to employment.",
          "Keep original documents in a secure location.",
          "Document the chain of custody for any physical evidence.",
          "Preserve evidence of company policies and your personnel file.",
          "Save evidence of comparable treatment of other employees."
        ]
      },
      reportingComplaints: {
        title: "Reporting & Complaints",
        content: [
          "File with the EEOC for federal discrimination claims (180-300 day deadline).",
          "File with state civil rights agencies for state law claims.",
          "Report wage violations to the Department of Labor.",
          "Report safety hazards to OSHA.",
          "File workers' compensation claims for workplace injuries.",
          "Consult with an employment attorney about your options."
        ]
      },
      resources: {
        title: "Legal & Community Resources",
        content: [
          "EEOC — Federal employment discrimination enforcement.",
          "Department of Labor — Wage and hour enforcement.",
          "OSHA — Workplace safety enforcement.",
          "State labor departments and civil rights agencies.",
          "Employment law attorneys and legal aid organizations.",
          "Worker centers and labor advocacy organizations."
        ]
      },
      emergencyActions: {
        title: "Emergency Actions",
        content: [
          "If terminated: Request your personnel file and final pay immediately.",
          "If offered severance: Do not sign without reviewing with an attorney.",
          "If facing immediate discrimination: Document and report to HR.",
          "If injured at work: Report immediately and seek medical attention.",
          "If wages are being stolen: Calculate what you're owed and document.",
          "If facing retaliation: Document and consult an attorney immediately."
        ]
      }
    }
  }
};

export const topicList = Object.values(topicGuides).map(guide => ({
  id: guide.id,
  label: guide.label,
  icon: guide.icon
}));
