# DICOM Görüntüleyici: proje notları

Tek dosyalık tarayıcı DICOM görüntüleyici (CT/MR/X-ray/PET, MPR, ızgara, füzyon). Sahibi: Medikal Fizik Uzmanı Yemliha Enes Tüten. Yayın: GitHub Pages (depo kökü). Kullanıcı Türkçe yazar: yanıtlar Türkçe, selamlama ve övgü yok, doğrudan konuya gir, hatayı açıkça söyle, virgülü az kullan, mümkünse geçmiş zaman, madde işareti yerine konuşma düzeni.

## Derleme
Kaynak `src/` altındaki parçalardır. Çıktı depo köküne yazılır (Pages bunu yayınlar):

    python3 tools/make_site.py V.2 https://yemlihaenestuten.github.io/dicom-viewer/
    python3 tools/make_readme.py https://yemlihaenestuten.github.io/dicom-viewer/

`make_site.py` parçaları sırayla birleştirir (p1_head.html, p0_i18n.js, p2a_dicom.js, p2b_volume.js, p3a_core.js, p3b_ui.js, p3c_studies.js, p3d_update.js, p4_tail.html), sürümü `VER` sabitine yazar ve `index.html`, `DICOM_Goruntuleyici.html`, `version.json`, `sw.js`, `manifest.webmanifest`, simgeleri üretir. Kök dizindeki bu dosyalara elle dokunma, `src/` değiştirip yeniden derle.
Sürüm yayınlama: derle, commit, push. `sw.js` içindeki sürüm değiştiği için tarayıcılar yeni sürümü algılar. Programdaki Güncelle düğmesi `version.json` ile `VER` değerini karşılaştırır.

## Kurallar (kullanıcının kalıcı istekleri)
- Karşılama penceresi her açılışta görünür. "Bir daha gösterme" yok. Her sürümde yetenek listesi 6 dilde güncellenir.
- Başlık "DICOM GÖRÜNTÜLEYİCİ", altında "Medikal Fizik Uzmanı Yemliha Enes Tüten Tarafından geliştirilmiştir". Sağ altta imza ve sürüm (V.1, V.2...). Karşılamada açık kaynak, ücretsiz ve e-posta yemlihaenestutenwork@gmail.com yazar.
- Diller: Türkçe (varsayılan), English, Deutsch, 한국어, 日本語, Русский. Yeni her metin `p0_i18n.js` içindeki `EXACT_ROWS` (tam eşleşme) ya da `PHR_ROWS` (ifade kalıbı) satırlarına 6 sütunla eklenir. Kaynak metinler Türkçedir. Çeviri fonksiyonu `TX()` (DICOM etiket tablosu `T` ile karışmasın).
- İşaret yalnızca konulduğu kesitte görünür. İşaretler seri kapansa da altta listelenir.
- Dosya seçme ve klasör seçme ayrı düğmelerdir (ZIP ekle, Klasör ekle).
- Düğmelerde fare üzerine gelince açıklama (title/tooltip) çıkar. Yeni düğmeye `TIPS` listesine açıklama eklenir.
- Tek dosya (file://) güncellemesi `p3d_update.js` içindeki `fileUpdater()`: yayın adresindeki `version.json` (sürüm ve `date`) okunur, yeni sürüm varsa `DICOM_Goruntuleyici.html` indirilip `DICOM GÖRÜNTÜLEYİCİ_GG.AA.YYYY_V.n.html` adıyla kaydedilir. Otomatik kontrol yalnızca açılıştan sonraki ilk 1 dakikada yapılır (15 sn arayla), sonra yalnızca Güncelle düğmesiyle. Otomatik kontrol yeni sürüm bulursa indirmeden önce bir kez sorar (`#updAsk`). İnternet yoksa düğmenin yanında Çevrimdışısınız yazar (`setNetOff`).
- Sağ altta yayın tarihi ve sürüm yazar (`BUILD_DATE`, make_site.py doldurur).
- Yenilikler penceresi (`NEWS`, `#news`): her sürümde 6 dilde yeniden yazılır, karşılamadan önce açılır. "Bir daha gösterme" işaretlenirse `localStorage.dicomNewsHide` o sürüme eşitlenir ve o sürüm için açılmaz.
- Masaüstünde görünüm pencereye sığar (`--vh`, `fitHeights()`), mobil sınır 720 px.

## Test
Playwright (chromium) ile denendi: dil taraması (Türkçe artık metin, taşma, konsol hatası), ZIP/klasör yükleme, ızgara, füzyon, işaret, açı, seri kapatma, ilk görünüm, görüntüleri kaldırma, mobil taklit, çevrimdışı ve V.1→V.2 güncelleme. Gerçek telefonlarda ve gerçek hasta verisinde denenmedi.

## Sıradaki işler
- Yüklemeyi hızlandırma: Web Worker ile paralel okuma, ZIP için yerleşik DecompressionStream.
- Çizimde kasma varsa WebGL ile GPU çizimi (yedek yol bırakılarak).
- Lisans seçimi (MIT önerildi, kullanıcı karar verecek).
