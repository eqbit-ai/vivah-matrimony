'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { adminApi } from '@/lib/api';
import { User } from '@/types';
import { formatDate, formatHeight, getInitials } from '@/lib/utils';

export default function PrintProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    adminApi
      .getUser(id)
      .then((res) => setUser(res.data || res))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!loading && user) {
      const t = setTimeout(() => window.print(), 400);
      return () => clearTimeout(t);
    }
  }, [loading, user]);

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Loading profile…</div>;
  }
  if (!user) {
    return <div className="p-12 text-center text-gray-500">Profile not found.</div>;
  }

  const p = user.profile;
  const fullName = p ? `${p.firstName || ''} ${p.lastName || ''}`.trim() : user.email;

  return (
    <div className="profile-print">
      <style jsx global>{`
        @page {
          size: A4;
          margin: 12mm;
        }
        @media print {
          html, body {
            background: #fff !important;
            color: #111 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { display: none !important; }
        }
        .profile-print {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #111;
          background: #fff;
          max-width: 800px;
          margin: 0 auto;
          padding: 24px;
        }
        .profile-print h1 { font-size: 24px; font-weight: 700; margin: 0; }
        .profile-print h2 {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #7a1f3d;
          border-bottom: 1px solid #e5e0d8;
          padding-bottom: 4px;
          margin: 14px 0 8px;
        }
        .pp-header { display: flex; gap: 20px; align-items: center; border-bottom: 2px solid #7a1f3d; padding-bottom: 16px; margin-bottom: 14px; }
        .pp-photo { width: 110px; height: 110px; border-radius: 8px; object-fit: cover; flex-shrink: 0; border: 1px solid #e5e0d8; }
        .pp-photo-fallback {
          width: 110px; height: 110px; border-radius: 8px; flex-shrink: 0;
          background: linear-gradient(135deg, #7a1f3d, #b8860b);
          color: #fff; display: flex; align-items: center; justify-content: center;
          font-size: 36px; font-weight: 700;
        }
        .pp-id { font-size: 11px; color: #888; font-family: monospace; margin-top: 4px; }
        .pp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
        .pp-row { display: grid; grid-template-columns: 130px 1fr; gap: 8px; padding: 4px 0; font-size: 12px; border-bottom: 1px dotted #f0ece4; }
        .pp-row .lbl { color: #777; font-weight: 500; }
        .pp-row .val { color: #111; }
        .pp-bio { font-size: 12px; line-height: 1.55; color: #333; }
        .pp-footer { margin-top: 18px; padding-top: 10px; border-top: 1px solid #e5e0d8; font-size: 10px; color: #888; text-align: center; }
        .pp-toolbar { position: sticky; top: 0; background: #fff; padding: 10px 0; display: flex; gap: 8px; justify-content: flex-end; }
        .pp-btn { padding: 6px 14px; font-size: 13px; border-radius: 6px; cursor: pointer; border: 1px solid #ccc; background: #fff; }
        .pp-btn.primary { background: #7a1f3d; color: #fff; border-color: #7a1f3d; }
      `}</style>

      <div className="pp-toolbar no-print">
        <button className="pp-btn" onClick={() => window.close()}>Close</button>
        <button className="pp-btn primary" onClick={() => window.print()}>Print / Save as PDF</button>
      </div>

      <div className="pp-header">
        {p?.profilePicture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.profilePicture} alt={fullName} className="pp-photo" />
        ) : (
          <div className="pp-photo-fallback">
            {p ? getInitials(p.firstName, p.lastName) : user.email[0]?.toUpperCase() || '?'}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1>{fullName || '—'}</h1>
          <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
            {[p?.age ? `${p.age} yrs` : null, p?.religion, p?.caste].filter(Boolean).join(' · ')}
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
            {user.email}{p?.phone ? `  ·  ${p.phone}` : ''}
          </div>
          <div className="pp-id">ID: {user.id}</div>
        </div>
      </div>

      {p && (
        <>
          <h2>Personal</h2>
          <div className="pp-grid">
            <Row label="Gender" value={p.gender} />
            <Row label="Date of birth" value={p.dateOfBirth ? formatDate(p.dateOfBirth) : '—'} />
            <Row label="Marital status" value={p.maritalStatus} />
            <Row label="Religion" value={p.religion} />
            <Row label="Caste" value={p.caste || '—'} />
            <Row label="Sub-caste" value={p.subCaste || '—'} />
            <Row label="Mother tongue" value={p.motherTongue || '—'} />
            <Row label="Height" value={p.height ? formatHeight(p.height) : '—'} />
          </div>

          <h2>Location</h2>
          <div className="pp-grid">
            <Row label="City" value={p.city || '—'} />
            <Row label="State" value={p.state || '—'} />
            <Row label="Country" value={p.country || '—'} />
            <Row label="Pincode" value={p.pincode || '—'} />
          </div>

          <h2>Career & Education</h2>
          <div className="pp-grid">
            <Row label="Education" value={p.education || '—'} />
            <Row label="Detail" value={p.educationDetail || '—'} />
            <Row label="Profession" value={p.profession || '—'} />
            <Row label="Employer" value={p.employer || '—'} />
            <Row label="Annual income" value={p.annualIncome || '—'} />
            <Row label="Working city" value={p.workingCity || '—'} />
          </div>

          <h2>Family</h2>
          <div className="pp-grid">
            <Row label="Father" value={p.fatherName || '—'} />
            <Row label="Father's occupation" value={p.fatherOccupation || '—'} />
            <Row label="Mother" value={p.motherName || '—'} />
            <Row label="Mother's occupation" value={p.motherOccupation || '—'} />
            <Row label="Siblings" value={p.siblings != null ? String(p.siblings) : '—'} />
            <Row label="Family type" value={p.familyType || '—'} />
          </div>

          {(p.diet || p.smoking || p.drinking) && (
            <>
              <h2>Lifestyle</h2>
              <div className="pp-grid">
                <Row label="Diet" value={p.diet || '—'} />
                <Row label="Smoking" value={p.smoking || '—'} />
                <Row label="Drinking" value={p.drinking || '—'} />
              </div>
            </>
          )}

          {p.bio && (
            <>
              <h2>About</h2>
              <p className="pp-bio">{p.bio}</p>
            </>
          )}
        </>
      )}

      <div className="pp-footer">
        JMD Shaadi · Profile generated on {formatDate(new Date())} · Confidential
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="pp-row">
      <span className="lbl">{label}</span>
      <span className="val">{value}</span>
    </div>
  );
}
