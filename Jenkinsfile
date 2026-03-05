// pipeline {
//     agent {
//         docker {
//             image 'node:20-alpine'
            
//         }
//     }

//     stages {

//         stage("Checkout") {
//              steps {
//                  checkout scm
//              } 
//          }

//         stage("Install Dependencies") {
//             steps {
//                 sh 'npm ci'
//             }
//         }

//         stage('Check node') {
//             steps {
//                 sh """
//                 which node
//                 which npm
//                 """
//             }
//         }

//         stage("Test") {
//             steps {
//                 // We use one 'sh' block so the environment stays consistent
//                 sh """
//                     npm test
//                 """
//             }
            
//             post {
//                 always {
//                      // Commonly used to archive test reports
//                     sh """
//                     echo "I run no matter what happens in the tests!"
//                     """
//                 }
//                 success {
//                     echo "Tests passed! Deployment is now possible."
//                 }
//                 failure {
//                     echo "Tests failed. Check the logs immediately."
//                 }
//             }
//         }

        
//     }
// }





pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "task-manager"
        IMAGE_TAG    = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            agent any
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:18-alpine'
                }
            }
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            agent {
                docker {
                    image 'node:18-alpine'
                }
            }
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            agent any
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                    docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                """
            }
        }

        // stage('Push Docker Image') {
        //     agent any
        //     when {
        //         branch 'main'
        //     }
        //     steps {
        //         withCredentials([usernamePassword(
        //             credentialsId: 'dockerhub-creds',
        //             usernameVariable: 'DOCKER_USER',
        //             passwordVariable: 'DOCKER_PASS'
        //         )]) {
        //             sh """
        //                 echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
        //                 docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
        //                 docker push ${DOCKER_IMAGE}:latest
        //                 docker logout
        //             """
        //         }
        //     }
        // }
    }

    post {
        success {
            echo "Build #${BUILD_NUMBER} completed successfully."
        }
        failure {
            echo "Build #${BUILD_NUMBER} failed."
        }
        always {
            cleanWs()
        }
    }
}