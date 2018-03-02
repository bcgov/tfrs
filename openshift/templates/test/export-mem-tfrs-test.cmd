oc export all -o yaml -n mem-tfrs-test > mem-tfrs-test-project.yaml
oc get rolebindings -o yaml --export=true -n mem-tfrs-test > mem-tfrs-test-rolebindings.yaml
oc get serviceaccount -o yaml --export=true -n mem-tfrs-test > mem-tfrs-test-serviceaccount.yaml
oc get pvc -o yaml --export=true -n mem-tfrs-test > mem-tfrs-test-pvc.yaml
oc get configmap -o yaml --export=true  -n mem-tfrs-test > mem-tfrs-test-configmap.yaml
oc export configmap,rolebinding,pvc,bc,dc,service,route -o yaml --as-template=mem-tfrs-test -n mem-tfrs-test > mem-tfrs-test-template.yaml
