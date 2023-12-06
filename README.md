# FindGit

This is a simple application to list all public repositories for a specified Github user. This project was designed to mimic the visial style and feel of the Google home page.
This is not a Google search page! Instead, it simply utilizes the GitHub API to search for a GitHub username specified by the user.  The input is validated using a
regular expression to ensure that the entered search term conforms to current GitHub username format. In this case, alphanumeric characters and a dash are the only allowerd characters
in a GitHub username, and the RegEx pattern is utilized to ensure that the user input is safe to pass to the API.

This application was developed as my final Capstone project for the Code: You Web Development pathway.

## Project Requirements
There are several requirements which needed to be met for this project to obtain a passing grade. The following requrements have been met within this application.
- Responsive Design: The search buttons and image adjust to a smaller size when the viewport width falls below 996px. This is accomplished using a Media Query.
- Usage of Arrays/Objects: The call to the GitHub API returns a JSON array, and selected elements are then displayed in an HTML Table.
- Usage of RegEx to validate user input: A regular expression is used to ensure that the user-supplied GitHub username conforms to current GitHub username restrictions
- API Usage: This project utilizes the GitHub API to retrieve information about a specified username and any associated public repositories

## Instructions for Use
If you wish to try out this project for yourself:
- Clone the repository to a folder of your choice
- Navigate to the folder which contains INDEX.HTML
- Open the INDEX.HTML file in your browser (Right-click, then Open on Windows)

You can also open the project files in VSCode and run them using the Live Server extension.

Of course, an alternative option is to simply visit the live demo I have linked below.

Once you have the app running, simply type a GitHub username in the search box.  If the name is invalid or is not found, an alert will be generated. Normally this would utilze a modal
or some other appropriate form of alerting the user, but due to time constraints the app makes use of the built-in JavaScript 'alert()' function for this.

On the search form there are two buttons. One submits the search term you specified in the input box. The other button chooses a random name from an array of pre-determined GitHub usernames and displays the public repositores. If there are more than 30 results, the results are paged. Paging links (if any) can be found at the bottom of the results table! If you wish to clear all search parameters and start a fresh search, you can click on the title image just above the search form.

## Testing
While I have worked to explore as many edge cases as I could think of, it is possible that there are bugs and other issues that
I might want to look into in the future.  Feel free to test the app thourghly.  Suggestions and feedback is always welcome!

## Known Issues
After searching and clicking a NEXT or PREVIOUS page link, then clicking the "Random Username" button, the correct results will be displayed, however the querystring from the previous search will still be displayed in the browser's address bar.

## Live Demo
You can find a live working demo of this project at the following location: [findGit Live Demo](https://colony7.com/codeky/findGit/)
