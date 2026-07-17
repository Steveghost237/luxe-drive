import { useState } from 'react'
import { Save, User, Bell, Shield, CreditCard, Building2, Eye, EyeOff } from 'lucide-react'
import useAuthStore from '../../store/authStore'

export default function FleetSettings() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profil')
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    prenom: user?.prenom || 'Jean-Pierre',
    nom: user?.nom || 'Nkomo',
    email: user?.email || 'jp.nkomo@example.cm',
    tel: '+237 699 123 456',
    ville: 'Yaoundé',
    adresse: 'Quartier Bastos, Yaoundé',
  })

  const [notifPrefs, setNotifPrefs] = useState({
    versements: true,
    reservations: true,
    maintenance: true,
    alertes_gps: true,
    newsletters: false,
    rapports_mensuels: true,
  })

  const [bankInfo, setBankInfo] = useState({
    banque: 'Afriland First Bank',
    rib: 'CM21 10001 00000 12345678901 01',
    iban: '',
    titulaire: 'Jean-Pierre Nkomo',
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const TABS = [
    { key:'profil',      icon:User,       label:'Profil' },
    { key:'notifs',      icon:Bell,       label:'Notifications' },
    { key:'paiement',    icon:CreditCard, label:'Paiement' },
    { key:'securite',    icon:Shield,     label:'Sécurité' },
    { key:'entreprise',  icon:Building2,  label:'Entreprise' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Paramètres</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gérez votre compte et vos préférences</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl transition-all ${saved ? 'bg-green-500/15 border border-green-500/30 text-green-400' : 'btn-gold'}`}>
          <Save size={14} /> {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
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

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profil' && (
            <div className="card-luxe p-6">
              <h2 className="text-white font-semibold mb-5">Informations personnelles</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label:'Prénom', key:'prenom' }, { label:'Nom', key:'nom' },
                  { label:'Email', key:'email' },   { label:'Téléphone', key:'tel' },
                  { label:'Ville', key:'ville' },   { label:'Adresse', key:'adresse' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-gray-500 text-xs mb-1.5">{label}</label>
                    <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors" />
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-gray-800">
                <label className="block text-gray-500 text-xs mb-2">Photo de profil</label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black font-bold text-xl">
                    {form.prenom[0]}{form.nom[0]}
                  </div>
                  <button className="text-xs px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-xl transition-all">
                    Changer la photo
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifs' && (
            <div className="card-luxe p-6">
              <h2 className="text-white font-semibold mb-5">Préférences de notifications</h2>
              <div className="space-y-4">
                {[
                  { key:'versements',        label:'Versements et paiements',   desc:'Recevoir une alerte à chaque versement' },
                  { key:'reservations',      label:'Nouvelles réservations',    desc:'Alertes de réservation et annulation' },
                  { key:'maintenance',       label:'Alertes maintenance',       desc:'Rappels et fin d\'intervention' },
                  { key:'alertes_gps',       label:'Alertes GPS',               desc:'Coupure moteur, zone interdite, batterie' },
                  { key:'rapports_mensuels', label:'Rapports mensuels',         desc:'Résumé financier mensuel par email' },
                  { key:'newsletters',       label:'Newsletters Luxe Drive',    desc:'Actualités et offres partenaires' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                    <div>
                      <p className="text-white text-sm font-medium">{label}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{desc}</p>
                    </div>
                    <button onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${notifPrefs[key] ? 'bg-gold-500' : 'bg-gray-700'}`}>
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${notifPrefs[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'paiement' && (
            <div className="card-luxe p-6">
              <h2 className="text-white font-semibold mb-5">Coordonnées bancaires</h2>
              <div className="p-4 bg-blue-500/8 border border-blue-500/20 rounded-xl mb-5 text-xs text-blue-300 flex gap-2">
                <Shield size={13} className="text-blue-400 mt-0.5 shrink-0" />
                Ces informations sont utilisées pour vos versements Luxe Drive. Elles sont chiffrées et sécurisées.
              </div>
              <div className="space-y-4">
                {[
                  { label:'Banque', key:'banque' }, { label:'Titulaire du compte', key:'titulaire' },
                  { label:'RIB / Numéro de compte', key:'rib' }, { label:'IBAN (optionnel)', key:'iban' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-gray-500 text-xs mb-1.5">{label}</label>
                    <input value={bankInfo[key]} onChange={e => setBankInfo({ ...bankInfo, [key]: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none font-mono transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'securite' && (
            <div className="card-luxe p-6">
              <h2 className="text-white font-semibold mb-5">Sécurité du compte</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-500 text-xs mb-1.5">Mot de passe actuel</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                      className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none pr-10 transition-colors" />
                    <button onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1.5">Nouveau mot de passe</label>
                  <input type="password" placeholder="••••••••"
                    className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1.5">Confirmer le mot de passe</label>
                  <input type="password" placeholder="••••••••"
                    className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors" />
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-gray-800">
                <h3 className="text-white text-sm font-semibold mb-3">Double authentification (2FA)</h3>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-xs">Sécuriser votre compte avec un code SMS à chaque connexion</p>
                  <button className="text-xs px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/20 transition-all">Activer</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'entreprise' && (
            <div className="card-luxe p-6">
              <h2 className="text-white font-semibold mb-5">Informations entreprise</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label:'Raison sociale', v:'Nkomo Auto Prestige SARL' },
                  { label:'RCCM', v:'RC/YAO/2021/B/4521' },
                  { label:'NIU', v:'P012345678U' },
                  { label:'Nombre de véhicules', v:'5 véhicules' },
                ].map(({ label, v }) => (
                  <div key={label}>
                    <label className="block text-gray-500 text-xs mb-1.5">{label}</label>
                    <input defaultValue={v} className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors" />
                  </div>
                ))}
              </div>
              <div className="mt-5 p-4 bg-gold-500/6 border border-gold-500/20 rounded-xl">
                <p className="text-gold-400 text-xs font-semibold mb-1">Statut : Partenaire Officiel</p>
                <p className="text-gray-500 text-xs">Vous bénéficiez d'un compte manager dédié et d'un tableau de bord avancé.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
