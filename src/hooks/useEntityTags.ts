// Entity-aware internal tags - NOT visible to users
export interface EntityTags {
  entity_type?: 'police' | 'sheriff' | 'state_patrol' | 'federal' | 'private_security' | 'corrections' | 'medical' | 'emt' | 'hospital' | 'clinic' | 'landlord' | 'property_mgmt' | 'public_housing' | 'cps' | 'dcyf' | 'court' | 'prosecutor' | 'school_district' | 'college' | 'other';
  medical_involved?: boolean;
  custody_status?: 'detained' | 'arrested' | 'not_detained' | 'unknown';
  use_of_force_flag?: boolean;
  vulnerable_person_flag?: boolean;
  law_enforcement_present?: boolean;
  care_issue_type?: 'delayed' | 'denied' | 'interrupted' | 'none';
  child_removed?: boolean;
  court_order_exists?: boolean;
  housing_type?: 'private' | 'public' | 'subsidized' | 'other';
  eviction_pending?: boolean;
  discipline_action?: boolean;
  special_education_involved?: boolean;
}

export interface EntityQuestion {
  id: string;
  question: string;
  options: { id: string; label: string }[];
  applyAnswer: (answer: string, tags: EntityTags) => EntityTags;
}

// System-specific entity clarifying questions
export const entityQuestions: Record<string, EntityQuestion[]> = {
  police: [
    {
      id: 'force-used',
      question: 'Do you remember if force was used?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        use_of_force_flag: answer === 'yes',
      }),
    },
    {
      id: 'medical-services',
      question: 'Do you recall if medical services were involved?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        medical_involved: answer === 'yes',
      }),
    },
    {
      id: 'detained-arrested',
      question: 'Do you remember if you were arrested or detained?',
      options: [
        { id: 'arrested', label: 'Yes — Arrested' },
        { id: 'detained', label: 'Yes — Detained but not arrested' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        custody_status: answer === 'arrested' ? 'arrested' : 
                        answer === 'detained' ? 'detained' : 
                        answer === 'no' ? 'not_detained' : 'unknown',
      }),
    },
    {
      id: 'children-present',
      question: 'Do you recall if children or vulnerable persons were present?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        vulnerable_person_flag: answer === 'yes',
      }),
    },
  ],
  
  healthcare: [
    {
      id: 'care-issue',
      question: 'Do you remember if care was delayed, denied, or interrupted?',
      options: [
        { id: 'delayed', label: 'Yes — Delayed' },
        { id: 'denied', label: 'Yes — Denied' },
        { id: 'interrupted', label: 'Yes — Interrupted' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        care_issue_type: answer === 'delayed' ? 'delayed' :
                         answer === 'denied' ? 'denied' :
                         answer === 'interrupted' ? 'interrupted' : 'none',
      }),
    },
    {
      id: 'law-enforcement-present',
      question: 'Do you recall if law enforcement was present?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        law_enforcement_present: answer === 'yes',
      }),
    },
    {
      id: 'vulnerable-person',
      question: 'Do you recall if this involved a child, elderly person, or someone with a disability?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        vulnerable_person_flag: answer === 'yes',
      }),
    },
  ],
  
  cps_dcyf: [
    {
      id: 'child-removed',
      question: 'Do you know if a child has been removed from the home?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        child_removed: answer === 'yes',
        vulnerable_person_flag: true,
      }),
    },
    {
      id: 'court-order',
      question: 'Do you recall if there is an existing court order?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        court_order_exists: answer === 'yes',
      }),
    },
    {
      id: 'law-enforcement-involved',
      question: 'Do you remember if law enforcement was involved?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        law_enforcement_present: answer === 'yes',
      }),
    },
  ],
  
  courts: [
    {
      id: 'custody-issue',
      question: 'Do you know if this involves custody of a child?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        vulnerable_person_flag: answer === 'yes',
      }),
    },
    {
      id: 'detention-related',
      question: 'Do you recall if you were detained or incarcerated related to this?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        custody_status: answer === 'yes' ? 'detained' : 'not_detained',
      }),
    },
    {
      id: 'medical-related',
      question: 'Do you remember if this involves a medical issue or competency question?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        medical_involved: answer === 'yes',
      }),
    },
  ],
  
  housing: [
    {
      id: 'housing-type',
      question: 'Do you know what type of housing this involves?',
      options: [
        { id: 'private', label: 'Private rental' },
        { id: 'public', label: 'Public housing' },
        { id: 'subsidized', label: 'Subsidized / Section 8' },
        { id: 'other', label: 'Other' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        housing_type: answer === 'private' ? 'private' :
                      answer === 'public' ? 'public' :
                      answer === 'subsidized' ? 'subsidized' : 'other',
      }),
    },
    {
      id: 'eviction-pending',
      question: 'Do you recall if there is an eviction notice or court action pending?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        eviction_pending: answer === 'yes',
      }),
    },
    {
      id: 'vulnerable-household',
      question: 'Do you know if there are children, elderly, or disabled persons in the household?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        vulnerable_person_flag: answer === 'yes',
      }),
    },
  ],
  
  school: [
    {
      id: 'special-education',
      question: 'Do you know if this involves special education services (IEP/504)?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        special_education_involved: answer === 'yes',
        vulnerable_person_flag: answer === 'yes',
      }),
    },
    {
      id: 'discipline-action',
      question: 'Do you recall if there is a suspension, expulsion, or discipline action?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        discipline_action: answer === 'yes',
      }),
    },
    {
      id: 'law-enforcement-school',
      question: 'Do you remember if law enforcement or a school resource officer was involved?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        law_enforcement_present: answer === 'yes',
      }),
    },
  ],
  
  government: [
    {
      id: 'benefits-related',
      question: 'Do you know if this involves benefits (DSHS, SSI, unemployment)?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        entity_type: answer === 'yes' ? 'other' : tags.entity_type,
      }),
    },
    {
      id: 'vulnerable-person-govt',
      question: 'Do you recall if you or a household member is elderly, disabled, or a child?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        vulnerable_person_flag: answer === 'yes',
      }),
    },
    {
      id: 'court-involved-govt',
      question: 'Do you remember if there is a related court case or hearing?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        court_order_exists: answer === 'yes',
      }),
    },
  ],
  
  jail: [
    {
      id: 'medical-jail',
      question: 'Do you recall if medical services were needed or requested?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        medical_involved: answer === 'yes',
        custody_status: 'detained',
      }),
    },
    {
      id: 'force-jail',
      question: 'Do you remember if force was used by staff?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        use_of_force_flag: answer === 'yes',
        custody_status: 'detained',
      }),
    },
    {
      id: 'vulnerable-jail',
      question: 'Do you know if there is a disability, mental health, or medical condition involved?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        vulnerable_person_flag: answer === 'yes',
      }),
    },
  ],
  
  employer: [
    {
      id: 'medical-employer',
      question: 'Do you recall if this involved a workplace injury or medical leave?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        medical_involved: answer === 'yes',
      }),
    },
    {
      id: 'disability-employer',
      question: 'Do you know if this involves a disability or accommodation request?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'unsure', label: 'I\'m not sure' },
      ],
      applyAnswer: (answer, tags) => ({
        ...tags,
        vulnerable_person_flag: answer === 'yes',
      }),
    },
  ],
};

// Get entity questions for a specific system
export function getEntityQuestionsForSystem(systemId: string): EntityQuestion[] {
  return entityQuestions[systemId] || [];
}

// Default empty tags
export function createEmptyEntityTags(): EntityTags {
  return {};
}
