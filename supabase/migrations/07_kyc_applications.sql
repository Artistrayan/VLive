CREATE TABLE IF NOT EXISTS public.kyc_applications (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    username TEXT,
    national_id TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pending',
    video_demo_url TEXT,
    doc_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.kyc_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own KYC" ON public.kyc_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own KYC" ON public.kyc_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all KYC" ON public.kyc_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can update KYC" ON public.kyc_applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
