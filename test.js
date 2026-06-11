async function test() {
  console.log('Fetching news list...');
  const res = await fetch('http://localhost:4000/api/v1/news');
  const data = await res.json();
  const articles = data.data;
  console.log(`Found ${articles.length} articles.`);
  
  const nonEspn = articles.filter(a => a.source !== 'editorial' && a.author.name !== 'ESPN Brasil');
  console.log(`Found ${nonEspn.length} non-ESPN articles.`);
  
  if (nonEspn.length > 0) {
    const target = nonEspn[0];
    console.log(`Testing article slug: ${target.slug} (Title: ${target.title})`);
    
    const detailRes = await fetch(`http://localhost:4000/api/v1/news/${target.slug}`);
    const detailData = await detailRes.json();
    
    if (detailData.data) {
      console.log('SUCCESS! Article found by slug.');
    } else {
      console.log('FAIL! Article NOT found by slug.');
      console.log('Response:', detailData);
    }
  }
}
test();
