# AWS S3 Bucket Resource 
resource "aws_s3_bucket" "ygp_buk" {
  bucket = "ygp-buk-320"

  tags = {
    Name = "YGP-BUK"
  }

}


