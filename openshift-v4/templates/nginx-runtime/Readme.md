### Files included

nginx-runtime.yaml: nginx build file
Dockefile: docker build file, it is used by nginx-runtime.yaml
nginx.conf.template: the nginx fonig template 

### Build nginx image, it will be used by frontend build

oc process -f ./nginx-runtime.yaml -n 0ab226-tools
oc tag 0ab226-tools/nginx-runtime:latest 0ab226-tools/nginx-runtime:20210115