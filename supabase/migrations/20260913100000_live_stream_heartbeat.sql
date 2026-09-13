-- Add heartbeat and lifecycle columns to streams table
ALTER TABLE public.streams
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_heartbeat_at TIMESTAMPTZ;

-- Update existing active streams that are orphaned
UPDATE public.streams
SET status = 'ended', ended_at = NOW()
WHERE status = 'active' AND (
  last_heartbeat_at IS NULL AND created_at < NOW() - INTERVAL '4 hours'
  OR last_heartbeat_at < NOW() - INTERVAL '5 minutes'
);
