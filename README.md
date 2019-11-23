# Team Hackathon Project

## Airbnb - Rent or List a property

### Team members :

Darshil Kapadia

Kavina Desai

Shreyam Kela

Vinay Kovuri

### Project Description

Airbnb application is the clone of the original Airbnb app where users can register as owners or travelers. Owners post a particular property by giving specific details such as the location of the property, bedrooms, bathrooms, available dates, pictures and so on. If a user registers as a traveler, he/she can search for a particular property based on the location and the dates of travel. A traveler can book for the property by filling the details on the payment page. All the booked trips of the traveler can be visible in the Traveler trips page. On the other side, an owner can also view the names of the travelers who booked their property. Moreover, after a booking is done, a traveler can also review it by giving comments on it.

### Project Modules

(1) User Registration/ Login Service - This service handles the sign up and login of the user on airbnb website.
(2) Dashboard Service - This microservice takes care of the profile updation of the user on the website. Moreover it handles the traveler and owner dashboard.
(3) Property Service - This service handles the creation of a new property along with posting pictures, viewing of the created property and searching a property.
(4) Booking Service - This service looks after the booking part of the property and updating the traveler and owner dashboard accordingly.

### Deployment details

- **Frontend** : 

	Frontend in developed using reactjs, html, css, bootstrap. The frontend web application is deployed on Heroku and CI/CD has also been applied on it. Thus when the code is pushed to the repository, the changed code is automatically reflected.

- **Backend**

	Login Service : It is deployed on the AWS managed kubernetes cluster - EKS having two worker nodes with two pods in each of them.
	Dashboard Service : This backend is deployed on AWS ECS. There is a network load balancer in front of the three ECS tasks. Moreover, the whole process is automated using the CI/CD pipeline with AWS services such as CodeBuild and ECR.
	Property Service : This is deployed on AWS ECS having three tasks kept behind a network load balancer. The docker image is pushed to Elastic Container Registry (ECR).
	Booking Service : It is deployed on the AWS managed kubernetes cluster - EKS having two worker nodes with two pods in each of them.

### Architecture diagram

![Architecture Diagram](https://github.com/nguyensjsu/fa19-281-tech-phantoms/blob/master/Photos/AWS%20Network%20Diagram.png)


