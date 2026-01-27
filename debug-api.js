require('dotenv').config({ path: './backend/.env' });
const { footballApi } = require('./backend/src/services/footballApi');

async function testApi() {
    console.log('🔑 API Key present:', !!process.env.FOOTBALL_API_KEY);
    console.log('🔎 Testing Football API...');

    try {
        console.log('\n--- Fetching Leagues (World, 2023) ---');
        // Try a broader search first
        const leagues = await footballApi.getLeagues(null, '2023');
        if (leagues && leagues.response) {
            console.log(`✅ Leagues found: ${leagues.response.length}`);
            if (leagues.response.length > 0) {
                console.log('Sample:', leagues.response[0].league.name);
            }
        } else {
            console.log('❌ No leagues data returned', leagues);
        }

        console.log('\n--- Fetching Teams (League 39 (Premier League), 2023) ---');
        const teams = await footballApi.getTeams(39, '2023');
        if (teams && teams.response) {
            console.log(`✅ Teams found: ${teams.response.length}`);
            if (teams.response.length > 0) {
                console.log('Sample:', teams.response[0].team.name);
            }
        } else {
            console.log('❌ No teams data returned', teams);
        }

    } catch (error) {
        console.error('❌ FATAL ERROR:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
        }
    }
}

testApi();
