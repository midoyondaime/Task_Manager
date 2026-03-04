pipeline {
    agent any

    stages {
        stage("Install & Build") {
            steps {
                // We use one 'sh' block so the environment stays consistent
                sh """
                    sudo apt update
                    sudo apt install nodejs npm -y

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

        stage("Buildc Docker") {
            steps {
                // We use one 'sh' block so the environment stays consistent
                sh """
                    docker build -t image:tag .
                """
            }
        }
    }
}
