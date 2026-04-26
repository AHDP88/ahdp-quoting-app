import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ProgressSteps from "@/components/ProgressSteps";
import DimensionsForm from "@/components/DimensionsForm";
import ConstructionDetailsForm from "@/components/ConstructionDetailsForm";
import SiteRequirementsForm from "@/components/SiteRequirementsForm";
import DetailsForm from "@/components/DetailsForm";
import QuotePreview from "@/components/QuotePreview";
import QuoteSummary from "@/components/QuoteSummary";
import ExtrasForm from "@/components/ExtrasForm";
import { usePricing } from "@/hooks/usePricing";
import { useQuoteCalculation } from "@/hooks/useQuoteCalculation";
import { buildScopeStatement } from "@/lib/scopeSummary";

export type ProjectType = "deck" | "pergola" | "deck-pergola" | "carport";
export type StepType = 1 | 2 | 3 | 4 | 5 | 6;

export interface QuoteData {
  // Basic Info
  projectType: ProjectType;
  
  // ********** Decking Section **********
  deckingRequired: boolean;
  length: number;
  width: number;
  height: number;
  joistSize: string;
  bearerSize: string;
  boardSize: string;
  customBoardSize: string;
  deckingType: string; // Timber, Composite, etc.
  boardType: string;
  boardDirection: "parallel-long" | "parallel-short" | "diagonal" | "";
  subframePainted: boolean;
  joistProtectionTape: boolean;
  
  // Fascia/Screening
  fasciaRequired: boolean;
  fasciaType: string;
  fasciaTypeOther: string;
  fasciaLength: number | "";
  
  // Fixing & Ground
  fixingType: string;
  fixingTypeOther: string;
  groundType: string;
  postInstallation: string;
  boltDownSystemType: string;
  
  // Dig Out
  digOutRequired: boolean;
  digOutSize: number | "";
  machineHireRequired: string;
  
  // Steps/Ramps
  stepRampRequired: boolean;
  numberOfSteps: number;
  stepHeight: number | "";
  stepWidth: number | "";
  stepLength: number | "";
  treadMaterial: string;
  handrailRequired: boolean;
  handrailType: string;
  handrailLinealMetres: number | "";
  handrailHeight: number | "";
  ballustradeType: string;
  
  // Deck Lights and Demo
  deckLights: boolean;
  deckLightQty: number | "";
  demolitionRequired: boolean;
  existingDeckSize: number | "";
  
  // ********** Verandah Section **********
  verandahRequired: boolean;
  structureType: string; // Verandah, Pergola, Carport, Other
  materialType: string; // Steel, Timber
  structureStyle: string; // Flat, Straight Gable, Intersecting Gable, Split Gable
  
  // Roof details
  roofType: string; // CGI, Poly-Standard, Poly-Premium, etc.
  roofColorUp: string;
  roofColorDown: string;
  roofSpan: number;
  roofLength: number;
  roofPitch: number;
  existingFasciaHeight: number;
  gableInfill: string;
  gableInfillDetail: string;
  
  // Frame details
  beamSize: string;
  rafterSize: string;
  postSize: string;
  ceilingType: string;
  
  // Gutter details
  gutterType: string;
  gutterColor: string;
  gutterFallDirection: string;
  numberOfDownpipes: number;
  downpipeConnection: string;
  
  // Insulation & Flashing
  flashingRequired: boolean;
  insulationType: string;
  
  // Painting
  paintingRequired: "not-required" | "by-client" | "by-ahdp";
  paintColor: string;
  
  // ********** Walls & Screening **********
  screeningRequired: boolean;
  wallType: string; // FC Cladding, Decking, Rendered Blueboard, etc.
  screenMaterial: string; // Merbau, Treated Pine, Hardwood, etc.
  claddingHeight: number;
  numberOfBays: number;
  postSpacing: string;
  topInfillType: string;
  bottomInfillType: string;
  screenFixingTypeDetail: string;
  paintStainRequired: "no" | "by-client" | "by-ahdp";
  paintStainColor: string;
  
  // ********** Extras Section **********
  extrasRequired: boolean;
  binHireRequired: boolean;
  rubbishRemoval: boolean;
  pavingCutRequired: boolean;
  landscapingRetainingRequired: boolean;
  
  // Electrical Items
  electricalWorkRequired: boolean;
  numCeilingFans: number;
  numHeaters: number;
  numLights: number;
  numPowerPoints: number;
  electricalItemNotes: string;
  
  plumbingWorkRequired: boolean;
  asbestosRemovalRequired: boolean;
  coreDrillingRequired: boolean;
  extraExcavationRequired: boolean;
  stairHandrailFixRequired: boolean;
  miscellaneousNotes: string;
  extraTradesRequired: string[];
  extraTradesOther: string;
  
  // ********** Construction Details **********
  constructionAccess: "easy" | "moderate" | "difficult" | "";
  subfloorHeight: number;
  concreteFootingsRequired: boolean;
  oversizedPostsRequired: boolean;
  slabCuttingRequired: boolean;
  constructionNotes: string;
  
  // ********** Site Requirements **********
  siteAccess: "easy" | "moderate" | "difficult" | "";
  groundConditions: "level" | "sloped" | "retaining-wall" | "";
  councilApproval: boolean;
  powerWaterAvailable: boolean;
  siteNotes: string;
  
  // Original fields
  materialId: string;
  options: string[];
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  siteAddress: string;
  notes: string;
}

export default function QuoteBuilder() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { materials } = usePricing();
  
  const [currentStep, setCurrentStep] = useState<StepType>(1);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    // Basic Info
    projectType: "deck",
    
    // Decking Section
    deckingRequired: true,
    length: 0,
    width: 0,
    height: 0,
    joistSize: "",
    bearerSize: "",
    boardSize: "",
    customBoardSize: "",
    deckingType: "",
    boardType: "",
    boardDirection: "parallel-long",
    subframePainted: false,
    joistProtectionTape: false,
    
    // Fascia/Screening
    fasciaRequired: false,
    fasciaType: "",
    fasciaTypeOther: "",
    fasciaLength: "",
    
    // Fixing & Ground
    fixingType: "",
    fixingTypeOther: "",
    groundType: "",
    postInstallation: "",
    boltDownSystemType: "",
    
    // Dig Out
    digOutRequired: false,
    digOutSize: "",
    machineHireRequired: "",
    
    // Steps/Ramps
    stepRampRequired: false,
    numberOfSteps: 0,
    stepHeight: "",
    stepWidth: "",
    stepLength: "",
    treadMaterial: "",
    handrailRequired: false,
    handrailType: "",
    handrailLinealMetres: "",
    handrailHeight: "",
    ballustradeType: "",
    
    // Deck Lights and Demo
    deckLights: false,
    deckLightQty: "",
    demolitionRequired: false,
    existingDeckSize: "",
    
    // Verandah Section
    verandahRequired: false,
    structureType: "",
    materialType: "",
    structureStyle: "",
    
    // Roof details
    roofType: "",
    roofColorUp: "",
    roofColorDown: "",
    roofSpan: 0,
    roofLength: 0,
    roofPitch: 0,
    existingFasciaHeight: 0,
    gableInfill: "",
    gableInfillDetail: "",
    
    // Frame details
    beamSize: "",
    rafterSize: "",
    postSize: "",
    ceilingType: "",
    
    // Gutter details
    gutterType: "",
    gutterColor: "",
    gutterFallDirection: "",
    numberOfDownpipes: 0,
    downpipeConnection: "",
    
    // Insulation & Flashing
    flashingRequired: false,
    insulationType: "None",
    
    // Painting
    paintingRequired: "not-required",
    paintColor: "",
    
    // Walls & Screening Section
    screeningRequired: false,
    wallType: "",
    screenMaterial: "",
    claddingHeight: 0,
    numberOfBays: 0,
    postSpacing: "",
    topInfillType: "",
    bottomInfillType: "",
    screenFixingTypeDetail: "",
    paintStainRequired: "no",
    paintStainColor: "",
    
    // Extras Section
    extrasRequired: false,
    binHireRequired: false,
    rubbishRemoval: false,
    pavingCutRequired: false,
    landscapingRetainingRequired: false,
    
    // Electrical Items
    electricalWorkRequired: false,
    numCeilingFans: 0,
    numHeaters: 0,
    numLights: 0,
    numPowerPoints: 0,
    electricalItemNotes: "",
    
    plumbingWorkRequired: false,
    asbestosRemovalRequired: false,
    coreDrillingRequired: false,
    extraExcavationRequired: false,
    stairHandrailFixRequired: false,
    miscellaneousNotes: "",
    extraTradesRequired: [],
    extraTradesOther: "",
    
    // Construction Details
    constructionAccess: "easy",
    subfloorHeight: 0,
    concreteFootingsRequired: false,
    oversizedPostsRequired: false,
    slabCuttingRequired: false,
    constructionNotes: "",
    
    // Site Requirements
    siteAccess: "easy",
    groundConditions: "level",
    councilApproval: false,
    powerWaterAvailable: true,
    siteNotes: "",
    
    // Original fields
    materialId: "standard-hardwood",
    options: [],
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    siteAddress: "",
    notes: ""
  });

  // Define a database-compatible version of the quote data
  interface ApiQuoteData {
    // Basic Info
    projectType: ProjectType;
    
    // Decking Section
    deckingRequired: boolean;
    length: string;
    width: string;
    height: string;
    joistSize: string;
    bearerSize: string;
    boardSize: string;
    customBoardSize: string;
    deckingType: string;
    boardType: string;
    boardDirection: string;
    subframePainted: boolean;
    joistProtectionTape: boolean;
    
    // Steps/Ramps
    stepRampRequired: boolean;
    numberOfSteps: number;
    stepHeight: string;
    stepWidth: string;
    stepLength: string;
    treadMaterial: string;
    handrailRequired: boolean;
    handrailType: string;
    handrailLinealMetres: string;
    handrailHeight: string;
    ballustradeType: string;
    
    // Deck Lights and Demo
    deckLights: boolean;
    deckLightQty: string;
    demolitionRequired: boolean;
    existingDeckSize: string;
    
    // Fascia/Screening
    fasciaRequired: boolean;
    fasciaType: string;
    fasciaTypeOther: string;
    fasciaLength: string;
    
    // Fixing & Ground
    fixingType: string;
    fixingTypeOther: string;
    groundType: string;
    postInstallation: string;
    boltDownSystemType: string;
    
    // Dig Out
    digOutRequired: boolean;
    digOutSize: string;
    machineHireRequired: string;
    
    // Verandah Section
    verandahRequired: boolean;
    structureType: string;
    materialType: string;
    structureStyle: string;
    
    // Roof details
    roofType: string;
    roofColorUp: string;
    roofColorDown: string;
    roofSpan: string;
    roofLength: string;
    roofPitch: string;
    existingFasciaHeight: string;
    gableInfill: string;
    gableInfillDetail: string;
    
    // Frame details
    beamSize: string;
    rafterSize: string;
    postSize: string;
    ceilingType: string;
    
    // Gutter details
    gutterType: string;
    gutterColor: string;
    gutterFallDirection: string;
    numberOfDownpipes: string;
    downpipeConnection: string;
    
    // Insulation & Flashing
    flashingRequired: boolean;
    insulationType: string;
    
    // Painting
    paintingRequired: string;
    paintColor: string;
    
    // Walls & Screening
    screeningRequired: boolean;
    wallType: string;
    screenMaterial: string;
    claddingHeight: string;
    numberOfBays: number;
    postSpacing: string;
    topInfillType: string;
    bottomInfillType: string;
    screenFixingTypeDetail: string;
    paintStainRequired: string;
    paintStainColor: string;
    
    // Extras Section
    extrasRequired: boolean;
    binHireRequired: boolean;
    rubbishRemoval: boolean;
    pavingCutRequired: boolean;
    landscapingRetainingRequired: boolean;
    
    // Electrical Items
    electricalWorkRequired: boolean;
    numCeilingFans: string;
    numHeaters: string;
    numLights: string;
    numPowerPoints: string;
    electricalItemNotes: string;
    
    plumbingWorkRequired: boolean;
    asbestosRemovalRequired: boolean;
    coreDrillingRequired: boolean;
    extraExcavationRequired: boolean;
    stairHandrailFixRequired: boolean;
    miscellaneousNotes: string;
    extraTradesRequired: string[];
    extraTradesOther: string;
    
    // Construction Details
    constructionAccess: string;
    subfloorHeight: string;
    concreteFootingsRequired: boolean;
    oversizedPostsRequired: boolean;
    slabCuttingRequired: boolean;
    constructionNotes: string;
    
    // Site Requirements
    siteAccess: string;
    groundConditions: string;
    councilApproval: boolean;
    powerWaterAvailable: boolean;
    siteNotes: string;
    
    // Original fields
    materialId: string;
    options: string[];
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    siteAddress: string;
    notes: string;
    status: string;
    scopeSummaryText: string;
  }

  const saveQuoteMutation = useMutation({
    mutationFn: async (data: ApiQuoteData) => {
      const response = await apiRequest("POST", "/api/quotes", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({
        title: "Quote Saved",
        description: `Quote #${data.id} has been saved successfully.`,
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: `Failed to save quote: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as StepType);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepType);
    }
  };

  const handleUpdateQuote = (updates: Partial<QuoteData>) => {
    setQuoteData((prev) => ({ ...prev, ...updates }));
  };

  const handleSaveQuote = () => {
    const scopeText = buildScopeStatement(quoteData);

    // Convert numeric values to strings for database compatibility
    const formattedData: ApiQuoteData = {
      ...quoteData,
      status: "draft",
      scopeSummaryText: scopeText,
      // Convert all numeric fields to strings
      length: quoteData.length.toString(),
      width: quoteData.width.toString(),
      height: quoteData.height.toString(),
      digOutSize: quoteData.digOutSize.toString(),
      machineHireRequired: quoteData.machineHireRequired,
      stepHeight: quoteData.stepHeight.toString(),
      stepWidth: quoteData.stepWidth.toString(),
      stepLength: quoteData.stepLength.toString(),
      handrailLinealMetres: quoteData.handrailLinealMetres.toString(),
      handrailHeight: quoteData.handrailHeight.toString(),
      deckLightQty: quoteData.deckLightQty.toString(),
      existingDeckSize: quoteData.existingDeckSize.toString(),
      fasciaLength: quoteData.fasciaLength.toString(),
      roofSpan: quoteData.roofSpan.toString(),
      roofLength: quoteData.roofLength.toString(),
      roofPitch: quoteData.roofPitch.toString(),
      existingFasciaHeight: quoteData.existingFasciaHeight.toString(),
      claddingHeight: quoteData.claddingHeight.toString(),
      numberOfBays: quoteData.numberOfBays,
      numberOfSteps: quoteData.numberOfSteps,
      numberOfDownpipes: quoteData.numberOfDownpipes.toString(),
      subfloorHeight: quoteData.subfloorHeight.toString(),
      numCeilingFans: quoteData.numCeilingFans.toString(),
      numHeaters: quoteData.numHeaters.toString(),
      numLights: quoteData.numLights.toString(),
      numPowerPoints: quoteData.numPowerPoints.toString(),
      // No need to convert non-numeric fields to strings:
      // roofColorUp, roofColorDown, gutterColor, customBoardSize, beamSize, rafterSize, postSize remain as strings
    };
    saveQuoteMutation.mutate(formattedData);
  };

  const getCurrentMaterial = () => {
    return materials.find(m => String(m.id) === String(quoteData.materialId)) || materials[0];
  };

  const { calculation: calc } = useQuoteCalculation(quoteData);
  const incGST = calc.totalAmountInc / 100;
  const isLastStep = currentStep === 6;

  return (
    <div className="min-h-screen pb-20 lg:pb-0" style={{ background: "#f5f5f0" }}>
      {/* Sticky progress bar */}
      <div className="bg-white border-b border-gray-200/80 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ProgressSteps currentStep={currentStep} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-5">
            {currentStep === 1 && (
              <DimensionsForm 
                quoteData={quoteData} 
                onUpdate={handleUpdateQuote} 
                onNext={handleNextStep}
                onBack={() => {}}
              />
            )}
            {currentStep === 2 && (
              <ExtrasForm
                quoteData={quoteData}
                onUpdate={handleUpdateQuote}
                onNext={handleNextStep}
                onBack={handlePrevStep}
              />
            )}
            {currentStep === 3 && (
              <ConstructionDetailsForm
                quoteData={quoteData}
                onUpdate={handleUpdateQuote}
                onNext={handleNextStep}
                onBack={handlePrevStep}
              />
            )}
            {currentStep === 4 && (
              <SiteRequirementsForm
                quoteData={quoteData}
                onUpdate={handleUpdateQuote}
                onNext={handleNextStep}
                onBack={handlePrevStep}
              />
            )}
            {currentStep === 5 && (
              <DetailsForm
                quoteData={quoteData}
                onUpdate={handleUpdateQuote}
                onNext={handleNextStep}
                onBack={handlePrevStep}
              />
            )}
            {currentStep === 6 && (
              <QuotePreview
                quoteData={quoteData}
                onSave={handleSaveQuote}
                onBack={handlePrevStep}
                isSaving={saveQuoteMutation.isPending}
                calculation={calc}
              />
            )}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <QuoteSummary
              quoteData={quoteData}
              material={getCurrentMaterial()}
              onSave={isLastStep ? handleSaveQuote : handleNextStep}
              isSaving={saveQuoteMutation.isPending}
              isLastStep={isLastStep}
              currentStep={currentStep}
              calculation={calc}
            />
          </div>
        </div>
      </div>

      {/* Mobile sticky total bar */}
      <div className="ds-mobile-bar lg:hidden">
        <div className="min-w-0">
          <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider">
            {calc.grandTotal > 0 ? "Total inc GST" : "Running Total"}
          </p>
          <p className="text-white font-bold text-xl leading-tight">
            {calc.grandTotal > 0 ? `$${Math.round(incGST).toLocaleString("en-AU")}` : "—"}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3 py-2.5 rounded-xl transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={isLastStep ? handleSaveQuote : handleNextStep}
            disabled={saveQuoteMutation.isPending}
            className="flex items-center gap-1.5 bg-white text-[#1f3d2b] text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:bg-white/90 disabled:opacity-60 shadow-sm"
          >
            {saveQuoteMutation.isPending
              ? "Saving…"
              : isLastStep
              ? "Save Quote"
              : currentStep === 5
              ? "Review Quote →"
              : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
