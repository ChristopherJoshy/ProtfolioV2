import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, Trash } from "lucide-react";
import { addProject, updateProject, uploadFile } from "@/lib/firebase";
import { Project } from "@/types";

// Form schema
const projectSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.enum(["web", "game", "ai", "other"], { 
    required_error: "Please select a category" 
  }),
  projectUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  repoUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  technologies: z.array(z.string()).min(1, { message: "Add at least one technology" }),
  featured: z.boolean().default(false),
  stars: z.number().min(0).default(0),
  order: z.number().min(0).default(0),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface AddProjectProps {
  project?: Project;
  onSuccess?: () => void;
}

const AddProject: React.FC<AddProjectProps> = ({ project, onSuccess }) => {
  const { toast } = useToast();
  const [newTech, setNewTech] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!project;

  // Initialize form with default values or existing project data
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      category: project?.category || "web",
      projectUrl: project?.projectUrl || "",
      repoUrl: project?.repoUrl || "",
      technologies: project?.technologies || [],
      featured: project?.featured || false,
      stars: project?.stars || 0,
      order: project?.order || 0,
    }
  });
  
  // Set thumbnail preview if editing a project
  useEffect(() => {
    if (project?.thumbnailUrl) {
      setThumbnailPreview(project.thumbnailUrl);
    }
  }, [project]);

  // Handle thumbnail file selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only JPG, PNG, and WEBP files are allowed",
          variant: "destructive",
        });
        return;
      }
      
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Clear thumbnail
  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    // Reset file input
    const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // Add new technology to the list
  const addTechnology = () => {
    if (!newTech.trim()) return;
    
    const currentTechs = form.getValues("technologies") || [];
    
    // Check if technology already exists
    if (currentTechs.includes(newTech.trim())) {
      toast({
        title: "Technology already added",
        variant: "destructive",
      });
      return;
    }
    
    form.setValue("technologies", [...currentTechs, newTech.trim()]);
    setNewTech("");
  };

  // Remove technology from the list
  const removeTechnology = (tech: string) => {
    const currentTechs = form.getValues("technologies");
    form.setValue(
      "technologies",
      currentTechs.filter((t) => t !== tech)
    );
  };

  // Handle form submission
  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      let thumbnailUrl = project?.thumbnailUrl || "";
      
      // Upload thumbnail if provided
      if (thumbnailFile) {
        const timestamp = Date.now();
        const path = `projects/${timestamp}_${thumbnailFile.name}`;
        thumbnailUrl = await uploadFile(thumbnailFile, path);
      }
      
      if (isEditMode && project?.id) {
        // Update existing project
        await updateProject(project.id, {
          ...data,
          thumbnailUrl: thumbnailUrl || project.thumbnailUrl,
        });
        toast({
          title: "Project Updated",
          description: "Your project has been updated successfully!",
        });
      } else {
        // Add new project
        await addProject({
          ...data,
          thumbnailUrl,
        });
        toast({
          title: "Project Added",
          description: "Your project has been added successfully!",
        });
      }
      
      // Reset form
      if (!isEditMode) {
        form.reset();
        clearThumbnail();
      }
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Project" : "Add New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="web">Web Development</SelectItem>
                        <SelectItem value="game">Game Development</SelectItem>
                        <SelectItem value="ai">AI & ML</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="repoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username/repo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live Demo URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-2">
              <FormLabel>Technologies Used</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.watch("technologies").map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-3 py-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTechnology();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addTechnology}
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.formState.errors.technologies && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.technologies.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <FormLabel>Project Image</FormLabel>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors">
                {thumbnailPreview ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-full max-w-xs h-48 relative">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="rounded-md object-cover w-full h-full"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearThumbnail}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {thumbnailFile ? thumbnailFile.name : "Current thumbnail"}
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-2">
                      Drag and drop an image here, or click to select
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Max file size: 5MB (Supported formats: JPG, PNG, WEBP)
                    </p>
                  </>
                )}
                {!thumbnailPreview && (
                  <Input
                    id="thumbnail"
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleThumbnailChange}
                  />
                )}
                {!thumbnailPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      const fileInput = document.getElementById('thumbnail');
                      if (fileInput) fileInput.click();
                    }}
                  >
                    Select File
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Featured Project</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stars"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Star Count</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (onSuccess) onSuccess();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditMode ? "Update Project" : "Add Project"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddProject;
