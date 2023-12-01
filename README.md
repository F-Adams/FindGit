# FindGit

This is a simple application to list all public repositories for a specified Github user. This project was designed to mimic the visial style and feel of the Google home page.
This is not a Google search page! Instead, it simply utilizes the GitHub API to search for a GitHub username specified by the user.  The input is validated using a
regular expression to ensure that the entered search term conforms to current GitHub username format. In this case, alphanumeric characters and a dash are the only allowerd characters
in a GitHub username, and the RegEx pattern is 

This application was developed as my final Capstone project for the Code: You Web Development pathway.

## Project Requirements
There are several requirements which needed to be met for this project to obtain a passing grade. The following requrements have been met within this application.
- Responsive Design: The search buttons and image adjust to a smaller size when the viewport width falls below 996px.
- Usage of Arrays/Objects: The call to the GitHub API returns a JSON array, and selected elements are then displayed in an HTML Table.
- Usage of RegEx to validate user input: A regular expression is used to ensure that the user-supplied GitHub username conforms to current GitHub username restrictions
- API Usage: This project utilizes the GitHub API to retrieve information about a specified username and any associated public repositories

## Instructions for Use
If you wish to try out this project for yourself:
- Clone the repository to a folder of your choice
- Navigate to the folder which conatins INDEX.HTML
- Open the INDEX.HTML file in your browser (Right-click, then Open on Windows)

You can also open the project files in VSCode and run them using the Liver Server extension.

Once you have the app running, simply type a GitHub username in the search box.  If the name is invalid or is not found, an alert will be generated. Normally this would be a modal
or some other appropriate form of alerting the user, but for now due to time constraints the app makes use of the built-in JavaScript 'alert()' funstion.

An alternative option is to simply visit the live demo I have set up and the following URL:
[https](https://colony7.com/codeky/findGit/)

## Testing
I've tried to test the app as much as I can, attempting to explore as many edge cases as I could think of, however it is possible that there are bugs and other issues that
I might want to explore further in the future.  Fell free to test 
