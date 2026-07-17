import { useState } from 'react'
import { Save, Shield, Bell, Percent, Globe, Database, AlertTriangle } from 'lucide-react'

export default function AdminParametres() {
  const [activeTab, setActiveTab] = useState('plateforme')
  const [saved, setSaved] = useState(false)

  const [platform, setPlatform] = useState({
    commission: '10',
    sequestre_court: '1',
    sequestre_long: '7',
    kyc_obligatoire: true,
    maintenance_mode: false,
    langue_defaut: 'fr',
  })

  const [notifs, setNotifs] = useState({
    email_admin_reservation: true,
    email_admin_paiement: true,
    sms_chauffeur: true,
    sms_client: true,
    rapport_hebdo: true,
    rapport_mensuel: true,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const TABS = [
    { key:'plateforme', icon:Globe,    label:'Plateforme' },
    { key:'commissions',icon:Percent,  label:'Commissions' },
    { key:'notifs',     icon:Bell,     label:'Notifications' },
    { key:'securite',   icon:Shield,   label:'Sécurité' },
    { key:'systeme',    icon:Database, label:'Système' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Paramètres</h1>
          <p className="text-gray-500 text-sm mt-0.5">Configuration globale de la plateforme</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl transition-all ${saved ? 'bg-green-500/15 border border-green-500/30 text-green-400' : 'btn-gold'}`}>
          <Save size={14} /> {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {TABS.map(({ key, icon:Icon, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === key ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 space-y-5">
          {activeTab === 'plateforme' && (
            <div className="card-luxe p-6">
              <h2 className="text-white font-semibold mb-5">Paramètres généraux</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-500 text-xs mb-1.5">Langue par défaut</label>
                  <select value={platform.langue_defaut} onChange={e => setPlatform({...platform, langue_defaut:e.target.value})}
                    className="bg-gray-900 border border-gray-700 focus:border-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
                {[
                  { key:'kyc_obligatoire', label:'KYC obligatoire', desc:'Tout compte doit être vérifié avant de pouvoir réserver' },
                  { key:'maintenance_mode', label:'Mode maintenance', desc:'Désactiver temporairement les nouvelles réservations', warn:true },
                ].map(({ key, label, desc, warn }) => (
                  <div key={key} className={`flex items-center justify-between py-3 border-b border-gray-800 last:border-0 ${warn && platform[key] ? 'p-3 bg-red-500/5 rounded-xl border border-red-500/20' : ''}`}>
                    <div>
                      <p className={`text-sm font-medium ${warn && platform[key] ? 'text-red-400' : 'text-white'}`}>{label}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{desc}</p>
                    </div>
                    <button onClick={() => setPlatform(p => ({ ...p, [key]: !p[key] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${platform[key] ? (warn ? 'bg-red-500' : 'bg-gold-500') : 'bg-gray-700'}`}>
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${platform[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'commissions' && (
            <div className="card-luxe p-6">
              <h2 className="text-white font-semibold mb-5">Commissions & Séquestre</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-500 text-xs mb-1.5">Taux de commission Luxe Drive (%)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" min="0" max="50" value={platform.commission}
                      onChange={e => setPlatform({...platform, commission:e.target.value})}
                      className="w-24 bg-gray-900 border border-gray-700 focus:border-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
                    <span className="text-gold-400 font-bold text-lg">%</span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1.5">Appliqué sur chaque transaction complétée. Actuellement : 10%.</p>
                </div>
                <div className="border-t border-gray-800 pt-5">
                  <h3 className="text-white text-sm font-semibold mb-3">Règles de séquestre</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 text-xs mb-1.5">Seuil "courte durée" (jours)</label>
                      <input type="number" min="1" value={platform.sequestre_court}
                        onChange={e => setPlatform({...platform, sequestre_court:e.target.value})}
                        className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
                      <p className="text-gray-600 text-xs mt-1">≤ N jours : 20% à la réservation, 80% débloqués J+1</p>
                    </div>
                    <div>
                      <label className="block text-gray-500 text-xs mb-1.5">Seuil "longue durée" (jours)</label>
                      <input type="number" min="1" value={platform.sequestre_long}
                        onChange={e => setPlatform({...platform, sequestre_long:e.target.value})}
                        className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
                      <p className="text-gray-600 text-xs mt-1">≥ N jours : 50% à la 1ère semaine, solde échelonné</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifs' && (
            <div className="card-luxe p-6">
              <h2 className="text-white font-semibold mb-5">Notifications système</h2>
              <div className="space-y-0">
                {[
                  { key:'email_admin_reservation', label:'Email admin — Nouvelle réservation', desc:'Recevoir un email à chaque réservation confirmée' },
                  { key:'email_admin_paiement',    label:'Email admin — Paiement reçu',       desc:'Alerte à chaque transaction complétée' },
                  { key:'sms_chauffeur',           label:'SMS Chauffeur — Mission assignée',  desc:'Notifier le chauffeur par SMS lors d\'une assignation' },
                  { key:'sms_client',              label:'SMS Client — Confirmation de résa', desc:'Envoyer un SMS de confirmation au client' },
                  { key:'rapport_hebdo',           label:'Rapport hebdomadaire',              desc:'Résumé envoyé chaque lundi matin' },
                  { key:'rapport_mensuel',         label:'Rapport mensuel',                   desc:'Bilan complet envoyé le 1er de chaque mois' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3.5 border-b border-gray-800 last:border-0">
                    <div>
                      <p className="text-white text-sm font-medium">{label}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{desc}</p>
                    </div>
                    <button onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${notifs[key] ? 'bg-gold-500' : 'bg-gray-700'}`}>
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${notifs[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'securite' && (
            <div className="card-luxe p-6">
              <h2 className="text-white font-semibold mb-5">Sécurité & Accès</h2>
              <div className="space-y-4">
                {[
                  { label:'Authentification à deux facteurs (admin)', active:true },
                  { label:'Session timeout après 30 min d\'inactivité', active:true },
                  { label:'Journalisation de toutes les actions admin', active:true },
                  { label:'IP whitelisting pour accès admin', active:false },
                ].map(({ label, active }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                    <p className="text-white text-sm font-medium">{label}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${active ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-gray-700/40 border-gray-600 text-gray-500'}`}>{active ? 'Actif' : 'Inactif'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'systeme' && (
            <div className="card-luxe p-6">
              <h2 className="text-white font-semibold mb-5">Informations système</h2>
              <div className="space-y-3">
                {[
                  { label:'Version application', value:'v2.4.1' },
                  { label:'Environnement', value:'Production' },
                  { label:'Backend API', value:'FastAPI 0.110 — Python 3.11' },
                  { label:'Base de données', value:'PostgreSQL 15.3' },
                  { label:'Dernière mise à jour', value:'08 Juin 2025, 14:30' },
                  { label:'Uptime', value:'99.98% (30 derniers jours)' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-800/60 last:border-0">
                    <p className="text-gray-500 text-sm">{label}</p>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-4 bg-red-500/6 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-red-400 text-xs font-semibold mb-1">Zone dangereuse</p>
                  <p className="text-gray-500 text-xs mb-3">Ces actions sont irréversibles. Contactez le support avant toute intervention.</p>
                  <button className="text-xs px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all">Vider le cache</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
