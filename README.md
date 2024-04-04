---

# On-Premise Data Migration to Cloud with AWS, GCP, and Terraform

This repository contains Terraform scripts and documentation for migrating on-premise data to the cloud using Amazon Web Services (AWS) and Google Cloud Platform (GCP). The Terraform scripts automate the provisioning of cloud resources required for data migration, enabling a seamless transition from on-premise infrastructure to the cloud.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)

## Overview

In this repository, you will find Terraform modules and configuration files designed to facilitate the migration of on-premise data to AWS and GCP. The migration process involves provisioning cloud infrastructure such as virtual machines, storage buckets, databases, networking components, and more.

The key components of this migration include:

- **AWS**: Provisioning EC2 instances, S3 buckets, RDS databases, VPC, and related services using Terraform.
- **GCP**: Provisioning Compute Engine instances, Cloud Storage buckets, Cloud SQL databases, VPC networks, and related services using Terraform.
- **Terraform**: Infrastructure-as-Code (IaC) tool used to automate the provisioning and management of cloud resources.

## Prerequisites

Before getting started with the migration process, ensure you have the following prerequisites installed and configured:

- Terraform CLI (version >= X.XX): Install Terraform by following the [official installation guide](https://learn.hashicorp.com/tutorials/terraform/install-cli).
- AWS CLI: Configure the AWS CLI with appropriate IAM credentials for accessing AWS resources.
- GCP SDK (gcloud): Configure the GCP SDK with appropriate credentials for accessing GCP resources.

## Getting Started

To start migrating your on-premise data to AWS and GCP using Terraform, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/NanaGyamfiPrempeh30/data-migration-to-cloud.git
   ```

2. Navigate to the project directory:

   ```bash
   cd /c/Multi-Cloud Terraform Training\mission1\en\terraform
   ```

3. Review and customize the Terraform configuration files (`*.tf`) in the `terraform/` directory based on your migration requirements.

4. Initialize Terraform and download provider plugins:

   ```bash
   terraform init
   ```

5. Plan and preview the Terraform execution plan:

   ```bash
   terraform plan
   ```

6. Apply the Terraform configuration to provision resources in AWS and GCP:

   ```bash
   terraform apply
   ```

7. Monitor the execution and verify the successful provisioning of cloud resources.

## Usage

The Terraform scripts provided in this repository can be customized and extended to meet specific migration scenarios and requirements. Modify the Terraform configuration files (`*.tf`) based on your infrastructure needs, such as specifying instance types, storage configurations, networking settings, etc.

## Contributing

Contributions to this repository are welcome! If you have suggestions, improvements, or new features to add, please submit a pull request with your changes.

---
