import { useState, useEffect } from "react";
import { 
  ConfigOption, 
  OptionCategory, 
  optionCategories, 
  loadConfigOptions,
  saveConfigOptions,
  resetConfigOptions,
  initializeConfigOptions 
} from "@/lib/configOptions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { PlusIcon, TrashIcon, RefreshCwIcon, SearchIcon, Save } from "lucide-react";

export default function ConfigManager() {
  const { toast } = useToast();
  const [configOptions, setConfigOptions] = useState<ConfigOption[]>([]);
  const [activeCategory, setActiveCategory] = useState<OptionCategory>('decking');
  const [searchTerm, setSearchTerm] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  
  useEffect(() => {
    initializeConfigOptions();
    setConfigOptions(loadConfigOptions());
  }, []);
  
  // Filter options based on active category and search term
  const filteredOptions = configOptions.filter(option => {
    const matchesCategory = option.category === activeCategory;
    const matchesSearch = searchTerm === "" || 
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });
  
  // Add a new option to a config item
  const addOption = (configId: string) => {
    setConfigOptions(prevOptions => {
      return prevOptions.map(option => {
        if (option.id === configId) {
          return {
            ...option,
            options: [...option.options, "New Option"]
          };
        }
        return option;
      });
    });
    setIsDirty(true);
  };
  
  // Update an option value
  const updateOptionValue = (configId: string, index: number, newValue: string) => {
    setConfigOptions(prevOptions => {
      return prevOptions.map(option => {
        if (option.id === configId) {
          const newOptions = [...option.options];
          newOptions[index] = newValue;
          return {
            ...option,
            options: newOptions
          };
        }
        return option;
      });
    });
    setIsDirty(true);
  };
  
  // Remove an option
  const removeOption = (configId: string, index: number) => {
    setConfigOptions(prevOptions => {
      return prevOptions.map(option => {
        if (option.id === configId) {
          const newOptions = [...option.options];
          newOptions.splice(index, 1);
          return {
            ...option,
            options: newOptions
          };
        }
        return option;
      });
    });
    setIsDirty(true);
  };
  
  // Reset a single configuration to defaults
  const resetConfig = (configId: string) => {
    setConfigOptions(prevOptions => {
      return prevOptions.map(option => {
        if (option.id === configId) {
          return {
            ...option,
            options: [...option.defaultOptions]
          };
        }
        return option;
      });
    });
    
    toast({
      title: "Reset Successful",
      description: "Configuration has been reset to defaults.",
    });
    
    setIsDirty(true);
  };
  
  // Reset all configurations to defaults
  const resetAllConfigs = () => {
    resetConfigOptions();
    setConfigOptions(loadConfigOptions());
    
    toast({
      title: "Reset Complete",
      description: "All configurations have been reset to defaults.",
    });
    
    setIsDirty(false);
  };
  
  // Save all configurations
  const saveAllConfigs = () => {
    saveConfigOptions(configOptions);
    
    toast({
      title: "Save Complete",
      description: "All configuration changes have been saved.",
    });
    
    setIsDirty(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#005b4f]">Configuration Manager</h2>
          <p className="text-muted-foreground">
            Customize dropdown options throughout the quote builder
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search options..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button
            variant="default"
            onClick={saveAllConfigs}
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
                <RefreshCwIcon className="h-4 w-4" />
                Reset All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset All Configurations?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all configuration options to their default values.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetAllConfigs}>
                  Reset All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Tabs defaultValue={activeCategory} onValueChange={(value) => setActiveCategory(value as OptionCategory)}>
        <TabsList className="mb-4 w-full overflow-x-auto flex-nowrap">
          {optionCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {optionCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{category.name} Options</CardTitle>
                <CardDescription>
                  Configure dropdown options for the {category.name.toLowerCase()} section
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 py-0">
                <ScrollArea className="h-[500px] p-4">
                  <Accordion type="multiple" className="space-y-4">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map(option => (
                        <AccordionItem key={option.id} value={option.id} className="border rounded-md p-4">
                          <AccordionTrigger className="py-2 px-4 hover:no-underline hover:bg-slate-50 rounded-md">
                            <div className="flex-1 text-left">
                              <h3 className="font-semibold">{option.name}</h3>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-4 pb-2 px-2">
                            <div className="space-y-4">
                              <div className="flex justify-between mb-2">
                                <p className="text-sm text-muted-foreground">{option.options.length} options</p>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addOption(option.id)}
                                  >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Add Option
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                      >
                                        <RefreshCwIcon className="h-4 w-4 mr-1" />
                                        Reset
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Reset {option.name}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will reset these options to their default values.
                                          This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => resetConfig(option.id)}>
                                          Reset
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                {option.options.map((opt, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Input
                                      value={opt}
                                      onChange={(e) => updateOptionValue(option.id, index, e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => removeOption(option.id, index)}
                                    >
                                      <TrashIcon className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))
                    ) : searchTerm ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No options matching your search
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        No options found in this category
                      </div>
                    )}
                  </Accordion>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t pt-4">
                {isDirty && (
                  <p className="text-sm text-amber-600">
                    You have unsaved changes. Click "Save Changes" to persist them.
                  </p>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}