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
        
     }
}


