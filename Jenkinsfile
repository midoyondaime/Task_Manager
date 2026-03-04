pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "task-manager"
        IMAGE_TAG    = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            agent {
                dockerContainer {
                    image 'node:18-alpine'
                    args '-u root:root'
                }
            }
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            agent {
                dockerContainer {
                    image 'node:18-alpine'
                    args '-u root:root'
                }
            }
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                    docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Push Docker Image') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                        docker push ${DOCKER_IMAGE}:latest
                        docker logout
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Build #${BUILD_NUMBER} completed successfully."
        }
        failure {
            echo "Build #${BUILD_NUMBER} failed. Investigate immediately."
        }
        always {
            cleanWs()
        }
    }
}

// pipeline {
//     agent {
//         dockerContainer { image 'node:24.14.0-alpine3.23' }
//     }
//     stages {
//         stage('Test') {
//             steps {
//                 sh 'node --eval "console.log(process.platform,process.env.CI)"'
//             }
//         }
//    }
}



