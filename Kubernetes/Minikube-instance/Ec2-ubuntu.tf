#############################
# Data Source
##############################

data "aws_ami" "ubuntu-2204-LTS" {
  most_recent = true
  owners      = ["099720109477"] # Canonical's AWS account ID for Ubuntu images

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"] # This pattern should match the AMI name you're looking for
  }

  filter {
    name   = "state"
    values = ["available"]
  }

  # The "owner-alias" filter is not needed, as "owners" is already specified
}


##############################
###  EC2 Instance 
#############################
resource "aws_key_pair" "minikube-key" {
  key_name   = "minikube-key"
  public_key = file("minikube-key.pem.pub")
}


resource "aws_instance" "container-ec2" {
  ami                    = data.aws_ami.ubuntu-2204-LTS.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.container.id
  vpc_security_group_ids = [aws_security_group.webserver-security-group.id]
  key_name               = aws_key_pair.minikube-key.key_name
  tags = {
    Name = "container-ec2"
  }

  user_data = <<-EOF
              #!/bin/bash

              # Exit on any error
              set -e

              # Log output to a file for debugging
              exec > /var/log/user-data.log 2>&1

              echo "Starting user_data script"

              # Update package index
              apt-get update

              # Install prerequisites
              apt-get install -y apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release

              # Add Docker’s GPG key
              mkdir -p /usr/share/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

              # Set up Docker repository
              echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

              # Update package index again
              apt-get update

              # Install Docker
              apt-get install -y docker-ce docker-ce-cli containerd.io

              # Ensure Docker service is running
              systemctl enable --now docker

              # Wait for Docker to be ready
              echo "Waiting for Docker to be ready..."
              until docker ps >/dev/null 2>&1; do sleep 1; done

              # Install kubectl
              KUBECTL_VERSION=$(curl -L -s https://dl.k8s.io/release/stable.txt)
              curl -LO "https://dl.k8s.io/release/$KUBECTL_VERSION/bin/linux/$(dpkg --print-architecture)/kubectl"
              curl -LO "https://dl.k8s.io/release/$KUBECTL_VERSION/bin/linux/$(dpkg --print-architecture)/kubectl.sha256"
              if ! echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check; then
                echo "kubectl checksum verification failed!"
                exit 1
              fi
              install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

              # Install Minikube
              curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-$(dpkg --print-architecture)
              install -o root -g root -m 0755 minikube-linux-$(dpkg --print-architecture) /usr/local/bin/minikube

              # Add ubuntu user to docker group (for non-root Docker access)
              sudo usermod -aG docker ubuntu && newgrp docker
              sudo usermod -aG docker ubuntu
              sudo systemctl restart  docker

              # Start Minikube as ubuntu user
              echo "Starting Minikube..."
              sudo -u ubuntu minikube start --driver=docker

              echo "user_data script completed"
            EOF

}


output "publicIP" {
  value = aws_instance.container-ec2.public_ip
}
output "privateIP" {
  value = aws_instance.container-ec2.private_ip
}

