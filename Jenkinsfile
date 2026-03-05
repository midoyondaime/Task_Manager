pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "midoyondaime/task-manager"
        IMAGE_TAG    = "${BUILD_NUMBER}"
        NODE_ENV     = "test"
    }

    options {
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timestamps()
    }

    stages {

        // ---------------------------------------------------------------------
        // STAGE 1 — Checkout
        // Runs on the Jenkins agent itself (no Docker needed).
        // 'checkout scm' pulls the repo that triggered this build.
        // ---------------------------------------------------------------------
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git log -1 --oneline'
            }
        }

        // ---------------------------------------------------------------------
        // STAGE 2 — Install & Test
        // Both steps run in the SAME container so node_modules is available
        // to the test runner without any workspace handoff tricks.
        //
        // '--tmpfs /.npm' mounts a fresh in-memory filesystem at /.npm on
        // every run, preventing the root-owned cache permission error.
        //
        // '--cache /tmp/npm-cache' tells npm ci to use a path the container
        // user can actually write to.
        // ---------------------------------------------------------------------
        stage('Install and Test') {
            agent {
                docker {
                    image 'node:18-alpine'
                    args '--tmpfs /.npm'
                }
            }
            environment {
                // jest-junit reads these to write the XML report Jenkins needs.
                JEST_JUNIT_OUTPUT_DIR  = "test-results"
                JEST_JUNIT_OUTPUT_NAME = "results.xml"
            }
            steps {
                sh 'npm ci --cache /tmp/npm-cache'
                sh 'mkdir -p test-results'
                sh 'npm test'
            }
            post {
                always {
                    // Publishes results so Jenkins tracks pass/fail over time.
                    junit allowEmptyResults: true, testResults: 'test-results/results.xml'
                }
                success { echo "✅ All tests passed." }
                failure { echo "❌ Tests failed — check the Test Results tab." }
            }
        }

        // ---------------------------------------------------------------------
        // STAGE 3 — Build Docker Image
        // Only runs on main/master — no point building an image for every
        // feature branch. 'when' is how you gate stages in Jenkins.
        // ---------------------------------------------------------------------
        stage('Build Docker Image') {
            //when {
            //    anyOf {
            //        branch 'main'
            //        branch 'master'
            //    }
            //}
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                    docker tag  ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Test Docker Login') {
            steps {
        withCredentials([usernamePassword(
            credentialsId: 'docker_hub',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
        )]) {
            sh """
                echo "Username is: \$DOCKER_USER"
                echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
            """
        }
    }
}

        // ---------------------------------------------------------------------
        // STAGE 4 — Push to Registry  (uncomment when ready)
        // 'withCredentials' pulls secrets from Jenkins Credential Store and
        // masks them in logs automatically — never hardcode passwords.
        //
        // Setup:
        //   1. Manage Jenkins → Credentials → Add Credential
        //   2. Kind: "Username with password"
        //   3. ID: "dockerhub-credentials"
        // ---------------------------------------------------------------------
        stage('Push Docker Image') {
            steps {
        withCredentials([usernamePassword(
            credentialsId: 'docker_hub',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
        )]) {
            sh """
                set +x
                echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                docker push ${DOCKER_IMAGE}:latest
            """
        }
    }
 }

    } // end stages

    // -------------------------------------------------------------------------
    // POST BLOCK
    // Runs after all stages complete.
    // 'unstable' = tests ran but some failed (set by junit step).
    // 'always'   = guaranteed to run regardless of outcome.
    // -------------------------------------------------------------------------
    // post {
    //     // success {
    //     //     echo "🚀 Build #${BUILD_NUMBER} succeeded. Image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
    //     // }
    //     unstable {
    //         echo "⚠️  Build #${BUILD_NUMBER} unstable — test failures detected."
    //     }
    //     always {
    //         echo "💥 Build #${BUILD_NUMBER} failed."
    //         // Ready to add notifications here:
    //         //@mail to: 'mehdiusumaki@gmail.com', subject: "FAILED: ${JOB_NAME} #${BUILD_NUMBER}"
    //     }
    //     //always {
    //         // Wipes the workspace after every build — keeps disk usage clean.
    //     //    cleanWs()
    //     //}
    // }
    post {
        failure {
            mail to: 'mehdiusumaki@gmail.com',
                 subject: "FAILED: ${JOB_NAME} #${BUILD_NUMBER}",
                 body: "Job '${JOB_NAME}' build #${BUILD_NUMBER} failed.\n\nCheck it at: ${BUILD_URL}"
        }
        success {
            mail to: 'mehdiusumaki@gmail.com',
                 subject: "SUCCESS: ${JOB_NAME} #${BUILD_NUMBER}",
                 body: "Job '${JOB_NAME}' build #${BUILD_NUMBER} completed successfully."
        }
    }
}
