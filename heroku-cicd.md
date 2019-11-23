# Deploying on Heroku along with CI/CD

### STEP1 (Create app)

- In the terminal, go the project root folder.
- Create a new heroku app with the required name:
	
	heroku apps:create airbnb-project-cmpe281
	
- Add Heroku remote to local repository:
	
	heroku git:remote -a airbnb-project-cmpe281
	
- Push frontend codebase (subtree) to Heroku remote:
	
	git subtree push --prefix frontend heroku master
	
- Note: For any buildpack errors while deployment, add a Node.js buildpack to the app through the Heroku website, and push the subtree again.


### STEP2 (CI/CD)

- Go to Heroku website and choose the **Create new pipeline** option.
- Add a name to the pipeline and connect to the GitHub repo. Usually, admin access is required on the repo to be connected.
- Click on **Create pipeline**.
- On the next page, add the heroku app to the required stage.
- On the **Tests** tab, add any required tests.
- On the apps page, open the Heroku app.
- On the the **Settings** tab, add a key and value pair to *Config Vars* as the following (frontend is the folder containing the frontend code):
	- Key: PROJECT_PATH
	- Value: frontend
- Add the subdir buildpack to the app using the following link:
	
	[https://github.com/timanovsky/subdir-heroku-buildpack.git](https://github.com/timanovsky/subdir-heroku-buildpack.git)
	
- Move the subdir buildpack to the top of the buildpacks list.
- On the **Deploy** tab, click on **Enable Automatic Deploys**.
- This completes the CI/CD configuration. Push code changes to master and check the Heroku build logs for any errors.

References: [https://stackoverflow.com/questions/39197334/automated-heroku-deploy-from-subfolder](https://stackoverflow.com/questions/39197334/automated-heroku-deploy-from-subfolder)