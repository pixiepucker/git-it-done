var issueContainerEl = document.querySelector("#issues-container");

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
            });
        } else {
            //request error
            alert("There was a problem with your request :(")
        }
    });
    console.log(repo);
};

//call function
getRepoIssues();

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
