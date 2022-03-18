var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function () {
    //use var to hold info from search value located in docuement's location
    var queryString = document.location.search;
    //use var to hold repo name after/before '='
    var repoName = queryString.split("=")[1];

    //add error handling through if else statement
    if(repoName) {
        //pass repoName into getRepoIssues function and call it
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    } else {
        //if no repo given, nav back to main page
        document.location.replace("./index.html");
    }
};

var getRepoIssues = function(repo) {
    //use var to hold apiURl that requests data from github
    var apiUrl = "https://api.github.com/repos/" + repo + 
    "/issues?=direction=asc";
    //use fetch to grab the requested data response
    fetch(apiUrl).then(function(response) {
        //request successful
        if (response.ok) {
            response.json().then(function(data) {
                //pass response data to dom function
                displayIssues(data);

                //check if api has paginated issues
                if (response.headers.get('link')) {
                    displayWarning(repo);
                }
            });
        } else {
            //request error, redirect to main page
            document.location.replace("./index.html");
        }
    });
};

var displayIssues = function(issues) {
    //if repo has no open issues display this:
    if(issues.length === 0 ) {
        issueContainerEl.textContent = 'This repo has no open issues!';
        return;
    }
    //loop over issues array to create issue elements and append them to container
    for (var i =0; i < issues.length; i++) {
        //create link element to take users to the issues on github
        var issueEl = document.createElement('a');
        issueEl.classList = 'list-item flex-row justify-space-between align-center';
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute('target', '_blank');


        //create span to hold issue title
        var titleEl = document.createElement('span');
        titleEl.textContent = issues[i].title;

        //append to container
        issueEl.appendChild(titleEl);
        //create a type element
        var typeEl = document.createElement('span');

        //check if issue is an actual issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(pull request)";
        } else {
            typeEl.textContent = "(issue)";
        }

        //append span to link issueEl
        issueEl.appendChild(typeEl);

        //append link issueEl to div container
        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function (repo) {
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, please visit ";
    var linkEl = document.createElement("a");
    linkEl.textContent = 'this repo on GitHub.com!';
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    //append to warning container
   limitWarningEl.appendChild(linkEl);
};

getRepoName();