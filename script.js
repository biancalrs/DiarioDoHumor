document.addEventListener('DOMContentLoaded', function() {
    const nameModal = document.getElementById('name-modal');
    const nameInput = document.getElementById('name-input');
    const submitNameBtn = document.getElementById('submit-name');
    const welcomeMessage = document.getElementById('welcome-message');
    const usernameDisplay = document.getElementById('username-display');
    const emojiBtns = document.querySelectorAll('.emoji-btn');
    const reasonInput = document.getElementById('reason');
    const saveBtn = document.getElementById('save-btn');
    const weeklyHistory = document.getElementById('weekly-history');
    const moodSummary = document.getElementById('mood-summary');
    
    let userName = '';
    let selectedEmoji = '';
    let selectedMood = '';
    let moodHistory = [];
    
    nameModal.style.display = 'flex';
    
    submitNameBtn.addEventListener('click', function() {
        if (nameInput.value.trim() === '') {
            alert('Por favor, digite seu nome!');
            return;
        }
        
        userName = nameInput.value.trim();
        nameModal.style.display = 'none';
        welcomeMessage.textContent = `Bem-vindo(a), ${userName}! Como você está se sentindo hoje?`;
        usernameDisplay.textContent = userName;
        
        loadHistory();
        updateHistoryDisplay();
    });
    
    emojiBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            emojiBtns.forEach(b => b.classList.remove('selected'));
            
            this.classList.add('selected');
            
            selectedEmoji = this.getAttribute('data-emoji');
            selectedMood = this.getAttribute('data-value');
        });
    });
    
    saveBtn.addEventListener('click', function() {
        if (!selectedEmoji) {
            alert('Por favor, selecione como você está se sentindo!');
            return;
        }
        
        if (reasonInput.value.trim() === '') {
            alert('Por favor, digite o motivo do seu humor!');
            return;
        }
        
        const newEntry = {
            date: new Date(),
            emoji: selectedEmoji,
            mood: selectedMood,
            reason: reasonInput.value.trim()
        };
        
        moodHistory.push(newEntry);
        
        emojiBtns.forEach(b => b.classList.remove('selected'));
        reasonInput.value = '';
        selectedEmoji = '';
        selectedMood = '';
        
        updateHistoryDisplay();
        saveHistory();
        
        saveBtn.textContent = 'Salvo com sucesso!';
        setTimeout(() => {
            saveBtn.textContent = 'Salvar humor do dia';
        }, 2000);
    });
    
    function loadHistory() {
        const savedHistory = localStorage.getItem(`moodHistory_${userName}`);
        if (savedHistory) {
            try {
                moodHistory = JSON.parse(savedHistory);
                moodHistory.forEach(entry => {
                    entry.date = new Date(entry.date);
                });
            } catch (e) {
                console.error('Erro ao carregar histórico:', e);
                moodHistory = [];
            }
        }
    }
    
    function saveHistory() {
        localStorage.setItem(`moodHistory_${userName}`, JSON.stringify(moodHistory));
    }
    
    function updateHistoryDisplay() {
        weeklyHistory.innerHTML = '';
        moodSummary.innerHTML = '';
        
        if (moodHistory.length === 0) {
            weeklyHistory.innerHTML = '<p>Nenhum registro ainda. Adicione seu primeiro humor!</p>';
            return;
        }
        
        const sortedHistory = [...moodHistory].sort((a, b) => b.date - a.date);
        
        const weeklyEntries = sortedHistory.slice(0, 7);
        
        weeklyEntries.forEach(entry => {
            const dayEntry = document.createElement('div');
            dayEntry.className = 'day-entry';
            
            const dayEmoji = document.createElement('div');
            dayEmoji.className = 'day-emoji';
            dayEmoji.textContent = entry.emoji;
            
            const dayInfo = document.createElement('div');
            dayInfo.className = 'day-info';
            
            const dayDate = document.createElement('div');
            dayDate.className = 'day-date';
            dayDate.textContent = formatDate(entry.date);
            
            const dayReason = document.createElement('div');
            dayReason.className = 'day-reason';
            dayReason.textContent = entry.reason;
            
            dayInfo.appendChild(dayDate);
            dayInfo.appendChild(dayReason);
            dayEntry.appendChild(dayEmoji);
            dayEntry.appendChild(dayInfo);
            
            weeklyHistory.appendChild(dayEntry);
        });
        
        const moodCounts = {};
        moodHistory.forEach(entry => {
            if (!moodCounts[entry.mood]) {
                moodCounts[entry.mood] = {
                    count: 0,
                    emoji: entry.emoji
                };
            }
            moodCounts[entry.mood].count++;
        });
        
        for (const mood in moodCounts) {
            const moodItem = document.createElement('div');
            moodItem.className = 'mood-item';
            
            const moodEmoji = document.createElement('div');
            moodEmoji.className = 'mood-emoji';
            moodEmoji.textContent = moodCounts[mood].emoji;
            
            const moodText = document.createElement('div');
            moodText.textContent = `${moodCounts[mood].count}x`;
            
            moodItem.appendChild(moodEmoji);
            moodItem.appendChild(moodText);
            moodSummary.appendChild(moodItem);
        }
    }
    
    function formatDate(date) {
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        return date.toLocaleDateString('pt-BR', options) + ' - ' + 
               date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitNameBtn.click();
        }
    });
});
