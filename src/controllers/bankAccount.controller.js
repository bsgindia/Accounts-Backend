const BankAccount = require("../models/bank.model");
const Transaction = require("../models/transaction.model");
exports.registerBankAccount = async (req, res) => {
  try {
    const {
      accountName,
      accountNumber,
      bankName,
      branchName,
      accountType,
      bookBalance,
      bankBalance,
      status,
      routingNumberOrIFSC,
      openingDate,
      contactPerson,
      notes,
    } = req.body;
    const existingAccount = await BankAccount.findOne({ accountNumber });
    if (existingAccount) {
      return res.status(400).json({ message: "Account with this number already exists" });
    }

    const newBankAccount = new BankAccount({
      accountName,
      accountNumber,
      bankName,
      branchName,
      accountType: accountType?.toUpperCase(),
      bookBalance,
      bankBalance,
      status: status?.toUpperCase(),
      routingNumberOrIFSC,
      openingDate,
      contactPerson,
      notes,
    });
    await newBankAccount.save();
    res.status(201).json({ message: "Bank account registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering bank account", error });
  }
};

exports.getAllBankAccounts = async (req, res) => {
  try {
    const bankAccounts = await BankAccount.find({}, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 });
    if (bankAccounts.length === 0) {
      return res.status(404).json({ message: "No bank accounts found" });
    }
    const groupedAccounts = bankAccounts.reduce((acc, account) => {
      const { bankName } = account;
      if (!acc[bankName]) {
        acc[bankName] = [];
      }
      acc[bankName].push(account);
      return acc;
    }, {});
    const bankNamesWithAccounts = Object.keys(groupedAccounts).map((bankName) => {
      return {
        bankName,
        accounts: groupedAccounts[bankName],
        totalBookBalance: groupedAccounts[bankName].reduce((sum, account) => sum + (account.bookBalance || 0), 0),
        totalBankBalance: groupedAccounts[bankName].reduce((sum, account) => sum + (account.bankBalance || 0), 0),
      };
    });
    res.status(200).json({ bankNamesWithAccounts });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving bank accounts", error });
  }
};


exports.updateBankAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const updateData = req.body;
    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No fields provided for update" });
    }
    if (updateData.accountType) {
      updateData.accountType = updateData.accountType.toUpperCase();
    }
    if (updateData.status) {
      updateData.status = updateData.status.toUpperCase();
    }
    const updatedAccount = await BankAccount.findOneAndUpdate(
      { accountNumber: accountId },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedAccount) {
      return res.status(404).json({ message: "Bank account not found" });
    }
    res.status(200).json({ message: "Bank account updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating bank account", error });
  }
};


exports.getTotalBalances = async (req, res) => {
  try {
    const bankAccounts = await BankAccount.find({}, { bookBalance: 1, bankBalance: 1 });
    const totalBookBalance = bankAccounts.reduce((sum, account) => sum + (account.bookBalance || 0), 0);
    const totalBankBalance = bankAccounts.reduce((sum, account) => sum + (account.bankBalance || 0), 0);
    const totalCombinedBalance = totalBookBalance + totalBankBalance;
    res.status(200).json({
      totalBookBalance,
      totalBankBalance,
      totalCombinedBalance,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving total balances", error });
  }
};



exports.getaccountNumber = async (req, res) => {
  try {
    const bankAccounts = await BankAccount.find({}, { accountNumber: 1 });
    res.status(200).json({
      accounts: bankAccounts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving account numbers", error });
  }
};




exports.registerdailytransition = async (req, res) => {
  try {
    const transactions = req.body.data;
    console.log("Received transactions:", transactions);

    for (let transaction of transactions) {
      const { date, accountNumber, debit, credit, particular } = transaction;
      const account = await BankAccount.findOne({ accountNumber });

      if (!account) {
        console.log(`❌ Account ${accountNumber} not found.`);
        return res.status(404).json({ message: `Account ${accountNumber} not found` });
      }

      // Capture bookBalance before transaction
      const balanceBeforeTransaction = account.bookBalance;
      let balanceAfterTransaction = balanceBeforeTransaction; // Start with the same value
      let operationType = ""; // To store which operation is performed

      // Process transaction (update only bookBalance)
      if (debit > 0 && credit === 0) {
        balanceAfterTransaction += debit;
        operationType = `✅ Debit of ${debit} performed on account ${accountNumber}`;
      } else if (debit === 0 && credit > 0) {
        if (balanceBeforeTransaction < credit) {
          console.log(`❌ Insufficient book balance for account ${accountNumber}`);
          return res.status(400).json({ message: `Insufficient book balance for account ${accountNumber}` });
        }
        balanceAfterTransaction -= credit;
        operationType = `✅ Credit of ${credit} performed on account ${accountNumber}`;
      } else {
        console.log(`⚠️ Invalid transaction: Both debit and credit cannot be nonzero.`);
        return res.status(400).json({ message: `Invalid transaction: Both debit and credit cannot be nonzero.` });
      }

      // Update account bookBalance only once
      account.bookBalance = balanceAfterTransaction;
      await account.save();

      // Log the operation in the console
      console.log(operationType);
      console.log(`🔹 Balance before: ${balanceBeforeTransaction}, Balance after: ${balanceAfterTransaction}`);

      // Save the transaction with the correct balances
      const newTransaction = new Transaction({
        date,
        particular,
        accountNumber,
        debit,
        credit,
        transactionType: debit > 0 ? "debit" : "credit",
        balanceBeforeTransaction, // Remains unchanged from the beginning
        balanceAfterTransaction, // Final updated value
        status: "completed",
      });

      console.log("📌 Transaction saved:", newTransaction);
      await newTransaction.save();
    }

    res.status(200).json({ message: "Bank transactions processed and saved successfully" });
  } catch (error) {
    console.error("❌ Error processing transactions:", error);
    res.status(500).json({ message: "Error processing bank transactions", error: error.message });
  }
};






exports.getDailyTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    let searchQuery = {};

    if (search) {
      const dateInput = new Date(search);
      if (!isNaN(dateInput.getTime())) {
        searchQuery.date = {
          $gte: new Date(dateInput.setHours(0, 0, 0, 0)),
          $lt: new Date(dateInput.setHours(23, 59, 59, 999)),
        };
      }
    }
    const totalTransactions = await Transaction.countDocuments(searchQuery);
    const transactions = await Transaction.find(searchQuery, {
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    })
      .sort({ date: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
    const totalPages = Math.ceil(totalTransactions / limitNumber);
    res.status(200).json({
      totalTransactions,
      totalPages,
      currentPage: pageNumber,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
};




