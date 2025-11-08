
// ===== MAIN APPLICATION =====
let currentSelectedRoom = null;
let selectedBooking = null;
let currentPage = 'dashboard';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 UGM Campus Hub Initialized');
    
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
    const userFullName = localStorage.getItem('userFullName') || 'Radistha Kriska';
    
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
    const userFullName = localStorage.getItem('userFullName') || 'Radistha Kriska';
    
    // Update all user name elements
    document.querySelectorAll('.user-name, .highlight, #welcomeName').forEach(el => {
        if (el.textContent !== userFullName) {
            el.textContent = userFullName;
        }
    });
    
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
        
        if (confirm('Apakah Anda yakin ingin logout dari UGM Campus Hub?')) {
            console.log('🚪 User logging out...');
            
            // Clear all storage
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userFullName');
            
            // Redirect to login page
            window.location.href = 'Webdev2.html';
        }
    });
}

// ===== PAGE NAVIGATION SYSTEM =====
function setupPageNavigation() {
    console.log('🌐 Setting up page navigation...');
    
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const quickActionBtns = document.querySelectorAll('.quick-action-btn[data-page]');
    const otherButtons = document.querySelectorAll('button[data-page]');
    
    // Setup navigation items
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            console.log('📍 Navigation clicked:', targetPage);
            switchPage(targetPage);
        });
    });
    
    // Setup quick action buttons
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            console.log('⚡ Quick action:', targetPage);
            switchPage(targetPage);
        });
    });
    
    // Setup other buttons with page navigation
    otherButtons.forEach(btn => {
        if (btn.getAttribute('data-page')) {
            btn.addEventListener('click', function() {
                const targetPage = this.getAttribute('data-page');
                console.log('🔘 Button navigation:', targetPage);
                switchPage(targetPage);
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
    
    document.title = `UGM Campus Hub - ${titles[pageName] || 'Dashboard'}`;
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

// Data ruangan
const roomsData = [
    {
        id: 1,
        name: "Ruang Seminar A",
        type: "seminar",
        capacity: 100,
        facilities: ["Projector", "AC", "Sound System", "Whiteboard"],
        status: "available",
        schedule: generateSampleSchedule()
    },
    {
        id: 2,
        name: "Lab. Komputer 1",
        type: "lab",
        capacity: 40,
        facilities: ["40 PC", "Projector", "AC", "Internet"],
        status: "available",
        schedule: generateSampleSchedule()
    },
    {
        id: 3,
        name: "Ruang Diskusi 301",
        type: "discussion",
        capacity: 8,
        facilities: ["AC", "Whiteboard", "TV"],
        status: "occupied",
        schedule: generateSampleSchedule()
    },
    {
        id: 4,
        name: "Auditorium FT",
        type: "auditorium",
        capacity: 200,
        facilities: ["Projector", "AC", "Sound System", "Stage"],
        status: "available",
        schedule: generateSampleSchedule()
    },
    {
        id: 5,
        name: "Lab. Jaringan",
        type: "lab",
        capacity: 25,
        facilities: ["25 PC", "Switch", "Router", "AC"],
        status: "maintenance",
        schedule: generateSampleSchedule()
    },
    {
         id: 6,
        name: "a",
        type: "lab",
        capacity: 25,
        facilities: ["25 PC", "Switch", "Router", "AC"],
        status: "maintenance",
        schedule: generateSampleSchedule()
    },
    {
         id: 7,
        name: "ab",
        type: "lab",
        capacity: 25,
        facilities: ["25 PC", "Switch", "Router", "AC"],
        status: "maintenance",
        schedule: generateSampleSchedule()
    }
];

function generateSampleSchedule() {
    const schedule = {};
    const timeSlots = ["08:00-10:00", "10:00-12:00", "13:00-15:00", "15:00-17:00"];
    const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
    
    days.forEach(day => {
        schedule[day] = {};
        timeSlots.forEach(slot => {
            // Random availability (70% available)
            schedule[day][slot] = Math.random() > 0.3 ? 'available' : 'occupied';
        });
    });
    
    return schedule;
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
    thead.innerHTML = '<th>Waktu</th>';
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
            cell.innerHTML = `
                <div class="slot-content">
                    <span class="status-indicator"></span>
                    <span class="status-text">${getStatusText(status)}</span>
                </div>
            `;
            
            // Add click event for available slots
            if (status === 'available') {
                cell.classList.add('clickable');
                cell.addEventListener('click', () => selectTimeSlot(room, day.id, timeSlot, cell));
            }
            
            row.appendChild(cell);
        });
        
        tbody.appendChild(row);
    });
}

function selectTimeSlot(room, day, timeSlot, cell) {
    console.log('⏰ Selected:', room.name, day, timeSlot);
    
    // Remove previous selection
    document.querySelectorAll('.schedule-cell.selected').forEach(cell => {
        cell.classList.remove('selected');
    });
    
    // Add selection to clicked cell
    cell.classList.add('selected');
    
    // Store selected booking details
    selectedBooking = {
        room: room,
        day: day,
        timeSlot: timeSlot
    };
    
    // Enable book button
    document.getElementById('bookRoom').disabled = false;
    
    // Show confirmation message
    showNotification(`Dipilih: ${room.name} - ${getDayName(day)} ${timeSlot}`, 'success');
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
    if (!selectedBooking) return;
    
    const { room, day, timeSlot } = selectedBooking;
    
    if (confirm(`Pinjam ${room.name} pada ${getDayName(day)} ${timeSlot}?`)) {
        // Simulate booking process
        showNotification(`✅ Berhasil meminjam ${room.name}!\nHari: ${getDayName(day)}\nWaktu: ${timeSlot}`, 'success');
        
        // Close modal
        document.getElementById('scheduleModal').style.display = 'none';
        
        // Update room status in UI
        updateRoomStatus(room.id, 'occupied');
        
        // Reset selection
        selectedBooking = null;
    }
}

function quickBookRoom(room) {
    if (confirm(`Pinjam ${room.name} untuk sekarang?`)) {
        showNotification(`✅ ${room.name} berhasil dipinjam!`, 'success');
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
    
    // Setup search functionality
    const searchInput = document.getElementById('librarySearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchBooks(e.target.value);
        });
    }
    
    // Setup category filters
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterBooksByCategory(category);
        });
    });
    
    // Setup book borrowing
    document.querySelectorAll('.btn-primary.btn-sm').forEach(btn => {
        btn.addEventListener('click', function() {
            const bookTitle = this.closest('.book-card').querySelector('h4').textContent;
            borrowBook(bookTitle);
        });
    });
}

function searchBooks(query) {
    if (query.length > 2) {
        console.log('🔍 Searching books for:', query);
        showNotification(`Menampilkan hasil untuk: ${query}`, 'info');
    }
}

function filterBooksByCategory(category) {
    console.log('📂 Filtering books by category:', category);
    showNotification(`Menampilkan buku kategori: ${getCategoryName(category)}`, 'info');
}

function borrowBook(bookTitle) {
    if (confirm(`Pinjam buku "${bookTitle}"?`)) {
        showNotification(`✅ Buku "${bookTitle}" berhasil dipinjam!`, 'success');
    }
}

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
        'jumat': 'Jumat'
    };
    return days[dayId] || dayId;
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
        localStorage.setItem('userFullName', 'Radistha Kriska');
        localStorage.setItem('currentUser', 'T14216');
        location.reload();
    },
    resetApp: () => {
        localStorage.clear();
        location.reload();
    }
};

console.log('🚀 UGM Campus Hub JavaScript loaded successfully!');
console.log('💡 Debug tips:');
console.log('   - Type debugApp.showCurrentPage() to see current page');
console.log('   - Type debugApp.simulateLogin() to login manually');
console.log('   - Type debugApp.resetApp() to reset application');
