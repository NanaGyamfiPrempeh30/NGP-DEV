# IAM USER Resource 
resource "aws_iam_user" "s3_access_user" {
  name = "ygp-buk"
}
# IAM Policy 
resource "aws_iam_policy" "s3_access_policy" {
  name        = "S3AccessPolicy"
  description = "Policy to allow S3 access to specific bucket"
  policy      = file("C:/Users/Yawgy/terraforms-demo/Boto3/Terra_S3/S3_policy.json")
}

# IAM Policy Attachment
resource "aws_iam_user_policy_attachment" "s3_access_user_policy_attachment" {
  user       = aws_iam_user.s3_access_user.name
  policy_arn = aws_iam_policy.s3_access_policy.arn
}

# IAM Access Key
resource "aws_iam_access_key" "s3_access_key" {
  user = aws_iam_user.s3_access_user.name
}

output "s3_access_key" {
  sensitive = true
  value = {
    id     = aws_iam_access_key.s3_access_key.id
    secret = aws_iam_access_key.s3_access_key.secret
    
  }
}
