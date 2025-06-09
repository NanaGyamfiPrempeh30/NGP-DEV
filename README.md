# AWS Boto3 Automation with Terraform

This project provides a Terraform configuration to provision AWS resources (IAM roles and S3 buckets) and a Python script using Boto3 to interact with the provisioned S3 bucket. The automation sets up an S3 bucket with an associated IAM role and policy, and the Python script demonstrates basic S3 operations.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites
- **AWS Account**: Active AWS account with credentials configured.
- **Terraform**: Version 1.5.0 or higher installed.
- **Python**: Version 3.8 or higher with Boto3 installed.
- **AWS CLI**: Configured with appropriate credentials (`aws configure`).
- **Git**: For cloning the repository.

## Project Structure
```
aws-boto3-terraform/
├── iam.tf               # Defines IAM role and policy attachment
├── S3_policy.json       # JSON policy for S3 bucket access
├── main.tf              # Defines S3 bucket and other resources
├── provider.tf          # AWS provider configuration
├── main.py              # Python script for S3 operations using Boto3
└── README.md            # Project documentation
```

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/NanaGyamfiPrempeh30/NGP-DEV.git
   cd Boto3
   ```

2. **Configure AWS Credentials**:
   Ensure AWS credentials are set up in `~/.aws/credentials` or via environment variables:
   ```bash
   export AWS_ACCESS_KEY_ID="your-access-key"
   export AWS_SECRET_ACCESS_KEY="your-secret-key"
   export AWS_DEFAULT_REGION="us-east-1"
   ```

3. **Install Dependencies**:
   - Install Terraform: Follow [Terraform's official installation guide](https://www.terraform.io/downloads.html).
   - Install Python dependencies:
     ```bash
     pip install boto3
     ```

4. **Initialize Terraform**:
   ```bash
   terraform init
   ```

5. **Apply Terraform Configuration**:
   ```bash
   terraform plan
   terraform apply
   ```
   Confirm the apply action by typing `yes` when prompted.

## Usage
1. **Terraform Resources**:
   - The `main.tf` file creates an S3 bucket.
   - The `iam.tf` file creates an IAM role with an attached policy defined in `S3_policy.json`.
   - The `provider.tf` file configures the AWS provider.

2. **Running the Python Script**:
   - Update `main.py` with the S3 bucket name output by Terraform (check `terraform output`).
   - Execute the script to perform S3 operations (e.g., upload, list, download files):
     ```bash
     python main.py
     ```

3. **Example Terraform Output**:
   After running `terraform apply`, retrieve the bucket name:
   ```bash
   terraform output
   ```

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m "Add YourFeature"`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
