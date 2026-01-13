import { useState } from 'react';
import { Building2, MapPin, Calendar, Tag, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CaseProfile, CivilRightsSystem } from '@/hooks/usePatternEngine';

interface CaseProfileFormProps {
  initialSystem: CivilRightsSystem;
  initialClaimTags: string[];
  onSave: (profile: CaseProfile) => Promise<boolean>;
  onAnalyze: (entity: string) => void;
  isAnalyzing: boolean;
}

const commonEntities: Record<CivilRightsSystem, string[]> = {
  police: ['Seattle Police Department', 'Tacoma Police Department', 'King County Sheriff', 'Pierce County Sheriff', 'Washington State Patrol'],
  housing: ['Seattle Housing Authority', 'King County Housing Authority', 'Private Landlord', 'Property Management Company'],
  cps_dcyf: ['Washington DCYF', 'King County DCYF', 'Pierce County DCYF', 'Snohomish County DCYF'],
  schools: ['Seattle Public Schools', 'Tacoma Public Schools', 'Private School', 'Community College', 'University'],
  healthcare: ['Harborview Medical Center', 'Virginia Mason', 'Swedish Medical', 'Providence', 'Kaiser Permanente'],
  benefits: ['DSHS', 'L&I', 'ESD', 'Social Security'],
  courts: ['King County Superior Court', 'Pierce County Superior Court', 'Municipal Court', 'Federal Court'],
  other: [],
};

const claimTagLabels: Record<string, string> = {
  excessive_force: 'Excessive Force',
  use_of_force: 'Use of Force',
  wrongful_arrest: 'Wrongful Arrest',
  false_imprisonment: 'False Imprisonment',
  unlawful_search: 'Unlawful Search',
  fourth_amendment: '4th Amendment',
  harassment: 'Harassment',
  racial_profiling: 'Racial Profiling',
  retaliation: 'Retaliation',
  first_amendment: '1st Amendment',
  discrimination: 'Discrimination',
  fair_housing: 'Fair Housing',
  wrongful_eviction: 'Wrongful Eviction',
  due_process: 'Due Process',
  habitability: 'Habitability',
  unsafe_conditions: 'Unsafe Conditions',
  ada_violation: 'ADA Violation',
  reasonable_accommodation: 'Reasonable Accommodation',
  procedural_violation: 'Procedural Violation',
  discipline_disparity: 'Discipline Disparity',
  special_education: 'Special Education',
  idea_violation: 'IDEA Violation',
  title_ix: 'Title IX',
  denied_care: 'Denied Care',
  medical_neglect: 'Medical Neglect',
  hipaa_violation: 'HIPAA Violation',
  privacy: 'Privacy',
  billing_fraud: 'Billing Issues',
  insurance_denial: 'Insurance Denial',
  physical_injury: 'Physical Injury',
  unlawful_removal: 'Unlawful Removal',
  civil_rights: 'Civil Rights',
};

export function CaseProfileForm({ 
  initialSystem, 
  initialClaimTags, 
  onSave, 
  onAnalyze,
  isAnalyzing 
}: CaseProfileFormProps) {
  const [entity, setEntity] = useState('');
  const [entityType, setEntityType] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationCounty, setLocationCounty] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialClaimTags);
  const [isSaving, setIsSaving] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const suggestions = commonEntities[initialSystem] || [];

  const handleEntitySelect = (e: string) => {
    setEntity(e);
    if (e.length > 2 && !hasAnalyzed) {
      onAnalyze(e);
      setHasAnalyzed(true);
    }
  };

  const handleEntityBlur = () => {
    if (entity.length > 2 && !hasAnalyzed) {
      onAnalyze(entity);
      setHasAnalyzed(true);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!entity.trim()) return;
    
    setIsSaving(true);
    const profile: CaseProfile = {
      system: initialSystem,
      entity: entity.trim(),
      entityType: entityType || undefined,
      claimTags: selectedTags,
      dateStart: dateStart || undefined,
      dateEnd: dateEnd || undefined,
      locationCity: locationCity || undefined,
      locationCounty: locationCounty || undefined,
      description: description || undefined,
    };
    
    await onSave(profile);
    setIsSaving(false);
  };

  return (
    <div className="p-6 rounded-2xl bg-card border border-border mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-primary" />
        Case Profile
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Adding details helps us check for patterns and tailor recommendations. All fields are optional except entity.
      </p>
      
      <div className="space-y-4">
        {/* Entity */}
        <div>
          <Label htmlFor="entity" className="text-foreground">
            Agency, Organization, or Entity Involved *
          </Label>
          <Input
            id="entity"
            value={entity}
            onChange={(e) => handleEntitySelect(e.target.value)}
            onBlur={handleEntityBlur}
            placeholder="e.g., Seattle Police Department, DCYF, landlord name"
            className="mt-1"
          />
          {suggestions.length > 0 && !entity && (
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestions.slice(0, 5).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleEntitySelect(s)}
                  className="text-xs px-2 py-1 rounded-full bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateStart" className="text-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Start Date
            </Label>
            <Input
              id="dateStart"
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="dateEnd" className="text-foreground">
              End Date
            </Label>
            <Input
              id="dateEnd"
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city" className="text-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              City
            </Label>
            <Input
              id="city"
              value={locationCity}
              onChange={(e) => setLocationCity(e.target.value)}
              placeholder="e.g., Seattle"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="county" className="text-foreground">
              County
            </Label>
            <Input
              id="county"
              value={locationCounty}
              onChange={(e) => setLocationCounty(e.target.value)}
              placeholder="e.g., King County"
              className="mt-1"
            />
          </div>
        </div>

        {/* Claim Tags */}
        <div>
          <Label className="text-foreground flex items-center gap-1 mb-2">
            <Tag className="w-3 h-3" />
            Issue Tags
          </Label>
          <div className="flex flex-wrap gap-2">
            {initialClaimTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary/20 border-primary/50 text-primary'
                    : 'bg-secondary border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                {claimTagLabels[tag] || tag}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-foreground">
            Brief Description (optional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief summary of what happened..."
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!entity.trim() || isSaving || isAnalyzing}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing patterns...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Case Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
