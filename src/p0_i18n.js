/* ---------- Dil desteği: Türkçe (varsayılan), İngilizce, Almanca, Korece, Japonca, Rusça ---------- */
/* Kaynak metinler Türkçedir. TX() tam eşleşme arar, bulamazsa ifade kalıplarını (PHR) uygular. */
const VER='V.4';
const BUILD_DATE='';/* yayın tarihi GG.AA.YYYY (make_site.py yazar) */
const UPDATE_URL='';/* yayın adresi (GitHub Pages) */
const UPD_FILE=location.protocol==='file:';
const LANGS=['en','de','ko','ja','ru'];
let LANG='tr';
try{const l=localStorage.getItem('dicomLang');if(LANGS.includes(l))LANG=l;}catch(_){}
const MAIL='yemlihaenestutenwork@gmail.com';

/* [Türkçe, İngilizce, Almanca, Korece, Japonca, Rusça] */
const EXACT_ROWS=[
 ["DICOM GÖRÜNTÜLEYİCİ", "DICOM VIEWER", "DICOM-BETRACHTER", "DICOM 뷰어", "DICOM ビューア", "DICOM-ПРОСМОТРЩИК"],
 ["DICOM Görüntüleyici", "DICOM Viewer", "DICOM-Betrachter", "DICOM 뷰어", "DICOM ビューア", "DICOM-просмотрщик"],
 ["Medikal Fizik Uzmanı Yemliha Enes Tüten Tarafından geliştirilmiştir", "Developed by Yemliha Enes Tüten, Medical Physics Expert", "Entwickelt von Yemliha Enes Tüten, Medizinphysik-Experte", "의학물리 전문가 Yemliha Enes Tüten 개발", "医学物理専門家 Yemliha Enes Tüten 開発", "Разработал Yemliha Enes Tüten, специалист по медицинской физике"],
 ["Medikal Fizik Uzmanı", "Medical Physics Expert", "Medizinphysik-Experte", "의학물리 전문가", "医学物理専門家", "Специалист по медицинской физике"],
 ["Yardım", "Help", "Hilfe", "도움말", "ヘルプ", "Справка"],
 ["Dil", "Language", "Sprache", "언어", "言語", "Язык"],
 ["ZIP ekle", "Add ZIP", "ZIP hinzufügen", "ZIP 추가", "ZIPを追加", "Добавить ZIP"],
 ["Klasör ekle", "Add folder", "Ordner hinzufügen", "폴더 추가", "フォルダを追加", "Добавить папку"],
 ["Temizle", "Clear", "Leeren", "지우기", "クリア", "Очистить"],
 ["Emin misiniz?", "Are you sure?", "Sind Sie sicher?", "확실합니까?", "よろしいですか？", "Вы уверены?"],
 ["Hafif mod", "Light mode", "Sparmodus", "절전 모드", "軽量モード", "Лёгкий режим"],
 ["Füzyon", "Fusion", "Fusion", "융합", "フュージョン", "Слияние"],
 ["Ayır", "Split", "Trennen", "분리", "分離", "Разделить"],
 ["Seriler", "Series", "Serien", "시리즈", "シリーズ", "Серии"],
 ["Çapraz", "Cross", "Fadenkreuz", "십자선", "十字線", "Перекрестие"],
 ["Kontrast", "Contrast", "Kontrast", "대비", "コントラスト", "Контраст"],
 ["Kesit", "Slice", "Schicht", "슬라이스", "スライス", "Срез"],
 ["Yakınlaştır", "Zoom", "Zoom", "확대", "ズーム", "Масштаб"],
 ["Kaydır", "Pan", "Verschieben", "이동", "パン", "Перемещение"],
 ["Cetvel", "Ruler", "Lineal", "자", "定規", "Линейка"],
 ["İşaretle", "Mark", "Markieren", "마커 찍기", "マーク", "Метка"],
 ["Hizala", "Align", "Ausrichten", "정렬", "位置合わせ", "Совместить"],
 ["Sıfırla", "Reset", "Zurücksetzen", "초기화", "リセット", "Сброс"],
 ["Ayarlar", "Settings", "Einstellungen", "설정", "設定", "Настройки"],
 ["Ön ayar", "Preset", "Voreinstellung", "프리셋", "プリセット", "Пресет"],
 ["Genişlik", "Width", "Breite", "폭", "幅", "Ширина"],
 ["Merkez", "Level", "Zentrum", "레벨", "レベル", "Уровень"],
 ["Renk", "Color", "Farbe", "색상", "カラー", "Цвет"],
 ["Gama", "Gamma", "Gamma", "감마", "ガンマ", "Гамма"],
 ["Ters çevir", "Invert", "Invertieren", "반전", "反転", "Инвертировать"],
 ["Kesitleri eşle", "Sync slices", "Schichten koppeln", "슬라이스 동기화", "スライスを同期", "Синхронизировать срезы"],
 ["Lokalizer çizgisi", "Localizer line", "Localizer-Linie", "로컬라이저 선", "ローカライザ線", "Линия локализатора"],
 ["Kaplama", "Overlay", "Overlay", "오버레이", "オーバーレイ", "Наложение"],
 ["Yok", "None", "Keine", "없음", "なし", "Нет"],
 ["Saydamlık", "Opacity", "Deckkraft", "불투명도", "不透明度", "Непрозрачность"],
 ["Alt", "Min", "Min", "최소", "最小", "Мин"],
 ["Üst", "Max", "Max", "최대", "最大", "Макс"],
 ["Otomatik aralık", "Auto range", "Auto-Bereich", "자동 범위", "自動範囲", "Авто-диапазон"],
 ["Kaydırma (mm)", "Shift (mm)", "Verschiebung (mm)", "이동량 (mm)", "シフト量 (mm)", "Сдвиг (мм)"],
 ["Adım", "Step", "Schritt", "단계", "ステップ", "Шаг"],
 ["Kesit +", "Slice +", "Schicht +", "슬라이스 +", "スライス +", "Срез +"],
 ["Kesit −", "Slice −", "Schicht −", "슬라이스 −", "スライス −", "Срез −"],
 ["İşaretler", "Markers", "Markierungen", "마커", "マーカー", "Метки"],
 ["Ölçümler", "Measurements", "Messungen", "측정", "計測", "Измерения"],
 ["Etiketler", "Tags", "Tags", "태그", "タグ", "Теги"],
 ["İşaretle aracıyla bir kesite dokunun, Cetvel aracıyla iki nokta arasını sürükleyin. Listeden bir öğeye basınca kesit oraya gider.", "Tap a slice with the Mark tool, or drag between two points with the Ruler tool. Selecting an item in the list jumps to its slice.", "Tippen Sie mit dem Werkzeug Markieren auf eine Schicht oder ziehen Sie mit dem Lineal zwischen zwei Punkten. Ein Eintrag in der Liste springt zur jeweiligen Schicht.", "마커 찍기 도구로 슬라이스를 탭하거나 자 도구로 두 점 사이를 드래그하세요. 목록에서 항목을 선택하면 해당 슬라이스로 이동합니다.", "マークツールでスライスをタップするか、定規ツールで2点間をドラッグします。リストの項目を選ぶとそのスライスへ移動します。", "Коснитесь среза инструментом «Метка» или проведите между двумя точками инструментом «Линейка». Выбор элемента в списке переходит к его срезу."],
 ["CSV kopyala", "Copy CSV", "CSV kopieren", "CSV 복사", "CSVをコピー", "Копировать CSV"],
 ["Tümünü sil", "Delete all", "Alle löschen", "모두 삭제", "すべて削除", "Удалить все"],
 ["Hasta bilgilerini gizle", "Hide patient information", "Patientendaten ausblenden", "환자 정보 숨기기", "患者情報を非表示", "Скрыть данные пациента"],
 ["Seri seç", "Select series", "Serie wählen", "시리즈 선택", "シリーズを選択", "Выбрать серию"],
 ["Bu kutuda görünecek seriyi seçin.", "Choose the series to show in this cell.", "Wählen Sie die Serie für dieses Feld.", "이 칸에 표시할 시리즈를 선택하세요.", "このセルに表示するシリーズを選択してください。", "Выберите серию для этой ячейки."],
 ["Kapat", "Close", "Schließen", "닫기", "閉じる", "Закрыть"],
 ["Nasıl kullanılır", "How to use", "Anleitung", "사용 방법", "使い方", "Как пользоваться"],
 ["DICOM dosyalarını ya da ZIP seçer. Seçilenler mevcut serilerin üstüne eklenir", "Selects DICOM files or a ZIP. They are added to the existing series", "Wählt DICOM-Dateien oder eine ZIP. Sie werden zu den vorhandenen Serien hinzugefügt", "DICOM 파일 또는 ZIP을 선택합니다. 선택한 항목은 기존 시리즈에 추가됩니다", "DICOMファイルまたはZIPを選択します。選択したものは既存のシリーズに追加されます", "Выбор файлов DICOM или ZIP. Они добавляются к уже загруженным сериям"],
 ["Klasördeki DICOM dosyalarını mevcut serilerin üstüne ekler", "Adds the DICOM files in a folder to the existing series", "Fügt die DICOM-Dateien eines Ordners zu den vorhandenen Serien hinzu", "폴더의 DICOM 파일을 기존 시리즈에 추가합니다", "フォルダ内のDICOMファイルを既存のシリーズに追加します", "Добавляет файлы DICOM из папки к уже загруженным сериям"],
 ["Yüklenen tüm serileri kaldırır", "Removes all loaded series", "Entfernt alle geladenen Serien", "불러온 모든 시리즈를 제거합니다", "読み込んだすべてのシリーズを削除します", "Удаляет все загруженные серии"],
 ["512 ve üstü kesitleri yarı çözünürlükte açar, bellekten tasarruf eder", "Opens slices of 512 and larger at half resolution to save memory", "Öffnet Schichten ab 512 Pixel mit halber Auflösung und spart Speicher", "512 이상의 슬라이스를 절반 해상도로 열어 메모리를 절약합니다", "512以上のスライスを半分の解像度で開き、メモリを節約します", "Открывает срезы 512 и больше в половинном разрешении, экономя память"],
 ["Araçlar", "Tools", "Werkzeuge", "도구", "ツール", "Инструменты"],
 ["Görünüm düzeni", "View layout", "Ansichtslayout", "보기 레이아웃", "表示レイアウト", "Раскладка экрана"],
 ["Seçili BT/MR ile PET serisini birleştirir", "Fuses the selected CT/MR with a PET series", "Fusioniert das gewählte CT/MR mit einer PET-Serie", "선택한 CT/MR과 PET 시리즈를 융합합니다", "選択したCT/MRとPETシリーズをフュージョンします", "Совмещает выбранные КТ/МР с серией ПЭТ"],
 ["Seriler panelini göster ya da gizle", "Show or hide the series panel", "Serienpanel ein- oder ausblenden", "시리즈 패널을 표시하거나 숨깁니다", "シリーズパネルを表示または非表示にします", "Показывает или скрывает панель серий"],
 ["Fare aracı", "Mouse tool", "Maus-Werkzeug", "마우스 도구", "マウスツール", "Инструмент мыши"],
 ["Kısayol: C", "Shortcut: C", "Tastenkürzel: C", "단축키: C", "ショートカット: C", "Горячая клавиша: C"],
 ["Kısayol: W", "Shortcut: W", "Tastenkürzel: W", "단축키: W", "ショートカット: W", "Горячая клавиша: W"],
 ["Kısayol: S", "Shortcut: S", "Tastenkürzel: S", "단축키: S", "ショートカット: S", "Горячая клавиша: S"],
 ["Kısayol: Z", "Shortcut: Z", "Tastenkürzel: Z", "단축키: Z", "ショートカット: Z", "Горячая клавиша: Z"],
 ["Kısayol: P", "Shortcut: P", "Tastenkürzel: P", "단축키: P", "ショートカット: P", "Горячая клавиша: P"],
 ["Kısayol: R", "Shortcut: R", "Tastenkürzel: R", "단축키: R", "ショートカット: R", "Горячая клавиша: R"],
 ["Kısayol: M", "Shortcut: M", "Tastenkürzel: M", "단축키: M", "ショートカット: M", "Горячая клавиша: M"],
 ["Kısayol: A. PET kaplamasını sürükleyerek hizalar", "Shortcut: A. Aligns the PET overlay by dragging", "Tastenkürzel: A. Richtet das PET-Overlay durch Ziehen aus", "단축키: A. PET 오버레이를 드래그하여 정렬합니다", "ショートカット: A。PETオーバーレイをドラッグして位置合わせします", "Горячая клавиша: A. Совмещает наложение ПЭТ перетаскиванием"],
 ["Uzaklaştır", "Zoom out", "Verkleinern", "축소", "縮小", "Уменьшить"],
 ["Uzaklaştır (-)", "Zoom out (-)", "Verkleinern (-)", "축소 (-)", "縮小 (-)", "Уменьшить (-)"],
 ["Yakınlaştırmayı artır", "Zoom in", "Vergrößern", "확대", "拡大", "Увеличить"],
 ["Yakınlaştır (+)", "Zoom in (+)", "Vergrößern (+)", "확대 (+)", "拡大 (+)", "Увеличить (+)"],
 ["Yakınlaştırmayı sıfırla (0)", "Reset zoom (0)", "Zoom zurücksetzen (0)", "확대 초기화 (0)", "ズームをリセット (0)", "Сбросить масштаб (0)"],
 ["Kontrast, renk ve füzyon", "Contrast, color and fusion", "Kontrast, Farbe und Fusion", "대비, 색상, 융합", "コントラスト、カラー、フュージョン", "Контраст, цвет и слияние"],
 ["Izgarada tüm serilerde aynı konumdaki kesiti gösterir", "Shows the slice at the same position in every series of the grid", "Zeigt in allen Serien des Rasters die Schicht an derselben Position", "격자의 모든 시리즈에서 같은 위치의 슬라이스를 표시합니다", "グリッド内のすべてのシリーズで同じ位置のスライスを表示します", "Показывает срез в одинаковой позиции во всех сериях сетки"],
 ["Farklı yönlü serilerde seçili kutunun kesit konumunu çizgiyle gösterir", "Shows the slice position of the selected cell as a line in series with a different orientation", "Zeigt die Schichtposition des gewählten Feldes als Linie in Serien mit anderer Ausrichtung", "방향이 다른 시리즈에서 선택한 칸의 슬라이스 위치를 선으로 표시합니다", "向きの異なるシリーズに、選択したセルのスライス位置を線で表示します", "В сериях с другой ориентацией показывает линией положение среза выбранной ячейки"],
 ["Kaplamayı kaydır", "Shift the overlay", "Overlay verschieben", "오버레이 이동", "オーバーレイを移動", "Сдвиг наложения"],
 ["Sola", "Left", "Nach links", "왼쪽", "左へ", "Влево"],
 ["Sağa", "Right", "Nach rechts", "오른쪽", "右へ", "Вправо"],
 ["Yukarı", "Up", "Nach oben", "위", "上へ", "Вверх"],
 ["Aşağı", "Down", "Nach unten", "아래", "下へ", "Вниз"],
 ["Kesit yönünde ileri", "Forward along the slice direction", "Vorwärts in Schichtrichtung", "슬라이스 방향 앞으로", "スライス方向に前へ", "Вперёд по направлению срезов"],
 ["Kesit yönünde geri", "Backward along the slice direction", "Rückwärts in Schichtrichtung", "슬라이스 방향 뒤로", "スライス方向に後ろへ", "Назад по направлению срезов"],
 ["Etiket ara", "Search tags", "Tags suchen", "태그 검색", "タグを検索", "Поиск тегов"],
 ["Aksiyel", "Axial", "Axial", "축상", "アキシャル", "Аксиальная"],
 ["Koronal", "Coronal", "Koronar", "관상", "コロナル", "Корональная"],
 ["Sagittal", "Sagittal", "Sagittal", "시상", "サジタル", "Сагиттальная"],
 ["Aksiyel kesit", "Axial view", "Axialansicht", "축상 슬라이스", "アキシャルスライス", "Аксиальный срез"],
 ["Koronal kesit", "Coronal view", "Koronalansicht", "관상 슬라이스", "コロナルスライス", "Корональный срез"],
 ["Sagittal kesit", "Sagittal view", "Sagittalansicht", "시상 슬라이스", "サジタルスライス", "Сагиттальный срез"],
 ["Aksiyel kesit numarası", "Axial slice number", "Axiale Schichtnummer", "축상 슬라이스 번호", "アキシャルスライス番号", "Номер аксиального среза"],
 ["Koronal kesit numarası", "Coronal slice number", "Koronale Schichtnummer", "관상 슬라이스 번호", "コロナルスライス番号", "Номер коронального среза"],
 ["Sagittal kesit numarası", "Sagittal slice number", "Sagittale Schichtnummer", "시상 슬라이스 번호", "サジタルスライス番号", "Номер сагиттального среза"],
 ["Küçült", "Shrink", "Verkleinern", "축소", "縮小", "Свернуть"],
 ["Tam genişlik", "Full width", "Volle Breite", "전체 너비", "全幅", "Во всю ширину"],
 ["Büyüt", "Enlarge", "Vergrößern", "확대", "拡大", "Развернуть"],
 ["3 kesitte aç", "Open in 3 planes", "In 3 Ebenen öffnen", "3개 평면으로 열기", "3断面で開く", "Открыть в 3 плоскостях"],
 ["Tutup başka kutuya sürükleyin: yer değiştirir", "Drag onto another cell to swap", "In ein anderes Feld ziehen zum Tauschen", "다른 칸으로 끌어다 놓으면 위치가 바뀝니다", "別のセルにドラッグ＆ドロップすると入れ替わります", "Перетащите на другую ячейку, чтобы поменять местами"],
 ["(açıklama yok)", "(no description)", "(ohne Beschreibung)", "(설명 없음)", "(説明なし)", "(без описания)"],
 ["görüntü", "images", "Bilder", "이미지", "画像", "изображений"],
 ["kesit", "slice", "Schicht", "슬라이스", "スライス", "срез"],
 ["kesit (çoğul)", "slices", "Schichten", "슬라이스", "スライス", "срезов"],
 ["renkli", "color", "farbig", "컬러", "カラー", "цветное"],
 ["Seri", "Series", "Serie", "시리즈", "シリーズ", "Серия"],
 ["seri", "series", "Serien", "시리즈", "シリーズ", "серий"],
 ["(boş)", "(empty)", "(leer)", "(비어 있음)", "(空)", "(пусто)"],
 ["Kutuyu boşalt", "Empty this cell", "Feld leeren", "칸 비우기", "セルを空にする", "Очистить ячейку"],
 ["Boş. Dokunup seri seçin", "Empty. Tap to choose a series", "Leer. Tippen, um eine Serie zu wählen", "비어 있음. 탭하여 시리즈 선택", "空です。タップしてシリーズを選択", "Пусто. Нажмите, чтобы выбрать серию"],
 ["3 kesit (MPR)", "3 planes (MPR)", "3 Ebenen (MPR)", "3개 평면 (MPR)", "3断面 (MPR)", "3 плоскости (MPR)"],
 ["Etiket yok", "No tags", "Keine Tags", "태그 없음", "タグなし", "Нет тегов"],
 ["(ikili veri)", "(binary data)", "(Binärdaten)", "(이진 데이터)", "(バイナリデータ)", "(двоичные данные)"],
 ["İşarete git", "Go to marker", "Zur Markierung", "마커로 이동", "マーカーへ移動", "Перейти к метке"],
 ["İşaret adı", "Marker name", "Markierungsname", "마커 이름", "マーカー名", "Имя метки"],
 ["İşareti sil", "Delete marker", "Markierung löschen", "마커 삭제", "マーカーを削除", "Удалить метку"],
 ["Ölçümü sil", "Delete measurement", "Messung löschen", "측정 삭제", "計測を削除", "Удалить измерение"],
 ["İşaret", "Marker", "Markierung", "마커", "マーカー", "Метка"],
 ["parlaklık", "brightness", "Helligkeit", "밝기", "輝度", "яркость"],
 ["değer", "value", "Wert", "값", "値", "значение"],
 ["bindirme", "overlay", "Overlay", "오버레이", "オーバーレイ", "наложение"],
 ["ad,i,j,k,x_mm,y_mm,z_mm,deger,bindirme_degeri", "name,i,j,k,x_mm,y_mm,z_mm,value,overlay_value", "name,i,j,k,x_mm,y_mm,z_mm,wert,overlay_wert", "name,i,j,k,x_mm,y_mm,z_mm,value,overlay_value", "name,i,j,k,x_mm,y_mm,z_mm,value,overlay_value", "name,i,j,k,x_mm,y_mm,z_mm,value,overlay_value"],
 ["Örnek BT (yapay veri)", "Sample CT (synthetic data)", "Beispiel-CT (synthetische Daten)", "샘플 CT (합성 데이터)", "サンプルCT (合成データ)", "Пример КТ (синтетические данные)"],
 ["Örnek PET (yapay veri)", "Sample PET (synthetic data)", "Beispiel-PET (synthetische Daten)", "샘플 PET (합성 데이터)", "サンプルPET (合成データ)", "Пример ПЭТ (синтетические данные)"],
 ["BT · Örnek fantom (yapay veri)", "CT · Sample phantom (synthetic data)", "CT · Beispielphantom (synthetische Daten)", "CT · 샘플 팬텀 (합성 데이터)", "CT · サンプルファントム (合成データ)", "КТ · Пример фантома (синтетические данные)"],
 ["PET · Örnek fantom (yapay veri)", "PET · Sample phantom (synthetic data)", "PET · Beispielphantom (synthetische Daten)", "PET · 샘플 팬텀 (합성 데이터)", "PET · サンプルファントム (合成データ)", "ПЭТ · Пример фантома (синтетические данные)"],
 ["Otomatik", "Automatic", "Automatisch", "자동", "自動", "Авто"],
 ["BT", "CT", "CT", "CT", "CT", "КТ"],
 ["Elle", "Manual", "Manuell", "수동", "手動", "Вручную"],
 ["Özel", "Custom", "Benutzerdefiniert", "사용자 지정", "カスタム", "Свой"],
 ["Dosyadaki pencere", "Window from file", "Fenster aus Datei", "파일의 윈도우", "ファイル内のウィンドウ", "Окно из файла"],
 ["Otomatik %1–%99", "Auto 1–99%", "Auto 1–99 %", "자동 1–99%", "自動 1–99%", "Авто 1–99 %"],
 ["Kontrastı artır %0,1–%99,9", "Boost contrast 0.1–99.9%", "Kontrast erhöhen 0,1–99,9 %", "대비 높임 0.1–99.9%", "コントラスト強調 0.1–99.9%", "Усиление контраста 0,1–99,9 %"],
 ["Yüksek kontrast %5–%95", "High contrast 5–95%", "Hoher Kontrast 5–95 %", "높은 대비 5–95%", "高コントラスト 5–95%", "Высокий контраст 5–95 %"],
 ["PET sıcak nokta %0–%99,5", "PET hot spot 0–99.5%", "PET-Hotspot 0–99,5 %", "PET 핫스팟 0–99.5%", "PETホットスポット 0–99.5%", "Горячие точки ПЭТ 0–99,5 %"],
 ["Tam aralık", "Full range", "Gesamter Bereich", "전체 범위", "全範囲", "Полный диапазон"],
 ["Abdomen 400 / 50", "Abdomen 400 / 50", "Abdomen 400 / 50", "복부 400 / 50", "腹部 400 / 50", "Брюшная полость 400 / 50"],
 ["Yumuşak doku 400 / 40", "Soft tissue 400 / 40", "Weichteile 400 / 40", "연부조직 400 / 40", "軟部組織 400 / 40", "Мягкие ткани 400 / 40"],
 ["Mediasten 350 / 50", "Mediastinum 350 / 50", "Mediastinum 350 / 50", "종격동 350 / 50", "縦隔 350 / 50", "Средостение 350 / 50"],
 ["Karaciğer 150 / 60", "Liver 150 / 60", "Leber 150 / 60", "간 150 / 60", "肝臓 150 / 60", "Печень 150 / 60"],
 ["Böbrek 500 / 100", "Kidney 500 / 100", "Niere 500 / 100", "신장 500 / 100", "腎臓 500 / 100", "Почки 500 / 100"],
 ["Yağ 250 / −80", "Fat 250 / −80", "Fett 250 / −80", "지방 250 / −80", "脂肪 250 / −80", "Жир 250 / −80"],
 ["Akciğer 1500 / −600", "Lung 1500 / −600", "Lunge 1500 / −600", "폐 1500 / −600", "肺 1500 / −600", "Лёгкие 1500 / −600"],
 ["Akciğer dar 800 / −600", "Lung narrow 800 / −600", "Lunge eng 800 / −600", "폐 좁은 창 800 / −600", "肺 狭窓 800 / −600", "Лёгкие, узкое окно 800 / −600"],
 ["Kemik 2000 / 500", "Bone 2000 / 500", "Knochen 2000 / 500", "뼈 2000 / 500", "骨 2000 / 500", "Кость 2000 / 500"],
 ["Kemik dar 1000 / 300", "Bone narrow 1000 / 300", "Knochen eng 1000 / 300", "뼈 좁은 창 1000 / 300", "骨 狭窓 1000 / 300", "Кость, узкое окно 1000 / 300"],
 ["Omurga yumuşak doku 250 / 50", "Spine soft tissue 250 / 50", "Wirbelsäule Weichteile 250 / 50", "척추 연부조직 250 / 50", "脊椎軟部組織 250 / 50", "Мягкие ткани позвоночника 250 / 50"],
 ["Beyin 80 / 40", "Brain 80 / 40", "Gehirn 80 / 40", "뇌 80 / 40", "脳 80 / 40", "Мозг 80 / 40"],
 ["İnme 40 / 40", "Stroke 40 / 40", "Schlaganfall 40 / 40", "뇌졸중 40 / 40", "脳卒中 40 / 40", "Инсульт 40 / 40"],
 ["Subdural 250 / 80", "Subdural 250 / 80", "Subdural 250 / 80", "경막하 250 / 80", "硬膜下 250 / 80", "Субдуральное 250 / 80"],
 ["Posterior fossa 140 / 40", "Posterior fossa 140 / 40", "Hintere Schädelgrube 140 / 40", "후두개와 140 / 40", "後頭蓋窩 140 / 40", "Задняя черепная ямка 140 / 40"],
 ["Anjiyo 700 / 200", "Angio 700 / 200", "Angio 700 / 200", "혈관조영 700 / 200", "血管造影 700 / 200", "Ангио 700 / 200"],
 ["Gri", "Gray", "Grau", "회색", "グレー", "Серый"],
 ["Ters gri", "Inverted gray", "Grau invertiert", "반전 회색", "反転グレー", "Инвертированный серый"],
 ["Sıcak", "Hot", "Heiß", "핫", "ホット", "Горячий"],
 ["Ateş (PET)", "Fire (PET)", "Feuer (PET)", "파이어 (PET)", "ファイア (PET)", "Огонь (ПЭТ)"],
 ["Gökkuşağı", "Rainbow", "Regenbogen", "무지개", "レインボー", "Радуга"],
 ["Soğuk-sıcak", "Cool-warm", "Kalt-warm", "냉온", "クールウォーム", "Холодный-тёплый"],
 ["Kemik", "Bone", "Knochen", "본", "ボーン", "Костный"],
 ["Örnek fantom: BT ve PET ayrı gösteriliyor.", "Sample phantom: CT and PET are shown separately.", "Beispielphantom: CT und PET werden getrennt angezeigt.", "샘플 팬텀: CT와 PET가 따로 표시됩니다.", "サンプルファントム：CTとPETを別々に表示しています。", "Пример фантома: КТ и ПЭТ показаны отдельно."],
 ["Örnek fantom: BT ve PET ayrı gösteriliyor. Füzyon düğmesine basınca PET, BT üzerine biner. Kendi DICOM dosyalarınızı ya da bir ZIP dosyasını ZIP ekle ile, bir klasörü Klasör ekle ile seçin. İstediğiniz kadar dosya ekleyebilirsiniz. Masaüstünde sürükleyip bırakabilirsiniz.", "Sample phantom: CT and PET are shown separately. Press the Fusion button to overlay the PET on the CT. Choose your own DICOM files or a ZIP with Add ZIP, or a folder with Add folder. You can add as many files as you like. On a desktop you can also drag and drop them.", "Beispielphantom: CT und PET werden getrennt angezeigt. Mit der Schaltfläche Fusion wird das PET über das CT gelegt. Wählen Sie eigene DICOM-Dateien oder eine ZIP mit ZIP hinzufügen, einen Ordner mit Ordner hinzufügen. Sie können beliebig viele Dateien hinzufügen. Am Computer funktioniert auch Drag-and-drop.", "샘플 팬텀: CT와 PET가 따로 표시됩니다. 융합 버튼을 누르면 PET가 CT 위에 겹쳐집니다. DICOM 파일이나 ZIP은 ZIP 추가로, 폴더는 폴더 추가로 선택하세요. 원하는 만큼 파일을 추가할 수 있습니다. 데스크톱에서는 끌어다 놓을 수도 있습니다.", "サンプルファントム：CTとPETを別々に表示しています。フュージョンボタンを押すとPETがCTに重なります。DICOMファイルやZIPは「ZIPを追加」、フォルダは「フォルダを追加」で選択してください。ファイルはいくつでも追加できます。デスクトップではドラッグ＆ドロップも使えます。", "Пример фантома: КТ и ПЭТ показаны отдельно. Нажмите «Слияние», чтобы наложить ПЭТ на КТ. Файлы DICOM или ZIP выбирайте кнопкой «Добавить ZIP», папку — кнопкой «Добавить папку». Можно добавить любое количество файлов. На компьютере файлы можно перетаскивать."],
 ["Kullanım kılavuzunu ve özellik listesini açar", "Opens the user guide and the feature list", "Öffnet die Anleitung und die Funktionsliste", "사용 설명서와 기능 목록을 엽니다", "使い方ガイドと機能一覧を開きます", "Открывает руководство и список возможностей"],
 ["Arayüz dilini seçin", "Choose the interface language", "Sprache der Oberfläche wählen", "인터페이스 언어를 선택하세요", "表示言語を選択してください", "Выберите язык интерфейса"],
 ["Görüntülenecek seriyi seçer", "Selects the series to display", "Wählt die anzuzeigende Serie", "표시할 시리즈를 선택합니다", "表示するシリーズを選択します", "Выбирает серию для показа"],
 ["Ekranı 3 kesite ya da 1×1'den 6×6'ya kadar seri ızgarasına böler", "Splits the screen into 3 planes or a series grid from 1×1 up to 6×6", "Teilt den Bildschirm in 3 Ebenen oder ein Serienraster von 1×1 bis 6×6", "화면을 3개 평면 또는 1×1부터 6×6까지의 시리즈 격자로 나눕니다", "画面を3断面、または1×1から6×6までのシリーズグリッドに分割します", "Делит экран на 3 плоскости или на сетку серий от 1×1 до 6×6"],
 ["Çapraz (C): tıkladığınız noktayı üç kesitte birden gösterir", "Cross (C): shows the clicked point in all three planes at once", "Fadenkreuz (C): zeigt den angeklickten Punkt gleichzeitig in allen drei Ebenen", "십자선 (C): 클릭한 지점을 세 평면에 동시에 표시합니다", "十字線 (C)：クリックした点を3つの断面に同時に表示します", "Перекрестие (C): показывает выбранную точку сразу в трёх плоскостях"],
 ["Kontrast (W): sürükleyerek parlaklığı ve kontrastı değiştirir. Sağa sürükleme genişliği, yukarı sürükleme merkezi ayarlar", "Contrast (W): drag to change brightness and contrast. Dragging sideways sets the width, dragging up or down sets the level", "Kontrast (W): Ziehen ändert Helligkeit und Kontrast. Seitlich ziehen stellt die Breite, vertikal ziehen die Fensterlage ein", "대비 (W): 드래그하여 밝기와 대비를 바꿉니다. 좌우로 드래그하면 폭, 위아래로 드래그하면 레벨이 바뀝니다", "コントラスト (W)：ドラッグして明るさとコントラストを変えます。左右で幅、上下でレベルを調整します", "Контраст (W): перетаскивание меняет яркость и контраст. По горизонтали меняется ширина окна, по вертикали — уровень"],
 ["Kesit (S): sürükleyerek kesitler arasında gezer. Fare tekerleği de aynı işi yapar", "Slice (S): drag to scroll through the slices. The mouse wheel does the same", "Schicht (S): Ziehen blättert durch die Schichten. Das Mausrad tut dasselbe", "슬라이스 (S): 드래그하여 슬라이스를 넘깁니다. 마우스 휠도 같은 기능입니다", "スライス (S)：ドラッグしてスライスを送ります。マウスホイールでも同じ操作ができます", "Срез (S): перетаскивание листает срезы. Колесо мыши делает то же самое"],
 ["Yakınlaştır (Z): sürükleyerek görüntüyü büyütür ya da küçültür", "Zoom (Z): drag to enlarge or shrink the image", "Zoom (Z): Ziehen vergrößert oder verkleinert das Bild", "확대 (Z): 드래그하여 이미지를 확대하거나 축소합니다", "ズーム (Z)：ドラッグして画像を拡大・縮小します", "Масштаб (Z): перетаскивание увеличивает или уменьшает изображение"],
 ["Kaydır (P): görüntüyü sürükleyerek taşır", "Pan (P): drag to move the image", "Verschieben (P): Ziehen bewegt das Bild", "이동 (P): 드래그하여 이미지를 움직입니다", "パン (P)：ドラッグして画像を移動します", "Перемещение (P): перетаскивание двигает изображение"],
 ["Cetvel (R): iki nokta arasını sürükleyerek mesafeyi mm olarak ölçer", "Ruler (R): drag between two points to measure the distance in mm", "Lineal (R): Zwischen zwei Punkten ziehen, um den Abstand in mm zu messen", "자 (R): 두 점 사이를 드래그하여 거리를 mm로 측정합니다", "定規 (R)：2点間をドラッグして距離をmmで測定します", "Линейка (R): проведите между двумя точками, чтобы измерить расстояние в мм"],
 ["İşaretle (M): tıkladığınız noktaya numaralı bir işaret koyar", "Mark (M): places a numbered marker on the clicked point", "Markieren (M): setzt eine nummerierte Markierung auf den angeklickten Punkt", "마커 찍기 (M): 클릭한 지점에 번호가 있는 마커를 찍습니다", "マーク (M)：クリックした点に番号付きマーカーを置きます", "Метка (M): ставит нумерованную метку в выбранной точке"],
 ["Hizala (A): PET kaplamasını sürükleyerek BT ile elle hizalar", "Align (A): drag to align the PET overlay with the CT by hand", "Ausrichten (A): Ziehen richtet das PET-Overlay von Hand am CT aus", "정렬 (A): PET 오버레이를 드래그하여 CT에 수동으로 맞춥니다", "位置合わせ (A)：PETオーバーレイをドラッグしてCTに手動で合わせます", "Совмещение (A): перетаскиванием вручную совмещает наложение ПЭТ с КТ"],
 ["Kontrast, renk, kaplama ve hizalama ayarlarını açar ya da kapatır", "Shows or hides the contrast, color, overlay and alignment settings", "Blendet die Einstellungen für Kontrast, Farbe, Overlay und Ausrichtung ein oder aus", "대비, 색상, 오버레이, 정렬 설정을 열거나 닫습니다", "コントラスト、カラー、オーバーレイ、位置合わせの設定を開閉します", "Открывает или закрывает настройки контраста, цвета, наложения и совмещения"],
 ["Hazır pencere ayarını seçer (BT, MR ya da PET için)", "Picks a ready-made window setting (for CT, MR or PET)", "Wählt eine fertige Fenstereinstellung (für CT, MR oder PET)", "준비된 윈도우 설정을 선택합니다 (CT, MR, PET용)", "用意されたウィンドウ設定を選択します（CT、MR、PET用）", "Выбирает готовую настройку окна (для КТ, МР или ПЭТ)"],
 ["Pencere genişliği: büyüdükçe kontrast azalır, daha geniş yoğunluk aralığı görünür", "Window width: a larger value lowers the contrast and shows a wider intensity range", "Fensterbreite: Ein größerer Wert senkt den Kontrast und zeigt einen größeren Intensitätsbereich", "윈도우 폭: 클수록 대비가 낮아지고 더 넓은 강도 범위가 보입니다", "ウィンドウ幅：大きいほどコントラストが下がり、より広い濃度範囲が表示されます", "Ширина окна: чем больше значение, тем ниже контраст и шире показанный диапазон интенсивности"],
 ["Pencere merkezi: görüntünün hangi yoğunluk düzeyine odaklanıldığını belirler", "Window level: sets which intensity the image is centered on", "Fensterlage: legt fest, auf welche Intensität das Bild zentriert ist", "윈도우 레벨: 이미지가 어떤 강도에 맞춰 표시되는지 정합니다", "ウィンドウレベル：画像がどの濃度を中心に表示されるかを決めます", "Уровень окна: определяет, вокруг какой интенсивности центрируется изображение"],
 ["Görüntünün renk haritasını seçer", "Selects the color map of the image", "Wählt die Farbtabelle des Bildes", "이미지의 컬러맵을 선택합니다", "画像のカラーマップを選択します", "Выбирает цветовую карту изображения"],
 ["Gama: orta tonların parlaklığını değiştirir", "Gamma: changes the brightness of the mid-tones", "Gamma: ändert die Helligkeit der Mitteltöne", "감마: 중간 톤의 밝기를 바꿉니다", "ガンマ：中間調の明るさを変えます", "Гамма: меняет яркость средних тонов"],
 ["Siyah ile beyazı birbiriyle değiştirir", "Swaps black and white", "Vertauscht Schwarz und Weiß", "검정과 흰색을 서로 바꿉니다", "黒と白を入れ替えます", "Меняет местами чёрный и белый"],
 ["PET gibi ikinci bir seriyi taban görüntünün üstüne bindirir", "Overlays a second series such as PET on top of the base image", "Legt eine zweite Serie wie PET über das Basisbild", "PET 같은 두 번째 시리즈를 기본 이미지 위에 겹칩니다", "PETなどの2つ目のシリーズをベース画像に重ねます", "Накладывает вторую серию, например ПЭТ, поверх основного изображения"],
 ["Kaplamanın renk haritasını seçer", "Selects the color map of the overlay", "Wählt die Farbtabelle des Overlays", "오버레이의 컬러맵을 선택합니다", "オーバーレイのカラーマップを選択します", "Выбирает цветовую карту наложения"],
 ["Kaplamanın saydamlığını ayarlar", "Adjusts the opacity of the overlay", "Stellt die Deckkraft des Overlays ein", "오버레이의 불투명도를 조절합니다", "オーバーレイの不透明度を調整します", "Регулирует непрозрачность наложения"],
 ["Kaplamada gösterilecek en düşük değer", "Lowest value shown in the overlay", "Niedrigster im Overlay angezeigter Wert", "오버레이에 표시할 최솟값", "オーバーレイに表示する最小値", "Наименьшее значение, показываемое в наложении"],
 ["Kaplamada gösterilecek en yüksek değer", "Highest value shown in the overlay", "Höchster im Overlay angezeigter Wert", "오버레이에 표시할 최댓값", "オーバーレイに表示する最大値", "Наибольшее значение, показываемое в наложении"],
 ["Kaplama değer aralığını görüntüden otomatik hesaplar", "Calculates the overlay value range automatically from the image", "Berechnet den Wertebereich des Overlays automatisch aus dem Bild", "이미지에서 오버레이 값 범위를 자동으로 계산합니다", "画像からオーバーレイの値の範囲を自動計算します", "Автоматически вычисляет диапазон значений наложения по изображению"],
 ["Kaplamayı sağa sola mm cinsinden kaydırır", "Shifts the overlay left or right in mm", "Verschiebt das Overlay in mm nach links oder rechts", "오버레이를 좌우로 mm 단위로 이동합니다", "オーバーレイを左右にmm単位で移動します", "Сдвигает наложение влево или вправо в мм"],
 ["Kaplamayı öne arkaya mm cinsinden kaydırır", "Shifts the overlay forward or backward in mm", "Verschiebt das Overlay in mm nach vorn oder hinten", "오버레이를 앞뒤로 mm 단위로 이동합니다", "オーバーレイを前後にmm単位で移動します", "Сдвигает наложение вперёд или назад в мм"],
 ["Kaplamayı yukarı aşağı mm cinsinden kaydırır", "Shifts the overlay up or down in mm", "Verschiebt das Overlay in mm nach oben oder unten", "오버레이를 위아래로 mm 단위로 이동합니다", "オーバーレイを上下にmm単位で移動します", "Сдвигает наложение вверх или вниз в мм"],
 ["Ok düğmelerinin her basışta kaydıracağı mm miktarı", "Amount in mm that each press of the arrow buttons shifts the overlay", "Betrag in mm, um den jeder Druck auf die Pfeiltasten das Overlay verschiebt", "화살표 버튼을 한 번 누를 때 이동하는 mm 양", "矢印ボタンを1回押すごとの移動量（mm）", "Величина сдвига в мм за одно нажатие стрелок"],
 ["Kaplama kaydırmasını sıfırlar", "Resets the overlay shift", "Setzt die Overlay-Verschiebung zurück", "오버레이 이동량을 초기화합니다", "オーバーレイのシフトをリセットします", "Сбрасывает сдвиг наложения"],
 ["Konulan işaretleri ve ölçümleri listeler", "Lists the placed markers and measurements", "Listet die gesetzten Markierungen und Messungen auf", "찍은 마커와 측정 목록을 표시합니다", "置いたマーカーと計測の一覧を表示します", "Показывает список поставленных меток и измерений"],
 ["Dosyanın DICOM etiketlerini (başlık bilgilerini) gösterir", "Shows the DICOM tags (header information) of the file", "Zeigt die DICOM-Tags (Header-Informationen) der Datei", "파일의 DICOM 태그(헤더 정보)를 표시합니다", "ファイルのDICOMタグ（ヘッダー情報）を表示します", "Показывает теги DICOM (данные заголовка) файла"],
 ["İşaretleri ve ölçümleri CSV olarak panoya kopyalar", "Copies the markers and measurements to the clipboard as CSV", "Kopiert die Markierungen und Messungen als CSV in die Zwischenablage", "마커와 측정값을 CSV로 클립보드에 복사합니다", "マーカーと計測値をCSVとしてクリップボードにコピーします", "Копирует метки и измерения в буфер обмена в формате CSV"],
 ["Bu seriye ait tüm işaret ve ölçümleri siler", "Deletes all markers and measurements of this series", "Löscht alle Markierungen und Messungen dieser Serie", "이 시리즈의 모든 마커와 측정을 삭제합니다", "このシリーズのすべてのマーカーと計測を削除します", "Удаляет все метки и измерения этой серии"],
 ["İlk görünüm", "Initial view", "Ausgangsansicht", "초기 화면", "初期表示", "Исходный вид"],
 ["Görünümü dosya ilk yüklendiğindeki haline getirir: tüm seriler ayrı kutularda, ortalanmış, yakınlaştırmasız, varsayılan kontrast", "Restores the view to how it looked when the file was first loaded: all series in separate cells, centered, no zoom, default contrast", "Stellt die Ansicht wie beim ersten Laden der Datei wieder her: alle Serien in getrennten Feldern, zentriert, ohne Zoom, Standardkontrast", "파일을 처음 불러왔을 때의 화면으로 되돌립니다: 모든 시리즈를 개별 칸에, 가운데 정렬, 확대 없음, 기본 대비", "ファイルを最初に読み込んだ時の表示に戻します：すべてのシリーズを別々のセルに、中央揃え、ズームなし、既定のコントラスト", "Возвращает вид, как при первой загрузке файла: все серии в отдельных ячейках, по центру, без увеличения, контраст по умолчанию"],
 ["İlk görünüme dönüldü: tüm seriler ayrı kutularda, ortalanmış, varsayılan kontrast.", "Back to the initial view: all series in separate cells, centered, default contrast.", "Zurück zur Ausgangsansicht: alle Serien in getrennten Feldern, zentriert, Standardkontrast.", "초기 화면으로 돌아왔습니다: 모든 시리즈를 개별 칸에, 가운데 정렬, 기본 대비.", "初期表示に戻しました：すべてのシリーズを別々のセルに、中央揃え、既定のコントラスト。", "Возврат к исходному виду: все серии в отдельных ячейках, по центру, контраст по умолчанию."],
 ["İlk görünüme dönüldü: 3 kesit, ortalanmış, varsayılan kontrast.", "Back to the initial view: 3 planes, centered, default contrast.", "Zurück zur Ausgangsansicht: 3 Ebenen, zentriert, Standardkontrast.", "초기 화면으로 돌아왔습니다: 3개 평면, 가운데 정렬, 기본 대비.", "初期表示に戻しました：3断面、中央揃え、既定のコントラスト。", "Возврат к исходному виду: 3 плоскости, по центру, контраст по умолчанию."],
 ["Seçtiğiniz klasörün içindeki tüm DICOM dosyalarını okur ve mevcut serilerin üstüne ekler. Dosya seçici klasörün içine giriyorsa bu düğmeyi kullanın", "Reads all DICOM files in the folder you choose and adds them to the existing series. Use this button if the file picker enters the folder instead of selecting it", "Liest alle DICOM-Dateien des gewählten Ordners und fügt sie den vorhandenen Serien hinzu. Verwenden Sie diese Schaltfläche, wenn die Dateiauswahl in den Ordner hineinwechselt, statt ihn auszuwählen", "선택한 폴더 안의 모든 DICOM 파일을 읽어 기존 시리즈에 추가합니다. 파일 선택 창이 폴더 안으로 들어가 버리면 이 버튼을 사용하세요", "選択したフォルダ内のすべてのDICOMファイルを読み込み、既存のシリーズに追加します。ファイル選択画面でフォルダの中に入ってしまう場合はこのボタンを使用してください", "Считывает все файлы DICOM из выбранной папки и добавляет их к уже загруженным сериям. Используйте эту кнопку, если окно выбора файлов заходит внутрь папки"],
 ["Açı", "Angle", "Winkel", "각도", "角度", "Угол"],
 ["Cihaz", "Device", "Gerät", "장비", "装置", "Аппарат"],
 ["Varian (180° altta)", "Varian (180° at bottom)", "Varian (180° unten)", "Varian (180° 아래)", "Varian（180°が下）", "Varian (180° внизу)"],
 ["Elekta (0° altta)", "Elekta (0° at bottom)", "Elekta (0° unten)", "Elekta (0° 아래)", "Elekta（0°が下）", "Elekta (0° внизу)"],
 ["Tüm kesitlerin kenarında 0-360° açı skalasını gösterir ya da gizler", "Shows or hides a 0-360° angle scale around the edges of every view", "Blendet am Rand jeder Ansicht eine 0-360°-Winkelskala ein oder aus", "모든 슬라이스 가장자리에 0–360° 각도 눈금을 표시하거나 숨깁니다", "すべてのビューの端に0〜360°の角度目盛りを表示または非表示にします", "Показывает или скрывает шкалу углов 0–360° по краям всех изображений"],
 ["Cihaz seçimi: Varian'da 180° görüntünün altında, Elekta'da 0° altında yer alır", "Device choice: on Varian 180° is at the bottom of the image, on Elekta 0° is at the bottom", "Geräteauswahl: Bei Varian liegt 180° unten im Bild, bei Elekta liegt 0° unten", "장비 선택: Varian은 180°가 이미지 아래, Elekta는 0°가 아래에 있습니다", "装置の選択：Varianでは180°が画像の下、Elektaでは0°が下になります", "Выбор аппарата: у Varian 180° внизу изображения, у Elekta внизу 0°"],
 ["Görüntüleri kaldır", "Remove images", "Bilder entfernen", "이미지 제거", "画像を削除", "Удалить изображения"],
 ["Yüklenen tüm görüntüleri ve işaretleri kaldırır. Yeni bir hastaya geçerken kullanın", "Removes all loaded images and markers. Use it when moving on to a new patient", "Entfernt alle geladenen Bilder und Markierungen. Verwenden Sie dies beim Wechsel zu einem neuen Patienten", "불러온 모든 이미지와 마커를 제거합니다. 새 환자로 넘어갈 때 사용하세요", "読み込んだすべての画像とマーカーを削除します。新しい患者に切り替えるときに使用します", "Удаляет все загруженные изображения и метки. Используйте при переходе к новому пациенту"],
 ["Seriyi kapat", "Close series", "Serie schließen", "시리즈 닫기", "シリーズを閉じる", "Закрыть серию"],
 ["Seriyi kapatır. Üzerindeki işaretler alttaki listede kalır ve işarete basınca seri yeniden açılır", "Closes the series. Its markers stay in the list below and clicking a marker reopens the series", "Schließt die Serie. Ihre Markierungen bleiben in der Liste unten und ein Klick auf eine Markierung öffnet die Serie wieder", "시리즈를 닫습니다. 마커는 아래 목록에 남고 마커를 누르면 시리즈가 다시 열립니다", "シリーズを閉じます。マーカーは下のリストに残り、マーカーを押すとシリーズが再び開きます", "Закрывает серию. Метки остаются в списке ниже, а нажатие на метку снова открывает серию"],
 ["Tüm işaretler", "All markers", "Alle Markierungen", "모든 마커", "すべてのマーカー", "Все метки"],
 ["Bu işarete gider. Seri kapalıysa yeniden açılır", "Jumps to this marker. If the series is closed it is reopened", "Springt zu dieser Markierung. Ist die Serie geschlossen, wird sie wieder geöffnet", "이 마커로 이동합니다. 시리즈가 닫혀 있으면 다시 엽니다", "このマーカーへ移動します。シリーズが閉じている場合は再び開きます", "Переходит к этой метке. Если серия закрыта, она открывается снова"],
 ["Seri kapatıldı.", "Series closed.", "Serie geschlossen.", "시리즈를 닫았습니다.", "シリーズを閉じました。", "Серия закрыта."],
 ["Seri kapatıldı. İşaretleri alttaki listede kaldı.", "Series closed. Its markers remain in the list below.", "Serie geschlossen. Ihre Markierungen bleiben in der Liste unten.", "시리즈를 닫았습니다. 마커는 아래 목록에 남아 있습니다.", "シリーズを閉じました。マーカーは下のリストに残っています。", "Серия закрыта. Её метки остались в списке ниже."],
 ["Güncelle", "Update", "Aktualisieren", "업데이트", "更新", "Обновить"],
 ["Yeni sürüm olup olmadığına bakar. Varsa indirir ve programı yeniler. İnternet gerekir, güncellemeden sonra program yine çevrimdışı çalışır", "Checks whether a new version exists. If so, it downloads it and reloads the program. Needs internet. After the update the program works offline again", "Prüft, ob eine neue Version vorliegt. Falls ja, wird sie heruntergeladen und das Programm neu geladen. Internet erforderlich. Nach dem Update läuft das Programm wieder offline", "새 버전이 있는지 확인합니다. 있으면 다운로드하여 프로그램을 새로 고칩니다. 인터넷이 필요하며 업데이트 후에는 다시 오프라인으로 사용할 수 있습니다", "新しいバージョンがあるか確認します。ある場合はダウンロードしてプログラムを再読み込みします。インターネット接続が必要で、更新後は再びオフラインで使えます", "Проверяет, есть ли новая версия. Если есть, скачивает её и перезагружает программу. Нужен интернет. После обновления программа снова работает офлайн"],
 ["Yeni sürüm olup olmadığına bakar. Varsa yeni HTML dosyasını indirip kaydeder. İnternet gerekir. Program açıldıktan sonraki ilk 1 dakika içinde kendisi de bir kez kontrol eder", "Checks whether a new version exists. If so, it downloads and saves the new HTML file. Needs internet. The program also checks once by itself during the first minute after opening", "Prüft, ob eine neue Version vorliegt. Falls ja, wird die neue HTML-Datei heruntergeladen und gespeichert. Internet erforderlich. In der ersten Minute nach dem Öffnen prüft das Programm auch selbst einmal", "새 버전이 있는지 확인합니다. 있으면 새 HTML 파일을 다운로드하여 저장합니다. 인터넷이 필요합니다. 프로그램을 연 후 처음 1분 동안 프로그램이 스스로도 한 번 확인합니다", "新しいバージョンがあるか確認します。ある場合は新しいHTMLファイルをダウンロードして保存します。インターネット接続が必要です。起動後の最初の1分間はプログラム自身も一度確認します", "Проверяет, есть ли новая версия. Если есть, скачивает и сохраняет новый HTML-файл. Нужен интернет. В первую минуту после запуска программа также один раз проверяет сама"],
 ["Sürüm kontrol ediliyor.", "Checking the version.", "Version wird geprüft.", "버전을 확인하는 중입니다.", "バージョンを確認中です。", "Проверка версии."],
 ["Yeni sürüm indiriliyor.", "Downloading the new version.", "Die neue Version wird heruntergeladen.", "새 버전을 다운로드하는 중입니다.", "新しいバージョンをダウンロード中です。", "Скачивается новая версия."],
 ["Çevrimdışısınız. Güncelleme için internet gerekir. Program mevcut sürümle çalışmaya devam eder.", "You are offline. Updating needs an internet connection. The program keeps working with the current version.", "Sie sind offline. Für das Update ist eine Internetverbindung nötig. Das Programm läuft mit der aktuellen Version weiter.", "오프라인 상태입니다. 업데이트에는 인터넷 연결이 필요합니다. 프로그램은 현재 버전으로 계속 작동합니다.", "オフラインです。更新にはインターネット接続が必要です。プログラムは現在のバージョンで引き続き動作します。", "Нет подключения к интернету. Для обновления нужен интернет. Программа продолжает работать в текущей версии."],
 ["Sürüm bilgisi alınamadı. İnternet bağlantısını kontrol edin.", "Could not get the version information. Check your internet connection.", "Die Versionsinformation konnte nicht abgerufen werden. Prüfen Sie die Internetverbindung.", "버전 정보를 가져올 수 없습니다. 인터넷 연결을 확인하세요.", "バージョン情報を取得できませんでした。インターネット接続を確認してください。", "Не удалось получить сведения о версии. Проверьте подключение к интернету."],
 ["İşaretler / Etiketler", "Markers / Tags", "Markierungen / Tags", "마커 / 태그", "マーカー / タグ", "Метки / Теги"],
 ["İşaretler, ölçümler ve DICOM etiketleri panelini açar ya da kapatır", "Opens or closes the panel with markers, measurements and DICOM tags", "Öffnet oder schließt das Feld mit Markierungen, Messungen und DICOM-Tags", "마커, 측정값, DICOM 태그 패널을 열거나 닫습니다", "マーカー、計測、DICOMタグのパネルを開閉します", "Открывает или закрывает панель меток, измерений и DICOM-тегов"],
 ["Paneli kapatır", "Closes the panel", "Schließt das Feld", "패널을 닫습니다", "パネルを閉じます", "Закрывает панель"],
 ["İşaretler ve etiketler", "Markers and tags", "Markierungen und Tags", "마커와 태그", "マーカーとタグ", "Метки и теги"],
 ["Güncelleme", "Update available", "Update verfügbar", "업데이트 있음", "更新あり", "Есть обновление"],
 ["Güncel", "Up to date", "Aktuell", "최신", "最新", "Актуально"],
 ["Çevrimdışısınız", "Offline", "Offline", "오프라인", "オフライン", "Офлайн"],
 ["İnternet bağlantısı yok. Güncelleme kontrol edilemiyor. Program bu sürümle çalışmaya devam eder", "No internet connection. Updates cannot be checked. The program keeps working with this version", "Keine Internetverbindung. Updates können nicht geprüft werden. Das Programm läuft mit dieser Version weiter", "인터넷에 연결되어 있지 않습니다. 업데이트를 확인할 수 없습니다. 프로그램은 현재 버전으로 계속 작동합니다", "インターネットに接続されていません。更新を確認できません。プログラムはこのバージョンで引き続き動作します", "Нет подключения к интернету. Проверить обновления нельзя. Программа продолжает работать в этой версии"],
 ["Güncelleme var", "Update available", "Update verfügbar", "업데이트 있음", "更新があります", "Доступно обновление"],
 ["İndir", "Download", "Herunterladen", "다운로드", "ダウンロード", "Скачать"],
 ["Şimdi değil", "Not now", "Jetzt nicht", "나중에", "後で", "Не сейчас"],
 ["Yeni sürümü indirip kaydeder", "Downloads and saves the new version", "Lädt die neue Version herunter und speichert sie", "새 버전을 다운로드하여 저장합니다", "新しいバージョンをダウンロードして保存します", "Скачивает и сохраняет новую версию"],
 ["Şimdilik indirmez. Daha sonra Güncelle düğmesiyle indirebilirsiniz", "Does not download for now. You can download it later with the Update button", "Lädt vorerst nicht herunter. Später können Sie über Aktualisieren herunterladen", "지금은 다운로드하지 않습니다. 나중에 업데이트 버튼으로 다운로드할 수 있습니다", "今はダウンロードしません。後で更新ボタンからダウンロードできます", "Пока не скачивать. Позже можно скачать кнопкой «Обновить»"],
 ["Yenilikler penceresini kapatır", "Closes the What's new window", "Schließt das Fenster Neuigkeiten", "새로운 기능 창을 닫습니다", "新機能ウィンドウを閉じます", "Закрывает окно «Что нового»"],
 ["İşaretlenirse bu sürümün yenilikleri bir daha gösterilmez", "If ticked, this version's news will not be shown again", "Wenn angekreuzt, werden die Neuigkeiten dieser Version nicht mehr angezeigt", "선택하면 이 버전의 새로운 기능을 다시 표시하지 않습니다", "チェックすると、このバージョンの新機能は再表示されません", "Если отмечено, новости этой версии больше не показываются"],
 ["Yeni sürüm şimdi indirilmedi. İstediğinizde Güncelle düğmesine basın.", "The new version was not downloaded now. Press the Update button whenever you like.", "Die neue Version wurde jetzt nicht heruntergeladen. Drücken Sie jederzeit auf Aktualisieren.", "새 버전을 지금 다운로드하지 않았습니다. 원할 때 업데이트 버튼을 누르세요.", "新しいバージョンは今はダウンロードしませんでした。必要なときに更新ボタンを押してください。", "Новая версия сейчас не скачана. Нажмите «Обновить», когда захотите."],
 ["Güncelleme indirilemedi. İnternet bağlantısını kontrol edin.", "The update could not be downloaded. Check your internet connection.", "Das Update konnte nicht heruntergeladen werden. Prüfen Sie die Internetverbindung.", "업데이트를 다운로드할 수 없습니다. 인터넷 연결을 확인하세요.", "更新をダウンロードできませんでした。インターネット接続を確認してください。", "Не удалось скачать обновление. Проверьте подключение к интернету."],
 ["Güncelleme tamamlanamadı. Sayfayı yenileyip tekrar deneyin.", "The update could not be completed. Reload the page and try again.", "Das Update konnte nicht abgeschlossen werden. Laden Sie die Seite neu und versuchen Sie es erneut.", "업데이트를 완료할 수 없습니다. 페이지를 새로 고친 후 다시 시도하세요.", "更新を完了できませんでした。ページを再読み込みしてもう一度お試しください。", "Не удалось завершить обновление. Обновите страницу и повторите попытку."],
];
const EXACT={};LANGS.forEach(l=>{EXACT[l]={};});
EXACT_ROWS.forEach(r=>LANGS.forEach((l,i)=>{EXACT[l][r[0]]=r[i+1];}));

/* ifade kalıpları: [kaynak (düz metin ya da RegExp), EN, DE, KO, JA, RU] */
const lit=s=>new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g');
const PHR_ROWS=[
 [lit("Dosya okunamadı. Sayfa Dosyalar uygulamasının önizlemesinde açıldıysa tarayıcı seçilen dosyaya erişemez. Sayfayı Claude uygulamasındaki bağlantıdan ya da Safari ile açın."),"The file could not be read. If the page was opened in the Files app preview, the browser cannot access the selected file. Open the page with Safari or from the link in the Claude app.","Die Datei konnte nicht gelesen werden. Wurde die Seite in der Vorschau der Dateien-App geöffnet, kann der Browser nicht auf die gewählte Datei zugreifen. Öffnen Sie die Seite mit Safari oder über den Link in der Claude-App.","파일을 읽을 수 없습니다. 페이지가 파일 앱 미리보기에서 열렸다면 브라우저가 선택한 파일에 접근할 수 없습니다. Safari 또는 Claude 앱의 링크로 페이지를 여세요.","ファイルを読み込めませんでした。ページが「ファイル」アプリのプレビューで開かれた場合、ブラウザは選択したファイルにアクセスできません。SafariまたはClaudeアプリのリンクからページを開いてください。","Не удалось прочитать файл. Если страница открыта в предпросмотре приложения «Файлы», браузер не имеет доступа к выбранному файлу. Откройте страницу в Safari или по ссылке из приложения Claude."],
 [lit("Seri açılamadı: "),"Could not open series: ","Serie konnte nicht geöffnet werden: ","시리즈를 열 수 없습니다: ","シリーズを開けませんでした：","Не удалось открыть серию: "],
 [lit("Görünüm değiştirilemedi: "),"Could not change the view: ","Ansicht konnte nicht geändert werden: ","보기를 변경할 수 없습니다: ","表示を変更できませんでした：","Не удалось изменить вид: "],
 [lit("Bırakılamadı: "),"Could not drop: ","Ablegen fehlgeschlagen: ","놓을 수 없습니다: ","ドロップできませんでした：","Не удалось перетащить: "],
 [lit("Füzyon kurulamadı: "),"Could not set up fusion: ","Fusion konnte nicht eingerichtet werden: ","융합을 설정할 수 없습니다: ","フュージョンを設定できませんでした：","Не удалось настроить слияние: "],
 [lit("Hacim hazırlanıyor: "),"Preparing volume: ","Volumen wird vorbereitet: ","볼륨 준비 중: ","ボリュームを準備中：","Подготовка объёма: "],
 [lit("Bazı seriler açılamadı. "),"Some series could not be opened. ","Einige Serien konnten nicht geöffnet werden. ","일부 시리즈를 열 수 없었습니다. ","一部のシリーズを開けませんでした。","Некоторые серии не удалось открыть. "],
 [new RegExp("(\\d+) × (\\d+) düzen\\. Bir kutuya dokunarak seçin\\. Çift dokunma o seriyi 3 kesitte açar\\.","g"),"$1 × $2 layout. Tap a cell to select it. A double tap opens that series in 3 planes.","$1 × $2 Layout. Tippen Sie auf ein Feld, um es zu wählen. Doppeltippen öffnet die Serie in 3 Ebenen.","$1 × $2 레이아웃. 칸을 탭하여 선택하세요. 두 번 탭하면 해당 시리즈가 3개 평면으로 열립니다.","$1 × $2 レイアウト。セルをタップして選択します。ダブルタップするとそのシリーズが3断面で開きます。","Раскладка $1 × $2. Нажмите на ячейку, чтобы выбрать её. Двойное нажатие открывает серию в 3 плоскостях."],
 [lit("İşaretleme için bir kutuya çift tıklayın. Seri 3 kesit görünümünde açılır."),"To place markers, double-click a cell. The series opens in the 3-plane view.","Zum Markieren ein Feld doppelklicken. Die Serie öffnet sich in der 3-Ebenen-Ansicht.","마커를 찍으려면 칸을 더블클릭하세요. 시리즈가 3개 평면 보기로 열립니다.","マーカーを置くには、セルをダブルクリックしてください。シリーズが3断面表示で開きます。","Чтобы поставить метку, дважды щёлкните по ячейке. Серия откроется в виде 3 плоскостей."],
 [lit("Füzyon için bir BT ya da MR serisi ile bir PET serisi gerekli."),"Fusion needs a CT or MR series and a PET series.","Für die Fusion werden eine CT- oder MR-Serie und eine PET-Serie benötigt.","융합에는 CT 또는 MR 시리즈와 PET 시리즈가 필요합니다.","フュージョンにはCTまたはMRシリーズとPETシリーズが必要です。","Для слияния нужны серия КТ или МР и серия ПЭТ."],
 [lit(". Hizala aracını ya da Ayarlar bölümündeki Kaydırma alanlarını kullanın. Başka PET için Kaplama listesini kullanın."),". Use the Align tool or the Shift fields under Settings to align. Use the Overlay list for a different PET.",". Zum Ausrichten das Werkzeug Ausrichten oder die Felder Verschiebung unter Einstellungen verwenden. Für ein anderes PET die Overlay-Liste benutzen.",". 정렬하려면 정렬 도구 또는 설정의 이동 입력란을 사용하세요. 다른 PET은 오버레이 목록에서 선택하세요.","。位置合わせには「位置合わせ」ツール、または設定のシフト欄を使用してください。別のPETはオーバーレイのリストから選択します。",". Для совмещения используйте инструмент «Совместить» или поля «Сдвиг» в настройках. Для другой серии ПЭТ выберите её в списке «Наложение»."],
 [lit("Füzyon: "),"Fusion: ","Fusion: ","융합: ","フュージョン：","Слияние: "],
 [new RegExp("(\\d+) dosya okundu","g"),"$1 files read","$1 Dateien gelesen","파일 $1개를 읽었습니다","$1 件のファイルを読み込みました","Прочитано файлов: $1"],
 [new RegExp("(\\d+) dosya okunuyor","g"),"$1 files are being read","$1 Dateien werden gelesen","파일 $1개를 읽는 중입니다","$1 件のファイルを読み込み中です","Читается файлов: $1"],
 [new RegExp(", (\\d+) dosya atlandı","g"),", $1 files skipped",", $1 Dateien übersprungen",", 파일 $1개 건너뜀","、$1 件のファイルをスキップしました",", пропущено файлов: $1"],
 [new RegExp("(\\d+) yeni seri eklendi","g"),"$1 new series added","$1 neue Serien hinzugefügt","새 시리즈 $1개를 추가했습니다","新しいシリーズを $1 件追加しました","Добавлено новых серий: $1"],
 [new RegExp(", (\\d+) seri zaten yüklüydü","g"),", $1 series were already loaded",", $1 Serien waren bereits geladen",", 시리즈 $1개는 이미 불러온 상태였습니다","、$1 件のシリーズは既に読み込み済みでした",", серий, уже загруженных ранее: $1"],
 [new RegExp("Toplam (\\d+) seri\\.","g"),"Total: $1 series.","Insgesamt $1 Serien.","총 $1개 시리즈입니다.","合計 $1 シリーズです。","Всего серий: $1."],
 [lit("Hafif mod: görüntüler yarı çözünürlükte, ölçümler yine mm cinsinden."),"Light mode: images are at half resolution, measurements are still in mm.","Sparmodus: Die Bilder haben halbe Auflösung, Messungen bleiben in mm.","절전 모드: 이미지는 절반 해상도로 표시되며 측정값은 여전히 mm 단위입니다.","軽量モード：画像は半分の解像度で表示されますが、計測値は引き続きmm単位です。","Лёгкий режим: изображения в половинном разрешении, измерения по-прежнему в мм."],
 [lit("Seriler ayrı kutularda gösteriliyor."),"Series are shown in separate cells.","Die Serien werden in separaten Feldern angezeigt.","시리즈가 별도의 칸에 표시됩니다.","シリーズを別々のセルに表示しています。","Серии показаны в отдельных ячейках."],
 [lit("Birleştirmek için BT/MR ya da PET kutusunu seçip Füzyon düğmesine basın."),"To fuse them, select the CT/MR or PET cell and press the Fusion button.","Zum Fusionieren das CT/MR- oder PET-Feld wählen und die Schaltfläche Fusion drücken.","융합하려면 CT/MR 또는 PET 칸을 선택하고 융합 버튼을 누르세요.","フュージョンするには、CT/MRまたはPETのセルを選択してフュージョンボタンを押してください。","Чтобы совместить серии, выберите ячейку КТ/МР или ПЭТ и нажмите кнопку «Слияние»."],
 [lit("Dosyalar hazırlanıyor"),"Preparing files","Dateien werden vorbereitet","파일을 준비하는 중","ファイルを準備中","Подготовка файлов"],
 [lit("Seçilen dosyalarda okunacak içerik bulunamadı."),"No readable content was found in the selected files.","In den gewählten Dateien wurde kein lesbarer Inhalt gefunden.","선택한 파일에서 읽을 수 있는 내용을 찾지 못했습니다.","選択したファイルに読み込める内容が見つかりませんでした。","В выбранных файлах не найдено данных для чтения."],
 [lit("Hiçbir dosya açılamadı."),"No file could be opened.","Keine Datei konnte geöffnet werden.","열 수 있는 파일이 없습니다.","開けるファイルがありませんでした。","Ни один файл не удалось открыть."],
 [new RegExp("Seçilen seri(ler)? zaten yüklü\\. Yeni seri eklenmedi\\.","g"),"The selected series are already loaded. No new series were added.","Die gewählten Serien sind bereits geladen. Es wurde keine neue Serie hinzugefügt.","선택한 시리즈는 이미 불러온 상태입니다. 새 시리즈가 추가되지 않았습니다.","選択したシリーズは既に読み込み済みです。新しいシリーズは追加されませんでした。","Выбранные серии уже загружены. Новые серии не добавлены."],
 [lit("İşaretler panoya kopyalandı."),"Markers copied to the clipboard.","Markierungen in die Zwischenablage kopiert.","마커를 클립보드에 복사했습니다.","マーカーをクリップボードにコピーしました。","Метки скопированы в буфер обмена."],
 [lit("Pano erişimi reddedildi. Metni kutudan elle kopyalayın."),"Clipboard access was denied. Copy the text from the box manually.","Zugriff auf die Zwischenablage verweigert. Kopieren Sie den Text manuell aus dem Feld.","클립보드 접근이 거부되었습니다. 입력란의 텍스트를 직접 복사하세요.","クリップボードへのアクセスが拒否されました。ボックス内のテキストを手動でコピーしてください。","Доступ к буферу обмена запрещён. Скопируйте текст из поля вручную."],
 [lit("Taban ve kaplama aynı seri olamaz."),"The base and the overlay cannot be the same series.","Basis und Overlay dürfen nicht dieselbe Serie sein.","기준 이미지와 오버레이는 같은 시리즈일 수 없습니다.","ベース画像とオーバーレイを同じシリーズにすることはできません。","Основное изображение и наложение не могут быть одной и той же серией."],
 [lit("Uyarı: iki seri farklı referans çerçevesinde (Frame of Reference). Hizalama doğru olmayabilir."),"Warning: the two series use different frames of reference. Alignment may be inaccurate.","Warnung: Die beiden Serien haben unterschiedliche Bezugssysteme (Frame of Reference). Die Ausrichtung ist möglicherweise ungenau.","경고: 두 시리즈의 기준 좌표계(Frame of Reference)가 다릅니다. 정렬이 정확하지 않을 수 있습니다.","警告：2つのシリーズの基準座標系（Frame of Reference）が異なります。位置合わせが不正確になる可能性があります。","Предупреждение: у двух серий разные системы координат (Frame of Reference). Совмещение может быть неточным."],
 [lit(". Uyarı: kesit aralığı düzensiz ya da kesitler aynı konumda, koronal ve sagittal görünümler bozuk olabilir."),". Warning: slice spacing is irregular or slices share a position, so coronal and sagittal views may be distorted.",". Warnung: Der Schichtabstand ist unregelmäßig oder Schichten liegen an derselben Position, daher können koronale und sagittale Ansichten verzerrt sein.",". 경고: 슬라이스 간격이 불규칙하거나 슬라이스가 같은 위치에 있어 관상면과 시상면이 왜곡될 수 있습니다.","。警告：スライス間隔が不規則、またはスライスが同じ位置にあるため、コロナル・サジタル表示が歪む可能性があります。",". Предупреждение: интервал между срезами неравномерный или срезы совпадают по положению, поэтому корональный и сагиттальный виды могут быть искажены."],
 [lit("Bu JPEG türü desteklenmiyor"),"This JPEG type is not supported","Dieser JPEG-Typ wird nicht unterstützt","이 JPEG 유형은 지원되지 않습니다","このJPEG形式には対応していません","Этот тип JPEG не поддерживается"],
 [lit("JPEG verisi çözülemedi"),"The JPEG data could not be decoded","Die JPEG-Daten konnten nicht dekodiert werden","JPEG 데이터를 디코딩할 수 없습니다","JPEGデータをデコードできませんでした","Не удалось декодировать данные JPEG"],
 [lit("Huffman hatası"),"Huffman error","Huffman-Fehler","Huffman 오류","Huffmanエラー","Ошибка Хаффмана"],
 [new RegExp("Desteklenmeyen piksel biti: (\\d+)","g"),"Unsupported bits per pixel: $1","Nicht unterstützte Bits pro Pixel: $1","지원되지 않는 픽셀당 비트 수: $1","対応していないピクセルあたりのビット数：$1","Неподдерживаемое число бит на пиксель: $1"],
 [new RegExp("Desteklenmeyen örnek sayısı: (\\d+)","g"),"Unsupported samples per pixel: $1","Nicht unterstützte Anzahl Samples pro Pixel: $1","지원되지 않는 픽셀당 샘플 수: $1","対応していないピクセルあたりのサンプル数：$1","Неподдерживаемое число выборок на пиксель: $1"],
 [lit("Piksel verisi eksik"),"Pixel data incomplete","Pixeldaten unvollständig","픽셀 데이터가 불완전합니다","ピクセルデータが不完全です","Данные пикселей неполные"],
 [lit("Piksel verisi yok"),"No pixel data","Keine Pixeldaten","픽셀 데이터가 없습니다","ピクセルデータがありません","Нет данных пикселей"],
 [lit("Çok kareli sıkıştırılmış veri desteklenmiyor"),"Compressed multi-frame data is not supported","Komprimierte Mehrbilddaten werden nicht unterstützt","압축된 다중 프레임 데이터는 지원되지 않습니다","圧縮されたマルチフレームデータには対応していません","Сжатые многокадровые данные не поддерживаются"],
 [lit("12 bit JPEG desteklenmiyor"),"12-bit JPEG is not supported","12-Bit-JPEG wird nicht unterstützt","12비트 JPEG는 지원되지 않습니다","12ビットJPEGには対応していません","12-битный JPEG не поддерживается"],
 [lit("JPEG boyutu etiketle uyuşmuyor"),"JPEG size does not match the tag","JPEG-Größe stimmt nicht mit dem Tag überein","JPEG 크기가 태그와 일치하지 않습니다","JPEGのサイズがタグと一致しません","Размер JPEG не соответствует тегу"],
 [new RegExp("Sıkıştırma desteklenmiyor: (.*?)\\. Bu dosyayı sıkıştırılmamış \\(decompressed\\) dışa aktarın","g"),"Compression not supported: $1. Export this file uncompressed (decompressed)","Komprimierung wird nicht unterstützt: $1. Exportieren Sie diese Datei unkomprimiert (decompressed)","압축 방식이 지원되지 않습니다: $1. 이 파일을 비압축(decompressed) 형식으로 내보내세요","圧縮方式に対応していません：$1。このファイルを非圧縮（decompressed）でエクスポートしてください","Сжатие не поддерживается: $1. Экспортируйте этот файл без сжатия (decompressed)"],
 [lit("DICOM dosyası değil"),"Not a DICOM file","Keine DICOM-Datei","DICOM 파일이 아닙니다","DICOMファイルではありません","Это не файл DICOM"],
 [lit("Görüntü verisi içermiyor (RT yapı, rapor vb. olabilir)"),"Contains no image data (may be an RT structure, report, etc.)","Enthält keine Bilddaten (z. B. RT-Struktur oder Bericht)","이미지 데이터가 없습니다(RT 구조, 보고서 등일 수 있음)","画像データを含んでいません（RT構造、レポートなどの可能性があります）","Не содержит данных изображения (возможно, структура RT, отчёт и т. п.)"],
 [lit("ZIP dosyası okunamadı"),"The ZIP file could not be read","Die ZIP-Datei konnte nicht gelesen werden","ZIP 파일을 읽을 수 없습니다","ZIPファイルを読み込めませんでした","Не удалось прочитать ZIP-файл"],
 [lit("ZIP kaydı bozuk"),"ZIP entry is corrupt","ZIP-Eintrag ist beschädigt","ZIP 항목이 손상되었습니다","ZIPエントリが破損しています","Запись в ZIP повреждена"],
 [lit("ZIP sıkıştırma yöntemi desteklenmiyor"),"ZIP compression method is not supported","ZIP-Komprimierungsmethode wird nicht unterstützt","ZIP 압축 방식이 지원되지 않습니다","ZIPの圧縮方式に対応していません","Метод сжатия ZIP не поддерживается"],
 [new RegExp("kesit (\\d+)","g"),"slice $1","Schicht $1","슬라이스 $1","スライス $1","срез $1"],
 [new RegExp("(\\d+) kesit(?!\\w)","g"),"$1 slices","$1 Schichten","슬라이스 $1개","$1 スライス","срезов: $1"],
 [lit(" · Seri · ")," · Series · "," · Serie · "," · 시리즈 · "," · シリーズ · "," · Серия · "],
 [new RegExp("(\\d+) görüntü","g"),"$1 images","$1 Bilder","이미지 $1개","$1 画像","изображений: $1"],
 [new RegExp("İşaret (\\d+)","g"),"Marker $1","Markierung $1","마커 $1","マーカー $1","Метка $1"],
 [lit(" · kapalı")," · closed"," · geschlossen"," · 닫힘"," · 閉じています"," · закрыта"],
 [lit(" · renkli")," · color"," · farbig"," · 컬러"," · カラー"," · цветная"],
 [new RegExp("^(\\d+) seri$","g"),"$1 series","$1 Serien","시리즈 $1개","$1 シリーズ","серий: $1"],
 [lit("  ·  parlaklık "),"  ·  brightness ","  ·  Helligkeit ","  ·  밝기 ","  ·  輝度 ","  ·  яркость "],
 [lit("  ·  değer "),"  ·  value ","  ·  Wert ","  ·  값 ","  ·  値 ","  ·  значение "],
 [lit("  ·  bindirme "),"  ·  overlay ","  ·  Overlay ","  ·  오버레이 ","  ·  オーバーレイ ","  ·  наложение "],
 [lit(" · bindirme ")," · overlay "," · Overlay "," · 오버레이 "," · オーバーレイ "," · наложение "],
 [lit("Örnek "),"Sample ","Beispiel ","샘플 ","サンプル ","Пример "],
 [lit("fantom"),"phantom","Phantom","팬텀","ファントム","фантома"],
 [lit("yapay veri"),"synthetic data","synthetische Daten","합성 데이터","合成データ","синтетические данные"],
 [lit("Aksiyel"),"Axial","Axial","축상","アキシャル","Аксиальная"],
 [lit("Koronal"),"Coronal","Koronar","관상","コロナル","Корональная"],
 [lit("Program güncel. Sürüm: "),"The program is up to date. Version: ","Das Programm ist aktuell. Version: ","프로그램이 최신 상태입니다. 버전: ","プログラムは最新です。バージョン：","Программа обновлена. Версия: "],
 [lit("Yeni sürüm yayınlandı: "),"A new version has been released: ","Eine neue Version ist erschienen: ","새 버전이 출시되었습니다: ","新しいバージョンが公開されました：","Вышла новая версия: "],
 [lit(". İndirmek ister misiniz?"),". Do you want to download it?",". Möchten Sie sie herunterladen?",". 다운로드하시겠습니까?","。ダウンロードしますか？",". Скачать её?"],
 [lit("Yeni sürüm bulundu: "),"New version found: ","Neue Version gefunden: ","새 버전 발견: ","新しいバージョンが見つかりました：","Найдена новая версия: "],
 [lit(". İndiriliyor."),". Downloading.",". Wird heruntergeladen.",". 다운로드하는 중입니다.","。ダウンロード中です。",". Скачивается."],
 [lit("Yeni sürüm kaydedildi: "),"New version saved: ","Neue Version gespeichert: ","새 버전 저장됨: ","新しいバージョンを保存しました：","Новая версия сохранена: "],
 [lit(". Dosyayı İndirilenler klasöründen açın. İndirme başlamadıysa Güncelle düğmesine tekrar basın."),". Open the file from your Downloads folder. If the download did not start, press the Update button again.",". Öffnen Sie die Datei aus dem Download-Ordner. Falls der Download nicht begonnen hat, drücken Sie erneut auf Aktualisieren.",". 다운로드 폴더에서 파일을 여세요. 다운로드가 시작되지 않았다면 업데이트 버튼을 다시 누르세요.","。ダウンロードフォルダーからファイルを開いてください。ダウンロードが始まらない場合は更新ボタンをもう一度押してください。",". Откройте файл из папки «Загрузки». Если загрузка не началась, нажмите кнопку «Обновить» ещё раз."],
 [lit("Yeni sürüm hazır: "),"New version ready: ","Neue Version bereit: ","새 버전 준비됨: ","新しいバージョンの準備ができました：","Новая версия готова: "],
 [lit(". Yüklü görüntüler kapanacak. Güncellemek için düğmeye tekrar basın."),". Loaded images will be closed. Press the button again to update.",". Geladene Bilder werden geschlossen. Zum Aktualisieren die Schaltfläche erneut drücken.",". 불러온 이미지가 닫힙니다. 업데이트하려면 버튼을 다시 누르세요.","。読み込んだ画像は閉じられます。更新するにはもう一度ボタンを押してください。",". Загруженные изображения будут закрыты. Для обновления нажмите кнопку ещё раз."],
];
const PHR={};LANGS.forEach((l,i)=>{PHR[l]=PHR_ROWS.map(r=>[r[0],r[i+1]]);});

const TC={};LANGS.forEach(l=>{TC[l]=new Map();});
function TX(s){
  if(LANG==='tr'||s==null||s==='')return s;
  s=String(s);
  const d=EXACT[LANG][s];if(d!==undefined)return d;
  const c=TC[LANG].get(s);if(c!==undefined)return c;
  let r=s;for(const [re,rep] of PHR[LANG])r=r.replace(re,rep);
  if(LANG==='ja')r=r.replace(/([\u3040-\u30ff\u4e00-\u9fff）])\.(?=\s|$)/g,'$1。').replace(/。\s+/g,'。');
  if(TC[LANG].size>3000)TC[LANG].clear();
  TC[LANG].set(s,r);
  return r;
}

/* ---------- karşılama penceresi ve alt bilgi (dile göre) ---------- */
const WELCOME={
tr:{title:'DICOM GÖRÜNTÜLEYİCİ',sub:VER+' · Tomografi, MR, röntgen ve PET görüntülerini tarayıcıda açan tek dosyalık program. Kurulum ve internet gerekmez.',btn:'Anladım, başla',
sign:`Medikal Fizik Uzmanı Yemliha Enes Tüten tarafından geliştirilmiştir. Açık kaynaktır, ücretsiz kullanabilirsiniz. İletişim: <a href="mailto:${MAIL}">${MAIL}</a>`,
body:`<h3>Nerelerde çalışır</h3>
<p>Windows, Mac, Android telefon ve tablet, iPhone ve iPad. Chrome, Safari, Edge ve Firefox ile açılır.</p>
<h3>Nasıl kullanılır</h3>
<ol>
<li>Üstteki <b>ZIP ekle</b> düğmesine basın. DICOM dosyalarını ya da hepsini içeren tek bir ZIP dosyasını seçin. Klasörü bütün olarak yüklemek için <b>Klasör ekle</b> düğmesine basın.</li>
<li>İstediğiniz kadar yeni dosya ekleyebilirsiniz. Eklenen seriler öncekilerin yanında kalır. Hepsini ve işaretleri kaldırmak için <b>Görüntüleri kaldır</b> düğmesine basın. Yeni hastaya böyle geçilir.</li>
<li>Seriler listesinde her serinin küçük resmi görünür. Birini seçmek için üzerine dokunun.</li>
<li><b>Düzen</b> listesinden ızgara seçin (1×1, 2×2, 3×3, 4×4, 6×6). Her kutuda ayrı bir seri görünür.</li>
<li>Bir seriyi küçük resminden tutup istediğiniz kutuya sürükleyin. Telefonda küçük resme biraz basılı tutup sürükleyin. Kutudaki simgeye dokunarak da seri seçebilirsiniz.</li>
<li>Fareyle ya da parmakla kesitler arasında gezin. Bir kutuya çift dokunursanız o seri 3 kesitte açılır.</li>
<li>PET ve BT ayrı görünürken <b>Füzyon</b> düğmesine basın. İki seri üst üste birleşir.</li>
<li>Arayüz dilini <b>Yardım</b> düğmesinin yanındaki listeden seçin: Türkçe, English, Deutsch, 한국어, 日本語 ya da Русский.</li>
</ol>
<h3>Neler yapabilir</h3>
<ul>
<li>Aynı anda üç kesit gösterir: aksiyal, koronal ve sagital. Seçtiğiniz kesit büyük görünür.</li>
<li>Seriler panelinde tüm serileri küçük resimleriyle listeler. Birden çok dosya ya da ZIP üst üste eklenebilir.</li>
<li>Izgarada serileri ayrı ayrı gösterir. Aynı konumdaki kesitleri birlikte kaydırır.</li>
<li>Lokalizer çizgisi gösterir. Örneğin bir kutuda sagital bir kutuda aksiyel seri varsa birinde gezinirken diğerinde bulunduğunuz yer çizgiyle görünür.</li>
<li>Yakınlaştırma, uzaklaştırma ve kaydırma yapar.</li>
<li>Pencere seviyesi ve genişliğini (kontrast) ayarlar. Hazır BT, MR ve PET ayarları vardır.</li>
<li>Cetvelle iki nokta arasındaki mesafeyi ölçer.</li>
<li>Önemli yerlere işaret koyar. Tüm işaretler görüntü adıyla birlikte sayfanın altında listelenir. Bir seriyi kartındaki × ile kapatsanız da işaretleri kalır. İşarete basınca seri yeniden açılır ve o kesite gidilir.</li>
<li>PET ve BT görüntüsünü elle hizalayıp üst üste koyarak füzyon gösterir. Hizala aracıyla sürükleyebilir ya da mm cinsinden kaydırabilirsiniz.</li>
<li>Türkçe, İngilizce, Almanca, Korece, Japonca ve Rusça arayüz sunar.</li>
<li><b>Açı</b> düğmesi tüm kesitlerin kenarında 0-360° açı skalasını gösterir. Cihaz listesinden Varian (180° altta) ya da Elekta (0° altta) seçilir.</li>
<li>Fareyle bir düğmenin üstüne gelince ne işe yaradığını yazar. <b>İlk görünüm</b> düğmesi ekranı dosya ilk yüklendiğinde tüm serilerin ayrı kutularda açıldığı haline döndürür.</li>
<li>Tek dosya olarak da bir web adresinden de çevrimdışı çalışır. <b>Güncelle</b> düğmesi (masaüstünde üst şeritte, telefonda sayfanın altında) yeni sürümü indirir. Tek dosya olarak açıldığında yeni sürüm <i>DICOM GÖRÜNTÜLEYİCİ_tarih_sürüm.html</i> adıyla kaydedilir. Program açıldıktan sonraki ilk 1 dakika içinde yeni sürüme kendisi de bakar ve bulursa indirmeden önce sorar. İnternet yoksa düğmenin yanında <b>Çevrimdışısınız</b> yazar. Her güncellemeden sonra <b>Yenilikler</b> penceresi açılır.</li>
<li>Masaüstünde program her ekranda tek sayfaya sığar, kaydırma gerekmez. İşaretler, ölçümler ve DICOM etiketleri araç çubuğundaki <b>İşaretler / Etiketler</b> düğmesiyle açılan yan paneldedir.</li>
</ul>
<h3>Bilmeniz gerekenler</h3>
<ul>
<li>Görüntüler internete yüklenmez. Her şey kendi cihazınızda kalır.</li>
<li>Tanı koymak için değil yalnızca inceleme amaçlıdır. Yorum için doktorunuza danışın.</li>
<li>iPhone ve iPad'de dosyaya Dosyalar uygulamasında dokunursanız önizleme açılır ve görüntüler okunmaz. Dosyayı Safari ya da Chrome ile açın.</li>
</ul>`},
en:{title:'DICOM VIEWER',sub:VER+' · A single-file program that opens CT, MR, X-ray and PET images in the browser. No installation or internet needed.',btn:'Got it, start',
sign:`Developed by Yemliha Enes Tüten, Medical Physics Expert. Open source and free to use. Contact: <a href="mailto:${MAIL}">${MAIL}</a>`,
body:`<h3>Where it works</h3>
<p>Windows, Mac, Android phones and tablets, iPhone and iPad. It opens in Chrome, Safari, Edge and Firefox.</p>
<h3>How to use</h3>
<ol>
<li>Press the <b>Add ZIP</b> button at the top. Choose DICOM files or a single ZIP file that contains them all. To load a whole folder, press the <b>Add folder</b> button.</li>
<li>You can add as many new files as you like. Added series stay next to the earlier ones. Press <b>Remove images</b> to remove them all together with the markers. This is how you move on to a new patient.</li>
<li>The series list shows a thumbnail of every series. Tap one to select it.</li>
<li>Choose a grid from the <b>Layout</b> list (1×1, 2×2, 3×3, 4×4, 6×6). Each cell shows a separate series.</li>
<li>Grab a series by its thumbnail and drag it into any cell. On a phone, press and hold the thumbnail for a moment, then drag. You can also tap the icon in a cell to choose a series.</li>
<li>Scroll through slices with the mouse or your finger. Double-tapping a cell opens that series in 3 planes.</li>
<li>While PET and CT are shown separately, press the <b>Fusion</b> button. The two series are overlaid.</li>
<li>Choose the interface language from the list next to the <b>Help</b> button: Türkçe, English, Deutsch, 한국어, 日本語 or Русский.</li>
</ol>
<h3>What it can do</h3>
<ul>
<li>Shows three planes at once: axial, coronal and sagittal. The plane you select appears large.</li>
<li>Lists all series with thumbnails in the series panel. Several files or ZIPs can be added on top of each other.</li>
<li>Shows series separately in a grid and scrolls slices at the same position together.</li>
<li>Shows a localizer line. For example, with a sagittal series in one cell and an axial series in another, your position appears as a line in the other cell while you scroll.</li>
<li>Zooms in, zooms out and pans.</li>
<li>Adjusts window level and width (contrast). Ready-made CT, MR and PET presets are included.</li>
<li>Measures the distance between two points with a ruler.</li>
<li>Places markers on important spots. All markers are listed at the bottom of the page together with the image name. A series closed with the × on its card keeps its markers. Clicking a marker reopens the series and jumps to that slice.</li>
<li>Aligns PET and CT by hand and shows the fusion. You can drag with the Align tool or shift in mm.</li>
<li>Offers the interface in Turkish, English, German, Korean, Japanese and Russian.</li>
<li>The <b>Angle</b> button shows a 0-360° angle scale around the edges of every view. Choose Varian (180° at the bottom) or Elekta (0° at the bottom) from the device list.</li>
<li>Hovering over a button with the mouse shows what it does. The <b>Initial view</b> button returns the screen to the layout shown when the file was first loaded, with all series open in separate cells.</li>
<li>Works offline both as a single file and from a web address. The <b>Update</b> button (in the top bar on desktop, at the bottom of the page on phones) downloads the new version. When opened as a single file, the new version is saved as <i>DICOM GÖRÜNTÜLEYİCİ_date_version.html</i>. During the first minute after opening, the program also checks for a new version by itself and asks before downloading it. Without internet, <b>Offline</b> appears next to the button. After every update a <b>What's new</b> window opens.</li>
<li>On desktop the program fits on one page on any screen, no scrolling needed. Markers, measurements and DICOM tags are in a side panel opened with the <b>Markers / Tags</b> button in the toolbar.</li>
</ul>
<h3>Good to know</h3>
<ul>
<li>Images are not uploaded to the internet. Everything stays on your device.</li>
<li>For review only, not for diagnosis. Consult your physician for interpretation.</li>
<li>On iPhone and iPad, tapping the file in the Files app opens a preview and the images cannot be read. Open the file with Safari or Chrome.</li>
</ul>`},
de:{title:'DICOM-BETRACHTER',sub:VER+' · Ein Ein-Datei-Programm, das CT-, MR-, Röntgen- und PET-Bilder im Browser öffnet. Keine Installation und kein Internet nötig.',btn:'Verstanden, los',
sign:`Entwickelt von Yemliha Enes Tüten, Medizinphysik-Experte. Open Source und kostenlos nutzbar. Kontakt: <a href="mailto:${MAIL}">${MAIL}</a>`,
body:`<h3>Wo es funktioniert</h3>
<p>Windows, Mac, Android-Handys und -Tablets, iPhone und iPad. Es öffnet sich in Chrome, Safari, Edge und Firefox.</p>
<h3>Anleitung</h3>
<ol>
<li>Drücken Sie oben auf <b>ZIP hinzufügen</b>. Wählen Sie DICOM-Dateien oder eine einzelne ZIP-Datei, die alle enthält. Um einen ganzen Ordner zu laden, drücken Sie auf <b>Ordner hinzufügen</b>.</li>
<li>Sie können beliebig viele neue Dateien hinzufügen. Hinzugefügte Serien bleiben neben den früheren. Mit <b>Bilder entfernen</b> entfernen Sie alle samt Markierungen. So wechseln Sie zu einem neuen Patienten.</li>
<li>Die Serienliste zeigt von jeder Serie ein Vorschaubild. Tippen Sie auf eine Serie, um sie auszuwählen.</li>
<li>Wählen Sie in der Liste <b>Layout</b> ein Raster (1×1, 2×2, 3×3, 4×4, 6×6). Jedes Feld zeigt eine eigene Serie.</li>
<li>Ziehen Sie eine Serie am Vorschaubild in ein beliebiges Feld. Auf dem Handy das Vorschaubild kurz gedrückt halten und dann ziehen. Alternativ tippen Sie auf das Symbol im Feld und wählen eine Serie.</li>
<li>Blättern Sie mit der Maus oder dem Finger durch die Schichten. Ein Doppeltipp auf ein Feld öffnet die Serie in 3 Ebenen.</li>
<li>Solange PET und CT getrennt angezeigt werden, drücken Sie auf <b>Fusion</b>. Beide Serien werden übereinandergelegt.</li>
<li>Wählen Sie die Sprache der Oberfläche in der Liste neben <b>Hilfe</b>: Türkçe, English, Deutsch, 한국어, 日本語 oder Русский.</li>
</ol>
<h3>Was es kann</h3>
<ul>
<li>Zeigt drei Ebenen gleichzeitig: axial, koronar und sagittal. Die gewählte Ebene erscheint groß.</li>
<li>Listet im Serienpanel alle Serien mit Vorschaubildern. Mehrere Dateien oder ZIPs lassen sich nacheinander hinzufügen.</li>
<li>Zeigt Serien getrennt im Raster und blättert Schichten an derselben Position gemeinsam.</li>
<li>Zeigt eine Localizer-Linie. Liegt zum Beispiel in einem Feld eine sagittale und im anderen eine axiale Serie vor, erscheint Ihre Position beim Blättern als Linie im anderen Feld.</li>
<li>Vergrößert, verkleinert und verschiebt das Bild.</li>
<li>Stellt Fensterlage und Fensterbreite (Kontrast) ein. Fertige CT-, MR- und PET-Voreinstellungen sind enthalten.</li>
<li>Misst mit dem Lineal den Abstand zwischen zwei Punkten.</li>
<li>Setzt Markierungen auf wichtige Stellen. Alle Markierungen stehen mit dem Bildnamen unten auf der Seite. Eine mit dem × auf der Karte geschlossene Serie behält ihre Markierungen. Ein Klick auf eine Markierung öffnet die Serie wieder und springt zur Schicht.</li>
<li>Richtet PET und CT von Hand aus und zeigt die Fusion. Sie können mit dem Werkzeug Ausrichten ziehen oder in mm verschieben.</li>
<li>Bietet die Oberfläche auf Türkisch, Englisch, Deutsch, Koreanisch, Japanisch und Russisch.</li>
<li>Die Schaltfläche <b>Winkel</b> zeigt am Rand jeder Ansicht eine Winkelskala von 0 bis 360°. In der Geräteliste wählen Sie Varian (180° unten) oder Elekta (0° unten).</li>
<li>Beim Überfahren einer Schaltfläche mit der Maus wird angezeigt, was sie tut. Die Schaltfläche <b>Ausgangsansicht</b> stellt die Ansicht wie beim ersten Laden der Datei wieder her, mit allen Serien in getrennten Feldern.</li>
<li>Funktioniert offline, sowohl als einzelne Datei als auch von einer Webadresse. Die Schaltfläche <b>Aktualisieren</b> (am Desktop oben, am Telefon unten auf der Seite) lädt die neue Version herunter. Als einzelne Datei geöffnet, wird die neue Version als <i>DICOM GÖRÜNTÜLEYİCİ_Datum_Version.html</i> gespeichert. In der ersten Minute nach dem Öffnen prüft das Programm auch selbst auf eine neue Version und fragt vor dem Herunterladen. Ohne Internet steht neben der Schaltfläche <b>Offline</b>. Nach jedem Update öffnet sich das Fenster <b>Neuigkeiten</b>.</li>
<li>Am Desktop passt das Programm auf jedem Bildschirm auf eine Seite, ohne Scrollen. Markierungen, Messungen und DICOM-Tags stehen in einem Seitenfeld, das die Schaltfläche <b>Markierungen / Tags</b> in der Werkzeugleiste öffnet.</li>
</ul>
<h3>Gut zu wissen</h3>
<ul>
<li>Bilder werden nicht ins Internet hochgeladen. Alles bleibt auf Ihrem Gerät.</li>
<li>Nur zur Ansicht, nicht zur Diagnose. Lassen Sie sich die Befunde von Ihrem Arzt erklären.</li>
<li>Tippen Sie auf iPhone und iPad in der Dateien-App auf die Datei, öffnet sich eine Vorschau und die Bilder werden nicht gelesen. Öffnen Sie die Datei mit Safari oder Chrome.</li>
</ul>`},
ko:{title:"DICOM 뷰어",sub:VER+" · CT, MR, X선, PET 영상을 브라우저에서 여는 단일 파일 프로그램입니다. 설치와 인터넷이 필요 없습니다.",btn:"확인, 시작하기",
sign:`의학물리 전문가 Yemliha Enes Tüten이 개발했습니다. 오픈 소스이며 무료로 사용할 수 있습니다. 문의: <a href="mailto:${MAIL}">${MAIL}</a>`,
body:`<h3>사용 가능한 환경</h3>
<p>Windows, Mac, Android 휴대폰과 태블릿, iPhone과 iPad. Chrome, Safari, Edge, Firefox에서 열립니다.</p>
<h3>사용 방법</h3>
<ol>
<li>상단의 <b>ZIP 추가</b> 버튼을 눌러 DICOM 파일 또는 모든 파일이 들어 있는 ZIP 파일 하나를 선택하세요. 폴더째 불러오려면 <b>폴더 추가</b> 버튼을 누르세요.</li>
<li>원하는 만큼 새 파일을 추가할 수 있습니다. 추가한 시리즈는 기존 시리즈 옆에 그대로 남습니다. <b>이미지 제거</b> 버튼을 누르면 모든 이미지와 마커가 제거됩니다. 새 환자로 넘어갈 때 이렇게 하세요.</li>
<li>시리즈 목록에는 각 시리즈의 썸네일이 표시됩니다. 선택하려면 썸네일을 누르세요.</li>
<li><b>레이아웃</b> 목록에서 격자를 선택하세요(1×1, 2×2, 3×3, 4×4, 6×6). 각 칸에 서로 다른 시리즈가 표시됩니다.</li>
<li>시리즈의 썸네일을 잡고 원하는 칸으로 끌어다 놓으세요. 휴대폰에서는 썸네일을 잠시 길게 누른 뒤 끌어 주세요. 칸의 아이콘을 눌러 시리즈를 선택할 수도 있습니다.</li>
<li>마우스나 손가락으로 슬라이스를 넘기세요. 칸을 두 번 탭하면 해당 시리즈가 3개 평면으로 열립니다.</li>
<li>PET과 CT가 따로 표시될 때 <b>융합</b> 버튼을 누르면 두 시리즈가 겹쳐집니다.</li>
<li><b>도움말</b> 버튼 옆의 목록에서 인터페이스 언어를 선택하세요: Türkçe, English, Deutsch, 한국어, 日本語, Русский.</li>
</ol>
<h3>할 수 있는 일</h3>
<ul>
<li>축상, 관상, 시상의 세 평면을 동시에 표시합니다. 선택한 평면은 크게 표시됩니다.</li>
<li>시리즈 패널에 모든 시리즈를 썸네일과 함께 나열합니다. 여러 파일이나 ZIP을 차례로 추가할 수 있습니다.</li>
<li>격자에서 시리즈를 따로 표시하고 같은 위치의 슬라이스를 함께 넘깁니다.</li>
<li>로컬라이저 선을 표시합니다. 예를 들어 한 칸에 시상 시리즈, 다른 칸에 축상 시리즈가 있으면 한쪽을 넘길 때 현재 위치가 다른 칸에 선으로 나타납니다.</li>
<li>확대, 축소, 이동을 할 수 있습니다.</li>
<li>윈도우 레벨과 폭(대비)을 조절합니다. CT, MR, PET용 프리셋이 준비되어 있습니다.</li>
<li>자로 두 점 사이의 거리를 측정합니다.</li>
<li>중요한 위치에 마커를 찍습니다. 모든 마커는 이미지 이름과 함께 페이지 아래쪽에 나열됩니다. 카드의 ×로 시리즈를 닫아도 마커는 남습니다. 마커를 누르면 시리즈가 다시 열리고 해당 슬라이스로 이동합니다.</li>
<li>PET과 CT를 수동으로 정렬해 융합을 표시합니다. 정렬 도구로 끌거나 mm 단위로 이동할 수 있습니다.</li>
<li>터키어, 영어, 독일어, 한국어, 일본어, 러시아어 인터페이스를 제공합니다.</li>
<li><b>각도</b> 버튼은 모든 화면의 가장자리에 0–360° 각도 눈금을 표시합니다. 장비 목록에서 Varian(180° 아래) 또는 Elekta(0° 아래)를 선택하세요.</li>
<li>마우스를 버튼 위에 올리면 기능 설명이 표시됩니다. <b>초기 화면</b> 버튼은 파일을 처음 불러왔을 때의 화면, 즉 모든 시리즈가 개별 칸에 열린 상태로 되돌립니다.</li>
<li>단일 파일로도 웹 주소에서도 오프라인으로 작동합니다. <b>업데이트</b> 버튼(데스크톱은 위쪽 막대, 휴대폰은 페이지 아래쪽)이 새 버전을 다운로드합니다. 단일 파일로 열었을 때는 새 버전이 <i>DICOM GÖRÜNTÜLEYİCİ_날짜_버전.html</i> 이름으로 저장됩니다. 프로그램을 연 후 처음 1분 동안은 프로그램이 스스로도 새 버전을 확인하고, 발견하면 다운로드 전에 묻습니다. 인터넷이 없으면 버튼 옆에 <b>오프라인</b>이 표시됩니다. 업데이트할 때마다 <b>새로운 기능</b> 창이 열립니다.</li>
<li>데스크톱에서는 어떤 화면에서도 한 페이지에 맞춰져 스크롤이 필요 없습니다. 마커, 측정값, DICOM 태그는 도구 모음의 <b>마커 / 태그</b> 버튼으로 여는 측면 패널에 있습니다.</li>
</ul>
<h3>알아 두세요</h3>
<ul>
<li>이미지는 인터넷에 업로드되지 않습니다. 모든 데이터는 사용자의 기기에 남습니다.</li>
<li>진단용이 아니라 열람용입니다. 해석은 담당 의사와 상의하세요.</li>
<li>iPhone과 iPad에서 파일 앱의 파일을 탭하면 미리보기가 열려 이미지를 읽을 수 없습니다. 파일을 Safari 또는 Chrome으로 여세요.</li>
</ul>`},
ja:{title:"DICOM ビューア",sub:VER+" · CT、MR、X線、PET画像をブラウザで開く単一ファイルのプログラムです。インストールもインターネットも不要です。",btn:"了解、開始",
sign:`医学物理専門家 Yemliha Enes Tüten が開発しました。オープンソースで無料でご利用いただけます。連絡先：<a href="mailto:${MAIL}">${MAIL}</a>`,
body:`<h3>動作環境</h3>
<p>Windows、Mac、Androidのスマートフォンとタブレット、iPhone、iPad。Chrome、Safari、Edge、Firefoxで開けます。</p>
<h3>使い方</h3>
<ol>
<li>上部の<b>ZIPを追加</b>ボタンを押して、DICOMファイル、またはそれらをすべて含む1つのZIPファイルを選択します。フォルダごと読み込むには<b>フォルダを追加</b>ボタンを押します。</li>
<li>新しいファイルはいくつでも追加できます。追加したシリーズは以前のシリーズの横に残ります。<b>画像を削除</b>ボタンを押すと、すべての画像とマーカーが削除されます。新しい患者に切り替えるときはこの操作を行います。</li>
<li>シリーズ一覧には各シリーズのサムネイルが表示されます。選択するにはサムネイルをタップします。</li>
<li><b>レイアウト</b>のリストからグリッドを選択します（1×1、2×2、3×3、4×4、6×6）。各セルに別々のシリーズが表示されます。</li>
<li>シリーズのサムネイルをつかんで、好きなセルにドラッグします。スマートフォンではサムネイルを少し長押ししてからドラッグします。セル内のアイコンをタップしてシリーズを選ぶこともできます。</li>
<li>マウスまたは指でスライスをスクロールします。セルをダブルタップすると、そのシリーズが3断面で開きます。</li>
<li>PETとCTが別々に表示されている状態で<b>フュージョン</b>ボタンを押すと、2つのシリーズが重なります。</li>
<li><b>ヘルプ</b>ボタンの横のリストから表示言語を選択します：Türkçe、English、Deutsch、한국어、日本語、Русский。</li>
</ol>
<h3>できること</h3>
<ul>
<li>アキシャル、コロナル、サジタルの3断面を同時に表示します。選択した断面は大きく表示されます。</li>
<li>シリーズパネルにすべてのシリーズをサムネイル付きで一覧表示します。複数のファイルやZIPを続けて追加できます。</li>
<li>グリッドでシリーズを別々に表示し、同じ位置のスライスをまとめてスクロールします。</li>
<li>ローカライザ線を表示します。たとえば一方のセルにサジタル、もう一方にアキシャルのシリーズがある場合、一方をスクロールすると現在位置が他方に線で表示されます。</li>
<li>拡大、縮小、パンができます。</li>
<li>ウィンドウレベルと幅（コントラスト）を調整します。CT、MR、PET用のプリセットが用意されています。</li>
<li>定規で2点間の距離を測定します。</li>
<li>重要な位置にマーカーを置きます。すべてのマーカーは画像名とともにページ下部に一覧表示されます。カードの×でシリーズを閉じてもマーカーは残ります。マーカーを押すとシリーズが再び開き、そのスライスへ移動します。</li>
<li>PETとCTを手動で位置合わせし、フュージョンを表示します。位置合わせツールでドラッグするか、mm単位でシフトできます。</li>
<li>トルコ語、英語、ドイツ語、韓国語、日本語、ロシア語のインターフェースに対応しています。</li>
<li><b>角度</b>ボタンは、すべてのビューの端に0〜360°の角度目盛りを表示します。装置のリストからVarian（180°が下）またはElekta（0°が下）を選択します。</li>
<li>ボタンにマウスを重ねると、その機能が表示されます。<b>初期表示</b>ボタンは、ファイルを最初に読み込んだときの表示、つまりすべてのシリーズが別々のセルに開いた状態に戻します。</li>
<li>単一ファイルでもWebアドレスからでもオフラインで動作します。<b>更新</b>ボタン（デスクトップは上部バー、スマートフォンはページ下部）で新しいバージョンをダウンロードします。単一ファイルとして開いた場合、新しいバージョンは<i>DICOM GÖRÜNTÜLEYİCİ_日付_バージョン.html</i>という名前で保存されます。起動後の最初の1分間はプログラム自身も新しいバージョンを確認し、見つかるとダウンロード前に確認します。インターネットがないとボタンの横に<b>オフライン</b>と表示されます。更新のたびに<b>新機能</b>ウィンドウが開きます。</li>
<li>デスクトップではどの画面でも1ページに収まり、スクロールは不要です。マーカー、計測、DICOMタグはツールバーの<b>マーカー / タグ</b>ボタンで開くサイドパネルにあります。</li>
</ul>
<h3>ご注意</h3>
<ul>
<li>画像はインターネットにアップロードされません。すべてお使いの端末内にとどまります。</li>
<li>診断用ではなく閲覧専用です。読影・解釈は医師にご相談ください。</li>
<li>iPhoneとiPadで「ファイル」アプリのファイルをタップするとプレビューが開き、画像を読み込めません。ファイルはSafariまたはChromeで開いてください。</li>
</ul>`},
ru:{title:"DICOM-ПРОСМОТРЩИК",sub:VER+" · Программа в одном файле, открывающая изображения КТ, МРТ, рентгена и ПЭТ в браузере. Установка и интернет не нужны.",btn:"Понятно, начать",
sign:`Разработал Yemliha Enes Tüten, специалист по медицинской физике. Открытый исходный код, бесплатное использование. Контакты: <a href="mailto:${MAIL}">${MAIL}</a>`,
body:`<h3>Где работает</h3>
<p>Windows, Mac, телефоны и планшеты Android, iPhone и iPad. Открывается в Chrome, Safari, Edge и Firefox.</p>
<h3>Как пользоваться</h3>
<ol>
<li>Нажмите кнопку <b>Добавить ZIP</b> вверху и выберите файлы DICOM или один ZIP-файл, содержащий все файлы. Чтобы загрузить папку целиком, нажмите кнопку <b>Добавить папку</b>.</li>
<li>Можно добавлять сколько угодно новых файлов. Добавленные серии остаются рядом с предыдущими. Кнопка <b>Удалить изображения</b> удаляет все изображения вместе с метками. Так переходят к новому пациенту.</li>
<li>В списке серий показана миниатюра каждой серии. Чтобы выбрать серию, нажмите на её миниатюру.</li>
<li>Выберите сетку в списке <b>Раскладка</b> (1×1, 2×2, 3×3, 4×4, 6×6). В каждой ячейке показана отдельная серия.</li>
<li>Возьмите серию за миниатюру и перетащите в любую ячейку. На телефоне миниатюру нужно немного подержать, а затем перетащить. Серию можно также выбрать, нажав значок в ячейке.</li>
<li>Листайте срезы мышью или пальцем. Двойное нажатие на ячейку открывает эту серию в 3 плоскостях.</li>
<li>Пока ПЭТ и КТ показаны отдельно, нажмите кнопку <b>Слияние</b>. Две серии будут наложены друг на друга.</li>
<li>Язык интерфейса выбирается в списке рядом с кнопкой <b>Справка</b>: Türkçe, English, Deutsch, 한국어, 日本語, Русский.</li>
</ol>
<h3>Возможности</h3>
<ul>
<li>Показывает сразу три плоскости: аксиальную, корональную и сагиттальную. Выбранная плоскость отображается крупно.</li>
<li>Выводит в панели серий все серии с миниатюрами. Можно последовательно добавлять несколько файлов или ZIP-архивов.</li>
<li>Показывает серии раздельно в сетке и листает срезы в одинаковой позиции одновременно.</li>
<li>Показывает линию локализатора. Например, если в одной ячейке сагиттальная серия, а в другой аксиальная, то при листании одной ваше положение отображается линией в другой.</li>
<li>Увеличивает, уменьшает и сдвигает изображение.</li>
<li>Регулирует уровень и ширину окна (контраст). Есть готовые пресеты для КТ, МР и ПЭТ.</li>
<li>Измеряет расстояние между двумя точками линейкой.</li>
<li>Ставит метки в важных местах. Все метки перечислены внизу страницы вместе с названием изображения. Если закрыть серию крестиком на её карточке, метки сохраняются. Нажатие на метку снова открывает серию и переходит к нужному срезу.</li>
<li>Вручную совмещает ПЭТ и КТ и показывает слияние. Можно перетаскивать инструментом «Совместить» или сдвигать в мм.</li>
<li>Интерфейс доступен на турецком, английском, немецком, корейском, японском и русском языках.</li>
<li>Кнопка <b>Угол</b> показывает шкалу углов 0–360° по краям всех изображений. В списке аппаратов выберите Varian (180° внизу) или Elekta (0° внизу).</li>
<li>При наведении мыши на кнопку показывается, для чего она нужна. Кнопка <b>Исходный вид</b> возвращает экран к виду при первой загрузке файла: все серии открыты в отдельных ячейках.</li>
<li>Работает офлайн и как отдельный файл, и по веб-адресу. Кнопка <b>Обновить</b> (на компьютере вверху, на телефоне внизу страницы) скачивает новую версию. При открытии как отдельного файла новая версия сохраняется под именем <i>DICOM GÖRÜNTÜLEYİCİ_дата_версия.html</i>. В первую минуту после запуска программа также сама проверяет наличие новой версии и спрашивает перед скачиванием. Без интернета рядом с кнопкой появляется <b>Офлайн</b>. После каждого обновления открывается окно <b>Что нового</b>.</li>
<li>На компьютере программа помещается на одну страницу на любом экране, без прокрутки. Метки, измерения и DICOM-теги находятся в боковой панели, которую открывает кнопка <b>Метки / Теги</b> на панели инструментов.</li>
</ul>
<h3>Важно знать</h3>
<ul>
<li>Изображения не загружаются в интернет. Всё остаётся на вашем устройстве.</li>
<li>Только для просмотра, не для постановки диагноза. За заключением обратитесь к врачу.</li>
<li>На iPhone и iPad при нажатии на файл в приложении «Файлы» открывается предпросмотр, и изображения не читаются. Откройте файл в Safari или Chrome.</li>
</ul>`}
};
const FOOT={
tr:['Dosyalar yalnızca tarayıcında işlenir, hiçbir yere gönderilmez. Tanı amaçlı kullanılamaz.','Fare: tekerlek kesit değiştirir, Ctrl + tekerlek yakınlaştırır, sağ tuş kontrastı, orta tuş kaydırmayı yönetir.','Dokunmatik: seçili araçla sürükleyin, iki parmakla yakınlaştırın. Kontrast ve füzyon için Ayarlar düğmesine basın. Dosya seçerken birden çok dosya için sağ üstteki ··· menüsünden Seç, sonra Tümünü Seç yapın. Daha kolayı: klasörü Dosyalar uygulamasında sıkıştırıp tek ZIP seçmek.'],
en:['Files are processed only in your browser and are never uploaded. Not for diagnostic use.','Mouse: the wheel changes slices, Ctrl + wheel zooms, the right button adjusts contrast and the middle button pans.','Touch: drag with the selected tool and pinch to zoom. Use the Settings button for contrast and fusion. To pick several files, use the ··· menu at the top right, choose Select, then Select All. Easier: zip the folder in the Files app and pick the single ZIP.'],
de:['Dateien werden nur in Ihrem Browser verarbeitet und nirgendwohin gesendet. Nicht für diagnostische Zwecke.','Maus: Mausrad wechselt die Schicht, Strg + Mausrad zoomt, rechte Taste steuert den Kontrast, mittlere Taste verschiebt das Bild.','Touch: Mit dem gewählten Werkzeug ziehen und mit zwei Fingern zoomen. Kontrast und Fusion über die Schaltfläche Einstellungen. Mehrere Dateien wählen: oben rechts ··· > Auswählen > Alle auswählen. Einfacher: Ordner in der Dateien-App komprimieren und die einzelne ZIP wählen.'],
ko:["파일은 브라우저에서만 처리되며 어디에도 전송되지 않습니다. 진단 용도로 사용할 수 없습니다.", "마우스: 휠은 슬라이스를 넘기고, Ctrl + 휠은 확대하며, 오른쪽 버튼은 대비를, 가운데 버튼은 이동을 조절합니다.", "터치: 선택한 도구로 끌고 두 손가락으로 확대하세요. 대비와 융합은 설정 버튼을 누르세요. 여러 파일을 선택하려면 오른쪽 위 ··· 메뉴에서 선택, 그다음 전체 선택을 누르세요. 더 쉬운 방법은 파일 앱에서 폴더를 압축하여 ZIP 하나를 선택하는 것입니다."],
ja:["ファイルはブラウザ内でのみ処理され、どこにも送信されません。診断目的には使用できません。", "マウス：ホイールでスライスを切り替え、Ctrl＋ホイールでズーム、右ボタンでコントラスト、中ボタンでパンを操作します。", "タッチ：選択したツールでドラッグし、2本指でズームします。コントラストとフュージョンは設定ボタンを押してください。複数のファイルを選ぶには、右上の「···」メニューから「選択」、続けて「すべて選択」を押します。より簡単な方法は、「ファイル」アプリでフォルダを圧縮し、1つのZIPを選ぶことです。"],
ru:["Файлы обрабатываются только в вашем браузере и никуда не отправляются. Не предназначено для диагностики.", "Мышь: колесо листает срезы, Ctrl + колесо масштабирует, правая кнопка меняет контраст, средняя кнопка сдвигает изображение.", "Сенсорный экран: перетаскивайте выбранным инструментом и масштабируйте двумя пальцами. Контраст и слияние находятся за кнопкой «Настройки». Чтобы выбрать несколько файлов, откройте меню ··· вверху справа, нажмите «Выбрать», затем «Выбрать все». Проще заархивировать папку в приложении «Файлы» и выбрать один ZIP."]
};

/* ---------- Yenilikler penceresi: her sürümde 6 dilde güncellenir ---------- */
const NEWS={
tr:{title:'Yenilikler',hide:'Bir daha gösterme',btn:'Tamam',items:[
 'Masaüstünde işaretler, ölçümler ve DICOM etiketleri artık araç çubuğundaki <b>İşaretler / Etiketler</b> düğmesiyle açılan yan panelde. Tüm serilerin işaret listesi de bu panelde. Düğmedeki sayı işaret sayısını gösterir.',
 'Masaüstünde program hangi ekranda açılırsa açılsın tek sayfaya sığar. Aşağı kaydırma gerekmez, görüntü alanı ekranı en iyi şekilde kullanır.',
 'Telefon görünümü değişmedi.',
 'Masaüstünde <b>Güncelle</b> düğmesi artık üst şeritte, dil seçiminin yanında. Yeni sürüm varsa düğmede <b>Güncelleme</b>, yoksa <b>Güncel</b> yazar.',
 'Uygulamanın simgesi yenilendi.']},
en:{title:"What's new",hide:"Don't show again",btn:'OK',items:[
 'On desktop, markers, measurements and DICOM tags now open in a side panel with the <b>Markers / Tags</b> button in the toolbar. The marker list of all series is in this panel too. The number on the button shows how many markers there are.',
 'On desktop the program now fits on one page on any screen. No scrolling is needed and the image area makes the best use of the screen.',
 'The phone layout is unchanged.',
 'On desktop the <b>Update</b> button is now in the top bar, next to the language menu. It reads <b>Update available</b> when there is a new version and <b>Up to date</b> otherwise.',
 'The app icon has been redesigned.']},
de:{title:'Neuigkeiten',hide:'Nicht mehr anzeigen',btn:'OK',items:[
 'Am Desktop öffnen sich Markierungen, Messungen und DICOM-Tags jetzt in einem Seitenfeld über die Schaltfläche <b>Markierungen / Tags</b> in der Werkzeugleiste. Dort steht auch die Markierungsliste aller Serien. Die Zahl auf der Schaltfläche zeigt die Anzahl der Markierungen.',
 'Am Desktop passt das Programm jetzt auf jedem Bildschirm auf eine Seite. Scrollen ist nicht nötig, der Bildbereich nutzt den Bildschirm optimal.',
 'Die Telefonansicht bleibt unverändert.',
 'Am Desktop steht die Schaltfläche <b>Aktualisieren</b> jetzt oben neben der Sprachauswahl. Gibt es eine neue Version, steht darauf <b>Update verfügbar</b>, sonst <b>Aktuell</b>.',
 'Das App-Symbol wurde neu gestaltet.']},
ko:{title:'새로운 기능',hide:'다시 표시하지 않음',btn:'확인',items:[
 '데스크톱에서 마커, 측정값, DICOM 태그가 이제 도구 모음의 <b>마커 / 태그</b> 버튼으로 여는 측면 패널에 표시됩니다. 모든 시리즈의 마커 목록도 이 패널에 있습니다. 버튼의 숫자는 마커 수를 나타냅니다.',
 '데스크톱에서는 어떤 화면에서도 프로그램이 한 페이지에 맞춰집니다. 스크롤할 필요가 없고 영상 영역이 화면을 최대한 활용합니다.',
 '휴대폰 화면 구성은 바뀌지 않았습니다.',
 '데스크톱에서 <b>업데이트</b> 버튼이 이제 위쪽 막대의 언어 선택 옆에 있습니다. 새 버전이 있으면 <b>업데이트 있음</b>, 없으면 <b>최신</b>으로 표시됩니다.',
 '앱 아이콘이 새로워졌습니다.']},
ja:{title:'新機能',hide:'今後表示しない',btn:'OK',items:[
 'デスクトップでは、マーカー、計測、DICOMタグがツールバーの<b>マーカー / タグ</b>ボタンで開くサイドパネルに表示されるようになりました。全シリーズのマーカー一覧もこのパネルにあります。ボタンの数字はマーカーの数です。',
 'デスクトップでは、どの画面でもプログラムが1ページに収まります。スクロールは不要で、画像エリアが画面を最大限に使います。',
 'スマートフォンの表示は変わっていません。',
 'デスクトップでは<b>更新</b>ボタンが上部バーの言語選択の横に移りました。新しいバージョンがあれば<b>更新あり</b>、なければ<b>最新</b>と表示されます。',
 'アプリのアイコンを新しくしました。']},
ru:{title:'Что нового',hide:'Больше не показывать',btn:'ОК',items:[
 'На компьютере метки, измерения и DICOM-теги теперь открываются в боковой панели кнопкой <b>Метки / Теги</b> на панели инструментов. Там же список меток всех серий. Число на кнопке показывает количество меток.',
 'На компьютере программа теперь помещается на одну страницу на любом экране. Прокрутка не нужна, область изображения максимально использует экран.',
 'Вид на телефоне не изменился.',
 'На компьютере кнопка <b>Обновить</b> теперь вверху, рядом с выбором языка. Если есть новая версия, на ней написано <b>Есть обновление</b>, иначе <b>Актуально</b>.',
 'Значок приложения обновлён.']}
};
function fillNews(){
  const n=NEWS[LANG]||NEWS.tr,t=document.getElementById('nTitle');if(!t)return;
  t.textContent=n.title;
  document.getElementById('nSub').textContent=(BUILD_DATE?BUILD_DATE+' · ':'')+VER;
  document.getElementById('nBody').innerHTML='<ul>'+n.items.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
  document.getElementById('nHideTx').textContent=n.hide;
  document.getElementById('nClose').textContent=n.btn;
}
function fillWelcome(){
  const w=WELCOME[LANG];
  $('#wTitle').textContent=w.title;$('#wSub').textContent=w.sub;$('#wBody').innerHTML=w.body;$('#wSign').innerHTML=w.sign;$('#wClose').textContent=w.btn;
}
/* Güncelle düğmesinin yazısı: yeni sürüm varsa "Güncelleme", yoksa "Güncel", henüz bilinmiyorsa "Güncelle" */
let UPD_STATE='';
function setUpdState(v){
  UPD_STATE=v||'';const b=document.getElementById('updBtn');if(!b)return;
  b.textContent=TX(UPD_STATE==='new'?'Güncelleme':UPD_STATE==='ok'?'Güncel':'Güncelle');
  b.classList.toggle('ok',UPD_STATE==='ok');
}
let NET_OFF=false;
function setNetOff(v){NET_OFF=!!v;const e=document.getElementById('offl');if(e)e.hidden=!NET_OFF;}
function fillFooter(){
  const f=FOOT[LANG],ub=$('#updBtn');
  $('#foot').innerHTML=`${esc(f[0])}\n  <span class="only-mouse">${esc(f[1])}</span>\n  <span class="only-touch">${esc(f[2])}</span>\n  <div class="credit"><span>${esc(TX('Medikal Fizik Uzmanı'))}</span> Yemliha Enes TÜTEN <span class="ver">· ${BUILD_DATE?BUILD_DATE+' · ':''}${VER}</span></div>`;
  if(ub){const c=$('#foot .credit');if(c){c.appendChild(ub);const old=document.getElementById('offl');if(old)old.remove();const o=document.createElement('span');o.id='offl';o.className='offl';o.textContent=TX('Çevrimdışısınız');o.title=TX('İnternet bağlantısı yok. Güncelleme kontrol edilemiyor. Program bu sürümle çalışmaya devam eder');o.hidden=!NET_OFF;c.appendChild(o);}setUpdState(UPD_STATE);ub.title=TX(UPD_FILE?'Yeni sürüm olup olmadığına bakar. Varsa yeni HTML dosyasını indirip kaydeder. İnternet gerekir. Program açıldıktan sonraki ilk 1 dakika içinde kendisi de bir kez kontrol eder':'Yeni sürüm olup olmadığına bakar. Varsa indirir ve programı yeniler. İnternet gerekir, güncellemeden sonra program yine çevrimdışı çalışır');}
}
/* Güncelle düğmesi masaüstünde üst şeritte (dil seçiminin yanında), telefonda alt bilgide durur */
const UPD_TOP=matchMedia('(min-width:721px) and (hover:hover),(min-width:721px) and (min-height:521px)');
function placeUpd(){
  const ub=document.getElementById('updBtn'),o=document.getElementById('offl');if(!ub)return;
  const dst=UPD_TOP.matches?document.querySelector('.top .brand'):document.querySelector('#foot .credit');if(!dst)return;
  if(ub.parentNode!==dst)dst.appendChild(ub);if(o&&o.parentNode!==dst)dst.appendChild(o);
}
(UPD_TOP.addEventListener?UPD_TOP.addEventListener('change',placeUpd):UPD_TOP.addListener(placeUpd));

const TIPS=[
 ["#angBtn","Tüm kesitlerin kenarında 0-360° açı skalasını gösterir ya da gizler"],
 ["#angDev","Cihaz seçimi: Varian'da 180° görüntünün altında, Elekta'da 0° altında yer alır"],
 ["#helpBtn","Kullanım kılavuzunu ve özellik listesini açar"],
 ["#mkBtn","İşaretler, ölçümler ve DICOM etiketleri panelini açar ya da kapatır"],
 ["#sideX","Paneli kapatır"],
 ["#uaYes","Yeni sürümü indirip kaydeder"],
 ["#uaNo","Şimdilik indirmez. Daha sonra Güncelle düğmesiyle indirebilirsiniz"],
 ["#nClose","Yenilikler penceresini kapatır"],
 ["#nHide","İşaretlenirse bu sürümün yenilikleri bir daha gösterilmez"],
 ["#langSel","Arayüz dilini seçin"],
 ["#seriesSel","Görüntülenecek seriyi seçer"],
 ["#layoutSel","Ekranı 3 kesite ya da 1×1'den 6×6'ya kadar seri ızgarasına böler"],
 ["[data-tool=\"cross\"]","Çapraz (C): tıkladığınız noktayı üç kesitte birden gösterir"],
 ["[data-tool=\"wl\"]","Kontrast (W): sürükleyerek parlaklığı ve kontrastı değiştirir. Sağa sürükleme genişliği, yukarı sürükleme merkezi ayarlar"],
 ["[data-tool=\"scroll\"]","Kesit (S): sürükleyerek kesitler arasında gezer. Fare tekerleği de aynı işi yapar"],
 ["[data-tool=\"zoom\"]","Yakınlaştır (Z): sürükleyerek görüntüyü büyütür ya da küçültür"],
 ["[data-tool=\"pan\"]","Kaydır (P): görüntüyü sürükleyerek taşır"],
 ["[data-tool=\"ruler\"]","Cetvel (R): iki nokta arasını sürükleyerek mesafeyi mm olarak ölçer"],
 ["[data-tool=\"mark\"]","İşaretle (M): tıkladığınız noktaya numaralı bir işaret koyar"],
 ["#alignBtn","Hizala (A): PET kaplamasını sürükleyerek BT ile elle hizalar"],
 ["#advBtn","Kontrast, renk, kaplama ve hizalama ayarlarını açar ya da kapatır"],
 ["#preset","Hazır pencere ayarını seçer (BT, MR ya da PET için)"],
 ["#wwR","Pencere genişliği: büyüdükçe kontrast azalır, daha geniş yoğunluk aralığı görünür"],
 ["#wlR","Pencere merkezi: görüntünün hangi yoğunluk düzeyine odaklanıldığını belirler"],
 ["#cmap","Görüntünün renk haritasını seçer"],
 ["#gamR","Gama: orta tonların parlaklığını değiştirir"],
 ["#inv","Siyah ile beyazı birbiriyle değiştirir"],
 ["#ovSel","PET gibi ikinci bir seriyi taban görüntünün üstüne bindirir"],
 ["#ovCmap","Kaplamanın renk haritasını seçer"],
 ["#ovA","Kaplamanın saydamlığını ayarlar"],
 ["#ovLo","Kaplamada gösterilecek en düşük değer"],
 ["#ovHi","Kaplamada gösterilecek en yüksek değer"],
 ["#ovAuto","Kaplama değer aralığını görüntüden otomatik hesaplar"],
 ["#offX","Kaplamayı sağa sola mm cinsinden kaydırır"],
 ["#offY","Kaplamayı öne arkaya mm cinsinden kaydırır"],
 ["#offZ","Kaplamayı yukarı aşağı mm cinsinden kaydırır"],
 ["#offStep","Ok düğmelerinin her basışta kaydıracağı mm miktarı"],
 ["#offReset","Kaplama kaydırmasını sıfırlar"],
 ["#tbMarks","Konulan işaretleri ve ölçümleri listeler"],
 ["#tbTags","Dosyanın DICOM etiketlerini (başlık bilgilerini) gösterir"],
 ["#mkCopy","İşaretleri ve ölçümleri CSV olarak panoya kopyalar"],
 ["#mkClear","Bu seriye ait tüm işaret ve ölçümleri siler"]
];

const NUDGE=[['#nL','Sola'],['#nR','Sağa'],['#nU','Yukarı'],['#nD','Aşağı'],['#nZu','Kesit yönünde ileri'],['#nZd','Kesit yönünde geri']];
function setTips(){
  TIPS.forEach(([sel,txt])=>{
    const el=document.querySelector(sel);if(!el)return;
    const tg=(el.tagName==='INPUT'||el.tagName==='SELECT')&&el.closest('label')?el.closest('label'):el;
    if(tg.hasAttribute('title')&&tg!==el&&!tg._tipSet)tg.title=tg.title; /* mevcut başlığı koru */
    if(!tg.hasAttribute('title')||tg===el||tg._tipSet){tg.setAttribute('title',txt);tg._tipSet=1;}
  });
  NUDGE.forEach(([sel,txt])=>{const el=document.querySelector(sel);if(el&&!el.hasAttribute('title'))el.setAttribute('title',txt);});
}
/* fare üzerine gelince açıklama balonu (tıklamaya gerek yok) */
(function(){
  if(!window.matchMedia||!matchMedia('(hover:hover)').matches)return;
  const tip=document.createElement('div');tip.className='tip';tip.setAttribute('role','tooltip');tip.hidden=true;tip.setAttribute('data-nt','');
  document.body.appendChild(tip);
  let cur=null,timer=0,saved='';
  function hide(){clearTimeout(timer);timer=0;tip.hidden=true;if(cur){if(saved&&!cur.hasAttribute('title'))cur.setAttribute('title',saved);cur=null;saved='';}}
  function show(el){
    const t=el.getAttribute('title');if(!t)return;
    cur=el;saved=t;el.removeAttribute('title');
    tip.textContent=t;tip.hidden=false;
    const r=el.getBoundingClientRect(),tw=tip.offsetWidth,th=tip.offsetHeight;
    let x=Math.min(Math.max(8,r.left+r.width/2-tw/2),innerWidth-tw-8);
    let y=r.bottom+8;if(y+th>innerHeight-8)y=Math.max(8,r.top-th-8);
    tip.style.left=x+'px';tip.style.top=y+'px';
  }
  document.addEventListener('mouseover',e=>{
    const el=e.target.closest&&e.target.closest('[title]');
    if(el===cur)return;
    hide();
    if(!el)return;
    timer=setTimeout(()=>show(el),300);
  });
  document.addEventListener('mouseout',e=>{if(!e.relatedTarget||(cur&&!cur.contains(e.relatedTarget))||(!cur&&timer))hide();});
  ['mousedown','wheel','keydown','scroll','blur'].forEach(ev=>addEventListener(ev,hide,true));
})();

/* ---------- DOM çevirisi: metin düğümleri ve öznitelikler; yeni eklenenleri gözlemci çevirir ---------- */
const ATTRS=['title','aria-label','placeholder'];
const noTr=el=>el&&el.closest&&el.closest('[data-nt]');
function trText(n){
  const p=n.parentElement;if(!p||/^(SCRIPT|STYLE)$/.test(p.tagName)||noTr(p))return;
  const cur=n.nodeValue;
  const src=(n._lv!==undefined&&cur===n._lv)?n._tr:cur;
  if(!src.trim()){n._tr=src;n._lv=cur;return;}
  const lead=src.match(/^\s*/)[0],trail=src.match(/\s*$/)[0];
  const out=lead+(LANG==='tr'?src.trim():TX(src.trim()))+trail;
  n._tr=src;n._lv=out;if(out!==cur)n.nodeValue=out;
}
function trAttr(el,a){
  if(noTr(el)||!el.hasAttribute(a))return;
  const m=el._trA||(el._trA={});const cur=el.getAttribute(a),o=m[a];
  const src=(o&&cur===o.lv)?o.src:cur;
  const out=LANG==='tr'?src:TX(src);
  m[a]={src,lv:out};if(out!==cur)el.setAttribute(a,out);
}
function trTree(root){
  if(root.nodeType===3){trText(root);return;}
  if(root.nodeType!==1)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
  while((n=w.nextNode()))trText(n);
  const els=[root,...root.querySelectorAll('[title],[aria-label],[placeholder]')];
  els.forEach(el=>ATTRS.forEach(a=>trAttr(el,a)));
}
let trObs=null;
function startObs(){
  if(trObs||typeof MutationObserver==='undefined')return;
  trObs=new MutationObserver(ms=>{
    if(LANG==='tr')return;
    for(const m of ms){
      if(m.type==='characterData')trText(m.target);
      else if(m.type==='attributes')trAttr(m.target,m.attributeName);
      else m.addedNodes.forEach(trTree);
    }
  });
  trObs.observe(document.body,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:ATTRS});
}
function applyLang(l,keepStore){
  if(l)LANG=l;
  if(!keepStore){try{localStorage.setItem('dicomLang',LANG);}catch(_){}}
  setTips();
  document.documentElement.lang=LANG;
  document.title=TX('DICOM Görüntüleyici');
  const sel=document.getElementById('langSel');if(sel){sel.value=LANG;sel.title=TX('Arayüz dilini seçin');sel.ariaLabel=TX('Dil');}
  fillWelcome();fillNews();fillFooter();placeUpd();
  trTree(document.body);
  startObs();
  if(typeof renderAll==='function'&&typeof S!=='undefined'&&S.cur)try{renderAll();}catch(_){}
}
