/**
 * AUREUM • YouTube Curator & Luxury Lounge
 * High Quality JavaScript: 2-Hour Rotating Channels, Style Search with Delete,
 * Top Comment Box with 2-Dot Dropdown & Click-Outside Dismiss, YouTube Ambient Waiting Music.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. TOP COMMENT FRAME (მაღლა მდებარე ჩარჩო კომენტარებისთვის)
     ========================================================================== */
  const commentForm = document.getElementById('commentForm');
  const commentTextInput = document.getElementById('commentTextInput');
  const commentsList = document.getElementById('commentsList');
  const commentCountBadge = document.getElementById('commentCountBadge');

  const STORAGE_KEY_COMMENTS = 'aureum_top_comments_v2';

  // Default initial comments if storage is empty (includes long comment to showcase scrolling)
  const defaultComments = [
    {
      id: 'c_1',
      author: 'ლუკა რ.',
      text: 'ეს პლატფორმა მართლაც უნიკალური და საოცრად კომფორტულია! განსაკუთრებით მომეწონა ის, თუ როგორ მუშაობს ვიდეოების ძიება სტილისა და შინაარსის მიხედვით: ჩავწერე სამეცნიერო დოკუმენტური ფილმები კოსმოსზე და მომენტალურად მომცა ზუსტად ის ლინკები, რასაც ვეძებდი. თან Delete ღილაკიც იქვეა, რაც საიტის გამოყენებას ძალიან აჩქარებს. ფონური მშვიდი მუსიკა კი მუშაობისას იდეალურ ატმოსფეროს ქმნის და არ გღლის. 10 არხის 2-საათიანი ცვლაც შესანიშნავი იდეაა!',
      timestamp: '5 წუთის წინ'
    },
    {
      id: 'c_2',
      author: 'გიორგი მ.',
      text: 'ძალიან დახვეწილი შავი და ოქროსფერი დიზაინია! 2-საათიანი როტაცია განსაკუთრებით მომეწონა.',
      timestamp: '15 წუთის წინ'
    },
    {
      id: 'c_3',
      author: 'ანნა ბ.',
      text: 'ფონური ლოდინის მუსიკა ძალიან სასიამოვნოა, მუშაობისას ხელს საერთოდ არ მიშლის.',
      timestamp: '42 წუთის წინ'
    }
  ];

  let comments = [];

  function loadComments() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COMMENTS);
      if (stored) {
        comments = JSON.parse(stored);
      } else {
        comments = defaultComments;
        saveComments();
      }
    } catch (e) {
      console.warn('LocalStorage error, using defaults', e);
      comments = defaultComments;
    }
    renderComments();
  }

  function saveComments() {
    try {
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
    } catch (e) {
      console.error('Could not save comments', e);
    }
    updateCommentCount();
  }

  function updateCommentCount() {
    if (commentCountBadge) {
      commentCountBadge.textContent = `${comments.length} კომენტარი`;
    }
  }

  function renderComments() {
    if (!commentsList) return;
    commentsList.innerHTML = '';

    if (comments.length === 0) {
      commentsList.innerHTML = `<div class="no-comments-msg">კომენტარები ჯერ არ არის. იყავით პირველი, ვინც დატოვებს კომენტარს!</div>`;
      updateCommentCount();
      return;
    }

    comments.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.dataset.id = item.id;

      const firstChar = item.author ? item.author.charAt(0).toUpperCase() : 'U';

      card.innerHTML = `
        <div class="comment-card-top">
          <div class="comment-author-info">
            <div class="author-avatar">${firstChar}</div>
            <div>
              <div class="author-name">${escapeHtml(item.author)}</div>
              <div class="comment-time">${escapeHtml(item.timestamp)}</div>
            </div>
          </div>

          <!-- TWO-DOT BUTTON AT THE END OF EACH COMMENT -->
          <div class="comment-options-wrapper">
            <button type="button" class="btn-two-dots" title="პარამეტრები (ორი წერტილი)" aria-label="Comment options">
              <span class="two-dots-icon">
                <span></span>
                <span></span>
              </span>
            </button>
            <!-- DELETE POPOVER (გამოჩნდება მხოლოდ 2 წერტილზე დაჭერისას) -->
            <div class="comment-action-popover">
              <button type="button" class="btn-delete-comment" data-delete-id="${item.id}">
                <i class="fa-solid fa-trash-can"></i>
                <span>წაშლა</span>
              </button>
            </div>
          </div>
        </div>

        <div class="comment-card-body">
          ${escapeHtml(item.text)}
        </div>
      `;

      commentsList.appendChild(card);
    });

    updateCommentCount();
    attachCommentOptionsEvents();
  }

  // Handle Form Submission
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = commentTextInput.value.trim();
      if (!text) return;

      const newComment = {
        id: 'c_' + Date.now(),
        author: 'მომხმარებელი',
        text: text,
        timestamp: 'ახლახან'
      };

      // Add to front
      comments.unshift(newComment);
      saveComments();
      renderComments();

      commentTextInput.value = '';

      // Scroll to start of comments
      if (commentsList) {
        commentsList.scrollTo({ left: 0, behavior: 'smooth' });
      }
    });

    if (commentTextInput) {
      commentTextInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          commentForm.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      });
    }
  }

  // Handle 2-dot button, delete click, and outside click dismiss
  function attachCommentOptionsEvents() {
    const twoDotButtons = document.querySelectorAll('.btn-two-dots');

    twoDotButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wrapper = btn.closest('.comment-options-wrapper');
        const popover = wrapper.querySelector('.comment-action-popover');
        const isShown = popover.classList.contains('show');

        // Close all other open popovers first
        closeAllCommentPopovers();

        // Toggle this popover
        if (!isShown) {
          popover.classList.add('show');
          btn.classList.add('active');
        }
      });
    });

    // Delete button inside popover
    const deleteButtons = document.querySelectorAll('.btn-delete-comment');
    deleteButtons.forEach((delBtn) => {
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const commentId = delBtn.dataset.deleteId;
        deleteComment(commentId);
      });
    });
  }

  function deleteComment(commentId) {
    comments = comments.filter(c => c.id !== commentId);
    saveComments();
    renderComments();
  }

  function closeAllCommentPopovers() {
    document.querySelectorAll('.comment-action-popover.show').forEach((pop) => {
      pop.classList.remove('show');
    });
    document.querySelectorAll('.btn-two-dots.active').forEach((btn) => {
      btn.classList.remove('active');
    });
  }

  // REQUIREMENT: "თუ მომხმარებელს წაშლის ღილაკის გაქრობა მოუნდება უბრალოდ სხვაგან უნდა დააჭიროს და წაშლის ღილაკიც უნდა გაქრეს"
  document.addEventListener('click', (e) => {
    // If click is outside any comment-options-wrapper, dismiss popovers
    if (!e.target.closest('.comment-options-wrapper')) {
      closeAllCommentPopovers();
    }
  });


  /* ==========================================================================
     2. 10 FAMOUS YOUTUBE CHANNELS - ROTATION EVERY 2 HOURS
     ========================================================================== */
  // Curated database of top famous worldwide YouTubers across genres
  const youtubeChannelsDatabase = [
    // Slot 1 (1-10)
    {
      name: 'MrBeast',
      handle: '@MrBeast',
      category: 'გართობა & გამოწვევები',
      subscribers: '370M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@MrBeast'
    },
    {
      name: 'Mark Rober',
      handle: '@MarkRober',
      category: 'ინჟინერია & მეცნიერება',
      subscribers: '59M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@MarkRober'
    },
    {
      name: 'Marques Brownlee (MKBHD)',
      handle: '@mkbhd',
      category: 'ტექნოლოგიები & გაჯეტები',
      subscribers: '19M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@mkbhd'
    },
    {
      name: 'Kurzgesagt – In a Nutshell',
      handle: '@kurzgesagt',
      category: 'ანიმაცია & მეცნიერება',
      subscribers: '23M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@kurzgesagt'
    },
    {
      name: 'Veritasium',
      handle: '@veritasium',
      category: 'ფიზიკა & აღმოჩენები',
      subscribers: '17M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@veritasium'
    },
    {
      name: 'Dude Perfect',
      handle: '@DudePerfect',
      category: 'სპორტი & ტრიუკები',
      subscribers: '60M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@DudePerfect'
    },
    {
      name: 'Ali Abdaal',
      handle: '@aliabdaal',
      category: 'პროდუქტიულობა & წიგნები',
      subscribers: '6M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@aliabdaal'
    },
    {
      name: 'Lex Fridman',
      handle: '@lexfridman',
      category: 'პოდკასტი & ხელოვნური ინტელექტი',
      subscribers: '4.5M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@lexfridman'
    },
    {
      name: 'Gordon Ramsay',
      handle: '@GordonRamsay',
      category: 'კულინარია & შეფი',
      subscribers: '21M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@GordonRamsay'
    },
    {
      name: 'PewDiePie',
      handle: '@PewDiePie',
      category: 'გეიმინგი & იუმორი',
      subscribers: '111M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@PewDiePie'
    },

    // Slot 2 (11-20)
    {
      name: 'Linus Tech Tips',
      handle: '@LinusTechTips',
      category: 'კომპიუტერები & აპარატურა',
      subscribers: '15.8M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@LinusTechTips'
    },
    {
      name: 'Vsauce',
      handle: '@Vsauce',
      category: 'ფილოსოფია & საინტერესო ფაქტები',
      subscribers: '22M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@Vsauce'
    },
    {
      name: 'SmarterEveryDay',
      handle: '@smartereveryday',
      category: 'ექსპერიმენტები & აერონავტიკა',
      subscribers: '11.5M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@smartereveryday'
    },
    {
      name: 'National Geographic',
      handle: '@NatGeo',
      category: 'ბუნება & ველური სამყარო',
      subscribers: '23M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@NatGeo'
    },
    {
      name: 'TED-Ed',
      handle: '@TEDEd',
      category: 'განათლება & ანიმაციები',
      subscribers: '20M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@TEDEd'
    },
    {
      name: 'Casey Neistat',
      handle: '@casey',
      category: 'ფილმმეიქინგი & ვლოგები',
      subscribers: '12.6M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@casey'
    },
    {
      name: 'Rick Beato',
      handle: '@RickBeato',
      category: 'მუსიკის თეორია & პროდიუსინგი',
      subscribers: '4.2M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@RickBeato'
    },
    {
      name: 'Cleo Abram',
      handle: '@CleoAbram',
      category: 'ოპტიმისტური ტექნოლოგია',
      subscribers: '3.4M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@CleoAbram'
    },
    {
      name: 'NASA',
      handle: '@NASA',
      category: 'კოსმოსი & მისია Artemis',
      subscribers: '12M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@NASA'
    },
    {
      name: '3Blue1Brown',
      handle: '@3blue1brown',
      category: 'მათემატიკა & ალგორითმები',
      subscribers: '6.4M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@3blue1brown'
    },

    // Slot 3 (21-30)
    {
      name: 'Peter McKinnon',
      handle: '@PeterMcKinnon',
      category: 'ფოტოგრაფია & კინო',
      subscribers: '5.9M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@PeterMcKinnon'
    },
    {
      name: 'ColdFusion',
      handle: '@ColdFusion',
      category: 'ბიზნესი & ტექნო-ისტორია',
      subscribers: '4.8M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@ColdFusion'
    },
    {
      name: 'GothamChess',
      handle: '@GothamChess',
      category: 'ჭადრაკი & სტრატეგია',
      subscribers: '5.2M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@GothamChess'
    },
    {
      name: 'ElectroBOOM',
      handle: '@ElectroBOOM',
      category: 'ელექტრონიკა & იუმორი',
      subscribers: '6.5M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@ElectroBOOM'
    },
    {
      name: 'OverSimplified',
      handle: '@OverSimplified',
      category: 'მსოფლიო ისტორია',
      subscribers: '8.4M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@OverSimplified'
    },
    {
      name: 'Johnny Harris',
      handle: '@johnnyharris',
      category: 'გეოპოლიტიკა & რუკები',
      subscribers: '5.1M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@johnnyharris'
    },
    {
      name: 'Two Minute Papers',
      handle: '@TwoMinutePapers',
      category: 'AI კვლევები & გრაფიკა',
      subscribers: '1.7M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@TwoMinutePapers'
    },
    {
      name: 'Huberman Lab',
      handle: '@hubermanlab',
      category: 'ნეირომეცნიერება & ჯანმრთელობა',
      subscribers: '6.1M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@hubermanlab'
    },
    {
      name: 'Daily Dose Of Internet',
      handle: '@DailyDoseOfInternet',
      category: 'ვირუსული ვიდეოები',
      subscribers: '19.2M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@DailyDoseOfInternet'
    },
    {
      name: 'Colin and Samir',
      handle: '@ColinandSamir',
      category: 'კრეატორთა ეკონომიკა',
      subscribers: '1.6M გამომწერი',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80',
      url: 'https://www.youtube.com/@ColinandSamir'
    }
  ];

  const channelsGrid = document.getElementById('channelsGrid');
  const twoHourCountdown = document.getElementById('twoHourCountdown');
  const currentSlotBadge = document.getElementById('currentSlotBadge');
  const btnTestNextSlot = document.getElementById('btnTestNextSlot');

  const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 7,200,000 ms
  let manualSlotOffset = 0; // For test next 2-hour button

  function getCurrentSlot() {
    const epochSlot = Math.floor(Date.now() / TWO_HOURS_MS);
    return epochSlot + manualSlotOffset;
  }

  function getChannelsForCurrentSlot() {
    const slot = getCurrentSlot();
    const totalChannels = youtubeChannelsDatabase.length;
    const startIndex = ((slot % Math.floor(totalChannels / 10)) * 10) % totalChannels;
    
    // Pick 10 channels sequentially from database pool
    const selected = [];
    for (let i = 0; i < 10; i++) {
      const idx = (startIndex + i) % totalChannels;
      selected.push(youtubeChannelsDatabase[idx]);
    }
    return { selected, slotIndex: (slot % 100) + 1 };
  }

  function renderRotatingChannels() {
    if (!channelsGrid) return;
    const { selected, slotIndex } = getChannelsForCurrentSlot();

    if (currentSlotBadge) {
      currentSlotBadge.textContent = `2-სთ ციკლი: #${slotIndex}`;
    }

    channelsGrid.innerHTML = '';

    selected.forEach((ch, index) => {
      const card = document.createElement('div');
      card.className = 'channel-card';
      card.innerHTML = `
        <span class="channel-rank-badge">#${index + 1}</span>
        
        <div class="channel-avatar-wrapper">
          <img class="channel-avatar" src="${ch.avatar}" alt="${escapeHtml(ch.name)}" loading="lazy">
          <span class="channel-yt-verify" title="YouTube Verified"><i class="fa-solid fa-check"></i></span>
        </div>

        <h3 class="channel-name" title="${escapeHtml(ch.name)}">${escapeHtml(ch.name)}</h3>
        <span class="channel-category">${escapeHtml(ch.category)}</span>
        
        <div class="channel-subs">
          <i class="fa-solid fa-users gold-icon"></i>
          <span>${escapeHtml(ch.subscribers)}</span>
        </div>

        <a href="${ch.url}" target="_blank" rel="noopener noreferrer" class="btn-blend btn-channel-link">
          <span>არხზე გადასვლა</span>
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      `;

      channelsGrid.appendChild(card);
    });
  }

  // 2-Hour live countdown timer
  function updateCountdown() {
    if (!twoHourCountdown) return;
    const now = Date.now();
    const elapsedInCurrentSlot = now % TWO_HOURS_MS;
    const remainingMs = TWO_HOURS_MS - elapsedInCurrentSlot;

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');
    twoHourCountdown.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    // When countdown hits 0 (or rolls over), re-render channels
    if (hours === 0 && minutes === 0 && seconds === 0) {
      renderRotatingChannels();
    }
  }

  // Test button to cycle to next 2-hour set without waiting
  if (btnTestNextSlot) {
    btnTestNextSlot.addEventListener('click', () => {
      manualSlotOffset++;
      renderRotatingChannels();
    });
  }


  /* ==========================================================================
     3. VIDEO STYLE & CONTENT SEARCH (10 TO 30 LINKS) WITH DELETE BUTTON
     ========================================================================== */
  const styleSearchInput = document.getElementById('styleSearchInput');
  const btnClearSearchInput = document.getElementById('btnClearSearchInput');
  const resultCountSelect = document.getElementById('resultCountSelect');
  const btnExecuteSearch = document.getElementById('btnExecuteSearch');
  const btnDeleteSearchResults = document.getElementById('btnDeleteSearchResults');
  const searchResultsArea = document.getElementById('searchResultsArea');
  const videoCardsGrid = document.getElementById('videoCardsGrid');
  const resultsTitle = document.getElementById('resultsTitle');
  const resultsCountBadge = document.getElementById('resultsCountBadge');
  const searchEmptyState = document.getElementById('searchEmptyState');
  const btnOpenOnYoutube = document.getElementById('btnOpenOnYoutube');
  const tagChips = document.querySelectorAll('.chip-tag');

  let currentSearchQuery = '';

  // Preset curated YouTube video styles & titles to assemble 10-30 rich realistic cards
  const videoCatalogTemplates = [
    { prefix: 'სრული დოკუმენტური მიმოხილვა:', time: '42:15', views: '1.2M ნახვა', ch: 'Discovery Horizon' },
    { prefix: 'საუკეთესო მომენტები & ანალიზი:', time: '18:40', views: '840K ნახვა', ch: 'Mastery Studio' },
    { prefix: 'დეტალური მასტერკლასი დამწყებთათვის:', time: '29:50', views: '2.5M ნახვა', ch: 'Aureum Academy' },
    { prefix: 'ტოპ 10 საიდუმლო და ფაქტი:', time: '14:22', views: '950K ნახვა', ch: 'Deep Dive World' },
    { prefix: 'პრაქტიკული გზამკვლევი 2026:', time: '22:10', views: '430K ნახვა', ch: 'Future Insight' },
    { prefix: 'საინტერესო ექსპერიმენტი & გამოცდა:', time: '16:05', views: '3.1M ნახვა', ch: 'Lab Chronicles' },
    { prefix: 'სრული კურსი და რჩევები:', time: '55:30', views: '720K ნახვა', ch: 'Elite Focus' },
    { prefix: 'დაუჯერებელი აღმოჩენა:', time: '12:45', views: '1.8M ნახვა', ch: 'Cosmic Vision' },
    { prefix: 'როგორ გავაკეთოთ ეს სწორად:', time: '20:18', views: '610K ნახვა', ch: 'Crafted Essence' },
    { prefix: 'ექსკლუზიური ინტერვიუ & პოდკასტი:', time: '1:15:40', views: '2.9M ნახვა', ch: 'Grand Talk' },
    { prefix: 'პირველი ნაბიჯები და სტრატეგია:', time: '25:12', views: '540K ნახვა', ch: 'Alpha Horizon' },
    { prefix: 'საუკეთესო მეთოდები რეალურ ცხოვრებაში:', time: '31:45', views: '1.1M ნახვა', ch: 'Prime Vision' },
    { prefix: 'მსოფლიო დონის ნამუშევარი:', time: '19:30', views: '3.4M ნახვა', ch: 'Cinematic Flow' },
    { prefix: 'შედეგები 30 დღის შემდეგ:', time: '15:20', views: '890K ნახვა', ch: 'Life Evolution' },
    { prefix: 'რა უნდა იცოდეთ აუცილებლად:', time: '21:05', views: '1.4M ნახვა', ch: 'Clarity Vault' },
    { prefix: 'ექსტრემალური გამოწვევა:', time: '28:14', views: '4.2M ნახვა', ch: 'Peak Adventure' },
    { prefix: 'მშვიდი ატმოსფერო და განტვირთვა:', time: '3:00:00', views: '5.8M ნახვა', ch: 'Zen Acoustic' },
    { prefix: 'ისტორია რომელმაც შეცვალა ყველაფერი:', time: '38:50', views: '2.1M ნახვა', ch: 'Historical Arc' },
    { prefix: 'ყველაზე გავრცელებული შეცდომები:', time: '17:22', views: '730K ნახვა', ch: 'Smart Logic' },
    { prefix: 'მომავლის ტექნოლოგიური გარღვევა:', time: '24:19', views: '1.6M ნახვა', ch: 'Next Nexus' },
    { prefix: 'საუკეთესო კოლექცია და რჩეულები:', time: '45:10', views: '980K ნახვა', ch: 'Curated Gold' },
    { prefix: 'პროფესიონალური შეფასება:', time: '16:55', views: '640K ნახვა', ch: 'Insight Studio' },
    { prefix: 'გამარჯვებულის სტრატეგია:', time: '23:40', views: '1.3M ნახვა', ch: 'Victory Mindset' },
    { prefix: 'საიდუმლოებები კულისებს მიღმა:', time: '34:12', views: '2.7M ნახვა', ch: 'Behind Curtains' },
    { prefix: 'უნიკალური კადრები 4K ხარისხში:', time: '13:08', views: '5.1M ნახვა', ch: 'Vivid Cinema' },
    { prefix: 'რატომ არის ეს ასე მნიშვნელოვანი:', time: '19:48', views: '820K ნახვა', ch: 'Core Question' },
    { prefix: 'სრული მიმოხილვა და ტესტი:', time: '27:35', views: '1.7M ნახვა', ch: 'Verdict Lab' },
    { prefix: 'ყველაფერი ერთ ვიდეოში:', time: '50:20', views: '3.9M ნახვა', ch: 'Omni Knowledge' },
    { prefix: 'დაუვიწყარი მოგზაურობა & ემოციები:', time: '33:14', views: '1.5M ნახვა', ch: 'Wanderlust 4K' },
    { prefix: 'ოქროს სტანდარტი:', time: '26:00', views: '2.4M ნახვა', ch: 'Aureum Showcase' }
  ];

  // Curated fallback thumbnail images for dynamic links
  const sampleThumbnails = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80'
  ];

  function performSearch() {
    const rawQuery = styleSearchInput.value.trim();
    if (!rawQuery) {
      styleSearchInput.focus();
      return;
    }

    currentSearchQuery = rawQuery;
    const requestedCount = parseInt(resultCountSelect.value, 10) || 20;

    // Show Results area and hide empty state
    if (searchEmptyState) searchEmptyState.style.display = 'none';
    if (searchResultsArea) searchResultsArea.style.display = 'block';

    resultsTitle.textContent = `„${escapeHtml(rawQuery)}“ - შედეგები`;
    resultsCountBadge.textContent = `${requestedCount} ლინკი`;

    // Populate YouTube-linked video cards
    videoCardsGrid.innerHTML = '';

    for (let i = 0; i < requestedCount; i++) {
      const template = videoCatalogTemplates[i % videoCatalogTemplates.length];
      const thumb = sampleThumbnails[i % sampleThumbnails.length];
      const videoTitle = `${template.prefix} ${rawQuery}`;
      const searchTargetUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(rawQuery + ' ' + (i + 1))}`;

      const card = document.createElement('div');
      card.className = 'video-card';
      card.innerHTML = `
        <div class="video-thumb-container">
          <img class="video-thumb-img" src="${thumb}" alt="${escapeHtml(videoTitle)}" loading="lazy">
          <div class="video-play-overlay">
            <div class="play-badge-icon">
              <i class="fa-solid fa-play"></i>
            </div>
          </div>
          <span class="video-duration">${template.time}</span>
        </div>

        <div class="video-content">
          <div class="video-tags-row">
            <span class="video-category-tag"><i class="fa-brands fa-youtube"></i> YouTube</span>
            <span class="video-index-badge">ლინკი #${i + 1}</span>
          </div>

          <h4 class="video-title" title="${escapeHtml(videoTitle)}">${escapeHtml(videoTitle)}</h4>

          <div class="video-meta">
            <span class="video-channel-name"><i class="fa-solid fa-circle-check gold-icon"></i> ${template.ch}</span>
            <span>${template.views}</span>
          </div>

          <div class="video-actions-row">
            <a href="${searchTargetUrl}" target="_blank" rel="noopener noreferrer" class="btn-watch-youtube">
              <i class="fa-brands fa-youtube"></i>
              <span>უყურე YouTube-ზე</span>
              <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75rem;"></i>
            </a>
          </div>
        </div>
      `;

      videoCardsGrid.appendChild(card);
    }

    // Smooth scroll down to results
    searchResultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // MANDATORY DELETE BUTTON FUNCTIONALITY:
  // "მომხმარებელს თუ სხვა სტილის და შინაარსის ვიდეოს ლინკი მოუნდება search ის გვერდით უნდა იყოს ღილაკი 
  // რომელსაც ეწერება delete ამ ღილაკს ვინც დააჭერს ლინკები უნდა გაქრეს და ამის შემდეგ შეეძლება 
  // მომხმარებელმა ჩაწეროს search ში ვიდეოს სტილი და შინაარსი და ხელ ახლა უნდა უჩვენოს..."
  function deleteAndClearSearchResults() {
    // 1. Clear the video links grid
    if (videoCardsGrid) {
      videoCardsGrid.innerHTML = '';
    }

    // 2. Hide results area
    if (searchResultsArea) {
      searchResultsArea.style.display = 'none';
    }

    // 3. Show empty state
    if (searchEmptyState) {
      searchEmptyState.style.display = 'block';
    }

    // 4. Clear search input and focus so user can type a new style
    if (styleSearchInput) {
      styleSearchInput.value = '';
      if (btnClearSearchInput) btnClearSearchInput.style.display = 'none';
      styleSearchInput.focus();
    }
  }

  if (btnExecuteSearch) {
    btnExecuteSearch.addEventListener('click', performSearch);
  }

  if (btnDeleteSearchResults) {
    btnDeleteSearchResults.addEventListener('click', deleteAndClearSearchResults);
  }

  if (styleSearchInput) {
    styleSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });

    styleSearchInput.addEventListener('input', () => {
      if (btnClearSearchInput) {
        btnClearSearchInput.style.display = styleSearchInput.value.length > 0 ? 'block' : 'none';
      }
    });
  }

  if (btnClearSearchInput) {
    btnClearSearchInput.addEventListener('click', () => {
      styleSearchInput.value = '';
      btnClearSearchInput.style.display = 'none';
      styleSearchInput.focus();
    });
  }

  // Suggestion chips
  tagChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      if (styleSearchInput) {
        styleSearchInput.value = q;
        if (btnClearSearchInput) btnClearSearchInput.style.display = 'block';
        performSearch();
      }
    });
  });

  // Direct open on YouTube
  if (btnOpenOnYoutube) {
    btnOpenOnYoutube.addEventListener('click', () => {
      const q = currentSearchQuery || styleSearchInput.value.trim() || 'trending youtube';
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, '_blank');
    });
  }


  /* ==========================================================================
     4. UNOBTRUSIVE BACKGROUND WAITING / LOUNGE MUSIC (YOUTUBE INTEGRATED)
     ========================================================================== */
  // Ambient / Elevator Waiting / Lofi Chill track playlist from YouTube
  const waitingMusicTracks = [
    {
      title: 'Elevator & Lounge Waiting Jazz',
      videoId: '5qap5aO4i9A',
      genre: 'Lounge Jazz'
    },
    {
      title: 'Lofi Hip Hop Study Waiting Beats',
      videoId: 'jfKfPfyJRdk',
      genre: 'Chill Lofi'
    },
    {
      title: 'Deep Ambient Space & Relaxation',
      videoId: 'DWcJFNfaw9c',
      genre: 'Ambient Space'
    },
    {
      title: 'Peaceful Rain & Acoustic Guitar',
      videoId: 'mPZkdNFkNps',
      genre: 'Acoustic Rain'
    },
    {
      title: 'Peaceful Lounge Piano Melodies',
      videoId: '4xDzrJKXOOY',
      genre: 'Relaxing Piano'
    },
    {
      title: 'Cozy Coffee Shop Waiting Ambience',
      videoId: 'lTRiuFIWV54',
      genre: 'Coffee Lounge'
    },
    {
      title: 'Gentle Ocean Waves & Soft Ambient',
      videoId: 'WPni755-Krg',
      genre: 'Ocean Calm'
    },
    {
      title: 'Late Night Smooth Chillhop',
      videoId: '7NOSDKb0HlU',
      genre: 'Night Chillhop'
    }
  ];

  let currentTrackIndex = 0;
  let ytPlayer = null;
  let isPlaying = false;
  let isMuted = false;
  let currentVolume = 45;

  const btnPlayerToggle = document.getElementById('btnPlayerToggle');
  const playerPlayIcon = document.getElementById('playerPlayIcon');
  const trackNameDisplay = document.getElementById('trackNameDisplay');
  const playerEq = document.getElementById('playerEq');
  const navSoundWave = document.getElementById('navSoundWave');
  const navMusicToggle = document.getElementById('navMusicToggle');
  const heroPlayMusicBtn = document.getElementById('heroPlayMusicBtn');
  const heroChangeMusicBtn = document.getElementById('heroChangeMusicBtn');
  const heroMusicIcon = document.getElementById('heroMusicIcon');
  const heroMusicText = document.getElementById('heroMusicText');
  const volumeSlider = document.getElementById('volumeSlider');
  const btnMuteToggle = document.getElementById('btnMuteToggle');
  const volumeIcon = document.getElementById('volumeIcon');
  const btnPrevTrack = document.getElementById('btnPrevTrack');
  const btnNextTrack = document.getElementById('btnNextTrack');
  const btnPlaylistToggle = document.getElementById('btnPlaylistToggle');
  const btnClosePlaylist = document.getElementById('btnClosePlaylist');
  const musicPlaylistPanel = document.getElementById('musicPlaylistPanel');
  const playlistTracksList = document.getElementById('playlistTracksList');
  const customYtInput = document.getElementById('customYtInput');
  const btnPlayCustomYt = document.getElementById('btnPlayCustomYt');
  const btnMinimizePlayer = document.getElementById('btnMinimizePlayer');
  const reopenMusicPill = document.getElementById('reopenMusicPill');
  const playerPill = document.querySelector('.player-pill');
  const playerInfoToggle = document.getElementById('playerInfoToggle');

  const btnToggleVideoView = document.getElementById('btnToggleVideoView');
  const ytEmbedWrapper = document.getElementById('ytEmbedWrapper');

  // Helper to send command to the embedded YouTube iframe
  function postToYtFrame(command, args) {
    if (!args) args = [];
    const frame = document.getElementById('youtubeAudioFrame');
    if (frame && frame.contentWindow) {
      try {
        frame.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: command,
          args: args
        }), '*');
      } catch (e) {
        console.warn('postToYtFrame warning:', e);
      }
    }
  }

  function setPlayState(playing) {
    isPlaying = playing;
    if (playing) {
      if (playerPlayIcon) playerPlayIcon.className = 'fa-solid fa-pause';
      if (playerEq) playerEq.classList.add('playing');
      if (navSoundWave) navSoundWave.classList.add('playing');
      if (heroMusicIcon) heroMusicIcon.className = 'fa-solid fa-pause';
      if (heroMusicText) heroMusicText.textContent = 'მუსიკის დაპაუზება';
    } else {
      if (playerPlayIcon) playerPlayIcon.className = 'fa-solid fa-play';
      if (playerEq) playerEq.classList.remove('playing');
      if (navSoundWave) navSoundWave.classList.remove('playing');
      if (heroMusicIcon) heroMusicIcon.className = 'fa-solid fa-play';
      if (heroMusicText) heroMusicText.textContent = 'მუსიკის ჩართვა';
    }
    renderPlaylistTracks();
  }

  function togglePlayMusic() {
    const frame = document.getElementById('youtubeAudioFrame');
    if (!frame) return;

    if (isPlaying) {
      // Pause YouTube audio
      postToYtFrame('pauseVideo');
      setPlayState(false);
    } else {
      // Start or Resume playing
      const track = waitingMusicTracks[currentTrackIndex];
      const targetSrc = `https://www.youtube.com/embed/${track.videoId}?autoplay=1&enablejsapi=1&loop=1&playlist=${track.videoId}`;

      if (!frame.src || !frame.src.includes(track.videoId) || !frame.src.includes('autoplay=1')) {
        frame.src = targetSrc;
      } else {
        postToYtFrame('playVideo');
      }
      setPlayState(true);
      setTimeout(() => {
        postToYtFrame('setVolume', [currentVolume]);
      }, 1200);
    }
  }

  // MUSIC SWITCHING (მუსიკის შეცვლა - გარანტირებული გადართვა)
  function switchTrack(index) {
    if (index < 0 || index >= waitingMusicTracks.length) return;
    currentTrackIndex = index;
    const track = waitingMusicTracks[currentTrackIndex];

    const frame = document.getElementById('youtubeAudioFrame');
    if (frame) {
      // Direct URL assignment immediately forces YouTube to load the new video and autoplay its music!
      frame.src = `https://www.youtube.com/embed/${track.videoId}?autoplay=1&enablejsapi=1&loop=1&playlist=${track.videoId}`;
    }

    setPlayState(true);
    updateTrackDisplay();
    renderPlaylistTracks();

    setTimeout(() => {
      postToYtFrame('setVolume', [currentVolume]);
    }, 1200);
  }

  function prevTrack() {
    const newIndex = (currentTrackIndex - 1 + waitingMusicTracks.length) % waitingMusicTracks.length;
    switchTrack(newIndex);
  }

  function nextTrack() {
    const newIndex = (currentTrackIndex + 1) % waitingMusicTracks.length;
    switchTrack(newIndex);
  }

  function updateTrackDisplay() {
    const track = waitingMusicTracks[currentTrackIndex];
    if (trackNameDisplay) {
      trackNameDisplay.textContent = track.title;
      trackNameDisplay.title = track.title;
    }
  }

  // Render Playlist Items
  function renderPlaylistTracks() {
    if (!playlistTracksList) return;
    playlistTracksList.innerHTML = '';

    waitingMusicTracks.forEach((track, idx) => {
      const item = document.createElement('div');
      item.className = 'track-item' + (idx === currentTrackIndex ? ' active' : '');
      item.dataset.index = idx;

      const isCurrentActive = (idx === currentTrackIndex);
      const isCurrentPlaying = (isCurrentActive && isPlaying);

      item.innerHTML = `
        <div class="track-item-left">
          <div class="track-item-icon">
            <i class="fa-solid ${isCurrentPlaying ? 'fa-volume-high' : 'fa-play'}"></i>
          </div>
          <div class="track-item-info">
            <div class="track-item-title">${escapeHtml(track.title)}</div>
            <div class="track-item-genre">${escapeHtml(track.genre)}</div>
          </div>
        </div>
        <span class="track-item-badge">${isCurrentActive ? (isPlaying ? 'იკვრება' : 'არჩეული') : 'ჩართვა'}</span>
      `;

      item.addEventListener('click', () => {
        switchTrack(idx);
      });

      playlistTracksList.appendChild(item);
    });
  }

  // Custom YouTube URL / ID Extractor
  function extractYouTubeVideoId(input) {
    if (!input) return null;
    input = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
      return input;
    }
    const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  }

  function playCustomYouTubeTrack() {
    if (!customYtInput) return;
    const rawVal = customYtInput.value.trim();
    if (!rawVal) {
      customYtInput.focus();
      return;
    }

    const videoId = extractYouTubeVideoId(rawVal);
    if (!videoId) {
      alert('გთხოვთ შეიყვანოთ სწორი YouTube ლინკი (მაგ: https://www.youtube.com/watch?v=... ან 11-ნიშნა ID)');
      return;
    }

    const newTrack = {
      title: 'საკუთარი YouTube მუსიკა',
      videoId: videoId,
      genre: 'Custom Video'
    };

    waitingMusicTracks.unshift(newTrack);
    customYtInput.value = '';
    switchTrack(0);
  }

  // Playlist Panel Show / Hide
  function togglePlaylistPanel() {
    if (!musicPlaylistPanel) return;
    const isShown = musicPlaylistPanel.classList.contains('show');
    if (!isShown) {
      renderPlaylistTracks();
      musicPlaylistPanel.classList.add('show');
      if (playerPill) playerPill.classList.remove('minimized');
      if (reopenMusicPill) reopenMusicPill.classList.remove('show');
    } else {
      musicPlaylistPanel.classList.remove('show');
    }
  }

  function closePlaylistPanel() {
    if (musicPlaylistPanel) {
      musicPlaylistPanel.classList.remove('show');
    }
  }

  // Audio Control Event Listeners
  if (btnPlayerToggle) btnPlayerToggle.addEventListener('click', togglePlayMusic);
  if (navMusicToggle) navMusicToggle.addEventListener('click', togglePlayMusic);
  if (heroPlayMusicBtn) heroPlayMusicBtn.addEventListener('click', togglePlayMusic);
  if (heroChangeMusicBtn) heroChangeMusicBtn.addEventListener('click', togglePlaylistPanel);
  if (btnPlaylistToggle) btnPlaylistToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlaylistPanel();
  });
  if (playerInfoToggle) playerInfoToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlaylistPanel();
  });
  if (btnClosePlaylist) btnClosePlaylist.addEventListener('click', closePlaylistPanel);

  if (btnPrevTrack) btnPrevTrack.addEventListener('click', (e) => {
    e.stopPropagation();
    prevTrack();
  });

  if (btnNextTrack) btnNextTrack.addEventListener('click', (e) => {
    e.stopPropagation();
    nextTrack();
  });

  if (btnToggleVideoView && ytEmbedWrapper) {
    btnToggleVideoView.addEventListener('click', (e) => {
      e.stopPropagation();
      ytEmbedWrapper.classList.toggle('show-video');
      const isVisible = ytEmbedWrapper.classList.contains('show-video');
      btnToggleVideoView.classList.toggle('active', isVisible);
    });
  }

  if (btnPlayCustomYt) btnPlayCustomYt.addEventListener('click', playCustomYouTubeTrack);
  if (customYtInput) {
    customYtInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        playCustomYouTubeTrack();
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      currentVolume = parseInt(e.target.value, 10);
      postToYtFrame('setVolume', [currentVolume]);
      if (currentVolume === 0) {
        if (volumeIcon) volumeIcon.className = 'fa-solid fa-volume-xmark';
      } else {
        if (volumeIcon) volumeIcon.className = 'fa-solid fa-volume-high';
      }
    });
  }

  if (btnMuteToggle) {
    btnMuteToggle.addEventListener('click', () => {
      isMuted = !isMuted;
      if (isMuted) {
        postToYtFrame('mute');
        if (volumeIcon) volumeIcon.className = 'fa-solid fa-volume-xmark';
      } else {
        postToYtFrame('unMute');
        postToYtFrame('setVolume', [currentVolume]);
        if (volumeIcon) volumeIcon.className = 'fa-solid fa-volume-high';
      }
    });
  }

  // Minimize / Reopen Player Pill
  if (btnMinimizePlayer && playerPill && reopenMusicPill) {
    btnMinimizePlayer.addEventListener('click', () => {
      playerPill.classList.add('minimized');
      reopenMusicPill.classList.add('show');
      closePlaylistPanel();
    });

    reopenMusicPill.addEventListener('click', () => {
      playerPill.classList.remove('minimized');
      reopenMusicPill.classList.remove('show');
    });
  }

  // Close playlist on click outside
  document.addEventListener('click', (e) => {
    if (musicPlaylistPanel && musicPlaylistPanel.classList.contains('show')) {
      if (!e.target.closest('#musicPlaylistPanel') && 
          !e.target.closest('#btnPlaylistToggle') && 
          !e.target.closest('#playerInfoToggle') &&
          !e.target.closest('#heroChangeMusicBtn')) {
        closePlaylistPanel();
      }
    }
  });


  /* ==========================================================================
     5. INITIALIZATION & TIMERS
     ========================================================================== */
  loadComments();
  renderRotatingChannels();
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Helper sanitization
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

});
