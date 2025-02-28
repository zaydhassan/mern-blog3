// Path: /scripts/populateReward.js
const Reward = require('../models/rewardModel'); // Adjust the path as necessary
const rewards = [
    { name: '10% Off Coupon', description: 'Get 10% off on your next purchase.', costInPoints: 100 },
    { name: 'Free E-book', description: 'Redeem for a free e-book of your choice.', costInPoints: 200 }
];

async function populateRewards() {
    try {
        await Reward.deleteMany(); // Clears existing rewards
        await Reward.insertMany(rewards);
        console.log('Rewards have been populated!');
    } catch (error) {
        console.error('Failed to populate rewards:', error);
    }
}

module.exports = populateRewards;
