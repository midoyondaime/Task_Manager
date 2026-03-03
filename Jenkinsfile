pipeline { 
  agent any

  stages {
    stage ("Checkout") 
    {
           checkout scm
    }
    stage ("Install dependencies") 
    {
      sh " npm install"
    }
  }
}

