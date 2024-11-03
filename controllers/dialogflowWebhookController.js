const dialogflowWebhookController = (req, res) => {
    // Extract the question from the request body
    const question = req.body.question;
    if (!question) {
        return res.status(400).json({ error: 'Question is required in the request body.' });
    }
  
    // Map the question to an intent name
    let intentName;
    switch (question.toLowerCase()) {
        case 'how do i rent an item?':
            intentName = 'How do I rent an item?';
            break;
        case 'what payment methods do you accept?':
            intentName = 'What payment methods do you accept?';
            break;
        case 'how do i return an item?':
            intentName = 'How do I return an item?';
            break;
        case 'can i change my rental dates?':
            intentName = 'Can I change my rental dates?';
            break;
        case 'do you have customer support?':
            intentName = 'Do you have customer support?';
            break;
        case 'what happens if an item is damaged?':
            intentName = 'What happens if an item is damaged?';
            break;
        default:
            intentName = 'Unknown';
            break;
    }
  
    // Respond based on intent name
    switch (intentName) {
        case 'How do I rent an item?':
            res.json({
                Response: 'To rent an item, go to our item listings, find the item you want, and make sure it’s available for your dates. Then, make a rental request for the serial number of the item. The owner will respond, and if approved, you’ll need to make payment. Feel free to ask questions anytime!',
            });
            break;
  
        case 'What payment methods do you accept?':
            res.json({
                Response: 'We accept various payment methods including PayPal, On delivery, and by Reflict. Choose the method that is convenient for you during checkout.',
            });
            break;
  
        case 'How do I return an item?':
            res.json({
                Response: 'To return an item, go to your rental history, select the item, and follow the instructions to start the return process. Ensure the item is in its original condition to avoid extra charges.',
            });
            break;
  
        case 'Can I change my rental dates?':
            res.json({
                Response: 'Yes, you can change rental dates if the item is available for your new dates. Please contact the owner through your rental request page to make the changes.',
            });
            break;
  
        case 'Do you have customer support?':
            res.json({
                Response: 'Yes, we offer customer support! Reach us via email at support@example.com or through our help center on the website.',
            });
            break;
  
        case 'What happens if an item is damaged?':
            res.json({
                Response: 'If an item is damaged during your rental period, inform the owner and assess the damage. You may need to cover repair or replacement costs. Refer to our rental agreement for details.',
            });
            break;
  
        default:
            res.json({ Response: 'Sorry, I did not understand that.' });
            break;
    }
  };
  
  module.exports = dialogflowWebhookController;
  