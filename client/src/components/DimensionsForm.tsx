import React from "react";
import { QuoteData } from "./QuoteBuilder";

import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  structureTypeOptions,
  getBoardTypeOptions,
  boardWidthOptions,
  fixingTypeOptions,
  deckingTypeOptions,
  fasciaRequiredOptions,
  paintingOptions,
  yesNoOptions,
  mountTypeOptions
} from "@/lib/dropdownOptions";

interface DimensionsFormProps {
  quoteData: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DimensionsForm({ quoteData, onUpdate, onNext, onBack }: DimensionsFormProps) {
  return (
    <div className="space-y-5 ds-reveal">
      <div className="space-y-5">
        {/* Project Type Selection */}
        <div className="ds-card">
          <div className="ds-card-header">
            <h2 className="font-semibold text-gray-900 text-sm">Project Type</h2>
          </div>
          <div className="ds-card-body">
            <div className="space-y-4">
              <RadioGroup 
                value={quoteData.projectType} 
                onValueChange={(value) => onUpdate({ projectType: value as "deck" | "pergola" | "deck-pergola" })}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="deck" id="deck" />
                  <Label htmlFor="deck">Deck Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pergola" id="pergola" />
                  <Label htmlFor="pergola">Pergola/Verandah Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="deck-pergola" id="deck-pergola" />
                  <Label htmlFor="deck-pergola">Deck with Pergola/Verandah</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        
        {/* Decking Section Toggle */}
        <div className="ds-card flex items-center justify-between px-5 py-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-900">Decking Details</h3>
            <p className="text-sm text-gray-500">Include details of decking</p>
          </div>
          <Switch 
            checked={quoteData.deckingRequired}
            onCheckedChange={(checked) => onUpdate({ deckingRequired: checked })}
          />
        </div>
        
        {/* Decking Section */}
        {quoteData.deckingRequired && (
          <div className="ds-card">
            <div className="ds-card-header">
              <h2 className="font-semibold text-gray-900 text-sm">Decking Details</h2>
            </div>
            <div className="ds-card-body">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="length" className="text-sm font-medium text-gray-700">Length (m):</label>
                  <div className="sm:col-span-2">
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <Input
                        type="number"
                        id="length"
                        value={quoteData.length}
                        onChange={(e) => onUpdate({ length: parseFloat(e.target.value) || 0 })}
                        className="pr-12"
                        step="0.1"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <span className="h-full inline-flex items-center rounded-r-md border-l border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">m</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="width" className="text-sm font-medium text-gray-700">Width (m):</label>
                  <div className="sm:col-span-2">
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <Input
                        type="number"
                        id="width"
                        value={quoteData.width}
                        onChange={(e) => onUpdate({ width: parseFloat(e.target.value) || 0 })}
                        className="pr-12"
                        step="0.1"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <span className="h-full inline-flex items-center rounded-r-md border-l border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">m</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="height" className="text-sm font-medium text-gray-700">Height (m):</label>
                  <div className="sm:col-span-2">
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <Input
                        type="number"
                        id="height"
                        value={quoteData.height}
                        onChange={(e) => onUpdate({ height: parseFloat(e.target.value) || 0 })}
                        className="pr-12"
                        step="0.1"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <span className="h-full inline-flex items-center rounded-r-md border-l border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">m</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="joistSize" className="text-sm font-medium text-gray-700">Joist Size:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.joistSize}
                      onValueChange={(value) => onUpdate({ joistSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select joist size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90x45">90x45</SelectItem>
                        <SelectItem value="120x45">120x45</SelectItem>
                        <SelectItem value="140x45">140x45</SelectItem>
                        <SelectItem value="190x45">190x45</SelectItem>
                        <SelectItem value="240x45">240x45</SelectItem>
                        <SelectItem value="290x45">290x45</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="bearerSize" className="text-sm font-medium text-gray-700">Bearer Size:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.bearerSize}
                      onValueChange={(value) => onUpdate({ bearerSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bearer size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90x45">90x45</SelectItem>
                        <SelectItem value="120x45">120x45</SelectItem>
                        <SelectItem value="140x45">140x45</SelectItem>
                        <SelectItem value="190x45">190x45</SelectItem>
                        <SelectItem value="240x45">240x45</SelectItem>
                        <SelectItem value="290x45">290x45</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="boardSize" className="text-sm font-medium text-gray-700">Board Size:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.boardSize}
                      onValueChange={(value) => onUpdate({ boardSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select board size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90x19">90x19</SelectItem>
                        <SelectItem value="90x22">90x22</SelectItem>
                        <SelectItem value="135x22">135x22</SelectItem>
                        <SelectItem value="140x22">140x22</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {quoteData.boardSize === "other" && (
                      <div className="mt-2">
                        <Input
                          type="text"
                          id="customBoardSize"
                          value={quoteData.customBoardSize}
                          onChange={(e) => onUpdate({ customBoardSize: e.target.value })}
                          placeholder="Enter custom board size"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="deckingType" className="text-sm font-medium text-gray-700">Decking Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.deckingType}
                      onValueChange={(value) => {
                        // When selecting decking type, just update the decking type
                        onUpdate({ deckingType: value });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select decking type" />
                      </SelectTrigger>
                      <SelectContent>
                        {deckingTypeOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="boardType" className="text-sm font-medium text-gray-700">Board Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.boardType}
                      onValueChange={(value) => onUpdate({ boardType: value })}
                      disabled={!quoteData.deckingType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select board type" />
                      </SelectTrigger>
                      <SelectContent>
                        {getBoardTypeOptions(quoteData.deckingType).map((option) => (
                          <SelectItem key={option} value={option}>{option.split('-')[1]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-start">
                  <label className="text-sm font-medium text-gray-700 pt-2">Board Direction:</label>
                  <div className="sm:col-span-2">
                    <RadioGroup 
                      value={quoteData.boardDirection} 
                      onValueChange={(value) => onUpdate({ boardDirection: value as "parallel-long" | "parallel-short" | "diagonal" | "" })}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="parallel-long" id="parallel-long" />
                        <Label htmlFor="parallel-long">Parallel to long side</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="parallel-short" id="parallel-short" />
                        <Label htmlFor="parallel-short">Parallel to short side</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="diagonal" id="diagonal" />
                        <Label htmlFor="diagonal">Diagonal</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Separator className="my-4" />
                
                <h4 className="font-semibold text-sm text-gray-800 mb-3">Fixing & Ground</h4>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="fixingType" className="text-sm font-medium text-gray-700">Fixing Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.fixingType}
                      onValueChange={(value) => onUpdate({ fixingType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fixing type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fixingTypeOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {quoteData.fixingType === "Other" && (
                      <div className="mt-2">
                        <Input
                          type="text"
                          id="fixingTypeOther"
                          value={quoteData.fixingTypeOther}
                          onChange={(e) => onUpdate({ fixingTypeOther: e.target.value })}
                          placeholder="Please specify other fixing type"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="groundType" className="text-sm font-medium text-gray-700">Ground Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.groundType}
                      onValueChange={(value) => onUpdate({ groundType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ground type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Soil">Soil</SelectItem>
                        <SelectItem value="Clay">Clay</SelectItem>
                        <SelectItem value="Sand">Sand</SelectItem>
                        <SelectItem value="Rock">Rock</SelectItem>
                        <SelectItem value="Concrete">Concrete</SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="postInstallation" className="text-sm font-medium text-gray-700">Post Installation:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.postInstallation}
                      onValueChange={(value) => onUpdate({ postInstallation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select post installation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bolt Down">Bolt Down</SelectItem>
                        <SelectItem value="Concrete In Ground">Concrete In Ground</SelectItem>
                        <SelectItem value="Metal Stirrups">Metal Stirrups</SelectItem>
                        <SelectItem value="Metal Brackets">Metal Brackets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="fasciaRequired" className="font-medium">Fascia/Screening Required?</Label>
                  <Switch 
                    id="fasciaRequired" 
                    checked={quoteData.fasciaRequired}
                    onCheckedChange={(checked) => onUpdate({ fasciaRequired: checked })}
                  />
                </div>
                
                {quoteData.fasciaRequired && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center pl-4 border-l-2 border-gray-200">
                    <label htmlFor="fasciaType" className="text-sm font-medium text-gray-700">Fascia Type:</label>
                    <div className="sm:col-span-2">
                      <Select
                        value={quoteData.fasciaType}
                        onValueChange={(value) => onUpdate({ fasciaType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select fascia type" />
                        </SelectTrigger>
                        <SelectContent>
                          {fasciaRequiredOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {quoteData.fasciaType === "Other" && (
                        <div className="mt-2">
                          <Input
                            type="text"
                            id="fasciaTypeOther"
                            value={quoteData.fasciaTypeOther}
                            onChange={(e) => onUpdate({ fasciaTypeOther: e.target.value })}
                            placeholder="Please specify other fascia type"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="digOutRequired" className="font-medium">Dig Out Required?</Label>
                  <Switch 
                    id="digOutRequired" 
                    checked={quoteData.digOutRequired}
                    onCheckedChange={(checked) => onUpdate({ digOutRequired: checked })}
                  />
                </div>
                
                {quoteData.digOutRequired && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center pl-4 border-l-2 border-gray-200">
                    <label htmlFor="digOutSize" className="text-sm font-medium text-gray-700">Dig Out Size (m²):</label>
                    <div className="sm:col-span-2">
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <Input
                          type="number"
                          id="digOutSize"
                          value={quoteData.digOutSize}
                          onChange={(e) => onUpdate({ digOutSize: parseFloat(e.target.value) || 0 })}
                          className="pr-12"
                          step="0.1"
                          min="0"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <span className="h-full inline-flex items-center rounded-r-md border-l border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">m²</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <div className="sm:col-span-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="subframePainted" className="font-medium">Subframe Painted?</Label>
                      <Switch 
                        id="subframePainted" 
                        checked={quoteData.subframePainted}
                        onCheckedChange={(checked) => onUpdate({ subframePainted: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="joistTape" className="font-medium">Joist Protection Tape?</Label>
                      <Switch 
                        id="joistTape" 
                        checked={quoteData.joistProtectionTape}
                        onCheckedChange={(checked) => onUpdate({ joistProtectionTape: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="deckLights" className="font-medium">Deck Lights?</Label>
                      <Switch 
                        id="deckLights" 
                        checked={quoteData.deckLights}
                        onCheckedChange={(checked) => onUpdate({ deckLights: checked })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="stepRampRequired" className="font-medium">Step/Ramp Required?</Label>
                  <Switch 
                    id="stepRampRequired" 
                    checked={quoteData.stepRampRequired}
                    onCheckedChange={(checked) => onUpdate({ stepRampRequired: checked })}
                  />
                </div>
                
                {quoteData.stepRampRequired && (
                  <div className="grid grid-cols-1 gap-4 pl-4 border-l-2 border-gray-200">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                      <label htmlFor="numberOfSteps" className="text-sm font-medium text-gray-700">Number of Steps:</label>
                      <div className="sm:col-span-2">
                        <Input
                          type="number"
                          id="numberOfSteps"
                          value={quoteData.numberOfSteps}
                          onChange={(e) => onUpdate({ numberOfSteps: parseInt(e.target.value) || 0 })}
                          min="0"
                          max="20"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                      <label htmlFor="stepHeight" className="text-sm font-medium text-gray-700">Step Height (mm):</label>
                      <div className="sm:col-span-2">
                        <Input
                          type="number"
                          id="stepHeight"
                          value={quoteData.stepHeight}
                          onChange={(e) => onUpdate({ stepHeight: parseFloat(e.target.value) || 0 })}
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                      <label htmlFor="stepWidth" className="text-sm font-medium text-gray-700">Step Width (mm):</label>
                      <div className="sm:col-span-2">
                        <Input
                          type="number"
                          id="stepWidth"
                          value={quoteData.stepWidth}
                          onChange={(e) => onUpdate({ stepWidth: parseFloat(e.target.value) || 0 })}
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                      <label htmlFor="stepLength" className="text-sm font-medium text-gray-700">Step Length (mm):</label>
                      <div className="sm:col-span-2">
                        <Input
                          type="number"
                          id="stepLength"
                          value={quoteData.stepLength}
                          onChange={(e) => onUpdate({ stepLength: parseFloat(e.target.value) || 0 })}
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                      <label htmlFor="treadMaterial" className="text-sm font-medium text-gray-700">Tread Material:</label>
                      <div className="sm:col-span-2">
                        <Select
                          value={quoteData.treadMaterial}
                          onValueChange={(value) => onUpdate({ treadMaterial: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tread material" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="same-as-deck">Same as Deck</SelectItem>
                            <SelectItem value="timber">Timber</SelectItem>
                            <SelectItem value="concrete">Concrete</SelectItem>
                            <SelectItem value="tile">Tile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="handrailRequired" className="font-medium">Handrail Required?</Label>
                  <Switch 
                    id="handrailRequired" 
                    checked={quoteData.handrailRequired}
                    onCheckedChange={(checked) => onUpdate({ handrailRequired: checked })}
                  />
                </div>
                
                {quoteData.handrailRequired && (
                  <div className="grid grid-cols-1 gap-4 pl-4 border-l-2 border-gray-200 mt-2">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                      <label htmlFor="handrailType" className="text-sm font-medium text-gray-700">Handrail Type:</label>
                      <div className="sm:col-span-2">
                        <Select
                          value={quoteData.handrailType}
                          onValueChange={(value) => onUpdate({ handrailType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select handrail type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Primed Pine">Primed Pine</SelectItem>
                            <SelectItem value="Merbau">Merbau</SelectItem>
                            <SelectItem value="Spotted Gum">Spotted Gum</SelectItem>
                            <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                            <SelectItem value="Aluminium">Aluminium</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                      <label htmlFor="ballustradeType" className="text-sm font-medium text-gray-700">Balustrade Type:</label>
                      <div className="sm:col-span-2">
                        <Select
                          value={quoteData.ballustradeType}
                          onValueChange={(value) => onUpdate({ ballustradeType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select balustrade type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Timber">Timber</SelectItem>
                            <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                            <SelectItem value="Aluminium Slat">Aluminium Slat</SelectItem>
                            <SelectItem value="Glass">Glass</SelectItem>
                            <SelectItem value="Fibre Cement">Fibre Cement</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="demolitionRequired" className="font-medium">Demo of Old Deck Required?</Label>
                  <Switch 
                    id="demolitionRequired" 
                    checked={quoteData.demolitionRequired}
                    onCheckedChange={(checked) => onUpdate({ demolitionRequired: checked })}
                  />
                </div>
                
                {quoteData.demolitionRequired && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center pl-4 border-l-2 border-gray-200">
                    <label htmlFor="existingDeckSize" className="text-sm font-medium text-gray-700">Size of existing deck (m²):</label>
                    <div className="sm:col-span-2">
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <Input
                          type="number"
                          id="existingDeckSize"
                          value={quoteData.existingDeckSize}
                          onChange={(e) => onUpdate({ existingDeckSize: parseFloat(e.target.value) || 0 })}
                          className="pr-12"
                          step="0.1"
                          min="0"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <span className="h-full inline-flex items-center rounded-r-md border-l border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">m²</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Verandah Section Toggle */}
        <div className="ds-card flex items-center justify-between px-5 py-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-900">Verandah Details</h3>
            <p className="text-sm text-gray-500">Include details of pergola or verandah</p>
          </div>
          <Switch 
            checked={quoteData.verandahRequired}
            onCheckedChange={(checked) => onUpdate({ verandahRequired: checked })}
          />
        </div>
        
        {/* Verandah Section */}
        {quoteData.verandahRequired && (
          <div className="ds-card">
            <div className="ds-card-header">
              <h2 className="font-semibold text-gray-900 text-sm">Verandah Details</h2>
            </div>
            <div className="ds-card-body">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="structureType" className="text-sm font-medium text-gray-700">Structure Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.structureType}
                      onValueChange={(value) => onUpdate({ structureType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select structure type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Verandah">Verandah</SelectItem>
                        <SelectItem value="Pergola">Pergola</SelectItem>
                        <SelectItem value="Carport">Carport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="materialType" className="text-sm font-medium text-gray-700">Structure Material:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.materialType}
                      onValueChange={(value) => onUpdate({ materialType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Timber">Timber</SelectItem>
                        <SelectItem value="Steel">Steel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="verandahStyle" className="text-sm font-medium text-gray-700">Verandah Style:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.structureStyle}
                      onValueChange={(value) => onUpdate({ structureStyle: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select verandah style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Straight Gable">Straight Gable</SelectItem>
                        <SelectItem value="Split Gable">Split Gable</SelectItem>
                        <SelectItem value="Intersecting Gable">Intersecting Gable</SelectItem>
                        <SelectItem value="Flat Roof">Flat Roof</SelectItem>
                        <SelectItem value="Hip Roof">Hip Roof</SelectItem>
                        <SelectItem value="Dutch Gable">Dutch Gable</SelectItem>
                        <SelectItem value="Reverse Flat">Reverse Flat</SelectItem>
                        <SelectItem value="Skillion">Skillion</SelectItem>
                        <SelectItem value="Fly Over">Fly Over</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="roofType" className="text-sm font-medium text-gray-700">Roof Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.roofType}
                      onValueChange={(value) => onUpdate({ roofType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select roof type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CGI">CGI</SelectItem>
                        <SelectItem value="Poly Clear">Poly Clear</SelectItem>
                        <SelectItem value="Poly Opal">Poly Opal</SelectItem>
                        <SelectItem value="Poly Grey">Poly Grey</SelectItem>
                        <SelectItem value="Poly Bronze">Poly Bronze</SelectItem>
                        <SelectItem value="Poly Black Opal">Poly Black Opal</SelectItem>
                        <SelectItem value="Poly Heat Shield">Poly Heat Shield</SelectItem>
                        <SelectItem value="Fibreglass">Fibreglass</SelectItem>
                        <SelectItem value="Insulated Panel">Insulated Panel</SelectItem>
                        <SelectItem value="Solarspan">Solarspan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="roofSpan" className="text-sm font-medium text-gray-700">Roof Length (m):</label>
                  <div className="sm:col-span-2">
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <Input
                        type="number"
                        id="roofSpan"
                        value={quoteData.roofSpan}
                        onChange={(e) => onUpdate({ roofSpan: parseFloat(e.target.value) || 0 })}
                        className="pr-12"
                        step="0.1"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <span className="h-full inline-flex items-center rounded-r-md border-l border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">m</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="roofLength" className="text-sm font-medium text-gray-700">Roof Width (m):</label>
                  <div className="sm:col-span-2">
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <Input
                        type="number"
                        id="roofLength"
                        value={quoteData.roofLength}
                        onChange={(e) => onUpdate({ roofLength: parseFloat(e.target.value) || 0 })}
                        className="pr-12"
                        step="0.1"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <span className="h-full inline-flex items-center rounded-r-md border-l border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">m</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="existingFasciaHeight" className="text-sm font-medium text-gray-700">Existing Fascia Height (mm):</label>
                  <div className="sm:col-span-2">
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <Input
                        type="number"
                        id="existingFasciaHeight"
                        value={quoteData.existingFasciaHeight || ""}
                        onChange={(e) => onUpdate({ existingFasciaHeight: e.target.value ? parseInt(e.target.value) : 0 })}
                        className="pr-12"
                        step="1"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <span className="h-full inline-flex items-center rounded-r-md border-l border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">mm</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {quoteData.structureStyle && quoteData.structureStyle.includes("Gable") && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                    <label htmlFor="gableInfill" className="text-sm font-medium text-gray-700">Gable Infill:</label>
                    <div className="sm:col-span-2">
                      <Select
                        value={quoteData.gableInfill || ""}
                        onValueChange={(value) => onUpdate({ gableInfill: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gable infill type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Timber Slats">Timber Slats</SelectItem>
                          <SelectItem value="Aluminum Slats">Aluminum Slats</SelectItem>
                          <SelectItem value="FC Sheeting">FC Sheeting</SelectItem>
                          <SelectItem value="Polycarbonate">Polycarbonate</SelectItem>
                          <SelectItem value="Lattice">Lattice</SelectItem>
                          <SelectItem value="Match Roof">Match Roof</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                {quoteData.structureStyle && quoteData.structureStyle.includes("Gable") && quoteData.gableInfill === "Custom" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center pl-4 border-l-2 border-gray-200">
                    <label htmlFor="gableInfillDetail" className="text-sm font-medium text-gray-700">Gable Infill Details:</label>
                    <div className="sm:col-span-2">
                      <Textarea
                        id="gableInfillDetail"
                        value={quoteData.gableInfillDetail || ""}
                        onChange={(e) => onUpdate({ gableInfillDetail: e.target.value })}
                        placeholder="Please provide details about the custom gable infill..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="roofPitch" className="text-sm font-medium text-gray-700">Roof Pitch (°):</label>
                  <div className="sm:col-span-2">
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <Input
                        type="number"
                        id="roofPitch"
                        value={quoteData.roofPitch}
                        onChange={(e) => onUpdate({ roofPitch: parseFloat(e.target.value) || 0 })}
                        className="pr-12"
                        step="1"
                        min="0"
                        max="45"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <span className="h-full inline-flex items-center rounded-r-md border-l border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">°</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="roofColorUp" className="text-sm font-medium text-gray-700">Roof Color (Top):</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.roofColorUp}
                      onValueChange={(value) => onUpdate({ roofColorUp: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select roof color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Surfmist">Surfmist</SelectItem>
                        <SelectItem value="Dover White">Dover White</SelectItem>
                        <SelectItem value="Paperbark">Paperbark</SelectItem>
                        <SelectItem value="Classic Cream">Classic Cream</SelectItem>
                        <SelectItem value="Evening Haze">Evening Haze</SelectItem>
                        <SelectItem value="Shale Grey">Shale Grey</SelectItem>
                        <SelectItem value="Dune">Dune</SelectItem>
                        <SelectItem value="Cove">Cove</SelectItem>
                        <SelectItem value="Pale Eucalypt">Pale Eucalypt</SelectItem>
                        <SelectItem value="Gully">Gully</SelectItem>
                        <SelectItem value="Mangrove">Mangrove</SelectItem>
                        <SelectItem value="Wallaby">Wallaby</SelectItem>
                        <SelectItem value="Basalt">Basalt</SelectItem>
                        <SelectItem value="Ironstone">Ironstone</SelectItem>
                        <SelectItem value="Woodland Grey">Woodland Grey</SelectItem>
                        <SelectItem value="Monument">Monument</SelectItem>
                        <SelectItem value="Night Sky">Night Sky</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="roofColorDown" className="text-sm font-medium text-gray-700">Roof Color (Bottom):</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.roofColorDown}
                      onValueChange={(value) => onUpdate({ roofColorDown: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select roof color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Surfmist">Surfmist</SelectItem>
                        <SelectItem value="Dover White">Dover White</SelectItem>
                        <SelectItem value="Paperbark">Paperbark</SelectItem>
                        <SelectItem value="Classic Cream">Classic Cream</SelectItem>
                        <SelectItem value="Evening Haze">Evening Haze</SelectItem>
                        <SelectItem value="Shale Grey">Shale Grey</SelectItem>
                        <SelectItem value="Dune">Dune</SelectItem>
                        <SelectItem value="Cove">Cove</SelectItem>
                        <SelectItem value="Pale Eucalypt">Pale Eucalypt</SelectItem>
                        <SelectItem value="Gully">Gully</SelectItem>
                        <SelectItem value="Mangrove">Mangrove</SelectItem>
                        <SelectItem value="Wallaby">Wallaby</SelectItem>
                        <SelectItem value="Basalt">Basalt</SelectItem>
                        <SelectItem value="Ironstone">Ironstone</SelectItem>
                        <SelectItem value="Woodland Grey">Woodland Grey</SelectItem>
                        <SelectItem value="Monument">Monument</SelectItem>
                        <SelectItem value="Night Sky">Night Sky</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="beamSize" className="text-sm font-medium text-gray-700">Beam Size:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.beamSize}
                      onValueChange={(value) => onUpdate({ beamSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select beam size" />
                      </SelectTrigger>
                      <SelectContent>
                        {quoteData.materialType === "Steel" ? (
                          <>
                            <SelectItem value="Outback 120x60">Outback 120x60</SelectItem>
                            <SelectItem value="100x100 SHS">100x100 SHS</SelectItem>
                            <SelectItem value="125x125 SHS">125x125 SHS</SelectItem>
                            <SelectItem value="150x150 SHS">150x150 SHS</SelectItem>
                            <SelectItem value="C Section">C Section</SelectItem>
                            <SelectItem value="150x50 RHS">150x50 RHS</SelectItem>
                            <SelectItem value="175x50 RHS">175x50 RHS</SelectItem>
                            <SelectItem value="200x50 RHS">200x50 RHS</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="140x45 MGP10">140x45 MGP10</SelectItem>
                            <SelectItem value="190x45 MGP10">190x45 MGP10</SelectItem>
                            <SelectItem value="240x45 MGP10">240x45 MGP10</SelectItem>
                            <SelectItem value="290x45 MGP10">290x45 MGP10</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="rafterSize" className="text-sm font-medium text-gray-700">Rafter Size:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.rafterSize}
                      onValueChange={(value) => onUpdate({ rafterSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rafter size" />
                      </SelectTrigger>
                      <SelectContent>
                        {quoteData.materialType === "Steel" ? (
                          <>
                            <SelectItem value="Outback Beam">Outback Beam</SelectItem>
                            <SelectItem value="40x20 RHS">40x20 RHS</SelectItem>
                            <SelectItem value="50x25 RHS">50x25 RHS</SelectItem>
                            <SelectItem value="75x25 RHS">75x25 RHS</SelectItem>
                            <SelectItem value="100x50 RHS">100x50 RHS</SelectItem>
                            <SelectItem value="125x50 RHS">125x50 RHS</SelectItem>
                            <SelectItem value="C Section">C Section</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="90x45 MGP10">90x45 MGP10</SelectItem>
                            <SelectItem value="140x45 MGP10">140x45 MGP10</SelectItem>
                            <SelectItem value="190x45 MGP10">190x45 MGP10</SelectItem>
                            <SelectItem value="240x45 MGP10">240x45 MGP10</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="postSize" className="text-sm font-medium text-gray-700">Post Size:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.postSize}
                      onValueChange={(value) => onUpdate({ postSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select post size" />
                      </SelectTrigger>
                      <SelectContent>
                        {quoteData.materialType === "Steel" ? (
                          <>
                            <SelectItem value="Outback 68x68">Outback 68x68</SelectItem>
                            <SelectItem value="65x65 SHS">65x65 SHS</SelectItem>
                            <SelectItem value="75x75 SHS">75x75 SHS</SelectItem>
                            <SelectItem value="90x90 SHS">90x90 SHS</SelectItem>
                            <SelectItem value="100x100 SHS">100x100 SHS</SelectItem>
                            <SelectItem value="125x125 SHS">125x125 SHS</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="88x88 H4">88x88 H4</SelectItem>
                            <SelectItem value="112x112 H4">112x112 H4</SelectItem>
                            <SelectItem value="90x90 Merbau">90x90 Merbau</SelectItem>
                            <SelectItem value="112x112 Merbau">112x112 Merbau</SelectItem>
                            <SelectItem value="140x140 Merbau">140x140 Merbau</SelectItem>
                            <SelectItem value="140x140 Timber">140x140 Timber</SelectItem>
                            <SelectItem value="140x140 Aluminium Wrap">140x140 Aluminium Wrap</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="ceilingType" className="text-sm font-medium text-gray-700">Ceiling Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.ceilingType}
                      onValueChange={(value) => onUpdate({ ceilingType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ceiling type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Exposed Rafters">Exposed Rafters</SelectItem>
                        <SelectItem value="Plasterboard">Plasterboard</SelectItem>
                        <SelectItem value="Timber Lining">Timber Lining</SelectItem>
                        <SelectItem value="Colorbond">Colorbond</SelectItem>
                        <SelectItem value="FC Sheet">FC Sheet</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="gutterType" className="text-sm font-medium text-gray-700">Gutter Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.gutterType}
                      onValueChange={(value) => onUpdate({ gutterType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gutter type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Quad 115">Quad 115</SelectItem>
                        <SelectItem value="Quad 150">Quad 150</SelectItem>
                        <SelectItem value="Half Round">Half Round</SelectItem>
                        <SelectItem value="Square Line">Square Line</SelectItem>
                        <SelectItem value="OG">OG</SelectItem>
                        <SelectItem value="Fascia Gutter">Fascia Gutter</SelectItem>
                        <SelectItem value="Box Gutter">Box Gutter</SelectItem>
                        <SelectItem value="Sheerline">Sheerline</SelectItem>
                        <SelectItem value="Colorbond Slotted">Colorbond Slotted</SelectItem>
                        <SelectItem value="Colorbond Smoothline">Colorbond Smoothline</SelectItem>
                        <SelectItem value="No Gutter">No Gutter</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="gutterColor" className="text-sm font-medium text-gray-700">Gutter Color:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.gutterColor}
                      onValueChange={(value) => onUpdate({ gutterColor: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gutter color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Surfmist">Surfmist</SelectItem>
                        <SelectItem value="Dover White">Dover White</SelectItem>
                        <SelectItem value="Paperbark">Paperbark</SelectItem>
                        <SelectItem value="Classic Cream">Classic Cream</SelectItem>
                        <SelectItem value="Evening Haze">Evening Haze</SelectItem>
                        <SelectItem value="Shale Grey">Shale Grey</SelectItem>
                        <SelectItem value="Dune">Dune</SelectItem>
                        <SelectItem value="Cove">Cove</SelectItem>
                        <SelectItem value="Pale Eucalypt">Pale Eucalypt</SelectItem>
                        <SelectItem value="Gully">Gully</SelectItem>
                        <SelectItem value="Mangrove">Mangrove</SelectItem>
                        <SelectItem value="Wallaby">Wallaby</SelectItem>
                        <SelectItem value="Basalt">Basalt</SelectItem>
                        <SelectItem value="Ironstone">Ironstone</SelectItem>
                        <SelectItem value="Woodland Grey">Woodland Grey</SelectItem>
                        <SelectItem value="Monument">Monument</SelectItem>
                        <SelectItem value="Night Sky">Night Sky</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="gutterFallDirection" className="text-sm font-medium text-gray-700">Gutter Fall Direction:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.gutterFallDirection || ""}
                      onValueChange={(value) => onUpdate({ gutterFallDirection: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gutter fall direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Left">Left</SelectItem>
                        <SelectItem value="Right">Right</SelectItem>
                        <SelectItem value="Center">Center</SelectItem>
                        <SelectItem value="Both Sides">Both Sides</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="numberOfDownpipes" className="text-sm font-medium text-gray-700">Number of Downpipes:</label>
                  <div className="sm:col-span-2">
                    <Input
                      type="number"
                      id="numberOfDownpipes"
                      value={quoteData.numberOfDownpipes || 0}
                      onChange={(e) => onUpdate({ numberOfDownpipes: parseInt(e.target.value) || 0 })}
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="downpipeConnection" className="text-sm font-medium text-gray-700">Downpipe Connected To:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.downpipeConnection || ""}
                      onValueChange={(value) => onUpdate({ downpipeConnection: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select connection type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stormwater">Stormwater</SelectItem>
                        <SelectItem value="Tank">Tank</SelectItem>
                        <SelectItem value="Soakage Pit">Soakage Pit</SelectItem>
                        <SelectItem value="Surface Discharge">Surface Discharge</SelectItem>
                        <SelectItem value="Existing Gutter">Existing Gutter</SelectItem>
                        <SelectItem value="Rainhead">Rainhead</SelectItem>
                        <SelectItem value="Not Required">Not Required</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="flashingRequired" className="font-medium">Extra Flashing Required?</Label>
                  <Switch 
                    id="flashingRequired" 
                    checked={quoteData.flashingRequired || false}
                    onCheckedChange={(checked) => onUpdate({ flashingRequired: checked })}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="insulationType" className="text-sm font-medium text-gray-700">Insulation Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.insulationType || "None"}
                      onValueChange={(value) => onUpdate({ insulationType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select insulation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Aircell">Aircell</SelectItem>
                        <SelectItem value="PanelRoof">PanelRoof</SelectItem>
                        <SelectItem value="Anticon">Anticon</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-start pt-2">
                  <label className="text-sm font-medium text-gray-700 pt-2">Painting Required:</label>
                  <div className="sm:col-span-2">
                    <RadioGroup 
                      value={quoteData.paintingRequired} 
                      onValueChange={(value) => onUpdate({ paintingRequired: value as "not-required" | "by-client" | "by-ahdp" })}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-required" id="not-required-painting" />
                        <Label htmlFor="not-required-painting">Not required</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="by-client" id="client-painting" />
                        <Label htmlFor="client-painting">By Client</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="by-ahdp" id="ahdp-painting" />
                        <Label htmlFor="ahdp-painting">By AHDP</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                {quoteData.paintingRequired === "by-ahdp" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center pl-4 border-l-2 border-gray-200">
                    <label htmlFor="paintColor" className="text-sm font-medium text-gray-700">Paint Color:</label>
                    <div className="sm:col-span-2">
                      <Select
                        value={quoteData.paintColor}
                        onValueChange={(value) => onUpdate({ paintColor: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select paint color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Surfmist">Surfmist</SelectItem>
                          <SelectItem value="Dover White">Dover White</SelectItem>
                          <SelectItem value="Paperbark">Paperbark</SelectItem>
                          <SelectItem value="Classic Cream">Classic Cream</SelectItem>
                          <SelectItem value="Evening Haze">Evening Haze</SelectItem>
                          <SelectItem value="Shale Grey">Shale Grey</SelectItem>
                          <SelectItem value="Dune">Dune</SelectItem>
                          <SelectItem value="Cove">Cove</SelectItem>
                          <SelectItem value="Pale Eucalypt">Pale Eucalypt</SelectItem>
                          <SelectItem value="Gully">Gully</SelectItem>
                          <SelectItem value="Mangrove">Mangrove</SelectItem>
                          <SelectItem value="Wallaby">Wallaby</SelectItem>
                          <SelectItem value="Basalt">Basalt</SelectItem>
                          <SelectItem value="Ironstone">Ironstone</SelectItem>
                          <SelectItem value="Woodland Grey">Woodland Grey</SelectItem>
                          <SelectItem value="Monument">Monument</SelectItem>
                          <SelectItem value="Night Sky">Night Sky</SelectItem>
                          <SelectItem value="Natural">Natural</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Walls & Screening Section Toggle */}
        <div className="ds-card flex items-center justify-between px-5 py-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-900">Walls & Screening</h3>
            <p className="text-sm text-gray-500">Include details of walls and screening</p>
          </div>
          <Switch 
            checked={quoteData.screeningRequired}
            onCheckedChange={(checked) => onUpdate({ screeningRequired: checked })}
          />
        </div>
        
        {/* Walls & Screening Section */}
        {quoteData.screeningRequired && (
          <div className="ds-card">
            <div className="ds-card-header">
              <h2 className="font-semibold text-gray-900 text-sm">Walls & Screening Details</h2>
            </div>
            <div className="ds-card-body">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="screeningType" className="text-sm font-medium text-gray-700">Screening Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.wallType}
                      onValueChange={(value) => onUpdate({ wallType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select screening type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Privacy/Screening">Privacy/Screening</SelectItem>
                        <SelectItem value="Balustrade">Balustrade</SelectItem>
                        <SelectItem value="Wall">Wall</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="claddingType" className="text-sm font-medium text-gray-700">Cladding Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.screenMaterial}
                      onValueChange={(value) => onUpdate({ screenMaterial: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cladding type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Merbau Horizontal">Merbau Horizontal</SelectItem>
                        <SelectItem value="Merbau Vertical">Merbau Vertical</SelectItem>
                        <SelectItem value="Treated Pine">Treated Pine</SelectItem>
                        <SelectItem value="FC Sheeting">FC Sheeting</SelectItem>
                        <SelectItem value="CFC Cladding">CFC Cladding</SelectItem>
                        <SelectItem value="Weatherboards">Weatherboards</SelectItem>
                        <SelectItem value="Rendered Blueboard">Rendered Blueboard</SelectItem>
                        <SelectItem value="Aluminium Slatting">Aluminium Slatting</SelectItem>
                        <SelectItem value="Colorbond">Colorbond</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="wallHeight" className="text-sm font-medium text-gray-700">Wall/Screen Height (m):</label>
                  <div className="sm:col-span-2">
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <Input
                        type="number"
                        id="claddingHeight"
                        value={quoteData.claddingHeight}
                        onChange={(e) => onUpdate({ claddingHeight: parseFloat(e.target.value) || 0 })}
                        className="pr-12"
                        step="0.1"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <span className="h-full inline-flex items-center rounded-r-md border-l border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">m</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="numberOfBays" className="text-sm font-medium text-gray-700">Number of Bays:</label>
                  <div className="sm:col-span-2">
                    <Input
                      type="number"
                      id="numberOfBays"
                      value={quoteData.numberOfBays}
                      onChange={(e) => onUpdate({ numberOfBays: parseInt(e.target.value) || 0 })}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="postSpacing" className="text-sm font-medium text-gray-700">Post Spacing:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.postSpacing || ""}
                      onValueChange={(value) => onUpdate({ postSpacing: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select post spacing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="900mm">900mm</SelectItem>
                        <SelectItem value="1200mm">1200mm</SelectItem>
                        <SelectItem value="1800mm">1800mm</SelectItem>
                        <SelectItem value="2400mm">2400mm</SelectItem>
                        <SelectItem value="3000mm">3000mm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="topInfillType" className="text-sm font-medium text-gray-700">Top Infill Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.topInfillType || ""}
                      onValueChange={(value) => onUpdate({ topInfillType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select top infill type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FC Sheeting">FC Sheeting</SelectItem>
                        <SelectItem value="Timber Slats">Timber Slats</SelectItem>
                        <SelectItem value="Aluminium Slats">Aluminium Slats</SelectItem>
                        <SelectItem value="Polycarb">Polycarb</SelectItem>
                        <SelectItem value="CGI">CGI</SelectItem>
                        <SelectItem value="Weatherboard">Weatherboard</SelectItem>
                        <SelectItem value="Rendered Blueboard">Rendered Blueboard</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="bottomInfillType" className="text-sm font-medium text-gray-700">Bottom Infill Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.bottomInfillType || ""}
                      onValueChange={(value) => onUpdate({ bottomInfillType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bottom infill type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FC Sheeting">FC Sheeting</SelectItem>
                        <SelectItem value="Timber Slats">Timber Slats</SelectItem>
                        <SelectItem value="Aluminium Slats">Aluminium Slats</SelectItem>
                        <SelectItem value="Polycarb">Polycarb</SelectItem>
                        <SelectItem value="CGI">CGI</SelectItem>
                        <SelectItem value="Weatherboard">Weatherboard</SelectItem>
                        <SelectItem value="Rendered Blueboard">Rendered Blueboard</SelectItem>
                        <SelectItem value="Same as Top">Same as Top</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  <label htmlFor="screenFixingTypeDetail" className="text-sm font-medium text-gray-700">Screen Fixing Type:</label>
                  <div className="sm:col-span-2">
                    <Select
                      value={quoteData.screenFixingTypeDetail || ""}
                      onValueChange={(value) => onUpdate({ screenFixingTypeDetail: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select screen fixing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SS Screws">SS Screws</SelectItem>
                        <SelectItem value="Concealed">Concealed</SelectItem>
                        <SelectItem value="Nailed">Nailed</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-start pt-2">
                  <label className="text-sm font-medium text-gray-700 pt-2">Paint/Stain Required:</label>
                  <div className="sm:col-span-2">
                    <RadioGroup 
                      value={quoteData.paintStainRequired || "no"} 
                      onValueChange={(value) => onUpdate({ paintStainRequired: value as "no" | "by-client" | "by-ahdp" })}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no-painting-screen" />
                        <Label htmlFor="no-painting-screen">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="by-client" id="client-painting-screen" />
                        <Label htmlFor="client-painting-screen">By Client</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="by-ahdp" id="ahdp-painting-screen" />
                        <Label htmlFor="ahdp-painting-screen">By AHDP</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                {quoteData.paintStainRequired !== "no" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center pl-4 border-l-2 border-gray-200">
                    <label htmlFor="paintStainColor" className="text-sm font-medium text-gray-700">Paint/Stain Color:</label>
                    <div className="sm:col-span-2">
                      <Select
                        value={quoteData.paintStainColor || ""}
                        onValueChange={(value) => onUpdate({ paintStainColor: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Clear">Clear</SelectItem>
                          <SelectItem value="Natural">Natural</SelectItem>
                          <SelectItem value="Merbau">Merbau</SelectItem>
                          <SelectItem value="Jarrah">Jarrah</SelectItem>
                          <SelectItem value="Walnut">Walnut</SelectItem>
                          <SelectItem value="Mahogany">Mahogany</SelectItem>
                          <SelectItem value="White">White</SelectItem>
                          <SelectItem value="Light Grey">Light Grey</SelectItem>
                          <SelectItem value="Dark Grey">Dark Grey</SelectItem>
                          <SelectItem value="Black">Black</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Extras Section Toggle */}
        <div className="ds-card flex items-center justify-between px-5 py-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-900">Extras</h3>
            <p className="text-sm text-gray-500">Additional services and requirements</p>
          </div>
          <Switch 
            checked={quoteData.extrasRequired}
            onCheckedChange={(checked) => onUpdate({ extrasRequired: checked })}
          />
        </div>
        
        {/* Extras Section */}
        {quoteData.extrasRequired && (
          <div className="ds-card">
            <div className="ds-card-header">
              <h2 className="font-semibold text-gray-900 text-sm">Extra Services and Requirements</h2>
            </div>
            <div className="ds-card-body">
              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="binHireRequired" 
                      checked={quoteData.binHireRequired}
                      onCheckedChange={(checked: boolean | "indeterminate") => onUpdate({ binHireRequired: checked === true })}
                    />
                    <label htmlFor="binHireRequired" className="text-sm font-medium text-gray-700">
                      Bin Hire Required
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="rubbishRemoval" 
                      checked={quoteData.rubbishRemoval}
                      onCheckedChange={(checked: boolean | "indeterminate") => onUpdate({ rubbishRemoval: checked === true })}
                    />
                    <label htmlFor="rubbishRemoval" className="text-sm font-medium text-gray-700">
                      Rubbish Removal
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="pavingCutRequired" 
                      checked={quoteData.pavingCutRequired}
                      onCheckedChange={(checked: boolean | "indeterminate") => onUpdate({ pavingCutRequired: checked === true })}
                    />
                    <label htmlFor="pavingCutRequired" className="text-sm font-medium text-gray-700">
                      Paving Cut Required
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="landscapingRetainingRequired" 
                      checked={quoteData.landscapingRetainingRequired}
                      onCheckedChange={(checked: boolean | "indeterminate") => onUpdate({ landscapingRetainingRequired: checked === true })}
                    />
                    <label htmlFor="landscapingRetainingRequired" className="text-sm font-medium text-gray-700">
                      Landscaping/Retaining Required
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="electricalWorkRequired" 
                      checked={quoteData.electricalWorkRequired}
                      onCheckedChange={(checked: boolean | "indeterminate") => onUpdate({ electricalWorkRequired: checked === true })}
                    />
                    <label htmlFor="electricalWorkRequired" className="text-sm font-medium text-gray-700">
                      Electrical Work Required
                    </label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="plumbingWorkRequired" 
                      checked={quoteData.plumbingWorkRequired}
                      onCheckedChange={(checked: boolean | "indeterminate") => onUpdate({ plumbingWorkRequired: checked === true })}
                    />
                    <label htmlFor="plumbingWorkRequired" className="text-sm font-medium text-gray-700">
                      Plumbing Work Required
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="asbestosRemovalRequired" 
                      checked={quoteData.asbestosRemovalRequired}
                      onCheckedChange={(checked: boolean | "indeterminate") => onUpdate({ asbestosRemovalRequired: checked === true })}
                    />
                    <label htmlFor="asbestosRemovalRequired" className="text-sm font-medium text-gray-700">
                      Asbestos Removal Required
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="coreDrillingRequired" 
                      checked={quoteData.coreDrillingRequired}
                      onCheckedChange={(checked: boolean | "indeterminate") => onUpdate({ coreDrillingRequired: checked === true })}
                    />
                    <label htmlFor="coreDrillingRequired" className="text-sm font-medium text-gray-700">
                      Core Drilling Required
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="extraExcavationRequired" 
                      checked={quoteData.extraExcavationRequired}
                      onCheckedChange={(checked: boolean | "indeterminate") => onUpdate({ extraExcavationRequired: checked === true })}
                    />
                    <label htmlFor="extraExcavationRequired" className="text-sm font-medium text-gray-700">
                      Extra Excavation Required
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="stairHandrailFixRequired" 
                      checked={quoteData.stairHandrailFixRequired}
                      onCheckedChange={(checked: boolean | "indeterminate") => onUpdate({ stairHandrailFixRequired: checked === true })}
                    />
                    <label htmlFor="stairHandrailFixRequired" className="text-sm font-medium text-gray-700">
                      Stair/Handrail Fix Required
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="extraTradesRequired" className="text-sm font-medium text-gray-700 block mb-2">
                    Extra Trades Required
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {['Builder', 'Electrician', 'Plumber', 'Landscaper', 'Concretor', 'Renderer', 'Painter'].map((trade) => (
                      <div key={trade} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`trade-${trade.toLowerCase()}`}
                          checked={quoteData.extraTradesRequired.includes(trade)}
                          onCheckedChange={(checked: boolean | "indeterminate") => {
                            const currentTrades = [...quoteData.extraTradesRequired];
                            if (checked === true) {
                              if (!currentTrades.includes(trade)) {
                                currentTrades.push(trade);
                              }
                            } else {
                              const index = currentTrades.indexOf(trade);
                              if (index !== -1) {
                                currentTrades.splice(index, 1);
                              }
                            }
                            onUpdate({ extraTradesRequired: currentTrades });
                          }}
                        />
                        <label htmlFor={`trade-${trade.toLowerCase()}`} className="text-sm text-gray-700">
                          {trade}
                        </label>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trade-other"
                        checked={quoteData.extraTradesRequired.includes('Other')}
                        onCheckedChange={(checked: boolean | "indeterminate") => {
                          const currentTrades = [...quoteData.extraTradesRequired];
                          if (checked === true) {
                            if (!currentTrades.includes('Other')) {
                              currentTrades.push('Other');
                            }
                          } else {
                            const index = currentTrades.indexOf('Other');
                            if (index !== -1) {
                              currentTrades.splice(index, 1);
                            }
                            onUpdate({ extraTradesOther: '' });
                          }
                          onUpdate({ extraTradesRequired: currentTrades });
                        }}
                      />
                      <label htmlFor="trade-other" className="text-sm text-gray-700">
                        Other
                      </label>
                    </div>
                  </div>
                </div>
                
                {quoteData.extraTradesRequired.includes('Other') && (
                  <div>
                    <label htmlFor="extraTradesOther" className="text-sm font-medium text-gray-700 block mb-1">
                      Please specify other trades:
                    </label>
                    <Input
                      id="extraTradesOther"
                      value={quoteData.extraTradesOther}
                      onChange={(e) => onUpdate({ extraTradesOther: e.target.value })}
                      placeholder="Please specify other trades required"
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="miscellaneousNotes" className="text-sm font-medium text-gray-700 block mb-1">
                    Miscellaneous Notes
                  </label>
                  <Textarea
                    id="miscellaneousNotes"
                    value={quoteData.miscellaneousNotes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate({ miscellaneousNotes: e.target.value })}
                    placeholder="Any additional notes about extra requirements"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button type="button" onClick={onBack} className="ds-btn-ghost">
            ← Back
          </button>
          <button type="button" onClick={onNext} className="ds-btn-primary">
            Next: Extras →
          </button>
        </div>
      </div>
    </div>
  );
}