/**
 * Parses a single comic element and returns a comic object.
 * @param {HTMLAnchorElement} link 
 * @returns {Object|null}
 */
export function parseComic(link) {
  try {
    // Traverse up to find the main container row (table with id AuctionTable or AuctionTableOdd)
    const rowTable = link.closest('table[id^="AuctionTable"]');
    if (!rowTable) return null;

    // The item info is in the first TD, auction details in the second TD
    const tds = rowTable.querySelectorAll(':scope > tbody > tr > td');
    if (tds.length < 2) return null;

    const infoTd = tds[0];
    const detailsTd = tds[1];

    // Extract Item ID from the link
    const urlParams = new URLSearchParams(link.search);
    const itemId = urlParams.get('id') || urlParams.get('itemid');

    // Title is already provided by link.innerText
    const title = link.innerText.trim();

    // Grade and Notes are in the infoTd
    // Structure: <p><b><a>Title</a></b><br><strong>Grade</strong><br><span>...</span><br>...<p>Notes</p>
    const gradeElem = infoTd.querySelector('strong');
    let grade = null;
    if (gradeElem) {
      const fullGradeText = gradeElem.innerText.trim();
      
      // Match pattern like "[PROVIDER] [GRADE]" 
      // Provider: 3-10 uppercase letters
      // Grade: digits and dots
      const match = fullGradeText.match(/^([A-Z]{3,10})\s*([\d.]+)/i);
      
      if (match) {
        grade = {
          provider: match[1].toUpperCase(),
          grade: parseFloat(match[2])
        };
      } else {
        // Fallback: search for any 3-10 letter uppercase string and any number separately
        const providerMatch = fullGradeText.match(/[A-Z]{3,10}/i);
        const scoreMatch = fullGradeText.match(/[\d.]+/);
        
        grade = {
          provider: providerMatch ? providerMatch[0].toUpperCase() : 'UNKNOWN',
          grade: scoreMatch ? parseFloat(scoreMatch[0]) : fullGradeText
        };
      }
    }

    // Notes are typically in the second <p> tag within the info area
    const pTags = infoTd.querySelectorAll('p');
    let notes = null;
    let year = null;
    if (pTags.length > 1) {
      notes = pTags[1].innerText.trim();
      
      // Try to extract a 4-digit year between 1900 and 2099 from notes or title
      // Usually years in comics are in parentheses or after the title, but notes often have it.
      const yearMatch = (notes + ' ' + title).match(/\b(19\d{2}|20\d{2})\b/);
      if (yearMatch) {
        year = yearMatch[1];
      }
    }

    // Current Price is in detailsTd within a span with id CurrentBid_ID
    const priceElem = detailsTd.querySelector(`span[id^="CurrentBid_"]`);
    const currentPrice = priceElem ? priceElem.innerText.trim() : null;

    // End Time is in detailsTd
    // We look for the cell following the "Ends:" label
    let endTime = null;
    let startTimeElem = null;
    const allTds = detailsTd.querySelectorAll('td');
    for (let i = 0; i < allTds.length; i++) {
      if (allTds[i].innerText.includes('Starts:')) {
        startTimeElem = allTds[i + 1];
      }
      if (allTds[i].innerText.includes('Ends:')) {
        if (allTds[i + 1]) {
          endTime = allTds[i + 1].innerText.trim();
        }
      }
    }

    // Check if ended
    // In preview mode, it usually shows "Time Left". If it's missing or says "Ended", it's ended.
    const timeLeftElem = detailsTd.querySelector('.CountDown');
    const ended = timeLeftElem ? timeLeftElem.innerText.includes('Ended') : true;

    return {
      itemId: itemId,
      title: title,
      link: link.href,
      grade: grade,
      notes: notes,
      year: year,
      ended: ended,
      endTime: endTime,
      currentPrice: currentPrice,
      startTimeElem: startTimeElem
    };
  } catch (err) {
    console.error('Error parsing comic:', err);
    return null;
  }
}

/**
 * Scrapes all comics on the page based on the provided selector.
 * @returns {Array} List of scraped comics
 */
export function scrapePage() {
  if (!window.location.pathname.toLowerCase().includes('/auctions/preview.asp') && 
      !window.location.pathname.toLowerCase().includes('/auctions/search.asp')) {
    return [];
  }

  // The selector provided by the user
  const elements = document.querySelectorAll('#auctionData table table p b a');
  const comics = [];

  elements.forEach((link) => {
    const comic = parseComic(link);
    if (comic) {
      comics.push(comic);
    }
  });

  return comics;
}
