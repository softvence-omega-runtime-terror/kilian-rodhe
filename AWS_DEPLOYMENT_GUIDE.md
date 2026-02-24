# AWS Deployment Guide - Kilian Rohde E-commerce

## Option 1: AWS ECS with Fargate (Recommended)

### Prerequisites
```bash
aws configure
docker login
```

### Steps

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name kilian-rohde-frontend --region us-east-1
```

2. **Build and Push Docker Image**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker build -t kilian-rohde-frontend .
docker tag kilian-rohde-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/kilian-rohde-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/kilian-rohde-frontend:latest
```

3. **Create ECS Cluster**
```bash
aws ecs create-cluster --cluster-name kilian-rohde-cluster --region us-east-1
```

4. **Create Task Definition** (save as `task-definition.json`)
```json
{
  "family": "kilian-rohde-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "nextjs-app",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/kilian-rohde-frontend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NEXT_PUBLIC_API_BASE_URL",
          "value": "http://23.20.201.40:8080"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/kilian-rohde",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

5. **Register Task Definition**
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

6. **Create Application Load Balancer**
- Create ALB in AWS Console
- Create target group (port 3000)
- Configure security groups (allow 80/443)

7. **Create ECS Service**
```bash
aws ecs create-service \
  --cluster kilian-rohde-cluster \
  --service-name kilian-rohde-service \
  --task-definition kilian-rohde-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=nextjs-app,containerPort=3000"
```

---

## Option 2: AWS App Runner (Easiest)

```bash
aws apprunner create-service \
  --service-name kilian-rohde-frontend \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/kilian-rohde-frontend:latest",
      "ImageRepositoryType": "ECR",
      "ImageConfiguration": {
        "Port": "3000",
        "RuntimeEnvironmentVariables": {
          "NEXT_PUBLIC_API_BASE_URL": "http://23.20.201.40:8080"
        }
      }
    },
    "AutoDeploymentsEnabled": true
  }' \
  --instance-configuration '{
    "Cpu": "1 vCPU",
    "Memory": "2 GB"
  }'
```

---

## Option 3: AWS EC2 with Docker

1. **Launch EC2 Instance** (Amazon Linux 2023)

2. **SSH and Install Docker**
```bash
ssh -i key.pem ec2-user@<ec2-ip>
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo usermod -a -G docker ec2-user
```

3. **Install Docker Compose**
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

4. **Deploy Application**
```bash
git clone <your-repo>
cd kilian-rodhe-last-
docker-compose up -d
```

5. **Configure Security Group**
- Allow inbound: Port 3000 (or 80/443 with nginx)

---

## Option 4: AWS Amplify (Managed Next.js)

1. Connect GitHub repository
2. Configure build settings (auto-detected)
3. Add environment variables
4. Deploy automatically on push

---

## Cost Comparison

| Service | Monthly Cost (est.) | Scalability | Complexity |
|---------|---------------------|-------------|------------|
| ECS Fargate | $30-50 | High | Medium |
| App Runner | $25-40 | Medium | Low |
| EC2 (t3.small) | $15-20 | Manual | Medium |
| Amplify | $15-30 | Auto | Very Low |

---

## Post-Deployment

1. **Setup CloudFront CDN**
2. **Configure Route 53 DNS**
3. **Enable SSL with ACM**
4. **Setup CloudWatch monitoring**
5. **Configure auto-scaling**

---

## Local Docker Testing

```bash
# Build and run
docker-compose up --build

# Access at http://localhost:3000

# Stop
docker-compose down
```
