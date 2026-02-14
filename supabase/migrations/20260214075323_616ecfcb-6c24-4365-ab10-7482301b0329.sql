
-- Fix permissive notification insert policy
DROP POLICY "Authenticated can insert notifications" ON public.notifications;
CREATE POLICY "Faculty can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'faculty'));
