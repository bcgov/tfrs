oc export all -o yaml -n mem-tfrs-tools > mem-tfrs-tools-project.yaml
oc get rolebindings -o yaml --export=true -n mem-tfrs-tools > mem-tfrs-tools-rolebindings.yaml
oc get serviceaccount -o yaml --export=true -n mem-tfrs-tools > mem-tfrs-tools-serviceaccount.yaml
oc get pvc -o yaml --export=true -n mem-tfrs-tools > mem-tfrs-tools-pvc.yaml
oc get configmap -o yaml --export=true  -n mem-tfrs-tools > mem-tfrs-tools-configmap.yaml
oc export configmap,rolebinding,pvc,bc,dc,service,route -o yaml --as-template=tfrs-tools -n mem-tfrs-tools > mem-tfrs-tools-template.yaml
