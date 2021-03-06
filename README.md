<link rel="stylesheet" href="readmeData/fs-doc.css" type="text/css">
<div class="fs-doc-body">


# Onshape REST API: application "Blanc" </a>
 
## Overview

This application is a small plug-in, integrated into Onshape tab.
While running within document it requests list of document elements and show result as a table.

Deploy it accordingly to provided instruction and study it's workflow to  get familiar with basic Onshape API applications specifics.

## Preconditions

This tutorial was written for  OS Windows users. 

Knowledge base:

N |Link|Logo|
 :-:| :-:  |:-:|
1 | [Onshape API](https://onshape-public.github.io/docs/) docs | <div class="fs-image-row fs-image-row-extra-small"> <img src="readmeData/images/onshape-logo.png" alt="onshape_logo"> </div> |
2 | [JavaScript](https://www.w3schools.com/js/DEFAULT.asp) - programming language of the Web|<div class="fs-image-row fs-image-row-extra-small"> <img src="readmeData/images/logo-javascript.png"  alt="JS_logo"> </div>|
3 | [Node.js](https://nodejs.org/en/about/) - JavaScript runtime |<div class="fs-image-row fs-image-row-extra-small"> <img src="readmeData/images/Node_logo.png"  alt="node_logo"> </div>|
4 | [Express](https://expressjs.com/en/guide/routing.html) - web framework for Node.js|<div class="fs-image-row fs-image-row-extra-small"> <img src="readmeData/images/express-logo.png"  alt="express_logo"> </div> |
5 | [Passport](http://www.passportjs.org/packages/passport-oauth2/) - authentication middleware for Node.js|<div class="fs-image-row fs-image-row-extra-small"> <img src="readmeData/images/passport_logo.png"  alt="passport_logo"> </div>|
6 | [Heroku](https://devcenter.heroku.com/categories/nodejs-support) and deploy of Node.js applications on it|<div class="fs-image-row fs-image-row-extra-small"> <img src="readmeData/images/heroku_logo.png"  alt="gheroku_logo"> </div>
7 | [NPM](https://docs.npmjs.com/about-npm) - command line tool and JavaScript registry|<div class="fs-image-row fs-image-row-extra-small"> <img src="readmeData/images/npm_logo.png"  alt="npm_logo"> </div> |
8 | [GIT](https://git-scm.com/doc)-Version Control Software |<div class="fs-image-row fs-image-row-extra-small"> <img src="readmeData/images/git_logo.png"  alt="git_logo"> </div>|
9 | [Redis](https://redis.io/documentation) - in-memory data structure store|<div class="fs-image-row fs-image-row-extra-small"> <img src="readmeData/images/redis_logo.png"  alt="redis_logo"> </div>|


Environment setup:

 N | Action | 
 --| ---   | 
 1 | Get registration in [Onshape developers portal](https://dev-portal.onshape.com/) | 
 2 | Get registration on [Heroku](https://id.heroku.com/login)  | 
 3 | Install NPM - run command in your console: `npm install -g npm` | |
 4 | Download and Install GIT - https://git-scm.com/download/win | 


Keep in mind also:
- Using of Visual studio code might make your work more convenient.
- Your client-side application will interact with onshape api server thru the server-side that will use **Open Authentication (OAuth) protocol** .
- Git-Hub projects initially have default branch **"main"**. Remote repositories automatically created by Heroku have default branch **"master"**. Remember this while handling situations with failed operations like `git push heroku master/main`
- About java script: the only thing that can return asynchronous function is **promise**. Don't try to get anything else. It wont work as you expect. 

## Deploy sequence in details

### Get the source code

Now you are on a git-hub page and above this "Readme" you can found the repository where application code is. There are several ways to get it, and we will use the straight forward one - just download content of repository to your PC.
<div class="fs-image-row fs-image-row-medium"> <img src="readmeData/images/download_code.png"  alt="Download code"> </div>

Use folder with short address to unpack the archive. Here and below address will be **D:\Heroku\app-blanc**
  
Now we have a code in the local folder, but not a repository yet. To be able to interact with Heroku remote repository we have to initiate our own locally, based on the folder that just was created.

<div class="fs-note">

- Run the npm console.
- Navigate to the folder **D:\Heroku\app-blanc** 
	- C:\Users\Username> `D:`
	- D:\ `cd Heroku\\app-blanc`
- Initiate repository: D:\Heroku\app-blanc>`git init`
- Add all folder content to this repository: D:\Heroku\app-blanc>`git add .`
- Commit data to local repository: D:\Heroku\app-blanc> `git commit -m "My first commit"`
</div>
 
Now source code of the application is stored and versioned within local repository on your PC.

### Create empty application on Heroku.

Our application will be build and started-up on the remote server provided by Heroku. 

<div class="fs-note">

- Use console command: D:\Heroku\app-blanc>`heroku login`
- Follow the intructions - pass your credentials on web page and continue when access granted.
- Create new application: D:\Heroku\app-blanc>`heroku create`
- Note URLs provided after command execution:
    + `<string-string-number>` - name of the application, will be used several times later
	+ `https://<string-string-number>.herokuapp.com/`-  the address of the server, its front web page.
	+ `https://git.heroku.com/<string-string-number>.git`- is the remote git repository, source of the code for application building.
- Assoiate your local repository with remote application: D:\Heroku\app-blanc>`heroku git:remote -a <string-string-number>`
</div>

### Create Redis-To-Go server on Heroku

**Redis server** will maintain token storing and transferring - part of the Open Authentication protocol. 

<div class="fs-note">

 - Create Redis-To-Go server with conslole command: D:\Heroku\app-blanc>`heroku addons:create redistogo`
 - Go to your Heroku profile in browser
 - Navigate: Dashboard -> `<your application>` ->Installed add-ons -> Redis-To-Go -> click link.  
 - On the configuration data page note the **address of the redis server**.
</div>


### Create new Onshape application and Store entry.

All necessary data to completely define application on the Onshape side was achieved above.

<div class="fs-note">

- Log in to yours [Onshape Developer Portal](https://dev-portal.onshape.com/)
- Navigate:  "OAuth applications" -> "Create a new OAuth Application"
- Set properties for the new application
	+ **Name**: app-blanc (you may use some other name)
	+  **Primary format**. Reverse domain name that you can get by reversing your server address. Follow the template:
		+ Application address: `<string-string-number>.herokuapp.com`
		+ Reverse domain: `com.herokuapp.<string-string-number>`
	+ **Redirect URLs**: `https://<string-string-number>.herokuapp.com/oauthRedirect`  
	+ **OAuth URL**: `https://<string-string-number>.herokuapp.com/oauthSignin`
	+ **Admin Team** - this is optional setting you have to define in case when application should be shared with your team mates.
	+ Set permissions:
		- Application can read your profile information
		- Application can read your documents	
- Click "Create application".
  <div class="fs-image-row fs-image-row-medium"> <img src="readmeData/images/SecretMessage.PNG"  alt="Secret-message"> </div>
- Note the **Client Secret** - it wont be available later
- Note the **Client ID** from the application properties
- Create Extension for your application
  - Go to "Extensions" tab
  - Click "Add extension", set properties:
    - Name: `<Enter extension name>`
    - Description(Optional): `<Enter extension description>`
    - Location: Element Tab
    - Action URL: `https://<string-string-number>.herokuapp.com>`
    - Icon(Optional): `<Drop an image to upload>`
- Create Store Entry for your application.
		
</div>


### Configure environment variables of Heroku application

It is preferable to keep sensitive information in the environment variables rather that hard code it into app. Use console with your local application folder address (D:\Heroku\app-blanc>) to perform commands listed in the table below one-by-one. Use appropriate values from above or from the table.

Property | Setup command template | Notes | 
---------| -----                  |  ---- |
API_URL   				    |`heroku config:set API_URL=https://cad.onshape.com/api`|API requests will be redirected here|
OAUTH_URL 					|`heroku config:set OAUTH_URL=https://oauth.onshape.com`|Middleware for Open Authentication|
OAUTH_CALLBACK_URL			|`heroku config:set OAUTH_CALLBACK_URL=https://<string-string-number.herokuapp.com>/oauthRedirect`| Our server entry point for Open Authentication.|
WEBHOOK_CALLBACK_ROOT_URL	|`heroku config:set WEBHOOK_CALLBACK_ROOT_URL=https://<string-string-number.herokuapp.com>`| 
OAUTH_CLIENT_ID 			|`heroku config:set OAUTH_CLIENT_ID=<client-id-from-created-app-in-dev-portal`| Client ID provided during Onshape application creation|
OAUTH_CLIENT_SECRET			|`heroku config:set OAUTH_CLIENT_SECRET=<client-secret-from-created-app-in-dev-portal>`|Client Secret provided during Onshape application creation|
SESSION_SECRET				|`heroku config:set SESSION_SECRET=<a-cryptographically-secure-string>`|Inverse string used during Onshape application setup |
 
You can confirm your configuration settings by running `heroku config`. You should see all of the above, plus a REDISTOGO_URL variable created by the Redis-To-Go add-on.  
  
It might be happen that REDISTOGO_URL variable is not set. You can define it manually: use URL from the "Create Redis-To-Go server on Heroku" section above.

### Push and build.

There is configured application on the Onshape side and tuned environment on the Heroku side. Time to push application code to the remote Heroku repository. Once it there - application should be automatically build and start up its server.

<div class="fs-note">

 - Use console to perform command D:\Heroku\app-blanc> `git push heroku master`
 - To overwatch the building process open separate console, navigate to local project directory and use command:
D:\Heroku\app-blanc>`heroku logs --tail`

Building log and server requests processing will be displayed here. 

NOTE: Size of the log provided by Heroku is limited (approximately 300 entries), you should restart logging when it stuck. Just open new console and run logging once again.

- Ensure that application has builder and started successfully: log from Heroku should look like this:
<div class="fs-image-row fs-image-row-medium"> <img src="readmeData/images/goodBuildLog.png"  alt="Download code"> </div>
</div>

### Check of the application.

<div class="fs-note">

- Switch to Onshape.
- Open some document that contains several elements (parts, assemblies, drawings).
- Click the "App store" button.
- Use "search" field to find your application.
- Select application and open its page.
- Click "Subscribe"
- Approve free subscription.
- Switch back to your document.
- Click "Insert new element" button -> Applications -> Select "your application"  
- As application is new for Onshape it requesting autorization.  
<div class="fs-image-row fs-image-row-medium"> <img src="readmeData/images/autorize-request.PNG"  alt="autorizeRequest"> </div>

- Autorize it and wait for it`s page loading.
- It should contain header, small introduction and table that describes content of the document.
<div class="fs-image-row fs-image-row-medium"> <img src="readmeData/images/app-screen.PNG"  alt="app-screen"> </div>

</div>


## Project structure

Examine structure of the project to get common understanding of what is going on.

- **package.json** - contains all dependencies required for application deploy. Creating by user. 
- **package-lock.json** - contains actual information about used modules, their versions and source for downloading. It is generating automatically during run `npm install` command in the console. 
- **bin/a-start-point** - entry point for server application start up.  Pay attention to location of this file - folder "bin" should keep it's name, otherwise application wont start after deploy.
- **server/b-config-from-env.js** - this module extracts the environment variables (those you have set during Heroku application setup) to make them available within application code. 
- **server/c-redis-client.js** - contains definition of the Redis client that maintains the Open Authentication mechanics.
- **server/d-server-module.js** - all requests to the server are passing through this module and processing here. In a nutshell: every request will be processed by "app.use" functions, and only special one with strictly defined ending has it`s own processing function in the bottom of the module. Find out more by reading the [Express](https://expressjs.com/en/guide/routing.html) documentation.
- **server/e-onshape-api.js** - specific processing code for handling different types of the Onshape API requests. 
- **server/f-api-utils.js** - module performs interaction with Onshape API server. Handle the situations with expired authentication tokens - initialize their refreshing.
- **server/g-config-utils.js** - string validation module for  **b-config-from-env.js**
- **client/html/index.html** - web page that is providing by server when the application is requesting to start.
- **client/html/grantDenied.html** - notification about about page unavailability for the account.
- **client/javascripts/show-elemnts-list.js** - script that performs current document statistics request to our application server, and handle the response.

## Sequence of application work

- User: open the frame of the application in the Onshape document. 
- Application: using known server address requesting main page of the application.
- Server: processing the request - sending "index.html" page back to application.
- Application: build the web page from the received "index.html".
- Application: facing the nested script in html, requesting java script code from the server.
- Server: processing request, using the ordinary static directory.
- Application: received script is building and running:
	- Script: requesting elements of the current document from server.
	- Server: redirecting request to Onshape/api server page with authentication data attached.
	- Onshape API server: reporting with json data structure.
	- Server: forwarding report to application
- Application: parsing the json structure and building table.
- User: observing result of application run.

## Authorization specific 

- First run of the application should be approved by user.
- Every request from client to server should contain information about user and document where client is running.
- Every request to Onshape API should contain valid not expired token.
- In case of "Unauthorized" (401) report from onshape API server, new token should be requested and main sequence be continued.

</div>