import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { applicationCategories, colorSchemes } from '@/constant/static';

// Define the available icon options
const availableIcons = [
  'Wallet',
  'DollarSign',
  'FileText',
  'Building2',
  'ClipboardCheck',
  'Settings',
  'Globe',
  'FilePieChart',
  'Users',
  'LayoutGrid',
  'Calendar',
  'LandPlot',
  'BarChart3',
  'Search',
  'Star',
  'Clock',
  'Briefcase',
  'Laptop',
  'Mail',
  'Home',
  'FileCheck',
  'Shield',
  'UserPlus',
  'Bell',
];

// Define the available color schemes

// Define the form validation schema using Zod
const formSchema = z.object({
  id: z
    .string()
    .min(3, {
      message: 'ID must be at least 3 characters',
    })
    .max(30, {
      message: 'ID cannot exceed 30 characters',
    })
    .regex(/^[a-z0-9-]+$/, {
      message: 'ID can only contain lowercase letters, numbers, and hyphens',
    }),
  name: z
    .string()
    .min(3, {
      message: 'Name must be at least 3 characters',
    })
    .max(50, {
      message: 'Name cannot exceed 50 characters',
    }),
  iconName: z.string({
    required_error: 'Please select an icon',
  }),
  category: z.string({
    required_error: 'Please select a category',
  }),
  color: z.string({
    required_error: 'Please select a color',
  }),
  route: z
    .string()
    .min(1, {
      message: 'Route is required',
    })
    .startsWith('/', {
      message: 'Route must start with /',
    }),
  description: z
    .string()
    .min(10, {
      message: 'Description must be at least 10 characters',
    })
    .max(200, {
      message: 'Description cannot exceed 200 characters',
    }),
});

const ManageApplication = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      iconName: 'Laptop',
      category: '',
      color: 'blue',
      route: '/',
      description: '',
    },
  });

  // Dynamic icon component
  const DynamicIcon = ({ name, size = 20, className = '' }) => {
    const IconComponent = LucideIcons[name];
    if (!IconComponent) {
      return <LucideIcons.HelpCircle size={size} className={className} />;
    }
    return <IconComponent size={size} className={className} />;
  };

  // Get form values to use in the preview
  const name = form.watch('name') || 'New Application';
  const description = form.watch('description') || 'Application description';
  const iconName = form.watch('iconName');
  const colorId = form.watch('color');
  const colorClass = colorSchemes.find((c) => c.id === colorId)?.class || colorSchemes[0].class;

  // Generate ID from name
  const generateIdFromName = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  // Handle name change to auto-generate ID
  const handleNameChange = (e) => {
    const name = e.target.value;
    form.setValue('name', name);

    // Only auto-generate ID if the user hasn't manually edited it
    if (!form.getValues('id') || form.getValues('id') === generateIdFromName(form.getValues('name').slice(0, -1))) {
      form.setValue('id', generateIdFromName(name));
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // In a real application, you would send this data to your API
      console.log('Submitting new application:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close the dialog and reset the form
      setOpen(false);
      form.reset();
      setActiveTab('basic');
    } catch (error) {
      console.error('Error adding application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add New Application</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1000px] max-h-[98vh] overflow-y-auto p-0">
          <div className="flex h-full">
            <div className="w-1/3 bg-gray-50 p-6 border-r border-gray-200 flex flex-col">
              <div className="text-sm font-medium text-gray-700 mb-6">Application Preview</div>

              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-[200px]">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-center">
                    <div
                      className={cn(
                        'w-16 h-16 rounded-xl flex items-center justify-center text-white mb-3',
                        colorClass
                      )}
                    >
                      <DynamicIcon name={iconName} size={28} />
                    </div>
                    <h3 className="font-medium text-gray-800 text-center mb-1">{name}</h3>
                    <p className="text-xs text-gray-500 text-center">
                      {description.length > 60 ? `${description.slice(0, 60)}...` : description}
                    </p>

                    <Button variant="ghost" size="sm" className="mt-3 text-xs">
                      <span>Open App</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <div className="text-xs text-gray-500">
                  This is how your application will appear on the dashboard. The preview updates as you fill out the
                  form.
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-2/3 p-6">
              <DialogHeader>
                <DialogTitle>Add New Application</DialogTitle>
                <DialogDescription>Create a new application tile for your enterprise portal.</DialogDescription>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                </TabsList>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
                    <TabsContent value="basic" className="space-y-4 mt-0">
                      {/* Name field */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Application Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Salary Management" {...field} onChange={handleNameChange} />
                            </FormControl>
                            <FormDescription>The name displayed on the application tile</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* ID and Route fields in a row */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Application ID</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. salary-management" {...field} />
                              </FormControl>
                              <FormDescription>A unique identifier</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="route"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Route Path</FormLabel>
                              <FormControl>
                                <Input placeholder="/salary-management" {...field} />
                              </FormControl>
                              <FormDescription>URL path for the application</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Category selection */}
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category">
                                    {form.watch('category') && (
                                      <div className="flex items-center gap-2">
                                        <DynamicIcon
                                          name={
                                            applicationCategories.find((c) => c.id === form.watch('category'))
                                              ?.iconName || 'Folder'
                                          }
                                          size={16}
                                        />
                                        <span>
                                          {applicationCategories.find((c) => c.id === form.watch('category'))?.name ||
                                            'Select a category'}
                                        </span>
                                      </div>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Application applicationCategories</SelectLabel>
                                  {applicationCategories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                      <div className="flex items-center gap-2">
                                        <DynamicIcon name={category.iconName} size={16} />
                                        <span>{category.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormDescription>The category the application belongs to</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Description field */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter a short description of the application"
                                className="resize-none min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>A brief description of what the application does</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-4 mt-0">
                      {/* Icon selection */}
                      <FormField
                        control={form.control}
                        name="iconName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an icon" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-[300px]">
                                <SelectGroup>
                                  <SelectLabel>Available Icons</SelectLabel>
                                  {availableIcons.map((icon) => (
                                    <SelectItem key={icon} value={icon}>
                                      {icon}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormDescription>The icon displayed on the application tile</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Color selection */}
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color Scheme</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-10 gap-2">
                                {colorSchemes.map((color) => (
                                  <div
                                    key={color.id}
                                    className={cn(
                                      'w-full aspect-square rounded-md cursor-pointer border-2 transition-all',
                                      color.class,
                                      field.value === color.id
                                        ? 'border-primary ring-2 ring-primary ring-opacity-50'
                                        : 'border-transparent hover:border-gray-300'
                                    )}
                                    onClick={() => form.setValue('color', color.id)}
                                  >
                                    {field.value === color.id && (
                                      <div className="flex items-center justify-center h-full">
                                        <Check className="text-white" size={14} />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </FormControl>
                            <FormDescription>The color of the application icon</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="pt-4">
                        <div className="bg-amber-50 border border-amber-100 rounded-md p-3 text-amber-800 text-sm">
                          <p>
                            More appearance options like custom icons and branding will be available in a future update.
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    <DialogFooter className="flex items-center justify-between border-t border-gray-200 pt-4 mt-6">
                      <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                        Cancel
                      </Button>
                      <div className="flex items-center gap-2">
                        {activeTab === 'basic' ? (
                          <Button type="button" onClick={() => setActiveTab('appearance')}>
                            Next: Appearance
                          </Button>
                        ) : (
                          <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                                <span>Creating...</span>
                              </>
                            ) : (
                              <>
                                <Plus size={16} />
                                <span>Create Application</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </DialogFooter>
                  </form>
                </Form>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageApplication;
