import { certs } from "../content/certs";
import { jobs } from "../content/experience";
import { labs } from "../content/labs";
import { otherWork } from "../content/other-work";
import { articlesFallback } from "../content/articles";
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

// M4 merges the Medium feed into this list. Until then the static list is the source.
export function getArticles() {
  return [...articlesFallback].sort((a, b) => b.date.localeCompare(a.date));
}
