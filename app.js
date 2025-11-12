// Data
const quizData = [
    {
        question: "What percentage of your income should ideally go to savings?",
        options: ["5-10%", "10-20%", "20-30%", "30-40%"],
        correct: "10-20%"
    },
    {
        question: "What is compound interest?",
        options: ["Interest on principal only", "Interest on principal + accumulated interest", "Fixed interest rate", "No interest"],
        correct: "Interest on principal + accumulated interest"
    },
    {
        question: "What is an emergency fund?",
        options: ["Money for shopping", "Money saved for unexpected expenses", "Investment fund", "Retirement savings"],
        correct: "Money saved for unexpected expenses"
    },
    {
        question: "Which is a good debt?",
        options: ["Credit card debt", "Student loan for education", "Personal loan for vacation", "High-interest loan"],
        correct: "Student loan for education"
    },
    {
        question: "What does SIP stand for?",
        options: ["Standard Investment Plan", "Systematic Investment Plan", "Simple Interest Plan", "Stock Investment Program"],
        correct: "Systematic Investment Plan"
    },
    {
        question: "What is budgeting?",
        options: ["Spending all your money", "Planning and tracking income/expenses", "Borrowing money", "Avoiding expenses"],
        correct: "Planning and tracking income/expenses"
    },
    {
        question: "What is the 50-30-20 budgeting rule?",
        options: ["50% needs, 30% wants, 20% savings", "50% savings, 30% needs, 20% wants", "50% wants, 30% savings, 20% needs", "Equal distribution"],
        correct: "50% needs, 30% wants, 20% savings"
    },
    {
        question: "What is inflation?",
        options: ["Decrease in prices", "Increase in general price level", "Stable prices", "Currency devaluation"],
        correct: "Increase in general price level"
    },
    {
        question: "Which is a low-risk investment?",
        options: ["Cryptocurrency", "Fixed deposits", "Penny stocks", "Options trading"],
        correct: "Fixed deposits"
    },
    {
        question: "What is the purpose of diversification?",
        options: ["Put all money in one investment", "Spread investments to reduce risk", "Only invest in stocks", "Avoid investing"],
        correct: "Spread investments to reduce risk"
    }
];

const savingsScenarios = [
    {
        habit: "Skipping 2 cigarettes/day",
        daily_cost: 40,
        monthly_savings: 1200,
        yearly_savings: 14600,
        goal: "Weekend trip to Goa",
        goal_cost: 14400,
        emoji: "🌴"
    },
    {
        habit: "Making coffee at home instead of café",
        daily_cost: 150,
        monthly_savings: 4500,
        yearly_savings: 54750,
        goal: "New smartphone",
        goal_cost: 25000,
        emoji: "📱"
    },
    {
        habit: "Packing lunch instead of eating out",
        daily_cost: 120,
        monthly_savings: 3600,
        yearly_savings: 43800,
        goal: "Laptop upgrade",
        goal_cost: 40000,
        emoji: "💻"
    },
    {
        habit: "Using public transport instead of cab",
        daily_cost: 200,
        monthly_savings: 6000,
        yearly_savings: 73000,
        goal: "International trip",
        goal_cost: 75000,
        emoji: "✈️"
    }
];

const premiumOffers = [
    {
        platform: "ChatGPT Go",
        regular_price: "₹399/month",
        offer_duration: "12 months",
        total_value: "₹4,788",
        availability: "All India users",
        features: [
            "Full access to GPT-5 model",
            "File uploads & document analysis",
            "Faster response times",
            "Advanced reasoning capabilities",
            "Voice mode (coming soon)"
        ]
    },
    {
        platform: "Perplexity Pro",
        regular_price: "₹17,000/year",
        offer_duration: "12 months",
        total_value: "₹17,000",
        availability: "Airtel users only",
        features: [
            "Unlimited Pro searches",
            "Access to GPT-5, Claude 3.5, Mistral",
            "File & PDF analysis",
            "Ad-free experience",
            "Cited sources in every answer"
        ]
    },
    {
        platform: "Gemini Pro (AI Pro)",
        regular_price: "₹35,100",
        offer_duration: "18 months",
        total_value: "₹35,100",
        availability: "Jio users (select plans)",
        features: [
            "Gemini 2.5 Pro model access",
            "2TB cloud storage",
            "Advanced multimodal AI",
            "Integration with Google Workspace",
            "Priority support"
        ]
    }
];

const mutualFunds = [
    {
        name: "Motilal Oswal Midcap Fund",
        category: "Mid Cap",
        min_sip: 500,
        three_year_return: 33.19,
        five_year_return: 32.40,
        expense_ratio: 0.70
    },
    {
        name: "SBI PSU Fund",
        category: "PSU",
        min_sip: 500,
        three_year_return: 31.68,
        five_year_return: 31.80,
        expense_ratio: 0.81
    },
    {
        name: "ICICI Prudential Infrastructure Fund",
        category: "Infrastructure",
        min_sip: 500,
        three_year_return: 33.05,
        five_year_return: 31.30,
        expense_ratio: 1.14
    },
    {
        name: "Quant Small Cap Fund",
        category: "Small Cap",
        min_sip: 1000,
        three_year_return: 24.65,
        five_year_return: 35.29,
        expense_ratio: 0.66
    },
    {
        name: "Nippon India Small Cap Fund",
        category: "Small Cap",
        min_sip: 100,
        three_year_return: 23.61,
        five_year_return: 32.87,
        expense_ratio: 0.65
    },
    {
        name: "Parag Parikh Flexi Cap Fund",
        category: "Flexi Cap",
        min_sip: 500,
        three_year_return: 20.69,
        five_year_return: 26.41,
        expense_ratio: 0.82
    },
    {
        name: "HDFC Flexi Cap Fund",
        category: "Flexi Cap",
        min_sip: 300,
        three_year_return: 24.73,
        five_year_return: 27.33,
        expense_ratio: 0.68
    },
    {
        name: "Mirae Asset Large Cap Fund",
        category: "Large Cap",
        min_sip: 100,
        three_year_return: 14.25,
        five_year_return: 16.57,
        expense_ratio: 0.52
    }
];

// Game State
let gameState = {
    points: 0,
    level: "Finance Newbie",
    sectionsCompleted: [],
    currentQuestion: 0,
    quizScore: 0,
    quizAnswers: []
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initQuiz();
    initSavingsScenarios();
    initOffers();
    initFunds();
    updateStats();
});

// Navigation
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const sectionId = tab.dataset.section;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active section
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Quiz Functions
function initQuiz() {
    displayQuestion();
}

function displayQuestion() {
    const quizContent = document.getElementById('quizContent');
    const currentQ = gameState.currentQuestion;
    
    if (currentQ >= quizData.length) {
        displayQuizResult();
        return;
    }
    
    const question = quizData[currentQ];
    document.getElementById('quizProgress').textContent = `Question ${currentQ + 1}/${quizData.length}`;
    
    let html = `
        <div class="question-card">
            <div class="question-text">${question.question}</div>
            <div class="options-grid">
    `;
    
    question.options.forEach(option => {
        html += `<button class="option-button" onclick="selectAnswer('${option}')">${option}</button>`;
    });
    
    html += `
            </div>
        </div>
    `;
    
    quizContent.innerHTML = html;
}

function selectAnswer(selectedOption) {
    const currentQ = gameState.currentQuestion;
    const question = quizData[currentQ];
    const isCorrect = selectedOption === question.correct;
    
    // Store answer
    gameState.quizAnswers.push({
        question: question.question,
        selected: selectedOption,
        correct: question.correct,
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        gameState.quizScore++;
    }
    
    // Visual feedback
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === question.correct) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedOption && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    // Move to next question after delay
    setTimeout(() => {
        gameState.currentQuestion++;
        displayQuestion();
    }, 1500);
}

function displayQuizResult() {
    const percentage = Math.round((gameState.quizScore / quizData.length) * 100);
    const passed = percentage >= 60;
    
    if (passed && !gameState.sectionsCompleted.includes('quiz')) {
        gameState.sectionsCompleted.push('quiz');
        gameState.points += 100;
        updateStats();
    }
    
    const emoji = passed ? '🎉' : '😊';
    const message = passed 
        ? `Congratulations! You've passed! 🎊<br><br>Check your email for a <strong>₹100 reward voucher</strong>!` 
        : `Keep learning! Try again to unlock your reward. You're almost there!`;
    
    const quizContent = document.getElementById('quizContent');
    quizContent.innerHTML = `
        <div class="quiz-result">
            <div class="result-emoji">${emoji}</div>
            <div class="result-score">${gameState.quizScore}/${quizData.length}</div>
            <div class="result-score">${percentage}%</div>
            <div class="result-message">${message}</div>
            <button class="btn btn-primary" onclick="retakeQuiz()">Retake Quiz 🔄</button>
        </div>
    `;
}

function retakeQuiz() {
    gameState.currentQuestion = 0;
    gameState.quizScore = 0;
    gameState.quizAnswers = [];
    displayQuestion();
}

// Savings Functions
function initSavingsScenarios() {
    const container = document.getElementById('savingsScenarios');
    
    let html = '';
    savingsScenarios.forEach(scenario => {
        html += `
            <div class="scenario-card" onclick='fillScenario(${JSON.stringify(scenario)})'>
                <div class="scenario-emoji">${scenario.emoji}</div>
                <div class="scenario-title">${scenario.habit}</div>
                <div class="scenario-amount">₹${scenario.yearly_savings.toLocaleString()}/year</div>
                <div class="scenario-goal">💡 Goal: ${scenario.goal}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function fillScenario(scenario) {
    document.getElementById('habitName').value = scenario.habit;
    document.getElementById('dailyCost').value = scenario.daily_cost;
    document.getElementById('goalName').value = scenario.goal;
    document.getElementById('goalAmount').value = scenario.goal_cost;
    
    calculateSavings();
    
    if (!gameState.sectionsCompleted.includes('savings')) {
        gameState.sectionsCompleted.push('savings');
        gameState.points += 50;
        updateStats();
    }
}

function calculateSavings() {
    const dailyCost = parseFloat(document.getElementById('dailyCost').value);
    const goalAmount = parseFloat(document.getElementById('goalAmount').value);
    const habitName = document.getElementById('habitName').value;
    const goalName = document.getElementById('goalName').value;
    
    if (!dailyCost || !goalAmount) {
        return;
    }
    
    const monthlySavings = dailyCost * 30;
    const yearlySavings = dailyCost * 365;
    const monthsToGoal = Math.ceil(goalAmount / monthlySavings);
    
    const container = document.getElementById('savingsResultContainer');
    container.innerHTML = `
        <div class="savings-result">
            <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-20); font-weight: var(--font-weight-semibold);">Your Savings Plan 📊</h3>
            <div class="result-grid">
                <div class="result-item">
                    <div class="result-label">Monthly Savings</div>
                    <div class="result-value">₹${monthlySavings.toLocaleString()}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Yearly Savings</div>
                    <div class="result-value">₹${yearlySavings.toLocaleString()}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Months to Goal</div>
                    <div class="result-value">${monthsToGoal}</div>
                </div>
            </div>
            <div class="chart-container">
                <canvas id="savingsChart"></canvas>
            </div>
        </div>
    `;
    
    // Create chart
    const ctx = document.getElementById('savingsChart').getContext('2d');
    const months = Math.min(monthsToGoal, 12);
    const labels = [];
    const data = [];
    
    for (let i = 1; i <= months; i++) {
        labels.push(`Month ${i}`);
        data.push(monthlySavings * i);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Accumulated Savings (₹)',
                data: data,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    if (!gameState.sectionsCompleted.includes('savings')) {
        gameState.sectionsCompleted.push('savings');
        gameState.points += 50;
        updateStats();
    }
}

// Offers Functions
function initOffers() {
    const container = document.getElementById('offersGrid');
    
    let html = '';
    premiumOffers.forEach(offer => {
        html += `
            <div class="offer-card">
                <span class="offer-badge">LIMITED TIME OFFER</span>
                <div class="offer-header">
                    <div class="offer-name">${offer.platform}</div>
                    <div class="offer-price">
                        <span class="price-regular">${offer.regular_price}</span>
                        <span class="price-free">FREE!</span>
                    </div>
                    <div class="offer-value">Total Value: ${offer.total_value}</div>
                    <div class="offer-availability">📍 ${offer.availability}</div>
                </div>
                <ul class="offer-features">
        `;
        
        offer.features.forEach(feature => {
            html += `<li>${feature}</li>`;
        });
        
        html += `
                </ul>
                <button class="btn btn-primary" onclick="claimOffer('${offer.platform}')">Claim Now 🎉</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function claimOffer(platform) {
    alert(`🎉 Opening ${platform} claim page!\n\nNote: This is a demo. In production, this would redirect to the actual offer page.`);
    
    if (!gameState.sectionsCompleted.includes('offers')) {
        gameState.sectionsCompleted.push('offers');
        gameState.points += 25;
        updateStats();
    }
}

// SIP Functions
function calculateSIP() {
    const amount = parseFloat(document.getElementById('sipAmount').value);
    const years = parseFloat(document.getElementById('sipYears').value);
    const annualReturn = parseFloat(document.getElementById('sipReturn').value);
    
    if (!amount || !years || !annualReturn) {
        return;
    }
    
    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;
    
    // FV = P × [((1 + r)^n - 1) / r] × (1 + r)
    const maturityValue = amount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvested = amount * months;
    const estimatedGains = maturityValue - totalInvested;
    
    const container = document.getElementById('sipResults');
    container.innerHTML = `
        <div class="sip-results">
            <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-20); font-weight: var(--font-weight-semibold);">Investment Projection 💰</h3>
            <div class="result-grid">
                <div class="result-item">
                    <div class="result-label">Total Invested</div>
                    <div class="result-value">₹${Math.round(totalInvested).toLocaleString()}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Estimated Returns</div>
                    <div class="result-value" style="color: var(--color-success);">₹${Math.round(estimatedGains).toLocaleString()}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Maturity Value</div>
                    <div class="result-value">₹${Math.round(maturityValue).toLocaleString()}</div>
                </div>
            </div>
        </div>
    `;
    
    if (!gameState.sectionsCompleted.includes('sip')) {
        gameState.sectionsCompleted.push('sip');
        gameState.points += 50;
        updateStats();
    }
}

function initFunds() {
    const container = document.getElementById('fundsGrid');
    
    let html = '';
    mutualFunds.forEach(fund => {
        const returnClass = fund.five_year_return >= 30 ? 'return-high' : 
                           fund.five_year_return >= 20 ? 'return-medium' : 'return-low';
        
        html += `
            <div class="fund-card">
                <div class="fund-info">
                    <div class="fund-name">${fund.name}</div>
                    <div class="fund-category">📊 ${fund.category} | Min SIP: ₹${fund.min_sip}</div>
                </div>
                <div class="fund-stats">
                    <div class="fund-stat">
                        <div class="stat-label-small">3Y Returns</div>
                        <div class="stat-value-small ${returnClass}">${fund.three_year_return}%</div>
                    </div>
                    <div class="fund-stat">
                        <div class="stat-label-small">5Y Returns</div>
                        <div class="stat-value-small ${returnClass}">${fund.five_year_return}%</div>
                    </div>
                    <div class="fund-stat">
                        <div class="stat-label-small">Expense Ratio</div>
                        <div class="stat-value-small">${fund.expense_ratio}%</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Stats Functions
function updateStats() {
    document.getElementById('pointsDisplay').textContent = gameState.points;
    document.getElementById('sectionsDisplay').textContent = `${gameState.sectionsCompleted.length}/4`;
    
    // Update level
    let level = "Finance Newbie";
    if (gameState.points >= 500) level = "Finance Pro";
    else if (gameState.points >= 250) level = "Investment Explorer";
    else if (gameState.points >= 150) level = "Smart Saver";
    else if (gameState.points >= 50) level = "Budget Builder";
    
    gameState.level = level;
    document.getElementById('levelDisplay').textContent = level;
    
    // Update progress bar
    const progress = (gameState.sectionsCompleted.length / 4) * 100;
    document.getElementById('overallProgress').style.width = progress + '%';
}