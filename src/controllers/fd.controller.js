const FDModel = require('../models/fd.model');
const cron = require("node-cron");
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "noreplybsgshop@gmail.com",
      pass: "nnhw orgt yksn rger",
    },
  });

  const checkAndSendMaturityEmails = async () => {
    try {
        console.log("Cron Job Starting")
        const today = new Date();
        const todayDateOnly = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())); 
      const result = await FDModel.aggregate([
        {
          $match: { maturityDate: { $gt: todayDateOnly } }
        }
      ]);
  
      console.log(result);
  
      for (const fd of result) {
        console.log(todayDateOnly)
  
        const maturityDate = new Date(fd.maturityDate);
        console.log("maturityDate",maturityDate)
        const timeDiff = Math.ceil((maturityDate - todayDateOnly) / (1000 * 60 * 60 * 24));
        console.log(timeDiff)
        const sendEmail = async (fd) => {
          const mailOptions = {
            from: "noreplybsgshop@gmail.com",
            to: "accounts@bsgindia.org",
            subject: `Reminder: Your FD (${fd.fdNumber}) Maturity is Approaching`,
            html: `
              <html>
                <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); padding: 30px;">
                    <h2 style="color: #007bff; text-align: center;">FD Maturity Reminder</h2>
                    <p style="font-size: 16px; text-align: center;">Dear Investor,</p>
                    <p style="font-size: 16px;">
                      We would like to remind you that your Fixed Deposit (FD) <strong>(${fd.fdNumber})</strong> will mature on <strong>${fd.maturityDate}</strong>.
                    </p>
                    
                    <h3 style="color: #007bff;">FD Details:</h3>
                    <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">FD Number</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${fd.fdNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Connecting Account</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${fd.connectingAccount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Principal Amount</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${fd.principalAmount.map(item => item.amount).join(', ')}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">FD Amount</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${fd.fdAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Start Date</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${new Date(fd.startDate).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Maturity Date</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${new Date(fd.maturityDate).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Interest Rate</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${fd.interestRate}%</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Maturity Amount</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${fd.maturityAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Renewal Status</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${fd.renewalStatus}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Locking Period</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${fd.lockingPeriod}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Remarks</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${fd.remarks}</td>
                      </tr>
                    </table>
      
                    <p style="font-size: 16px; margin-top: 20px;">
                      This is a reminder of your FD maturity. Please ensure you take necessary actions accordingly.
                    </p>
                    <div style="text-align: center;">
                      <p style="font-size: 16px; color: #555;">Regards,</p>
                      <p style="font-size: 16px; color: #555;">Your Bank</p>
                    </div>
                    <div style="background-color: #007bff; color: #fff; text-align: center; padding: 10px; margin-top: 30px; border-radius: 5px;">
                      <p style="font-size: 14px;">This is an automated email. Please do not reply.</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          };
          
          try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent for FD ${fd.fdNumber}`);
          } catch (error) {
            console.error(`Error sending email for FD ${fd.fdNumber}:`, error);
          }
        };
        if (timeDiff === 30 || timeDiff === 15 || timeDiff === 0) {
          await sendEmail(fd);
        }
      }
    } catch (error) {
      console.error("Error running FD maturity email check:", error);
    }
  };
  
  

exports.startCronJob = () => {
    cron.schedule("30 5 * * *", checkAndSendMaturityEmails);
    // setInterval(checkAndSendMaturityEmails, 1000);
    console.log("Cron job scheduled to run every minute.");
};




exports.registerFD = async (req, res) => {
    const {
        fdNumber,
        connectingAccount,
        principalAmount,
        fdAdmount,
        startDate,
        maturityDate,
        interestRate,
        maturityAmount,
        interestEarned,
        renewalStatus,
        lockingPeriod,
        remarks,
    } = req.body;
    if (
        !fdNumber ||
        !connectingAccount ||
        !principalAmount ||
        !startDate ||
        !maturityDate ||
        !interestRate ||
        !maturityAmount ||
        !lockingPeriod
    ) {
        return res.status(400).json({ message: 'All required fields must be provided.' });
    }
    try {
        const existingFD = await FDModel.findOne({ fdNumber });
        if (existingFD) {
            return res.status(400).json({ message: 'FD with this number already exists.' });
        }
        const fd = new FDModel({
            fdNumber,
            connectingAccount,
            principalAmount,
            fdAdmount,
            startDate,
            maturityDate,
            interestRate,
            maturityAmount,
            interestEarned,
            renewalStatus,
            lockingPeriod,
            remarks,
        });
        await fd.save();
        res.status(201).json({
            message: 'FD registered successfully',
            fd,
        });
    } catch (error) {
        console.error('Error registering FD:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};




exports.getAllFDs = async (req, res) => {

    try {
        const fds = await FDModel.find({});
        if (fds.length === 0) {
            return res.status(404).json({ message: 'No FDs found' });
        }
        res.status(200).json({
            message: 'All FD details fetched successfully',
            fds,
        });
    } catch (error) {
        console.error('Error fetching FD details:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getAllFDAmount = async (req, res) => {
    try {
        const today = new Date();
        const todayDateOnly = new Date(today.setHours(0, 0, 0, 0));
        const result = await FDModel.aggregate([
            {
                $match: { maturityDate: { $gt: todayDateOnly } }
            },
            {
                $project: {
                    fdAdmount: { $toDouble: "$fdAdmount" },
                    maturityAmount: { $toDouble: "$maturityAmount" }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$fdAdmount" },
                    totalMaturityAmount: { $sum: "$maturityAmount" }
                }
            }
        ]);
        const totalAmount = result.length > 0 ? result[0].totalAmount : 0;
        const totalMaturityAmount = result.length > 0 ? result[0].totalMaturityAmount : 0;
        res.status(200).json({
            message: 'All FD details fetched successfully',
            totalAmount,
            totalMaturityAmount
        });
    } catch (error) {
        console.error('Error fetching FD details:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};




exports.updateFDByNumber = async (req, res) => {
    const { fdNumber } = req.params;
    const updateData = req.body;
    if (!fdNumber) {
        return res.status(400).json({ message: 'FD number must be provided.' });
    }
    try {
        const existingFD = await FDModel.findOne({ fdNumber });
        if (!existingFD) {
            return res.status(404).json({ message: 'FD with this number does not exist.' });
        }
        const updatedFD = await FDModel.findOneAndUpdate(
            { fdNumber },
            { $set: updateData },
            { new: true, runValidators: true }
        );
        res.status(200).json({
            message: 'FD updated successfully',
            updatedFD,
        });
    } catch (error) {
        console.error('Error updating FD:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.getFundSums = async (req, res) => {
    try {
        const result = await FDModel.aggregate([
            { $unwind: "$principalAmount" },
            {
                $group: {
                    _id: "$principalAmount.fund",
                    totalAmount: { $sum: "$principalAmount.amount" }
                }
            }
        ]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'No funds found.' });
        }

        res.status(200).json({
            message: 'Sum of all funds fetched successfully',
            result
        });
    } catch (error) {
        console.error('Error fetching sum of funds:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getFundsByName = async (req, res) => {
    try {
        const { fundName } = req.query;

        if (!fundName) {
            return res.status(400).json({ error: "Fund name is required" });
        }

        const funds = await FDModel.aggregate([
            { $unwind: "$principalAmount" },
            { $match: { "principalAmount.fund": fundName } },
            {
                $project: {
                    _id: 0,
                    fdNumber: 1,
                    "principalAmount.fund": 1,
                    "principalAmount.amount": 1
                }
            }
        ]);

        res.status(200).json(funds);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
