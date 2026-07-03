pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-docker-registry.com'
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        SONAR_CREDENTIALS = credentials('sonar-token')
        GIT_CREDENTIALS = credentials('git-credentials')
        PROJECT_NAME = 'smarttalent-rh'
        BRANCH_NAME = "${env.GIT_BRANCH}"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/your-repo/smarttalent-rh.git',
                    credentialsId: "${GIT_CREDENTIALS}"
            }
        }
        
        stage('Clean') {
            steps {
                sh 'mvn clean'
            }
        }
        
        stage('Compile') {
            steps {
                sh 'mvn compile -DskipTests'
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner " +
                            "-Dsonar.projectKey=${PROJECT_NAME} " +
                            "-Dsonar.projectName=${PROJECT_NAME} " +
                            "-Dsonar.sources=backend " +
                            "-Dsonar.java.binaries=backend/**/target/classes " +
                            "-Dsonar.tests=backend " +
                            "-Dsonar.java.test.binaries=backend/**/target/test-classes " +
                            "-Dsonar.junit.reportPaths=backend/**/target/surefire-reports " +
                            "-Dsonar.login=${SONAR_CREDENTIALS}"
                    }
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                script {
                    timeout(time: 10, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }
        
        stage('Package') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    def services = [
                        'discovery-server:backend/discovery-server/discovery-server',
                        'config-server:backend/config-server',
                        'gateway-server:backend/gateway-server',
                        'auth-service:backend/auth-service',
                        'employee-service:backend/employee/employee/employee',
                        'conge-service:backend/conge/conge/conge',
                        'paie-service:backend/paie/paie/paie',
                        'notification-service:backend/notification',
                        'ai-service:backend/ai-service',
                        'recruitment-service:backend/recruitment-service'
                    ]
                    
                    services.each { service ->
                        def parts = service.split(':')
                        def serviceName = parts[0]
                        def contextPath = parts[1]
                        
                        sh """
                            docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}-${serviceName}:${BUILD_NUMBER} ${contextPath}
                            docker tag ${DOCKER_REGISTRY}/${PROJECT_NAME}-${serviceName}:${BUILD_NUMBER} ${DOCKER_REGISTRY}/${PROJECT_NAME}-${serviceName}:latest
                        """
                    }
                }
            }
        }
        
        stage('Push Docker Images') {
            steps {
                script {
                    def services = [
                        'discovery-server',
                        'config-server',
                        'gateway-server',
                        'auth-service',
                        'employee-service',
                        'conge-service',
                        'paie-service',
                        'notification-service',
                        'ai-service',
                        'recruitment-service'
                    ]
                    
                    services.each { serviceName ->
                        sh """
                            echo ${DOCKER_CREDENTIALS} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin ${DOCKER_REGISTRY}
                            docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}-${serviceName}:${BUILD_NUMBER}
                            docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}-${serviceName}:latest
                        """
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                sh """
                    kubectl set image deployment/${PROJECT_NAME}-discovery-server discovery-server=${DOCKER_REGISTRY}/${PROJECT_NAME}-discovery-server:${BUILD_NUMBER} -n staging
                    kubectl set image deployment/${PROJECT_NAME}-config-server config-server=${DOCKER_REGISTRY}/${PROJECT_NAME}-config-server:${BUILD_NUMBER} -n staging
                    kubectl set image deployment/${PROJECT_NAME}-gateway-server gateway-server=${DOCKER_REGISTRY}/${PROJECT_NAME}-gateway-server:${BUILD_NUMBER} -n staging
                    kubectl set image deployment/${PROJECT_NAME}-auth-service auth-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-auth-service:${BUILD_NUMBER} -n staging
                    kubectl set image deployment/${PROJECT_NAME}-employee-service employee-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-employee-service:${BUILD_NUMBER} -n staging
                    kubectl set image deployment/${PROJECT_NAME}-conge-service conge-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-conge-service:${BUILD_NUMBER} -n staging
                    kubectl set image deployment/${PROJECT_NAME}-paie-service paie-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-paie-service:${BUILD_NUMBER} -n staging
                    kubectl set image deployment/${PROJECT_NAME}-notification-service notification-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-notification-service:${BUILD_NUMBER} -n staging
                    kubectl set image deployment/${PROJECT_NAME}-ai-service ai-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-ai-service:${BUILD_NUMBER} -n staging
                    kubectl set image deployment/${PROJECT_NAME}-recruitment-service recruitment-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-recruitment-service:${BUILD_NUMBER} -n staging
                """
            }
        }
        
        stage('Integration Tests') {
            when {
                branch 'main'
            }
            steps {
                sh 'mvn verify -DskipUnitTests -Dit.test=*IT'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
                expression {
                    currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            input {
                message 'Deploy to Production?'
                ok 'Deploy'
                parameters {
                    string(name: 'DEPLOY_ENV', defaultValue: 'production', description: 'Deployment environment')
                }
            }
            steps {
                sh """
                    kubectl set image deployment/${PROJECT_NAME}-discovery-server discovery-server=${DOCKER_REGISTRY}/${PROJECT_NAME}-discovery-server:${BUILD_NUMBER} -n production
                    kubectl set image deployment/${PROJECT_NAME}-config-server config-server=${DOCKER_REGISTRY}/${PROJECT_NAME}-config-server:${BUILD_NUMBER} -n production
                    kubectl set image deployment/${PROJECT_NAME}-gateway-server gateway-server=${DOCKER_REGISTRY}/${PROJECT_NAME}-gateway-server:${BUILD_NUMBER} -n production
                    kubectl set image deployment/${PROJECT_NAME}-auth-service auth-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-auth-service:${BUILD_NUMBER} -n production
                    kubectl set image deployment/${PROJECT_NAME}-employee-service employee-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-employee-service:${BUILD_NUMBER} -n production
                    kubectl set image deployment/${PROJECT_NAME}-conge-service conge-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-conge-service:${BUILD_NUMBER} -n production
                    kubectl set image deployment/${PROJECT_NAME}-paie-service paie-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-paie-service:${BUILD_NUMBER} -n production
                    kubectl set image deployment/${PROJECT_NAME}-notification-service notification-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-notification-service:${BUILD_NUMBER} -n production
                    kubectl set image deployment/${PROJECT_NAME}-ai-service ai-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-ai-service:${BUILD_NUMBER} -n production
                    kubectl set image deployment/${PROJECT_NAME}-recruitment-service recruitment-service=${DOCKER_REGISTRY}/${PROJECT_NAME}-recruitment-service:${BUILD_NUMBER} -n production
                """
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
