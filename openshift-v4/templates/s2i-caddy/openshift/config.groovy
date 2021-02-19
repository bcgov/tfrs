app {
    name = "${opt.'name'?:'s2i-caddy'}"
    namespaces { //can't call environments :(
        'build'{
            namespace = 'bcgov-tools'
            disposable = true
        }
        'dev' {
            namespace = 'bcgov'
            disposable = true
        }
        'prod' {
            namespace = 'bcgov'
            disposable = false
        }
    }

    git {
        workDir = ['git', 'rev-parse', '--show-toplevel'].execute().text.trim()
        uri = ['git', 'config', '--get', 'remote.origin.url'].execute().text.trim()
        ref = "refs/pull/${opt.'pr'}/head"
        commit = ['git', 'rev-parse', 'HEAD'].execute().text.trim()
    }

    build {
        env {
            name = "build"
            id = "pr-${opt.'pr'}"
        }
        suffix = "-build-${opt.'pr'}"
        id = "${app.name}${app.build.suffix}"
        version = "${app.build.env.name}-v${opt.'pr'}"
        name = "${opt.'build-name'?:app.name}"

        namespace = app.namespaces.'build'.namespace
        timeoutInSeconds = 60*20 // 20 minutes
        templates = [
                [
                    'file':'openshift/s2i-caddy-bc.json',
                    'params':[
                        'NAME': app.build.name,
                        'SUFFIX': app.build.suffix,
                        'OUTPUT_IMAGE_TAG': app.build.version,
                        'GIT_REPO_URL': "${app.git.uri}",
                        'GIT_REF': "${app.git.ref}"
                    ]
                ]
        ]
    }
}