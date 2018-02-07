oc export all -o yaml -n mem-tfrs-dev > mem-tfrs-dev-project.yaml
oc get rolebindings -o yaml --export=true -n mem-tfrs-dev > mem-tfrs-dev-rolebindings.yaml
oc get serviceaccount -o yaml --export=true -n mem-tfrs-dev > mem-tfrs-dev-serviceaccount.yaml
oc get pvc -o yaml --export=true -n mem-tfrs-dev > mem-tfrs-dev-pvc.yaml
oc get configmap -o yaml --export=true  -n mem-tfrs-dev > mem-tfrs-dev-configmap.yaml
oc export configmap,rolebinding,pvc,bc,dc,service,route -o yaml --as-template=mem-tfrs-dev -n mem-tfrs-dev > mem-tfrs-dev-template.yaml
