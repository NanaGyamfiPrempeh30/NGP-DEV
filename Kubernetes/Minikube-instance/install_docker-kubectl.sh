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
  curl -LO "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/$(dpkg --print-architecture)/kubectl"
  curl -LO "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/$(dpkg --print-architecture)/kubectl.sha256"
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
