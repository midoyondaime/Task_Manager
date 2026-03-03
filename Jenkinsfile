pipeline { 
  agent any

  stages {
    stage("Checkout"){
      steps {
           checkout scm
    }
    }
    stage("Install dependencies") {
      steps {
    {
      sh "npm install"
    }
  }
}


