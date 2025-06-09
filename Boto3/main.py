import os
import boto3
from python_terraform import Terraform

# Initialize Terraform
def init_terraform(terraform_dir):
    terraform = Terraform(working_dir=terraform_dir)
    print("Initializing Terraform...")
    return_code, stdout, stderr = terraform.init()
    if return_code != 0:
        print(f"Terraform init failed with error: {stderr}")
        exit(1)
    print("Terraform initialized successfully.")
    return terraform

# Apply Terraform configuration
def apply_terraform(terraform):
    print("Applying Terraform configuration...")
    return_code, stdout, stderr = terraform.apply(skip_plan=True)
    if return_code != 0:
        print(f"Terraform apply failed with error: {stderr}")
        exit(1)
    print("Terraform applied successfully.")

# Upload a file to S3 bucket using Boto3
def upload_file_to_s3(bucket_name, file_path,  object_name, aws_access_key_id, aws_secret_access_key): 
    s3_client = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key) 
    try:
        s3_client.upload_file(file_path, bucket_name, object_name)
        print(f"File {object_name} uploaded successfully to {bucket_name}")
    except Exception as e:
        print(f"Error uploading file: {e}")
        exit(1)

if __name__ == "__main__":
    # Define paths and bucket details
    terraform_dir = r"C:\Users\Yawgy\terraforms-demo\Boto3\Terra_S3"
    file_path = r"C:\Users\Yawgy\terraforms-demo\Boto3\YGP_buklogs2024.txt"
    bucket_name = "ygp-buk-320"
    object_name = "YGP_buklogs2024.txt"

    # Initialize and apply Terraform
    terraform = init_terraform(terraform_dir)
    apply_terraform(terraform)

    # Retrieve the IAM user's access keys
    terraform_output = terraform.output()
    aws_access_key_id = terraform_output['s3_access_key']['value']['id']
    aws_secret_access_key = terraform_output['s3_access_key']['value']['secret']

    # Upload file to S3
    upload_file_to_s3(bucket_name, file_path, object_name, aws_access_key_id, aws_secret_access_key)
