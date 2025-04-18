function loginUser() {
    const npk = document.getElementById('npk').value.trim();
    const nama = document.getElementById('nama').value.trim();
    const bagian = document.getElementById('bagian').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    // Validate inputs
    if (!npk || !nama || !bagian) {
        errorMessage.textContent = 'Semua field harus diisi!';
        errorMessage.classList.remove('hidden');
        return;
    }

    // Create user object
    const user = {
        npk,
        nama,
        bagian,
        progress: {
            basic: 0,
            braking: 0,
            hazard: 0,
            microsleep: 0
        },
        quizScores: {
            basic: 0,
            braking: 0,
            hazard: 0,
            microsleep: 0
        }
    };

    try {
        // Store user data
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update department analytics
        updateDepartmentAnalytics(bagian);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        errorMessage.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
        errorMessage.classList.remove('hidden');
        console.error('Error storing user data:', error);
    }
}

function updateDepartmentAnalytics(bagian) {
    try {
        let analytics = JSON.parse(localStorage.getItem('analytics')) || {
            departmentAccess: {},
            departmentScores: {}
        };

        // Update department access count
        if (!analytics.departmentAccess[bagian]) {
            analytics.departmentAccess[bagian] = 0;
        }
        analytics.departmentAccess[bagian]++;

        // Initialize department scores if not exists
        if (!analytics.departmentScores[bagian]) {
            analytics.departmentScores[bagian] = {
                totalScore: 0,
                userCount: 0
            };
        }

        localStorage.setItem('analytics', JSON.stringify(analytics));
    } catch (error) {
        console.error('Error updating analytics:', error);
    }
}

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const isLoginPage = window.location.pathname.includes('index.html') || 
                       window.location.pathname === '/';

    if (!currentUser && !isLoginPage) {
        window.location.href = 'index.html';
    } else if (currentUser && isLoginPage) {
        window.location.href = 'dashboard.html';
    }
}

// Logout function
function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Run auth check on page load
window.addEventListener('load', checkAuth);
