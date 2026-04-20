const storageKey = 'financialCalendarState';
const defaultDate = new Date();
let currentDate = new Date(defaultDate.getFullYear(), defaultDate.getMonth(), 1);

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

let editingGoalId = null;
let editingWishlistId = null;

// Stripe integration
let stripe;
let cardElement;

function initializeStripeElements() {
    if (!stripe) {
        stripe = Stripe('pk_test_51QEXAMPLE...'); // Replace with your actual publishable key
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

showSignInBtn.addEventListener('click', () => setAuthMode('sign-in'));
showSignUpBtn.addEventListener('click', () => setAuthMode('sign-up'));

authButton.addEventListener('click', () => {
    const state = loadState();
    if (state.user.signedIn) {
        updateUser({ signedIn: false, email: '', name: '' });
        render();
        return;
    }
    authForm.classList.toggle('hidden');
    setAuthMode('sign-in');
});

authForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = authNameInput.value.trim();
    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value.trim();

    if (!email || !password) {
        authError.textContent = 'Email and password are required.';
        return;
    }

    const existingUser = getUserByEmail(email);
    if (authMode === 'sign-up') {
        if (!name) {
            authError.textContent = 'Please enter your name.';
            return;
        }
        if (existingUser) {
            authError.textContent = 'An account already exists with this email.';
            return;
        }
        const user = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name,
            email,
            password,
        };
        addUser(user);
        updateUser({ signedIn: true, email, name });
        authForm.reset();
        authForm.classList.add('hidden');
        render();
        return;
    }

    if (!existingUser || existingUser.password !== password) {
        authError.textContent = 'Email or password is incorrect.';
        return;
    }

    updateUser({ signedIn: true, email: existingUser.email, name: existingUser.name });
    authForm.reset();
    authForm.classList.add('hidden');
    render();
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

render();
