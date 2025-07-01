// Utility Functions
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

const formatPercent = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value / 100);
};

// Form Validation
const validateNumber = (value, min = 0) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min;
};

// Mortgage Calculator
const calculateMortgage = (principal, rate, years) => {
    const monthlyRate = rate / 1200; // Annual rate to monthly decimal
    const numberOfPayments = years * 12;
    
    if (monthlyRate === 0) {
        return principal / numberOfPayments;
    }
    
    const monthlyPayment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    
    return {
        monthlyPayment,
        totalPayment,
        totalInterest
    };
};

// Compound Interest Calculator
const calculateCompoundInterest = (principal, rate, years, frequency, monthlyContribution = 0) => {
    const periodicRate = rate / (100 * frequency);
    const periods = years * frequency;
    
    let amount = principal;
    const monthlyToPeriodicContribution = monthlyContribution * (12 / frequency);
    
    amount = principal * Math.pow(1 + periodicRate, periods);
    
    // Add periodic contributions
    if (monthlyContribution > 0) {
        amount += monthlyToPeriodicContribution * 
            ((Math.pow(1 + periodicRate, periods) - 1) / periodicRate);
    }
    
    const totalContributions = principal + (monthlyContribution * 12 * years);
    const interestEarned = amount - totalContributions;
    
    return {
        finalAmount: amount,
        totalContributions,
        interestEarned
    };
};

// ROI Calculator
const calculateROI = (gain, cost) => {
    const roi = ((gain - cost) / cost) * 100;
    const absoluteReturn = gain - cost;
    
    return {
        roi,
        absoluteReturn
    };
};

// Loan Amortization Calculator
const calculateAmortization = (principal, rate, years) => {
    const monthlyRate = rate / 1200;
    const numberOfPayments = years * 12;
    const monthlyPayment = calculateMortgage(principal, rate, years).monthlyPayment;
    
    let balance = principal;
    const schedule = [];
    let totalInterest = 0;
    
    for (let payment = 1; payment <= numberOfPayments; payment++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        
        totalInterest += interestPayment;
        balance -= principalPayment;
        
        schedule.push({
            payment,
            monthlyPayment,
            principalPayment,
            interestPayment,
            totalInterest,
            balance: Math.max(0, balance)
        });
    }
    
    return schedule;
};

// Retirement Calculator
const calculateRetirement = (currentSavings, targetAmount, rate, years) => {
    const monthlyRate = rate / 1200;
    const months = years * 12;
    
    // Calculate required monthly savings
    const futureValue = targetAmount;
    const presentValue = currentSavings;
    
    let monthlyContribution;
    if (monthlyRate === 0) {
        monthlyContribution = (futureValue - presentValue) / months;
    } else {
        monthlyContribution = (futureValue - presentValue * Math.pow(1 + monthlyRate, months)) /
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }
    
    return {
        monthlyContribution,
        totalContributions: monthlyContribution * months + currentSavings,
        totalInterest: targetAmount - (monthlyContribution * months + currentSavings)
    };
};

// Budget Calculator
const calculateBudget = (income, fixedExpenses, variableExpenses) => {
    const totalExpenses = fixedExpenses + variableExpenses;
    const surplus = income - totalExpenses;
    const expenseRatio = (totalExpenses / income) * 100;
    
    return {
        totalExpenses,
        surplus,
        expenseRatio,
        savingsRate: (surplus / income) * 100
    };
};

// Net Worth Calculator
const calculateNetWorth = (assets, liabilities) => {
    const netWorth = assets - liabilities;
    const debtToAssetRatio = (liabilities / assets) * 100;
    
    return {
        netWorth,
        debtToAssetRatio
    };
};

// Emergency Fund Calculator
const calculateEmergencyFund = (monthlyExpenses, months) => {
    const recommendedFund = monthlyExpenses * months;
    const minimumFund = monthlyExpenses * 3;
    const maximumFund = monthlyExpenses * 6;
    
    return {
        recommendedFund,
        minimumFund,
        maximumFund
    };
};

// Debt-to-Income Calculator
const calculateDTI = (monthlyDebt, monthlyIncome) => {
    const dtiRatio = (monthlyDebt / monthlyIncome) * 100;
    const maxRecommendedDebt = monthlyIncome * 0.43; // 43% is typically the highest DTI ratio allowed
    const additionalDebtCapacity = maxRecommendedDebt - monthlyDebt;
    
    return {
        dtiRatio,
        maxRecommendedDebt,
        additionalDebtCapacity
    };
};

// Event Listeners and Form Handling
document.addEventListener('DOMContentLoaded', () => {
    // Mortgage Calculator
    const mortgageForm = document.querySelector('#mortgage form');
    if (mortgageForm) {
        mortgageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const principal = parseFloat(document.getElementById('mortgage-principal').value);
            const rate = parseFloat(document.getElementById('mortgage-rate').value);
            const years = parseFloat(document.getElementById('mortgage-term').value);
            
            if (validateNumber(principal) && validateNumber(rate) && validateNumber(years, 1)) {
                const result = calculateMortgage(principal, rate, years);
                const resultDiv = mortgageForm.querySelector('.result');
                resultDiv.innerHTML = `
                    <div class="result-item">
                        <h4>Monthly Payment:</h4>
                        <p>${formatCurrency(result.monthlyPayment)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Total Payment:</h4>
                        <p>${formatCurrency(result.totalPayment)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Total Interest:</h4>
                        <p>${formatCurrency(result.totalInterest)}</p>
                    </div>
                `;
                resultDiv.style.display = 'block';
            }
        });
    }

    // Compound Interest Calculator
    const compoundForm = document.querySelector('#compound form');
    if (compoundForm) {
        compoundForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const principal = parseFloat(document.getElementById('compound-principal').value);
            const rate = parseFloat(document.getElementById('compound-rate').value);
            const years = parseFloat(document.getElementById('compound-time').value);
            const frequency = parseFloat(document.getElementById('compound-frequency').value);
            const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value || 0);
            
            if (validateNumber(principal) && validateNumber(rate) && 
                validateNumber(years, 1) && validateNumber(frequency, 1)) {
                const result = calculateCompoundInterest(principal, rate, years, frequency, monthlyContribution);
                const resultDiv = compoundForm.querySelector('.result');
                resultDiv.innerHTML = `
                    <div class="result-item">
                        <h4>Final Amount:</h4>
                        <p>${formatCurrency(result.finalAmount)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Total Contributions:</h4>
                        <p>${formatCurrency(result.totalContributions)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Interest Earned:</h4>
                        <p>${formatCurrency(result.interestEarned)}</p>
                    </div>
                `;
                resultDiv.style.display = 'block';
            }
        });
    }

    // Retirement Calculator
    const retirementForm = document.querySelector('#retirement form');
    if (retirementForm) {
        retirementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentSavings = parseFloat(document.getElementById('retirement-current').value);
            const targetAmount = parseFloat(document.getElementById('retirement-target').value);
            const rate = parseFloat(document.getElementById('retirement-rate').value);
            const years = parseFloat(document.getElementById('retirement-years').value);
            
            if (validateNumber(currentSavings) && validateNumber(targetAmount) && 
                validateNumber(rate) && validateNumber(years, 1)) {
                const result = calculateRetirement(currentSavings, targetAmount, rate, years);
                const resultDiv = retirementForm.querySelector('.result');
                resultDiv.innerHTML = `
                    <div class="result-item">
                        <h4>Required Monthly Savings:</h4>
                        <p>${formatCurrency(result.monthlyContribution)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Total Contributions:</h4>
                        <p>${formatCurrency(result.totalContributions)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Investment Returns:</h4>
                        <p>${formatCurrency(result.totalInterest)}</p>
                    </div>
                `;
                resultDiv.style.display = 'block';
            }
        });
    }

    // Emergency Fund Calculator
    const emergencyForm = document.querySelector('#emergency form');
    if (emergencyForm) {
        emergencyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const monthlyExpenses = parseFloat(document.getElementById('monthly-expenses').value);
            const months = parseFloat(document.getElementById('fund-multiplier').value);
            const currentSavings = parseFloat(document.getElementById('current-savings').value || 0);
            
            if (validateNumber(monthlyExpenses) && validateNumber(months)) {
                const result = calculateEmergencyFund(monthlyExpenses, months);
                const resultDiv = emergencyForm.querySelector('.result');
                const additionalNeeded = Math.max(0, result.recommendedFund - currentSavings);
                
                resultDiv.innerHTML = `
                    <div class="result-item">
                        <h4>Recommended Fund:</h4>
                        <p>${formatCurrency(result.recommendedFund)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Minimum Fund (3 months):</h4>
                        <p>${formatCurrency(result.minimumFund)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Additional Savings Needed:</h4>
                        <p>${formatCurrency(additionalNeeded)}</p>
                    </div>
                `;
                resultDiv.style.display = 'block';
            }
        });
    }

    // Budget Calculator
    const budgetForm = document.querySelector('#budget form');
    if (budgetForm) {
        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const income = parseFloat(document.getElementById('budget-income').value);
            const fixedExpenses = parseFloat(document.getElementById('budget-fixed').value);
            const variableExpenses = parseFloat(document.getElementById('budget-variable').value);
            
            if (validateNumber(income) && validateNumber(fixedExpenses) && validateNumber(variableExpenses)) {
                const result = calculateBudget(income, fixedExpenses, variableExpenses);
                const resultDiv = budgetForm.querySelector('.result');
                resultDiv.innerHTML = `
                    <div class="result-item">
                        <h4>Total Expenses:</h4>
                        <p>${formatCurrency(result.totalExpenses)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Monthly Surplus:</h4>
                        <p>${formatCurrency(result.surplus)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Expense Ratio:</h4>
                        <p>${formatPercent(result.expenseRatio)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Savings Rate:</h4>
                        <p>${formatPercent(result.savingsRate)}</p>
                    </div>
                `;
                resultDiv.style.display = 'block';
            }
        });
    }

    // DTI Calculator
    const dtiForm = document.querySelector('#dti form');
    if (dtiForm) {
        dtiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const monthlyDebt = parseFloat(document.getElementById('monthly-debt').value);
            const monthlyIncome = parseFloat(document.getElementById('gross-income').value);
            
            if (validateNumber(monthlyDebt) && validateNumber(monthlyIncome) && monthlyIncome > 0) {
                const result = calculateDTI(monthlyDebt, monthlyIncome);
                const resultDiv = dtiForm.querySelector('.result');
                resultDiv.innerHTML = `
                    <div class="result-item">
                        <h4>DTI Ratio:</h4>
                        <p>${formatPercent(result.dtiRatio)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Maximum Recommended Debt:</h4>
                        <p>${formatCurrency(result.maxRecommendedDebt)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Additional Debt Capacity:</h4>
                        <p>${formatCurrency(result.additionalDebtCapacity)}</p>
                    </div>
                `;
                resultDiv.style.display = 'block';

                // Add color-coded status message
                const dtiStatus = document.createElement('div');
                dtiStatus.className = 'result-item';
                if (result.dtiRatio <= 28) {
                    dtiStatus.innerHTML = `
                        <h4>Status:</h4>
                        <p style="color: var(--accent-color);">Excellent - Your debt level is well-managed</p>
                    `;
                } else if (result.dtiRatio <= 36) {
                    dtiStatus.innerHTML = `
                        <h4>Status:</h4>
                        <p style="color: #38a169;">Good - Your debt level is reasonable</p>
                    `;
                } else if (result.dtiRatio <= 43) {
                    dtiStatus.innerHTML = `
                        <h4>Status:</h4>
                        <p style="color: #d69e2e;">Caution - You're approaching the maximum recommended DTI</p>
                    `;
                } else {
                    dtiStatus.innerHTML = `
                        <h4>Status:</h4>
                        <p style="color: #e53e3e;">Warning - Your debt level is high, consider debt reduction</p>
                    `;
                }
                resultDiv.appendChild(dtiStatus);
            }
        });
    }

    // Currency Converter
    const currencyForm = document.querySelector('#currency form');
    if (currencyForm) {
        currencyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('currency-amount').value);
            const fromCurrency = document.getElementById('currency-from').value;
            const toCurrency = document.getElementById('currency-to').value;
            
            if (validateNumber(amount)) {
                // Note: In a real application, you would fetch real exchange rates from an API
                // For demonstration, we'll use some static rates
                const exchangeRates = {
                    USD: 1,
                    EUR: 0.85,
                    GBP: 0.73,
                    JPY: 110.0,
                    AUD: 1.35,
                    CAD: 1.25,
                    CHF: 0.92,
                    CNY: 6.45,
                    INR: 74.5,
                    NZD: 1.45
                };

                const resultDiv = currencyForm.querySelector('.result');
                const baseAmount = amount / exchangeRates[fromCurrency]; // Convert to USD
                const convertedAmount = baseAmount * exchangeRates[toCurrency]; // Convert to target currency
                
                resultDiv.innerHTML = `
                    <div class="result-item">
                        <h4>Converted Amount:</h4>
                        <p>${new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: toCurrency
                        }).format(convertedAmount)}</p>
                    </div>
                    <div class="result-item">
                        <h4>Exchange Rate:</h4>
                        <p>1 ${fromCurrency} = ${(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} ${toCurrency}</p>
                    </div>
                `;
                resultDiv.style.display = 'block';
            }
        });
    }
});

// Add visual feedback for form inputs
document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
        if (input.checkValidity()) {
            input.classList.remove('invalid');
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
        }
    });
}); 