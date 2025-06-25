#############################
# Data Source
##############################H

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
resource "aws_key_pair" "container-key" {
  key_name   = "container-key"
  public_key = file("container-key.pem.pub")
}


resource "aws_instance" "container-ec2" {
  ami                    = data.aws_ami.ubuntu-2204-LTS.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.container.id
  vpc_security_group_ids = [aws_security_group.webserver-security-group.id]
  key_name               = aws_key_pair.container-key.key_name
  tags = {
    Name = "container-ec2"
  }

  user_data = <<-EOF
              #!/bin/bash
              echo "Copying install-docker.sh"
              cat << 'SCRIPT' > /tmp/install-docker.sh
              ${file("install-docker.sh")}
              SCRIPT
              echo "Making script executable"
              chmod +x /tmp/install-docker.sh
              echo "Running install script"
              /tmp/install-docker.sh
              echo "Install script completed"
              EOF


}
output "publicIP" {
  value = aws_instance.container-ec2.public_ip
}
output "privateIP" {
  value = aws_instance.container-ec2.private_ip
}

