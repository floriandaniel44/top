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

  // Génère une page imprimable stylée et lance l'impression (ou permet sauvegarde en PDF)
  const exportToPrintablePDF = () => {
    try {
      if (!applications || applications.length === 0) {
        toast.info('Aucune donnée à exporter');
        return;
      }

      const css = `
        @media print { @page { margin: 18mm } }
        body { font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #0f172a; background: #ffffff; }
        .container { max-width: 980px; margin: 18px auto; border-radius: 10px; padding: 0; box-shadow: 0 6px 20px rgba(2,6,23,0.08); }
        .frame { border-left: 10px solid #06b6d4; border-right: 10px solid #06b6d4; border-top: 4px solid #06b6d4; border-bottom: 4px solid #06b6d4; border-radius: 10px; padding: 20px; }
        .header { display:flex; justify-content:space-between; align-items:center; gap:12px; padding-bottom:12px; border-bottom: 1px dashed rgba(6,182,212,0.15); }
        .brand { display:flex; align-items:center; gap:16px; }
        .brand img { height:64px; width:64px; object-fit:cover; border-radius:8px; box-shadow: 0 2px 8px rgba(2,6,23,0.06); }
        .title { font-size:22px; font-weight:800; color:#064e3b; letter-spacing:0.2px; }
        .subtitle { color:#0f766e; font-size:13px; margin-top:4px; }
        .meta { color:#475569; font-size:12px; text-align:right; }
        table { width:100%; border-collapse:collapse; margin-top:16px; background:#fff; }
        th, td { border:1px solid rgba(6,182,212,0.12); padding:12px 10px; text-align:left; font-size:13px; vertical-align:middle; }
        th { background: linear-gradient(90deg,#06b6d4,#34d399); color:#042f2a; font-weight:700; }
        tbody tr td { background: linear-gradient(180deg, rgba(255,255,255,0.0), rgba(247,255,253,0.6)); }
        tbody tr:nth-child(odd) td { background:#ffffff; }
        tbody tr:nth-child(even) td { background:#fbfffe; }
        .footer { margin-top:18px; font-size:12px; color:#475569; border-top:1px solid rgba(2,6,23,0.04); padding-top:12px; }
      `;

      const rows = applications.map(a => `
        <tr>
          <td>${escapeHtml(a.nom || '')}</td>
          <td>${escapeHtml(a.email || '')}</td>
          <td>${escapeHtml(a.telephone || '')}</td>
          <td>${escapeHtml(a.pays || '')}</td>
          <td>${escapeHtml(a.profession || '')}</td>
          <td>${escapeHtml(a.status || '')}</td>
          <td>${new Date(a.created_at).toLocaleString('fr-FR')}</td>
        </tr>
      `).join('\n');

      const html = `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Export - Candidatures</title>
            <style>${css}</style>
          </head>
          <body>
            <div class="container">
              <div class="frame">
                <div class="header">
                  <div class="brand">
                    <img src="/opengraph.png" alt="Provisa" />
                    <div>
                      <div class="title">Provisa</div>
                      <div class="subtitle">Liste des candidatures reçues — Tableau d'administration</div>
                    </div>
                  </div>
                  <div class="meta">
                    <div>Exporté le ${new Date().toLocaleString('fr-FR')}</div>
                    <div style="margin-top:6px;font-weight:700;font-size:18px;color:#065f46">Total: ${applications.length}</div>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Pays</th>
                      <th>Profession</th>
                      <th>Statut</th>
                      <th>Reçu le</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rows}
                  </tbody>
                </table>

                <div class="footer">Provisa — Document généré depuis le tableau de bord administrateur. Confidentialité: Ne pas partager sans autorisation.</div>
              </div>
            </div>
          </body>
        </html>
      `;

      const w = window.open('', '_blank', 'noopener');
      if (!w) {
        toast.error('Impossible d\'ouvrir la fenêtre d\'export');
        return;
      }
      w.document.open();
      w.document.write(html);
      w.document.close();
      w.focus();
      setTimeout(() => w.print(), 600);

    } catch (err) {
      console.error('export printable error', err);
      toast.error('Erreur lors de la génération du document imprimable');
    }
  };

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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
              variant="secondary"
              onClick={exportToPrintablePDF}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger (PDF)
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
