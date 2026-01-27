async function testProxy() {
    const url = 'http://localhost:3000/api/users';
    console.log(`Trying to fetch from Frontend Proxy: ${url}`);
    try {
        const response = await fetch(url);
        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        if (response.ok) {
            console.log('✅ Proxy SUCCESS! Data received.');
            console.log(text.substring(0, 100));
        } else {
            console.log('❌ Proxy FAILED.');
            if (text.includes('This page could not be found') || response.status === 404) {
                console.log('Reason: 404 Not Found (Proxy not active)');
            } else {
                console.log('Reason:', text.substring(0, 200));
            }
        }
    } catch (error) {
        console.log('❌ Connection Error:', error.message);
    }
}

testProxy();
