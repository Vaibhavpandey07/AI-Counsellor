let url  = 'https://api.worqnow.ai/education/nl/universities/aeres'
let url2 = "https://api.worqnow.ai/education/nl/entry-requirements?university_code=hva"

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("API Response:", data.data.courses

    );
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });
