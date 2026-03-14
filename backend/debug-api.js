require('dotenv').config(); // Load .env from current directory handles it usually if in root of project
const { footballApi } = require('./src/services/footballApi');

async function testApi() {
    console.log('🔑 API Key env var present:', !!process.env.FOOTBALL_API_KEY);
    console.log('🔎 Testing Football API...');

    try {
        console.log('\n--- Fetching Leagues (World, 2023) ---');
        // Try a broader search first
        let leagues = await footballApi.getLeagues(null, '2023');
        if (leagues && leagues.response && leagues.response.length > 0) {
            console.log(`✅ Leagues found: ${leagues.response.length}`);
            console.log('Sample:', leagues.response[0].league.name);
        } else {
            console.log('⚠️ No leagues found for 2023, trying 2024...');
            leagues = await footballApi.getLeagues(null, '2024');
            if (leagues.response && leagues.response.length > 0) {
                console.log(`✅ Leagues found (2024): ${leagues.response.length}`);
            } else {
                console.log('❌ No leagues data returned even for 2024');
                console.log('Full Response Dump:', JSON.stringify(leagues, null, 2));
            }
        }

        console.log('\n--- Fetching Teams (League 39, 2023) ---');
        const teams = await footballApi.getTeams(39, '2023');
        if (teams && teams.response) {
            console.log(`✅ Teams found: ${teams.response.length}`);
            if (teams.response.length > 0) {
                console.log('Sample:', teams.response[0].team.name);
            } else {
                console.log('❌ Response empty. Errors:', JSON.stringify(teams.errors, null, 2));
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
