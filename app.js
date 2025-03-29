const { useState, useEffect } = React;

function TransactionForm({ addTransaction }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description && amount) {
      addTransaction({
        description,
        amount: parseFloat(amount),
        type,
        dateTime: new Date(dateTime).getTime(),
      });
      setDescription('');
      setAmount('');
      setType('income');
      setDateTime(new Date().toISOString().slice(0, 16));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-gray-800 rounded-xl space-y-4 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-100 mb-2">Add Transaction</h2>
      <div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 border-none placeholder-gray-400"
          placeholder="Description"
          required
        />
      </div>
      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 border-none placeholder-gray-400"
          placeholder="0.00"
          step="0.01"
          required
        />
      </div>
      <div>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 border-none"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setType('income')}
          className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
            type === 'income' 
              ? 'bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500' 
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <span className="text-lg">↑</span>
          Income
        </button>
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
            type === 'expense' 
              ? 'bg-red-600/20 text-red-400 ring-1 ring-red-500' 
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <span className="text-lg">↓</span>
          Expense
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-gray-100 font-medium py-2.5 px-4 rounded-lg transition-colors"
      >
        Add Transaction
      </button>
    </form>
  );
}

function TransactionList({ transactions, deleteTransaction }) {
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-2">
      {transactions
        .sort((a, b) => b.dateTime - a.dateTime)
        .map((transaction, index) => (
          <div key={index} className="group p-4 bg-gray-800 rounded-lg flex items-center justify-between hover:bg-gray-750 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-1 h-10 rounded-full ${transaction.type === 'income' ? 'bg-indigo-500' : 'bg-red-500'}`} />
              <div>
                <div className="text-gray-100 font-medium">
                  {transaction.description}
                </div>
                <div className="text-xs text-gray-400">
                  {formatDateTime(transaction.dateTime)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${transaction.type === 'income' ? 'text-indigo-400' : 'text-red-400'}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
              <button
                onClick={() => deleteTransaction(index)}
                className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-gray-700 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

function Balance({ balance, totalIncome, totalExpense }) {
  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-lg space-y-4">
      <div className="text-center">
        <div className="text-sm text-gray-400 mb-1">Current Balance</div>
        <h2 className="text-3xl font-bold text-gray-100">${balance.toFixed(2)}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-indigo-600/20">
          <div className="text-xs text-indigo-300 mb-1">Income</div>
          <div className="text-lg font-medium text-indigo-400">+${totalIncome.toFixed(2)}</div>
        </div>
        <div className="p-3 rounded-lg bg-red-600/20">
          <div className="text-xs text-red-300 mb-1">Expense</div>
          <div className="text-lg font-medium text-red-400">-${totalExpense.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

function Filter({ filter, setFilter }) {
  return (
    <div className="max-w-md mx-auto relative">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full px-4 py-2.5 bg-gray-800 text-gray-100 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 pr-8"
      >
        <option value="all">All Transactions</option>
        <option value="income">Income Only</option>
        <option value="expense">Expense Only</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function App() {
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem('transactions')) || []
  );
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const deleteTransaction = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const filteredTransactions = transactions.filter(
    (transaction) => filter === 'all' || transaction.type === filter
  );

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-100 mb-8">
        Expense Tracker
      </h1>

      <Balance balance={balance} totalIncome={totalIncome} totalExpense={totalExpense} />

      <TransactionForm addTransaction={addTransaction} />

      <Filter filter={filter} setFilter={setFilter} />

      <TransactionList transactions={filteredTransactions} deleteTransaction={deleteTransaction} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
