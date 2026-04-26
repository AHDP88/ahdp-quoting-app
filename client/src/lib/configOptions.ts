import * as defaultOptions from './dropdownOptions';

// Define categories for organizing options in the admin interface
export type OptionCategory = 
  | 'decking'
  | 'structure' 
  | 'roofing'
  | 'finishes'
  | 'fittings'
  | 'screening'
  | 'extras';

// Define a configuration option with all needed metadata
export interface ConfigOption {
  id: string;
  name: string;
  category: OptionCategory;
  description: string;
  options: string[];
  defaultOptions: string[];
}

// This array contains all configurable dropdown options with metadata
export const configOptions: ConfigOption[] = [
  {
    id: 'deckingTypeOptions',
    name: 'Decking Types',
    category: 'decking',
    description: 'Types of decking materials available',
    options: [...defaultOptions.deckingTypeOptions],
    defaultOptions: [...defaultOptions.deckingTypeOptions]
  },
  {
    id: 'timberBoardTypeOptions',
    name: 'Timber Board Types',
    category: 'decking',
    description: 'Types of timber boards available',
    options: [...defaultOptions.timberBoardTypeOptions],
    defaultOptions: [...defaultOptions.timberBoardTypeOptions]
  },
  {
    id: 'compositeBoardTypeOptions',
    name: 'Composite Board Types',
    category: 'decking',
    description: 'Types of composite boards available',
    options: [...defaultOptions.compositeBoardTypeOptions],
    defaultOptions: [...defaultOptions.compositeBoardTypeOptions]
  },
  {
    id: 'otherBoardTypeOptions',
    name: 'Other Board Types',
    category: 'decking',
    description: 'Other types of boards available',
    options: [...defaultOptions.otherBoardTypeOptions],
    defaultOptions: [...defaultOptions.otherBoardTypeOptions]
  },
  {
    id: 'fixingTypeOptions',
    name: 'Fixing Types',
    category: 'decking',
    description: 'Types of fixings available for decking',
    options: [...defaultOptions.fixingTypeOptions],
    defaultOptions: [...defaultOptions.fixingTypeOptions]
  },
  {
    id: 'fasciaRequiredOptions',
    name: 'Fascia Types',
    category: 'decking',
    description: 'Types of fascia options available',
    options: [...defaultOptions.fasciaRequiredOptions],
    defaultOptions: [...defaultOptions.fasciaRequiredOptions]
  },
  {
    id: 'framTimberTypeOptions',
    name: 'Frame Timber Types',
    category: 'structure',
    description: 'Types of timber for framing',
    options: [...defaultOptions.framTimberTypeOptions],
    defaultOptions: [...defaultOptions.framTimberTypeOptions]
  },
  {
    id: 'timberPostSizeOptions',
    name: 'Timber Post Sizes',
    category: 'structure',
    description: 'Available timber post sizes',
    options: [...defaultOptions.timberPostSizeOptions],
    defaultOptions: [...defaultOptions.timberPostSizeOptions]
  },
  {
    id: 'steelPostSizeOptions',
    name: 'Steel Post Sizes',
    category: 'structure',
    description: 'Available steel post sizes',
    options: [...defaultOptions.steelPostSizeOptions],
    defaultOptions: [...defaultOptions.steelPostSizeOptions]
  },
  {
    id: 'structureTypeOptions',
    name: 'Structure Types',
    category: 'structure',
    description: 'Types of structures available',
    options: [...defaultOptions.structureTypeOptions],
    defaultOptions: [...defaultOptions.structureTypeOptions]
  },
  {
    id: 'structureMaterialOptions',
    name: 'Structure Materials',
    category: 'structure',
    description: 'Available structure materials',
    options: [...defaultOptions.structureMaterialOptions],
    defaultOptions: [...defaultOptions.structureMaterialOptions]
  },
  {
    id: 'verandahStyleOptions',
    name: 'Verandah Styles',
    category: 'structure',
    description: 'Available verandah styles',
    options: [...defaultOptions.verandahStyleOptions],
    defaultOptions: [...defaultOptions.verandahStyleOptions]
  },
  {
    id: 'verandahFixedByOptions',
    name: 'Verandah Fixing Methods (Steel)',
    category: 'structure',
    description: 'Methods for fixing steel verandahs',
    options: [...defaultOptions.verandahFixedByOptions],
    defaultOptions: [...defaultOptions.verandahFixedByOptions]
  },
  {
    id: 'timberVerandahFixedByOptions',
    name: 'Verandah Fixing Methods (Timber)',
    category: 'structure',
    description: 'Methods for fixing timber verandahs',
    options: [...defaultOptions.timberVerandahFixedByOptions],
    defaultOptions: [...defaultOptions.timberVerandahFixedByOptions]
  },
  {
    id: 'roofTypeOptions',
    name: 'Roof Types (Steel)',
    category: 'roofing',
    description: 'Types of roofing for steel structures',
    options: [...defaultOptions.roofTypeOptions],
    defaultOptions: [...defaultOptions.roofTypeOptions]
  },
  {
    id: 'timberRoofTypeOptions',
    name: 'Roof Types (Timber)',
    category: 'roofing',
    description: 'Types of roofing for timber structures',
    options: [...defaultOptions.timberRoofTypeOptions],
    defaultOptions: [...defaultOptions.timberRoofTypeOptions]
  },
  {
    id: 'colourOptions',
    name: 'Colorbond Colors',
    category: 'finishes',
    description: 'Standard Colorbond color options',
    options: [...defaultOptions.colourOptions],
    defaultOptions: [...defaultOptions.colourOptions]
  },
  {
    id: 'polyRoofColourOptions',
    name: 'Polycarbonate Roof Colors',
    category: 'roofing',
    description: 'Color options for polycarbonate roofing',
    options: [...defaultOptions.polyRoofColourOptions],
    defaultOptions: [...defaultOptions.polyRoofColourOptions]
  },
  {
    id: 'gutterTypeOptions',
    name: 'Gutter Types',
    category: 'roofing',
    description: 'Types of gutters available',
    options: [...defaultOptions.gutterTypeOptions],
    defaultOptions: [...defaultOptions.gutterTypeOptions]
  },
  {
    id: 'gutterFallDirectionOptions',
    name: 'Gutter Fall Directions',
    category: 'roofing',
    description: 'Direction options for gutter fall',
    options: [...defaultOptions.gutterFallDirectionOptions],
    defaultOptions: [...defaultOptions.gutterFallDirectionOptions]
  },
  {
    id: 'downpipeTypeOptions',
    name: 'Downpipe Types',
    category: 'roofing',
    description: 'Types of downpipes available',
    options: [...defaultOptions.downpipeTypeOptions],
    defaultOptions: [...defaultOptions.downpipeTypeOptions]
  },
  {
    id: 'downpipeConnectionOptions',
    name: 'Downpipe Connections',
    category: 'roofing',
    description: 'Connection options for downpipes',
    options: [...defaultOptions.downpipeConnectionOptions],
    defaultOptions: [...defaultOptions.downpipeConnectionOptions]
  },
  {
    id: 'insulationTypeOptions',
    name: 'Insulation Types',
    category: 'roofing',
    description: 'Types of insulation available',
    options: [...defaultOptions.insulationTypeOptions],
    defaultOptions: [...defaultOptions.insulationTypeOptions]
  },
  {
    id: 'gableInfillOptions',
    name: 'Gable Infill Materials',
    category: 'finishes',
    description: 'Material options for gable infills',
    options: [...defaultOptions.gableInfillOptions],
    defaultOptions: [...defaultOptions.gableInfillOptions]
  },
  {
    id: 'gableInfillDetailOptions',
    name: 'Gable Infill Details',
    category: 'finishes',
    description: 'Detail options for gable infills',
    options: [...defaultOptions.gableInfillDetailOptions],
    defaultOptions: [...defaultOptions.gableInfillDetailOptions]
  },
  {
    id: 'ceilingTypeOptions',
    name: 'Ceiling Types',
    category: 'finishes',
    description: 'Types of ceilings available',
    options: [...defaultOptions.ceilingTypeOptions],
    defaultOptions: [...defaultOptions.ceilingTypeOptions]
  },
  {
    id: 'ceilingCladdingTypeOptions',
    name: 'Ceiling Cladding Types',
    category: 'finishes',
    description: 'Types of ceiling cladding available',
    options: [...defaultOptions.ceilingCladdingTypeOptions],
    defaultOptions: [...defaultOptions.ceilingCladdingTypeOptions]
  },
  {
    id: 'ballustradeTypeOptions',
    name: 'Ballustrade Types',
    category: 'fittings',
    description: 'Types of ballustrading available',
    options: [...defaultOptions.ballustradeTypeOptions],
    defaultOptions: [...defaultOptions.ballustradeTypeOptions]
  },
  {
    id: 'handrailTypeOptions',
    name: 'Handrail Types',
    category: 'fittings',
    description: 'Types of handrails available',
    options: [...defaultOptions.handrailTypeOptions],
    defaultOptions: [...defaultOptions.handrailTypeOptions]
  },
  {
    id: 'wallTypeOptions',
    name: 'Wall Types',
    category: 'screening',
    description: 'Types of walls available',
    options: [...defaultOptions.wallTypeOptions],
    defaultOptions: [...defaultOptions.wallTypeOptions]
  },
  {
    id: 'postSpacingOptions',
    name: 'Post Spacing Options',
    category: 'screening',
    description: 'Spacing options for posts',
    options: [...defaultOptions.postSpacingOptions],
    defaultOptions: [...defaultOptions.postSpacingOptions]
  },
  {
    id: 'topInfillTypeOptions',
    name: 'Top Infill Types',
    category: 'screening',
    description: 'Types of top infills available',
    options: [...defaultOptions.topInfillTypeOptions],
    defaultOptions: [...defaultOptions.topInfillTypeOptions]
  },
  {
    id: 'bottomInfillTypeOptions',
    name: 'Bottom Infill Types',
    category: 'screening',
    description: 'Types of bottom infills available',
    options: [...defaultOptions.bottomInfillTypeOptions],
    defaultOptions: [...defaultOptions.bottomInfillTypeOptions]
  },
  {
    id: 'screeningTypeOptions',
    name: 'Screening Types',
    category: 'screening',
    description: 'Types of screening available',
    options: [...defaultOptions.screeningTypeOptions],
    defaultOptions: [...defaultOptions.screeningTypeOptions]
  },
  {
    id: 'exactSlatTypeOptions',
    name: 'Slat Types',
    category: 'screening',
    description: 'Types of slats available',
    options: [...defaultOptions.exactSlatTypeOptions],
    defaultOptions: [...defaultOptions.exactSlatTypeOptions]
  },
  {
    id: 'slatSizeOptions',
    name: 'Slat Sizes',
    category: 'screening',
    description: 'Size options for slats',
    options: [...defaultOptions.slatSizeOptions],
    defaultOptions: [...defaultOptions.slatSizeOptions]
  },
  {
    id: 'slatSpacingOptions',
    name: 'Slat Spacing Options',
    category: 'screening',
    description: 'Spacing options for slats',
    options: [...defaultOptions.slatSpacingOptions],
    defaultOptions: [...defaultOptions.slatSpacingOptions]
  },
  {
    id: 'screenFixingTypeOptions',
    name: 'Screen Fixing Types',
    category: 'screening',
    description: 'Types of screen fixings available',
    options: [...defaultOptions.screenFixingTypeOptions],
    defaultOptions: [...defaultOptions.screenFixingTypeOptions]
  },
  {
    id: 'otherTradesRequiredOptions',
    name: 'Other Trades',
    category: 'extras',
    description: 'Types of other trades available',
    options: [...defaultOptions.otherTradesRequiredOptions],
    defaultOptions: [...defaultOptions.otherTradesRequiredOptions]
  },
  {
    id: 'retainingWallTypeOptions',
    name: 'Retaining Wall Types',
    category: 'extras',
    description: 'Types of retaining walls available',
    options: [...defaultOptions.retainingWallTypeOptions],
    defaultOptions: [...defaultOptions.retainingWallTypeOptions]
  }
];

// Function to get options by ID
export function getOptionsById(id: string): string[] {
  const config = configOptions.find(opt => opt.id === id);
  return config ? config.options : [];
}

// Initialize localStorage with default options if not already set
export function initializeConfigOptions(): void {
  if (typeof window !== 'undefined') {
    const storedConfig = localStorage.getItem('quoteBuilderConfig');
    
    if (!storedConfig) {
      // No config exists, store default config
      localStorage.setItem('quoteBuilderConfig', JSON.stringify(configOptions));
    } else {
      try {
        // Config exists, merge with any new options that might have been added
        const parsedConfig = JSON.parse(storedConfig) as ConfigOption[];
        const mergedConfig = configOptions.map(defaultOpt => {
          const existingOpt = parsedConfig.find(opt => opt.id === defaultOpt.id);
          return existingOpt || defaultOpt;
        });
        
        localStorage.setItem('quoteBuilderConfig', JSON.stringify(mergedConfig));
      } catch (e) {
        console.error('Failed to parse config options:', e);
        // Reset to defaults if parsing fails
        localStorage.setItem('quoteBuilderConfig', JSON.stringify(configOptions));
      }
    }
  }
}

// Function to save updated options to localStorage
export function saveConfigOptions(updatedOptions: ConfigOption[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('quoteBuilderConfig', JSON.stringify(updatedOptions));
  }
}

// Function to load options from localStorage
export function loadConfigOptions(): ConfigOption[] {
  if (typeof window !== 'undefined') {
    try {
      const storedConfig = localStorage.getItem('quoteBuilderConfig');
      if (storedConfig) {
        return JSON.parse(storedConfig) as ConfigOption[];
      }
    } catch (e) {
      console.error('Failed to load config options:', e);
    }
  }
  return configOptions;
}

// Function to reset options to defaults
export function resetConfigOptions(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('quoteBuilderConfig', JSON.stringify(configOptions));
  }
}

// Export the categories for the UI
export const optionCategories: { id: OptionCategory; name: string }[] = [
  { id: 'decking', name: 'Decking' },
  { id: 'structure', name: 'Structure' },
  { id: 'roofing', name: 'Roofing' },
  { id: 'finishes', name: 'Finishes' },
  { id: 'fittings', name: 'Fittings' },
  { id: 'screening', name: 'Screening' },
  { id: 'extras', name: 'Extras' }
];