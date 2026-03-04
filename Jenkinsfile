pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "my-app"
        // Use the Jenkins build number as a unique version tag
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Audit & Lint') {
            agent {
                docker { image 'node:18-alpine' }
            }
            steps {
                // This runs inside a temporary Node container!
                sh 'npm install'
                sh 'npm audit'
            }
        }

        stage('Test') {
            agent {
                docker { image 'node:18-alpine' }
            }
            steps {
                sh 'npm install'
                sh 'npm test'
            }
            post {
                always {
                    // Collect results before the container disappears
                    junit '**/test-results.xml' 
                }
            }
        }

        stage('Build & Push Image') {
            steps {
                script {
                    // Build using your Dockerfile
                    def app = docker.build("${DOCKER_IMAGE}:${IMAGE_TAG}")
                    
                    // Push to registry (requires configured credentials)
                    // docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-creds') {
                    //     app.push()
                    //     app.push("latest")
                    // }
                }
            }
        }
    }

    post {
        success {
            echo "Successfully built version ${IMAGE_TAG}"
        }
        cleanup {
            cleanWs() // Keeps the Jenkins server hard drive from filling up
        }
    }
}
