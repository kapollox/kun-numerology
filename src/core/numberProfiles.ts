// src/core/numberProfiles.ts
export type NumberProfile = {
  short: string;          // Kısa anlam (kartta zaten gösterdiğimiz)
  strengths: string[];    // Güçlü yönler
  shadows: string[];      // Gölge yönler
  message: string;        // Ruhsal mesaj / öneri
};

export const numberProfiles: Record<number, NumberProfile> = {
  1: {
    short: "Bağımsızlık, liderlik, başlangıç enerjisi.",
    strengths: ["Öncü", "Kararlı", "Hedef odaklı"],
    shadows: ["Bencilleşme", "Acelecilik", "Diktacı tavır"],
    message: "Liderliğini hizmete dönüştür; benliği, bizliğe bağla.",
  },
  2: {
    short: "Uyum, iş birliği, denge.",
    strengths: ["Diplomatik", "Duyarlı", "Sabırlı"],
    shadows: ["Aşırı alınganlık", "Kararsızlık", "Bağımlılık"],
    message: "Sınırlarını koruyarak şefkatini paylaş.",
  },
  3: {
    short: "Yaratıcılık, iletişim, sanat.",
    strengths: ["İfade gücü", "Neşe", "İlham"],
    shadows: ["Dağınıklık", "Yüzeysellik", "Aşırı eleştiri"],
    message: "Yaratıcılığını disiplinle birleştir.",
  },
  4: {
    short: "Düzen, disiplin, sorumluluk.",
    strengths: ["Planlı", "Çalışkan", "Güvenilir"],
    shadows: ["Katılık", "Esneksizlik", "Aşırı kontrol"],
    message: "Yapı kurarken esnekliği unutma.",
  },
  5: {
    short: "Özgürlük, değişim, macera.",
    strengths: ["Uyumlanma", "Cesaret", "Merak"],
    shadows: ["Sabırsızlık", "Dağınıklık", "Risk bağımlılığı"],
    message: "Özgürlüğünü amaçla hizala; kaosu ritme dönüştür.",
  },
  6: {
    short: "Sevgi, aile, sorumluluk.",
    strengths: ["Şefkat", "Koruyuculuk", "Estetik duyu"],
    shadows: ["Aşırı fedakârlık", "Mükemmeliyetçilik", "Yargılama"],
    message: "Sevgi verirken kendini de kapsa.",
  },
  7: {
    short: "Derin düşünce, ruhsallık, analiz.",
    strengths: ["Araştırmacı", "Sezgisel", "Derinlikli"],
    shadows: ["İçe kapanma", "Şüphecilik", "Kopukluk"],
    message: "Bilgiyi deneyime, sezgiyi hizmete çevir.",
  },
  8: {
    short: "Güç, başarı, yönetim.",
    strengths: ["Vizyon", "Organizasyon", "Maddi/etik denge"],
    shadows: ["Kontrol hırsı", "Maddeye aşırı odak", "Sertlik"],
    message: "Gücü adalet ve hizmetle dengele.",
  },
  9: {
    short: "Hizmet, şefkat, insanlık sevgisi.",
    strengths: ["Empati", "Sanatsal ifade", "Evrensellik"],
    shadows: ["Kurban rolü", "Aşırı romantizm", "Bitirememek"],
    message: "Bırakmayı öğren; kalbinle hizmet et.",
  },
  11: {
    short: "Sezgi, ilham, ruhsal öğretmen (MASTER).",
    strengths: ["Vizyoner sezgi", "İlham vericilik", "Işık taşıyıcı"],
    shadows: ["Aşırı hassasiyet", "Kaygı", "Dağılma"],
    message: "İlhamını topraklayacak günlük ritüeller oluştur.",
  },
  22: {
    short: "Büyük inşa, vizyon, idealist lider (MASTER).",
    strengths: ["Usta inşa", "Strateji", "Toplumsal etki"],
    shadows: ["Aşırı yük alma", "Tükenme", "Mükemmelcilik"],
    message: "Büyük vizyonu küçük adımlarla somutlaştır.",
  },
  33: {
    short: "Koşulsuz sevgi, şifacı, hizmetkâr öğretmen (MASTER).",
    strengths: ["Şefkat gücü", "Şifa", "Eğitici ifade"],
    shadows: ["Aşırı yüklenme", "Kendini unutma", "Duygusal dalgalanma"],
    message: "Önce kendini şifalandır; sonra dünyayı.",
  },
};
