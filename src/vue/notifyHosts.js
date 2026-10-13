import { shallowReactive } from "vue";

// Share one chronological stack per document/position.
const documents = new WeakMap();
let sequence = 0;

export function acquireNotifyHost(doc, position) {
  let hosts = documents.get(doc);
  if (!hosts) documents.set(doc, hosts = new Map());
  let entry = hosts.get(position);
  if (!entry) {
    const element = doc.createElement("div");
    element.className = "ls-notify-container";
    element.dataset.position = position;
    doc.body.appendChild(element);
    hosts.set(position, entry = { element, users: 0, notifications: shallowReactive([]) });
  }
  entry.users++;
  return {
    element: entry.element,
    notifications: entry.notifications,
    release() {
      if (--entry.users === 0) {
        entry.element.remove();
        hosts.delete(position);
        if (!hosts.size) documents.delete(doc);
      }
    },
  };
}

export function registerNotify(lease, options) {
  const record = shallowReactive({ ...options, order: options.order ?? ++sequence, count: 1 });
  lease.notifications.push(record);
  const leader = notifyMembers(lease, record)[0];
  if (leader !== record) leader.restart();
  return record;
}

export function notifyMembers(lease, record) {
  if (!lease || !record) return [];
  return lease.notifications.filter((item) => item.key === record.key).sort((a, b) => a.order - b.order);
}

export function unregisterNotify(lease, record) {
  if (!lease || !record) return;
  const index = lease.notifications.indexOf(record);
  if (index !== -1) lease.notifications.splice(index, 1);
}
