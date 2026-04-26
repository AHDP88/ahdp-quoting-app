import { useState, useRef, useCallback, type ComponentType } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, RefreshCw, Upload, CheckCircle2, XCircle, AlertTriangle, Settings as SettingsIcon, Package, Clock, ChevronDown, ChevronUp, Pencil, Trash2, Plus, Database, FileSpreadsheet, History, ArrowRight } from "lucide-react";
import type { PricingItem, SupplierImport, PricingChangelogEntry } from "@shared/schema";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (cents: number | null | undefined) =>
  cents == null ? "—" : `$${(cents / 100).toFixed(2)}`;
const fmtD = (s: string | Date | null | undefined) =>
  s ? new Date(s).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtDT = (s: string | Date | null | undefined) =>
  s ? new Date(s).toLocaleString("en-AU", { day: "2-digit", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";

const CATEGORY_COLOR: Record<string, string> = {
  Decking: "bg-amber-100 text-amber-800",
  Verandah: "bg-blue-100 text-blue-800",
  Screening: "bg-purple-100 text-purple-800",
  Electrical: "bg-yellow-100 text-yellow-800",
  Extras: "bg-gray-100 text-gray-700",
};

const STATUS_COLOR: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  applied:   "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
};

// ─── Tab navigation ───────────────────────────────────────────────────────────
type Tab = "catalog" | "import" | "changelog";

const tabs: { id: Tab; label: string; Icon: ComponentType<{ className?: string }> }[] = [
  { id: "catalog",   label: "Price Catalog", Icon: Package },
  { id: "import",    label: "Import",        Icon: FileSpreadsheet },
  { id: "changelog", label: "Changelog",     Icon: History },
];

// ─── Inline edit row ──────────────────────────────────────────────────────────
function PricingRow({ item, onSaved }: { item: PricingItem; onSaved: () => void }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [sellRate, setSellRate] = useState(String((item.sellRate / 100).toFixed(2)));
  const [unitCost, setUnitCost] = useState(item.unitCost != null ? String((item.unitCost / 100).toFixed(2)) : "");
  const [notes, setNotes] = useState(item.notes ?? "");
  const [delConfirm, setDelConfirm] = useState(false);

  const saveMut = useMutation({
    mutationFn: () => apiRequest("PATCH", `/api/settings/pricing/${item.id}`, { sellRate: parseFloat(sellRate), unitCost: unitCost ? parseFloat(unitCost) : null, notes }),
    onSuccess: () => { toast({ title: "Saved", description: `${item.name} updated.` }); qc.invalidateQueries({ queryKey: ["/api/settings/pricing"] }); qc.invalidateQueries({ queryKey: ["/api/settings/pricing/changelog"] }); setEditing(false); onSaved(); },
    onError: () => toast({ title: "Error", description: "Failed to save changes.", variant: "destructive" }),
  });

  const delMut = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/settings/pricing/${item.id}`),
    onSuccess: () => { toast({ title: "Deleted", description: `${item.name} removed.` }); qc.invalidateQueries({ queryKey: ["/api/settings/pricing"] }); qc.invalidateQueries({ queryKey: ["/api/settings/pricing/meta"] }); },
    onError: () => toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" }),
  });

  const catClass = CATEGORY_COLOR[item.category] ?? "bg-gray-100 text-gray-700";

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
      <td className="py-2.5 px-3">
        <div className="font-medium text-gray-900 text-sm">{item.name}</div>
        {item.itemCode && <div className="text-xs text-gray-400 font-mono mt-0.5">{item.itemCode}</div>}
      </td>
      <td className="py-2.5 px-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${catClass}`}>{item.category}</span>
        {item.displayGroup && <div className="text-xs text-gray-400 mt-0.5">{item.displayGroup}</div>}
      </td>
      <td className="py-2.5 px-3 text-sm text-gray-600">{item.supplier ?? "—"}</td>
      <td className="py-2.5 px-3 text-sm text-gray-500">{item.unit ?? "—"}</td>
      <td className="py-2.5 px-3">
        {editing ? (
          <Input value={sellRate} onChange={e => setSellRate(e.target.value)} className="w-24 h-7 text-sm" type="number" step="0.01" min="0" />
        ) : (
          <span className="text-sm font-semibold text-gray-800">{fmt(item.sellRate)}</span>
        )}
      </td>
      <td className="py-2.5 px-3">
        {editing ? (
          <Input value={unitCost} onChange={e => setUnitCost(e.target.value)} className="w-24 h-7 text-sm" type="number" step="0.01" min="0" placeholder="—" />
        ) : (
          <span className="text-sm text-gray-500">{fmt(item.unitCost)}</span>
        )}
      </td>
      <td className="py-2.5 px-3">
        {editing ? (
          <Input value={notes} onChange={e => setNotes(e.target.value)} className="w-40 h-7 text-sm" placeholder="Notes…" />
        ) : (
          <span className="text-xs text-gray-400">{item.notes ?? "—"}</span>
        )}
      </td>
      <td className="py-2.5 px-3 text-xs text-gray-400">{fmtD(item.lastUpdatedAt)}</td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <Button size="sm" className="h-7 px-2 text-xs bg-[#1f3d2b] hover:bg-[#2d5a3d] text-white" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
                {saveMut.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => { setEditing(false); setSellRate(String((item.sellRate/100).toFixed(2))); setUnitCost(item.unitCost != null ? String((item.unitCost/100).toFixed(2)) : ""); setNotes(item.notes ?? ""); }}>
                Cancel
              </Button>
            </>
          ) : delConfirm ? (
            <>
              <span className="text-xs text-red-600 mr-1">Delete?</span>
              <Button size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={() => delMut.mutate()} disabled={delMut.isPending}>
                {delMut.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Yes"}
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setDelConfirm(false)}>No</Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditing(true)} title="Edit">
                <Pencil className="h-3.5 w-3.5 text-gray-500" />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setDelConfirm(true)} title="Delete">
                <Trash2 className="h-3.5 w-3.5 text-red-400" />
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Add item modal ────────────────────────────────────────────────────────────
function AddItemForm({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", category: "Decking", subcategory: "Material", displayGroup: "", supplier: "AHDP", unit: "m²", sellRate: "", unitCost: "", notes: "", itemCode: "" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const mut = useMutation({
    mutationFn: () => apiRequest("POST", "/api/settings/pricing", { ...form, sellRate: parseFloat(form.sellRate), unitCost: form.unitCost ? parseFloat(form.unitCost) : undefined }),
    onSuccess: () => { toast({ title: "Created", description: `${form.name} added to catalog.` }); qc.invalidateQueries({ queryKey: ["/api/settings/pricing"] }); qc.invalidateQueries({ queryKey: ["/api/settings/pricing/meta"] }); onAdded(); onClose(); },
    onError: () => toast({ title: "Error", description: "Failed to create item.", variant: "destructive" }),
  });

  const field = (label: string, key: string, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <Input value={(form as any)[key]} onChange={e => set(key, e.target.value)} type={type} placeholder={placeholder} className="h-8 text-sm" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2"><Plus className="h-4 w-4 text-[#1f3d2b]" /> Add Pricing Item</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">{field("Item Name *", "name", "text", "e.g. Merbau 90mm decking")}</div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
            <select value={form.category} onChange={e => set("category", e.target.value)} className="w-full h-8 text-sm border rounded-md px-2">
              {["Decking","Verandah","Screening","Electrical","Extras"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Subcategory</label>
            <select value={form.subcategory} onChange={e => set("subcategory", e.target.value)} className="w-full h-8 text-sm border rounded-md px-2">
              {["Material","Labour","Extra","Electrical"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {field("Display Group", "displayGroup", "text", "e.g. Decking Boards")}
          {field("Supplier", "supplier", "text", "e.g. AHDP")}
          {field("Sell Rate ($/unit) *", "sellRate", "number", "0.00")}
          {field("Unit Cost ($/unit)", "unitCost", "number", "0.00")}
          {field("Unit", "unit", "text", "m² / LM / each")}
          {field("Item Code", "itemCode", "text", "deck.mat.merbau")}
          <div className="col-span-2">{field("Notes", "notes", "text", "Optional notes…")}</div>
        </div>
        <div className="flex gap-2 mt-5 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#1f3d2b] hover:bg-[#2d5a3d] text-white" onClick={() => mut.mutate()} disabled={mut.isPending || !form.name || !form.sellRate}>
            {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            Add Item
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── CATALOG TAB ──────────────────────────────────────────────────────────────
function CatalogTab() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout>>();

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const handleSearch = (v: string) => {
    setSearch(v);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setDebouncedSearch(v), 350);
  };

  const metaQ = useQuery<{ categories: string[]; suppliers: string[]; count: number }>({
    queryKey: ["/api/settings/pricing/meta"],
  });

  const params = new URLSearchParams();
  if (debouncedSearch) params.set("search", debouncedSearch);
  if (catFilter) params.set("category", catFilter);
  if (supplierFilter) params.set("supplier", supplierFilter);

  const itemsQ = useQuery<PricingItem[]>({
    queryKey: ["/api/settings/pricing", debouncedSearch, catFilter, supplierFilter],
    queryFn: () => fetch(`/api/settings/pricing?${params.toString()}`).then(r => r.json()),
  });

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const r = await fetch("/api/settings/pricing/seed", { method: "POST" });
      const d = await r.json();
      toast({ title: "Seed complete", description: `${d.inserted} items added, ${d.skipped} already existed.` });
      qc.invalidateQueries({ queryKey: ["/api/settings/pricing"] });
      qc.invalidateQueries({ queryKey: ["/api/settings/pricing/meta"] });
    } catch {
      toast({ title: "Seed failed", variant: "destructive" });
    } finally { setSeeding(false); }
  };

  const meta = metaQ.data;
  const items = itemsQ.data ?? [];

  // Group by category for display
  const grouped = items.reduce<Record<string, PricingItem[]>>((acc, i) => {
    acc[i.category] = [...(acc[i.category] ?? []), i];
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Price Catalog</h2>
          <p className="text-sm text-gray-500">
            {meta ? `${meta.count} items across ${meta.categories.length} categories` : "Loading…"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {meta && meta.count === 0 && (
            <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding} className="text-[#1f3d2b] border-[#1f3d2b]">
              {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Database className="h-3.5 w-3.5 mr-1" />}
              Seed from defaults
            </Button>
          )}
          <Button size="sm" className="bg-[#1f3d2b] hover:bg-[#2d5a3d] text-white" onClick={() => setShowAdd(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input className="pl-8 h-8 text-sm" placeholder="Search name, code, group…" value={search} onChange={e => handleSearch(e.target.value)} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="h-8 text-sm border rounded-md px-2 bg-white">
          <option value="">All categories</option>
          {meta?.categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)} className="h-8 text-sm border rounded-md px-2 bg-white">
          <option value="">All suppliers</option>
          {meta?.suppliers.map(s => <option key={s}>{s}</option>)}
        </select>
        {(catFilter || supplierFilter || debouncedSearch) && (
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => { setCatFilter(""); setSupplierFilter(""); setSearch(""); setDebouncedSearch(""); }}>
            <XCircle className="h-3.5 w-3.5 mr-1 text-gray-400" /> Clear
          </Button>
        )}
      </div>

      {/* Empty state — seed prompt */}
      {!itemsQ.isLoading && items.length === 0 && !debouncedSearch && !catFilter && !supplierFilter && meta?.count === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <Database className="h-10 w-10 text-amber-400 mx-auto mb-3" />
          <h3 className="font-semibold text-amber-800 mb-1">Catalog is empty</h3>
          <p className="text-sm text-amber-700 mb-4">Seed it with the 80+ default AHDP rates to get started, or add items manually.</p>
          <Button onClick={handleSeed} disabled={seeding} className="bg-amber-600 hover:bg-amber-700 text-white">
            {seeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
            Seed Default Pricing
          </Button>
        </div>
      )}

      {/* Loading */}
      {itemsQ.isLoading && (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading catalog…
        </div>
      )}

      {/* No results (filtered) */}
      {!itemsQ.isLoading && items.length === 0 && (debouncedSearch || catFilter || supplierFilter) && (
        <div className="text-center py-12 text-gray-400">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No items match your filters.</p>
        </div>
      )}

      {/* Table */}
      {items.length > 0 && (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Name / Code</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Supplier</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Unit</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Sell Rate</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Cost</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Notes</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Updated</th>
                  <th className="py-2.5 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <PricingRow key={item.id} item={item} onSaved={() => qc.invalidateQueries({ queryKey: ["/api/settings/pricing/changelog"] })} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && <AddItemForm onClose={() => setShowAdd(false)} onAdded={() => { qc.invalidateQueries({ queryKey: ["/api/settings/pricing"] }); }} />}
    </div>
  );
}

// ─── IMPORT TAB ────────────────────────────────────────────────────────────────
type ImportStep = "upload" | "mapping" | "preview" | "done";

interface PreviewRow {
  rowIndex: number;
  itemCode: string;
  name: string;
  existingId: number | null;
  existingName: string | null;
  existingRate: number | null;
  newRate: number | null;
  status: "update" | "no-change" | "unmatched";
  rawRow: Record<string, string>;
}

interface UploadResult {
  importId: number;
  headers: string[];
  detectedMapping: Record<string, string>;
  columnMapping: Record<string, string>;
  preview: PreviewRow[];
  stats: { total: number; matched: number; unmatched: number };
}

function ImportTab() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<ImportStep>("upload");
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [supplierName, setSupplierName] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const importsQ = useQuery<SupplierImport[]>({ queryKey: ["/api/settings/imports"] });

  const processFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const arrayBuf = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuf)));
      const resp = await fetch("/api/settings/pricing/import/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentBase64: base64, supplierName }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message ?? "Upload failed");
      }
      const result: UploadResult = await resp.json();
      setUploadResult(result);
      setMapping(result.columnMapping);
      const updateRows = new Set(result.preview.filter(r => r.status === "update").map(r => r.rowIndex));
      setSelectedRows(updateRows);
      setStep("preview");
      qc.invalidateQueries({ queryKey: ["/api/settings/imports"] });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally { setUploading(false); }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [supplierName]);

  const handleApply = async () => {
    if (!uploadResult) return;
    setApplying(true);
    try {
      const resp = await fetch(`/api/settings/pricing/import/${uploadResult.importId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applyRows: [...selectedRows] }),
      });
      const d = await resp.json();
      if (!resp.ok) throw new Error(d.message);
      toast({ title: "Import applied", description: `${d.updated} prices updated.` });
      qc.invalidateQueries({ queryKey: ["/api/settings/pricing"] });
      qc.invalidateQueries({ queryKey: ["/api/settings/imports"] });
      qc.invalidateQueries({ queryKey: ["/api/settings/pricing/changelog"] });
      setStep("done");
    } catch (err: any) {
      toast({ title: "Apply failed", description: err.message, variant: "destructive" });
    } finally { setApplying(false); }
  };

  const handleCancel = async () => {
    if (!uploadResult) return;
    await fetch(`/api/settings/pricing/import/${uploadResult.importId}/cancel`, { method: "POST" });
    qc.invalidateQueries({ queryKey: ["/api/settings/imports"] });
    setStep("upload"); setUploadResult(null); setMapping({});
  };

  const resetUpload = () => { setStep("upload"); setUploadResult(null); setMapping({}); setSelectedRows(new Set()); };

  const updateRows   = uploadResult?.preview.filter(r => r.status === "update")    ?? [];
  const noChangeRows = uploadResult?.preview.filter(r => r.status === "no-change") ?? [];
  const unmatchedRows= uploadResult?.preview.filter(r => r.status === "unmatched") ?? [];

  return (
    <div className="space-y-6">
      {/* Upload area */}
      {(step === "upload") && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Import Pricelist</h2>
            <p className="text-sm text-gray-500">Upload a supplier CSV or Excel file to bulk-update sell rates.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Supplier Name (optional)</label>
            <Input value={supplierName} onChange={e => setSupplierName(e.target.value)} className="max-w-xs h-8 text-sm" placeholder="e.g. Sanctuary Outdoor Living" />
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${dragOver ? "border-[#1f3d2b] bg-green-50" : "border-gray-300 hover:border-[#1f3d2b] hover:bg-gray-50"}`}
          >
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { if (e.target.files?.[0]) processFile(e.target.files[0]); }} />
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-[#1f3d2b]">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm font-medium">Parsing file…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">Drop CSV or Excel file here</p>
                <p className="text-xs text-gray-400">or click to browse — .csv, .xlsx, .xls supported</p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700 space-y-1">
            <p className="font-semibold">How it works</p>
            <p>1. Upload a supplier pricelist (any column order is fine — the app auto-detects Item Code, Name, Price columns).</p>
            <p>2. Review matched and unmatched items before applying.</p>
            <p>3. Apply only the rows you select. All changes are logged in the Changelog.</p>
          </div>
        </div>
      )}

      {/* Preview step */}
      {(step === "preview") && uploadResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Review Changes</h2>
              <p className="text-sm text-gray-500">
                {updateRows.length} prices will update · {noChangeRows.length} no change · {unmatchedRows.length} unmatched
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>Cancel Import</Button>
              <Button size="sm" className="bg-[#1f3d2b] hover:bg-[#2d5a3d] text-white" onClick={handleApply} disabled={applying || selectedRows.size === 0}>
                {applying ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
                Apply {selectedRows.size} update{selectedRows.size !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>

          {/* Summary chips */}
          <div className="flex gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              <CheckCircle2 className="h-3 w-3" /> {updateRows.length} will update
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              {noChangeRows.length} no change
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
              <AlertTriangle className="h-3 w-3" /> {unmatchedRows.length} unmatched
            </span>
          </div>

          {/* Updates table */}
          {updateRows.length > 0 && (
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-green-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-green-800 uppercase tracking-wide">Price Updates ({updateRows.length})</span>
                <div className="flex gap-2">
                  <button className="text-xs text-green-700 hover:underline" onClick={() => setSelectedRows(new Set(updateRows.map(r => r.rowIndex)))}>Select all</button>
                  <span className="text-green-300">|</span>
                  <button className="text-xs text-green-700 hover:underline" onClick={() => setSelectedRows(new Set())}>Deselect all</button>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-2 px-3 text-left w-8"></th>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Matched Item</th>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Current Rate</th>
                    <th className="py-2 px-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide"></th>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">New Rate</th>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {updateRows.map(row => {
                    const sel = selectedRows.has(row.rowIndex);
                    const diff = row.newRate != null && row.existingRate != null ? ((row.newRate - row.existingRate) / row.existingRate * 100) : null;
                    return (
                      <tr key={row.rowIndex} className={`border-b border-gray-100 ${sel ? "bg-green-50/50" : ""}`}>
                        <td className="py-2 px-3">
                          <input type="checkbox" checked={sel} onChange={() => {
                            const n = new Set(selectedRows);
                            if (sel) n.delete(row.rowIndex); else n.add(row.rowIndex);
                            setSelectedRows(n);
                          }} className="h-4 w-4 accent-[#1f3d2b]" />
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-medium text-gray-800 text-sm">{row.existingName ?? row.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{row.itemCode}</div>
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-600">{fmt(row.existingRate)}</td>
                        <td className="py-2 px-3 text-center"><ArrowRight className="h-3.5 w-3.5 text-gray-400 inline" /></td>
                        <td className="py-2 px-3 text-sm font-semibold text-[#1f3d2b]">{fmt(row.newRate)}</td>
                        <td className="py-2 px-3">
                          {diff != null && (
                            <span className={`text-xs font-medium ${diff > 0 ? "text-red-600" : "text-green-600"}`}>
                              {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Unmatched */}
          {unmatchedRows.length > 0 && (
            <details className="rounded-xl border border-amber-200 overflow-hidden">
              <summary className="bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 uppercase tracking-wide cursor-pointer list-none flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" /> {unmatchedRows.length} unmatched rows (not in catalog)
              </summary>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-gray-50"><th className="py-2 px-3 text-left text-xs font-semibold text-gray-500">Code / Name</th><th className="py-2 px-3 text-left text-xs font-semibold text-gray-500">Rate in file</th></tr></thead>
                  <tbody>
                    {unmatchedRows.map(r => (
                      <tr key={r.rowIndex} className="border-b border-gray-100">
                        <td className="py-2 px-3"><div className="text-sm text-gray-700">{r.name || r.itemCode}</div><div className="text-xs text-gray-400 font-mono">{r.itemCode}</div></td>
                        <td className="py-2 px-3 text-sm text-gray-500">{fmt(r.newRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </div>
      )}

      {/* Done */}
      {step === "done" && (
        <div className="text-center py-16 space-y-3">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-800">Import Applied</h3>
          <p className="text-sm text-gray-500">All selected prices have been updated and logged.</p>
          <Button className="mt-4 bg-[#1f3d2b] hover:bg-[#2d5a3d] text-white" onClick={resetUpload}>
            <Upload className="h-4 w-4 mr-2" /> Import another file
          </Button>
        </div>
      )}

      {/* Import History */}
      {importsQ.data && importsQ.data.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Import History</h3>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">File</th>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Supplier</th>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Rows</th>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Updated</th>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {importsQ.data.map(imp => (
                  <tr key={imp.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 text-sm font-medium text-gray-800">{imp.filename}</td>
                    <td className="py-2 px-3 text-sm text-gray-500">{imp.supplierName ?? "—"}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[imp.status ?? "pending"] ?? ""}`}>{imp.status}</span>
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-500">{imp.totalRows ?? 0}</td>
                    <td className="py-2 px-3 text-sm text-gray-500">{imp.updatedRows ?? 0}</td>
                    <td className="py-2 px-3 text-sm text-gray-400">{fmtD(imp.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHANGELOG TAB ────────────────────────────────────────────────────────────
function ChangelogTab() {
  const changelogQ = useQuery<PricingChangelogEntry[]>({
    queryKey: ["/api/settings/pricing/changelog"],
  });

  const entries = changelogQ.data ?? [];

  const sourceColor = (s: string | null) =>
    s === "import" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700";

  const fieldLabel: Record<string, string> = {
    sellRate: "Sell Rate",
    unitCost: "Unit Cost",
    wasteFactor: "Waste Factor",
    name: "Name",
    notes: "Notes",
    created: "Created",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Price Changelog</h2>
          <p className="text-sm text-gray-500">{entries.length} records · most recent first</p>
        </div>
      </div>

      {changelogQ.isLoading && (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading changelog…
        </div>
      )}

      {!changelogQ.isLoading && entries.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <History className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No price changes recorded yet.</p>
          <p className="text-xs mt-1">Edit items in the Price Catalog or run an import to log changes.</p>
        </div>
      )}

      {entries.length > 0 && (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
          <div className="space-y-0">
            {entries.map((entry, i) => {
              const isFirst = i === 0 || fmtD(entries[i-1].changedAt) !== fmtD(entry.changedAt);
              return (
                <div key={entry.id}>
                  {isFirst && (
                    <div className="relative pl-10 py-2">
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 bg-[#1f3d2b] rounded-full border-2 border-white shadow-sm" />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{fmtD(entry.changedAt)}</span>
                    </div>
                  )}
                  <div className="relative pl-10 pb-3 group">
                    <div className="absolute left-3 top-2 h-2 w-2 bg-gray-300 rounded-full group-hover:bg-[#8b5a2b] transition-colors" />
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <span className="font-medium text-gray-800 text-sm">{entry.itemName ?? entry.itemCode}</span>
                          {entry.itemCode && entry.itemName && (
                            <span className="text-xs text-gray-400 font-mono ml-2">{entry.itemCode}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sourceColor(entry.source)}`}>{entry.source}</span>
                          <span className="text-xs text-gray-400">{fmtDT(entry.changedAt)}</span>
                        </div>
                      </div>
                      {entry.fieldChanged !== "created" ? (
                        <div className="mt-1.5 flex items-center gap-2 text-sm flex-wrap">
                          <span className="text-gray-500">{fieldLabel[entry.fieldChanged ?? ""] ?? entry.fieldChanged}:</span>
                          <span className="line-through text-red-400 font-mono text-xs">
                            {entry.fieldChanged?.includes("Rate") || entry.fieldChanged?.includes("Cost") ? fmt(Number(entry.oldValue)) : entry.oldValue ?? "—"}
                          </span>
                          <ArrowRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          <span className="text-green-700 font-semibold font-mono text-xs">
                            {entry.fieldChanged?.includes("Rate") || entry.fieldChanged?.includes("Cost") ? fmt(Number(entry.newValue)) : entry.newValue ?? "—"}
                          </span>
                          {entry.changedBy && <span className="text-xs text-gray-400 ml-auto">by {entry.changedBy}</span>}
                        </div>
                      ) : (
                        <div className="mt-1 text-xs text-green-600 font-medium">Item created</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Settings() {
  const [tab, setTab] = useState<Tab>("catalog");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-9 w-9 bg-[#1f3d2b] rounded-lg flex items-center justify-center">
            <SettingsIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pricing Settings</h1>
            <p className="text-sm text-gray-500">Manage the AHDP pricing catalog, import supplier pricelists, and review change history.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-1 -mb-px">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === id
                  ? "border-[#1f3d2b] text-[#1f3d2b]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {tab === "catalog"   && <CatalogTab />}
        {tab === "import"    && <ImportTab />}
        {tab === "changelog" && <ChangelogTab />}
      </div>
    </div>
  );
}
