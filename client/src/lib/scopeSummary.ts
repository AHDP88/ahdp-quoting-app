import { QuoteData } from "@/components/QuoteBuilder";

function cleanMaterialLabel(value: string) {
  return value
    .replace(/^deck\.mat\./i, "")
    .replace(/\./g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Generates a professional natural-language scope summary from QuoteData.
 * Used on both the live sidebar and the final quote preview.
 */
export function buildScopeStatement(q: QuoteData): string {
  const parts: string[] = [];

  if (q.deckingRequired && q.length > 0 && q.width > 0) {
    const area = (q.length * q.width).toFixed(1);
    const board = cleanMaterialLabel(q.boardType || q.deckingType || "timber");
    const heightNote =
      q.height > 1.2
        ? ` elevated to ${q.height}m`
        : q.height > 0.6
        ? ` at ${q.height}m clearance`
        : "";
    const stepNote =
      q.stepRampRequired && q.numberOfSteps > 0
        ? ` with ${q.numberOfSteps} step${q.numberOfSteps > 1 ? "s" : ""}`
        : "";
    parts.push(
      `Supply and installation of a ${area} m² ${board} deck${heightNote}${stepNote}`
    );
  }

  if (q.verandahRequired && q.roofSpan > 0 && q.roofLength > 0) {
    const area = (q.roofSpan * q.roofLength).toFixed(1);
    const style = q.structureStyle ? `${q.structureStyle.toLowerCase()} ` : "";
    const mat = q.materialType ? `${q.materialType.toLowerCase()} ` : "";
    const type = q.structureType || "pergola/verandah";
    parts.push(
      `${area} m² ${mat}${style}${type.toLowerCase()} roof structure`
    );
  }

  if (q.screeningRequired && q.wallType) {
    const bayNote =
      q.numberOfBays > 0 ? ` (${q.numberOfBays} bay${q.numberOfBays > 1 ? "s" : ""})` : "";
    parts.push(`${q.wallType} walls and screening${bayNote}`);
  }

  const electricalItems: string[] = [];
  if (q.electricalWorkRequired) {
    if (q.numCeilingFans > 0)
      electricalItems.push(`${q.numCeilingFans} ceiling fan${q.numCeilingFans > 1 ? "s" : ""}`);
    if (q.numHeaters > 0)
      electricalItems.push(`${q.numHeaters} heater${q.numHeaters > 1 ? "s" : ""}`);
    if (q.numLights > 0)
      electricalItems.push(`${q.numLights} light${q.numLights > 1 ? "s" : ""}`);
    if (q.numPowerPoints > 0)
      electricalItems.push(`${q.numPowerPoints} power point${q.numPowerPoints > 1 ? "s" : ""}`);
  }
  if (electricalItems.length > 0) {
    parts.push(`electrical including ${electricalItems.join(", ")}`);
  }

  const extras: string[] = [];
  if (q.councilApproval) extras.push("council approval");
  if (q.binHireRequired) extras.push("skip bin hire");
  if (extras.length > 0) parts.push(extras.join(" and "));

  if (parts.length === 0) return "";
  if (parts.length === 1) return `${parts[0]}, including all labour and materials.`;

  const last = parts.pop()!;
  return `${parts.join("; ")}; and ${last} — all labour and materials included.`;
}

export function buildInclusionsChecklist(q: QuoteData): string[] {
  const items: string[] = [];

  if (q.deckingRequired) {
    items.push("Decking materials (boards, joists, bearers, posts, fixings)");
    items.push("Carpenter labour — full deck installation");
    if (q.height > 0.6) items.push("Elevated subframe — height surcharge applied");
    if (q.stepRampRequired && q.numberOfSteps > 0)
      items.push(`Steps/ramp construction (${q.numberOfSteps} step${q.numberOfSteps > 1 ? "s" : ""})`);
    if (q.handrailRequired) items.push(`Handrail — ${q.handrailType || "Merbau"}`);
    if (q.ballustradeType) items.push(`Balustrade — ${q.ballustradeType}`);
    if (q.paintingRequired === "by-ahdp") items.push("Deck oil/stain application by AHDP");
    if (q.demolitionRequired) items.push("Demolition and removal of existing structure");
    if (q.digOutRequired && q.digOutSize > 0) items.push("Dig-out and soil disposal");
  }

  if (q.verandahRequired) {
    const mat = q.materialType || "Timber";
    items.push(`${mat} verandah/pergola roof structure — materials`);
    items.push(`${mat} verandah/pergola — carpenter installation`);
    if (q.ceilingType && !q.ceilingType.toLowerCase().includes("exposed"))
      items.push(`Ceiling lining — ${q.ceilingType}`);
    if (q.flashingRequired) items.push("Roof flashing");
    if (q.gableInfill && q.structureStyle?.toLowerCase().includes("gable"))
      items.push(`Gable infill — ${q.gableInfill}`);
    if (q.paintingRequired === "by-ahdp") items.push("Painting — 2 coats by AHDP");
  }

  if (q.screeningRequired) {
    items.push(`${q.wallType || "Screening"} wall panels — materials`);
    items.push("Carpenter/installer — wall and screening labour");
    if (q.paintStainRequired === "by-ahdp") items.push("Screen paint/stain — both sides by AHDP");
  }

  if (q.electricalWorkRequired) {
    if (q.numCeilingFans > 0) items.push(`Ceiling fans × ${q.numCeilingFans} (supply + licensed install)`);
    if (q.numLights > 0) items.push(`Downlights × ${q.numLights} (supply + licensed install)`);
    if (q.numHeaters > 0) items.push(`Radiant heaters × ${q.numHeaters} (supply + licensed install)`);
    if (q.numPowerPoints > 0) items.push(`Twin exterior GPO × ${q.numPowerPoints} (supply + licensed install)`);
    if (q.deckLights) items.push("Deck feature lights — warm white 30mm (supply + install)");
  }

  if (q.councilApproval) items.push("Council DA/CDC approval — documentation and lodgement");
  if (q.binHireRequired) items.push("Skip bin hire — waste removal from site");
  if (q.concreteFootingsRequired) items.push("Concrete footings to engineering specification");
  if (q.coreDrillingRequired) items.push("Core drilling");
  if (q.asbestosRemovalRequired) items.push("Asbestos identification and licensed removal");

  return items;
}

/**
 * Items explicitly NOT included in this quote — important for managing client expectations.
 */
export function buildExclusionsList(q: QuoteData): string[] {
  const items: string[] = [];

  if (q.deckingRequired) {
    if (q.paintingRequired !== "by-ahdp")
      items.push("Deck oiling/staining — not included (to be arranged by client or quoted separately)");
    if (!q.handrailRequired && q.height > 0.8)
      items.push("Handrails/balustrades — not included in this quote");
  }

  if (q.verandahRequired) {
    if (q.paintingRequired !== "by-ahdp")
      items.push("Painting/staining of structure — not included (by client or quoted separately)");
    if (!q.flashingRequired)
      items.push("Roof flashing to existing wall — not included (may be required on site)");
  }

  if (q.screeningRequired) {
    if (q.paintStainRequired !== "by-ahdp")
      items.push("Screen paint/stain — not included (to be arranged by client)");
  }

  if (!q.councilApproval)
    items.push("Council approval/permits — not included in this quote");

  if (!q.electricalWorkRequired)
    items.push("Electrical work — no electrical scope included");
  else if (!q.plumbingWorkRequired)
    items.push("Plumbing and gas work — not included");

  if (!q.asbestosRemovalRequired)
    items.push("Asbestos testing/removal — not included (client to confirm site is clear)");

  if (!q.binHireRequired)
    items.push("Rubbish removal/skip bin — not included (material offcuts left on site)");

  items.push("Landscaping, garden restoration, or earthworks beyond direct project footprint");
  items.push("Structural engineering reports (available on request, additional cost)");
  items.push("Any work not explicitly listed in the scope above");

  return items;
}

/**
 * Assumptions that underpin this quote — important for accurate pricing and trust.
 */
export function buildAssumptionsList(q: QuoteData): string[] {
  const items: string[] = [];

  // Site access
  if (q.constructionAccess === "easy" || q.siteAccess === "easy") {
    items.push("Site access is clear and suitable for standard vehicle and equipment access");
  } else if (q.constructionAccess === "moderate" || q.siteAccess === "moderate") {
    items.push("Moderate site access — some manual handling of materials may be required");
  } else if (q.constructionAccess === "difficult" || q.siteAccess === "difficult") {
    items.push("Difficult access has been accounted for in this quote — further site-specific constraints may require review");
  }

  // Ground conditions
  if (q.groundConditions === "level") {
    items.push("Ground is assumed level and suitable for standard footing installation");
  } else if (q.groundConditions === "sloped") {
    items.push("Sloped ground has been accounted for — extent of slope to be confirmed on site");
  } else if (q.groundConditions === "retaining-wall") {
    items.push("Retaining wall scope assumed as discussed — engineering may be required");
  }

  // Soil/footing
  if (!q.concreteFootingsRequired) {
    items.push("Standard post installation assumed — no concrete footings unless site conditions require them");
  } else {
    items.push("Concrete footings required and included — footing depth to engineer's specification");
  }

  // Power/water
  if (q.powerWaterAvailable) {
    items.push("Power and water available on site during construction");
  } else {
    items.push("Power and/or water may not be available — portable equipment will be used if required");
  }

  items.push("Material pricing based on current supplier rates — subject to availability at time of order");
  items.push("Existing structures, posts, or subframe are in sound condition unless demolition is included");

  if (q.verandahRequired) {
    items.push("Existing fascia/wall attachment point is structurally sound and accessible");
    if (q.roofPitch > 0) {
      items.push(`Roof pitch of ${q.roofPitch}° assumed as specified — pitch adjustment may affect final cost`);
    }
  }

  return items;
}
