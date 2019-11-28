# Airbnb Prototype


### Project Description

Airbnb project is a prototype of the original Airbnb website where users can arrange, offer, or book homestays and tourism experiences. Users can register as owners or travelers. Owners post a particular property by providing specific details such as the location of the property, number of bedrooms, bathrooms, available dates, pictures and so on. If a user registers as a traveler, they can search for a particular property based on the location and the dates of travel. A traveler can book a property by selecting a property and submitting their payment details on the payment page. All the booked trips of the traveler are visible in the Traveler trips page. On the other hand, an owner can view the details of the travelers who booked their property. Additionally, after a booking/trip is successful, a travelers have the option to add reviews to their selected property.


### System Architecture

![Architecture Diagram](https://github.com/nguyensjsu/fa19-281-tech-phantoms/blob/master/Photos/AWS%20Network%20Diagram.png)


### Technologies Utilized:

- UI - React, HTML5, CSS3, Bootstrap, JavaScript.
- Server - Go, REST API, BSON, JSON, Bcrypt.
- Infrastructure - Microservices, Docker, Kubernetes, Helm, Cluster Technology, CI/CD, Deployment Pipeline, AWS EKS, AWS CodeBuild, AWS ECS, AWS ECR, AWS Fargate, Heroku, AWS API Gateway, AWS NLB, AWS CloudFormation, AWS CloudFront, CDN, VPC, NAT
- Database - MongoDB, Sharding, Replication, DB Clusters, AWS S3.
- Other - Linux, YAML, makefile, dockerfile, buildspec, Git.

### Microservices

- User Service - This microservice handles the sign up, login, and session management for all users. Hashed passwords are stored using Bcrypt.

- Dashboard Service - This microservice handles the traveler/owner dashboards which display the booked trips and properties. Additionally, it handles the profile updates for all the user. 

- Property Service - This microservice handles the creation of a new property by an owner along with posting pictures and viewing of the created property. It also handles the searching of a property by a traveler.

- Booking Service - This microservice handles booking of a property and integrating the corresponding updates on the traveler and owner dashboard.


### AKF Scaling Cube utilization

- X-axis scaling - The X-axis scale is addressed by replicating each microservice across multiple instances which increases the throughput and provides fault tolerant capabilities to the database layer.

- Y-axis Scaling - By making the application loose-coupled through a microservice architecture based on the functionalities and deploying these microservices using separate locations and AWS accounts, the application addresses the Y-axis scaling.

- Z-axis Scaling - The NoSQL database i.e the MongoDB is sharded and utilizes query routers and config servers to address the Z-axis scale.


### Deployment Description

- **Frontend**:

	The frontend, which is developed using ReactJS, HTML, CSS, and Bootstrap, is deployed on Heroku with CI/CD. Whenever a code change is pushed to the master branch of the repo, the change is automatically deployed and it reflects on the frontend.

- **Backend**:

	Login Service - Deployed on AWS EKS (managed Kubernetes cluster), having two worker nodes with two pods in each node.

	Dashboard Service - Deployed on AWS ECS. There is a network load balancer in front of the three ECS tasks. Additionally, the whole process is automated using the CI/CD pipeline with AWS services such as CodeBuild and Elastic Container Registry (ECR).

	Property Service - Deployed on AWS ECS having three tasks kept behind a network load balancer. The docker image is pushed to AWS ECR.
	
	Booking Service - Deployed on AWS EKS (managed Kubernetes cluster), having two worker nodes with two pods in each node.


### Deployment Documentation 

[EKS Cluster Deployment](https://github.com/nguyensjsu/fa19-281-tech-phantoms/blob/master/eks-cluster-deployment.md)

[AWS ECS CI/CD Deployment](https://github.com/nguyensjsu/fa19-281-tech-phantoms/blob/master/aws-ecs-ci-cd-deplyment.md)

[Heroku CI/CD Deployment](https://github.com/nguyensjsu/fa19-281-tech-phantoms/blob/master/heroku-cicd.md)


### Team members :

Darshil Kapadia, Kavina Desai, Shreyam Kela, Vinay Kovuri


### Contributions

- Kavina:
	- Concentrated on the backend go routes for the user dashboard.
    - Worked on designing the owner and traveler's dashboard pages and traveler update profile page.
    - Worked to create a CI/CD pipeline on AWS with CodeBuild, ECS cluster, ECR and load balancer.
    - Created mongodb sharding on the dashboard nosql database cluster for horizontal scalability.
    - Documentation of the project.

- Darshil:
	- Worked on UI related to posting of property and search results.
	- Developed the complete property microservice.
	- Worked on configuring CDN with S3 for property images.
	- Worked on codebuild to trigger building of docker image on the event of pushing on master branch.
	- Worked on creating mongoshards for property microservice.

- Shreyam:
	- Developed the end-to-end flow of the User Registration / Login micro service. 
	- Built the Go backend for Login and Sign Up with password hashing using Bcrypt.  
	- Created the Login and Signup web pages for travelers and owners, using ReactJS. 
	- Deployed the frontend of the app on Heroku with CI/CD.  
	- Worked with the team in deploying the Login micro service to Amazon managed Kubernetes cluster - EKS. 
	- Configured an Amazon API Gateway as a single entry point for the frontend to connect to the different load balancers of the 4 micro services.

- Vinay:
	- Implemented the Booking microservice. It consists of various operations on adding, fetching, deleting and updating the booking.
	- Implemented MongoDB sharding on AWS for booking microservice.
	- Inputs about the architecture of the project.
	- Worked on front modules like payment and pages that included operations on booking microservice.
 	- Implemented deployment of docker images of booking microservice on AWS EKS.
	- System Architecture diagram of the project.
