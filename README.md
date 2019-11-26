# Airbnb Prototype


### Project Description

Airbnb app is a prototype of the original Airbnb website where users can arrange, offer, or book homestays and tourism experiences. Users can register as owners or travelers. Owners post a particular property by providing specific details such as the location of the property, number of bedrooms, bathrooms, available dates, pictures and so on. If a user registers as a traveler, they can search for a particular property based on the location and the dates of travel. A traveler can book a property by submitting their payment details on the payment page. All the booked trips of the traveler are visible in the Traveler trips page. On the other hand, an owner can view the names of the travelers who booked their property. Moreover, after a booking is successful, a traveler can even review it by giving comments on it.


### Architecture

![Architecture Diagram](https://github.com/nguyensjsu/fa19-281-tech-phantoms/blob/master/Photos/AWS%20Network%20Diagram.png)


### Microservices

- User Service - This service handles the sign up and login of user on airbnb app. Hashed passwords are stored using Bcrypt.

- Dashboard Service - This microservice takes care of the profile updation of the user on the website. Moreover it handles the traveler and owner dashboard which displays booked trips and properties.

- Property Service - This service handles the creation of a new property along with posting pictures, viewing of the created property and searching a property.

- Booking Service - This service looks after the booking part of the property and updating the traveler and owner dashboard accordingly.


### Deployment description

- **Frontend**:

	Frontend in developed using ReactJS, HTML, CSS, and Bootstrap. The web app is deployed on Heroku with CI/CD. Therefore, whenever a code change is pushed to the master branch of the repo, the changed code is automatically deployed and it reflects on the frontend.

- **Backend**:

	Login Service - It is deployed on the AWS managed Kubernetes cluster - EKS, having two worker nodes with two pods in each of them.

	Dashboard Service - This backend service is deployed on AWS ECS. There is a network load balancer in front of the three ECS tasks. Moreover, the whole process is automated using the CI/CD pipeline with AWS services such as CodeBuild and ECR.

	Property Service - This is deployed on AWS ECS having three tasks kept behind a network load balancer. The docker image is pushed to Elastic Container Registry (ECR).
	
	Booking Service - It is deployed on the AWS managed Kubernetes cluster - EKS, having two worker nodes with two pods in each of them.


### AKF Scaling Cube utilization

- X-axis scaling - The X-axis Scale has been addressed by replicating each microservice across multiple instances which 	increases the throughput and helps in avoiding failures.

- Y-axis Scaling - By dividing each service based on their functions and deploying it to separate AWS accounts, our application also addresses the Y-axis scaling.

- Z-axis Scaling - The NoSql database i.e MongoDB has been sharded to address the Z-axis Scale


### Deployment Documentation 

[EKS Cluster Deployment](https://github.com/nguyensjsu/fa19-281-tech-phantoms/blob/master/eks-cluster-deployment.md)

[AWS ECS CI/CD Deployment](https://github.com/nguyensjsu/fa19-281-tech-phantoms/blob/master/aws-ecs-ci-cd-deplyment.md)

[Heroku CI/CD Deployment](https://github.com/nguyensjsu/fa19-281-tech-phantoms/blob/master/heroku-cicd.md)


### Team members :

Darshil Kapadia, Kavina Desai, Shreyam Kela, Vinay Kovuri


### Contributions

- Kavina:
	- Concentrated on the backend go routes for the user dashboard
    - Worked on designing the owner and traveler's dashboard pages and traveler update profile page
    - Worked to create a CI/CD pipeline on AWS with CodeBuild, ECS cluster, ECR and load balancer
    - Created mongodb sharding on the dashboard nosql database cluster for horizontal scalability
    - Documentation of the hackathon project

- Darshil:
	- Worked on UI related to posting of property and search results
	- Developed the whole property microservice.
	- Worked on configuring CDN with S3.
	- Worked on codebuild to trigger building of docker image on the event of pushing on master branch.
	- worked on creating mongoshards for property microservice.

- Shreyam:
	- Developed the end-to-end flow of the User Registration / Login micro service. 
	- Built the Go backend for Login and Sign Up with password hashing using Bcrypt.  
	- Created the Login and Signup web pages for travelers and owners, using ReactJS. 
	- Deployed the frontend of the Airbnb app on Heroku with CI/CD.  
	- Worked with the team in deploying the Login micro service to Amazon managed Kubernetes cluster - EKS. 
	- Configured an Amazon API Gateway as a single entry point for the frontend to connect to the different load balancers of the 4 micro services.

- Vinay:
	- Implemented the Booking microservice. It consists of various operations on adding, fetching, deleting and updating the booking.
	- Implemented MongoDB sharding on AWS for booking microservice.
	- Inputs about the architecture of the project.
	- Worked on front modules like payment and pages that included operations on booking microservice.
 	- Implemented deployment of docker images of booking microservice on AWS EKS.
