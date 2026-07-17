import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ContactPage() {
  const [form, setForm]   = useState({ nom: '', email: '', sujet: '', message: '' })
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(212,160,23,0.08),transparent)]" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-gold-500 text-xs font-semibold uppercase tracking-[0.25em] mb-4 animate-fade-in">Nous Contacter</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 animate-fade-in-up">
            Parlons de votre<br />
            <span className="shimmer-gold">projet</span>
          </h1>
          <p className="text-gray-400 animate-fade-in-up delay-200">
            Notre équipe est disponible 24h/7j pour répondre à toutes vos questions.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 grid lg:grid-cols-5 gap-12">

        {/* Infos */}
        <div className="lg:col-span-2 space-y-6">
          {[
            { icon: MapPin, title: 'Adresses', lines: ['Yaoundé : Bastos, Rue du Sénégal', 'Douala : Akwa, Avenue de la Liberté'] },
            { icon: Phone,  title: 'Téléphone', lines: ['+237 650 000 001 (Yaoundé)', '+237 650 000 002 (Douala)'] },
            { icon: Mail,   title: 'Email', lines: ['contact@luxedrive.cm', 'support@luxedrive.cm'] },
            { icon: Clock,  title: 'Disponibilité', lines: ['Lun–Ven : 8h – 20h', 'Sam–Dim : 9h – 18h', 'Urgences : 24h/7j'] },
          ].map(({ icon: Icon, title, lines }) => (
            <div key={title} className="card-luxe p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-gold-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">{title}</p>
                {lines.map((l) => <p key={l} className="text-gray-500 text-sm">{l}</p>)}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-3 card-luxe p-8">
          {sent ? (
            <div className="text-center py-12">
              <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-white mb-2">Message envoyé !</h3>
              <p className="text-gray-500">Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Nom complet</label>
                  <input required className="input-luxe" placeholder="Jean Dupont"
                    value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Email</label>
                  <input required type="email" className="input-luxe" placeholder="jean@exemple.cm"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Sujet</label>
                <select className="input-luxe"
                  value={form.sujet} onChange={(e) => setForm({ ...form, sujet: e.target.value })}>
                  <option value="">Choisir un sujet…</option>
                  <option>Demande de location</option>
                  <option>Location avec chauffeur</option>
                  <option>Devenir partenaire</option>
                  <option>Support technique</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Message</label>
                <textarea required rows={5} className="input-luxe resize-none" placeholder="Décrivez votre besoin…"
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2 py-3.5">
                {loading ? 'Envoi en cours…' : <><Send size={16} /> Envoyer le message</>}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
