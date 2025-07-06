## CI/CD Pipeline Documentation

### 1. Overview

This document outlines the Continuous Integration/Continuous Deployment (CI/CD) pipeline for the full-stack application, encompassing a Python backend and a React frontend. The pipeline, orchestrated via GitHub Actions, automates the build, test, and deployment processes, ensuring code quality, rapid iteration, and reliable delivery to a Kubernetes cluster.

### 2. Trigger Events

The pipeline is configured to automatically initiate upon the following events:

*   **`push` events**: Any code push to the `main`, `develop`, or `yoan` branches.
*   **`pull_request` events**: Any pull request targeting the `main`, `develop`, or `yoan` branches.

These triggers ensure that all code changes undergo automated testing and validation before being merged and potentially deployed.

### 3. Pipeline Jobs Breakdown

The CI/CD pipeline consists of three distinct jobs, executed sequentially or in parallel based on their dependencies:

#### 3.1. `build-and-test-backend`

This job is responsible for building and testing the Python backend application.

*   **Environment**: `ubuntu-latest` runner, Python 3.10.
*   **Key Steps**:
    *   **Checkout repository**: Retrieves the latest code from the GitHub repository.
    *   **Set up Python 3.10**: Configures the runner with the specified Python version.
    *   **Install dependencies**: Installs all required Python packages listed in `backend/requirements.txt` using `pip`.
    *   **Lint with flake8**: Performs static code analysis on the backend code to enforce coding standards and identify potential issues.
    *   **Test with pytest**: Executes unit and integration tests for the backend application using `pytest`.

#### 3.2. `build-and-test-frontend`

This job focuses on building and testing the React frontend application.

*   **Environment**: `ubuntu-latest` runner, Node.js 18.
*   **Key Steps**:
    *   **Checkout repository**: Retrieves the latest code.
    *   **Cache Node.js modules**: Caches `node_modules` to speed up subsequent runs by reusing previously downloaded dependencies.
    *   **Set up Node.js 18**: Configures the runner with the specified Node.js version.
    *   **Install dependencies**: Installs all frontend dependencies defined in `frontend/package.json` using `npm`.
    *   **Run tests**: Executes frontend tests (e.g., unit tests, component tests) using `npm test`.
    *   **Build the React app**: Compiles the React application into static assets ready for deployment using `npm run build`.
    *   **Lint with ESLint**: Performs static code analysis on the frontend code to maintain code quality and consistency.

#### 3.3. `deploy`

This job handles the deployment of the application to the Kubernetes cluster.

*   **Dependencies**: This job will only run after both `build-and-test-backend` and `build-and-test-frontend` jobs have successfully completed.
*   **Condition**: This job is conditionally executed only when a `push` event occurs on the `main` branch (`github.ref == 'refs/heads/main' && github.event_name == 'push'`). This ensures that only stable, production-ready code is deployed.
*   **Environment**: `ubuntu-latest` runner.
*   **Key Steps**:
    *   **Checkout code**: Retrieves the latest code.
    *   **Set up Docker Buildx**: Initializes Docker Buildx, enabling advanced Docker build features.
    *   **Log in to GitHub Container Registry**: Authenticates with `ghcr.io` using provided secrets, allowing Docker to push and pull images from the registry.
    *   **Set up kubectl**: Installs the `kubectl` command-line tool, which is used to interact with Kubernetes clusters.
    *   **Configure kubeconfig**: Decodes and configures the Kubernetes cluster credentials (`KUBE_CONFIG_DATA` secret) into the runner's `kubeconfig` file, enabling `kubectl` to connect to the cluster.
    *   **Create or Update Image Pull Secret**: Creates or updates a Kubernetes `imagePullSecret` named `regcred` using the GitHub Container Registry credentials. This secret allows Kubernetes pods to pull private Docker images from `ghcr.io`.
    *   **Deploy to Kubernetes**: Executes the `deploy.sh` script, passing the Git commit SHA as an argument. This script is responsible for building and pushing Docker images, and then applying Kubernetes deployment configurations.

### 4. Deployment Process to Kubernetes

The deployment to Kubernetes is orchestrated by the `deploy` job and the `deploy.sh` script:

1.  **Image Building and Pushing**: The `deploy.sh` script (executed within the `Deploy to Kubernetes` step) is responsible for:
    *   Building Docker images for both the backend and frontend applications.
    *   Tagging these images with the current Git commit SHA (`${{ github.sha }}`).
    *   Pushing the newly built images to the GitHub Container Registry (`ghcr.io`).
2.  **Kubernetes Configuration Application**: 
    *   The `kubectl` tool is set up and configured with the necessary cluster access credentials.
    *   An `imagePullSecret` (`regcred`) is created or updated in Kubernetes, allowing the cluster to authenticate with `ghcr.io` and pull the private application images.
    *   The `deploy.sh` script then uses `kubectl apply -f k8s/` to apply the Kubernetes deployment and service configurations defined in the `k8s/` directory.
    *   Finally, `kubectl set image` commands are used to update the running deployments with the newly pushed image tags, triggering a rolling update of the application pods.

### 5. Secrets Management

Sensitive information, such as registry credentials and Kubernetes cluster configuration, is securely managed using GitHub Actions secrets:

*   **`REGISTRY_USERNAME`**: GitHub username for logging into `ghcr.io`.
*   **`REGISTRY_TOKEN`**: Personal Access Token (PAT) with `read:packages` and `write:packages` scopes for `ghcr.io`.
*   **`KUBE_CONFIG_DATA`**: Base64 encoded content of the Kubernetes `kubeconfig` file, providing access to the cluster.

These secrets are stored securely within the GitHub repository settings and are not exposed in the workflow logs or code. They are accessed at runtime using `${{ secrets.SECRET_NAME }}`.

### 6. Benefits and Best Practices

This CI/CD pipeline incorporates several benefits and best practices:

*   **Automation**: Automates repetitive tasks like building, testing, and deploying, reducing manual errors and increasing efficiency.
*   **Consistency**: Ensures a consistent build and deployment process across all environments.
*   **Rapid Feedback**: Developers receive quick feedback on code changes through automated tests and linting.
*   **Code Quality**: Enforces code quality standards through linting for both backend and frontend.
*   **Dependency Caching**: Utilizes caching for Node.js modules to accelerate build times.
*   **Controlled Deployment**: The `deploy` job is conditional, ensuring that only code pushed to the `main` branch triggers a production deployment.
*   **Security**: Leverages GitHub Actions secrets for secure handling of sensitive credentials.
*   **Containerization**: Uses Docker for packaging applications, ensuring environment consistency from development to production.
*   **Orchestration**: Deploys to Kubernetes, providing scalability, high availability, and efficient resource management.

### 7. Prerequisites

To effectively utilize this CI/CD pipeline, the following prerequisites must be met:

*   **GitHub Repository**: The project code must be hosted in a GitHub repository.
*   **GitHub Actions Enabled**: GitHub Actions must be enabled for the repository.
*   **Required Secrets Configured**: The following secrets must be configured in the GitHub repository settings:
    *   `REGISTRY_USERNAME`
    *   `REGISTRY_TOKEN`
    *   `KUBE_CONFIG_DATA`
*   **Dockerfiles**: Valid `Dockerfile`s must exist in the `backend/` and `frontend/` directories.
*   **Dependency Files**: `backend/requirements.txt` and `frontend/package.json` must accurately list all project dependencies.
*   **`deploy.sh` Script**: The `deploy.sh` script must be present at the repository root and be executable, handling Docker image building, pushing, and Kubernetes deployment commands.
*   **Kubernetes Cluster**: An accessible Kubernetes cluster is required for deployment.

### 8. How Developers Should Interact with the Pipeline

Developers should follow these guidelines to interact with the CI/CD pipeline:

*   **Local Development**: Develop and test features locally, ensuring all unit and integration tests pass before committing.
*   **Branching Strategy**: Work on feature branches and create pull requests targeting `develop` or `main` (or `yoan` for specific purposes).
*   **Pull Requests**: When creating a pull request, the CI jobs (`build-and-test-backend`, `build-and-test-frontend`) will automatically run, providing feedback on code quality and test results. Address any failures before requesting a merge.
*   **Deployment to Production**: Pushing code to the `main` branch will automatically trigger the `deploy` job, initiating a production deployment. Developers should ensure that code merged into `main` is thoroughly tested and ready for production.

### 9. Suggestions for Future Improvements

*   **Staging Environment**: Introduce a dedicated staging environment for pre-production testing and validation before deploying to production.
*   **Rollback Strategy**: Implement automated rollback mechanisms in case of deployment failures or issues in production.
*   **Vulnerability Scanning**: Integrate security scanning tools (e.g., SAST, DAST, container image scanning) into the pipeline to identify and mitigate vulnerabilities early.
*   **Notifications**: Configure notifications (e.g., Slack, email) to alert the team about pipeline status (success, failure, deployment completion).
*   **Cost Optimization**: Explore strategies for optimizing CI/CD runner usage and resource consumption.
*   **Advanced Deployment Strategies**: Consider implementing advanced deployment strategies like blue/green deployments or canary releases for zero-downtime updates.
*   **GitOps Integration**: Explore GitOps tools (e.g., Argo CD, Flux CD) to manage Kubernetes deployments declaratively from Git.
*   **Test Coverage Reporting**: Integrate tools to generate and report test coverage metrics.

### 10. Relevant References

*   **GitHub Actions Documentation**: [https://docs.github.com/en/actions](https://docs.github.com/en/actions)
*   **Docker Documentation**: [https://docs.docker.com/](https://docs.docker.com/)
*   **Kubernetes Documentation**: [https://kubernetes.io/docs/](https://kubernetes.io/docs/)
*   **Python Documentation**: [https://docs.python.org/](https://docs.python.org/)
*   **React Documentation**: [https://react.dev/](https://react.dev/)
*   **NPM Documentation**: [https://docs.npmjs.com/](https://docs.npmjs.com/)
*   **Pytest Documentation**: [https://docs.pytest.org/](https://docs.pytest.org/)
*   **Flake8 Documentation**: [https://flake8.pycqa.org/](https://flake8.pycqa.org/)
*   **ESLint Documentation**: [https://eslint.org/docs/latest/](https://eslint.org/docs/latest/)
