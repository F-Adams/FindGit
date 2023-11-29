// A function that simply writes information to the console.
function logInfo(info, clearConsole = false) {
    if (info !== '') {
        if (clearConsole === true) {
            console.clear();
        };
        console.log(info);
    };
};

function displayError(errorCode) {
    logInfo('There was an error! ' + errorCode);
};

// Get the search term from the querystring
let searchTerm = new URLSearchParams(document.location.search);
let gitUser = searchTerm.get('gitUser');
let currentPage = searchTerm.get('page');
let perPage = 30;

// If no page is specified, start at page 1
if (currentPage === null) {
    currentPage = 1;
}
logInfo(`Current page: ${currentPage}`);

// If no username was submitted, Show an error, otherwise query the API
if (gitUser === '') {
    displayError('No username was specified.');
    alert('There was an error! No username was specified.');
} else {
    getData(gitUser, currentPage);
};

async function getData(gitUser, currentPage) {
    let start = Date.now();
    logInfo('Starting request...', true);

    // Base URL for API call
    const baseURL = 'https://api.github.com/users';

    // Get the number of public repos for the specified user
    const userProfile = await fetch(`${baseURL}/${gitUser}`);
    const pageQuery = await userProfile.json();

    if (pageQuery.message === 'Not Found') {
        displayError('Username was not found.');
        alert(pageQuery.message);
    } else {

        let numRepos = pageQuery.public_repos;
        logInfo(`Number of Repos: ${pageQuery.public_repos}`);

        // Calculate how many pages are needed to show all repos
        const numPages = Math.ceil(numRepos / perPage);
        logInfo(`Number of pages: ${numPages}`);

        // Build the paging links
        currentPage = parseInt(currentPage);
        logInfo(`Current page: ${currentPage}`);
        let nextLink = '';
        let prevLink = '';

        if (currentPage < numPages) {
            let nextPage = currentPage + 1;
            nextLink = `search.html?gitUser=${gitUser}&page=${nextPage}&per_page=${perPage}`;
            logInfo(`Next page: ${nextLink}`);
        }
        if (currentPage > 1) {
            let previousPage = currentPage - 1;
            prevLink = `search.html?gitUser=${gitUser}&page=${previousPage}&per_page=${perPage}`;
            logInfo(`Previous page: ${prevLink}`);
        }

        // Get the list of public repos for the specified user
        const searchResults = `${baseURL}/${gitUser}/repos?page=${currentPage}&per_page=${perPage}`;
        logInfo(`Sending query to ${searchResults}`);

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
        const noLink = document.createElement('span');
        pagingDiv.appendChild(noLink);
    }

    if (nextPage !== '') {
        const nextPageLink = document.createElement('a');
        const hyperLink = document.createTextNode('Next >');
        nextPageLink.appendChild(hyperLink);
        nextPageLink.title = 'Next >';
        nextPageLink.href = nextPage;
        pagingDiv.appendChild(nextPageLink);
    } else {
        const noLink = document.createElement('span');
        pagingDiv.appendChild(noLink);
    }

    // Log some information the the console
    logInfo(`Total time taken: ${howLong} milliseconds for ${numRepos} repos for GitHub user: ${gitUser}`);

    // All generated HTML is output to the console, for QA purposes
    logInfo(tbl);
};