-- KnowYourRights AI Database Schema
-- This file contains the complete database schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
    preferred_state TEXT DEFAULT 'California',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- State laws table
CREATE TABLE public.state_laws (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    state_name TEXT UNIQUE NOT NULL,
    rights_summary TEXT NOT NULL,
    script_guidance_english JSONB NOT NULL DEFAULT '{}',
    script_guidance_spanish JSONB NOT NULL DEFAULT '{}',
    common_pitfalls TEXT[] DEFAULT '{}',
    specific_laws JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incident reports table
CREATE TABLE public.incident_reports (
    report_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location JSONB,
    notes TEXT,
    recording_url TEXT,
    ipfs_hash TEXT,
    metadata_hash TEXT,
    shared_at TIMESTAMP WITH TIME ZONE,
    is_shared BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    language TEXT DEFAULT 'english' CHECK (language IN ('english', 'spanish')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    auto_location BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Legal updates table (for tracking law changes)
CREATE TABLE public.legal_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    state_name TEXT NOT NULL,
    update_type TEXT NOT NULL CHECK (update_type IN ('law_change', 'new_precedent', 'policy_update')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    effective_date DATE,
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity log
CREATE TABLE public.user_activity (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_subscription_status ON public.users(subscription_status);
CREATE INDEX idx_users_preferred_state ON public.users(preferred_state);
CREATE INDEX idx_incident_reports_user_id ON public.incident_reports(user_id);
CREATE INDEX idx_incident_reports_timestamp ON public.incident_reports(timestamp);
CREATE INDEX idx_incident_reports_shared ON public.incident_reports(is_shared);
CREATE INDEX idx_legal_updates_state ON public.legal_updates(state_name);
CREATE INDEX idx_legal_updates_date ON public.legal_updates(effective_date);
CREATE INDEX idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX idx_user_activity_type ON public.user_activity(activity_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_state_laws_updated_at BEFORE UPDATE ON public.state_laws
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incident_reports_updated_at BEFORE UPDATE ON public.incident_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Incident reports policies
CREATE POLICY "Users can view own incident reports" ON public.incident_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own incident reports" ON public.incident_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own incident reports" ON public.incident_reports
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own incident reports" ON public.incident_reports
    FOR DELETE USING (auth.uid() = user_id);

-- Shared incident reports can be viewed by anyone
CREATE POLICY "Anyone can view shared incident reports" ON public.incident_reports
    FOR SELECT USING (is_shared = TRUE);

-- User preferences policies
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- User activity policies
CREATE POLICY "Users can view own activity" ON public.user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON public.user_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- State laws and legal updates are public (read-only for users)
ALTER TABLE public.state_laws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view state laws" ON public.state_laws
    FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can view legal updates" ON public.legal_updates
    FOR SELECT USING (TRUE);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (user_id, email)
    VALUES (NEW.id, NEW.email);
    
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial state laws data
INSERT INTO public.state_laws (state_name, rights_summary, script_guidance_english, script_guidance_spanish, common_pitfalls, specific_laws) VALUES
('California', 
 'California provides strong protections for citizens during police encounters. You have the right to remain silent, refuse searches without a warrant, and record police interactions in public spaces.',
 '{
   "traffic-stop": {
     "whatToSay": ["I am exercising my right to remain silent.", "I do not consent to any searches of my vehicle.", "Am I free to leave?", "I would like to speak to an attorney."],
     "whatNotToSay": ["Don''t argue about the reason for the stop", "Don''t consent to vehicle searches", "Don''t answer questions about where you''re going", "Don''t make sudden movements"]
   },
   "home-visit": {
     "whatToSay": ["I do not consent to you entering my home.", "Do you have a warrant?", "I am exercising my right to remain silent.", "I would like to see your identification."],
     "whatNotToSay": ["Don''t open the door unless they have a warrant", "Don''t let them in ''just to talk''", "Don''t answer questions without an attorney", "Don''t consent to searches"]
   }
 }',
 '{
   "traffic-stop": {
     "whatToSay": ["Estoy ejerciendo mi derecho a permanecer en silencio.", "No consiento ningún registro de mi vehículo.", "¿Soy libre de irme?", "Me gustaría hablar con un abogado."],
     "whatNotToSay": ["No discuta sobre la razón de la parada", "No consienta a registros del vehículo", "No responda preguntas sobre a dónde va", "No haga movimientos repentinos"]
   }
 }',
 ARRAY['Consenting to searches when not required', 'Answering questions beyond providing identification', 'Not knowing you can record police interactions', 'Assuming you must answer all police questions'],
 '{
   "recording_police": "Legal in public spaces (Penal Code Section 148)",
   "vehicle_searches": "Requires warrant or probable cause",
   "home_searches": "Requires warrant except in exigent circumstances",
   "stop_and_frisk": "Requires reasonable suspicion of criminal activity"
 }'
),
('Texas',
 'Texas law provides constitutional protections during police encounters. You have the right to remain silent and refuse consent to searches, though Texas has specific laws about identification requirements.',
 '{
   "traffic-stop": {
     "whatToSay": ["I am exercising my right to remain silent.", "I do not consent to searches.", "Am I being detained or am I free to go?", "I would like to speak to an attorney."],
     "whatNotToSay": ["Don''t argue with the officer", "Don''t consent to vehicle searches", "Don''t volunteer information about your activities", "Don''t resist physically"]
   }
 }',
 '{
   "traffic-stop": {
     "whatToSay": ["Estoy ejerciendo mi derecho a permanecer en silencio.", "No consiento a registros.", "¿Estoy detenido o soy libre de irme?", "Me gustaría hablar con un abogado."]
   }
 }',
 ARRAY['Not knowing Texas identification requirements', 'Consenting to searches of vehicles', 'Answering questions beyond legal requirements', 'Not understanding detention vs. arrest'],
 '{
   "identification": "Must provide name if lawfully arrested (Penal Code 38.02)",
   "recording_police": "Generally legal in public spaces",
   "vehicle_searches": "Requires warrant, consent, or probable cause",
   "open_carry": "Legal with proper licensing"
 }'
);

-- Create function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_user_id UUID,
    p_activity_type TEXT,
    p_activity_data JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_activity (user_id, activity_type, activity_data)
    VALUES (p_user_id, p_activity_type, p_activity_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
