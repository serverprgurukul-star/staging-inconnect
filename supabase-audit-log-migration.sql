-- Migration: Add admin audit log table
-- Run this in the Supabase SQL editor

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,           -- e.g. CREATE, UPDATE, DELETE
  resource_type TEXT NOT NULL,    -- e.g. order, product, coupon, customer
  resource_id TEXT,               -- the ID of the affected record
  details JSONB,                  -- before/after values or extra context
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for fast queries by admin or resource
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON admin_audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON admin_audit_logs(created_at DESC);

-- RLS: only admins can insert or read audit logs
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can insert audit logs"
  ON admin_audit_logs FOR INSERT
  WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Admins can read audit logs"
  ON admin_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Audit logs must never be updated or deleted
-- (no UPDATE/DELETE policies intentionally)
