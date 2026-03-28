// Helper to log admin actions from client-side admin pages
// Usage: await logAdminAction('UPDATE', 'order', orderId, { status: 'shipped' })
export async function logAdminAction(
  action: string,
  resourceType: string,
  resourceId?: string | number,
  details?: Record<string, unknown>
) {
  try {
    await fetch('/api/admin/audit-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        resource_type: resourceType,
        resource_id: resourceId?.toString(),
        details,
      }),
    })
  } catch {
    // Audit log failure should never block the main action
    console.error('Failed to write audit log')
  }
}
