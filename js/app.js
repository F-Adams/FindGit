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

// Set up some configuration options
let perPage = 30;
let thisPage = 'index.html';
let genericDescription = 'No description has been given for this repository. View it on Guthub for additional information.';

// Assign necessary elements to constants
const searchButton = document.getElementById('searchButton');
const luckyButton = document.getElementById('luckyButton');
const searchForm = document.getElementById('searchForm');
const inputField = document.getElementById('gitUser');

// Set the copyright year to the current year
const copySpan = document.getElementById('copyRight');
const d = new Date();
let year = d.getFullYear();
copySpan.innerText += `${year} - FrankAdams.dev`;

// Get information that is passed through the quesrysting, only if the form wasn't submitted
let queryString = new URLSearchParams(document.location.search);
let qs = queryString.get('qs');

// If there is a querystring, get the page and username from it
if (qs) {
    let currentPage = queryString.get('page');
    gitUser = queryString.get('gitUser');
    qs = false;

    // If a valid search term is supplied, get the requested data, otherwise alert the user
    if (gitUser !== '' && validName(gitUser)) {
        getData(gitUser, currentPage);
    } else {
        alert('Invalid Username or no username was specified.');
    };
};

// Handle the submitted search form
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    gitUser = inputField.value;
    let currentPage = 1;

    if (gitUser !== '' && validName(gitUser)) {
        getData(gitUser, currentPage);
    } else {
        alert('Invalid Username or no username was specified.');
    };

    inputField.value = '';
});

// Process the random search button
luckyButton.addEventListener('click', function (e) {
    e.preventDefault();

    // Pick a random GitHub user from a predefined array
    let randomNames = ['Amzn', 'Apple', 'AWS', 'Facebook', 'GitHub', 'Google', 'Microsoft', 'Twitter', 'YouTube'];
    let imFeelingLucky = Math.floor(Math.random() * randomNames.length);
    gitUser = randomNames[imFeelingLucky];
    let currentPage = 1;
    getData(gitUser, currentPage);
});

// This function perfomrs the actual API call
async function getData(gitUser, currentPage) {
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
        lastPage = `${thisPage}?gitUser=${gitUser}&page=${numPages}&qs=true`;

        if (currentPage < numPages) {
            let nextPage = currentPage + 1;
            nextLink = `${thisPage}?gitUser=${gitUser}&page=${nextPage}&qs=true`;
        }
        if (currentPage > 1) {
            let previousPage = currentPage - 1;
            prevLink = `${thisPage}?gitUser=${gitUser}&page=${previousPage}&qs=true`;
        }

        // Get the list of public repos for the specified user
        const getRepos = `${baseURL}/${gitUser}/repos?page=${currentPage}&per_page=${perPage}`;
        const response = await fetch(getRepos);
        const gitQuery = await response.json();

        showOutput(gitQuery, nextLink, prevLink);
    };
};

//This funtion builds the output table
function showOutput(result, nextPage, prevPage) {

    // Get the SECTION element, and clear it of any previously generated HTML
    const resultSection = document.getElementById('resultSection');
    resultSection.innerText = '';

    // Add a title caption to the result section
    const resultTitle = document.createElement('span');
    resultTitle.classList.add('resultTitle');
    resultTitle.innerText = `Public Repositories for ${gitUser}`;
    resultSection.appendChild(resultTitle);

    // Build and display the output
    for (let i in result) {
        // If no description was given for this repo, insert a generic one
        if (result[i].description === null) {
            result[i].description = genericDescription;
        }

        // Each search result is an article element
        const article = document.createElement('article');
        article.classList.add('searchResults')
        resultSection.appendChild(article);

        // Build the article header
        const repoHeader = document.createElement('header');
        repoHeader.classList.add('searchHeader')

        const repoName = document.createElement('span');
        repoName.classList.add('repoName');
        repoName.innerText = result[i].name;

        const repoStars = document.createElement('span');
        repoStars.classList.add('repoStars');
        repoStars.innerText = result[i].stargazers_count;
        const starImg = document.createElement('img');
        starImg.src = 'img/star.png';
        repoStars.append(starImg);

        // Append the header elements to the article
        repoHeader.appendChild(repoName);
        repoHeader.appendChild(repoStars);
        article.appendChild(repoHeader);

        // Build the description section
        const repoSection = document.createElement('section')
        repoSection.classList.add('repoInfo');

        // Create the hyperlink for the repository URL
        const repoURL = document.createElement('a');
        repoURL.classList.add('repoURL');
        repoURL.innerText = result[i].html_url;
        repoURL.target = '_blank';
        repoURL.href = result[i].html_url;

        const viewLink = document.createElement('a');
        viewLink.classList.add('viewLink');
        viewLink.innerText = 'View on Github';
        viewLink.href = result[i].html_url;

        // Add the repo description
        const repoDescription = document.createElement('span');
        repoDescription.classList.add('repoDescription');
        repoDescription.innerText = result[i].description;

        // Append the new elements to the description section
        repoSection.appendChild(repoURL);
        repoSection.appendChild(viewLink);
        repoSection.appendChild(repoDescription);

        // Append the description section to the article
        article.appendChild(repoSection);

        // Build the article footer
        const articleFooter = document.createElement('footer');
        articleFooter.classList.add('repoTags')

        // Iterate through the list of tags, if any. If no tags exist, add "Github" as a lone tag
        let tags = result[i].topics;

        if (tags.length > 0) {
            for (let topic in tags) {
                const repoTag = document.createElement('span');
                repoTag.classList.add('tag')
                repoTag.innerText = tags[topic];
                articleFooter.appendChild(repoTag);
            }
        };

        // Add the repo owner as a topic in the tag list if it doesn't already exist in the list
        const tagIndex = tags.indexOf(result[i].owner.login);
        const tagExists = tagIndex !== -1 ? true : false;

        if (!tagExists) {
            const repoTag = document.createElement('span');
            repoTag.classList.add('tag')
            repoTag.innerText = result[i].owner.login;
            articleFooter.appendChild(repoTag);
        }

        // Append the article footer to the article
        article.appendChild(articleFooter);
    };

    // Write the paging links
    const pagingDiv = document.createElement('div');
    pagingDiv.classList.add('pagingDiv');
    resultSection.appendChild(pagingDiv);

    if (prevPage !== '') {
        const prevPageLink = document.createElement('a');
        const hyperLink = document.createTextNode('< Previous');
        prevPageLink.appendChild(hyperLink);
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
        nextPageLink.href = nextPage;
        pagingDiv.appendChild(nextPageLink);
    } else {
        const noLinkSpan = document.createElement('span');
        const noLinkText = document.createTextNode('Next >');
        noLinkSpan.appendChild(noLinkText);
        pagingDiv.appendChild(noLinkSpan);
    };
};