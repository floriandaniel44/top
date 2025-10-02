-- Supprimer la politique RLS trop permissive qui expose les données des candidatures
-- Cette politique permettait à tous les utilisateurs authentifiés de modifier toutes les candidatures
DROP POLICY IF EXISTS "Authenticated users can update applications" ON public.applications;

-- Les politiques suivantes restent en place et sont sécurisées :
-- 1. "Anyone can submit applications" (INSERT) - Permet les soumissions publiques
-- 2. "Only admins can view all applications" (SELECT) - Seuls les admins peuvent voir
-- 3. "Only admins can update applications" (UPDATE) - Seuls les admins peuvent modifier

-- Vérification : Les 18 candidatures existantes ne sont maintenant accessibles qu'aux administrateurs