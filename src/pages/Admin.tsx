import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, LogOut, Mail, Phone, MapPin, Briefcase, Download } from 'lucide-react';

interface Application {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  pays: string;
  profession: string;
  message: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && user && !isAdmin) {
      toast.error('Accès refusé : vous n\'êtes pas administrateur');
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchApplications();
    }
  }, [isAdmin]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des candidatures');
    } finally {
      setLoadingApps(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const exportToSQL = async () => {
    try {
      toast.info('Exportation des données en cours...');

      // Récupérer toutes les données
      const { data: applicationsData } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: true });

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });

      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: true });

      const { data: rateLimitsData } = await supabase
        .from('application_rate_limits')
        .select('*')
        .order('created_at', { ascending: true });

      // Générer le SQL
      let sqlContent = `-- Export SQL généré le ${new Date().toISOString()}\n`;
      sqlContent += `-- Projet: Provisa\n\n`;
      
      // Helper pour échapper les chaînes SQL
      const escapeSql = (value: any): string => {
        if (value === null || value === undefined) return 'NULL';
        if (typeof value === 'boolean') return value ? 'true' : 'false';
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'string') {
          return `'${value.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
        }
        if (value instanceof Date) return `'${value.toISOString()}'`;
        return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
      };

      // Export applications
      if (applicationsData && applicationsData.length > 0) {
        sqlContent += `-- Table: applications (${applicationsData.length} enregistrements)\n`;
        applicationsData.forEach(app => {
          sqlContent += `INSERT INTO public.applications (id, nom, email, telephone, pays, profession, message, status, created_at, updated_at) VALUES (\n`;
          sqlContent += `  ${escapeSql(app.id)},\n`;
          sqlContent += `  ${escapeSql(app.nom)},\n`;
          sqlContent += `  ${escapeSql(app.email)},\n`;
          sqlContent += `  ${escapeSql(app.telephone)},\n`;
          sqlContent += `  ${escapeSql(app.pays)},\n`;
          sqlContent += `  ${escapeSql(app.profession)},\n`;
          sqlContent += `  ${escapeSql(app.message)},\n`;
          sqlContent += `  ${escapeSql(app.status)},\n`;
          sqlContent += `  ${escapeSql(app.created_at)},\n`;
          sqlContent += `  ${escapeSql(app.updated_at)}\n`;
          sqlContent += `);\n\n`;
        });
      }

      // Export profiles
      if (profilesData && profilesData.length > 0) {
        sqlContent += `-- Table: profiles (${profilesData.length} enregistrements)\n`;
        profilesData.forEach(profile => {
          sqlContent += `INSERT INTO public.profiles (id, email, created_at, updated_at) VALUES (\n`;
          sqlContent += `  ${escapeSql(profile.id)},\n`;
          sqlContent += `  ${escapeSql(profile.email)},\n`;
          sqlContent += `  ${escapeSql(profile.created_at)},\n`;
          sqlContent += `  ${escapeSql(profile.updated_at)}\n`;
          sqlContent += `);\n\n`;
        });
      }

      // Export user_roles
      if (rolesData && rolesData.length > 0) {
        sqlContent += `-- Table: user_roles (${rolesData.length} enregistrements)\n`;
        rolesData.forEach(role => {
          sqlContent += `INSERT INTO public.user_roles (id, user_id, role, created_at) VALUES (\n`;
          sqlContent += `  ${escapeSql(role.id)},\n`;
          sqlContent += `  ${escapeSql(role.user_id)},\n`;
          sqlContent += `  ${escapeSql(role.role)},\n`;
          sqlContent += `  ${escapeSql(role.created_at)}\n`;
          sqlContent += `);\n\n`;
        });
      }

      // Export application_rate_limits
      if (rateLimitsData && rateLimitsData.length > 0) {
        sqlContent += `-- Table: application_rate_limits (${rateLimitsData.length} enregistrements)\n`;
        rateLimitsData.forEach(limit => {
          sqlContent += `INSERT INTO public.application_rate_limits (id, ip_address, submission_count, first_submission_at, last_submission_at, blocked_until, created_at) VALUES (\n`;
          sqlContent += `  ${escapeSql(limit.id)},\n`;
          sqlContent += `  ${escapeSql(limit.ip_address)},\n`;
          sqlContent += `  ${escapeSql(limit.submission_count)},\n`;
          sqlContent += `  ${escapeSql(limit.first_submission_at)},\n`;
          sqlContent += `  ${escapeSql(limit.last_submission_at)},\n`;
          sqlContent += `  ${escapeSql(limit.blocked_until)},\n`;
          sqlContent += `  ${escapeSql(limit.created_at)}\n`;
          sqlContent += `);\n\n`;
        });
      }

      // Télécharger le fichier
      const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `provisa-export-${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Export SQL terminé avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export des données');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouveau': return 'bg-blue-500';
      case 'en_cours': return 'bg-yellow-500';
      case 'accepte': return 'bg-green-500';
      case 'refuse': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading || loadingApps) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au site
          </Button>
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={exportToSQL}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter SQL
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Gestion des candidatures reçues
          </p>
        </div>

        <div className="grid gap-6">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Aucune candidature pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{app.nom}</CardTitle>
                      <CardDescription>
                        Reçue le {new Date(app.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status === 'nouveau' ? 'Nouveau' : app.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${app.email}`} className="hover:underline">
                        {app.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${app.telephone}`} className="hover:underline">
                        {app.telephone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{app.pays}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>{app.profession}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Message :</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {app.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
