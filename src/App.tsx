// src/App.tsx
import React from "react"
import { computeAll } from "./core/numerology"
import { numberProfiles } from "./core/numberProfiles"

type Result = ReturnType<typeof computeAll>

const descriptions: Record<string,string> = {
  expression: "Kader Sayısı — Hayat amacını ve yönünü anlatır.",
  heart_desire: "Ruh İsteği — İç dünyandaki arzular ve kalbinin sesi.",
  personality: "Kişilik — Dışarıya yansıttığın yüzün.",
  life_path: "Yaşam Yolu — Hayatta öğrenmen gereken ana dersler.",
  birthday: "Doğum Günü Sayısı — Doğum gününün sana verdiği özel enerji.",
  maturity: "Olgunluk Sayısı — İlerleyen yaşlarda ortaya çıkan bilgelik.",
  personal_year: "Kişisel Yıl — İçinde bulunduğun yılın özel dersi.",
}

const COLORS: Record<string, string> = {
  expression: "#1f6feb",
  heart_desire: "#e11d48",
  personality: "#3b82f6",
  life_path: "#10b981",
  birthday: "#f59e0b",
  maturity: "#8b5cf6",
  personal_year: "#0ea5e9",
}

const KEYMAP: Record<string, [keyof Result, keyof Result]> = {
  expression: ["expression", "expression_compound"],
  heart_desire: ["heart_desire", "heart_desire_compound"],
  personality: ["personality", "personality_compound"],
  life_path: ["life_path", "life_path_compound"],
  birthday: ["birthday", "birthday_compound"],
  maturity: ["maturity", "maturity_compound"],
  personal_year: ["personal_year", "personal_year_compound"],
}

export default function App() {
  const [name, setName] = React.useState("Abdulkadir Sever")
  const [birthdate, setBirthdate] = React.useState("2000-07-21")
  const [keepMaster, setKeepMaster] = React.useState(true)
  const [result, setResult] = React.useState<Result>(() => computeAll(name, birthdate, keepMaster))

  const printRef = React.useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = React.useState(false)

  React.useEffect(() => {
    try {
      setResult(computeAll(name, birthdate, keepMaster))
    } catch (e) {
      console.error(e)
    }
  }, [name, birthdate, keepMaster])

  const fields = [
    {key: "expression", label: "Kader Sayısı", emoji: "✨"},
    {key: "heart_desire", label: "Ruh İsteği", emoji: "❤️"},
    {key: "personality", label: "Kişilik", emoji: "🎭"},
    {key: "life_path", label: "Yaşam Yolu", emoji: "🌍"},
    {key: "birthday", label: "Doğum Günü", emoji: "🎂"},
    {key: "maturity", label: "Olgunluk", emoji: "🔮"},
    {key: "personal_year", label: "Kişisel Yıl", emoji: "📅"},
  ] as const

  const getPair = (k: typeof fields[number]["key"]) => {
    const [reducedKey, compoundKey] = KEYMAP[k]
    const reduced = result[reducedKey] as unknown as number
    const compound = result[compoundKey] as unknown as number
    return { reduced, compound }
  }

  const pill: React.CSSProperties = {
    background: "#0f1720",
    border: "1px solid #1f2a44",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
  }

  // 📥 Çok sayfalı PDF oluştur (dinamik import)
  const handleDownloadPDF = async () => {
    if (!printRef.current) return
    try {
      setDownloading(true)

      // Dinamik import – bundle sorunlarını önler
      // @ts-ignore - runtime default export yeterli
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf")
      ])

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: "#0b0f14",
        useCORS: true,
        scrollY: -window.scrollY
      })
      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 10

      const imgWidth = pageWidth - margin * 2
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let position = margin
      let heightLeft = imgHeight

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight)
      heightLeft -= (pageHeight - margin * 2)

      while (heightLeft > 0) {
        pdf.addPage()
        position = margin - (imgHeight - heightLeft)
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight)
        heightLeft -= (pageHeight - margin * 2)
      }

      const filename = `numeroloji-raporu-${name.trim().replace(/\s+/g, "-").toLowerCase()}.pdf`
      pdf.save(filename)
    } catch (err) {
      console.error("PDF oluşturulamadı:", err)
      alert("PDF oluşturulurken bir hata oluştu.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{borderRadius: 16}} ref={printRef} id="report-area">
        <h1 className="title">Numeroloji Uygulaması</h1>

        <div className="grid">
          <div>
            <label>Ad Soyad</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label>Doğum Tarihi</label>
            <input type="text" value={birthdate} onChange={e=>setBirthdate(e.target.value)} placeholder="2000-07-21 veya 21.07.2000" />
          </div>
          <div className="row">
            <label>11/22/33 korunsun mu?</label>
            <input type="checkbox" checked={keepMaster} onChange={e=>setKeepMaster(e.target.checked)} />
          </div>
        </div>

        <div className="section-title">Sonuçlar</div>
        <div className="grid">
          {fields.map(f => {
            const { reduced, compound } = getPair(f.key)
            const color = COLORS[f.key]
            const border = `1px solid ${color}55`
            const cap = (n: number) => (n === 11 || n === 22 || n === 33 ? `${n} (MASTER)` : `${n}`)
            const profile = numberProfiles[reduced]

            return (
              <div key={f.key} className="card" style={{ background:"#0f1625", border, borderRadius: 16, pageBreakInside: "avoid" as any }}>
                <div className="row" style={{justifyContent:"space-between", alignItems:"center"}}>
                  <div style={{display:"flex", alignItems:"center", gap:10}}>
                    <span style={{fontSize:22}}>{f.emoji}</span>
                    <strong>{f.label}</strong>
                  </div>
                  <div className="row" style={{gap:8}}>
                    <span style={{...pill}} title="Bileşik">{compound}</span>
                    <span style={{...pill, background: color, border:`1px solid ${color}`, color:"#fff"}} title="İndirgenmiş">
                      {cap(reduced)}
                    </span>
                  </div>
                </div>

                <div className="muted" style={{marginTop:8}}>
                  {descriptions[f.key] ?? ""}
                </div>

                <div style={{marginTop:8}}>
                  <em>{profile?.short ?? ""}</em>
                </div>
                <div style={{marginTop:10, display:"grid", gap:6}}>
                  <div>
                    <strong>Güçlü Yönler:</strong>
                    <div className="muted">• {(profile?.strengths ?? []).join(" • ")}</div>
                  </div>
                  <div>
                    <strong>Gölge Yönler:</strong>
                    <div className="muted">• {(profile?.shadows ?? []).join(" • ")}</div>
                  </div>
                  <div>
                    <strong>Ruhsal Mesaj:</strong>
                    <div className="muted">{profile?.message ?? ""}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="section-title">Eksik Sayılar</div>
        <div className="row" style={{flexWrap:"wrap", gap:8}}>
          {result.missing_numbers_list.map(n => (
            <span key={n} style={{...pill, background:"#103a20", border:"1px solid #1f5a35", color:"#81d69b"}}>{n}</span>
          ))}
        </div>

        {result.karmic_debts.length > 0 && (
          <>
            <div className="section-title">Karmik Borçlar</div>
            <div className="row" style={{flexWrap:"wrap", gap:8}}>
              {result.karmic_debts.map(n => (
                <span key={n} style={{...pill, background:"#3f1d1d", border:"1px solid #7f1d1d", color:"#fecaca"}}>{n}</span>
              ))}
            </div>
          </>
        )}
      </div>

      <button className="btn" onClick={handleDownloadPDF} disabled={downloading} style={{marginTop:20}}>
        {downloading ? "PDF Hazırlanıyor..." : "📥 PDF İndir"}
      </button>
    </div>
  )
}
