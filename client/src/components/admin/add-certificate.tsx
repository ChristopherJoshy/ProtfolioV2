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
import { Upload, Trash } from "lucide-react";
import { addCertificate, updateCertificate, uploadFile } from "@/lib/firebase";
import { Certificate } from "@/types";

// Form schema
const certificateSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  issuer: z.string().min(2, { message: "Issuer must be at least 2 characters" }),
  date: z.string().min(3, { message: "Date is required" }),
  description: z.string().optional(),
  certificateUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  category: z.string().optional(),
  order: z.number().min(0).default(0),
});

type CertificateFormValues = z.infer<typeof certificateSchema>;

interface AddCertificateProps {
  certificate?: Certificate;
  onSuccess?: () => void;
}

const AddCertificate: React.FC<AddCertificateProps> = ({ certificate, onSuccess }) => {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!certificate;

  // Initialize form with default values or existing certificate data
  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: certificate?.title || "",
      issuer: certificate?.issuer || "",
      date: certificate?.date || "",
      description: certificate?.description || "",
      certificateUrl: certificate?.certificateUrl || "",
      category: certificate?.category || "",
      order: certificate?.order || 0,
    }
  });
  
  // Set image preview if editing a certificate
  useEffect(() => {
    if (certificate?.imageUrl) {
      setImagePreview(certificate.imageUrl);
    }
  }, [certificate]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Clear image
  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('certificateImage') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // Handle form submission
  const onSubmit = async (data: CertificateFormValues) => {
    setIsSubmitting(true);
    try {
      let imageUrl = certificate?.imageUrl || "";
      
      // Upload image if provided
      if (imageFile) {
        const timestamp = Date.now();
        const path = `certificates/${timestamp}_${imageFile.name}`;
        imageUrl = await uploadFile(imageFile, path);
      }
      
      if (isEditMode && certificate?.id) {
        // Update existing certificate
        await updateCertificate(certificate.id, {
          ...data,
          imageUrl: imageUrl || certificate.imageUrl,
        });
        toast({
          title: "Certificate Updated",
          description: "Your certificate has been updated successfully!",
        });
      } else {
        // Add new certificate
        await addCertificate({
          ...data,
          imageUrl,
        });
        toast({
          title: "Certificate Added",
          description: "Your certificate has been added successfully!",
        });
      }
      
      // Reset form
      if (!isEditMode) {
        form.reset();
        clearImage();
      }
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error saving certificate:", error);
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
        <CardTitle>{isEditMode ? "Edit Certificate" : "Add New Certificate"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Applied Artificial Intelligence Workshop" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="issuer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuer</FormLabel>
                    <FormControl>
                      <Input placeholder="CareerLink" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input placeholder="January 25, 2025" {...field} />
                    </FormControl>
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the certificate or achievement..."
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
                name="certificateUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/certificate"
                        {...field}
                      />
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
                    <FormLabel>Category (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="AI Workshop" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
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
            
            <div className="space-y-2">
              <FormLabel>Certificate Image</FormLabel>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-full max-w-xs h-48 relative">
                      <img
                        src={imagePreview}
                        alt="Certificate preview"
                        className="rounded-md object-contain w-full h-full"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearImage}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {imageFile ? imageFile.name : "Current image"}
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
                {!imagePreview && (
                  <Input
                    id="certificateImage"
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                  />
                )}
                {!imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      const fileInput = document.getElementById('certificateImage');
                      if (fileInput) fileInput.click();
                    }}
                  >
                    Select File
                  </Button>
                )}
              </div>
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
                {isSubmitting ? "Saving..." : isEditMode ? "Update Certificate" : "Add Certificate"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddCertificate;
