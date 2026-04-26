import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  PlusCircle, 
  Settings, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Search, 
  Download,
  UserPlus,
  Users,
  Package,
  ListFilter,
  Clipboard,
  ExternalLink,
  DownloadCloud,
  FileDown,
  ChevronLeft
} from "lucide-react";

// Material type for editing/creating materials
interface Material {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

// Configuration interface for app settings
interface AppConfig {
  id: string;
  key: string;
  value: string;
  category: string;
  description: string;
}

// Admin Dashboard main component
export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Quote interface for type safety
  interface Quote {
    id: number;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    projectType: string;
    length: string;
    width: string;
    height: string;
    joistSize: string | null;
    bearerSize: string | null;
    boardSize: string | null;
    customBoardSize: string | null;
    deckingType: string | null;
    boardType: string | null;
    boardDirection: string | null;
    deckingRequired: boolean | null;
    verandahRequired: boolean | null;
    structureType: string | null;
    materialType: string | null;
    structureStyle: string | null;
    roofType: string | null;
    extrasRequired: boolean | null;
    binHireRequired: boolean | null;
    rubbishRemoval: boolean | null;
    pavingCutRequired: boolean | null;
    landscapingRetainingRequired: boolean | null;
    electricalWorkRequired: boolean | null;
    numCeilingFans: string | null;
    numHeaters: string | null;
    numLights: string | null;
    numPowerPoints: string | null;
    electricalItemNotes: string | null;
    constructionAccess: string | null;
    groundConditions: string | null;
    extraTradesRequired: string[];
    extraTradesOther: string | null;
    notes: string | null;
    constructionNotes: string | null;
    siteNotes: string | null;
    miscellaneousNotes: string | null;
    createdAt: Date;
    [key: string]: any; // For any other properties
  }

  // Fetch quotes data
  const { data: quotes, isLoading: quotesLoading } = useQuery<Quote[]>({
    queryKey: ['/api/quotes'],
    retry: 1,
  });

  // Fetch materials data
  const { data: materials, isLoading: materialsLoading } = useQuery<Material[]>({
    queryKey: ['/api/materials'],
    retry: 1,
  });

  // Fetch app configuration data
  const { data: configs, isLoading: configsLoading } = useQuery<AppConfig[]>({
    queryKey: ['/api/configs'],
    retry: 1,
  });

  // Handle logout
  const handleLogout = () => {
    apiRequest("POST", "/api/logout", {})
      .then(() => {
        toast({
          title: "Logout successful",
          description: "You have been logged out successfully",
        });
        window.location.href = "/admin/login";
      })
      .catch(() => {
        toast({
          title: "Logout failed",
          description: "Failed to log out. Please try again.",
          variant: "destructive",
        });
      });
  };

  // Filter quotes based on search
  const filteredQuotes = quotes ? quotes.filter((quote: Quote) => {
    const searchString = searchQuery.toLowerCase();
    return (
      quote.clientName?.toLowerCase().includes(searchString) ||
      quote.clientEmail?.toLowerCase().includes(searchString) ||
      quote.clientPhone?.toLowerCase().includes(searchString) ||
      quote.projectType?.toLowerCase().includes(searchString)
    );
  }) : [];

  // Export quotes to CSV
  const exportQuotes = () => {
    setIsExporting(true);
    
    try {
      if (!quotes || quotes.length === 0) {
        toast({
          title: "Export failed",
          description: "No quotes available to export",
          variant: "destructive",
        });
        setIsExporting(false);
        return;
      }
      
      // Get headers from first quote
      const headers = Object.keys(quotes[0]).filter(key => 
        // Filter out complex objects or unnecessary fields
        typeof quotes[0][key] !== 'object' && 
        key !== 'id' && 
        key !== 'createdAt'
      );
      
      // Create CSV content
      let csvContent = headers.join(',') + '\n';
      
      quotes.forEach((quote: Quote) => {
        const row = headers.map(header => {
          const value = quote[header as keyof Quote];
          // Handle special types and escape values with commas
          if (value === null || value === undefined) {
            return '';
          } else if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          } else {
            return value;
          }
        });
        csvContent += row.join(',') + '\n';
      });
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `quotes_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: "Quotes exported to CSV successfully",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export quotes. Please try again.",
        variant: "destructive",
      });
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // View a specific quote
  const viewQuote = (id: number) => {
    setSelectedQuote(id);
  };

  // Detailed view of a single quote
  const QuoteDetail = ({ quoteId }: { quoteId: number }) => {
    const { data: quote, isLoading } = useQuery<Quote>({
      queryKey: ['/api/quotes', quoteId],
      retry: 1,
    });
    
    if (isLoading) {
      return <div className="p-8 text-center">Loading quote details...</div>;
    }
    
    if (!quote) {
      return <div className="p-8 text-center">Quote not found</div>;
    }

    // Format and display quote details
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#005b4f]">Quote #{quoteId}</h2>
            <p className="text-muted-foreground">
              Created on {new Date(quote.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(`/quotes/${quoteId}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Quote
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{quote.clientName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{quote.clientEmail || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{quote.clientPhone || 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Project Type:</span>
                  <span>{quote.projectType || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dimensions:</span>
                  <span>
                    {quote.length || '0'}m × {quote.width || '0'}m × {quote.height || '0'}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Board Type:</span>
                  <span>{quote.boardType ? quote.boardType.split('-')[1] : 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="construction">
            <AccordionTrigger>Construction Details</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 p-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Joist Size:</span>
                    <span className="ml-2">{quote.joistSize || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Bearer Size:</span>
                    <span className="ml-2">{quote.bearerSize || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Board Size:</span>
                    <span className="ml-2">{quote.boardSize || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Decking Type:</span>
                    <span className="ml-2">{quote.deckingType || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Access:</span>
                    <span className="ml-2">{quote.constructionAccess || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Ground Conditions:</span>
                    <span className="ml-2">{quote.groundConditions || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {quote.verandahRequired && (
            <AccordionItem value="verandah">
              <AccordionTrigger>Verandah/Pergola Details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 p-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Structure Type:</span>
                      <span className="ml-2">{quote.structureType || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Material Type:</span>
                      <span className="ml-2">{quote.materialType || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Roof Type:</span>
                      <span className="ml-2">{quote.roofType || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Style:</span>
                      <span className="ml-2">{quote.structureStyle || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {quote.extrasRequired && (
            <AccordionItem value="extras">
              <AccordionTrigger>Extras</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 p-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Bin Hire:</span>
                      <span className="ml-2">{quote.binHireRequired ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Rubbish Removal:</span>
                      <span className="ml-2">{quote.rubbishRemoval ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Paving Cut:</span>
                      <span className="ml-2">{quote.pavingCutRequired ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Landscaping/Retaining:</span>
                      <span className="ml-2">{quote.landscapingRetainingRequired ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  
                  {quote.electricalWorkRequired && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Electrical Items:</h4>
                      <ul className="list-disc list-inside text-sm">
                        <li>Ceiling Fans: {quote.numCeilingFans || '0'}</li>
                        <li>Heaters: {quote.numHeaters || '0'}</li>
                        <li>Lights: {quote.numLights || '0'}</li>
                        <li>Power Points: {quote.numPowerPoints || '0'}</li>
                      </ul>
                      {quote.electricalItemNotes && (
                        <div className="mt-2">
                          <span className="font-medium">Notes:</span>
                          <p className="text-sm mt-1">{quote.electricalItemNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {quote.extraTradesRequired && quote.extraTradesRequired.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Additional Trades Required:</h4>
                      <ul className="list-disc list-inside text-sm">
                        {quote.extraTradesRequired.map((trade: string, index: number) => (
                          <li key={index}>{trade}</li>
                        ))}
                        {quote.extraTradesOther && <li>{quote.extraTradesOther}</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          
          <AccordionItem value="notes">
            <AccordionTrigger>Notes</AccordionTrigger>
            <AccordionContent>
              <div className="p-2">
                <p className="whitespace-pre-wrap">{quote.notes || 'No notes provided.'}</p>
                {quote.constructionNotes && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-1">Construction Notes:</h4>
                    <p className="whitespace-pre-wrap">{quote.constructionNotes}</p>
                  </div>
                )}
                {quote.siteNotes && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-1">Site Notes:</h4>
                    <p className="whitespace-pre-wrap">{quote.siteNotes}</p>
                  </div>
                )}
                {quote.miscellaneousNotes && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-1">Miscellaneous Notes:</h4>
                    <p className="whitespace-pre-wrap">{quote.miscellaneousNotes}</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

  // Materials management component
  const MaterialsManager = () => {
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
    const [isAddingMaterial, setIsAddingMaterial] = useState(false);
    const [newMaterial, setNewMaterial] = useState<Material>({
      id: '',
      name: '',
      price: 0,
      description: '',
      category: 'decking'
    });
    
    // Material mutation for creating/updating
    const materialMutation = useMutation({
      mutationFn: async (material: Material) => {
        const method = material.id ? "PUT" : "POST";
        const endpoint = material.id ? `/api/materials/${material.id}` : "/api/materials";
        return await apiRequest(method, endpoint, material);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
        toast({
          title: `Material ${editingMaterial ? 'updated' : 'added'} successfully`,
          description: `The material has been ${editingMaterial ? 'updated' : 'added'} to the system.`,
        });
        setEditingMaterial(null);
        setIsAddingMaterial(false);
      },
      onError: () => {
        toast({
          title: `Failed to ${editingMaterial ? 'update' : 'add'} material`,
          description: "There was an error processing your request.",
          variant: "destructive",
        });
      }
    });
    
    // Material deletion mutation
    const deleteMaterialMutation = useMutation({
      mutationFn: async (id: string) => {
        return await apiRequest("DELETE", `/api/materials/${id}`, {});
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
        toast({
          title: "Material deleted successfully",
          description: "The material has been removed from the system.",
        });
      },
      onError: () => {
        toast({
          title: "Failed to delete material",
          description: "There was an error processing your request.",
          variant: "destructive",
        });
      }
    });
    
    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingMaterial) {
        materialMutation.mutate({
          ...editingMaterial,
          price: Number(editingMaterial.price)
        });
      } else if (isAddingMaterial) {
        materialMutation.mutate({
          ...newMaterial,
          price: Number(newMaterial.price)
        });
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#005b4f]">Materials Management</h2>
          <Button onClick={() => setIsAddingMaterial(true)} className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Material
          </Button>
        </div>
        
        {materialsLoading ? (
          <div className="text-center p-8">Loading materials...</div>
        ) : (
          <Table>
            <TableCaption>List of available materials for quotes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials && materials.length > 0 ? (
                materials.map((material: Material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>{material.category}</TableCell>
                    <TableCell className="text-right">${material.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setEditingMaterial(material)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => deleteMaterialMutation.mutate(material.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No materials found. Add some to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        
        {/* Material Edit Dialog */}
        <Dialog open={!!editingMaterial} onOpenChange={(open) => !open && setEditingMaterial(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Material</DialogTitle>
              <DialogDescription>
                Update the details for this material.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    value={editingMaterial?.name || ''}
                    onChange={(e) => setEditingMaterial(prev => prev ? {...prev, name: e.target.value} : null)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">Price</label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingMaterial?.price || 0}
                    onChange={(e) => setEditingMaterial(prev => prev ? {...prev, price: parseFloat(e.target.value)} : null)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editingMaterial?.category || ''}
                    onChange={(e) => setEditingMaterial(prev => prev ? {...prev, category: e.target.value} : null)}
                    required
                  >
                    <option value="decking">Decking</option>
                    <option value="pergola">Pergola</option>
                    <option value="carport">Carport</option>
                    <option value="screening">Screening</option>
                    <option value="railing">Railing</option>
                    <option value="extras">Extras</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <textarea
                    id="description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editingMaterial?.description || ''}
                    onChange={(e) => setEditingMaterial(prev => prev ? {...prev, description: e.target.value} : null)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingMaterial(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Add Material Dialog */}
        <Dialog open={isAddingMaterial} onOpenChange={setIsAddingMaterial}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Material</DialogTitle>
              <DialogDescription>
                Enter the details for the new material.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="new-name" className="text-sm font-medium">Name</label>
                  <Input
                    id="new-name"
                    value={newMaterial.name}
                    onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-price" className="text-sm font-medium">Price</label>
                  <Input
                    id="new-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newMaterial.price}
                    onChange={(e) => setNewMaterial({...newMaterial, price: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-category" className="text-sm font-medium">Category</label>
                  <select
                    id="new-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newMaterial.category}
                    onChange={(e) => setNewMaterial({...newMaterial, category: e.target.value})}
                    required
                  >
                    <option value="decking">Decking</option>
                    <option value="pergola">Pergola</option>
                    <option value="carport">Carport</option>
                    <option value="screening">Screening</option>
                    <option value="railing">Railing</option>
                    <option value="extras">Extras</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-description" className="text-sm font-medium">Description</label>
                  <textarea
                    id="new-description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddingMaterial(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Material</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Configuration management component
  const ConfigManager = () => {
    const [editingConfig, setEditingConfig] = useState<AppConfig | null>(null);
    const [isAddingConfig, setIsAddingConfig] = useState(false);
    const [newConfig, setNewConfig] = useState<AppConfig>({
      id: '',
      key: '',
      value: '',
      category: 'general',
      description: ''
    });
    
    // Config mutation for creating/updating
    const configMutation = useMutation({
      mutationFn: async (config: AppConfig) => {
        const method = config.id ? "PUT" : "POST";
        const endpoint = config.id ? `/api/configs/${config.id}` : "/api/configs";
        return await apiRequest(method, endpoint, config);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/configs'] });
        toast({
          title: `Configuration ${editingConfig ? 'updated' : 'added'} successfully`,
          description: `The configuration has been ${editingConfig ? 'updated' : 'added'} to the system.`,
        });
        setEditingConfig(null);
        setIsAddingConfig(false);
      },
      onError: () => {
        toast({
          title: `Failed to ${editingConfig ? 'update' : 'add'} configuration`,
          description: "There was an error processing your request.",
          variant: "destructive",
        });
      }
    });
    
    // Config deletion mutation
    const deleteConfigMutation = useMutation({
      mutationFn: async (id: string) => {
        return await apiRequest("DELETE", `/api/configs/${id}`, {});
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/configs'] });
        toast({
          title: "Configuration deleted successfully",
          description: "The configuration has been removed from the system.",
        });
      },
      onError: () => {
        toast({
          title: "Failed to delete configuration",
          description: "There was an error processing your request.",
          variant: "destructive",
        });
      }
    });
    
    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingConfig) {
        configMutation.mutate(editingConfig);
      } else if (isAddingConfig) {
        configMutation.mutate(newConfig);
      }
    };
    
    // Group configs by category for display
    const groupedConfigs: Record<string, AppConfig[]> = configsLoading || !configs 
      ? {} 
      : configs.reduce((acc: Record<string, AppConfig[]>, config: AppConfig) => {
          if (!acc[config.category]) {
            acc[config.category] = [];
          }
          acc[config.category].push(config);
          return acc;
        }, {});
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#005b4f]">Application Configuration</h2>
          <Button onClick={() => setIsAddingConfig(true)} className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Configuration
          </Button>
        </div>
        
        {configsLoading ? (
          <div className="text-center p-8">Loading configurations...</div>
        ) : (
          <div className="space-y-6">
            {Object.keys(groupedConfigs).length > 0 ? (
              Object.entries(groupedConfigs).map(([category, configs]: [string, AppConfig[]]) => (
                <Card key={category}>
                  <CardHeader className="pb-2">
                    <CardTitle className="capitalize">{category} Settings</CardTitle>
                    <CardDescription>
                      Configuration options for {category} functionality
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Key</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {configs.map((config: AppConfig) => (
                          <TableRow key={config.id}>
                            <TableCell className="font-medium">{config.key}</TableCell>
                            <TableCell>{config.value}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{config.description}</TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setEditingConfig(config)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-red-600"
                                  onClick={() => deleteConfigMutation.mutate(config.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center p-8 bg-muted rounded-lg">
                <p>No configurations found. Add some to customize the application.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Config Edit Dialog */}
        <Dialog open={!!editingConfig} onOpenChange={(open) => !open && setEditingConfig(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Configuration</DialogTitle>
              <DialogDescription>
                Update this configuration setting.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="key" className="text-sm font-medium">Key</label>
                  <Input
                    id="key"
                    value={editingConfig?.key || ''}
                    onChange={(e) => setEditingConfig(prev => prev ? {...prev, key: e.target.value} : null)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="value" className="text-sm font-medium">Value</label>
                  <Input
                    id="value"
                    value={editingConfig?.value || ''}
                    onChange={(e) => setEditingConfig(prev => prev ? {...prev, value: e.target.value} : null)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editingConfig?.category || ''}
                    onChange={(e) => setEditingConfig(prev => prev ? {...prev, category: e.target.value} : null)}
                    required
                  >
                    <option value="general">General</option>
                    <option value="decking">Decking</option>
                    <option value="pergola">Pergola</option>
                    <option value="pricing">Pricing</option>
                    <option value="display">Display</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <textarea
                    id="description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editingConfig?.description || ''}
                    onChange={(e) => setEditingConfig(prev => prev ? {...prev, description: e.target.value} : null)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingConfig(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Add Config Dialog */}
        <Dialog open={isAddingConfig} onOpenChange={setIsAddingConfig}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Configuration</DialogTitle>
              <DialogDescription>
                Enter the details for the new configuration setting.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="new-key" className="text-sm font-medium">Key</label>
                  <Input
                    id="new-key"
                    value={newConfig.key}
                    onChange={(e) => setNewConfig({...newConfig, key: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-value" className="text-sm font-medium">Value</label>
                  <Input
                    id="new-value"
                    value={newConfig.value}
                    onChange={(e) => setNewConfig({...newConfig, value: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-category" className="text-sm font-medium">Category</label>
                  <select
                    id="new-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newConfig.category}
                    onChange={(e) => setNewConfig({...newConfig, category: e.target.value})}
                    required
                  >
                    <option value="general">General</option>
                    <option value="decking">Decking</option>
                    <option value="pergola">Pergola</option>
                    <option value="pricing">Pricing</option>
                    <option value="display">Display</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-description" className="text-sm font-medium">Description</label>
                  <textarea
                    id="new-description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newConfig.description}
                    onChange={(e) => setNewConfig({...newConfig, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddingConfig(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Configuration</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Return main component markup
  return (
    <div className="container mx-auto p-6">
      {selectedQuote ? (
        <div>
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedQuote(null)}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <QuoteDetail quoteId={selectedQuote} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold text-[#005b4f]">Admin Dashboard</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleLogout} className="gap-1">
                <UserPlus className="h-4 w-4" />
                Logout
              </Button>
              <Button 
                variant={isExporting ? "secondary" : "default"}
                onClick={exportQuotes}
                disabled={isExporting || !quotes || quotes.length === 0}
                className="gap-1"
              >
                {isExporting ? (
                  <>
                    <DownloadCloud className="h-4 w-4 animate-bounce" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4" />
                    Export Quotes
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="quotes">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quotes" className="gap-1">
                <Clipboard className="h-4 w-4" />
                Quotes
              </TabsTrigger>
              <TabsTrigger value="materials" className="gap-1">
                <Package className="h-4 w-4" />
                Materials
              </TabsTrigger>
              <TabsTrigger value="config" className="gap-1">
                <Settings className="h-4 w-4" />
                Configuration
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="quotes" className="p-4 border rounded-md mt-4">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search quotes..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <ListFilter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                {quotesLoading ? (
                  <div className="text-center p-8">Loading quotes...</div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Client Name</TableHead>
                          <TableHead>Project Type</TableHead>
                          <TableHead>Date Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQuotes.length > 0 ? (
                          filteredQuotes.map((quote: any) => (
                            <TableRow key={quote.id}>
                              <TableCell className="font-medium">{quote.id}</TableCell>
                              <TableCell>{quote.clientName || 'N/A'}</TableCell>
                              <TableCell className="capitalize">{quote.projectType || 'N/A'}</TableCell>
                              <TableCell>{new Date(quote.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => viewQuote(quote.id)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">
                              No quotes found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="materials" className="p-4 border rounded-md mt-4">
              <MaterialsManager />
            </TabsContent>
            
            <TabsContent value="config" className="p-4 border rounded-md mt-4">
              <ConfigManager />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}