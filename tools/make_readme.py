# -*- coding: utf-8 -*-
import sys
url=sys.argv[1] if len(sys.argv)>1 else ''
link=url if url else 'https://KULLANICI.github.io/dicom-viewer/'
mail='yemlihaenestutenwork@gmail.com'
L={}
L['tr']=('Türkçe','''# DICOM Görüntüleyici (V.3)

Tomografi (BT), MR, röntgen ve PET görüntülerini tarayıcıda açan tek dosyalık ücretsiz DICOM görüntüleyici. Kurulum gerekmez. Görüntüler hiçbir yere yüklenmez, cihazda kalır. Tanı amaçlı değildir, yalnızca inceleme içindir.

**Çalıştığı yerler:** Windows, Mac, iPhone, iPad ve Android. Chrome, Safari, Edge ve Firefox.

## Nasıl açılır
- Web adresi: {link}
- Ya da `DICOM_Goruntuleyici.html` dosyasını indirip tarayıcıyla açın. iPhone ve iPad'de dosyayı Dosyalar uygulamasında açmayın, Safari ile açın.

## Nasıl kullanılır
1. **ZIP ekle** ile DICOM dosyalarını ya da tek bir ZIP'i seçin. **Klasör ekle** ile klasörün tamamını yükleyin. İstediğiniz kadar ekleyebilirsiniz.
2. Seriler küçük resimle listelenir. **Düzen** listesinden 1×1'den 6×6'ya kadar ızgara seçin. Serileri sürükleyip kutulara bırakın.
3. Kesitler arasında fare tekerleğiyle ya da parmakla gezin. Bir kutuya çift tıklayınca seri 3 kesitte açılır.
4. Yeni hastaya geçmek için **Görüntüleri kaldır** düğmesine basın.

## Özellikler
- Aksiyel, koronal ve sagittal 3 kesit aynı anda
- Seri paneli, ızgara görünümü, lokalizer çizgisi, kesit eşleme
- Yakınlaştırma, kaydırma, pencere seviyesi ve genişliği (hazır BT, MR, PET ayarları)
- Cetvel ile mm cinsinden ölçüm
- İşaret koyma. Tüm işaretler görüntü adıyla altta listelenir. Seri kapansa da işaretler kalır
- PET/BT füzyonu ve elle hizalama
- **Açı** düğmesi: görüntü kenarında 0-360° skala. Varian (180° altta) ve Elekta (0° altta)
- **İlk görünüm** düğmesi, düğme açıklamaları
- Türkçe, English, Deutsch, 한국어, 日本語, Русский arayüz

## Çevrimdışı çalışma ve güncelleme
Web adresi bir kez internetle açıldıktan sonra program internetsiz de çalışır. Sayfanın altındaki **Güncelle** düğmesi yeni sürüm olup olmadığına bakar. Varsa indirir. Güncellemeden önce yüklü görüntülerin kapanacağı sorulur. Güncellemeden sonra program yine çevrimdışı çalışır. `DICOM_Goruntuleyici.html` dosyası tek başına açıldığında **Güncelle** düğmesi yeni sürümü indirip `DICOM GÖRÜNTÜLEYİCİ_tarih_sürüm.html` adıyla kaydeder. Program açıldıktan sonraki ilk 1 dakika içinde yeni sürüme kendisi de bakar ve bulursa indirmeden önce sorar. Sonra yalnızca düğmeyle kontrol edilir. İnternet yoksa düğmenin yanında **Çevrimdışısınız** yazar. Her güncellemeden sonra **Yenilikler** penceresi açılır, **Bir daha gösterme** işaretlenirse o sürüm için bir daha açılmaz. Telefonda ana ekrana eklemek için iPhone/iPad'de Safari'de **Paylaş > Ana Ekrana Ekle**, Android'de Chrome'da **⋮ > Ana ekrana ekle** seçeneğini kullanın.

## Geri bildirim
Eksik gördüğünüz bir özellik ya da hata için: {mail}

Geliştiren: Medikal Fizik Uzmanı Yemliha Enes Tüten''')
L['en']=('English','''# DICOM Viewer (V.3)

A free single-file DICOM viewer that opens CT, MR, X-ray and PET images in the browser. No installation needed. Images are never uploaded and stay on your device. For review only, not for diagnosis.

**Works on:** Windows, Mac, iPhone, iPad and Android. Chrome, Safari, Edge and Firefox.

## How to open
- Web address: {link}
- Or download `DICOM_Goruntuleyici.html` and open it with a browser. On iPhone and iPad do not open the file in the Files app preview. Open it with Safari.

## How to use
1. Use **Add ZIP** to choose DICOM files or a single ZIP. Use **Add folder** to load a whole folder. Add as many as you like.
2. Series are listed with thumbnails. Choose a grid from 1×1 to 6×6 in the **Layout** list. Drag series into the cells.
3. Scroll through slices with the mouse wheel or your finger. Double-clicking a cell opens that series in 3 planes.
4. Press **Remove images** to move on to a new patient.

## Features
- Axial, coronal and sagittal planes at once
- Series panel, grid view, localizer line, slice sync
- Zoom, pan, window level and width (ready-made CT, MR, PET presets)
- Ruler for measuring in mm
- Markers. All markers are listed at the bottom with the image name. They stay when a series is closed
- PET/CT fusion with manual alignment
- **Angle** button: a 0-360° scale around the image edges. Varian (180° at the bottom) and Elekta (0° at the bottom)
- **Initial view** button and hover tooltips
- Interface in Türkçe, English, Deutsch, 한국어, 日本語, Русский

## Offline use and updates
After the web address has been opened once with internet, the program also works without internet. The **Update** button at the bottom of the page checks for a new version and downloads it. It warns that loaded images will be closed. After the update the program works offline again. When `DICOM_Goruntuleyici.html` is opened as a single file, the **Update** button downloads the new version and saves it as `DICOM GÖRÜNTÜLEYİCİ_date_version.html`. During the first minute after opening the program also checks by itself and asks before downloading; after that only the button checks. Without internet, **Offline** appears next to the button. After every update a **What's new** window opens; tick **Don't show again** to hide it for that version. To add it to the home screen use **Share > Add to Home Screen** in Safari on iPhone/iPad or **⋮ > Add to Home screen** in Chrome on Android.

## Feedback
Missing a feature or found a bug? {mail}

Developed by Yemliha Enes Tüten, Medical Physics Expert''')
L['de']=('Deutsch','''# DICOM-Betrachter (V.3)

Ein kostenloser Ein-Datei-DICOM-Betrachter, der CT-, MR-, Röntgen- und PET-Bilder im Browser öffnet. Keine Installation nötig. Bilder werden nicht hochgeladen und bleiben auf Ihrem Gerät. Nur zur Ansicht, nicht zur Diagnose.

**Läuft auf:** Windows, Mac, iPhone, iPad und Android. Chrome, Safari, Edge und Firefox.

## So öffnen Sie es
- Webadresse: {link}
- Oder laden Sie `DICOM_Goruntuleyici.html` herunter und öffnen Sie die Datei im Browser. Auf iPhone und iPad die Datei nicht in der Vorschau der Dateien-App öffnen, sondern mit Safari.

## Anleitung
1. Mit **ZIP hinzufügen** wählen Sie DICOM-Dateien oder eine einzelne ZIP. Mit **Ordner hinzufügen** laden Sie einen ganzen Ordner. Sie können beliebig viel hinzufügen.
2. Die Serien erscheinen mit Vorschaubildern. Wählen Sie in der Liste **Layout** ein Raster von 1×1 bis 6×6. Ziehen Sie Serien in die Felder.
3. Blättern Sie mit dem Mausrad oder dem Finger durch die Schichten. Ein Doppelklick auf ein Feld öffnet die Serie in 3 Ebenen.
4. Mit **Bilder entfernen** wechseln Sie zu einem neuen Patienten.

## Funktionen
- Axiale, koronale und sagittale Ebene gleichzeitig
- Serienpanel, Rasteransicht, Localizer-Linie, Schichtsynchronisation
- Zoom, Verschieben, Fensterlage und -breite (fertige CT-, MR-, PET-Voreinstellungen)
- Lineal zum Messen in mm
- Markierungen. Alle Markierungen stehen mit dem Bildnamen unten und bleiben beim Schließen einer Serie erhalten
- PET/CT-Fusion mit manueller Ausrichtung
- Schaltfläche **Winkel**: Skala von 0 bis 360° am Bildrand. Varian (180° unten) und Elekta (0° unten)
- Schaltfläche **Ausgangsansicht** und Hinweise beim Überfahren mit der Maus
- Oberfläche in Türkçe, English, Deutsch, 한국어, 日本語, Русский

## Offline-Nutzung und Updates
Nachdem die Webadresse einmal mit Internet geöffnet wurde, läuft das Programm auch ohne Internet. Die Schaltfläche **Aktualisieren** unten auf der Seite prüft, ob es eine neue Version gibt, und lädt sie herunter. Sie warnt, dass geladene Bilder geschlossen werden. Nach dem Update läuft das Programm wieder offline. Wird `DICOM_Goruntuleyici.html` als einzelne Datei geöffnet, lädt **Aktualisieren** die neue Version herunter und speichert sie als `DICOM GÖRÜNTÜLEYİCİ_Datum_Version.html`. In der ersten Minute nach dem Öffnen prüft das Programm auch selbst und fragt vor dem Herunterladen, danach nur noch über die Schaltfläche. Ohne Internet steht neben der Schaltfläche **Offline**. Nach jedem Update öffnet sich **Neuigkeiten**; mit **Nicht mehr anzeigen** bleibt es für diese Version geschlossen. Zum Startbildschirm hinzufügen: auf iPhone/iPad in Safari **Teilen > Zum Home-Bildschirm**, auf Android in Chrome **⋮ > Zum Startbildschirm hinzufügen**.

## Rückmeldung
Eine Funktion fehlt oder ein Fehler aufgefallen? {mail}

Entwickelt von Yemliha Enes Tüten, Medizinphysik-Experte''')
L['ko']=('한국어','''# DICOM 뷰어 (V.3)

CT, MR, X선, PET 영상을 브라우저에서 여는 무료 단일 파일 DICOM 뷰어입니다. 설치가 필요 없습니다. 이미지는 업로드되지 않고 기기에 남습니다. 진단용이 아니라 열람용입니다.

**사용 환경:** Windows, Mac, iPhone, iPad, Android. Chrome, Safari, Edge, Firefox.

## 여는 방법
- 웹 주소: {link}
- 또는 `DICOM_Goruntuleyici.html` 파일을 내려받아 브라우저로 여세요. iPhone과 iPad에서는 파일 앱 미리보기로 열지 말고 Safari로 여세요.

## 사용 방법
1. **ZIP 추가**로 DICOM 파일 또는 ZIP 하나를 선택하세요. **폴더 추가**로 폴더 전체를 불러올 수 있습니다. 원하는 만큼 추가할 수 있습니다.
2. 시리즈가 썸네일과 함께 나열됩니다. **레이아웃** 목록에서 1×1부터 6×6까지 격자를 선택하고 시리즈를 칸으로 끌어다 놓으세요.
3. 마우스 휠이나 손가락으로 슬라이스를 넘기세요. 칸을 더블클릭하면 해당 시리즈가 3개 평면으로 열립니다.
4. 새 환자로 넘어가려면 **이미지 제거** 버튼을 누르세요.

## 기능
- 축상, 관상, 시상 평면 동시 표시
- 시리즈 패널, 격자 보기, 로컬라이저 선, 슬라이스 동기화
- 확대, 이동, 윈도우 레벨과 폭(CT, MR, PET 프리셋 제공)
- 자로 mm 단위 측정
- 마커. 모든 마커가 이미지 이름과 함께 아래에 나열되며 시리즈를 닫아도 남습니다
- PET/CT 융합 및 수동 정렬
- **각도** 버튼: 이미지 가장자리에 0–360° 눈금. Varian(180° 아래)과 Elekta(0° 아래)
- **초기 화면** 버튼과 마우스 오버 설명
- Türkçe, English, Deutsch, 한국어, 日本語, Русский 인터페이스

## 오프라인 사용과 업데이트
웹 주소를 인터넷에 연결된 상태에서 한 번 열면 이후에는 인터넷 없이도 작동합니다. 페이지 아래쪽의 **업데이트** 버튼은 새 버전이 있는지 확인하고 다운로드합니다. 불러온 이미지가 닫힌다는 경고가 표시됩니다. 업데이트 후에도 오프라인으로 작동합니다. `DICOM_Goruntuleyici.html` 파일을 단독으로 열면 **업데이트** 버튼이 새 버전을 다운로드하여 `DICOM GÖRÜNTÜLEYİCİ_날짜_버전.html` 이름으로 저장합니다. 프로그램을 연 후 처음 1분 동안은 스스로도 확인하고 다운로드 전에 묻습니다. 그 후에는 버튼으로만 확인합니다. 인터넷이 없으면 버튼 옆에 **오프라인**이 표시됩니다. 업데이트할 때마다 **새로운 기능** 창이 열리며 **다시 표시하지 않음**을 선택하면 해당 버전에서는 열리지 않습니다. 홈 화면에 추가하려면 iPhone/iPad의 Safari에서 **공유 > 홈 화면에 추가**, Android의 Chrome에서 **⋮ > 홈 화면에 추가**를 사용하세요.

## 의견
부족한 기능이나 오류가 있으면 알려 주세요: {mail}

개발: 의학물리 전문가 Yemliha Enes Tüten''')
L['ja']=('日本語','''# DICOM ビューア (V.3)

CT、MR、X線、PET画像をブラウザで開く無料の単一ファイルDICOMビューアです。インストールは不要です。画像はアップロードされず、お使いの端末内にとどまります。診断用ではなく閲覧専用です。

**動作環境：** Windows、Mac、iPhone、iPad、Android。Chrome、Safari、Edge、Firefox。

## 開き方
- Webアドレス：{link}
- または `DICOM_Goruntuleyici.html` をダウンロードしてブラウザで開きます。iPhoneとiPadでは「ファイル」アプリのプレビューで開かず、Safariで開いてください。

## 使い方
1. **ZIPを追加**でDICOMファイルまたは1つのZIPを選択します。**フォルダを追加**でフォルダ全体を読み込めます。いくつでも追加できます。
2. シリーズはサムネイル付きで一覧表示されます。**レイアウト**のリストで1×1から6×6のグリッドを選び、シリーズをセルにドラッグします。
3. マウスホイールまたは指でスライスをスクロールします。セルをダブルクリックするとそのシリーズが3断面で開きます。
4. 新しい患者に切り替えるには**画像を削除**ボタンを押します。

## 機能
- アキシャル、コロナル、サジタルの3断面を同時表示
- シリーズパネル、グリッド表示、ローカライザ線、スライス同期
- ズーム、パン、ウィンドウレベルと幅（CT、MR、PETのプリセット付き）
- 定規でmm単位の計測
- マーカー。すべてのマーカーが画像名とともに下部に一覧表示され、シリーズを閉じても残ります
- PET/CTフュージョンと手動位置合わせ
- **角度**ボタン：画像の端に0〜360°の目盛り。Varian（180°が下）とElekta（0°が下）
- **初期表示**ボタンとマウスオーバーの説明
- Türkçe、English、Deutsch、한국어、日本語、Русскийのインターフェース

## オフライン利用と更新
Webアドレスをインターネット接続中に一度開くと、その後はインターネットなしでも動作します。ページ下部の**更新**ボタンは新しいバージョンを確認してダウンロードします。読み込んだ画像が閉じられる旨の警告が表示されます。更新後も引き続きオフラインで動作します。`DICOM_Goruntuleyici.html`を単一ファイルとして開いた場合、**更新**ボタンは新しいバージョンをダウンロードし`DICOM GÖRÜNTÜLEYİCİ_日付_バージョン.html`という名前で保存します。起動後の最初の1分間はプログラム自身も確認し、ダウンロード前に確認を求めます。その後はボタンでのみ確認します。インターネットがないとボタンの横に**オフライン**と表示されます。更新のたびに**新機能**ウィンドウが開き、**今後表示しない**にチェックするとそのバージョンでは開きません。ホーム画面に追加するには、iPhone/iPadのSafariで**共有 > ホーム画面に追加**、AndroidのChromeで**⋮ > ホーム画面に追加**を使用します。

## フィードバック
不足している機能や不具合がありましたらご連絡ください：{mail}

開発：医学物理専門家 Yemliha Enes Tüten''')
L['ru']=('Русский','''# DICOM-просмотрщик (V.3)

Бесплатный DICOM-просмотрщик в одном файле, открывающий изображения КТ, МРТ, рентгена и ПЭТ в браузере. Установка не нужна. Изображения не загружаются и остаются на вашем устройстве. Только для просмотра, не для диагностики.

**Работает на:** Windows, Mac, iPhone, iPad и Android. Chrome, Safari, Edge и Firefox.

## Как открыть
- Веб-адрес: {link}
- Или скачайте файл `DICOM_Goruntuleyici.html` и откройте его в браузере. На iPhone и iPad не открывайте файл в предпросмотре приложения «Файлы», а откройте его в Safari.

## Как пользоваться
1. Кнопкой **Добавить ZIP** выберите файлы DICOM или один ZIP. Кнопкой **Добавить папку** загрузите папку целиком. Можно добавлять сколько угодно.
2. Серии показаны с миниатюрами. В списке **Раскладка** выберите сетку от 1×1 до 6×6 и перетащите серии в ячейки.
3. Листайте срезы колесом мыши или пальцем. Двойной щелчок по ячейке открывает серию в 3 плоскостях.
4. Чтобы перейти к новому пациенту, нажмите **Удалить изображения**.

## Возможности
- Аксиальная, корональная и сагиттальная плоскости одновременно
- Панель серий, сетка, линия локализатора, синхронизация срезов
- Масштаб, сдвиг, уровень и ширина окна (готовые пресеты КТ, МР, ПЭТ)
- Линейка для измерений в мм
- Метки. Все метки перечислены внизу с названием изображения и остаются при закрытии серии
- Слияние ПЭТ/КТ с ручным совмещением
- Кнопка **Угол**: шкала 0–360° по краям изображения. Varian (180° внизу) и Elekta (0° внизу)
- Кнопка **Исходный вид** и подсказки при наведении мыши
- Интерфейс на Türkçe, English, Deutsch, 한국어, 日本語, Русский

## Работа офлайн и обновление
Если один раз открыть веб-адрес при наличии интернета, дальше программа работает и без него. Кнопка **Обновить** внизу страницы проверяет наличие новой версии и скачивает её. Она предупреждает, что загруженные изображения будут закрыты. После обновления программа снова работает офлайн. Если открыть `DICOM_Goruntuleyici.html` как отдельный файл, кнопка **Обновить** скачивает новую версию и сохраняет её под именем `DICOM GÖRÜNTÜLEYİCİ_дата_версия.html`. В первую минуту после запуска программа проверяет и сама и спрашивает перед скачиванием, затем — только по кнопке. Без интернета рядом с кнопкой появляется **Офлайн**. После каждого обновления открывается окно **Что нового**; если отметить **Больше не показывать**, для этой версии оно не откроется. Чтобы добавить на главный экран, в Safari на iPhone/iPad используйте **Поделиться > На экран «Домой»**, в Chrome на Android — **⋮ > Добавить на главный экран**.

## Обратная связь
Не хватает функции или нашли ошибку? {mail}

Разработал Yemliha Enes Tüten, специалист по медицинской физике''')
order=['tr','en','de','ko','ja','ru']
DL='https://github.com/yemlihaenestuten/dicom-viewer/releases/latest/download/DICOM_Goruntuleyici.html'
out='# DICOM Görüntüleyici / DICOM Viewer\n\n'+'**[⬇ İndir / Download (HTML)](%s)**'%DL+('  ·  **[🌐 Web](%s)**'%url if url else '')+'\n\n'+' · '.join('[%s](#%s)'%(L[k][0],k) for k in order)+'\n\n'
for k in order:
    out+='<a id="%s"></a>\n\n'%k+L[k][1].format(link=link,mail=mail)+'\n\n---\n\n'
open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.dirname(__import__('os').path.abspath(__file__))),'README.md'),'w',encoding='utf-8').write(out.rstrip('\n-\n ')+'\n')
print('README',len(out))
