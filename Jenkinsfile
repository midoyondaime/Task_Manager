pipeline {
    agent {
        docker { image 'node:18-alpine' }
    }

    stages {
        stage("Install & Build") {
            steps {
                // We use one 'sh' block so the environment stays consistent
                sh """
                    # Verify they are there
                    which node
                    which npm
                    
                    # Run the install
                    npm install
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
















