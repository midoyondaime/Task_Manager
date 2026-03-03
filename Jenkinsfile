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
          sudo install npm
          npm install
          """
        }
      }
    }
  }
}

