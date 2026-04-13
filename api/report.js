module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { messageContent, messageRole, teacherId, timestamp } = req.body || {};

  console.log('[Report]', JSON.stringify({
    messageContent: String(messageContent || '').slice(0, 500),
    messageRole,
    teacherId,
    timestamp: timestamp || new Date().toISOString(),
  }));

  res.status(200).json({ ok: true });
};
