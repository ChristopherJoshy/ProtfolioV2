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
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Trash, Loader2 } from "lucide-react";
import { getProfile, updateProfile, uploadFile } from "@/lib/firebase";
import { Profile } from "@/types";

// Form schema
const profileSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  github: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  linkedin: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  instagram: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  titles: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const EditProfile: React.FC = () => {
  const { toast } = useToast();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [titles, setTitles] = useState<string[]>([]);

  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bio: "",
      location: "",
      github: "",
      linkedin: "",
      instagram: "",
      website: "",
      titles: [],
    }
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        
        if (profileData) {
          setProfileId(profileData.id);
          
          // Set form values
          form.reset({
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            bio: profileData.bio || "",
            location: profileData.location || "",
            github: profileData.github || "",
            linkedin: profileData.linkedin || "",
            instagram: profileData.instagram || "",
            website: profileData.website || "",
            titles: profileData.titles || [],
          });
          
          // Set avatar and resume preview
          if (profileData.avatar) {
            setAvatarPreview(profileData.avatar);
          }
          
          if (profileData.resume) {
            setResumeFileName("Current resume file");
          }
          
          if (profileData.titles) {
            setTitles(profileData.titles);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [form, toast]);

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Handle resume file selection
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      const validTypes = ['application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only PDF files are allowed",
          variant: "destructive",
        });
        return;
      }
      
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };

  // Clear avatar
  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    // Reset file input
    const fileInput = document.getElementById('avatar') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // Clear resume
  const clearResume = () => {
    setResumeFile(null);
    setResumeFileName(null);
    // Reset file input
    const fileInput = document.getElementById('resume') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // Add new title to the list
  const addTitle = () => {
    if (!newTitle.trim()) return;
    
    // Check if title already exists
    if (titles.includes(newTitle.trim())) {
      toast({
        title: "Title already added",
        variant: "destructive",
      });
      return;
    }
    
    const newTitles = [...titles, newTitle.trim()];
    setTitles(newTitles);
    form.setValue("titles", newTitles);
    setNewTitle("");
  };

  // Remove title from the list
  const removeTitle = (title: string) => {
    const newTitles = titles.filter((t) => t !== title);
    setTitles(newTitles);
    form.setValue("titles", newTitles);
  };

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    if (!profileId) {
      toast({
        title: "Error",
        description: "Profile ID not found",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      let avatarUrl = null;
      let resumeUrl = null;
      
      // Upload avatar if provided
      if (avatarFile) {
        const timestamp = Date.now();
        const path = `profile/${timestamp}_${avatarFile.name}`;
        avatarUrl = await uploadFile(avatarFile, path);
      }
      
      // Upload resume if provided
      if (resumeFile) {
        const timestamp = Date.now();
        const path = `profile/${timestamp}_${resumeFile.name}`;
        resumeUrl = await uploadFile(resumeFile, path);
      }
      
      // Create update object
      const updateData = {
        ...data,
        ...(avatarUrl && { avatar: avatarUrl }),
        ...(resumeUrl && { resume: resumeUrl }),
      };
      
      // Update profile
      await updateProfile(profileId, updateData);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full shadow-sm">
        <CardContent className="flex items-center justify-center p-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Christopher" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Joshy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="christopherjoshy4@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+918075809531" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell something about yourself..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Puthenparambil (h), Ponga P.O, Nedumudy, Alappuzha, Kerala 688503"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Profile Titles</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {titles.map((title, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-secondary/20 text-foreground px-3 py-1 rounded"
                  >
                    {title}
                    <button
                      type="button"
                      onClick={() => removeTitle(title)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a title (e.g. Web Developer, Game Developer)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTitle();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addTitle}
                >
                  Add
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                These titles will be displayed in a rotating fashion on your profile.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/ChristopherJoshy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.linkedin.com/in/christopher-joshy-272a77290" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.instagram.com/calculatederror" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FormLabel>Profile Avatar</FormLabel>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors">
                  {avatarPreview ? (
                    <div className="space-y-4">
                      <div className="mx-auto w-32 h-32 relative rounded-full overflow-hidden">
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="object-cover w-full h-full"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0"
                          onClick={clearAvatar}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {avatarFile ? avatarFile.name : "Current avatar"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">
                        Upload your profile picture
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Recommended: Square image, 400x400px
                      </p>
                    </>
                  )}
                  {!avatarPreview && (
                    <Input
                      id="avatar"
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                    />
                  )}
                  {!avatarPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        const fileInput = document.getElementById('avatar');
                        if (fileInput) fileInput.click();
                      }}
                    >
                      Select File
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Resume/CV (PDF)</FormLabel>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors h-full flex flex-col justify-center">
                  {resumeFileName ? (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center">
                        <i className="far fa-file-pdf text-4xl text-primary mb-2"></i>
                        <p className="font-medium">{resumeFileName}</p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={clearResume}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">
                        Upload your resume/CV (PDF only)
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Max file size: 10MB
                      </p>
                    </>
                  )}
                  {!resumeFileName && (
                    <Input
                      id="resume"
                      type="file"
                      className="hidden"
                      accept="application/pdf"
                      onChange={handleResumeChange}
                    />
                  )}
                  {!resumeFileName && (
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        const fileInput = document.getElementById('resume');
                        if (fileInput) fileInput.click();
                      }}
                    >
                      Select File
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditProfile;
