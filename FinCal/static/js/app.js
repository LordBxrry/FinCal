const storageKey = 'financialCalendarState';
const authTokenKey = 'vercelAuthToken';
const defaultDate = new Date();
let currentDate = new Date(defaultDate.getFullYear(), defaultDate.getMonth(), 1);
let authToken = localStorage.getItem(authTokenKey) || null;

const balanceEl = document.getElementById('balance');
const inflowLabel = document.getElementById('inflowLabel');
const outflowLabel = document.getElementById('outflowLabel');
const managementScoreEl = document.getElementById('managementScore');
const scoreBarFill = document.getElementById('scoreBarFill');
const currentMonthEl = document.getElementById('currentMonth');
const calendarGrid = document.getElementById('calendarGrid');
const transactionList = document.getElementById('transactionList');
const transactionForm = document.getElementById('transactionForm');
const exportCsvBtn = document.getElementById('exportCsv');
const membershipStatusEl = document.getElementById('membershipStatus');
const membershipInfoEl = document.getElementById('membershipInfo');
const membershipButton = document.getElementById('membershipButton');
const paymentForm = document.getElementById('paymentForm');
const cardNumberInput = document.getElementById('cardNumber');
const cardExpiryInput = document.getElementById('cardExpiry');
const cardCvcInput = document.getElementById('cardCvc');
const friendPool = document.getElementById('friendPool');
const friendForm = document.getElementById('friendForm');
const showFriendFormBtn = document.getElementById('showFriendForm');
const friendNameInput = document.getElementById('friendName');
const friendEmailInput = document.getElementById('friendEmail');
const friendContributionInput = document.getElementById('friendContribution');
const eventList = document.getElementById('eventList');
const eventForm = document.getElementById('eventForm');
const showEventFormBtn = document.getElementById('showEventForm');
const eventTitleInput = document.getElementById('eventTitle');
const eventDateInput = document.getElementById('eventDate');
const eventBudgetInput = document.getElementById('eventBudget');
const eventNotesInput = document.getElementById('eventNotes');
const userStatusEl = document.getElementById('userStatus');
const authForm = document.getElementById('authForm');
const authButton = document.getElementById('authButton');
const authNameInput = document.getElementById('authName');
const authEmailInput = document.getElementById('authEmail');
const authPasswordInput = document.getElementById('authPassword');
const authHeading = document.getElementById('authHeading');
const authError = document.getElementById('authError');
const authSubmitBtn = document.getElementById('authSubmit');
const authNameGroup = document.getElementById('authNameGroup');
const showSignInBtn = document.getElementById('showSignIn');
const showSignUpBtn = document.getElementById('showSignUp');
let authMode = 'sign-in';
let editingTransactionId = null;
const encouragementMessageEl = document.getElementById('encouragementMessage');
const goalList = document.getElementById('goalList');
const transactionModeInput = document.getElementById('transactionMode');
const recurrenceFields = document.getElementById('recurrenceFields');
const transactionFrequency = document.getElementById('transactionFrequency');
const transactionEndDate = document.getElementById('transactionEndDate');
const transactionIndefinite = document.getElementById('transactionIndefinite');
const transactionFormHeading = document.getElementById('transactionFormHeading');
const transactionSubmitBtn = document.getElementById('transactionSubmit');
const cancelTransactionEdit = document.getElementById('cancelTransactionEdit');
const goalForm = document.getElementById('goalForm');
const showGoalFormBtn = document.getElementById('showGoalForm');
const goalTitleInput = document.getElementById('goalTitle');
const goalTargetInput = document.getElementById('goalTarget');
const goalDeadlineInput = document.getElementById('goalDeadline');
const goalFormHeading = document.getElementById('goalFormHeading');
const goalSubmitBtn = document.getElementById('goalSubmit');
const cancelGoalEdit = document.getElementById('cancelGoalEdit');
const wishlistContainer = document.getElementById('wishlist');
const wishlistForm = document.getElementById('wishlistForm');
const showWishlistFormBtn = document.getElementById('showWishlistForm');
const wishTitleInput = document.getElementById('wishTitle');
const wishCostInput = document.getElementById('wishCost');
const wishTargetDateInput = document.getElementById('wishTargetDate');
const wishNotesInput = document.getElementById('wishNotes');
const wishlistFormHeading = document.getElementById('wishlistFormHeading');
const wishlistSubmitBtn = document.getElementById('wishlistSubmit');
const cancelWishlistEdit = document.getElementById('cancelWishlistEdit');
const incomeBreakdownList = document.getElementById('incomeBreakdownList');
const incomeBreakdownForm = document.getElementById('incomeBreakdownForm');
const showIncomeBreakdownFormBtn = document.getElementById('showIncomeBreakdownForm');
const incomeNameInput = document.getElementById('incomeName');
const incomeTypeInput = document.getElementById('incomeType');
const incomeValueInput = document.getElementById('incomeValue');
const incomeValueLabel = document.getElementById('incomeValueLabel');
const incomeFormHeading = document.getElementById('incomeFormHeading');
const incomeBreakdownSubmitBtn = document.getElementById('incomeBreakdownSubmit');
const cancelIncomeEdit = document.getElementById('cancelIncomeEdit');
const allocationBreakdownDisplay = document.getElementById('allocationBreakdown');
const allocationForm = document.getElementById('allocationForm');
const showAllocationFormBtn = document.getElementById('showAllocationForm');
const allocationTypeInput = document.getElementById('allocationType');
const needsAmountInput = document.getElementById('needsAmount');
const wantsAmountInput = document.getElementById('wantsAmount');
const savingsAmountInput = document.getElementById('savingsAmount');
const needsLabel = document.getElementById('needsLabel');
const wantsLabel = document.getElementById('wantsLabel');
const savingsLabel = document.getElementById('savingsLabel');
const allocationSubmitBtn = document.getElementById('allocationSubmit');
const cancelAllocationEdit = document.getElementById('cancelAllocationEdit');

const billsList = document.getElementById('billsList');
const billsTotal = document.getElementById('billsTotal');
const billForm = document.getElementById('billForm');
const showBillForm = document.getElementById('showBillForm');
const billName = document.getElementById('billName');
const billAmount = document.getElementById('billAmount');
const billFrequency = document.getElementById('billFrequency');
const billDueDate = document.getElementById('billDueDate');
const billCategory = document.getElementById('billCategory');
const billSubmit = document.getElementById('billSubmit');
const cancelBillEdit = document.getElementById('cancelBillEdit');

let editingGoalId = null;
let editingWishlistId = null;
let editingIncomeId = null;
let editingBillId = null;

// Stripe integration
let stripe;
let cardElement;

function initializeStripeElements() {
    if (!stripe) {
        stripe = Stripe(pk_live_51N7gI6BI32akVK0QObtfnx637yOR7xFNxL9Z4vjpS0bnIclYUZQ1nAmHuHfUrgvsaQV3vVmOEdeZnzfhzP2PmKZl00GX5Xenvx); // Replace with your actual publishable key
        const elements = stripe.elements();
        cardElement = elements.create('card');
        cardElement.mount('#card-element');
    }
}

function defaultState() {
    return {
        transactions: [],
        membership: { active: false, since: null, plan: 'Monthly' },
        friends: [],
        events: [],
        wishlist: [],
        goals: [],
        incomeBreakdown: [],
        allocation: { type: 'percentage', needs: 50, wants: 30, savings: 20 },
        bills: [],
        users: [],
        user: { signedIn: false, email: '', name: '' },
    };
}

function normalizeState(state) {
    if (!state) return defaultState();
    return {
        transactions: Array.isArray(state.transactions) ? state.transactions.map(t => ({
            ...t,
            id: t.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        })) : [],
        membership: state.membership || { active: false, since: null, plan: 'Monthly' },
        friends: Array.isArray(state.friends) ? state.friends : [],
        events: Array.isArray(state.events) ? state.events : [],
        wishlist: Array.isArray(state.wishlist) ? state.wishlist.map(item => ({
            ...item,
            id: item.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        })) : [],
        goals: Array.isArray(state.goals) ? state.goals.map(goal => ({
            ...goal,
            id: goal.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        })) : [],
        incomeBreakdown: Array.isArray(state.incomeBreakdown) ? state.incomeBreakdown.map(source => ({
            ...source,
            id: source.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        })) : [],
        allocation: state.allocation ? {
            type: state.allocation.type || 'percentage',
            needs: Number(state.allocation.needs) || 50,
            wants: Number(state.allocation.wants) || 30,
            savings: Number(state.allocation.savings) || 20,
        } : { type: 'percentage', needs: 50, wants: 30, savings: 20 },
        bills: Array.isArray(state.bills) ? state.bills.map(bill => ({
            ...bill,
            id: bill.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        })) : [],
        users: Array.isArray(state.users) ? state.users.map(user => ({
            ...user,
            id: user.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        })) : [],
        user: state.user ? {
            signedIn: Boolean(state.user.signedIn),
            email: state.user.email || '',
            name: state.user.name || '',
        } : { signedIn: false, email: '', name: '' },
    };
}

function loadState() {
    try {
        const stored = localStorage.getItem(storageKey);
        return normalizeState(stored ? JSON.parse(stored) : null);
    } catch (error) {
        console.error('Failed to load state', error);
        return defaultState();
    }
}

function saveState(state) {
    localStorage.setItem(storageKey, JSON.stringify(normalizeState(state)));
    // Auto-sync to Vercel if logged in
    if (authToken) {
        syncStateToVercel(state);
    }
}

// Sync user data to Vercel
async function syncStateToVercel(state) {
    try {
        const response = await fetch('/api/user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                data: state
            })
        });
        if (!response.ok) {
            console.warn('Failed to sync to Vercel:', response.statusText);
        }
    } catch (error) {
        console.warn('Error syncing to Vercel:', error);
    }
}

// Load user data from Vercel
async function loadStateFromVercel() {
    if (!authToken) return null;
    try {
        const response = await fetch('/api/user-data', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (response.ok) {
            const result = await response.json();
            return result.user.data || null;
        }
    } catch (error) {
        console.warn('Error loading from Vercel:', error);
    }
    return null;
}

function saveTransactions(transactions) {
    const state = loadState();
    state.transactions = transactions;
    saveState(state);
}

function addFriend(friend) {
    const state = loadState();
    state.friends.push(friend);
    saveState(state);
}

function addEvent(event) {
    const state = loadState();
    state.events.push(event);
    saveState(state);
}

function addWishlistItem(item) {
    const state = loadState();
    state.wishlist.push(item);
    saveState(state);
}

function addGoal(goal) {
    const state = loadState();
    state.goals.push(goal);
    saveState(state);
}

function addUser(user) {
    const state = loadState();
    state.users.push(user);
    saveState(state);
}

function getUserByEmail(email) {
    const state = loadState();
    return state.users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

function deleteWishlistItem(id) {
    const state = loadState();
    state.wishlist = state.wishlist.filter(item => item.id !== id);
    saveState(state);
    render();
}

function deleteGoal(id) {
    const state = loadState();
    state.goals = state.goals.filter(goal => goal.id !== id);
    saveState(state);
    render();
}

function addIncomeSource(source) {
    const state = loadState();
    state.incomeBreakdown.push(source);
    saveState(state);
}

function deleteIncomeSource(id) {
    const state = loadState();
    state.incomeBreakdown = state.incomeBreakdown.filter(source => source.id !== id);
    saveState(state);
    render();
}

function addBill(bill) {
    const state = loadState();
    const newBill = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: bill.name,
        amount: Number(bill.amount),
        frequency: bill.frequency,
        dueDate: Number(bill.dueDate),
        category: bill.category,
        createdAt: new Date().toISOString(),
    };
    state.bills.push(newBill);
    saveState(state);
}

function deleteBill(id) {
    const state = loadState();
    state.bills = state.bills.filter(bill => bill.id !== id);
    saveState(state);
    if (editingBillId === id) {
        clearBillEdit();
    }
    render();
}

function beginBillEdit(id) {
    const state = loadState();
    const bill = state.bills.find(b => b.id === id);
    if (bill) {
        editingBillId = id;
        billName.value = bill.name;
        billAmount.value = bill.amount;
        billFrequency.value = bill.frequency;
        billDueDate.value = bill.dueDate;
        billCategory.value = bill.category;
        billForm.classList.remove('hidden');
        billSubmit.textContent = 'Update Bill';
    }
}

function clearBillEdit() {
    editingBillId = null;
    billForm.classList.add('hidden');
    billForm.reset();
    billSubmit.textContent = 'Save Bill';
}

function updateMembership(membership) {
    const state = loadState();
    state.membership = membership;
    saveState(state);
}

function updateUser(user) {
    const state = loadState();
    state.user = user;
    saveState(state);
}

function setAuthMode(mode) {
    authMode = mode;
    authHeading.textContent = mode === 'sign-up' ? 'Create your account' : 'Welcome back';
    authSubmitBtn.textContent = mode === 'sign-up' ? 'Sign up' : 'Sign in';
    authNameGroup.classList.toggle('hidden', mode !== 'sign-up');
    showSignInBtn.classList.toggle('active', mode === 'sign-in');
    showSignUpBtn.classList.toggle('active', mode === 'sign-up');
    authError.textContent = '';
}

function deleteFriend(id) {
    const state = loadState();
    state.friends = state.friends.filter(friend => friend.id !== id);
    saveState(state);
    render();
}

function deleteEvent(id) {
    const state = loadState();
    state.events = state.events.filter(event => event.id !== id);
    saveState(state);
    render();
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(value) || 0);
}

function getMonthLabel(date) {
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function normalizeRecurrenceDate(date) {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    return next;
}

function addFrequency(date, frequency) {
    const next = new Date(date);
    if (frequency === 'weekly') {
        next.setDate(next.getDate() + 7);
        return next;
    }
    if (frequency === 'yearly') {
        next.setFullYear(next.getFullYear() + 1);
        return next;
    }
    // monthly
    const day = next.getDate();
    next.setMonth(next.getMonth() + 1);
    const daysInMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    next.setDate(Math.min(day, daysInMonth));
    return next;
}

function getRecurringOccurrences(transaction, monthDate) {
    if (!transaction.recurring) {
        return [];
    }
    const occurrences = [];
    const start = normalizeRecurrenceDate(transaction.date);
    const currentMonthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const currentMonthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);
    const indefinite = Boolean(transaction.indefinite);
    const endDate = transaction.endDate && !indefinite ? normalizeRecurrenceDate(transaction.endDate) : null;
    let occurrence = new Date(start);

    if (occurrence > currentMonthEnd) {
        return occurrences;
    }

    while (occurrence < currentMonthStart) {
        occurrence = addFrequency(occurrence, transaction.frequency || 'monthly');
        if (endDate && occurrence > endDate) {
            return occurrences;
        }
    }

    while (occurrence <= currentMonthEnd) {
        if (occurrence >= currentMonthStart && (!endDate || occurrence <= endDate)) {
            occurrences.push({
                ...transaction,
                originalId: transaction.id,
                date: occurrence.toISOString().slice(0, 10),
                recurring: true,
            });
        }
        occurrence = addFrequency(occurrence, transaction.frequency || 'monthly');
        if (endDate && occurrence > endDate) {
            break;
        }
    }
    return occurrences;
}

function getVisibleTransactions(transactions, monthDate) {
    const visible = [];
    transactions.forEach(transaction => {
        if (transaction.recurring) {
            visible.push(...getRecurringOccurrences(transaction, monthDate));
        } else {
            const date = new Date(transaction.date);
            if (date.getFullYear() === monthDate.getFullYear() && date.getMonth() === monthDate.getMonth()) {
                visible.push(transaction);
            }
        }
    });
    return visible;
}

function getTransactionsByDate(transactions) {
    return transactions.reduce((acc, transaction) => {
        const key = transaction.date;
        if (!acc[key]) acc[key] = [];
        acc[key].push(transaction);
        return acc;
    }, {});
}

function purchaseMembership(plan = 'Monthly') {
    const state = loadState();
    if (!state.user.signedIn) {
        authForm.classList.remove('hidden');
        return;
    }

    const membership = {
        active: true,
        since: new Date().toISOString(),
        plan: plan,
    };
    updateMembership(membership);
    paymentForm.classList.add('hidden');
    render();
}

function getMembershipCopy(membership, user) {
    if (!user.signedIn) {
        return 'Sign in to unlock premium, invite friends, and create shared event budgets.';
    }
    if (membership.active) {
        return `${membership.plan} premium active since ${new Date(membership.since).toLocaleDateString()}. Invite friends, pool money, and plan events together.`;
    }
    return 'Free tier active. Purchase premium to connect with friends, share pools, and create events.';
}

function getUserStatusCopy(user) {
    return user.signedIn
        ? `Signed in as ${user.email}.`:
        'Not signed in. Sign in to access premium features.';
}

function renderAuth(state) {
    userStatusEl.textContent = getUserStatusCopy(state.user);
    authButton.textContent = state.user.signedIn ? 'Sign out' : 'Sign in / Sign up';
    if (state.user.signedIn) {
        authForm.classList.add('hidden');
    } else {
        authForm.classList.add('hidden');
        paymentForm.classList.add('hidden');
        friendForm.classList.add('hidden');
        eventForm.classList.add('hidden');
        setAuthMode('sign-in');
    }
}

function calculateManagementScore(transactions) {
    if (transactions.length === 0) return 0;
    
    const inflow = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const outflow = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = inflow - outflow;
    
    if (inflow === 0) return 0;
    
    const expenseRatio = outflow / inflow;
    const balanceRatio = balance / inflow;
    
    const expenseScore = Math.min(50, Math.max(0, (1 - expenseRatio) * 100));
    const savingsScore = Math.min(50, Math.max(0, balanceRatio * 100));
    
    return Math.round(expenseScore + savingsScore);
}

function renderSummary(transactions) {
    const inflow = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const outflow = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = inflow - outflow;
    const score = calculateManagementScore(transactions);

    balanceEl.textContent = formatCurrency(balance);
    balanceEl.className = 'balance-value ' + (balance >= 0 ? 'positive' : 'negative');
    
    inflowLabel.textContent = `Income: ${formatCurrency(inflow)}`;
    outflowLabel.textContent = `Expenses: ${formatCurrency(outflow)}`;
    
    managementScoreEl.textContent = `${score}/100`;
    scoreBarFill.style.width = `${score}%`;
    scoreBarFill.className = 'score-bar-fill ' + (score >= 70 ? 'excellent' : score >= 50 ? 'good' : score >= 30 ? 'fair' : 'poor');
}

function renderCalendar(transactions, goals, wishlist, events) {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const dayOfWeek = firstDay.getDay();
    const grouped = getTransactionsByDate(transactions);

    calendarGrid.innerHTML = '';
    for (let i = 0; i < dayOfWeek; i += 1) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-cell empty';
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateKey = date.toISOString().slice(0, 10);
        const transactionsForDay = grouped[dateKey] || [];
        const dailyInflow = transactionsForDay.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
        const dailyOutflow = transactionsForDay.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
        const net = dailyInflow - dailyOutflow;

        // Check for goals on this date
        const goalsForDay = goals.filter(g => g.deadline === dateKey);
        // Check for wishlist items on this date
        const wishlistForDay = wishlist.filter(w => w.targetDate === dateKey);
        // Check for events on this date
        const eventsForDay = events.filter(e => e.date === dateKey);

        const cell = document.createElement('div');
        const netClass = net > 0 ? 'net-positive' : net < 0 ? 'net-negative' : 'net-zero';
        cell.className = `calendar-cell ${netClass}`;
        
        let indicatorsHtml = '';
        if (goalsForDay.length > 0) {
            const goalDetails = goalsForDay.map(g => `${g.title} - ${formatCurrency(g.target)}`).join('\\n');
            indicatorsHtml += `<div class="calendar-indicator goal-indicator" data-tooltip="${goalDetails}">🎯 ${goalsForDay.length}</div>`;
        }
        if (wishlistForDay.length > 0) {
            const wishDetails = wishlistForDay.map(w => `${w.title} - ${formatCurrency(w.cost)}`).join('\\n');
            indicatorsHtml += `<div class="calendar-indicator wish-indicator" data-tooltip="${wishDetails}">💝 ${wishlistForDay.length}</div>`;
        }
        if (eventsForDay.length > 0) {
            const eventDetails = eventsForDay.map(e => `${e.title} - ${formatCurrency(e.budget)}`).join('\\n');
            indicatorsHtml += `<div class="calendar-indicator event-indicator" data-tooltip="${eventDetails}">📅 ${eventsForDay.length}</div>`;
        }

        cell.innerHTML = `
            <div class="date-label">
                <span>${day}</span>
                <span>${transactionsForDay.length}</span>
            </div>
            <div class="calendar-indicators">${indicatorsHtml}</div>
            <div class="daily-summary">
                <div class="net-value">${formatCurrency(net)}</div>
                <div class="net-label">${net > 0 ? 'Gain' : net < 0 ? 'Loss' : 'Even'}</div>
            </div>
        `;
        
        // Add hover listeners to indicators
        const indicators = cell.querySelectorAll('.calendar-indicator');
        indicators.forEach(indicator => {
            indicator.addEventListener('mouseenter', (e) => showIndicatorTooltip(e.target));
            indicator.addEventListener('mouseleave', hideIndicatorTooltip);
        });
        
        // Add click handler to view/edit transactions for the day
        cell.addEventListener('click', () => showDayTransactions(dateKey, transactionsForDay));
        
        calendarGrid.appendChild(cell);
    }
}

function showIndicatorTooltip(element) {
    const tooltipText = element.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    // Remove existing tooltip
    const existing = document.querySelector('.calendar-tooltip');
    if (existing) existing.remove();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'calendar-tooltip';
    tooltip.innerHTML = tooltipText.split('\\n').map(line => `<div>${line}</div>`).join('');
    
    document.body.appendChild(tooltip);
    
    // Position tooltip near the indicator
    const rect = element.getBoundingClientRect();
    tooltip.style.top = (rect.bottom + 8) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
}

function hideIndicatorTooltip() {
    const tooltip = document.querySelector('.calendar-tooltip');
    if (tooltip) tooltip.remove();
}

function showDayTransactions(dateKey, transactionsForDay) {
    // Create or show a modal for the day's transactions
    let modal = document.getElementById('dayModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dayModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modalDate"></h3>
                    <button id="closeModal">&times;</button>
                </div>
                <div id="dayTransactionsList"></div>
                <div class="modal-actions">
                    <button id="addTransactionToDay">Add Transaction</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('closeModal').addEventListener('click', () => modal.style.display = 'none');
        document.getElementById('addTransactionToDay').addEventListener('click', () => {
            const dateInput = document.getElementById('transactionDate');
            dateInput.value = dateKey;
            modal.style.display = 'none';
            // Scroll to transaction form
            document.getElementById('transactionForm').scrollIntoView({ behavior: 'smooth' });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    document.getElementById('modalDate').textContent = new Date(dateKey).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const list = document.getElementById('dayTransactionsList');
    list.innerHTML = '';
    
    if (transactionsForDay.length === 0) {
        list.innerHTML = '<p>No transactions for this day.</p>';
    } else {
        transactionsForDay.forEach(transaction => {
            const item = document.createElement('div');
            item.className = 'day-transaction-item';
            item.innerHTML = `
                <div class="transaction-details">
                    <strong>${transaction.description}</strong>
                    <div>${transaction.type} - ${formatCurrency(transaction.amount)}</div>
                    ${transaction.recurring ? `<div>Recurring ${transaction.frequency || 'monthly'}</div>` : ''}
                </div>
                <div class="transaction-actions">
                    <button onclick="editTransaction('${transaction.id}')">Edit</button>
                    <button onclick="deleteTransaction('${transaction.id}')">Delete</button>
                </div>
            `;
            list.appendChild(item);
        });
    }
    
    modal.style.display = 'block';
}

function renderTransactions(transactions) {
    transactionList.innerHTML = '';
    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sorted.length === 0) {
        transactionList.innerHTML = '<p>No transactions yet. Add one to start tracking money flow.</p>';
        return;
    }

    sorted.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        const recurrenceLabel = transaction.recurring
            ? `<div>Recurring ${transaction.frequency || 'monthly'}${transaction.indefinite ? ' · indefinite' : transaction.endDate ? ` · until ${transaction.endDate}` : ''}</div>`
            : '';
        item.innerHTML = `
            <div class="details">
                <strong>${transaction.description}</strong>
                <div>${transaction.date} · ${transaction.type}</div>
                ${recurrenceLabel}
            </div>
            <div class="action-group">
                <div>${formatCurrency(transaction.amount)}</div>
                <button data-action="edit" data-id="${transaction.id}">Edit</button>
                <button data-action="delete" data-id="${transaction.id}">Delete</button>
            </div>
        `;
        item.querySelector('button[data-action="delete"]').addEventListener('click', () => {
            deleteTransaction(transaction.id);
        });
        item.querySelector('button[data-action="edit"]').addEventListener('click', () => {
            beginTransactionEdit(transaction.id);
        });
        transactionList.appendChild(item);
    });
}

function renderMembership(state) {
    membershipStatusEl.textContent = state.membership.active
        ? `${state.membership.plan} active since ${new Date(state.membership.since).toLocaleDateString()}`
        : state.user.signedIn ? 'Free tier — upgrade to premium to connect friends.' : 'Not signed in';
    membershipInfoEl.textContent = getMembershipCopy(state.membership, state.user);
    membershipButton.textContent = state.membership.active
        ? `${state.membership.plan} Active`
        : state.user.signedIn
            ? 'Buy Premium'
            : 'Sign in to buy Premium';
    membershipButton.disabled = state.membership.active;
}

function renderFriendPool(state) {
    friendPool.innerHTML = '';
    if (!state.membership.active) {
        const message = document.createElement('div');
        message.className = 'card-note';
        message.innerHTML = 'Premium required. Unlock membership to invite friends and create pooled goals.';
        const upgrade = document.createElement('button');
        upgrade.className = 'upgrade-cta';
        upgrade.textContent = 'Upgrade to Premium';
        upgrade.addEventListener('click', () => purchaseMembership());
        friendPool.appendChild(message);
        friendPool.appendChild(upgrade);
        return;
    }

    const total = state.friends.reduce((sum, friend) => sum + Number(friend.contribution || 0), 0);
    const summary = document.createElement('div');
    summary.className = 'card-note';
    summary.textContent = `Total pooled amount: ${formatCurrency(total)}`;
    friendPool.appendChild(summary);

    if (state.friends.length === 0) {
        friendPool.innerHTML += '<p class="card-note">No friends invited yet. Add one to start pooling funds.</p>';
        return;
    }

    state.friends.forEach(friend => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.innerHTML = `
            <div class="details">
                <strong>${friend.name}</strong>
                <div>${friend.email}</div>
            </div>
            <div>
                <div>${formatCurrency(friend.contribution)}</div>
                <button data-id="${friend.id}">Remove</button>
            </div>
        `;
        item.querySelector('button').addEventListener('click', () => deleteFriend(friend.id));
        friendPool.appendChild(item);
    });
}

function renderEvents(state) {
    eventList.innerHTML = '';
    if (!state.membership.active) {
        const message = document.createElement('div');
        message.className = 'card-note';
        message.innerHTML = 'Premium required. Unlock membership to create shared events and budgets.';
        const upgrade = document.createElement('button');
        upgrade.className = 'upgrade-cta';
        upgrade.textContent = 'Upgrade to Premium';
        upgrade.addEventListener('click', () => purchaseMembership());
        eventList.appendChild(message);
        eventList.appendChild(upgrade);
        return;
    }

    if (state.events.length === 0) {
        eventList.innerHTML = '<p class="card-note">No group events yet. Create one to plan shared spending with friends.</p>';
        return;
    }

    state.events.forEach(evt => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.innerHTML = `
            <div class="details">
                <strong>${evt.title}</strong>
                <div>${evt.date} · ${formatCurrency(evt.budget)}</div>
                <div>${evt.notes || 'No notes'}</div>
            </div>
            <div>
                <button data-id="${evt.id}">Delete</button>
            </div>
        `;
        item.querySelector('button').addEventListener('click', () => deleteEvent(evt.id));
        eventList.appendChild(item);
    });
}

function getGoalProgressMessage(state) {
    const activeGoals = state.goals.length;
    const totalSavings = loadState().transactions.reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount) : 0), 0);
    const totalOut = loadState().transactions.reduce((sum, t) => sum + (t.type === 'expense' ? Number(t.amount) : 0), 0);
    const netBalance = totalSavings - totalOut;

    if (activeGoals === 0) {
        return netBalance >= 0
            ? 'You have a positive net balance. Add a budget goal to focus your progress.'
            : 'Track your spending and add a budget goal to start improving your cash flow.';
    }

    const completed = state.goals.filter(goal => netBalance >= Number(goal.target)).length;
    if (completed > 0) {
        return `Nice work! You have ${completed} goal${completed === 1 ? '' : 's'} within reach or already covered.`;
    }

    return `Keep going — you are making progress toward ${activeGoals} active goal${activeGoals === 1 ? '' : 's'}.`;
}

function renderEncouragement(state) {
    encouragementMessageEl.textContent = getGoalProgressMessage(state);
}

function renderGoals(state) {
    goalList.innerHTML = '';
    if (state.goals.length === 0) {
        goalList.innerHTML = '<p class="card-note">No goals added yet. Create a budget goal to save toward something meaningful.</p>';
        return;
    }

    state.goals.forEach(goal => {
        const netBalance = state.transactions.reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount) : 0) - (t.type === 'expense' ? Number(t.amount) : 0), 0);
        const progress = Math.min(100, Math.round((netBalance / Number(goal.target)) * 100));
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.innerHTML = `
            <div class="details">
                <strong>${goal.title}</strong>
                <div>Target: ${formatCurrency(goal.target)}${goal.deadline ? ` · Due ${goal.deadline}` : ''}</div>
                <div>Progress: ${progress}%</div>
            </div>
            <div class="action-group">
                <button data-action="edit" data-id="${goal.id}">Edit</button>
                <button data-action="delete" data-id="${goal.id}">Delete</button>
            </div>
        `;
        item.querySelector('button[data-action="delete"]').addEventListener('click', () => deleteGoal(goal.id));
        item.querySelector('button[data-action="edit"]').addEventListener('click', () => beginGoalEdit(goal.id));
        goalList.appendChild(item);
    });
}

function generateWishlistSuggestions(state) {
    // Calculate current balance
    const currentBalance = state.transactions.reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0);
    
    // Calculate monthly averages
    const monthCount = state.transactions.length > 0 ? 1 : 0; // Simplified: use current month
    const totalInflow = state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const totalOutflow = state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    const monthlyNet = monthCount > 0 ? (totalInflow - totalOutflow) / Math.max(1, monthCount) : 0;
    
    return state.wishlist.map(item => {
        const itemCost = Number(item.cost) || 0;
        
        if (itemCost === 0) {
            return {
                ...item,
                suggestion: 'Set a cost to get purchase timing suggestions',
                timeline: null,
                affordable: false,
            };
        }
        
        if (currentBalance >= itemCost) {
            return {
                ...item,
                suggestion: '💰 You can afford this now!',
                timeline: 'Purchase immediately',
                affordable: true,
            };
        }
        
        const shortfall = itemCost - currentBalance;
        if (monthlyNet > 0) {
            const monthsNeeded = Math.ceil(shortfall / monthlyNet);
            const purchaseDate = new Date();
            purchaseDate.setMonth(purchaseDate.getMonth() + monthsNeeded);
            const dateStr = purchaseDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            return {
                ...item,
                suggestion: `In about ${monthsNeeded} month${monthsNeeded === 1 ? '' : 's'} (${dateStr})`,
                timeline: `Monthly savings: ${formatCurrency(monthlyNet)} → Shortfall: ${formatCurrency(shortfall)}`,
                affordable: false,
            };
        } else if (monthlyNet < 0) {
            return {
                ...item,
                suggestion: '📉 Spending exceeds income',
                timeline: 'Focus on reducing expenses first',
                affordable: false,
            };
        } else {
            return {
                ...item,
                suggestion: 'Neutral cash flow',
                timeline: 'No monthly surplus to save',
                affordable: false,
            };
        }
    });
}

function renderWishlist(state) {
    wishlistContainer.innerHTML = '';
    if (state.wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p class="card-note">No wishlist items yet. Add what you want, then work toward it with your budget goals.</p>';
        return;
    }

    const suggestions = generateWishlistSuggestions(state);
    suggestions.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = `transaction-item ${item.affordable ? 'affordable-item' : ''}`;
        listItem.innerHTML = `
            <div class="details">
                <strong>${item.title}</strong>
                <div>${item.notes || 'No notes'}</div>
                <div>Estimated cost: ${formatCurrency(item.cost)}${item.targetDate ? ` · Target: ${item.targetDate}` : ''}</div>
                <div class="purchase-suggestion">
                    <span class="suggestion-main">${item.suggestion}</span>
                    ${item.timeline ? `<span class="suggestion-detail">${item.timeline}</span>` : ''}
                </div>
            </div>
            <div class="action-group">
                <button data-action="edit" data-id="${item.id}">Edit</button>
                <button data-action="delete" data-id="${item.id}">Remove</button>
            </div>
        `;
        listItem.querySelector('button[data-action="delete"]').addEventListener('click', () => deleteWishlistItem(item.id));
        listItem.querySelector('button[data-action="edit"]').addEventListener('click', () => beginWishlistEdit(item.id));
        wishlistContainer.appendChild(listItem);
    });
}

function renderIncomeBreakdown(state) {
    incomeBreakdownList.innerHTML = '';
    if (state.incomeBreakdown.length === 0) {
        incomeBreakdownList.innerHTML = '<p class="card-note">No income sources yet. Add your income streams to track where your money comes from.</p>';
        return;
    }

    const fixedTotal = state.incomeBreakdown
        .filter(s => s.type === 'fixed')
        .reduce((sum, s) => sum + Number(s.value), 0);
    const percentageTotal = state.incomeBreakdown
        .filter(s => s.type === 'percentage')
        .reduce((sum, s) => sum + Number(s.value), 0);

    state.incomeBreakdown.forEach(source => {
        const listItem = document.createElement('div');
        listItem.className = 'transaction-item';
        
        let valueDisplay = source.type === 'fixed' 
            ? `${formatCurrency(source.value)}`
            : `${Number(source.value).toFixed(1)}%`;
        
        listItem.innerHTML = `
            <div class="details">
                <strong>${source.name}</strong>
                <div>${source.type === 'fixed' ? 'Fixed' : 'Percentage'}</div>
                <div class="income-value">${valueDisplay}</div>
                ${percentageTotal > 100 && source.type === 'percentage' ? '<div class="income-warning">⚠️ Total percentage exceeds 100%</div>' : ''}
            </div>
            <div class="action-group">
                <button data-action="edit" data-id="${source.id}">Edit</button>
                <button data-action="delete" data-id="${source.id}">Delete</button>
            </div>
        `;
        listItem.querySelector('button[data-action="delete"]').addEventListener('click', () => deleteIncomeSource(source.id));
        listItem.querySelector('button[data-action="edit"]').addEventListener('click', () => beginIncomeEdit(source.id));
        incomeBreakdownList.appendChild(listItem);
    });
}

function renderAllocationBreakdown(state) {
    allocationBreakdownDisplay.innerHTML = '';
    const allocation = state.allocation;
    const visibleTransactions = getVisibleTransactions(state.transactions, currentDate);
    
    const inflow = visibleTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const needs = visibleTransactions.filter(t => t.type === 'expense' && t.category === 'needs').reduce((sum, t) => sum + Number(t.amount), 0);
    const wants = visibleTransactions.filter(t => t.type === 'expense' && t.category === 'wants').reduce((sum, t) => sum + Number(t.amount), 0);
    const savings = visibleTransactions.filter(t => t.type === 'expense' && t.category === 'savings').reduce((sum, t) => sum + Number(t.amount), 0);

    const allocatedNeeds = allocation.type === 'percentage' ? (inflow * allocation.needs / 100) : allocation.needs;
    const allocatedWants = allocation.type === 'percentage' ? (inflow * allocation.wants / 100) : allocation.wants;
    const allocatedSavings = allocation.type === 'percentage' ? (inflow * allocation.savings / 100) : allocation.savings;

    const needsPercent = inflow > 0 ? Math.round((needs / inflow) * 100) : 0;
    const wantsPercent = inflow > 0 ? Math.round((wants / inflow) * 100) : 0;
    const savingsPercent = inflow > 0 ? Math.round((savings / inflow) * 100) : 0;

    const allocationHtml = `
        <div class="allocation-summary">
            <div class="allocation-stat">
                <h4>Income</h4>
                <p class="allocation-amount">${formatCurrency(inflow)}</p>
            </div>
            <div class="allocation-categories">
                <div class="allocation-category needs">
                    <div class="allocation-header">
                        <span>Needs</span>
                        <span class="allocation-target">${allocation.type === 'percentage' ? allocation.needs + '%' : formatCurrency(allocation.needs)}</span>
                    </div>
                    <div class="allocation-bar-container">
                        <div class="allocation-bar" style="width: ${Math.min(100, (needs / allocatedNeeds) * 100)}%"></div>
                    </div>
                    <div class="allocation-details">
                        <span class="spent">${formatCurrency(needs)} spent</span>
                        <span class="budget">${formatCurrency(allocatedNeeds)} budget</span>
                        <span class="percent ${needs > allocatedNeeds ? 'over' : ''}">${needsPercent}%</span>
                    </div>
                </div>

                <div class="allocation-category wants">
                    <div class="allocation-header">
                        <span>Wants</span>
                        <span class="allocation-target">${allocation.type === 'percentage' ? allocation.wants + '%' : formatCurrency(allocation.wants)}</span>
                    </div>
                    <div class="allocation-bar-container">
                        <div class="allocation-bar" style="width: ${Math.min(100, (wants / allocatedWants) * 100)}%"></div>
                    </div>
                    <div class="allocation-details">
                        <span class="spent">${formatCurrency(wants)} spent</span>
                        <span class="budget">${formatCurrency(allocatedWants)} budget</span>
                        <span class="percent ${wants > allocatedWants ? 'over' : ''}">${wantsPercent}%</span>
                    </div>
                </div>

                <div class="allocation-category savings">
                    <div class="allocation-header">
                        <span>Savings</span>
                        <span class="allocation-target">${allocation.type === 'percentage' ? allocation.savings + '%' : formatCurrency(allocation.savings)}</span>
                    </div>
                    <div class="allocation-bar-container">
                        <div class="allocation-bar" style="width: ${Math.min(100, (savings / allocatedSavings) * 100)}%"></div>
                    </div>
                    <div class="allocation-details">
                        <span class="spent">${formatCurrency(savings)} spent</span>
                        <span class="budget">${formatCurrency(allocatedSavings)} budget</span>
                        <span class="percent ${savings > allocatedSavings ? 'over' : ''}">${savingsPercent}%</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    allocationBreakdownDisplay.innerHTML = allocationHtml;
}

function renderBills(state) {
    billsList.innerHTML = '';
    
    if (state.bills.length === 0) {
        billsList.innerHTML = '<p class="empty-state">No bills yet. Add one to track your recurring expenses!</p>';
        billsTotal.innerHTML = '';
        return;
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    
    // Calculate monthly total and upcoming bills
    let monthlyTotal = 0;
    const billsWithDates = state.bills.map(bill => {
        let nextDueDate;
        let daysUntilDue;
        
        if (bill.frequency === 'weekly') {
            // Next occurrence based on due date as day of week (1-7)
            const dayOfWeek = bill.dueDate;
            const daysUntil = (dayOfWeek - today.getDay() + 7) % 7 || 7;
            nextDueDate = new Date(today);
            nextDueDate.setDate(nextDueDate.getDate() + daysUntil);
            daysUntilDue = daysUntil;
            monthlyTotal += bill.amount * 4.3; // Approximate monthly
        } else if (bill.frequency === 'monthly') {
            let nextMonth = currentMonth;
            let nextYear = today.getFullYear();
            
            if (bill.dueDate < currentDay) {
                nextMonth = (currentMonth + 1) % 12;
                if (nextMonth === 0) nextYear += 1;
            }
            
            nextDueDate = new Date(nextYear, nextMonth, bill.dueDate);
            daysUntilDue = Math.floor((nextDueDate - today) / (1000 * 60 * 60 * 24));
            monthlyTotal += bill.amount;
        } else if (bill.frequency === 'yearly') {
            const nextYear = today.getFullYear() + (bill.dueDate < today.getMonth() + 1 ? 1 : 0);
            nextDueDate = new Date(nextYear, bill.dueDate - 1, 1);
            daysUntilDue = Math.floor((nextDueDate - today) / (1000 * 60 * 60 * 24));
            monthlyTotal += bill.amount / 12;
        }
        
        return { ...bill, nextDueDate, daysUntilDue };
    });

    // Sort by days until due
    billsWithDates.sort((a, b) => a.daysUntilDue - b.daysUntilDue);

    billsWithDates.forEach(bill => {
        const listItem = document.createElement('div');
        listItem.className = 'bill-item';
        
        const statusClass = bill.daysUntilDue <= 3 ? 'due-soon' : bill.daysUntilDue <= 7 ? 'due-this-week' : 'due-later';
        listItem.classList.add(statusClass);
        
        const dueText = bill.daysUntilDue === 0 ? 'Today' : 
                        bill.daysUntilDue === 1 ? 'Tomorrow' :
                        `${bill.daysUntilDue} days`;
        
        listItem.innerHTML = `
            <div class="bill-details">
                <strong>${bill.name}</strong>
                <div class="bill-meta">
                    <span class="bill-category">${bill.category}</span>
                    <span class="bill-frequency">${bill.frequency}</span>
                </div>
                <div class="bill-due">Due in: ${dueText}</div>
            </div>
            <div class="bill-amount-section">
                <div class="bill-amount">${formatCurrency(bill.amount)}</div>
                <div class="action-group">
                    <button data-action="edit" data-id="${bill.id}">Edit</button>
                    <button data-action="delete" data-id="${bill.id}">Delete</button>
                </div>
            </div>
        `;
        
        listItem.querySelector('button[data-action="edit"]').addEventListener('click', () => beginBillEdit(bill.id));
        listItem.querySelector('button[data-action="delete"]').addEventListener('click', () => deleteBill(bill.id));
        
        billsList.appendChild(listItem);
    });

    // Display monthly total
    const billsTotalHtml = `
        <div class="bills-monthly-total">
            <span>Monthly recurring total:</span>
            <span class="total-amount">${formatCurrency(monthlyTotal)}</span>
        </div>
    `;
    billsTotal.innerHTML = billsTotalHtml;
}

function render() {
    const state = loadState();
    const visibleTransactions = getVisibleTransactions(state.transactions, currentDate);
    renderSummary(visibleTransactions);
    renderCalendar(visibleTransactions, state.goals, state.wishlist, state.events);
    renderTransactions(state.transactions);
    renderMembership(state);
    renderFriendPool(state);
    renderEvents(state);
    renderGoals(state);
    renderWishlist(state);
    renderIncomeBreakdown(state);
    renderAllocationBreakdown(state);
    renderBills(state);
    renderEncouragement(state);
    renderAuth(state);
    currentMonthEl.textContent = getMonthLabel(currentDate);
}

function deleteTransaction(id) {
    const state = loadState();
    state.transactions = state.transactions.filter(transaction => transaction.id !== id);
    saveState(state);
    if (editingTransactionId === id) {
        clearTransactionEdit();
    }
    render();
}

function beginTransactionEdit(id) {
    const state = loadState();
    const transaction = state.transactions.find(tx => tx.id === id);
    if (!transaction) return;

    editingTransactionId = id;
    transactionFormHeading.textContent = 'Edit transaction';
    transactionSubmitBtn.textContent = 'Update';
    cancelTransactionEdit.classList.remove('hidden');

    document.getElementById('transactionDate').value = transaction.date;
    document.getElementById('transactionDescription').value = transaction.description;
    document.getElementById('transactionAmount').value = transaction.amount;
    document.getElementById('transactionType').value = transaction.type;

    if (transaction.recurring) {
        transactionModeInput.value = 'recurring';
        recurrenceFields.classList.remove('hidden');
        transactionFrequency.value = transaction.frequency || 'monthly';
        transactionIndefinite.checked = Boolean(transaction.indefinite);
        transactionEndDate.value = transaction.endDate || '';
        transactionEndDate.disabled = transaction.indefinite;
    } else {
        transactionModeInput.value = 'one-time';
        recurrenceFields.classList.add('hidden');
        transactionFrequency.value = 'monthly';
        transactionEndDate.value = '';
        transactionIndefinite.checked = false;
        transactionEndDate.disabled = false;
    }
}

function clearTransactionEdit() {
    editingTransactionId = null;
    transactionFormHeading.textContent = 'Add transaction';
    transactionSubmitBtn.textContent = 'Save';
    cancelTransactionEdit.classList.add('hidden');
    transactionForm.reset();
    transactionModeInput.value = 'one-time';
    recurrenceFields.classList.add('hidden');
    transactionEndDate.disabled = false;
}

function beginGoalEdit(id) {
    const state = loadState();
    const goal = state.goals.find(g => g.id === id);
    if (!goal) return;

    editingGoalId = id;
    goalFormHeading.textContent = 'Edit Goal';
    goalSubmitBtn.textContent = 'Update Goal';
    cancelGoalEdit.classList.remove('hidden');

    goalTitleInput.value = goal.title;
    goalTargetInput.value = goal.target;
    goalDeadlineInput.value = goal.deadline || '';
    goalForm.classList.remove('hidden');
    goalForm.scrollIntoView({ behavior: 'smooth' });
}

function clearGoalEdit() {
    editingGoalId = null;
    goalFormHeading.textContent = 'Create Goal';
    goalSubmitBtn.textContent = 'Save Goal';
    cancelGoalEdit.classList.add('hidden');
    goalForm.reset();
    goalForm.classList.add('hidden');
}

function beginWishlistEdit(id) {
    const state = loadState();
    const item = state.wishlist.find(w => w.id === id);
    if (!item) return;

    editingWishlistId = id;
    wishlistFormHeading.textContent = 'Edit Wishlist Item';
    wishlistSubmitBtn.textContent = 'Update Item';
    cancelWishlistEdit.classList.remove('hidden');

    wishTitleInput.value = item.title;
    wishCostInput.value = item.cost;
    wishTargetDateInput.value = item.targetDate || '';
    wishNotesInput.value = item.notes || '';
    wishlistForm.classList.remove('hidden');
    wishlistForm.scrollIntoView({ behavior: 'smooth' });
}

function clearWishlistEdit() {
    editingWishlistId = null;
    wishlistFormHeading.textContent = 'Add Wishlist Item';
    wishlistSubmitBtn.textContent = 'Save Item';
    cancelWishlistEdit.classList.add('hidden');
    wishlistForm.reset();
    wishlistForm.classList.add('hidden');
}

function beginIncomeEdit(id) {
    const state = loadState();
    const source = state.incomeBreakdown.find(s => s.id === id);
    if (!source) return;

    editingIncomeId = id;
    incomeFormHeading.textContent = 'Edit Income Source';
    incomeBreakdownSubmitBtn.textContent = 'Update Source';
    cancelIncomeEdit.classList.remove('hidden');

    incomeNameInput.value = source.name;
    incomeTypeInput.value = source.type;
    incomeValueInput.value = source.value;
    updateIncomeValueLabel();
    incomeBreakdownForm.classList.remove('hidden');
    incomeBreakdownForm.scrollIntoView({ behavior: 'smooth' });
}

function clearIncomeEdit() {
    editingIncomeId = null;
    incomeFormHeading.textContent = 'Add Income Source';
    incomeBreakdownSubmitBtn.textContent = 'Save Source';
    cancelIncomeEdit.classList.add('hidden');
    incomeBreakdownForm.reset();
    incomeBreakdownForm.classList.add('hidden');
}

function updateIncomeValueLabel() {
    if (incomeTypeInput.value === 'percentage') {
        incomeValueLabel.textContent = 'Percentage (%)';
    } else {
        incomeValueLabel.textContent = 'Amount';
    }
}

function updateAllocationLabels() {
    if (allocationTypeInput.value === 'percentage') {
        needsLabel.textContent = 'Needs (%)';
        wantsLabel.textContent = 'Wants (%)';
        savingsLabel.textContent = 'Savings (%)';
    } else {
        needsLabel.textContent = 'Needs ($)';
        wantsLabel.textContent = 'Wants ($)';
        savingsLabel.textContent = 'Savings ($)';
    }
}

transactionForm.addEventListener('submit', event => {
    event.preventDefault();
    const date = document.getElementById('transactionDate').value;
    const description = document.getElementById('transactionDescription').value.trim();
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const type = document.getElementById('transactionType').value;
    const mode = transactionModeInput.value;
    const frequency = transactionFrequency.value;
    const endDate = transactionEndDate.value;
    const indefinite = transactionIndefinite.checked;

    if (!date || !description || Number.isNaN(amount)) {
        return;
    }

    const transaction = {
        id: editingTransactionId || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        date,
        description,
        amount,
        type,
        recurring: mode === 'recurring',
        frequency: mode === 'recurring' ? frequency : undefined,
        endDate: mode === 'recurring' && !indefinite ? endDate : undefined,
        indefinite: mode === 'recurring' ? indefinite : false,
    };

    const state = loadState();
    if (editingTransactionId) {
        state.transactions = state.transactions.map(tx => tx.id === editingTransactionId ? transaction : tx);
    } else {
        state.transactions.push(transaction);
    }
    saveState(state);
    clearTransactionEdit();
    render();
});

exportCsvBtn.addEventListener('click', () => {
    const state = loadState();
    if (state.transactions.length === 0) {
        return;
    }
    const rows = ['Date,Description,Type,Amount,Recurring,Frequency,EndDate,Indefinite'];
    state.transactions.forEach(t => {
        rows.push(`${t.date},"${t.description}",${t.type},${t.amount},${t.recurring || false},${t.frequency || ''},${t.endDate || ''},${t.indefinite || false}`);
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

transactionModeInput.addEventListener('change', () => {
    if (transactionModeInput.value === 'recurring') {
        recurrenceFields.classList.remove('hidden');
    } else {
        recurrenceFields.classList.add('hidden');
    }
});

transactionIndefinite.addEventListener('change', () => {
    if (transactionIndefinite.checked) {
        transactionEndDate.value = '';
        transactionEndDate.disabled = true;
    } else {
        transactionEndDate.disabled = false;
    }
});

cancelTransactionEdit.addEventListener('click', () => {
    clearTransactionEdit();
});

membershipButton.addEventListener('click', () => {
    const state = loadState();
    if (!state.user.signedIn) {
        authForm.classList.remove('hidden');
        return;
    }
    if (!state.membership.active) {
        paymentForm.classList.toggle('hidden');
        if (!paymentForm.classList.contains('hidden')) {
            initializeStripeElements();
        }
    }
});

showFriendFormBtn.addEventListener('click', () => {
    const state = loadState();
    if (!state.user.signedIn) {
        authForm.classList.remove('hidden');
        return;
    }
    if (!state.membership.active) {
        paymentForm.classList.toggle('hidden');
        return;
    }
    friendForm.classList.toggle('hidden');
});

friendForm.addEventListener('submit', event => {
    event.preventDefault();
    const state = loadState();
    if (!state.user.signedIn || !state.membership.active) {
        return;
    }

    const name = friendNameInput.value.trim();
    const email = friendEmailInput.value.trim();
    const contribution = parseFloat(friendContributionInput.value) || 0;

    if (!name || !email) {
        return;
    }

    addFriend({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name,
        email,
        contribution,
    });
    friendForm.reset();
    friendForm.classList.add('hidden');
    render();
});

showEventFormBtn.addEventListener('click', () => {
    const state = loadState();
    if (!state.user.signedIn) {
        authForm.classList.remove('hidden');
        return;
    }
    if (!state.membership.active) {
        paymentForm.classList.toggle('hidden');
        return;
    }
    eventForm.classList.toggle('hidden');
});

eventForm.addEventListener('submit', event => {
    event.preventDefault();
    const state = loadState();
    if (!state.user.signedIn || !state.membership.active) {
        return;
    }

    const title = eventTitleInput.value.trim();
    const date = eventDateInput.value;
    const budget = parseFloat(eventBudgetInput.value);
    const notes = eventNotesInput.value.trim();

    if (!title || !date || Number.isNaN(budget)) {
        return;
    }

    addEvent({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title,
        date,
        budget,
        notes,
    });
    eventForm.reset();
    eventForm.classList.add('hidden');
    render();
});

showGoalFormBtn.addEventListener('click', () => {
    if (editingGoalId) {
        clearGoalEdit();
    } else {
        goalForm.classList.toggle('hidden');
    }
});

goalForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = goalTitleInput.value.trim();
    const target = parseFloat(goalTargetInput.value);
    const deadline = goalDeadlineInput.value;

    if (!title || Number.isNaN(target)) {
        return;
    }

    const state = loadState();
    const goal = {
        id: editingGoalId || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title,
        target,
        deadline,
    };

    if (editingGoalId) {
        state.goals = state.goals.map(g => g.id === editingGoalId ? goal : g);
    } else {
        state.goals.push(goal);
    }
    saveState(state);
    clearGoalEdit();
    render();
});

cancelGoalEdit.addEventListener('click', (e) => {
    e.preventDefault();
    clearGoalEdit();
    render();
});

showWishlistFormBtn.addEventListener('click', () => {
    if (editingWishlistId) {
        clearWishlistEdit();
    } else {
        wishlistForm.classList.toggle('hidden');
    }
});

wishlistForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = wishTitleInput.value.trim();
    const cost = parseFloat(wishCostInput.value) || 0;
    const targetDate = wishTargetDateInput.value;
    const notes = wishNotesInput.value.trim();

    if (!title) {
        return;
    }

    const state = loadState();
    const item = {
        id: editingWishlistId || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title,
        cost,
        targetDate,
        notes,
    };

    if (editingWishlistId) {
        state.wishlist = state.wishlist.map(w => w.id === editingWishlistId ? item : w);
    } else {
        state.wishlist.push(item);
    }
    saveState(state);
    clearWishlistEdit();
    render();
});

cancelWishlistEdit.addEventListener('click', (e) => {
    e.preventDefault();
    clearWishlistEdit();
    render();
});

showIncomeBreakdownFormBtn.addEventListener('click', () => {
    if (editingIncomeId) {
        clearIncomeEdit();
    } else {
        incomeBreakdownForm.classList.toggle('hidden');
    }
});

incomeTypeInput.addEventListener('change', updateIncomeValueLabel);

incomeBreakdownForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = incomeNameInput.value.trim();
    const type = incomeTypeInput.value;
    const value = parseFloat(incomeValueInput.value);

    if (!name || Number.isNaN(value) || value < 0) {
        return;
    }

    if (type === 'percentage' && value > 100) {
        alert('Percentage cannot exceed 100%');
        return;
    }

    const state = loadState();
    const source = {
        id: editingIncomeId || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name,
        type,
        value,
    };

    if (editingIncomeId) {
        state.incomeBreakdown = state.incomeBreakdown.map(s => s.id === editingIncomeId ? source : s);
    } else {
        state.incomeBreakdown.push(source);
    }
    saveState(state);
    clearIncomeEdit();
    render();
});

cancelIncomeEdit.addEventListener('click', (e) => {
    e.preventDefault();
    clearIncomeEdit();
    render();
});

showAllocationFormBtn.addEventListener('click', () => {
    allocationForm.classList.toggle('hidden');
    if (!allocationForm.classList.contains('hidden')) {
        const state = loadState();
        allocationTypeInput.value = state.allocation.type;
        needsAmountInput.value = state.allocation.needs;
        wantsAmountInput.value = state.allocation.wants;
        savingsAmountInput.value = state.allocation.savings;
        updateAllocationLabels();
    }
});

allocationTypeInput.addEventListener('change', updateAllocationLabels);

allocationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const state = loadState();
    const type = allocationTypeInput.value;
    const needs = parseFloat(needsAmountInput.value) || 0;
    const wants = parseFloat(wantsAmountInput.value) || 0;
    const savings = parseFloat(savingsAmountInput.value) || 0;

    // Validation
    if (needs < 0 || wants < 0 || savings < 0) {
        alert('All values must be non-negative');
        return;
    }

    if (type === 'percentage') {
        if (needs > 100 || wants > 100 || savings > 100) {
            alert('Percentages cannot exceed 100%');
            return;
        }
        const total = needs + wants + savings;
        if (total !== 100) {
            const confirm_msg = `Total allocation is ${total}%, not 100%. Continue anyway?`;
            if (!confirm(confirm_msg)) {
                return;
            }
        }
    }

    state.allocation = { type, needs, wants, savings };
    saveState(state);
    allocationForm.classList.add('hidden');
    render();
});

cancelAllocationEdit.addEventListener('click', (e) => {
    e.preventDefault();
    allocationForm.classList.add('hidden');
});

showBillForm.addEventListener('click', () => {
    billForm.classList.toggle('hidden');
    if (!billForm.classList.contains('hidden')) {
        billForm.reset();
        editingBillId = null;
        billSubmit.textContent = 'Save Bill';
    }
});

billForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = billName.value.trim();
    const amount = parseFloat(billAmount.value);
    const frequency = billFrequency.value;
    const dueDate = parseFloat(billDueDate.value);
    const category = billCategory.value;

    if (!name || !amount || amount <= 0) {
        alert('Please fill in all fields with valid values');
        return;
    }

    if (frequency === 'monthly' && (dueDate < 1 || dueDate > 31)) {
        alert('Due date must be between 1 and 31');
        return;
    }

    if (frequency === 'weekly' && (dueDate < 1 || dueDate > 7)) {
        alert('Day of week must be between 1 (Monday) and 7 (Sunday)');
        return;
    }

    const state = loadState();

    if (editingBillId) {
        const bill = state.bills.find(b => b.id === editingBillId);
        if (bill) {
            bill.name = name;
            bill.amount = amount;
            bill.frequency = frequency;
            bill.dueDate = dueDate;
            bill.category = category;
        }
    } else {
        addBill({ name, amount, frequency, dueDate, category });
        state = loadState();
    }

    saveState(state);
    clearBillEdit();
    render();
});

cancelBillEdit.addEventListener('click', (e) => {
    e.preventDefault();
    clearBillEdit();
});

showSignInBtn.addEventListener('click', () => setAuthMode('sign-in'));
showSignUpBtn.addEventListener('click', () => setAuthMode('sign-up'));

authButton.addEventListener('click', () => {
    const state = loadState();
    if (state.user.signedIn) {
        authToken = null;
        localStorage.removeItem(authTokenKey);
        updateUser({ signedIn: false, email: '', name: '' });
        render();
        return;
    }
    authForm.classList.toggle('hidden');
    setAuthMode('sign-in');
});

authForm.addEventListener('submit', async event => {
    event.preventDefault();
    const name = authNameInput.value.trim();
    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value.trim();

    if (!email || !password) {
        authError.textContent = 'Email and password are required.';
        return;
    }

    authSubmitBtn.disabled = true;
    authSubmitBtn.textContent = authMode === 'sign-up' ? 'Creating account...' : 'Signing in...';

    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: authMode === 'sign-up' ? 'signup' : 'signin',
                name,
                email,
                password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            authError.textContent = result.error || 'Authentication failed';
            authSubmitBtn.disabled = false;
            authSubmitBtn.textContent = authMode === 'sign-up' ? 'Sign up' : 'Sign in';
            return;
        }

        // Save auth token and update user state
        authToken = result.token;
        localStorage.setItem(authTokenKey, authToken);
        updateUser({ signedIn: true, email: result.user.email, name: result.user.name });
        authForm.reset();
        authForm.classList.add('hidden');
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = authMode === 'sign-up' ? 'Sign up' : 'Sign in';
        render();
    } catch (error) {
        console.error('Auth error:', error);
        authError.textContent = 'An error occurred. Please try again.';
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = authMode === 'sign-up' ? 'Sign up' : 'Sign in';
    }
});

paymentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const state = loadState();
    if (!state.user.signedIn) {
        authForm.classList.remove('hidden');
        return;
    }

    const selectedPlan = document.querySelector('input[name="plan"]:checked').value;
    const referralCode = document.getElementById('referralCode').value.trim();

    try {
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan: selectedPlan,
                referralCode: referralCode,
            }),
        });

        const { clientSecret, error } = await response.json();
        if (error) {
            document.getElementById('card-errors').textContent = error;
            return;
        }

        const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (stripeError) {
            document.getElementById('card-errors').textContent = stripeError.message;
        } else {
            // Payment succeeded
            const membership = {
                active: true,
                since: new Date().toISOString(),
                plan: selectedPlan === 'premium-monthly' ? 'Monthly' : 'Weekly',
            };
            updateMembership(membership);
            paymentForm.classList.add('hidden');
            render();
        }
    } catch (error) {
        document.getElementById('card-errors').textContent = 'Payment failed. Please try again.';
    }
});

function changeMonth(offset) {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    render();
}

document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));

// Initialize app - load from Vercel if logged in
async function initializeApp() {
    if (authToken) {
        const vercelData = await loadStateFromVercel();
        if (vercelData) {
            saveState(vercelData);
        }
    }
    render();
}

initializeApp();
