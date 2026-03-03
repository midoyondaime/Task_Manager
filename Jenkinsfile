pipeline {
  agent any

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

        sh 'echo $PATH'
        sh 'export PATH="$(PATH):/usr/games:/usr/local/games'

        sh 'which npm'
        sh 'npm install'
        }
      }
    }
  }
}








