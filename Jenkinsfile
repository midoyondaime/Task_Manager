pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            
        }
    }

    stages {

        stage("Checkout") {
             steps {
                 checkout scm
             } 
         }

        stage("Install Dependencies") {
            steps {
                sh 'npm ci'
            }
        }

        stage('Check node') {
            steps {
                sh """
                which node
                which npm
                """
            }
        }

        stage("Test") {
            steps {
                // We use one 'sh' block so the environment stays consistent
                sh """
                    npm test
                """
            }
            
            post {
                always {
                     // Commonly used to archive test reports
                    sh """
                    echo "I run no matter what happens in the tests!"
                    """
                }
                success {
                    echo "Tests passed! Deployment is now possible."
                }
                failure {
                    echo "Tests failed. Check the logs immediately."
                }
            }
        }

        
    }
}





