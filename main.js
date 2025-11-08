
// ===== MAIN APPLICATION =====
let currentSelectedRoom = null;
let selectedBooking = null;
let currentPage = 'dashboard';
function switchPageWithAnimation(pageName) {
    console.log('🎬 Switching to page with animation:', pageName);
    
    // Add fade out effect to current page
    const currentActivePage = document.querySelector('.page-content.active');
    if (currentActivePage) {
        currentActivePage.style.animation = 'fadeOut 0.3s ease-out forwards';
    }
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show target page dengan animation
        const targetPage = document.getElementById(pageName + 'Page');
        if (targetPage) {
            targetPage.style.display = 'block';
            targetPage.classList.add('active');
            currentPage = pageName;
            
            // Add animation class
            targetPage.style.animation = 'fadeIn 0.5s ease-out forwards';
            
            // Update active navigation
            const activeNav = document.querySelector(`.nav-item[data-page="${pageName}"]`);
            if (activeNav) {
                activeNav.classList.add('active');
            }
            
            // Update breadcrumb
            updateBreadcrumb(pageName);
            
            // Update page title
            updatePageTitle(pageName);
            
            // Initialize page-specific functionality
            initializePage(pageName);
        }
    }, 300);
}

// ===== TYPING EFFECT =====
function typeWriterEffect(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}
// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 GAMASI Initialized');
    
    checkAuthentication();
    setupPageNavigation();
    setupLogout();
    updateUserInterface();
    initializeAllPages();
    
    // Show dashboard by default
    switchPage('dashboard');
});

// ===== AUTHENTICATION SYSTEM =====
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userFullName = localStorage.getItem('userName');
    
    console.log('🔐 Authentication check:', { isLoggedIn, userFullName });
    
    if (!isLoggedIn) {
        console.log('❌ Not authenticated, redirecting to login...');
        window.location.href = 'index.html';
        return false;
    }
    
    console.log('✅ User authenticated:', userFullName);
    return true;
}

function updateUserInterface() {
    const userFullName = localStorage.getItem('userName') || 'User';
    
    // Update all user name elements
    document.querySelectorAll('.user-name, .highlight, #welcomeUserName').forEach(el => {
        el.textContent = userFullName;
    });
    
    // Typing effect untuk welcome message ← INI YANG BARU
    const welcomeElement = document.getElementById('welcomeUserName');
    if (welcomeElement) {
        setTimeout(() => {
            typeWriterEffect(welcomeElement, userFullName, 80);
        }, 1000);
    }
    
    // Update avatar initials
    const avatarFallback = document.querySelector('.avatar-fallback');
    if (avatarFallback) {
        const initials = userFullName.split(' ').map(n => n[0]).join('').toUpperCase();
        avatarFallback.textContent = initials;
    }
}

function setupLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (!logoutBtn) {
        console.error('❌ Logout button not found');
        return;
    }
    
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (confirm('Apakah Anda yakin ingin logout dari GAMASI?')) {
            console.log('🚪 User logging out...');
            
            // Clear all storage
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userName');
            
            // Redirect to login page
            window.location.href = 'index.html';
        }
    });
}

// ===== PAGE NAVIGATION SYSTEM =====
// GANTI function setupPageNavigation yang lama dengan ini:
function setupPageNavigation() {
    console.log('🌐 Setting up page navigation...');
    
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const quickActionBtns = document.querySelectorAll('.quick-action-btn[data-page]');
    const otherButtons = document.querySelectorAll('button[data-page]');
    
    // Setup navigation items dengan animation
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            console.log('📍 Navigation clicked:', targetPage);
            switchPageWithAnimation(targetPage); // ← GUNAKAN YANG BARU
        });
    });
    
    // Setup quick action buttons
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            console.log('⚡ Quick action:', targetPage);
            switchPageWithAnimation(targetPage); // ← GUNAKAN YANG BARU
        });
    });
    
    // Setup other buttons
    otherButtons.forEach(btn => {
        if (btn.getAttribute('data-page')) {
            btn.addEventListener('click', function() {
                const targetPage = this.getAttribute('data-page');
                console.log('🔘 Button navigation:', targetPage);
                switchPageWithAnimation(targetPage); // ← GUNAKAN YANG BARU
            });
        }
    });
    
    console.log('✅ Page navigation setup completed');
}

function switchPage(pageName) {
    console.log('🔄 Switching to page:', pageName);
    
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // Update active navigation
        const activeNav = document.querySelector(`.nav-item[data-page="${pageName}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
        
        // Update breadcrumb
        updateBreadcrumb(pageName);
        
        // Update page title
        updatePageTitle(pageName);
        
        // Initialize page-specific functionality
        initializePage(pageName);
        
        console.log('✅ Page switched to:', pageName);
    } else {
        console.error('❌ Page not found:', pageName);
    }
}

function updateBreadcrumb(pageName) {
    const breadcrumb = document.getElementById('breadcrumb');
    if (!breadcrumb) return;
    
    const pageTitles = {
        'dashboard': 'Dashboard',
        'peminjaman': 'Peminjaman Ruangan',
        'library': 'Perpustakaan',
        'jadwal': 'Jadwal Kuliah',
        'nilai': 'Nilai Akademik',
        'pengumuman': 'Pengumuman',
        'notifikasi': 'Notifikasi',
        'fasilitas': 'Fasilitas'
    };
    
    breadcrumb.innerHTML = `
        <span class="breadcrumb-item">Home</span>
        <span class="breadcrumb-divider">/</span>
        <span class="breadcrumb-item active">${pageTitles[pageName] || pageName}</span>
    `;
}

function updatePageTitle(pageName) {
    const titles = {
        'dashboard': 'Dashboard',
        'peminjaman': 'Peminjaman Ruangan',
        'library': 'Perpustakaan',
        'jadwal': 'Jadwal Kuliah',
        'nilai': 'Nilai Akademik',
        'pengumuman': 'Pengumuman',
        'notifikasi': 'Notifikasi',
        'fasilitas': 'Fasilitas'
    };
    
    document.title = ` GAMASI - ${titles[pageName] || 'Dashboard'}`;
}

// ===== PAGE INITIALIZATION SYSTEM =====
function initializeAllPages() {
    console.log('🚀 Initializing all pages...');
    
    // Initialize each page
    initializePeminjamanPage();
    initializeLibraryPage();
    initializeJadwalPage();
    initializeNilaiPage();
    initializePengumumanPage();
    initializeNotifikasiPage();
    initializeFasilitasPage();
    
    console.log('✅ All pages initialized');
}

function initializePage(pageName) {
    console.log('🔄 Initializing page:', pageName);
    
    switch(pageName) {
        case 'peminjaman':
            initializePeminjamanPage();
            break;
        case 'library':
            initializeLibraryPage();
            break;
        case 'jadwal':
            initializeJadwalPage();
            break;
        case 'nilai':
            initializeNilaiPage();
            break;
        case 'pengumuman':
            initializePengumumanPage();
            break;
        case 'notifikasi':
            initializeNotifikasiPage();
            break;
        case 'fasilitas':
            initializeFasilitasPage();
            break;
    }
}

// ===== PEMINJAMAN PAGE FUNCTIONALITY =====
function initializePeminjamanPage() {
    console.log('🏢 Initializing peminjaman page...');
    
    // Load rooms data
    loadRooms();
    
    // Setup search functionality
    const searchInput = document.getElementById('roomSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterRooms(e.target.value);
        });
    }
    
    // Setup filter button
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            showRoomFilters();
        });
    }
    
    // Setup modal
    setupScheduleModal();
}

function loadRooms() {
    const roomsGrid = document.getElementById('roomsGrid');
    if (!roomsGrid) return;
    
    roomsGrid.innerHTML = '';
    
    roomsData.forEach(room => {
        const roomCard = createRoomCard(room);
        roomsGrid.appendChild(roomCard);
    });
    
    console.log('✅ Rooms loaded:', roomsData.length);
}

function createRoomCard(room) {
    const card = document.createElement('div');
    card.className = `room-card ${room.status}`;
    card.innerHTML = `
        <div class="room-header">
            <h4>${room.name}</h4>
            <span class="room-status ${room.status}">
                ${getStatusText(room.status)}
            </span>
        </div>
        <div class="room-info">
            <div class="room-capacity">
                <span>👥</span> ${room.capacity} orang
            </div>
            <div class="room-facilities">
                ${room.facilities.slice(0, 2).map(fac => 
                    `<span class="facility-tag">${fac}</span>`
                ).join('')}
                ${room.facilities.length > 2 ? 
                    `<span class="facility-more">+${room.facilities.length - 2} more</span>` : ''
                }
            </div>
        </div>
        <div class="room-actions">
            <button class="btn-primary view-schedule" data-room-id="${room.id}">
                Lihat Jadwal
            </button>
            ${room.status === 'available' ? 
                `<button class="btn-secondary quick-book" data-room-id="${room.id}">
                    Pinjam Cepat
                </button>` : ''
            }
        </div>
    `;
    
    // Add event listeners
    const viewScheduleBtn = card.querySelector('.view-schedule');
    viewScheduleBtn.addEventListener('click', () => showRoomSchedule(room));
    
    if (room.status === 'available') {
        const quickBookBtn = card.querySelector('.quick-book');
        quickBookBtn.addEventListener('click', () => quickBookRoom(room));
    }
    
    return card;
}

function getStatusText(status) {
    const statusMap = {
        'available': 'Tersedia',
        'occupied': 'Dipinjam',
        'maintenance': 'Maintenance'
    };
    return statusMap[status] || status;
}

function showRoomSchedule(room) {
    console.log('📅 Showing schedule for:', room.name);
    
    currentSelectedRoom = room;
    
    // Update modal title
    document.getElementById('modalRoomTitle').textContent = `Jadwal ${room.name}`;
    
    // Generate schedule table
    generateScheduleTable(room);
    
    // Show modal
    document.getElementById('scheduleModal').style.display = 'block';
}

function generateScheduleTable(room) {
    const days = [
        { id: 'senin', name: 'Senin' },
        { id: 'selasa', name: 'Selasa' },
        { id: 'rabu', name: 'Rabu' },
        { id: 'kamis', name: 'Kamis' },
        { id: 'jumat', name: 'Jumat' }
    ];
    
    const timeSlots = [
        "08:00-10:00",
        "10:00-12:00", 
        "13:00-15:00",
        "15:00-17:00"
    ];
    
    // Generate table header
    const thead = document.querySelector('.schedule-table thead tr');
    thead.innerHTML = '<th class="time-header">WAKTU</th>';
    days.forEach(day => {
        thead.innerHTML += `<th>${day.name}</th>`;
    });
    
    // Generate table body
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';
    
    timeSlots.forEach(timeSlot => {
        const row = document.createElement('tr');
        row.innerHTML = `<td class="time-slot">${timeSlot}</td>`;
        
        days.forEach(day => {
            const status = room.schedule[day.id]?.[timeSlot] || 'available';
            const cell = document.createElement('td');
            cell.className = `schedule-cell ${status}`;
            cell.setAttribute('data-day', day.id);
            cell.setAttribute('data-time', timeSlot);
            
            let statusText = '';
            let statusIcon = '';
            
            if (status === 'available') {
                statusText = 'Tersedia';
                statusIcon = '✅';
            } else {
                statusText = 'Dipinjam';
                statusIcon = '❌';
            }
            
            cell.innerHTML = `
                <div class="slot-content">
                    <span class="status-indicator"></span>
                    <span class="status-text">${statusText}</span>
                    <span class="status-icon">${statusIcon}</span>
                </div>
            `;
            
            // Add click event hanya untuk yang available
            if (status === 'available') {
                cell.classList.add('clickable');
                cell.addEventListener('click', () => selectTimeSlot(room, day.id, timeSlot, cell));
            } else {
                cell.style.cursor = 'not-allowed';
                cell.title = 'Ruangan sudah dipinjam';
            }
            
            row.appendChild(cell);
        });
        
        tbody.appendChild(row);
    });
    
    // Tambahkan legend
    addScheduleLegend();
}

// ✅ FUNCTION BARU: Tambah legend
function addScheduleLegend() {
    const modalBody = document.querySelector('.modal-body');
    const existingLegend = document.querySelector('.schedule-legend');
    
    // Hapus legend lama jika ada
    if (existingLegend) {
        existingLegend.remove();
    }
    
    const legend = document.createElement('div');
    legend.className = 'schedule-legend';
    legend.innerHTML = `
        <div class="legend-item">
            <div class="legend-color legend-available"></div>
            <span>Tersedia</span>
        </div>
        <div class="legend-item">
            <div class="legend-color legend-occupied"></div>
            <span>Sudah Dipinjam</span>
        </div>
        <div class="legend-item">
            <div class="legend-color legend-selected"></div>
            <span>Dipilih</span>
        </div>
    `;
    
    // Sisipkan legend sebelum calendar
    const calendar = document.querySelector('.schedule-calendar');
    modalBody.insertBefore(legend, calendar);
}

// ✅ GANTI DENGAN YANG BARU:
function selectTimeSlot(room, day, timeSlot, cell) {
    console.log('⏰ Selected:', room.name, day, timeSlot);
    
    // Hapus selection sebelumnya
    document.querySelectorAll('.schedule-cell.selected').forEach(selectedCell => {
        selectedCell.classList.remove('selected');
    });
    
    // Tambah selection ke cell yang diklik
    cell.classList.add('selected');
    
    // Store selected booking details
    selectedBooking = {
        room: room,
        day: day,
        timeSlot: timeSlot,
        cell: cell,
        date: getNextDateForDay(day)  // ✅ BARU DITAMBAH
    };
    
    // Enable book button dan update text
    const bookBtn = document.getElementById('bookRoom');
    bookBtn.disabled = false;
    bookBtn.textContent = `Pinjam ${room.name} - ${getDayName(day)} ${timeSlot}`;
    bookBtn.style.background = 'var(--success)';
    
    // Show confirmation message
    showNotification(`✅ Dipilih: ${room.name} - ${getDayName(day)} ${timeSlot}`, 'success');
}

function setupScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    const closeBtn = document.getElementById('closeModal');
    const bookBtn = document.getElementById('bookRoom');
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        selectedBooking = null;
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            selectedBooking = null;
        }
    });
    
    // Book room action
    bookBtn.addEventListener('click', () => {
        if (selectedBooking) {
            bookSelectedRoom();
        } else {
            showNotification('Pilih jadwal terlebih dahulu!', 'error');
        }
    });
    
    // Week navigation
    document.getElementById('prevWeek').addEventListener('click', showPreviousWeek);
    document.getElementById('nextWeek').addEventListener('click', showNextWeek);
}

function bookSelectedRoom() {
    if (!selectedBooking) {
        showNotification('❌ Pilih jadwal terlebih dahulu!', 'error');
        return;
    }
    
    const { room, day, timeSlot, cell } = selectedBooking;
    
    if (confirm(`Pinjam ${room.name} pada ${getDayName(day)} ${timeSlot}?`)) {
        // Simulate booking process
        showNotification(`✅ Berhasil meminjam ${room.name}!\n📅 ${getDayName(day)} ${timeSlot}`, 'success');
        
        // Update UI - ubah status cell menjadi occupied
        cell.classList.remove('selected', 'available');
        cell.classList.add('occupied');
        cell.innerHTML = `
            <div class="slot-content">
                <span class="status-indicator"></span>
                <span class="status-text">Dipinjam</span>
                <span class="status-icon">❌</span>
            </div>
        `;
        cell.style.cursor = 'not-allowed';
        cell.title = 'Ruangan sudah dipinjam';
        
        // Remove click event
        cell.replaceWith(cell.cloneNode(true));
        
        // Close modal setelah delay
        setTimeout(() => {
            document.getElementById('scheduleModal').style.display = 'none';
        }, 2000);
        
        // Update room status in UI
        updateRoomStatus(room.id, 'occupied');
        
        // Reset selection
        selectedBooking = null;
        
        // Reset book button
        const bookBtn = document.getElementById('bookRoom');
        bookBtn.disabled = true;
        bookBtn.textContent = 'Pinjam Ruangan Ini';
        bookBtn.style.background = '';
    }
}

function quickBookRoom(room) {
    if (confirm(`Pinjam ${room.name} untuk sekarang?`)) {
        showNotification(` ${room.name} berhasil dipinjam!`, 'success');
        updateRoomStatus(room.id, 'occupied');
    }
}

function updateRoomStatus(roomId, newStatus) {
    const roomIndex = roomsData.findIndex(room => room.id === roomId);
    if (roomIndex !== -1) {
        roomsData[roomIndex].status = newStatus;
        loadRooms(); // Refresh rooms display
    }
}

function filterRooms(query) {
    const roomsGrid = document.getElementById('roomsGrid');
    if (!roomsGrid) return;
    
    const roomCards = roomsGrid.querySelectorAll('.room-card');
    const searchTerm = query.toLowerCase();
    
    roomCards.forEach(card => {
        const roomName = card.querySelector('h4').textContent.toLowerCase();
        if (roomName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function showRoomFilters() {
    alert('Fitur filter ruangan akan segera hadir!');
}

// ===== LIBRARY PAGE FUNCTIONALITY =====
function initializeLibraryPage() {
    console.log('📚 Initializing library page...');
    
    // ✅ FIX: Setup search dengan removeEventListener dulu
    const searchInput = document.getElementById('librarySearch');
    if (searchInput) {
        searchInput.removeEventListener('input', handleSearch);
        searchInput.addEventListener('input', handleSearch);
    }
    
    // ✅ FIX: Category filters dengan remove dulu
    document.querySelectorAll('.category-card').forEach(card => {
        card.removeEventListener('click', handleCategoryClick);
        card.addEventListener('click', handleCategoryClick);
    });
    
    // ✅ FIX: Pakai event delegation (hanya 1 event listener)
    setupBookBorrowing();
}
// ✅ TAMBAHKAN FUNCTION INI
function handleSearch(e) {
    const query = e.target.value;
    if (query.length > 2) {
        console.log('🔍 Searching books for:', query);
        showNotification(`Menampilkan hasil untuk: ${query}`, 'info');
    }
}
// ✅ TAMBAHKAN FUNCTION INI  
function handleCategoryClick() {
    const category = this.getAttribute('data-category');
    console.log('📂 Filtering books by category:', category);
    showNotification(`Menampilkan buku kategori: ${getCategoryName(category)}`, 'info');
}
function searchBooks(query) {
    if (query.length > 2) {
        console.log('🔍 Searching books for:', query);
        showNotification(`Menampilkan hasil untuk: ${query}`, 'info');
    }
}
function setupBookBorrowing() {
    const booksSection = document.querySelector('.books-section');
    if (booksSection) {
        // Hapus event listener lama
        booksSection.removeEventListener('click', handleBookBorrow);
        // Pasang event listener baru (hanya satu)
        booksSection.addEventListener('click', handleBookBorrow);
    }
}
// ✅ TAMBAHKAN FUNCTION INI
function handleBookBorrow(e) {
    // Cek jika yang diklik adalah tombol "Pinjam Buku"
    if (e.target.classList.contains('btn-primary') && e.target.classList.contains('btn-sm')) {
        e.preventDefault();
        e.stopPropagation(); // Penting: stop event bubbling
        
        const bookCard = e.target.closest('.book-card');
        if (bookCard) {
            const bookTitle = bookCard.querySelector('h4').textContent;
            const bookAuthor = bookCard.querySelector('.book-author').textContent;
            
            console.log('📖 Borrowing book:', bookTitle);
            borrowBook(bookTitle, bookAuthor);
        }
    }
}
function filterBooksByCategory(category) {
    console.log('📂 Filtering books by category:', category);
    showNotification(`Menampilkan buku kategori: ${getCategoryName(category)}`, 'info');
}

// ✅ GANTI function borrowBook yang lama dengan ini:
function borrowBook(bookTitle, bookAuthor = '') {
    // Cek jika sudah ada notifikasi aktif
    if (window.currentBorrowNotification) {
        return; // Jangan izinkan multiple clicks
    }
    
    if (confirm(`Pinjam buku "${bookTitle}"${bookAuthor ? ` oleh ${bookAuthor}` : ''}?`)) {
        // Set flag untuk prevent multiple clicks
        window.currentBorrowNotification = true;
        
        // Disable tombol sementara
        const buttons = document.querySelectorAll('.btn-primary.btn-sm');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
        });
        
        showNotification(` Buku "${bookTitle}" berhasil dipinjam!`, 'success');
        
        // Reset setelah 2 detik
        setTimeout(() => {
            window.currentBorrowNotification = false;
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
            });
        }, 2000);
    }
}

// ✅ TAMBAHKAN FUNCTION INI (jika belum ada)
function getCategoryName(category) {
    const categories = {
        'technology': 'Teknologi',
        'science': 'Sains',
        'mathematics': 'Matematika',
        'fiction': 'Fiksi'
    };
    return categories[category] || category;
}

// ===== OTHER PAGES INITIALIZATION =====
function initializeJadwalPage() {
    console.log('📅 Initializing jadwal page...');
    
    const weekFilter = document.getElementById('weekFilter');
    if (weekFilter) {
        weekFilter.addEventListener('change', function() {
            filterSchedule(this.value);
        });
    }
}

function initializeNilaiPage() {
    console.log('📝 Initializing nilai page...');
    
    const semesterFilter = document.getElementById('semesterFilter');
    if (semesterFilter) {
        semesterFilter.addEventListener('change', function() {
            filterGrades(this.value);
        });
    }
}

function initializePengumumanPage() {
    console.log('📢 Initializing pengumuman page...');
    // Load all announcements
}

function initializeNotifikasiPage() {
    console.log('🔔 Initializing notifikasi page...');
    
    const markAllReadBtn = document.getElementById('markAllRead');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            markAllNotificationsRead();
        });
    }
}

function initializeFasilitasPage() {
    console.log('🏢 Initializing fasilitas page...');
    // Load all facilities
}

// ===== HELPER FUNCTIONS =====
function getDayName(dayId) {
    const days = {
        'senin': 'Senin',
        'selasa': 'Selasa', 
        'rabu': 'Rabu',
        'kamis': 'Kamis',
        'jumat': 'Jumat',
        'sabtu': 'Sabtu',    // ✅ BARU DITAMBAH
        'minggu': 'Minggu'   // ✅ BARU DITAMBAH
    };
    return days[dayId] || dayId;
}
// ✅ TAMBAHKAN FUNCTION BARU INI:
function getNextDateForDay(dayName) {
    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    const dayIndex = days.indexOf(dayName.toLowerCase());
    const today = new Date();
    const todayIndex = today.getDay();
    
    let daysToAdd = dayIndex - todayIndex;
    if (daysToAdd <= 0) {
        daysToAdd += 7; // Next week
    }
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);
    return nextDate;
}

function getCellTooltip(status) {
    const tooltips = {
        'available': 'Klik untuk meminjam ruangan',
        'occupied': 'Ruangan sudah dipinjam',
        'maintenance': 'Ruangan dalam perbaikan',
        'class': 'Sedang digunakan untuk kelas'
    };
    return tooltips[status] || 'Tidak tersedia';
}
// ✅ TAMBAHKAN FUNCTION BARU INI:
function generateDetailedSchedule() {
    const schedule = {};
    const timeSlots = [
        "07:00-09:00",
        "09:00-11:00", 
        "11:00-13:00",
        "13:00-15:00",
        "15:00-17:00",
        "17:00-19:00",
        "19:00-21:00"
    ];
    const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    
    // Class schedules untuk realism
    const classSchedules = {
        'senin': ['09:00-11:00', '13:00-15:00'],
        'selasa': ['07:00-09:00', '15:00-17:00'],
        'rabu': ['11:00-13:00', '17:00-19:00'],
        'kamis': ['09:00-11:00', '19:00-21:00'],
        'jumat': ['07:00-09:00', '13:00-15:00'],
        'sabtu': ['09:00-11:00']
    };
    
    days.forEach(day => {
        schedule[day] = {};
        timeSlots.forEach(slot => {
            // Check if this is a class time
            if (classSchedules[day] && classSchedules[day].includes(slot)) {
                schedule[day][slot] = 'class';
            } else {
                // Random status untuk non-class times
                const rand = Math.random();
                if (rand < 0.6) {
                    schedule[day][slot] = 'available';
                } else if (rand < 0.8) {
                    schedule[day][slot] = 'occupied';
                } else if (rand < 0.9) {
                    schedule[day][slot] = 'maintenance';
                } else {
                    schedule[day][slot] = 'available';
                }
            }
        });
    });
    
    return schedule;
}
// ✅ TAMBAHKAN DATA RUANGAN BARU INI:
const roomsData = [
    {
        id: 1,
        name: "Ruang Seminar A",
        type: "seminar",
        capacity: 100,
        facilities: ["Projector", "AC", "Sound System", "Whiteboard", "WiFi"],
        status: "available",
        schedule: generateDetailedSchedule()
    },
    {
        id: 2,
        name: "Lab. Komputer 1",
        type: "lab",
        capacity: 40,
        facilities: ["40 PC", "Projector", "AC", "Internet", "Software Development"],
        status: "available",
        schedule: generateDetailedSchedule()
    },
    {
        id: 3,
        name: "Ruang Diskusi 301",
        type: "discussion",
        capacity: 8,
        facilities: ["AC", "Whiteboard", "TV", "WiFi"],
        status: "occupied",
        schedule: generateDetailedSchedule()
    },
    {
        id: 4,
        name: "Auditorium FT",
        type: "auditorium",
        capacity: 200,
        facilities: ["Projector", "AC", "Sound System", "Stage", "Recording"],
        status: "available",
        schedule: generateDetailedSchedule()
    },
    {
        id: 5,
        name: "Lab. Jaringan",
        type: "lab",
        capacity: 25,
        facilities: ["25 PC", "Switch", "Router", "AC", "Network Tools"],
        status: "maintenance",
        schedule: generateDetailedSchedule()
    },
    {
        id: 6,
        name: "Studio Multimedia",
        type: "studio",
        capacity: 15,
        facilities: ["Camera", "Lighting", "Green Screen", "Editing PC"],
        status: "available",
        schedule: generateDetailedSchedule()
    }
];
// ✅ TAMBAHKAN FUNCTION generateScheduleTable() YANG BARU:
function generateScheduleTable(room) {
    const days = [
        { id: 'senin', name: 'Senin' },
        { id: 'selasa', name: 'Selasa' },
        { id: 'rabu', name: 'Rabu' },
        { id: 'kamis', name: 'Kamis' },
        { id: 'jumat', name: 'Jumat' },
        { id: 'sabtu', name: 'Sabtu' }
    ];
    
    const timeSlots = [
        "07:00-09:00",
        "09:00-11:00", 
        "11:00-13:00",
        "13:00-15:00"
    ];
    
    // Generate table header
    const thead = document.querySelector('.schedule-table thead tr');
    thead.innerHTML = '<th class="time-header">WAKTU</th>';
    days.forEach(day => {
        thead.innerHTML += `<th>${day.name}</th>`;
    });
    
    // Generate table body
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';
    
    timeSlots.forEach(timeSlot => {
        const row = document.createElement('tr');
        row.innerHTML = `<td class="time-slot">${timeSlot}</td>`;
        
        days.forEach(day => {
            const status = room.schedule[day.id]?.[timeSlot] || 'available';
            const cell = document.createElement('td');
            cell.className = `schedule-cell ${status}`;
            cell.setAttribute('data-day', day.id);
            cell.setAttribute('data-time', timeSlot);
            
            let statusText = '';
            let statusIcon = '';
            let statusClass = '';
            
            switch(status) {
                case 'available':
                    statusText = 'Tersedia';
                    statusIcon = '✅';
                    statusClass = 'available';
                    break;
                case 'occupied':
                    statusText = 'Dipinjam';
                    statusIcon = '❌';
                    statusClass = 'occupied';
                    break;
                case 'maintenance':
                    statusText = 'Maintenance';
                    statusIcon = '🔧';
                    statusClass = 'maintenance';
                    break;
                case 'class':
                    statusText = 'Kelas';
                    statusIcon = '📚';
                    statusClass = 'class';
                    break;
                default:
                    statusText = 'Tersedia';
                    statusIcon = '✅';
                    statusClass = 'available';
            }
            
            cell.innerHTML = `
                <div class="slot-content">
                    <span class="status-indicator ${statusClass}"></span>
                    <span class="status-text">${statusText}</span>
                    <span class="status-icon">${statusIcon}</span>
                </div>
            `;
            
            // Add click event hanya untuk yang available
            if (status === 'available') {
                cell.classList.add('clickable');
                cell.addEventListener('click', () => selectTimeSlot(room, day.id, timeSlot, cell));
            } else {
                cell.style.cursor = 'not-allowed';
                cell.title = getCellTooltip(status);
            }
            
            row.appendChild(cell);
        });
        
        tbody.appendChild(row);
    });
    
    // Tambahkan legend
    addScheduleLegend();
}
// ✅ TAMBAHKAN FUNCTION addScheduleLegend() YANG BARU:
function addScheduleLegend() {
    const modalBody = document.querySelector('.modal-body');
    const existingLegend = document.querySelector('.schedule-legend');
    
    // Hapus legend lama jika ada
    if (existingLegend) {
        existingLegend.remove();
    }
    
    const legend = document.createElement('div');
    legend.className = 'schedule-legend';
    legend.innerHTML = `
        <div class="legend-title">Keterangan:</div>
        <div class="legend-items">
            <div class="legend-item">
                <div class="legend-color legend-available"></div>
                <span>Tersedia</span>
            </div>
            <div class="legend-item">
                <div class="legend-color legend-occupied"></div>
                <span>Sudah Dipinjam</span>
            </div>
            <div class="legend-item">
                <div class="legend-color legend-class"></div>
                <span>Kelas Berlangsung</span>
            </div>
            <div class="legend-item">
                <div class="legend-color legend-maintenance"></div>
                <span>Maintenance</span>
            </div>
            <div class="legend-item">
                <div class="legend-color legend-selected"></div>
                <span>Dipilih</span>
            </div>
        </div>
    `;
    
    // Sisipkan legend sebelum calendar
    const calendar = document.querySelector('.schedule-calendar');
    modalBody.insertBefore(legend, calendar);
}
function showPreviousWeek() {
    showNotification('Menampilkan jadwal minggu sebelumnya', 'info');
}

function showNextWeek() {
    showNotification('Menampilkan jadwal minggu depan', 'info');
}

function filterSchedule(filter) {
    console.log('Filtering schedule by:', filter);
    showNotification(`Menampilkan jadwal: ${filter}`, 'info');
}

function filterGrades(semester) {
    console.log('Filtering grades by semester:', semester);
    showNotification(`Menampilkan nilai semester: ${semester}`, 'info');
}

function markAllNotificationsRead() {
    showNotification('Semua notifikasi ditandai sudah dibaca', 'success');
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--primary-darker);
                border: 1px solid;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 0.5rem;
                max-width: 400px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            }
            .notification-success { border-color: var(--success); }
            .notification-error { border-color: var(--error); }
            .notification-info { border-color: var(--primary-blue); }
            .notification-warning { border-color: var(--warning); }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: #9CA3AF;
                cursor: pointer;
                margin-left: auto;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

function getNotificationIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || '💡';
}

// ===== GLOBAL SEARCH FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', function(e) {
            performGlobalSearch(e.target.value);
        });
    }
});

function performGlobalSearch(query) {
    if (query.length > 2) {
        console.log('🔍 Global search:', query);
        // Implement global search logic here
    }
}

// ===== UTILITY FUNCTIONS =====
function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(time) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ===== DEBUG FUNCTIONS =====
window.debugApp = {
    showCurrentPage: () => console.log('Current page:', currentPage),
    showSelectedBooking: () => console.log('Selected booking:', selectedBooking),
    showRoomsData: () => console.log('Rooms data:', roomsData),
    simulateLogin: () => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userFullName','Radistha Kriska');
        localStorage.setItem('currentUser', 'T14216');
        location.reload();
    },
    resetApp: () => {
        localStorage.clear();
        location.reload();
    }
};

console.log('🚀 GAMASI JavaScript loaded successfully!');
console.log('💡 Debug tips:');
console.log('   - Type debugApp.showCurrentPage() to see current page');
console.log('   - Type debugApp.simulateLogin() to login manually');
console.log('   - Type debugApp.resetApp() to reset application');