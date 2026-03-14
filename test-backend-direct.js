async function testBackend() {
    const url = 'http://localhost:5000/api/users';
    console.log(`Trying to fetch from Backend Direct: ${url}`);
    try {
        const response = await fetch(url);
        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log('Body:', text.substring(0, 100));
    } catch (error) {
        console.log('❌ Connection Error:', error.message);
    }
}

testBackend();
