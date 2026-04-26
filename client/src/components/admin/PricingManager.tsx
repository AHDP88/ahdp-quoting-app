import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Save, PlusIcon, TrashIcon, EditIcon, Banknote } from "lucide-react";
import {
  MaterialPrice,
  AddonPrice,
  loadPricingData,
  savePricingData,
  resetPricingToDefaults,
  defaultPricingData,
} from "@/lib/pricingConfig";

export default function PricingManager() {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<MaterialPrice[]>(defaultPricingData.materials);
  const [addons, setAddons] = useState<AddonPrice[]>(defaultPricingData.addons);
  const [currentMaterial, setCurrentMaterial] = useState<MaterialPrice | null>(null);
  const [currentAddon, setCurrentAddon] = useState<AddonPrice | null>(null);
  const [isEditingMaterial, setIsEditingMaterial] = useState(false);
  const [isEditingAddon, setIsEditingAddon] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Load pricing data from centralized pricingConfig on mount
  useEffect(() => {
    const pricingData = loadPricingData();
    setMaterials(pricingData.materials);
    setAddons(pricingData.addons);
  }, []);
  
  // Save changes to centralized pricing source
  const saveChanges = () => {
    savePricingData({
      version: "1.0",
      lastUpdated: new Date().toISOString(),
      materials,
      addons,
    });
    
    toast({
      title: "Pricing Updated",
      description: "All pricing changes have been saved successfully.",
    });
    
    setIsDirty(false);
  };
  
  // Reset to default data
  const resetPricing = () => {
    resetPricingToDefaults();
    setMaterials(defaultPricingData.materials);
    setAddons(defaultPricingData.addons);
    
    toast({
      title: "Pricing Reset",
      description: "All pricing has been reset to default values.",
    });
    
    setIsDirty(false);
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };
  
  // Handle material edit
  const handleEditMaterial = (material: MaterialPrice) => {
    setCurrentMaterial({...material});
    setIsEditingMaterial(true);
  };
  
  // Handle addon edit
  const handleEditAddon = (addon: AddonPrice) => {
    setCurrentAddon({...addon});
    setIsEditingAddon(true);
  };
  
  // Handle material toggle
  const handleToggleMaterial = (id: string) => {
    setMaterials(prevMaterials => 
      prevMaterials.map(material => 
        material.id === id 
          ? { ...material, isActive: !material.isActive } 
          : material
      )
    );
    setIsDirty(true);
  };
  
  // Handle addon toggle
  const handleToggleAddon = (id: string) => {
    setAddons(prevAddons => 
      prevAddons.map(addon => 
        addon.id === id 
          ? { ...addon, isActive: !addon.isActive } 
          : addon
      )
    );
    setIsDirty(true);
  };
  
  // Save material changes
  const saveMaterialChanges = () => {
    if (!currentMaterial) return;
    
    if (materials.some(m => m.id === currentMaterial.id)) {
      // Update existing material
      setMaterials(prevMaterials => 
        prevMaterials.map(material => 
          material.id === currentMaterial.id 
            ? currentMaterial 
            : material
        )
      );
    } else {
      // Add new material
      setMaterials(prevMaterials => [...prevMaterials, currentMaterial]);
    }
    
    setIsEditingMaterial(false);
    setCurrentMaterial(null);
    setIsDirty(true);
    
    toast({
      title: "Material Updated",
      description: "Material pricing has been updated.",
    });
  };
  
  // Save addon changes
  const saveAddonChanges = () => {
    if (!currentAddon) return;
    
    if (addons.some(a => a.id === currentAddon.id)) {
      // Update existing addon
      setAddons(prevAddons => 
        prevAddons.map(addon => 
          addon.id === currentAddon.id 
            ? currentAddon 
            : addon
        )
      );
    } else {
      // Add new addon
      setAddons(prevAddons => [...prevAddons, currentAddon]);
    }
    
    setIsEditingAddon(false);
    setCurrentAddon(null);
    setIsDirty(true);
    
    toast({
      title: "Addon Updated",
      description: "Addon pricing has been updated.",
    });
  };
  
  // Delete material
  const deleteMaterial = (id: string) => {
    setMaterials(prevMaterials => prevMaterials.filter(material => material.id !== id));
    setIsDirty(true);
    
    toast({
      title: "Material Deleted",
      description: "Material has been removed from the system.",
      variant: "destructive",
    });
  };
  
  // Delete addon
  const deleteAddon = (id: string) => {
    setAddons(prevAddons => prevAddons.filter(addon => addon.id !== id));
    setIsDirty(true);
    
    toast({
      title: "Addon Deleted",
      description: "Addon has been removed from the system.",
      variant: "destructive",
    });
  };
  
  // Generate a unique ID
  const generateId = (base: string) => {
    return `${base}-${Math.random().toString(36).substring(2, 9)}`;
  };
  
  // Add new material
  const addNewMaterial = () => {
    const newMaterial: MaterialPrice = {
      id: generateId('material'),
      name: 'New Material',
      price: 0,
      description: 'Material description',
      isActive: true
    };
    
    setCurrentMaterial(newMaterial);
    setIsEditingMaterial(true);
  };
  
  // Add new addon
  const addNewAddon = () => {
    const newAddon: AddonPrice = {
      id: generateId('addon'),
      name: 'New Addon',
      price: 0,
      category: 'Other',
      description: 'Addon description',
      isActive: true
    };
    
    setCurrentAddon(newAddon);
    setIsEditingAddon(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#005b4f]">Pricing Manager</h2>
          <p className="text-muted-foreground">
            Manage material and add-on pricing for quotes
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="default"
            onClick={saveChanges}
            disabled={!isDirty}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-1"
              >
                <Banknote className="h-4 w-4" />
                Reset Pricing
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset All Pricing?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all pricing to default values.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetPricing}>
                  Reset All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {/* Materials Pricing */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle>Base Materials</CardTitle>
            <CardDescription>
              Pricing for basic decking and structure materials (per m²)
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={addNewMaterial}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Material
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Material</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Price (per m²)</TableHead>
                <TableHead className="w-[80px] text-center">Active</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>{material.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(material.price)}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={material.isActive}
                      onCheckedChange={() => handleToggleMaterial(material.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditMaterial(material)}>
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <TrashIcon className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Material</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {material.name}?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMaterial(material.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Addons Pricing */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle>Add-ons & Extras</CardTitle>
            <CardDescription>
              Pricing for additional features and components
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={addNewAddon}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Option
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Add-on</TableHead>
                <TableHead className="w-[130px]">Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="w-[80px] text-center">Active</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addons.map((addon) => (
                <TableRow key={addon.id}>
                  <TableCell className="font-medium">{addon.name}</TableCell>
                  <TableCell>{addon.category}</TableCell>
                  <TableCell>{addon.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(addon.price)}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={addon.isActive}
                      onCheckedChange={() => handleToggleAddon(addon.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditAddon(addon)}>
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <TrashIcon className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Add-on</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {addon.name}?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteAddon(addon.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t pt-4">
          {isDirty && (
            <p className="text-sm text-amber-600">
              You have unsaved changes. Click "Save Changes" to persist them.
            </p>
          )}
        </CardFooter>
      </Card>
      
      {/* Material Edit Dialog */}
      <Dialog open={isEditingMaterial} onOpenChange={(open) => !open && setIsEditingMaterial(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentMaterial?.id.startsWith('material-') ? 'Add New Material' : 'Edit Material'}
            </DialogTitle>
            <DialogDescription>
              Update pricing and details for this material option.
            </DialogDescription>
          </DialogHeader>
          
          {currentMaterial && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="material-name">Material Name</Label>
                <Input
                  id="material-name"
                  value={currentMaterial.name}
                  onChange={(e) => setCurrentMaterial({...currentMaterial, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="material-price">Price per m²</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    id="material-price"
                    type="number"
                    className="pl-7"
                    value={currentMaterial.price}
                    onChange={(e) => setCurrentMaterial({
                      ...currentMaterial, 
                      price: parseFloat(e.target.value) || 0
                    })}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="material-description">Description</Label>
                <Input
                  id="material-description"
                  value={currentMaterial.description}
                  onChange={(e) => setCurrentMaterial({...currentMaterial, description: e.target.value})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="material-active"
                  checked={currentMaterial.isActive}
                  onCheckedChange={(checked) => setCurrentMaterial({...currentMaterial, isActive: checked})}
                />
                <Label htmlFor="material-active">Active</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingMaterial(false)}>Cancel</Button>
            <Button onClick={saveMaterialChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Addon Edit Dialog */}
      <Dialog open={isEditingAddon} onOpenChange={(open) => !open && setIsEditingAddon(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentAddon?.id.startsWith('addon-') ? 'Add New Add-on' : 'Edit Add-on'}
            </DialogTitle>
            <DialogDescription>
              Update pricing and details for this add-on option.
            </DialogDescription>
          </DialogHeader>
          
          {currentAddon && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addon-name">Add-on Name</Label>
                <Input
                  id="addon-name"
                  value={currentAddon.name}
                  onChange={(e) => setCurrentAddon({...currentAddon, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addon-category">Category</Label>
                <Input
                  id="addon-category"
                  value={currentAddon.category}
                  onChange={(e) => setCurrentAddon({...currentAddon, category: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addon-price">Price</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    id="addon-price"
                    type="number"
                    className="pl-7"
                    value={currentAddon.price}
                    onChange={(e) => setCurrentAddon({
                      ...currentAddon, 
                      price: parseFloat(e.target.value) || 0
                    })}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addon-description">Description</Label>
                <Input
                  id="addon-description"
                  value={currentAddon.description}
                  onChange={(e) => setCurrentAddon({...currentAddon, description: e.target.value})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="addon-active"
                  checked={currentAddon.isActive}
                  onCheckedChange={(checked) => setCurrentAddon({...currentAddon, isActive: checked})}
                />
                <Label htmlFor="addon-active">Active</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingAddon(false)}>Cancel</Button>
            <Button onClick={saveAddonChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}