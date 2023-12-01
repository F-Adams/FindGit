// A fucntion to display an error to the user
function displayError(errorCode) {
    const outputDiv = document.getElementById('resultTable');
    const errorDiv = document.createElement('div');
    const errorText = document.createTextNode(`There was an error: ${errorCode}`);
    const backButton = document.createElement('a');
    const backText = document.createTextNode('Go Back');

    errorDiv.classList.add('errorMessage');
    errorDiv.appendChild(errorText);
    outputDiv.appendChild(errorDiv);
    backButton.classList.add('backButton');
    backButton.appendChild(backText);
    errorDiv.appendChild(backButton);

    backButton.addEventListener('click', function (e) {
        e.preventDefault();

        window.history.back();
    });
};

function validName(gitName) {
    const pattern = /^[A-Za-z0-9-]+$/;

    if (pattern.test(gitName)) {
        // Input is valid
        return true;
    } else {
        // Input is invalid
        return false;
    }
}

// Get information that is passed through the quesrysting, only if the form wasn't submitted
let queryString = new URLSearchParams(document.location.search);
let qs = queryString.get('qs');

if (qs) {
    currentPage = queryString.get('page');
    gitUser = queryString.get('gitUser');
    qs = false;
};

let perPage = 30;
let thisPage = 'index.html';

// Add event listeners to the form buttons
const searchButton = document.getElementById('searchButton');
const luckyButton = document.getElementById('luckyButton');

searchButton.addEventListener('click', function (e) {
    e.preventDefault();
    // Get the user-supplied search term from the input box
    let inputField = document.getElementById('gitUser');
    gitUser = inputField.value;
    currentPage = 1;

    if (gitUser !== '' && validName(gitUser)) {
        getData(gitUser, currentPage);
    } else {
        alert('Invalid Username or no username was specified.');
    };

    inputField.value = '';
});

luckyButton.addEventListener('click', function (e) {
    e.preventDefault();

    // Pick a random GitHub user from a predefined array
    let randomNames = ['Amzn', 'Apple', 'AWS', 'Facebook', 'GitHub', 'Google', 'Microsoft', 'Twitter', 'YouTube'];
    let imFeelingLucky = Math.floor(Math.random() * randomNames.length);
    gitUser = randomNames[imFeelingLucky];
    currentPage = 1;
    getData(gitUser, currentPage);
});

// If no page is specified, start at page 1
if (currentPage === null) {
    currentPage = 1;
}

if (gitUser !== '' && validName(gitUser)) {
    getData(gitUser, currentPage);
} else {
    alert('Invalid Username or no username was specified.');
};

async function getData(gitUser, currentPage) {
    let start = Date.now();

    // Base URL for API call
    const baseURL = 'https://api.github.com/users';

    // Get the number of public repos for the specified user
    const userProfile = await fetch(`${baseURL}/${gitUser}`);
    const pageQuery = await userProfile.json();

    if (pageQuery.message === 'Not Found') {
        alert('That username was not found.');
    } else {

        let numRepos = pageQuery.public_repos;

        // Calculate how many pages are needed to show all repos
        const numPages = Math.ceil(numRepos / perPage);

        // Build the paging links
        currentPage = parseInt(currentPage);
        let nextLink = '';
        let prevLink = '';

        firstPage = `${thisPage}?gitUser=${gitUser}&page=1&qs=true`;
        lastPage = `${thisPage}?gitUser=${gitUser}&page=1&qs=true`;

        if (currentPage < numPages) {
            let nextPage = currentPage + 1;
            nextLink = `${thisPage}?gitUser=${gitUser}&page=${nextPage}&qs=true`;
        }
        if (currentPage > 1) {
            let previousPage = currentPage - 1;
            prevLink = `${thisPage}?gitUser=${gitUser}&page=${previousPage}&qs=true`;
        }

        // Get the list of public repos for the specified user
        const searchResults = `${baseURL}/${gitUser}/repos?page=${currentPage}&per_page=${perPage}`;
        const response = await fetch(searchResults);
        const gitQuery = await response.json();
        let timeTaken = Date.now() - start;

        showOutput(gitQuery, timeTaken, nextLink, prevLink);
    };
};

//Build the output table
function showOutput(result, howLong, nextPage, prevPage) {

    // Get the SECTION element, and clear it of any previously generated HTML
    const resultSection = document.getElementById('resultTable');
    resultSection.innerText = '';

    // Create the table and add it to the result section
    const tbl = document.createElement('table');
    tbl.classList.add('resultTable');
    resultSection.appendChild(tbl);

    // Add a caption to the table
    const tblTitle = document.createElement('caption');
    tblTitle.classList.add('tableCaption');
    tblTitle.innerText = `Public Repositories for ${gitUser}`;
    tbl.appendChild(tblTitle);

    // Build the THEAD 
    const tblHead = document.createElement('thead');
    const tblHeadRow = document.createElement('tr');

    let tblHeadCell = document.createElement('th');
    tblHeadCell.innerText = 'Repository Name';
    tblHeadRow.appendChild(tblHeadCell);

    tblHeadCell = document.createElement('th');
    tblHeadCell.innerText = 'Description';
    tblHeadRow.appendChild(tblHeadCell);

    tblHeadCell = document.createElement('th');
    tblHeadCell.innerText = 'URL';
    tblHeadRow.appendChild(tblHeadCell);
    tblHead.appendChild(tblHeadRow);

    // Append the THEAD to the table
    tbl.appendChild(tblHead);

    // Build the TBODY (where the search results are displayed)
    const tblBody = document.createElement('tbody');

    // Build and display the results
    // Initialize a variable to count the repos
    let numRepos = 0;

    for (let i in result) {
        // If no description was given, add a note
        if (result[i].description === null) {
            result[i].description = 'No description has been entered for this repository.';
        }

        // Create the hyperlink for the repository URL
        let htmlLink = document.createElement('a');
        htmlLink.innerText = `${result[i].html_url}`;
        htmlLink.target = '_blank';                             // Make it open in a new window/tab
        htmlLink.href = `${result[i].html_url}`;

        const tblBodyRow = document.createElement('tr');
        let tblBodyCell = document.createElement('td');
        tblBodyCell.innerText = `${result[i].name}`;
        tblBodyRow.appendChild(tblBodyCell);

        tblBodyCell = document.createElement('td');
        tblBodyCell.innerText = `${result[i].description}`;
        tblBodyRow.appendChild(tblBodyCell);

        tblBodyCell = document.createElement('td');
        tblBodyCell.appendChild(htmlLink);
        tblBodyRow.appendChild(tblBodyCell);
        tblBody.appendChild(tblBodyRow);

        // Increment the repo counter
        numRepos++;
    }
    // Append the TBODY to the table
    tbl.appendChild(tblBody);

    // Build the TFOOT
    const tblFooter = document.createElement('tfoot');
    const tblFooterRow = document.createElement('tr');
    const tblFooterCell = document.createElement('td');

    tblFooterCell.classList.add('result');
    tblFooterCell.colSpan = 3;
    tblFooterCell.innerText = `Found ${numRepos} repositories in ${howLong / 1000} seconds`;

    tblFooterRow.appendChild(tblFooterCell);
    tblFooter.appendChild(tblFooterRow);

    // Append the TFOOT to the table
    tbl.appendChild(tblFooter);

    // Write the paging links
    const pagingDiv = document.createElement('div');
    pagingDiv.classList.add('pagingDiv');
    resultSection.appendChild(pagingDiv);

    if (prevPage !== '') {
        const prevPageLink = document.createElement('a');
        const hyperLink = document.createTextNode('< Previous');
        prevPageLink.appendChild(hyperLink);
        prevPageLink.title = '< Previous';
        prevPageLink.href = prevPage;
        pagingDiv.appendChild(prevPageLink);
    } else {
        const noLinkSpan = document.createElement('span');
        const noLinkText = document.createTextNode('<Previous');
        noLinkSpan.appendChild(noLinkText);
        pagingDiv.appendChild(noLinkSpan);
    }

    if (nextPage !== '') {
        const nextPageLink = document.createElement('a');
        const hyperLink = document.createTextNode('Next >');
        nextPageLink.appendChild(hyperLink);
        nextPageLink.title = 'Next >';
        nextPageLink.href = nextPage;
        pagingDiv.appendChild(nextPageLink);
    } else {
        const noLinkSpan = document.createElement('span');
        const noLinkText = document.createTextNode('Next >');
        noLinkSpan.appendChild(noLinkText);
        pagingDiv.appendChild(noLinkSpan);
    }
};