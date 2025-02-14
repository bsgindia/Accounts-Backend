const BankAccount = require("../models/bank.model");
const FDModel = require("../models/fd.model");
const ReceivableDetails = require("../models/receivabledeatails.model");
const Liability = require("../models/liability.model");

exports.summary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sixMonthsLater = new Date();
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
        const bankResult = await BankAccount.aggregate([
            {
                $group: {
                    _id: null,
                    totalBookBalance: { $sum: "$bookBalance" },
                    totalBankBalance: { $sum: "$bankBalance" }
                }
            }
        ]);
        const fdList = await FDModel.find({
            maturityDate: { $gte: today, $lte: sixMonthsLater }
        }).select("fdNumber connectingAccount fdAdmount maturityAmount maturityDate interestRate");
        const fdTotals = await FDModel.aggregate([
            {
                $facet: {
                    next6Months: [
                        { $match: { maturityDate: { $gte: today, $lte: sixMonthsLater } } },
                        {
                            $group: {
                                _id: null,
                                totalFDAmountNext6Months: { $sum: { $toDouble: "$fdAdmount" } },
                                totalMaturityAmountNext6Months: { $sum: "$maturityAmount" }
                            }
                        }
                    ],
                    allActiveFDs: [
                        { $match: { maturityDate: { $gte: today } } }, // Excluding past maturity
                        {
                            $group: {
                                _id: null,
                                totalFDAmountAll: { $sum: { $toDouble: "$fdAdmount" } },
                                totalMaturityAmountAll: { $sum: "$maturityAmount" }
                            }
                        }
                    ]
                }
            }
        ]);
        const receivableTotals = await ReceivableDetails.aggregate([
            {
                $group: {
                    _id: null,
                    totalReceivableAmount: { $sum: "$receivableAmount" }
                }
            }
        ]);
        const receivableTypeTotals = await ReceivableDetails.aggregate([
            { $unwind: "$receivableType" },
            {
                $group: {
                    _id: "$receivableType",
                    totalAmount: { $sum: "$receivableAmount" }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);
        const liabilityTotals = await Liability.aggregate([
            {
                $group: {
                    _id: null,
                    totalOutstandingLiabilities: { $sum: "$totalOutstanding" }
                }
            }
        ]);
        const liabilityParticularsTotals = await Liability.aggregate([
            { $unwind: "$particulars" },
            {
                $group: {
                    _id: "$particulars",
                    totalLiabilityAmount: { $sum: "$totalOutstanding" }
                }
            },
            { $sort: { totalLiabilityAmount: -1 } }
        ]);
        const totalBookBalance = bankResult.length > 0 ? bankResult[0].totalBookBalance : 0;
        const totalBankBalance = bankResult.length > 0 ? bankResult[0].totalBankBalance : 0;
        const unidentifiedAmount = totalBankBalance - totalBookBalance;
        const totalFDAmountNext6Months = fdTotals[0].next6Months.length > 0 ? fdTotals[0].next6Months[0].totalFDAmountNext6Months : 0;
        const totalMaturityAmountNext6Months = fdTotals[0].next6Months.length > 0 ? fdTotals[0].next6Months[0].totalMaturityAmountNext6Months : 0;
        const totalFDAmountAll = fdTotals[0].allActiveFDs.length > 0 ? fdTotals[0].allActiveFDs[0].totalFDAmountAll : 0;
        const totalMaturityAmountAll = fdTotals[0].allActiveFDs.length > 0 ? fdTotals[0].allActiveFDs[0].totalMaturityAmountAll : 0;
        const totalReceivableAmount = receivableTotals.length > 0 ? receivableTotals[0].totalReceivableAmount : 0;
        const totalOutstandingLiabilities = liabilityTotals.length > 0 ? liabilityTotals[0].totalOutstandingLiabilities : 0;
        const balancePlusInvestment = totalBankBalance + totalFDAmountAll;
        const balancePlusInvestmentPlusReceivable = balancePlusInvestment + totalReceivableAmount;
        const balancePlusInvestmentMinusLiabilities = balancePlusInvestment - totalOutstandingLiabilities;
        const balancePlusInvestmentPlusReceivableMinusLiabilities = balancePlusInvestmentPlusReceivable - totalOutstandingLiabilities;

        return res.status(200).json({
            success: true,
            totalBookBalance,
            totalBankBalance,
            unidentifiedAmount,
            totalFDAmountAll,
            totalMaturityAmountAll,
            totalFDAmountNext6Months,
            totalMaturityAmountNext6Months,
            fdList,
            totalReceivableAmount,
            receivableTypeTotals,
            totalOutstandingLiabilities,
            liabilityParticularsTotals,
            balancePlusInvestment,
            balancePlusInvestmentPlusReceivable,
            balancePlusInvestmentMinusLiabilities,
            balancePlusInvestmentPlusReceivableMinusLiabilities,
        });

    } catch (error) {
        console.error("Error calculating summary:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
