## CI/CD Pipeline with Jenkins, SonarQube, and Nexus

Once you’ve provisioned Jenkins, SonarQube, and Nexus on AWS EC2 instances using the Terraform steps provided in this repository, you’re ready to start running your CI pipelines with Jenkins. There are two primary ways to execute your pipelines:

### 1. **Pipeline Script (Inline)**

Create a pipeline job in Jenkins and paste the contents of your `Jenkinsfile` directly into the **Pipeline Script** section.
This method is quick and convenient for testing or setting up simple pipelines without relying on version control.

### 2. **Pipeline from SCM (Source Control Management)**

For a more scalable and maintainable approach, configure Jenkins to load the pipeline script from a source control repository (e.g., Git).

To set this up:

* Open Jenkins and create a new **Pipeline** job.
* Choose **Pipeline from SCM** as the definition method.
* Provide the repository URL and specify the branch containing your `Jenkinsfile`.
* If your `Jenkinsfile` is not in the root directory, specify its location in the **Script Path** field (e.g., `ci/Jenkinsfile`).

### Example Jenkins Pipeline Configuration

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                // Example build step
                sh 'mvn clean install'
            }
        }
        stage('Test') {
            steps {
                // Run unit tests
                sh 'mvn test'
            }
        }
        stage('Deploy to Nexus') {
            steps {
                // Deploy artifacts to Nexus
                sh 'mvn deploy'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                // SonarQube code analysis
                withSonarQubeEnv('MySonarQube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
    }
}
