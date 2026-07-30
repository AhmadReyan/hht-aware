/**
 * doctorReport.js — PREMIUM feature. Builds a clean, clinical summary PDF a
 * patient can hand to (or email) their HHT specialist: recent nosebleed
 * episodes, hemoglobin/ferritin trend, iron adherence and emergency contacts.
 *
 * Uses the SAME jspdf + html2canvas pipeline as EmergencyCard.jsx: render an
 * off-screen styled node to a canvas, then place it into a PDF (paginated
 * across A4 pages for longer reports). Native (Capacitor) shares the file;
 * web downloads it.
 *
 * Contract: fully guarded, never throws. Returns { ok, fileName } on success
 * or { ok:false, error } on failure. PRIVACY: all health data is read from
 * the caller and rendered locally — nothing is uploaded or transmitted.
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

const GARNET = '#8E2D3B';
const DEEP = '#571826';
const TEAL = '#15756C';
const INK = '#2A181D';
const MUTED = '#7A5F63';
const LINE = '#E9DAD4';
const BG = '#FFF7F3';

const pad2 = (n) => String(n).padStart(2, '0');
const getDateString = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const escapeHtml = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const SEVERITY_LABEL = { mild: 'Mild', moderate: 'Moderate', severe: 'Severe' };

const withinDays = (dateStr, days) => {
  if (typeof dateStr !== 'string') return false;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (Math.max(1, days) - 1));
  return dateStr >= getDateString(cutoff);
};

const buildReportHtml = ({ episodes, labs, iron, emergencyData, rangeDays }) => {
  const eps = Array.isArray(episodes) ? episodes : [];
  const labList = Array.isArray(labs) ? labs : [];
  const ed = emergencyData || {};
  const ironLog = iron && typeof iron === 'object' ? iron.log || iron : {};
  const ironTarget = Number(iron?.target) || 126;

  // Episode aggregates over the range.
  const inRange = eps.filter((e) => withinDays(e.date, rangeDays));
  const count = inRange.length;
  const totalMin = inRange.reduce((s, e) => s + (Number(e.durationMin) || 0), 0);
  const avgMin = count ? Math.round(totalMin / count) : 0;
  const sev = { mild: 0, moderate: 0, severe: 0 };
  inRange.forEach((e) => {
    if (sev[e.severity] !== undefined) sev[e.severity] += 1;
  });

  // Iron this week vs target.
  let ironWeek = 0;
  for (let i = 0; i < 7; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    ironWeek += Number(ironLog[getDateString(d)]) || 0;
  }
  const ironPct = ironTarget > 0 ? Math.round((ironWeek / ironTarget) * 100) : 0;

  // Latest labs.
  const sortedLabs = [...labList].sort((a, b) => (a.date < b.date ? 1 : -1));
  const latestHb = sortedLabs.find(
    (l) => l.hemoglobin !== null && l.hemoglobin !== undefined && !Number.isNaN(Number(l.hemoglobin))
  );
  const latestFer = sortedLabs.find(
    (l) => l.ferritin !== null && l.ferritin !== undefined && !Number.isNaN(Number(l.ferritin))
  );

  const thL = `padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:${MUTED};border-bottom:2px solid ${LINE}`;
  const thR = `${thL};text-align:right`;
  const cell = `padding:8px 10px;font-size:13px;color:${INK};border-bottom:1px solid ${LINE}`;
  const cellR = `${cell};text-align:right`;
  const cardStyle = `background:#FFFFFF;border:1px solid ${LINE};border-radius:12px;padding:16px;margin-bottom:16px`;
  const statBox = `flex:1;background:${BG};border:1px solid ${LINE};border-radius:10px;padding:12px;text-align:center`;

  const epRows =
    inRange
      .slice()
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 25)
      .map(
        (e) => `
        <tr>
          <td style="${cell}">${escapeHtml(e.date)}</td>
          <td style="${cell}">${escapeHtml(SEVERITY_LABEL[e.severity] || e.severity || '—')}</td>
          <td style="${cellR}">${escapeHtml(Number(e.durationMin) || 0)} min</td>
          <td style="${cell}">${escapeHtml((Array.isArray(e.triggers) ? e.triggers : []).join(', ') || '—')}</td>
        </tr>`
      )
      .join('') ||
    `<tr><td colspan="4" style="color:${MUTED};text-align:center;padding:14px 8px">No episodes logged in this range.</td></tr>`;

  const labRows =
    sortedLabs
      .slice(0, 12)
      .map(
        (l) => `
        <tr>
          <td style="${cell}">${escapeHtml(l.date)}</td>
          <td style="${cellR}">${l.hemoglobin != null ? `${escapeHtml(l.hemoglobin)} g/dL` : '—'}</td>
          <td style="${cellR}">${l.ferritin != null ? `${escapeHtml(l.ferritin)} ng/mL` : '—'}</td>
        </tr>`
      )
      .join('') ||
    `<tr><td colspan="3" style="color:${MUTED};text-align:center;padding:14px 8px">No lab results recorded.</td></tr>`;

  return `
  <div style="width:794px;box-sizing:border-box;padding:36px;background:#FFFFFF;font-family:Arial,Helvetica,sans-serif;color:${INK}">
    <div style="border-bottom:3px solid ${GARNET};padding-bottom:14px;margin-bottom:20px">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GARNET};font-weight:700">HHT Care Summary</div>
      <div style="font-size:26px;font-weight:800;color:${DEEP}">Doctor Report</div>
      <div style="font-size:12px;color:${MUTED};margin-top:4px">
        Generated ${escapeHtml(getDateString())} &middot; Last ${escapeHtml(rangeDays)} days
        ${ed.name ? `&middot; ${escapeHtml(ed.name)}` : ''}${ed.dob ? ` (DOB ${escapeHtml(ed.dob)})` : ''}
      </div>
    </div>

    <div style="display:flex;gap:12px;margin-bottom:16px">
      <div style="${statBox}">
        <div style="font-size:24px;font-weight:800;color:${GARNET}">${count}</div>
        <div style="font-size:11px;color:${MUTED}">Nosebleeds</div>
      </div>
      <div style="${statBox}">
        <div style="font-size:24px;font-weight:800;color:${GARNET}">${avgMin}<span style="font-size:12px">m</span></div>
        <div style="font-size:11px;color:${MUTED}">Avg duration</div>
      </div>
      <div style="${statBox}">
        <div style="font-size:24px;font-weight:800;color:${TEAL}">${latestHb ? escapeHtml(latestHb.hemoglobin) : '—'}</div>
        <div style="font-size:11px;color:${MUTED}">Latest Hb (g/dL)</div>
      </div>
      <div style="${statBox}">
        <div style="font-size:24px;font-weight:800;color:${TEAL}">${latestFer ? escapeHtml(latestFer.ferritin) : '—'}</div>
        <div style="font-size:11px;color:${MUTED}">Latest ferritin</div>
      </div>
    </div>

    <div style="${cardStyle}">
      <div style="font-size:15px;font-weight:700;color:${DEEP};margin-bottom:10px">Nosebleed episodes</div>
      <div style="font-size:12px;color:${MUTED};margin-bottom:10px">
        Severity mix: <strong style="color:${INK}">${sev.mild}</strong> mild &middot;
        <strong style="color:${INK}">${sev.moderate}</strong> moderate &middot;
        <strong style="color:${INK}">${sev.severe}</strong> severe &middot;
        total ${totalMin} min bleeding logged.
      </div>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="${thL}">Date</th><th style="${thL}">Severity</th><th style="${thR}">Duration</th><th style="${thL}">Triggers</th></tr></thead>
        <tbody>${epRows}</tbody>
      </table>
    </div>

    <div style="${cardStyle}">
      <div style="font-size:15px;font-weight:700;color:${DEEP};margin-bottom:10px">Blood work trend</div>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="${thL}">Date</th><th style="${thR}">Hemoglobin</th><th style="${thR}">Ferritin</th></tr></thead>
        <tbody>${labRows}</tbody>
      </table>
    </div>

    <div style="${cardStyle}">
      <div style="font-size:15px;font-weight:700;color:${DEEP};margin-bottom:10px">Iron adherence</div>
      <div style="font-size:13px;color:${INK}">
        This week: <strong>${ironWeek} mg</strong> of a <strong>${ironTarget} mg</strong> weekly target
        (<strong style="color:${ironPct >= 80 ? TEAL : GARNET}">${ironPct}%</strong>).
      </div>
      <div style="height:10px;background:${LINE};border-radius:6px;margin-top:8px;overflow:hidden">
        <div style="height:100%;width:${Math.min(100, ironPct)}%;background:${TEAL}"></div>
      </div>
    </div>

    <div style="${cardStyle}">
      <div style="font-size:15px;font-weight:700;color:${DEEP};margin-bottom:10px">Care team &amp; emergency</div>
      <div style="font-size:13px;color:${INK};line-height:1.7">
        <div>HHT specialist: <strong>${escapeHtml(ed.specialist || '—')}</strong> ${ed.specialistPhone ? `(${escapeHtml(ed.specialistPhone)})` : ''}</div>
        <div>Emergency contact: <strong>${escapeHtml(ed.contactName || '—')}</strong> ${ed.contactPhone ? `(${escapeHtml(ed.contactPhone)})` : ''}</div>
        <div>Blood type: <strong>${escapeHtml(ed.bloodType || 'Unknown')}</strong> &middot; Drug allergies: <strong>${escapeHtml(ed.drugAllergies || 'None known')}</strong></div>
      </div>
    </div>

    <div style="margin-top:18px;padding-top:12px;border-top:1px solid ${LINE};font-size:10px;color:${MUTED};line-height:1.5">
      This self-tracked summary is generated on-device for discussion with a clinician. It is not a
      medical record and does not replace professional diagnosis or advice. HHT physician reminders:
      avoid nasal packing where possible, screen for PAVMs before procedures, avoid NSAIDs/aspirin,
      and rule out brain AVMs before anticoagulation.
    </div>
  </div>`;
};

/**
 * Build and export the Doctor Report PDF.
 * @param {{episodes:Array, labs:Array, iron:{log:object,target:number}|object, emergencyData:object, rangeDays:number}} args
 * @returns {Promise<{ok:boolean, fileName?:string, error?:string}>}
 */
export const buildDoctorReportPDF = async ({ episodes, labs, iron, emergencyData, rangeDays = 90 } = {}) => {
  let host = null;
  try {
    if (typeof document === 'undefined') return { ok: false, error: 'no-dom' };

    // Off-screen host (kept in-flow but far left so html2canvas can measure it).
    host = document.createElement('div');
    host.style.position = 'fixed';
    host.style.left = '-10000px';
    host.style.top = '0';
    host.style.width = '794px';
    host.style.background = '#FFFFFF';
    host.innerHTML = buildReportHtml({ episodes, labs, iron, emergencyData, rangeDays });
    document.body.appendChild(host);

    const target = host.firstElementChild || host;
    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FFFFFF',
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;

    // Paginate a tall capture across A4 pages.
    let heightLeft = imgH;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
    heightLeft -= pageH;
    while (heightLeft > 0) {
      position -= pageH;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
      heightLeft -= pageH;
    }

    const fileName = 'HHT-Doctor-Report.pdf';
    if (Capacitor.isNativePlatform()) {
      const pdfBase64 = pdf.output('datauristring').split(',')[1];
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: pdfBase64,
        directory: Directory.Cache
      });
      await Share.share({ title: 'HHT Doctor Report', url: savedFile.uri });
    } else {
      pdf.save(fileName);
    }
    return { ok: true, fileName };
  } catch (err) {
    console.error('Doctor report generation failed:', err);
    return { ok: false, error: err?.message || 'failed' };
  } finally {
    if (host && host.parentNode) host.parentNode.removeChild(host);
  }
};

export default { buildDoctorReportPDF };
