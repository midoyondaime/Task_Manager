// pipeline {
//     agent any
//     // agent {
//     //     docker {
//     //         image 'node:alpine:3.19'
//     //         args '-u root'
//     //     }
//     // }

//     stages {
//         stage("Checkout") {
//             steps {
//                 checkout scm
//             } 
//         }
//         stage("Install & Build") {
//             steps {
//                 // We use one 'sh' block so the environment stays consistent
//                 sh """
                    
//                     # Verify they are there
//                     which node
//                     which npm
                    
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

//         stage("Buildc Docker") {
//             steps {
//                 // We use one 'sh' block so the environment stays consistent
//                 sh """
//                     echo hello
//                 """
//             }
//         }
        
        
//      }
// }



pipeline {
    agent {
        docker {
            image 'node:alpine:3.19'
            args '-u root'
        }
    }

    stages {
        stage('Install curl') {
            steps {
                sh 'apk add --no-cache curl'
                sh 'curl --version'
            }
        }

        stage("Checkout") {
             steps {
                 checkout scm
             } 
         }
    }
}





