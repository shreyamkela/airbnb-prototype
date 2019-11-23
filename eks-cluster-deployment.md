# EKS Cluster using eksctl and deployment using ECR

### Pre-requisite:
Deploy the docker image to ECR repository which you want to run on the EKS cluster.
Ref: https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_GetStarted.html

## Guide
**Step1**: Install the awscli by following the steps in https://docs.aws.amazon.com/cli/latest/userguide/install-macos.html.
Check installation using
`aws version`

**Step2**: Configure your awscli using your Access and SecretKey. If you don't have one, create one using https://aws.amazon.com/blogs/security/wheres-my-secret-access-key/. After getting one, run `aws configure` on terminal.

**Step3**: Install kubectl using https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html.
Check installation using `kubectl version`

**Step 4**: Install eksctl using https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html.
Test installation using `eksctl version`

**Step 5**: Install aws-iam-authenticator using https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html.
Test installation using `aws-iam-authenticator help`

**Step 6**: Create a cluster.yaml file as follows

```
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: **your-cluster-name**
  region: **your-aws-region**

nodeGroups:
  - name: ng-1
    labels: { role: workers}
    instanceType: t3.medium
    desiredCapacity: 2
    minSize: 1
    maxSize: 3
    volumeSize: 50
    volumeType: gp2
    privateNetworking: true
    ssh:
      allow: true
      publicKeyName: '**your-public-key-name**'
      'service': 'order'
```

**Step 7**: Run command:
`eksctl create cluster -f cluster.yaml`

**Step 8**: On successful creation of the cluster, update the config of the created cluster in .config file using.
`aws eks update-kubeconfig --name your-cluster-name`

**Step 9**: This should set your current kubectl context to the the current cluster too. Next, check the worker nodes using
`kubectl get nodes`

**Step 10**: Create deployment.yaml file as follows:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: last-goapp
spec:
  replicas: 2
  selector:
    matchLabels:
      run: last-goapp
  template:
    metadata:
      labels:
        run: last-goapp
    spec:
      containers:
      - image: <your-ecr-repository/image:tag>
        name: last-goapp
        ports:
        - containerPort: 8080
``` 

**Step 11**: Create service.yaml file as follows:

```
apiVersion: v1
kind: Service
metadata:
  name: last-goapp
  labels:
    run: last-goapp
spec:
  selector:
    run: last-goapp 
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

**Step 12**: Run the following command to deploy the pods(replicas) inside worker nodes: 
`kubectl apply -f deployment.yaml` 

**Step 13**: Check the pods getting ready using following command
`kubectl get pods -l run=last-goapp -o wide`

**Step 14**: Run the following command to create a LoadBalancer to load balance the worker nodes:
`kubectl apply -f service.yaml`

**Step 15**: Run following command to get details about the balancer and hit on the exposed DNS.
`kubectl get svc booking-app`

