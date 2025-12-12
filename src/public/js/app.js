// src/public/js/app.js - UPDATED LUXURY VERSION (full) WITH BACKEND
(() => {
    // ===== STATE =====
    let questions = [];
    let sushiSets = [];
    let currentIndex = 0;
    let answers = [];
    let isBusy = false;
    let currentSlide = 0;
    let autoSlideInterval;
    let currentTheme = localStorage.getItem('theme') || 'luxury';
    let currentLang = localStorage.getItem('lang') || 'en';
    let currentResult = null;
    let userStories = []; // Empty array - will be loaded from backend

    // ===== TRANSLATIONS =====
    const translations = {
        en: {
            "hero.discover": "Discover Your",
            "hero.soul": "Sushi Soul",
            "hero.subtitle": "Embark on a culinary journey of self-discovery. Our premium personality analysis reveals which sushi masterpiece truly reflects your inner essence.",
            "hero.begin": "Begin Discovery",
            "about.title": "The Art of Sushi",
            "about.what": "What is Sushi?",
            "about.whatText": "Sushi (寿司) is a traditional Japanese dish combining vinegared rice with seafood, vegetables, and occasionally tropical fruits.",
            "about.history": "History of Sushi",
            "about.historyText1": "Sushi's origins date back to Southeast Asia around 2,000 years ago as a preservation method.",
            "about.historyText2": "Modern sushi was developed in Edo (Tokyo) in the 19th century by Hanaya Yohei.",
            "about.types": "Types of Sushi",
            "about.nigiri": "Nigiri",
            "about.nigiriDesc": "Hand-pressed rice topped with fish",
            "about.maki": "Maki",
            "about.makiDesc": "Rice and fillings rolled in seaweed",
            "about.sashimi": "Sashimi",
            "about.sashimiDesc": "Fresh raw fish without rice",
            "about.temaki": "Temaki",
            "about.temakiDesc": "Hand-rolled cone-shaped sushi",
            "about.etiquette": "Sushi Etiquette",
            "about.tip1": "Use hands or chopsticks - both acceptable",
            "about.tip2": "Dip fish side into soy sauce",
            "about.tip3": "Eat nigiri in one bite if possible",
            "about.tip4": "Ginger cleanses palate between types",
            "about.tip5": "Don't rub chopsticks together",
            "about.tip6": "Don't mix wasabi into soy sauce",
            "gallery.title": "Sushi Art Gallery",
            "facts.title": "Fun Sushi Facts",
            "facts.fact1Title": "Global Phenomenon",
            "facts.fact1": "Sushi restaurants in 150+ countries!",
            "facts.fact2Title": "Most Expensive",
            "facts.fact2": "Most expensive sushi: $1,978 with diamonds!",
            "facts.fact3Title": "Master Chefs",
            "facts.fact3": "10 years to become a master chef!",
            "facts.fact4Title": "Perfect Rice",
            "facts.fact4": "Rice kept at body temperature (37°C)",
            "facts.fact5Title": "Bluefin Record",
            "facts.fact5": "Bluefin tuna sold for $3.1 million!",
            "facts.fact6Title": "Sushi Day",
            "facts.fact6": "June 18th is International Sushi Day!",
            "quiz.question": "Question",
            "result.save": "Save to Stories",
            "result.retry": "Try Again",
            "stories.title": "User Stories",
            "stories.share": "Share Your Result",
            "stories.submit": "Submit Story",
            "stories.recent": "Recent Stories"
        },

        az: {
            "hero.discover": "Kəşf Et",
            "hero.soul": "Suşi Ruhunu",
            "hero.subtitle": "Özünü kəşf səyahətinə çıx. Premium şəxsiyyət analizimiz hansı suşi şah əsərinin həqiqətən daxili mahiyyətini əks etdirdiyini göstərir.",
            "hero.begin": "Kəşfə Başla",
            "about.title": "Suşi Sənəti",
            "about.what": "Suşi Nədir?",
            "about.whatText": "Suşi (寿司) dəniz məhsulları, tərəvəzlər və bəzən tropik meyvələrlə hazırlanan ənənəvi Yapon yeməyidir.",
            "about.history": "Suşinin Tarixi",
            "about.historyText1": "Suşinin mənşəyi təxminən 2000 il əvvəl Cənub-Şərqi Asiyaya dayanır və qoruma üsulu kimi yaranıb.",
            "about.historyText2": "Müasir suşi 19-cu əsrdə Edo (Tokio) şəhərində Hanaya Yohei tərəfindən yaradılıb.",
            "about.types": "Suşi Növləri",
            "about.nigiri": "Niqiri",
            "about.nigiriDesc": "Balıqla örtülmüş əllə sıxılmış düyü",
            "about.maki": "Maki",
            "about.makiDesc": "Dəniz yosununa bükülmüş düyü və içlik",
            "about.sashimi": "Sashimi",
            "about.sashimiDesc": "Düyüsüz təzə xam balıq",
            "about.temaki": "Temaki",
            "about.temakiDesc": "Əl ilə hazırlanmış konus formalı suşi",
            "about.etiquette": "Suşi Etiketi",
            "about.tip1": "Əllə və ya çubuqlarla yemək — hər ikisi uyğundur",
            "about.tip2": "Balıq tərəfini soya sousuna batırın",
            "about.tip3": "Mümkünsə niqirini bir dişə yeyin",
            "about.tip4": "Zəncəfil növlər arasında dadı təmizləyir",
            "about.tip5": "Çubuqları bir-birinə sürtməyin",
            "about.tip6": "Vasabit soya sousuna qatmayın",
            "gallery.title": "Suşi Sənət Qalereyası",
            "facts.title": "Maraqlı Suşi Faktları",
            "facts.fact1Title": "Qlobal Fenomen",
            "facts.fact1": "150+ ölkədə suşi restoranları var!",
            "facts.fact2Title": "Ən Bahalı",
            "facts.fact2": "$1,978 dəyərində brilyantlı suşi!",
            "facts.fact3Title": "Usta Aşpazlar",
            "facts.fact3": "Usta olmaq üçün 10 il tələb olunur!",
            "facts.fact4Title": "Mükəmməl Düyü",
            "facts.fact4": "Düyü bədən temperaturunda (37°C) saxlanılır",
            "facts.fact5Title": "Mavi Orkinos Rekordu",
            "facts.fact5": "Mavi orkinos $3.1 milyon dollara satılıb!",
            "facts.fact6Title": "Suşi Günü",
            "facts.fact6": "18 iyun — Beynəlxalq Suşi Günüdür!",
            "quiz.question": "Sual",
            "result.save": "Hekayələrə Saxla",
            "result.retry": "Yenidən Cəhd Et",
            "stories.title": "İstifadəçi Hekayələri",
            "stories.share": "Nəticəni Paylaş",
            "stories.submit": "Göndər",
            "stories.recent": "Son Hekayələr"
        },

        fr: {
            "hero.discover": "Découvrez Votre",
            "hero.soul": "Âme Sushi",
            "hero.subtitle": "Partez pour un voyage culinaire de découverte de soi. Notre analyse premium révèle quel chef-d'œuvre sushi reflète vraiment votre essence intérieure.",
            "hero.begin": "Commencer",
            "about.title": "L'Art du Sushi",
            "about.what": "Qu'est-ce que le Sushi ?",
            "about.whatText": "Le sushi (寿司) est un plat japonais traditionnel composé de riz vinaigré, de fruits de mer, de légumes et parfois de fruits tropicaux.",
            "about.history": "Histoire du Sushi",
            "about.historyText1": "Les origines du sushi remontent à l'Asie du Sud-Est il y a environ 2 000 ans.",
            "about.historyText2": "Le sushi moderne a été créé à Edo (Tokyo) au 19e siècle par Hanaya Yohei.",
            "about.types": "Types de Sushi",
            "about.nigiri": "Nigiri",
            "about.nigiriDesc": "Boule de riz pressée à la main recouverte de poisson",
            "about.maki": "Maki",
            "about.makiDesc": "Riz et garnitures roulés dans une algue",
            "about.sashimi": "Sashimi",
            "about.sashimiDesc": "Poisson cru sans riz",
            "about.temaki": "Temaki",
            "about.temakiDesc": "Sushi en forme de cône roulé à la main",
            "about.etiquette": "Étiquette du Sushi",
            "about.tip1": "Utilisez les mains ou des baguettes – les deux sont acceptés",
            "about.tip2": "Trempez le côté poisson dans la sauce soja",
            "about.tip3": "Mangez le nigiri en une bouchée si possible",
            "about.tip4": "Le gingembre nettoie le palais entre les types",
            "about.tip5": "Ne frottez pas les baguettes ensemble",
            "about.tip6": "Ne mélangez pas le wasabi avec la sauce soja",
            "gallery.title": "Galerie d'Art Sushi",
            "facts.title": "Faits Amusants sur le Sushi",
            "facts.fact1Title": "Phénomène Mondial",
            "facts.fact1": "Des restaurants de sushi dans plus de 150 pays !",
            "facts.fact2Title": "Le Plus Cher",
            "facts.fact2": "Sushi le plus cher : 1 978 $ avec des diamants !",
            "facts.fact3Title": "Chefs Maîtres",
            "facts.fact3": "10 ans pour devenir maître sushi !",
            "facts.fact4Title": "Riz Parfait",
            "facts.fact4": "Riz maintenu à température corporelle (37°C)",
            "facts.fact5Title": "Record de Thon Rouge",
            "facts.fact5": "Un thon rouge vendu pour 3,1 millions $ !",
            "facts.fact6Title": "Journée du Sushi",
            "facts.fact6": "Le 18 juin est la Journée Internationale du Sushi !",
            "quiz.question": "Question",
            "result.save": "Enregistrer dans les Stories",
            "result.retry": "Réessayer",
            "stories.title": "Histoires des Utilisateurs",
            "stories.share": "Partager Votre Résultat",
            "stories.submit": "Envoyer",
            "stories.recent": "Histoires Récentes"
        },

        "pt-br": {
            "hero.discover": "Descubra Seu",
            "hero.soul": "Espírito Sushi",
            "hero.subtitle": "Embarque em uma jornada culinária de autodescoberta. Nossa análise premium revela qual obra-prima de sushi reflete sua verdadeira essência.",
            "hero.begin": "Começar",
            "about.title": "A Arte do Sushi",
            "about.what": "O que é Sushi?",
            "about.whatText": "Sushi (寿司) é um prato tradicional japonês feito com arroz temperado, frutos do mar, vegetais e às vezes frutas tropicais.",
            "about.history": "História do Sushi",
            "about.historyText1": "As origens do sushi remontam ao Sudeste Asiático há cerca de 2.000 anos.",
            "about.historyText2": "O sushi moderno surgiu em Edo (Tóquio) no século 19 com Hanaya Yohei.",
            "about.types": "Tipos de Sushi",
            "about.nigiri": "Nigiri",
            "about.nigiriDesc": "Arroz moldado à mão coberto com peixe",
            "about.maki": "Maki",
            "about.makiDesc": "Arroz e recheios enrolados em alga",
            "about.sashimi": "Sashimi",
            "about.sashimiDesc": "Peixe cru fresco sem arroz",
            "about.temaki": "Temaki",
            "about.temakiDesc": "Sushi enrolado à mão em forma de cone",
            "about.etiquette": "Etiqueta do Sushi",
            "about.tip1": "Use as mãos ou hashi — ambos são aceitáveis",
            "about.tip2": "Mergulhe o lado do peixe no molho de soja",
            "about.tip3": "Coma o nigiri de uma só vez, se possível",
            "about.tip4": "Gengibre limpa o paladar entre sabores",
            "about.tip5": "Não esfregue os hashis",
            "about.tip6": "Não misture wasabi no molho de soja",
            "gallery.title": "Galeria de Arte do Sushi",
            "facts.title": "Fatos Divertidos sobre Sushi",
            "facts.fact1Title": "Fenômeno Global",
            "facts.fact1": "Restaurantes de sushi em mais de 150 países!",
            "facts.fact2Title": "O Mais Caro",
            "facts.fact2": "Sushi mais caro: US$ 1.978 com diamantes!",
            "facts.fact3Title": "Mestres Sushi",
            "facts.fact3": "Leva 10 anos para se tornar um mestre!",
            "facts.fact4Title": "Arroz Perfeito",
            "facts.fact4": "Arroz mantido na temperatura do corpo (37°C)",
            "facts.fact5Title": "Recorde do Atum",
            "facts.fact5": "Atum azul vendido por US$ 3,1 milhões!",
            "facts.fact6Title": "Dia do Sushi",
            "facts.fact6": "18 de junho é o Dia Internacional do Sushi!",
            "quiz.question": "Pergunta",
            "result.save": "Salvar nos Stories",
            "result.retry": "Tentar Novamente",
            "stories.title": "Histórias dos Usuários",
            "stories.share": "Compartilhe Seu Resultado",
            "stories.submit": "Enviar",
            "stories.recent": "Histórias Recentes"
        }
    };

    // ===== GALLERY DATA =====
    const galleryImages = [
        { url: '/images/premiumnigiri.jpg', title: 'Premium Nigiri' },
        { url: '/images/rainbowroll.jpg', title: 'Rainbow Roll' },
        { url: '/images/dragonroll.jpg', title: 'Dragon Roll' },
        { url: '/images/sushiplatter.jpg', title: 'Sushi Platter' },
        { url: '/images/chefspecal.jpg', title: 'Chef Special' }
    ];

    // ===== HELPERS =====
    function el(id) {
        return document.getElementById(id);
    }

    function showToast(msg) {
        const toast = el('toast');
        if (!toast) return console.warn('Toast element not found');
        toast.textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2500);
    }

    function escapeHtml(s) {
        if (!s) return '';
        return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }

    async function fetchJSON(url, opts = {}) {
        const res = await fetch(url, opts);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    }

    // ===== TRANSLATIONS HELPERS =====
    function translate(key) {
        try {
            return translations[currentLang][key] || key;
        } catch (e) {
            return key;
        }
    }

    function updatePageText() {
        document.querySelectorAll('[data-i18n]').forEach(node => {
            const key = node.getAttribute('data-i18n');
            const txt = translate(key);
            // preserve placeholder attributes if used
            if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                node.placeholder = txt;
            } else {
                node.textContent = txt;
            }
        });
    }

    // ===== THEME =====
    function toggleTheme() {
        const themes = ['luxury', 'light', 'dark'];
        const idx = themes.indexOf(currentTheme);
        currentTheme = themes[(idx + 1) % themes.length];
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        const iconMap = { 'luxury': '🌙', 'light': '☀️', 'dark': '🌑' };
        const iconEl = el('theme-icon');
        if (iconEl) iconEl.textContent = iconMap[currentTheme] || '✨';
        showToast(`${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)} Theme`);
    }

    // ===== LANGUAGE =====
    function setLanguage(lang) {
        if (!translations[lang]) {
            console.warn('Language not supported:', lang);
            return;
        }
        currentLang = lang;
        localStorage.setItem('lang', currentLang);

        // update UI elements for both dropdown and old button
        const flagMap = { en: '🇬🇧', az: '🇦🇿', fr: '🇫🇷', 'pt-br': '🇧🇷' };
        const langFlag = el('lang-flag');
        if (langFlag) langFlag.textContent = flagMap[currentLang] || '🌐';

        const langBtn = el('lang-btn');
        if (langBtn) langBtn.textContent = flagMap[currentLang] || '🌐';

        // If dropdown exists, mark active option
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === currentLang);
        });

        updatePageText();
        showToast({
            en: 'Language: English',
            az: 'Dil: Azərbaycan',
            fr: 'Langue: Français',
            'pt-br': 'Idioma: Português (BR)'
        }[currentLang] || `Language: ${currentLang}`);
    }

    // initialize language controls (supports dropdown or old toggle)
    function initLanguageControls() {
        // If the new dropdown exists (#lang-btn and #lang-menu with .lang-option)
        const langBtn = el('lang-btn');
        const langMenu = el('lang-menu');
        const langToggle = el('lang-toggle'); // old button
        const langFlag = el('lang-flag');

        if (langBtn && langMenu) {
            langBtn.onclick = (e) => {
                e.stopPropagation();
                langMenu.classList.toggle('hidden');
            };
            document.addEventListener('click', () => langMenu.classList.add('hidden'));

            document.querySelectorAll('.lang-option').forEach(opt => {
                opt.onclick = (ev) => {
                    const chosen = opt.dataset.lang;
                    setLanguage(chosen);
                    langMenu.classList.add('hidden');
                };
            });
            // set active option initial
            document.querySelectorAll('.lang-option').forEach(opt => {
                opt.classList.toggle('active', opt.dataset.lang === currentLang);
            });

            // set button flag
            langBtn.textContent = { en: '🇬🇧', az: '🇦🇿', fr: '🇫🇷', 'pt-br': '🇧🇷' }[currentLang] || '🌐';
        } else if (langToggle && langFlag) {
            // fallback: legacy toggle (only toggles en <> az like before)
            langToggle.onclick = () => {
                currentLang = currentLang === 'en' ? 'az' : 'en';
                setLanguage(currentLang);
            };
            langFlag.textContent = { en: '🇬🇧', az: '🇦🇿', fr: '🇫🇷', 'pt-br': '🇧🇷' }[currentLang] || '🌐';
        } else if (langBtn && !langMenu && langFlag) {
            // If user added only a lang-btn (no menu), use it to cycle languages
            langBtn.onclick = () => {
                const order = ['en', 'az', 'fr', 'pt-br'];
                const idx = order.indexOf(currentLang);
                const next = order[(idx + 1) % order.length];
                setLanguage(next);
            };
            langBtn.textContent = { en: '🇬🇧', az: '🇦🇿', fr: '🇫🇷', 'pt-br': '🇧🇷' }[currentLang] || '🌐';
        } else {
            // no language UI found - nothing to init, but ensure page text is updated
            // (useful during dev)
        }
    }

    // ===== NAVIGATION =====
    function switchPage(pageName) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        const page = document.getElementById(`page-${pageName}`);
        if (page) {
            page.classList.add('active');
            document.querySelector(`[data-page="${pageName}"]`)?.classList.add('active');
        }

        // Load data if needed
        if (pageName === 'quiz' && questions.length === 0) {
            initData();
        } else if (pageName === 'gallery') {
            startAutoSlide();
        } else if (pageName === 'history') {
            loadStories();
        }

        window.scrollTo(0, 0);
    }

    // ===== GALLERY =====
    function initGallery() {
        const track = el('slider-track');
        const dots = el('slider-dots');

        if (!track || !dots) return;

        track.innerHTML = '';
        dots.innerHTML = '';

        galleryImages.forEach((img, i) => {
            const slide = document.createElement('div');
            slide.className = 'slider-slide';
            slide.innerHTML = `
                <img src="${img.url}" alt="${escapeHtml(img.title)}">
                <div class="slide-caption">${escapeHtml(img.title)}</div>
            `;
            track.appendChild(slide);

            const dot = document.createElement('button');
            dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => goToSlide(i);
            dots.appendChild(dot);
        });

        updateSlider();
    }

    function updateSlider() {
        const track = el('slider-track');
        const dots = document.querySelectorAll('.slider-dot');
        if (!track) return;
        // compute percent: we want slides displayed full width, so use 100% per slide
        const percent = (currentSlide * 100);
        track.style.transform = `translateX(-${percent}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    }

    function goToSlide(index) {
        if (!galleryImages.length) return;
        currentSlide = index;
        if (currentSlide >= galleryImages.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = galleryImages.length - 1;
        updateSlider();
    }

    function nextSlide() {
        if (!galleryImages.length) return;
        currentSlide = (currentSlide + 1) % galleryImages.length;
        updateSlider();
    }

    function prevSlide() {
        if (!galleryImages.length) return;
        currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length;
        updateSlider();
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    // ===== QUIZ =====
    async function initData() {
        try {
            const qResp = await fetchJSON('/api/questions');
            questions = qResp.questions || [];
            const sResp = await fetchJSON('/api/sushi');
            sushiSets = sResp.sets || [];
            const totalQEl = el('total-q');
            if (totalQEl) totalQEl.textContent = questions.length;
        } catch (err) {
            console.error(err);
            showToast('Failed to load quiz');
        }
    }

    function startQuiz() {
        if (questions.length === 0) {
            initData().then(() => {
                currentIndex = 0;
                answers = [];
                renderQuestion(0);
                switchPage('quiz');
            });
        } else {
            currentIndex = 0;
            answers = [];
            renderQuestion(0);
            switchPage('quiz');
        }
    }

    function renderQuestion(index) {
        const q = questions[index];
        if (!q) return;

        const currentQ = el('current-q');
        if (currentQ) currentQ.textContent = (index + 1).toString();

        const questionText = el('question-text');
        if (questionText) questionText.textContent = q.question;

        const progress = el('quiz-progress');
        if (progress && questions.length) progress.style.width = `${((index + 1) / questions.length) * 100}%`;

        const grid = el('options-grid');
        if (!grid) return;
        grid.innerHTML = '';

        q.options.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'option-premium';
            div.innerHTML = `
                <img src="${opt.image}" alt="${escapeHtml(opt.label)}" style="width:100%; height:150px; object-fit:cover; border-radius:10px; margin-bottom:10px;">
                <div class="option-label">${escapeHtml(opt.label)}</div>
            `;
            div.onclick = () => selectOption(q.id, opt.value, div);
            grid.appendChild(div);
        });
    }

    function selectOption(qid, value, clickedEl) {
        if (isBusy) return;
        isBusy = true;

        document.querySelectorAll('.option-premium').forEach(o => o.style.opacity = '0.5');
        if (clickedEl) {
            clickedEl.style.opacity = '1';
            clickedEl.classList.add('selected');
        }

        answers.push({ questionId: qid, value });

        setTimeout(() => {
            currentIndex++;
            if (currentIndex >= questions.length) {
                finalizeResult();
            } else {
                renderQuestion(currentIndex);
            }
            isBusy = false;
        }, 400);
    }

    async function finalizeResult() {
        try {
            const res = await fetchJSON('/api/sushi/result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: answers.map(a => a.value) })
            });

            currentResult = res.result;
            if (currentResult) {
                const rn = el('result-name'); if (rn) rn.textContent = currentResult.name;
                const ri = el('result-image'); if (ri) ri.src = currentResult.image;
                const rd = el('result-desc'); if (rd) rd.textContent = currentResult.description;
            }

            switchPage('result');
            createConfetti();
        } catch (err) {
            console.error(err);
            showToast('Failed to get result');
        }
    }

    function createConfetti() {
        const colors = ['#c9a96e', '#ffd700', '#ffffff', '#ff6b9d'];
        for (let i = 0; i < 100; i++) {
            const c = document.createElement('div');
            c.style.cssText = `position:fixed; width:8px; height:8px; background:${colors[Math.floor(Math.random()*colors.length)]}; left:${Math.random()*100}vw; top:-10px; z-index:9999; border-radius:50%;`;
            document.body.appendChild(c);
            c.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random()*720}deg)`, opacity: 0 }
            ], { duration: 2000 + Math.random() * 2000 }).onfinish = () => c.remove();
        }
    }

    // ===== USER STORIES (WITH BACKEND) =====
    async function loadStories() {
        const list = el('stories-list');
        if (!list) return;

        try {
            const response = await fetchJSON('/api/stories');
            userStories = response.stories || [];

            if (userStories.length === 0) {
                list.innerHTML = '<p style="text-align:center; color:var(--text-secondary);">No stories yet. Be the first!</p>';
            } else {
                list.innerHTML = userStories.map(s => `
                    <div class="glass-card user-story-card">
                        <div class="story-header">
                            <div class="story-avatar">${escapeHtml((s.name || '').charAt(0).toUpperCase())}</div>
                            <div>
                                <div class="story-name">${escapeHtml(s.name)}</div>
                                <div class="story-result">${escapeHtml(s.result)}</div>
                            </div>
                        </div>
                        <p class="story-text">${escapeHtml(s.story)}</p>
                        <div class="story-date">${new Date(s.date).toLocaleDateString()}</div>
                    </div>
                `).join('');
            }
        } catch (err) {
            console.error('Failed to load stories:', err);
            list.innerHTML = '<p style="text-align:center; color:var(--text-secondary);">Failed to load stories. Please try again later.</p>';
        }
    }

    async function saveStory(e) {
        if (e && e.preventDefault) e.preventDefault();

        const nameEl = el('user-name');
        const storyEl = el('user-story');
        if (!nameEl || !storyEl) return;

        const name = nameEl.value.trim();
        const story = storyEl.value.trim();

        if (!currentResult) {
            showToast('Take the quiz first!');
            return;
        }

        if (!name || !story) {
            showToast('Please fill in all fields');
            return;
        }

        try {
            await fetchJSON('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    result: currentResult.name,
                    story
                })
            });

            const form = el('story-form');
            if (form) form.reset();

            await loadStories(); // Reload from backend
            showToast('Story saved! ✨');
        } catch (err) {
            console.error('Failed to save story:', err);
            showToast('Failed to save story. Please try again.');
        }
    }

    // ===== EVENT LISTENERS & INITIALIZATION =====
    document.addEventListener('DOMContentLoaded', () => {
        // Theme & Lang
        const themeToggle = el('theme-toggle');
        if (themeToggle) themeToggle.onclick = toggleTheme;

        // Initialize language controls (dropdown or fallback toggle)
        initLanguageControls();

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                switchPage(link.dataset.page);
            };
        });

        // Quiz triggers
        el('start-quiz-nav')?.addEventListener('click', startQuiz);
        el('start-quiz-hero')?.addEventListener('click', startQuiz);
        el('btn-retry')?.addEventListener('click', () => switchPage('home'));

        // Save result to stories (navigates to history)
        el('btn-save-result')?.addEventListener('click', () => {
            if (currentResult) {
                switchPage('history');
            } else {
                showToast('Take the quiz first!');
            }
        });

        // Stories form
        el('story-form')?.addEventListener('submit', saveStory);

        // Gallery navigation
        el('slider-prev')?.addEventListener('click', prevSlide);
        el('slider-next')?.addEventListener('click', nextSlide);

        // Initialize UI state
        document.documentElement.setAttribute('data-theme', currentTheme);
        const themeIcon = el('theme-icon');
        if (themeIcon) themeIcon.textContent = currentTheme === 'luxury' ? '🌙' : (currentTheme === 'light' ? '☀️' : '🌑');

        // ensure language UI shows correct flag/text
        setLanguage(currentLang);

        // Update translations on page
        updatePageText();

        // Initialize gallery & data
        initGallery();
        initData();
    });

    // Expose a small API for debugging (optional)
    window._SushiMatch = {
        setLanguage,
        toggleTheme,
        startQuiz,
        initGallery,
        getState: () => ({ currentLang, currentTheme, currentResult })
    };
})();