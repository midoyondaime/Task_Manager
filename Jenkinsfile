pipeline {
  agent any
  environment {
        // This prepends your paths to the system PATH for the whole pipeline
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/games:/usr/local/games:${env.PATH}"
    }

  stages {
    stage("Checkout") {
      steps {
        checkout scm
      }
    }

    stage("Install dependencies") {
      steps {
        script {
        sh """
          sudo apt install nodejs -y
          """
        sh 'npm install'
        }
      }
    }
  }
}












