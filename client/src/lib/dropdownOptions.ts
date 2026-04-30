// Dropdown Options from the Excel File

// Verandah Options
export const structureTypeOptions = [
  "Verandah",
  "Pergola", 
  "Carport"
];

export const structureMaterialOptions = [
  "Timber",
  "Steel"
];

// Steel beam, rafter, post options are already defined as steelPostSizeOptions, etc.
// Timber beam, rafter, post options are already defined as timberPostSizeOptions, etc.

export const roofObstructionsOptions = [
  "None",
  "Solar Panels",
  "Hot Water System",
  "Both"
];

export const existingWallStructureOptions = [
  "Brick",
  "Hebel", 
  "Weatherboard", 
  "CGI", 
  "Stone"
];

export const existingRoofStructureOptions = [
  "Timber",
  "Steel"
];

export const verandahFixedByOptions = [
  "Back Channel",
  "Hockey Sticks",
  "Wall Plate",
  "Crank Posts",
  "Freestanding",
  "Riser Brackets"
];

export const timberVerandahFixedByOptions = [
  "Rafter Brackets",
  "Wall Plate",
  "Crank Posts",
  "Freestanding",
  "Riser Brackets",
  "Fly-over Brackets",
  "Other"
];

export const verandahStyleOptions = [
  "Straight Gable",
  "Split Gable",
  "Intersecting Gable",
  "Flat Roof",
  "Hip Roof",
  "Dutch Gable",
  "Reverse Flat",
  "Skillion",
  "Fly Over"
];

export const steelRoofPitchOptions = Array.from({length: 61}, (_, i) => i.toString());

export const colourOptions = [
  "Dover White",
  "Surfmist",
  "Evening Haze",
  "Classic Cream",
  "Paperbark",
  "Dune",
  "Shale Grey",
  "Bluegum",
  "Windspray",
  "Gully",
  "Jasper",
  "Wallaby",
  "Basalt",
  "Woodland Grey",
  "Monument",
  "Night Sky",
  "Ironstone",
  "Deep Ocean",
  "Cottage Green",
  "Pale Eucalypt",
  "Manor Red"
];

export const frameColourOptions = [
  ...colourOptions,
  "Stained/Oiled",
  "Other"
];

export const gutterTypeOptions = [
  "OG",
  "Quad",
  "D Gutter",
  "High Front",
  "Edge Gutter",
  "Box Gutter",
  "Internal Gutter",
  "Other"
];

export const roofTypeOptions = [
  "CGI",
  "Poly - Standard",
  "Poly - Premium",
  "Fibreglass",
  "Insulated Panel"
];

export const timberRoofTypeOptions = [
  "CGI - Standard",
  "CGI - Premium",
  "Poly - Standard",
  "Poly - Premium",
  "Twin-wall",
  "Ezi-glaze",
  "Shade Cloth",
  "Insulated Panel",
  "Other"
];

export const steelPostSizeOptions = [
  "Outback 68x68",
  "65x65 SHS",
  "75x75 SHS",
  "90x90 SHS",
  "100x100 SHS",
  "125x125 SHS",
  "140x140 Timber",
  "140x140 Aluminium Wrap"
];

export const timberPostSizeOptions = [
  "88x88 H4",
  "112x112 H4",
  "90x90 Merbau",
  "112x112 Merbau",
  "140x140 Merbau",
  "190x190 Merbau",
  "240x240 Merbau",
  "90x90 SHS",
  "100x100 SHS",
  "125x125 SHS", 
  "140x140 Timber",
  "140x140 Aluminium Wrap"
];

export const polyRoofColourOptions = [
  "Clear",
  "Opal",
  "Grey",
  "Bronze",
  "Solar Grey",
  "Solar Ice",
  "White Opal",
  "Cream",
  "Tinted",
  "Custom"
];

export const downpipeTypeOptions = [
  "100x50 Square",
  "90mm Round",
  "75mm Round",
  "Other"
];

export const downpipeConnectionOptions = [
  "Connect to existing DP",
  "Connect to existing gutter",
  "DP flush with top of ground",
  "Connect to rainwater tank",
  "Dig to storm water (plumber required)"
];

export const gutterFallDirectionOptions = [
  "Left",
  "Right",
  "Center",
  "Both Sides"
];

export const flashingRequiredOptions = [
  "Yes",
  "No"
];

export const insulationTypeOptions = [
  "None",
  "Aircell",
  "PanelRoof",
  "Anticon",
  "Other"
];

export const gableInfillOptions = [
  "Slats - Metal",
  "Slats - Timber",
  "Poly - Flat Sheet",
  "Poly - Corrugated",
  "Hardieflex",
  "Lattice - Square",
  "Lattice - Diamond",
  "Other"
];

export const gableInfillDetailOptions = [
  "Crow",
  "Wheel",
  "Struts",
  "Single Strut",
  "Other"
];

export const verandahExtrasOptions = [
  "Downlight Tray",
  "Recessed Purlins",
  "Collar Ties",
  "Other"
];

export const otherTradesRequiredOptions = [
  "Painter",
  "Electrician",
  "Plumber",
  "Renderer",
  "Tiler",
  "Bricklayer",
  "Roofer",
  "Other"
];

export const mountTypeOptions = [
  "Bolt down",
  "In ground"
];

export const yesNoOptions = [
  "Yes",
  "No"
];

export const paintingOptions = [
  "Yes - by AHDP",
  "Yes - by client",
  "No"
];

// Decking Options
export const deckingTypeOptions = [
  "Timber",
  "Composite",
  "Fibre Cement",
  "Other"
];

export const framTimberTypeOptions = [
  "Treated Pine",
  "Merbau",
  "Design Pine",
  "Hardwood"
];

export interface DeckingMaterialOption {
  value: string;
  label: string;
  deckingType: string;
}

export const fallbackDeckingMaterialOptions: DeckingMaterialOption[] = [
  { value: "deck.mat.clearPine", label: "Pine", deckingType: "Timber" },
  { value: "deck.mat.kapur", label: "Kapur", deckingType: "Timber" },
  { value: "deck.mat.merbau", label: "Merbau", deckingType: "Timber" },
  { value: "deck.mat.spottedGum", label: "Spotted Gum", deckingType: "Timber" },
  { value: "deck.mat.jarrah", label: "Jarrah", deckingType: "Timber" },
  { value: "deck.mat.blackbutt", label: "Blackbutt", deckingType: "Timber" },
  { value: "deck.mat.trex", label: "Trex", deckingType: "Composite" },
  { value: "deck.mat.modwood", label: "Modwood", deckingType: "Composite" },
  { value: "deck.mat.millboard", label: "Millboard", deckingType: "Composite" },
  { value: "deck.mat.evalast", label: "Evalast", deckingType: "Composite" },
  { value: "deck.mat.ecodeck", label: "Ecodeck", deckingType: "Composite" },
  { value: "deck.mat.inex", label: "HardieDeck / INEX", deckingType: "Fibre Cement" },
];

// Organized by material type
export const timberBoardTypeOptions = fallbackDeckingMaterialOptions.filter(option => option.deckingType === "Timber");

export const compositeBoardTypeOptions = fallbackDeckingMaterialOptions.filter(option => option.deckingType === "Composite");

export const otherBoardTypeOptions = fallbackDeckingMaterialOptions.filter(option => option.deckingType === "Fibre Cement");

// This function returns the appropriate board type options based on decking type
export const getBoardTypeOptions = (
  deckingType: string,
  options: DeckingMaterialOption[] = fallbackDeckingMaterialOptions,
) => {
  switch(deckingType) {
    case "Timber":
      return options.filter(option => option.deckingType === "Timber");
    case "Composite":
      return options.filter(option => option.deckingType === "Composite");
    case "Fibre Cement":
      return options.filter(option => option.deckingType === "Fibre Cement");
    default:
      return options;
  }
};

export const deckingGradeOptions = [
  "Select",
  "Standard",
  "Feature"
];

export const boardWidthOptions = [
  "70",
  "90",
  "140",
  "180",
  "Other"
];

export const boardGapSizeOptions = [
  "3mm",
  "5mm",
  "Hidden"
];

export const deckShapeTypeOptions = [
  "Square/Rectangular",
  "L-Shaped",
  "U-Shaped",
  "Custom"
];

export const fixingTypeOptions = [
  "Face Screwed",
  "Hidden Fasteners",
  "Joist Strips",
  "Other"
];

export const fasciaRequiredOptions = [
  "Decking boards",
  "Timber fascia",
  "FC sheet",
  "CGI sheet",
  "No",
  "Other"
];

export const ballustradeTypeOptions = [
  "Timber",
  "Stainless Steel",
  "Aluminium Slat",
  "Glass",
  "Fibre Cement",
  "Other"
];

export const handrailTypeOptions = [
  "Primed Pine",
  "Merbau",
  "Spotted Gum",
  "Stainless Steel",
  "Aluminium",
  "Other"
];

export const handrailHeightOptions = Array.from({length: 19}, (_, i) => (900 + i*50).toString());

// Walls & Screening Options
export const wallTypeOptions = [
  "70x45 timber studs",
  "90x45 timber studs"
];

export const postSpacingOptions = [
  "900mm",
  "1200mm", 
  "1800mm", 
  "2400mm",
  "3000mm"
];

export const topInfillTypeOptions = [
  "FC Sheeting",
  "Timber Slats", 
  "Aluminium Slats",
  "Polycarb",
  "CGI",
  "Weatherboard",
  "Rendered Blueboard",
  "Other"
];

export const bottomInfillTypeOptions = [
  "FC Sheeting",
  "Timber Slats", 
  "Aluminium Slats",
  "Polycarb",
  "CGI",
  "Weatherboard",
  "Rendered Blueboard",
  "Same as Top",
  "Other"
];

export const screenFixingTypeDetailOptions = [
  "SS Screws",
  "Concealed", 
  "Nailed",
  "Other"
];

export const wallCladdingOptions = [
  "Hardiflex",
  "Rendered Blueboard",
  "Timber cladding",
  "FC cladding",
  "Other"
];

export const ceilingTypeOptions = [
  "Flushed flat plasterboard",
  "Flushed raked plasterboard",
  "Fibre Cement",
  "Timber battens",
  "Exposed rafters"
];

export const ceilingCladdingTypeOptions = [
  "Plasterboard",
  "Fibre Cement",
  "Timber battens",
  "Timber slats",
  "Aluminium slats"
];

export const screeningTypeOptions = [
  "Timber slats",
  "Aluminium slats",
  "Shade Cloth",
  "Weatherboard",
  "Fibre Cement",
  "Lattice",
  "CGI",
  "Polycarbonate",
  "Other"
];

export const exactSlatTypeOptions = [
  "Clear pine",
  "Primed Pine",
  "Merbau",
  "Kapur",
  "Spotted Gum",
  "Aluminium slat",
  "Other"
];

export const slatSizeOptions = [
  "70mm",
  "90mm",
  "140mm",
  "Other"
];

export const slatSpacingOptions = [
  "10mm",
  "15mm",
  "20mm"
];

export const singleOrDoubleOptions = [
  "Single",
  "Double"
];

export const screenFixingTypeOptions = [
  "Attached",
  "Free-standing",
  "Other"
];

export const gateTypeOptions = [
  "Aluminium slat",
  "Timber slat",
  "Glass",
  "Pool fence",
  "Custom",
  "Other"
];

// Extra Works Options
export const pavingReplacementOptions = [
  "Yes - by AHDP",
  "Yes - by client",
  "No"
];

export const skipBinSizeOptions = [
  "2qm",
  "3qm",
  "4qm",
  "6qm",
  "Other"
];

export const numericOptions = (max: number) => Array.from({length: max}, (_, i) => (i + 1).toString());

export const rollerDoorTypeOptions = [
  "Manual",
  "Motorised",
  "Other"
];

export const retainingWallTypeOptions = [
  "Concrete Sleeper",
  "Timber",
  "Block",
  "Other"
];
