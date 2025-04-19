import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, User, Award, FileText, Mail, 
  Layers, Plus, Pencil, Trash, ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import AddProject from "./add-project";
import AddCertificate from "./add-certificate";
import EditProfile from "./edit-profile";
import {
  getProjects,
  getCertificates,
  getMessages,
  getJourneyItems,
  deleteProject,
  deleteCertificate,
  deleteMessage,
  markMessageAsRead,
  deleteJourneyItem
} from "@/lib/firebase";
import { Project, Certificate, JourneyItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard: React.FC = () => {
  const { logout } = useAdminAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentCertificate, setCurrentCertificate] = useState<Certificate | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddCertificate, setShowAddCertificate] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'project' | 'certificate' | 'message' | 'journey';
    id: string;
    title: string;
  } | null>(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [projectsData, certificatesData, messagesData, journeyItemsData] = await Promise.all([
          getProjects(),
          getCertificates(),
          getMessages(),
          getJourneyItems()
        ]);
        
        setProjects(projectsData);
        setCertificates(certificatesData);
        setMessages(messagesData);
        setJourneyItems(journeyItemsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    
    try {
      switch (confirmDelete.type) {
        case 'project':
          await deleteProject(confirmDelete.id);
          setProjects(projects.filter(p => p.id !== confirmDelete.id));
          break;
        case 'certificate':
          await deleteCertificate(confirmDelete.id);
          setCertificates(certificates.filter(c => c.id !== confirmDelete.id));
          break;
        case 'message':
          await deleteMessage(confirmDelete.id);
          setMessages(messages.filter(m => m.id !== confirmDelete.id));
          break;
        case 'journey':
          await deleteJourneyItem(confirmDelete.id);
          setJourneyItems(journeyItems.filter(j => j.id !== confirmDelete.id));
          break;
      }
      
      toast({
        title: "Deleted",
        description: `${confirmDelete.title} has been deleted.`,
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConfirmDelete(null);
    }
  };

  // Handle mark message as read
  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markMessageAsRead(messageId);
      setMessages(messages.map(m => 
        m.id === messageId ? { ...m, read: true } : m
      ));
      toast({
        title: "Message Marked as Read",
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark message as read.",
        variant: "destructive",
      });
    }
  };

  // Handle refreshing data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [projectsData, certificatesData, messagesData, journeyItemsData] = await Promise.all([
        getProjects(),
        getCertificates(),
        getMessages(),
        getJourneyItems()
      ]);
      
      setProjects(projectsData);
      setCertificates(certificatesData);
      setMessages(messagesData);
      setJourneyItems(journeyItemsData);
      
      toast({
        title: "Data Refreshed",
        description: "Latest data has been loaded.",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Stats
  const stats = [
    {
      title: "Projects",
      value: projects.length,
      icon: <Layers className="h-6 w-6 text-primary" />,
      change: "+1 this month",
    },
    {
      title: "Certificates",
      value: certificates.length,
      icon: <Award className="h-6 w-6 text-primary" />,
      change: `${certificates.length > 0 ? certificates[0].title : 'None'} is latest`,
    },
    {
      title: "Unread Messages",
      value: messages.filter(m => !m.read).length,
      icon: <Mail className="h-6 w-6 text-primary" />,
      change: `${messages.length} total messages`,
    },
    {
      title: "Journey Items",
      value: journeyItems.length,
      icon: <FileText className="h-6 w-6 text-primary" />,
      change: "Timeline entries",
    },
  ];

  // If showing add project/certificate forms
  if (showAddProject) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => {
            setShowAddProject(false);
            setCurrentProject(null);
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <AddProject 
          project={currentProject}
          onSuccess={() => {
            setShowAddProject(false);
            setCurrentProject(null);
            refreshData();
          }}
        />
      </div>
    );
  }

  if (showAddCertificate) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => {
            setShowAddCertificate(false);
            setCurrentCertificate(null);
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <AddCertificate
          certificate={currentCertificate}
          onSuccess={() => {
            setShowAddCertificate(false);
            setCurrentCertificate(null);
            refreshData();
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6 px-4"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your portfolio content</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Site
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            <BarChart className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="projects">
            <Layers className="mr-2 h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="certificates">
            <Award className="mr-2 h-4 w-4" />
            Certificates
          </TabsTrigger>
          <TabsTrigger value="messages">
            <Mail className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Welcome to your portfolio admin dashboard. Here you can manage all aspects of your portfolio website.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => setActiveTab("profile")}
                    className="flex justify-between items-center h-auto py-6"
                  >
                    <div className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      <span>Edit Profile</span>
                    </div>
                    <span className="text-xs bg-primary/20 px-2 py-1 rounded-full">
                      Personal Info
                    </span>
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentProject(null);
                      setShowAddProject(true);
                    }}
                    variant="outline"
                    className="flex justify-between items-center h-auto py-6"
                  >
                    <div className="flex items-center">
                      <Plus className="mr-2 h-5 w-5" />
                      <span>Add New Project</span>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                      Showcase Work
                    </span>
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentCertificate(null);
                      setShowAddCertificate(true);
                    }}
                    variant="outline"
                    className="flex justify-between items-center h-auto py-6"
                  >
                    <div className="flex items-center">
                      <Plus className="mr-2 h-5 w-5" />
                      <span>Add Certificate</span>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                      Achievements
                    </span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("messages")}
                    variant="outline"
                    className="flex justify-between items-center h-auto py-6"
                  >
                    <div className="flex items-center">
                      <Mail className="mr-2 h-5 w-5" />
                      <span>View Messages</span>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                      {messages.filter(m => !m.read).length} unread
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <EditProfile />
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Projects</CardTitle>
              <Button onClick={() => {
                setCurrentProject(null);
                setShowAddProject(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add Project
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  {projects.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No projects found. Click the button above to add your first project.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {project.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {project.featured ? (
                                <Badge className="bg-primary">Featured</Badge>
                              ) : (
                                <Badge variant="secondary">Regular</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    setCurrentProject(project);
                                    setShowAddProject(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => setConfirmDelete({
                                    type: 'project',
                                    id: project.id,
                                    title: project.title
                                  })}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Certificates & Achievements</CardTitle>
              <Button onClick={() => {
                setCurrentCertificate(null);
                setShowAddCertificate(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add Certificate
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  {certificates.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No certificates found. Click the button above to add your first certificate.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Issuer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {certificates.map((certificate) => (
                          <TableRow key={certificate.id}>
                            <TableCell className="font-medium">{certificate.title}</TableCell>
                            <TableCell>{certificate.issuer}</TableCell>
                            <TableCell>{certificate.date}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    setCurrentCertificate(certificate);
                                    setShowAddCertificate(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => setConfirmDelete({
                                    type: 'certificate',
                                    id: certificate.id,
                                    title: certificate.title
                                  })}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  {messages.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No messages received yet.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>From</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messages.map((message) => (
                          <TableRow key={message.id} className={!message.read ? "bg-muted/20" : ""}>
                            <TableCell className="font-medium">
                              {message.name}
                              <div className="text-xs text-muted-foreground">
                                {message.email}
                              </div>
                            </TableCell>
                            <TableCell>{message.subject}</TableCell>
                            <TableCell>
                              {message.createdAt?.toDate
                                ? message.createdAt.toDate().toLocaleDateString()
                                : "Unknown date"}
                            </TableCell>
                            <TableCell>
                              {message.read ? (
                                <Badge variant="outline">Read</Badge>
                              ) : (
                                <Badge>New</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (!message.read) {
                                      handleMarkAsRead(message.id);
                                    }
                                  }}
                                  disabled={message.read}
                                >
                                  {message.read ? "Read" : "Mark as Read"}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => setConfirmDelete({
                                    type: 'message',
                                    id: message.id,
                                    title: `Message from ${message.name}`
                                  })}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={open => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{confirmDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Dashboard;
