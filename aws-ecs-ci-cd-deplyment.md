# Deploying on AWS ECS along with CI/CD

### STEP1

- Go to the AWS ECS console and click on **Create Cluster**
- Select the option : Networking Only - Powered by AWS Fargate
- Enter the cluster name : goapp-cluster
- Keep other things as it is and create the cluster

### STEP2

- Go to AWS ECR console and click on **Create Repository**
- Enter the repository name you want to give and click on **Create Repository**

### STEP3

- Go back again to the ECS console, this time to create **Task definitions**
- Choose Fargate
- Give the task definition name and fill out other details
- Click on **Add Container** and enter the container name
	- For image : enter the created ECR name in the previous step with the tag 'latest' appended to it
	- After filling the required details click on **Add**
- Create the Task definition

### STEP4

- Dockerize your application and push your docker image to ECR
- Go to ECR console -> click on your repository -> Click on **View push commands**
- Follow the instructions to push the image

### STEP5

- Create a network load balancer and configure the target groups properly
- Set the target group port the same as the port you exposed for the docker container

### STEP6

- Go to ECS console and click on your cluster.
- Click on the **create** button to create a service inside the cluster
- Launch type : Fargate
- Number of tasks : 3
- Deployment type : Rolling Update
- Enter the VPC details (select the private subnets and disaple auto-assign public ip button if you want your ECS tasks to be private)
- Enable service discovery integration : no
- Attach the network load balancer created in the previous step
- After waiting for some time, you can see all the three tasks in the *running* state in the cluster service
- You can also check that three targets are healthy now in the network load balancer

### STEP7

- Go the AWS CodeBuild console
- Choose Github as the source provide. Connect your github and choose your repository from the drop down list
- In the Environment
	- Operating system : Ubuntu
	- Runtime : Standard
	- Image : standard:1.0
	- Priveleged (Enable this flag if you want to build Docker images or want your builds to get elevated privileges) : **YES**
	- Expand the Additional Configuration to set the VPC and subnet details
	- Buildspec
		- Leave blank if your buildspec yaml file is in the repository root directory
		- Otherwise provide the path to your buildspec.yml file (eg. backend/Property/buildspec.yml)
		- Artifacts : No artifacts
		- Create build project
- buildspec.yml (put it in project root directory)

	```
	version: 0.2
	
	phases:
	  pre_build:
		commands:
			- echo Logging in to Amazon ECR...
			- aws --version
			- $(aws ecr get-login --region $AWS_DEFAULT_REGION --no-include-email)
			- REPOSITORY_URI=955884469467.dkr.ecr.us-east-1.amazonaws.com/goapp-repo
			- COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
			- IMAGE_TAG=build-$(echo $CODEBUILD_BUILD_ID | awk -F":" '{print $2}')
	  build:
		commands:
			- echo Build started on `date`
			- echo Building the Docker image...
			- cd backend/Dashboard	
			- ls
			- echo $REPOSITORY_URI
			- docker build -t $REPOSITORY_URI:latest .
			- docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG
	  post_build:
		commands:
			- echo Build completed on `date`
			- echo Pushing the Docker images...
			- docker push $REPOSITORY_URI:latest
			- docker push $REPOSITORY_URI:$IMAGE_TAG
			- echo Writing image definitions file...
			- printf '[{"name":"goapp","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > $CODEBUILD_SRC_DIR/imagedefinitions.json
			- cat $CODEBUILD_SRC_DIR/imagedefinitions.json
			- ls
	artifacts:
		files: imagedefinitions.json
	```

Reference : https://www.youtube.com/watch?v=00qQaoC-5ig