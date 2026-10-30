import { certs } from "../content/certs";
import { jobs } from "../content/experience";
import { labs } from "../content/labs";
import { otherWork } from "../content/other-work";
import { articlesFallback } from "../content/articles";
import { fetchFeed, mergeArticles } from "./medium";
import { visible } from "./visibility";

export function getJobs() {
  return visible(jobs);
}

export function getLabs() {
  return visible(labs);
}

export function getOtherWork() {
  return visible(otherWork);
}

// Build rule: a cert past its expiry date is hidden.
export function getCerts(today = new Date().toISOString().slice(0, 10)) {
  return certs.filter((cert) => !cert.expires || cert.expires >= today);
}

// The static list plus any newer post from the Medium feed (lib/medium.ts). No total count is shown:
// the feed holds only the latest 10 posts.
export async function getArticles() {
  return mergeArticles(await fetchFeed(), articlesFallback);
}
