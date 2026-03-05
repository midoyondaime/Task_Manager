pipeline {
    // 'agent any' at the top level is the fallback.
    // Individual stages override this with their own agents.
    agent any

    // -------------------------------------------------------------------------
    // ENVIRONMENT BLOCK
    // Defines variables available to every stage.
    // Best practice: keep image names, tags, and credentials references here
    // so you only change them in one place.
    // -------------------------------------------------------------------------
    environment {
        DOCKER_IMAGE = "task-manager"
        IMAGE_TAG    = "${BUILD_NUMBER}"
        // NODE_ENV controls how npm behaves (e.g., skips devDependencies in prod)
        NODE_ENV     = "test"
    }

    // -------------------------------------------------------------------------
    // OPTIONS BLOCK
    // Pipeline-level settings. These are easy wins you should always include.
    // -------------------------------------------------------------------------
    options {
        // Kill the whole pipeline if it runs longer than 15 minutes.
        // Prevents runaway builds from consuming executor slots forever.
        timeout(time: 15, unit: 'MINUTES')

        // Keep only the last 10 builds in Jenkins history.
        // Saves disk space on the Jenkins controller.
        buildDiscarder(logRotator(numToKeepStr: '10'))

        // Prevent two builds of the same branch running at the same time.
        // Critical once you have real deployments — avoids race conditions.
        disableConcurrentBuilds()

        // Print timestamps next to every log line.
        // Makes it trivial to spot slow stages.
        timestamps()
    }

    stages {

        // ---------------------------------------------------------------------
        // STAGE 1 — Checkout
        // Runs on the Jenkins agent itself (no Docker needed here).
        // 'checkout scm' is a built-in step that pulls the repo that triggered
        // this build, using the SCM config from the job definition.
        // ---------------------------------------------------------------------
        stage('Checkout') {
            steps {
                checkout scm
                // Print the commit SHA so you always know exactly what was built.
                sh 'git log -1 --oneline'
            }
        }

        // ---------------------------------------------------------------------
        // STAGE 2 — Install Dependencies
        // Runs inside a fresh node:18-alpine container.
        // 'npm ci' is preferred over 'npm install' in CI:
        //   - Fails if package-lock.json is out of sync with package.json
        //   - Never modifies package-lock.json
        //   - Faster because it skips dependency resolution
        // ---------------------------------------------------------------------
        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:18-alpine'
                    // 'reuseNode true' makes this container stage reuse the
                    // workspace checked out in the previous agent-any stage.
                    // Without it, Jenkins creates a new workspace and your
                    // source code isn't there.
                    reuseNode true
                }
            }
            steps {
                sh 'rm -rf node_modules'   // ← add this line
                sh 'npm ci'
            }
        }

        // ---------------------------------------------------------------------
        // STAGE 3 — Lint  (new stage)
        // Static analysis catches bugs before tests even run.
        // Fast feedback = earlier failure = less wasted time.
        // Requires "lint": "eslint ." in your package.json scripts.
        // ---------------------------------------------------------------------
        stage('Lint') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm run lint'
            }
        }

        // ---------------------------------------------------------------------
        // STAGE 4 — Run Tests
        // 'post' inside a stage lets you react to that stage's result.
        // 'junit' publishes test results so Jenkins can:
        //   - Show a pass/fail graph over time
        //   - Display which specific tests failed inline in the UI
        // This requires your test runner to emit JUnit XML.
        // For Jest: add --reporters=jest-junit and set the env vars below.
        // ---------------------------------------------------------------------
        stage('Run Tests') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            environment {
                // jest-junit reads these to know where to write the XML report.
                JEST_JUNIT_OUTPUT_DIR  = "test-results"
                JEST_JUNIT_OUTPUT_NAME = "results.xml"
            }
            steps {
                sh 'mkdir -p test-results'
                sh 'npm test'
            }
            post {
                always {
                    // Publish JUnit XML so Jenkins tracks test trends.
                    junit allowEmptyResults: true, testResults: 'test-results/results.xml'
                }
                success {
                    echo "✅ All tests passed."
                }
                failure {
                    echo "❌ Tests failed — check the Test Results tab above."
                }
            }
        }

        // ---------------------------------------------------------------------
        // STAGE 5 — Build Docker Image
        // Wrapped in a 'when' block: only builds the image on the main branch.
        // 'when' is one of the most important Jenkins concepts to learn —
        // it lets you skip expensive stages on feature branches.
        //
        // Common 'when' conditions:
        //   branch 'main'              — matches branch name
        //   tag pattern: 'v*'          — matches a git tag
        //   changeRequest()            — only on pull requests
        //   environment name: 'X', value: 'Y'
        //   expression { return true } — arbitrary Groovy
        // ---------------------------------------------------------------------
        stage('Build Docker Image') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                    docker tag  ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                """
            }
        }

        // ---------------------------------------------------------------------
        // STAGE 6 — Push to Registry  (scaffolded for when you're ready)
        // 'withCredentials' safely injects secrets from Jenkins Credential Store.
        // The password NEVER appears in logs — Jenkins masks it automatically.
        //
        // To use this:
        //   1. Go to Manage Jenkins → Credentials → Add Credential
        //   2. Kind: "Username with password", ID: "dockerhub-credentials"
        //   3. Uncomment this stage
        // ---------------------------------------------------------------------
        // stage('Push Docker Image') {
        //     when { branch 'main' }
        //     steps {
        //         withCredentials([usernamePassword(
        //             credentialsId: 'dockerhub-credentials',
        //             usernameVariable: 'DOCKER_USER',
        //             passwordVariable: 'DOCKER_PASS'
        //         )]) {
        //             sh """
        //                 echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
        //                 docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
        //                 docker push ${DOCKER_IMAGE}:latest
        //             """
        //         }
        //     }
        // }

    } // end stages

    // -------------------------------------------------------------------------
    // POST BLOCK (pipeline level)
    // Runs after ALL stages complete, regardless of outcome.
    //
    // Execution order guarantee:
    //   always → then ONE of: success | unstable | failure | aborted
    //
    // 'unstable' means tests ran but some failed — different from a crash.
    // -------------------------------------------------------------------------
    post {
        success {
            echo "🚀 Build #${BUILD_NUMBER} succeeded. Image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
        }
        unstable {
            // Jenkins sets UNSTABLE when junit finds test failures but the
            // build itself didn't crash. Treat it differently from a hard failure.
            echo "⚠️  Build #${BUILD_NUMBER} is unstable — test failures detected."
        }
        failure {
            echo "💥 Build #${BUILD_NUMBER} failed."
            // LEARNING EXERCISE: add email/Slack notification here.
            // mail to: 'team@example.com', subject: "FAILED: ${JOB_NAME} #${BUILD_NUMBER}"
        }
        always {
            // cleanWs() deletes the workspace after every build.
            // Keeps disk usage predictable on long-lived agents.
            cleanWs()
        }
    }
}