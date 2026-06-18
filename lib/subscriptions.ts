import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');

interface Subscription {
  email: string;
  subscribedAt: string;
}

export function saveSubscription(email: string) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let subscriptions: Subscription[] = [];
  if (fs.existsSync(SUBSCRIPTIONS_FILE)) {
    const content = fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8');
    subscriptions = JSON.parse(content);
  }

  subscriptions.push({
    email,
    subscribedAt: new Date().toISOString(),
  });

  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));
}
