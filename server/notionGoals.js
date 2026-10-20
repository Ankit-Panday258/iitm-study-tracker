import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const configPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '.notion-goals-db.json');
let databaseId = process.env.NOTION_GOALS_DATABASE_ID || '';
let dataSourceId = '';
if (!databaseId) {
  try { databaseId = JSON.parse(fs.readFileSync(configPath, 'utf8')).databaseId || ''; } catch {}
}

const notionHeaders = () => ({
  Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2025-09-03',
  'Content-Type': 'application/json'
});

async function notionRequest(endpoint, options = {}) {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    ...options,
    headers: { ...notionHeaders(), ...(options.headers || {}) },
    signal: AbortSignal.timeout(15000)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = response.status === 401 ? 'Notion rejected the integration token.'
      : response.status === 403 ? 'Share the Notion parent page or database with the integration and allow page editing.'
        : response.status === 404 ? 'Notion could not find the parent page or goals database.'
          : `Notion request failed (${response.status}).`;
    throw new Error(message);
  }
  return data;
}

export function getNotionStatus() {
  return {
    tokenConfigured: Boolean(process.env.NOTION_TOKEN),
    parentConfigured: Boolean(process.env.NOTION_PARENT_PAGE_ID),
    databaseConfigured: Boolean(databaseId),
    ready: Boolean(process.env.NOTION_TOKEN && databaseId)
  };
}

async function resolveDataSourceId() {
  if (dataSourceId) return dataSourceId;
  if (!databaseId) throw new Error('Notion goals database is not set up yet.');
  const database = await notionRequest(`/databases/${databaseId}`);
  dataSourceId = database.data_sources?.[0]?.id || '';
  if (!dataSourceId) throw new Error('The Notion database has no accessible data source. Share it with the integration.');
  return dataSourceId;
}

export async function createGoalsDatabase() {
  if (!process.env.NOTION_TOKEN) throw new Error('Set NOTION_TOKEN on the app server first.');
  if (!databaseId) {
    if (!process.env.NOTION_PARENT_PAGE_ID) throw new Error('Set NOTION_PARENT_PAGE_ID to a Notion page shared with the integration.');
    const created = await notionRequest('/databases', {
      method: 'POST',
      body: JSON.stringify({
        parent: { type: 'page_id', page_id: process.env.NOTION_PARENT_PAGE_ID },
        title: [{ text: { content: 'Study Goals' } }],
        initial_data_source: { properties: {
          Name: { title: {} },
          Status: { select: { options: [{ name: 'In progress', color: 'blue' }, { name: 'Done', color: 'green' }] } },
          'Goal ID': { rich_text: {} },
          Points: { number: { format: 'number' } },
          Owner: { rich_text: {} }
        } }
      })
    });
    databaseId = created.id;
    dataSourceId = created.data_sources?.[0]?.id || '';
    try { fs.writeFileSync(configPath, JSON.stringify({ databaseId }), { mode: 0o600 }); } catch {}
  }
  const database = await notionRequest(`/databases/${databaseId}`);
  dataSourceId = database.data_sources?.[0]?.id || dataSourceId;
  if (!dataSourceId) throw new Error('Notion created the database but did not return a data source ID.');
  return { id: database.id, url: database.url || `https://www.notion.so/${database.id.replace(/-/g, '')}` };
}

export async function upsertGoalInNotion({ id, title, completed, ownerEmail, archived = false }) {
  if (!process.env.NOTION_TOKEN || !databaseId) throw new Error('Notion goals database is not set up yet.');
  const sourceId = await resolveDataSourceId();
  const query = await notionRequest(`/data_sources/${sourceId}/query`, {
    method: 'POST',
    body: JSON.stringify({ filter: { property: 'Goal ID', rich_text: { equals: String(id) } }, page_size: 1 })
  });
  const existing = query.results?.[0];
  if (archived && existing) {
    await notionRequest(`/pages/${existing.id}`, { method: 'PATCH', body: JSON.stringify({ archived: true }) });
    return;
  }
  const properties = {
    Name: { title: [{ text: { content: String(title).slice(0, 160) } }] },
    Status: { select: { name: completed ? 'Done' : 'In progress' } },
    'Goal ID': { rich_text: [{ text: { content: String(id).slice(0, 100) } }] },
    Points: { number: completed ? 10 : 0 },
    Owner: { rich_text: [{ text: { content: String(ownerEmail).slice(0, 255) } }] }
  };
  if (existing) await notionRequest(`/pages/${existing.id}`, { method: 'PATCH', body: JSON.stringify({ properties }) });
  else await notionRequest('/pages', { method: 'POST', body: JSON.stringify({ parent: { type: 'data_source_id', data_source_id: sourceId }, properties }) });
}

