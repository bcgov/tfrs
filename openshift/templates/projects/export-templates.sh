oc project mem-tfrs-tools
cd mem-tfrs-tools
./export-tools-templates.sh
cd ..
oc project mem-tfrs-dev
cd mem-tfrs-dev
./export-dev-templates.sh
cd ..
oc project mem-tfrs-test
cd mem-tfrs-test
./export-test-templates.sh
cd ..
oc project mem-tfrs-prod
cd mem-tfrs-prod
./export-prod-templates.sh
cd ..