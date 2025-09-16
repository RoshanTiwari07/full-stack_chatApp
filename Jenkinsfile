pipeline{
    agent any 

    parameters{
        string(name: FRONTEND_DOCKERTAG, defaultValue: 'latest', description: 'Tag for the frontend Docker image')
        string(name: BACKEND_DOCKERTAG, defaultValue: 'latest', description: 'Tag for the backend Docker image')
    }
    
    stages{
        stage("Validate parameters"){
            steps{
                script {
                if(params.FRONTEND_DOCKERTAG == '' || params.BACKEND_DOCKERTAG == ''){
                    error("Docker image tags for frontend and backend must be provided.")
                }
            }
        }

        stage("Workspace Cleanup"){
            steps{
                script {
                cleanWs()
                }
            }
        }
        stage("Git: Code Checkout"){
            steps{
                script {
                code_checkout("https://github.com/RoshanTiwari07/full-stack_chatApp.git", "main")
                }
            }
        }
        stage("Trivy: Filesystem Scanning"){
            steps{
                script {
                    trivy_scan()
                }
            }
        }
        stage("OWASP: Dependency check"){
            steps{
                script{
                    owasp_dependency()
                }
            }
        }
        stage("SonarQube: Code Analysis"){
            steps{
                script{
                    sonarqube_analysis("Sonar","todo","todo")
                }
            }
        }
        stage("SonarQube: Code Quality Gates"){
            steps{
                script{
                    sonarqube_code_quality()
                }
            }
        }
        stage('Exporting environment variables') {
            parallel{
                stage("Backend env setup"){
                    steps {
                        script{
                            dir("Automations"){
                                sh "bash updatebackendnew.sh"
                            }
                        }
                    }
                }
            }
        }
        stage("Frontend env setup"){
                    steps {
                        script{
                            dir("Automations"){
                                sh "bash updatefrontendnew.sh"
                            }
                        }
                    }
                }
            }
        }
        stage("Docker: Build"){
            steps{
                script {
                    dir('backend'){
                            docker_build("chatapp-backend","${params.BACKEND_DOCKERTAG}","roshan03ish")
                    }
                    dir('frontend'){
                            docker_build("chatapp-frontend","${params.FRONTEND_DOCKERTAG}","roshan03ish")
                    }
                }
            }
        }
        stage("Docker: Push"){
            steps{
                script {
                    docker_push("chatapp-backend","${params.BACKEND_DOCKERTAG}","roshan03ish")
                    docker_push("chatapp-frontend","${params.FRONTEND_DOCKERTAG}","roshan03ish")
                }
            }
        }
        post{
        success{
            archiveArtifacts artifacts: '*.xml', followSymlinks: false
            build job: "todo-CD", parameters: [
                string(name: 'FRONTEND_DOCKERTAG', value: "${params.FRONTEND_DOCKERTAG}"),
                string(name: 'BACKEND_DOCKERTAG', value: "${params.BACKEND_DOCKERTAG}")
            ]
        }
    }
}